import {changeset, parse, View} from 'vega';
import {OrderDatumDef} from '../../src/channeldef.js';
import {compile} from '../../src/compile/compile.js';
import {StackNode} from '../../src/compile/data/stack.js';
import {TopLevelUnitSpec} from '../../src/spec/unit.js';
import {parseUnitModelWithScale} from '../util.js';

const values = [
  {variety: 'v1', site: 'A', yield: 2},
  {variety: 'v1', site: 'B', yield: 3},
  {variety: 'v1', site: 'C', yield: 5},
  {variety: 'v1', site: 'B', yield: 7},
  {variety: 'v2', site: 'A', yield: 4},
  {variety: 'v2', site: 'B', yield: 6},
  {variety: 'v2', site: 'C', yield: 8},
];

function barSpec(order: OrderDatumDef): TopLevelUnitSpec<string> {
  return {
    data: {values},
    mark: 'bar',
    params: [{name: 'pick', select: {type: 'point', fields: ['site']}, bind: 'legend'}],
    encoding: {
      x: {aggregate: 'sum', field: 'yield', type: 'quantitative'},
      y: {field: 'variety', type: 'nominal'},
      color: {field: 'site', type: 'nominal'},
      order,
      opacity: {condition: {param: 'pick', value: 0.9}, value: 0.2},
    },
  };
}

