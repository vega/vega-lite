import {describe, expect, it} from 'vitest';
import {compile} from '../../src/compile/compile.js';
import {normalize} from '../../src/index.js';
import {ANIMATION_FRAME} from '../../src/normalize/timeencoding.js';
import {TopLevelSpec} from '../../src/spec/index.js';

const enc = {
  x: {field: 'fertility', type: 'quantitative'},
  y: {field: 'life_expect', type: 'quantitative'},
  time: {field: 'year', type: 'ordinal'},
} as any;

const paramNames = (spec: any) => (spec.params ?? []).map((p: any) => p.name);

describe('TimeEncodingNormalizer', () => {
  it('projects the elaborated parameter onto the time field', () => {
    // the `_vgsid_` default other point selections use stores a row identity,
    // which no frame filter can match
    const compiled = compile({data: {url: 'data/gapminder.json'}, mark: 'point', encoding: enc} as TopLevelSpec).spec;

    expect(compiled.signals).toEqual(
      expect.arrayContaining([{name: `${ANIMATION_FRAME}_tuple_fields`, value: [{type: 'E', field: 'year'}]}]),
    );
    expect(compiled.data.map((d) => d.name)).toContain('source_0_curr');
  });

  it('elaborates a bare time encoding into a parameter and a filter', () => {
    const normalized = normalize({data: {url: 'data/gapminder.json'}, mark: 'point', encoding: enc} as TopLevelSpec);

    expect(paramNames(normalized)).toEqual([ANIMATION_FRAME]);
    expect((normalized as any).params[0].select).toEqual({type: 'point', on: 'timer'});
    expect((normalized as any).transform).toEqual([{filter: {param: ANIMATION_FRAME}}]);
  });

  it('leaves a spec that already animates alone', () => {
    // elaboration is a default, not an override
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      mark: 'point',
      encoding: enc,
      params: [{name: 'mine', select: {type: 'point', on: 'timer'}}],
    } as TopLevelSpec);

    expect(paramNames(normalized)).toEqual(['mine']);
    expect((normalized as any).transform).toBeUndefined();
  });

  it('leaves a spec with no time encoding alone', () => {
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      mark: 'point',
      encoding: {x: {field: 'fertility', type: 'quantitative'}},
    } as TopLevelSpec);

    expect(paramNames(normalized)).toEqual([]);
  });

  it('preserves existing parameters and transforms', () => {
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      mark: 'point',
      encoding: enc,
      params: [{name: 'grid', select: 'interval'}],
      transform: [{filter: 'datum.pop > 0'}],
    } as TopLevelSpec);

    expect(paramNames(normalized)).toEqual(['grid', ANIMATION_FRAME]);
    expect((normalized as any).transform).toEqual([{filter: 'datum.pop > 0'}, {filter: {param: ANIMATION_FRAME}}]);
  });

  it('gives every animated view in a layer the same parameter', () => {
    // one name means one store and one clock, which is all the compiler has
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      encoding: enc,
      layer: [{mark: 'point'}, {mark: 'text'}],
    } as TopLevelSpec) as any;

    expect(normalized.layer.map(paramNames)).toEqual([[ANIMATION_FRAME], [ANIMATION_FRAME]]);
    for (const child of normalized.layer) {
      expect(child.transform).toEqual([{filter: {param: ANIMATION_FRAME}}]);
    }
  });

  it('gives every animated view in a concat the same parameter', () => {
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      vconcat: [
        {mark: 'point', encoding: enc},
        {mark: 'point', encoding: enc},
      ],
    } as TopLevelSpec) as any;

    expect(normalized.vconcat.map(paramNames)).toEqual([[ANIMATION_FRAME], [ANIMATION_FRAME]]);
  });

  it('only touches views that have a time encoding', () => {
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      vconcat: [
        {mark: 'point', encoding: enc},
        {mark: 'bar', encoding: {x: {field: 'cluster', type: 'nominal'}}},
      ],
    } as TopLevelSpec) as any;

    expect(normalized.vconcat.map(paramNames)).toEqual([[ANIMATION_FRAME], []]);
  });

  it('is suppressed by an animation parameter anywhere in the spec', () => {
    // the clock is shared across the whole view, so a selection in one child
    // already drives the others
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      vconcat: [
        {mark: 'point', encoding: enc, params: [{name: 'mine', select: {type: 'point', on: 'timer'}}]},
        {mark: 'point', encoding: enc},
      ],
    } as TopLevelSpec) as any;

    expect(normalized.vconcat.map(paramNames)).toEqual([['mine'], []]);
  });

  it('is suppressed by a top-level animation parameter', () => {
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      params: [{name: 'mine', select: {type: 'point', on: 'timer'}}],
      vconcat: [{mark: 'point', encoding: enc}],
    } as TopLevelSpec) as any;

    // pushed down to the unit by the top-level selection normalizer, not elaborated
    expect(normalized.vconcat.map(paramNames)).toEqual([['mine']]);
  });

  it('is not suppressed by a non-animated selection', () => {
    const normalized = normalize({
      data: {url: 'data/gapminder.json'},
      mark: 'point',
      encoding: enc,
      params: [{name: 'click', select: 'point'}],
    } as TopLevelSpec);

    expect(paramNames(normalized)).toEqual(['click', ANIMATION_FRAME]);
  });
});
