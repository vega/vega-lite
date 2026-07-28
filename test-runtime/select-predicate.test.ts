import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';
import {describe, expect, it} from 'vitest';

/**
 * A predicate changes what a selection *means*, so structural tests only get us
 * so far: these drive the compiled Vega directly and check which data actually
 * end up selected.
 */

const tuples = [
  {a: 1, b: 10},
  {a: 2, b: 20},
  {a: 3, b: 30},
  {a: 4, b: 40},
  {a: 5, b: 50},
];

const spec = (predicate: any, rest: any = {}): TopLevelSpec =>
  ({
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    data: {values: tuples},
    width: 200,
    height: 200,
    params: [{name: 'p', select: {type: 'point', predicate}, ...rest}],
    transform: [{filter: {param: 'p'}}],
    mark: 'circle',
    encoding: {
      x: {field: 'a', type: 'quantitative'},
      y: {field: 'b', type: 'quantitative'},
    },
  }) as TopLevelSpec;

/** Writes a tuple into the store as though the datum had been clicked. */
async function select(view: any, values: any[]) {
  const fields = view.signal('p_tuple_fields');
  await view.signal('p_tuple', {unit: '', fields, values}).runAsync();
  return view.data('data_0').map((d: any) => d.a);
}

describe('selection predicates', () => {
  it('selects everything up to the captured value', async () => {
    const view = await embed(spec({field: 'a', lte: {expr: 'datum.a'}}), false);
    await view.runAsync();

    expect(await select(view, [3])).toEqual([1, 2, 3]);
    expect(await select(view, [1])).toEqual([1]);
    expect(await select(view, [5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('excludes the captured value with a strict comparison', async () => {
    const view = await embed(spec({field: 'a', lt: {expr: 'datum.a'}}), false);
    await view.runAsync();

    expect(await select(view, [3])).toEqual([1, 2]);
  });

  it('selects a window around the captured value', async () => {
    const view = await embed(
      spec({
        and: [
          {field: 'a', gte: {expr: 'datum.a - 1'}},
          {field: 'a', lte: {expr: 'datum.a + 1'}},
        ],
      }),
      false,
    );
    await view.runAsync();

    expect(await select(view, [2, 4])).toEqual([2, 3, 4]);
  });

  it('selects an inclusive range', async () => {
    const view = await embed(spec({field: 'a', range: [{expr: 'datum.a'}, {expr: 'datum.a + 2'}]}), false);
    await view.runAsync();

    expect(await select(view, [[2, 4]])).toEqual([2, 3, 4]);
  });

  it('compares against a different field than the one tested', async () => {
    // the predicate's field is what gets tested; the comparison value is any
    // expression, so a selection can relate two fields
    const view = await embed(spec({field: 'b', lte: {expr: 'datum.a * 10'}}), false);
    await view.runAsync();

    expect(await select(view, [30])).toEqual([1, 2, 3]);
  });

  it('starts from an initial value', async () => {
    const view = await embed(spec({field: 'a', lte: {expr: 'datum.a'}}, {value: [{a: 2}]}), false);
    await view.runAsync();

    // non-empty before any interaction
    expect(view.data('data_0').map((d: any) => d.a)).toEqual([1, 2]);
  });

  it('accumulates comparisons when toggled', async () => {
    const view = await embed(spec({field: 'a', equal: {expr: 'datum.a'}}), false);
    await view.runAsync();

    const fields = view.signal('p_tuple_fields');
    await view.signal('p_toggle', false).runAsync();
    await view.signal('p_tuple', {unit: '', fields, values: [2]}).runAsync();
    await view.signal('p_toggle', true).runAsync();
    await view.signal('p_tuple', {unit: '', fields, values: [4]}).runAsync();

    expect(view.data('data_0').map((d: any) => d.a)).toEqual([2, 4]);
  });

  it('unions overlapping comparisons rather than intersecting them', async () => {
    // two entries in the store are alternatives: a datum need satisfy only one
    const view = await embed(spec({field: 'a', lte: {expr: 'datum.a'}}), false);
    await view.runAsync();

    const fields = view.signal('p_tuple_fields');
    await view.signal('p_toggle', false).runAsync();
    await view.signal('p_tuple', {unit: '', fields, values: [2]}).runAsync();
    await view.signal('p_toggle', true).runAsync();
    await view.signal('p_tuple', {unit: '', fields, values: [4]}).runAsync();

    expect(view.data('data_0').map((d: any) => d.a)).toEqual([1, 2, 3, 4]);
  });

  it('drives a bound scale from the selected range', async () => {
    const panning = {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      data: {values: tuples},
      width: 200,
      height: 200,
      params: [
        {
          name: 'p',
          select: {type: 'point', predicate: {field: 'a', range: [{expr: 'datum.a'}, {expr: 'datum.a + 2'}]}},
          bind: 'scales',
        },
      ],
      mark: 'circle',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'quantitative'},
      },
    } as TopLevelSpec;

    const view = await embed(panning, false);
    await view.runAsync();

    const fields = view.signal('p_tuple_fields');
    await view.signal('p_tuple', {unit: '', fields, values: [[2, 4]]}).runAsync();

    expect(view.scale('x').domain()).toEqual([2, 4]);
  });
});
