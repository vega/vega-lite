import {TopLevelSpec} from '../src';
import {SelectionType} from '../src/selection';
import {brush, embedFn, hits as hitsMaster, spec, testRenderFn, tuples} from './util';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';

describe('interval selections at runtime in unit views', () => {
  let page: Page;
  let embed: (specification: TopLevelSpec) => Promise<void>;
  let testRender: (filename: string) => Promise<void>;

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage();
    embed = embedFn(page);
    testRender = testRenderFn(page, `${type}/unit`);
    await page.goto('http://0.0.0.0:8000/test-runtime/');
  });

  afterAll(async () => {
    await page.close();
  });

  const type: SelectionType = 'interval';
  const hits = hitsMaster.interval;

  it('should add extents to the store', async () => {
    for (let i = 0; i < hits.drag.length; i++) {
      await embed(spec('unit', i, {type}));
      const store = await page.evaluate(brush('drag', i));
      expect(store).toHaveLength(1);
      expect(store[0].fields).toHaveLength(2);
      expect(store[0].values).toHaveLength(2);
      expect(store[0].fields[0].channel).toBe('x');
      expect(store[0].fields[0].field).toBe('a');
      expect(store[0].fields[0].type).toBe('R');
      expect(store[0].fields[1].channel).toBe('y');
      expect(store[0].fields[1].field).toBe('b');
      expect(store[0].fields[1].type).toBe('R');
      expect(store[0].values[0]).toHaveLength(2);
      expect(store[0].values[1]).toHaveLength(2);
      await testRender(`drag_${i}`);
    }
  });

  it('should respect projections', async () => {
    await embed(spec('unit', 0, {type, encodings: ['x']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = await page.evaluate(brush('drag', i));
      expect(store).toHaveLength(1);
      expect(store[0].fields).toHaveLength(1);
      expect(store[0].values).toHaveLength(1);
      expect(store[0].fields[0].channel).toBe('x');
      expect(store[0].fields[0].field).toBe('a');
      expect(store[0].fields[0].type).toBe('R');
      expect(store[0].values[0]).toHaveLength(2);
      await testRender(`x_${i}`);
    }

    await embed(spec('unit', 1, {type, encodings: ['y']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = await page.evaluate(brush('drag', i));
      expect(store).toHaveLength(1);
      expect(store[0].fields).toHaveLength(1);
      expect(store[0].values).toHaveLength(1);
      expect(store[0].fields[0].channel).toBe('y');
      expect(store[0].fields[0].field).toBe('b');
      expect(store[0].fields[0].type).toBe('R');
      expect(store[0].values[0]).toHaveLength(2);
      await testRender(`y_${i}`);
    }
  });

  it('should clear out stored extents', async () => {
    for (let i = 0; i < hits.drag_clear.length; i++) {
      await embed(spec('unit', i, {type}));
      let store = await page.evaluate(brush('drag', i));
      expect(store).toHaveLength(1);

      store = await page.evaluate(brush('drag_clear', i));
      expect(store).toHaveLength(0);
      await testRender(`clear_${i}`);
    }
  });

  it('should brush over binned domains', async () => {
    await embed(
      spec(
        'unit',
        1,
        {type, encodings: ['y']},
        {
          x: {aggregate: 'count', type: 'quantitative'},
          y: {bin: true},
          color: {value: 'steelblue', field: null, type: null}
        }
      )
    );
    for (let i = 0; i < hits.bins.length; i++) {
      const store = await page.evaluate(brush('bins', i));
      expect(store).toHaveLength(1);
      expect(store[0].fields).toHaveLength(1);
      expect(store[0].values).toHaveLength(1);
      expect(store[0].fields[0].channel).toBe('y');
      expect(store[0].fields[0].field).toBe('b');
      expect(store[0].fields[0].type).toBe('R');
      expect(store[0].values[0]).toHaveLength(2);
      await testRender(`bins_${i}`);
    }

    const store = await page.evaluate(brush('bins_clear', 0));
    expect(store).toHaveLength(0);
  });

  it('should brush over ordinal/nominal domains', async () => {
    const xextents = [
      [2, 3, 4],
      [6, 7, 8]
    ];
    const yextents = [
      [49, 52, 53, 54, 55, 66, 67, 68, 76, 81, 87, 91],
      [17, 19, 23, 24, 27, 28, 35, 39, 43, 48]
    ];

    for (let i = 0; i < hits.drag.length; i++) {
      await embed(spec('unit', i, {type}, {x: {type: 'ordinal'}, y: {type: 'nominal'}}));
      const store = await page.evaluate(brush('drag', i));
      expect(store).toHaveLength(1);
      expect(store[0].fields).toHaveLength(2);
      expect(store[0].values).toHaveLength(2);
      expect(store[0].fields[0].channel).toBe('x');
      expect(store[0].fields[0].field).toBe('a');
      expect(store[0].fields[0].type).toBe('E');
      expect(store[0].fields[1].channel).toBe('y');
      expect(store[0].fields[1].field).toBe('b');
      expect(store[0].fields[1].type).toBe('E');
      expect(store[0].values[0]).toEqual(expect.arrayContaining(xextents[i]));
      expect(store[0].values[1]).toEqual(expect.arrayContaining(yextents[i]));
      await testRender(`ord_${i}`);
    }

    const store = await page.evaluate(brush('drag_clear', 0));
    expect(store).toHaveLength(0);
  });

  it('should brush over temporal domains', async () => {
    const values = tuples.map(d => ({...d, a: new Date(2017, d.a)}));
    const toNumber = (a: any) => a[0].values[0].map((d: any) => +d);

    await embed(spec('unit', 0, {type, encodings: ['x']}, {values, x: {type: 'temporal'}}));
    let extents = [
      [1485969714000, 1493634384000],
      [1496346498000, 1504364922000]
    ];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = toNumber(await page.evaluate(brush('drag', i)));
      expect(store).toEqual(expect.arrayContaining(extents[i]));
      await testRender(`temporal_${i}`);
    }

    let cleared = await page.evaluate(brush('drag_clear', 0));
    expect(cleared).toHaveLength(0);

    await embed(spec('unit', 1, {type, encodings: ['x']}, {values, x: {type: 'temporal', timeUnit: 'day'}}));

    extents = [
      [1325492928000, 1325664000000],
      [1325752128000, 1325837664000]
    ];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = toNumber(await page.evaluate(brush('drag', i)));
      expect(store).toEqual(expect.arrayContaining(extents[i]));
      await testRender(`dayTimeUnit_${i}`);
    }

    cleared = await page.evaluate(brush('drag_clear', 0));
    expect(cleared).toHaveLength(0);
  });

  it('should brush over log/pow scales', async () => {
    for (let i = 0; i < hits.drag.length; i++) {
      await embed(
        spec(
          'unit',
          i,
          {type},
          {
            x: {scale: {type: 'pow', exponent: 1.5}},
            y: {scale: {type: 'log'}}
          }
        )
      );
      const store = await page.evaluate(brush('drag', i));
      expect(store).toHaveLength(1);
      expect(store[0].fields).toHaveLength(2);
      expect(store[0].values).toHaveLength(2);
      expect(store[0].values[0]).toHaveLength(2);
      expect(store[0].values[1]).toHaveLength(2);
      await testRender(`logpow_${i}`);
    }
  });
});