describe('datum-based order', () => {
  const views: View[] = [];
  afterEach(() => {
    views.splice(0).forEach((view) => view.finalize());
  });

  async function run(input: TopLevelUnitSpec<string>) {
    const {spec} = compile(input);
    const view = new View(parse(spec), {renderer: 'none'});
    views.push(view);
    await view.runAsync();
    const stackData = spec.data.find((data) => data.transform?.some((t) => t.type === 'stack'));
    return {spec, view, stackData};
  }

  async function select(view: View, sites: string[]) {
    view.change(
      'pick_store',
      changeset()
        .remove(() => true)
        .insert(sites.map((site) => ({unit: '', fields: [{field: 'site', type: 'E'}], values: [site]}))),
    );
    await view.runAsync();
  }

  it('reorders aggregated stacks from a legend selection without a calculated field', async () => {
    const {spec, view, stackData} = await run(
      barSpec({
        condition: [{param: 'pick', datum: 0}],
        datum: 1,
      }),
    );
    const transforms = stackData.transform;
    expect(transforms.find((t) => t.type === 'aggregate')).toMatchObject({groupby: ['variety', 'site']});
    expect(transforms.some((t) => t.type === 'formula')).toBe(false);
    expect(spec.marks[0].encode.update.zindex).toBeUndefined();

    const data = () => view.data(stackData.name);
    expect(data()).toHaveLength(6);
    for (const site of ['B', 'C', 'A']) {
      await select(view, [site]);
      expect(
        data()
          .filter((row) => row.site === site)
          .map((row) => row.sum_yield_start),
      ).toEqual([0, 0]);
      expect(
        data().find((row) => row.site === 'B' && row.variety === 'v1').sum_yield_end -
          data().find((row) => row.site === 'B' && row.variety === 'v1').sum_yield_start,
      ).toBe(10);
    }

    await select(view, ['B', 'C']);
    for (const variety of ['v1', 'v2']) {
      const group = data().filter((row) => row.variety === variety);
      expect(group.find((row) => row.site === 'A').sum_yield_start).toBe(
        group.filter((row) => row.site !== 'A').reduce((sum, row) => sum + row.sum_yield_end - row.sum_yield_start, 0),
      );
    }
    await select(view, []);
    expect(
      data()
        .filter((row) => row.site === 'A')
        .map((row) => row.sum_yield_start),
    ).toEqual([0, 0]);
  });

  it('preserves value-based z-order and the existing stack layout', async () => {
    const input = barSpec({datum: 0});
    input.encoding.order = {condition: {param: 'pick', value: 10}, value: 0};
    const {spec, view, stackData} = await run(input);
    const positions = () => view.data(stackData.name).map((row) => row.sum_yield_start);
    const before = positions();
    await select(view, ['B']);
    expect(positions()).toEqual(before);
    expect(spec.marks[0].encode.update.zindex).toEqual([
      {test: '!length(data("pick_store")) || vlSelectionTest("pick_store", datum)', value: 10},
      {value: 0},
    ]);
  });

  it('preserves first-match precedence, empty: false, and descending order', async () => {
    const {view, stackData} = await run(
      barSpec({
        condition: [
          {param: 'pick', empty: false, datum: 2},
          {test: {field: 'site', equal: 'B'}, datum: 1},
        ],
        datum: 0,
        sort: 'descending',
      }),
    );
    const firstSite = () => view.data(stackData.name).find((row) => row.sum_yield_start === 0).site;
    expect(firstSite()).toBe('B');
    await select(view, ['C']);
    expect(firstSite()).toBe('C');
    await select(view, []);
    expect(firstSite()).toBe('B');
  });

  it('supports expression-valued datums, variable parameters, and a missing fallback', async () => {
    const input = barSpec({
      condition: {test: 'datum.site === chosen', datum: {expr: '-datum.sum_yield'}},
    });
    input.params = [{name: 'chosen', value: 'B'}];
    delete input.encoding.opacity;
    const {view, stackData} = await run(input);
    const firstSite = () => view.data(stackData.name).find((row) => row.sum_yield_start === 0).site;
    expect(firstSite()).toBe('B');
    await view.signal('chosen', 'C').runAsync();
    expect(firstSite()).toBe('C');
  });

  it('keeps tuple identity stable when an ID selection changes stack order', async () => {
    const input = barSpec({condition: {param: 'pick', empty: false, datum: 0}, datum: 1});
    input.params = [{name: 'pick', select: 'point'}];
    const {view, stackData} = await run(input);
    const selected = view.data(stackData.name).find((row) => row.site === 'C' && row.variety === 'v1');
    view.change('pick_store', changeset().insert({unit: '', _vgsid_: selected._vgsid_}));
    await view.runAsync();
    const reordered = view.data(stackData.name).find((row) => row._vgsid_ === selected._vgsid_);
    expect(reordered.site).toBe('C');
    expect(reordered.sum_yield_start).toBe(0);
  });

  it('evaluates area ordering after aggregation and imputation', async () => {
    const input: TopLevelUnitSpec<string> = {
      data: {values: values.filter((row) => row.variety !== 'v2' || row.site !== 'B')},
      mark: 'area',
      params: [{name: 'chosen', value: 'B'}],
      encoding: {
        x: {field: 'variety', type: 'ordinal'},
        y: {aggregate: 'sum', field: 'yield', type: 'quantitative'},
        color: {field: 'site', type: 'nominal'},
        order: {datum: {expr: 'datum.site === chosen ? 0 : 1'}},
      },
    };
    const {spec, view, stackData} = await run(input);
    expect(stackData.transform.findIndex((t) => t.type === 'impute')).toBeLessThan(
      stackData.transform.findIndex((t) => t.type === 'stack'),
    );
    const imputed = view.data(stackData.name).find((row) => row.variety === 'v2' && row.site === 'B');
    expect(imputed.sum_yield_start).toBe(0);
    expect(imputed.sum_yield_end).toBe(0);
    await view.signal('chosen', 'C').runAsync();
    expect(
      view
        .data(stackData.name)
        .filter((row) => row.site === 'C')
        .map((row) => row.sum_yield_start),
    ).toEqual([0, 0]);
    // Stack ordering must not replace the area's vertex ordering along x.
    expect(spec.marks[0]).toMatchObject({marks: [{sort: {field: 'x'}}]});
  });

  it('supports selections projected over encoded time units', async () => {
    const input = barSpec({condition: {param: 'pick', datum: 0}, datum: 1});
    input.data = {values: values.map((row) => ({...row, date: row.site === 'C' ? '2021-07-01' : '2020-07-01'}))};
    input.encoding.color = {field: 'date', timeUnit: 'year', type: 'ordinal'};
    input.params = [{name: 'pick', select: {type: 'point', encodings: ['color']}}];
    delete input.encoding.opacity;
    const {view, stackData} = await run(input);
    const selected = view.data(stackData.name).find((row) => new Date(row.year_date).getFullYear() === 2021);
    view.change(
      'pick_store',
      changeset().insert({
        unit: '',
        fields: [{field: 'year_date', type: 'E'}],
        values: [selected.year_date],
      }),
    );
    await view.runAsync();
    expect(
      view
        .data(stackData.name)
        .filter((row) => +row.year_date === +selected.year_date)
        .map((row) => row.sum_yield_start),
    ).toEqual([0, 0]);
  });

  it.each(['point', 'line'] as const)('sorts unstacked %s marks in the data domain', async (mark) => {
    const {view} = await run({
      data: {values: values.slice(0, 3).map((row) => ({...row, datum: 'datum'}))},
      mark,
      params: [{name: 'chosen', value: 'B'}],
      encoding: {
        x: {field: 'yield', type: 'quantitative'},
        y: {field: 'site', type: 'nominal'},
        order: {
          condition: {
            test: "datum['datum'] === 'datum' && datum.site === chosen",
            datum: {expr: "if(datum['datum'] === 'datum', 0, 2)"},
          },
          datum: 1,
        },
      },
    });
    const items = () => {
      const scenegraph = view.scenegraph() as unknown as {root: {items: {items: any[]}[]}};
      return scenegraph.root.items[0].items.find((item) => item.name === 'marks').items;
    };
    expect(items()[0].datum.site).toBe('B');
    await view.signal('chosen', 'C').runAsync();
    expect(items()[0].datum.site).toBe('C');
  });

  it('uses data tuples rather than mark items for unstacked selection predicates', async () => {
    const input = barSpec({condition: {param: 'pick', empty: false, datum: 0}, datum: 1});
    input.mark = 'point';
    const {view} = await run(input);
    await select(view, ['C']);
    const scenegraph = view.scenegraph() as unknown as {root: {items: {items: any[]}[]}};
    const items = scenegraph.root.items[0].items.find((item) => item.name === 'marks').items;
    expect(items.slice(0, 2).map((item: any) => item.datum.site)).toEqual(['C', 'C']);
  });

  it('tracks sort expression field dependencies without treating expressions as field names', () => {
    const model = parseUnitModelWithScale({
      mark: 'bar',
      encoding: {
        x: {aggregate: 'sum', field: 'yield', type: 'quantitative'},
        y: {field: 'variety', type: 'nominal'},
        color: {field: 'site', type: 'nominal'},
        order: {condition: {test: {field: 'site', equal: 'B'}, datum: {expr: 'datum.sum_yield'}}, datum: 0},
      },
    });
    expect(StackNode.makeFromEncoding(null, model).dependentFields()).toEqual(
      new Set(['sum_yield', 'variety', 'site']),
    );
  });
});
