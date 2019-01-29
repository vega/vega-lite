import {assert} from 'chai';
import {Page} from 'puppeteer';
import {SelectionType} from '../src/selection';
import {brush, embedFn, hits as hitsMaster, spec, testRenderFn, tuples} from './util';

declare const page: Page;

describe('interval selections at runtime in unit views', () => {
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8000/test-runtime/');
  });

  const type: SelectionType = 'interval';
  const hits = hitsMaster.interval;
  const embed = embedFn(page);
  const testRender = testRenderFn(page, `${type}/unit`);

  it('should add extents to the store', async done => {
    for (let i = 0; i < hits.drag.length; i++) {
      await embed(spec('unit', i, {type}));
      const store = await page.evaluate(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 2);
      assert.lengthOf(store[0].values, 2);
      assert.equal(store[0].fields[0].channel, 'x');
      assert.equal(store[0].fields[0].field, 'a');
      assert.equal(store[0].fields[0].type, 'R');
      assert.equal(store[0].fields[1].channel, 'y');
      assert.equal(store[0].fields[1].field, 'b');
      assert.equal(store[0].fields[1].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      assert.lengthOf(store[0].values[1], 2);
      await testRender(`drag_${i}`);
    }
    done();
  });

  it('should respect projections', async () => {
    await embed(spec('unit', 0, {type, encodings: ['x']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = await page.evaluate(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 1);
      assert.lengthOf(store[0].values, 1);
      assert.equal(store[0].fields[0].channel, 'x');
      assert.equal(store[0].fields[0].field, 'a');
      assert.equal(store[0].fields[0].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      await testRender(`x_${i}`);
    }

    await embed(spec('unit', 1, {type, encodings: ['y']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = await page.evaluate(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 1);
      assert.lengthOf(store[0].values, 1);
      assert.equal(store[0].fields[0].channel, 'y');
      assert.equal(store[0].fields[0].field, 'b');
      assert.equal(store[0].fields[0].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      await testRender(`y_${i}`);
    }
  });

  it('should clear out stored extents', async () => {
    for (let i = 0; i < hits.drag_clear.length; i++) {
      await embed(spec('unit', i, {type}));
      let store = await page.evaluate(brush('drag', i));
      assert.lengthOf(store, 1);

      store = await page.evaluate(brush('drag_clear', i));
      assert.lengthOf(store, 0);
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
          x: {aggregate: 'count', field: '*', type: 'quantitative'},
          y: {bin: true},
          color: {value: 'steelblue', field: null, type: null}
        }
      )
    );
    for (let i = 0; i < hits.bins.length; i++) {
      const store = await page.evaluate(brush('bins', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 1);
      assert.lengthOf(store[0].values, 1);
      assert.equal(store[0].fields[0].channel, 'y');
      assert.equal(store[0].fields[0].field, 'b');
      assert.equal(store[0].fields[0].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      await testRender(`bins_${i}`);
    }

    const store = await page.evaluate(brush('bins_clear', 0));
    assert.lengthOf(store, 0);
  });

  it('should brush over ordinal/nominal domains', async () => {
    const xextents = [[2, 3, 4], [6, 7, 8]];
    const yextents = [
      [48, 49, 52, 53, 54, 55, 66, 67, 68, 76, 81, 87, 91],
      [16, 17, 19, 23, 24, 27, 28, 35, 39, 43, 48]
    ];

    for (let i = 0; i < hits.drag.length; i++) {
      await embed(spec('unit', i, {type}, {x: {type: 'ordinal'}, y: {type: 'nominal'}}));
      const store = await page.evaluate(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 2);
      assert.lengthOf(store[0].values, 2);
      assert.equal(store[0].fields[0].channel, 'x');
      assert.equal(store[0].fields[0].field, 'a');
      assert.equal(store[0].fields[0].type, 'E');
      assert.equal(store[0].fields[1].channel, 'y');
      assert.equal(store[0].fields[1].field, 'b');
      assert.equal(store[0].fields[1].type, 'E');
      assert.sameMembers(store[0].values[0], xextents[i]);
      assert.sameMembers(store[0].values[1], yextents[i]);
      await testRender(`ord_${i}`);
    }

    const store = await page.evaluate(brush('drag_clear', 0));
    assert.lengthOf(store, 0);
  });

  it('should brush over temporal domains', async () => {
    const values = tuples.map(d => ({...d, a: new Date(2017, d.a)}));
    const toNumber = '[0].values[0].map((d) => +d)';

    await embed(spec('unit', 0, {type, encodings: ['x']}, {values, x: {type: 'temporal'}}));
    let extents = [[1485969714000, 1493634384000], [1496346498000, 1504364922000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = await page.evaluate(brush('drag', i) + toNumber);
      assert.sameMembers(store, extents[i]);
      await testRender(`temporal_${i}`);
    }

    let cleared = await page.evaluate(brush('drag_clear', 0));
    assert.lengthOf(cleared, 0);

    await embed(spec('unit', 1, {type, encodings: ['x']}, {values, x: {type: 'temporal', timeUnit: 'day'}}));

    extents = [[1136190528000, 1136361600000], [1136449728000, 1136535264000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = await page.evaluate(brush('drag', i) + toNumber);
      assert.sameMembers(store, extents[i]);
      await testRender(`dayTimeUnit_${i}`);
    }

    cleared = await page.evaluate(brush('drag_clear', 0));
    assert.lengthOf(cleared, 0);
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
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 2);
      assert.lengthOf(store[0].values, 2);
      assert.lengthOf(store[0].values[0], 2);
      assert.lengthOf(store[0].values[1], 2);
      await testRender(`logpow_${i}`);
    }
  });
});
