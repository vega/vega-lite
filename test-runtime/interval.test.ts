/// <reference types="webdriverio"/>

import {assert} from 'chai';
import {brush, embedFn, hits as hitsMaster, spec, testRenderFn, tuples} from './util';

describe('interval selections at runtime in unit views', () => {
  const type = 'interval';
  const hits = hitsMaster.interval;
  const embed = embedFn(browser);
  const testRender = testRenderFn(browser, `${type}/unit`);

  it('should add extents to the store', () => {
    for (let i = 0; i < hits.drag.length; i++) {
      embed(spec('unit', i, {type}));
      const store = browser.execute(brush('drag', i));
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
      testRender(`drag_${i}`);
    }
  });

  it('should respect projections', () => {
    embed(spec('unit', 0, {type, encodings: ['x']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 1);
      assert.lengthOf(store[0].values, 1);
      assert.equal(store[0].fields[0].channel, 'x');
      assert.equal(store[0].fields[0].field, 'a');
      assert.equal(store[0].fields[0].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      testRender(`x_${i}`);
    }

    embed(spec('unit', 1, {type, encodings: ['y']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 1);
      assert.lengthOf(store[0].values, 1);
      assert.equal(store[0].fields[0].channel, 'y');
      assert.equal(store[0].fields[0].field, 'b');
      assert.equal(store[0].fields[0].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      testRender(`y_${i}`);
    }
  });

  it('should clear out stored extents', () => {
    for (let i = 0; i < hits.drag_clear.length; i++) {
      embed(spec('unit', i, {type}));
      let store = browser.execute(brush('drag', i));
      assert.lengthOf(store, 1);

      store = browser.execute(brush('drag_clear', i));
      assert.lengthOf(store, 0);
      testRender(`clear_${i}`);
    }
  });

  it('should brush over binned domains', () => {
    embed(
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
      const store = browser.execute(brush('bins', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 1);
      assert.lengthOf(store[0].values, 1);
      assert.equal(store[0].fields[0].channel, 'y');
      assert.equal(store[0].fields[0].field, 'b');
      assert.equal(store[0].fields[0].type, 'R');
      assert.lengthOf(store[0].values[0], 2);
      testRender(`bins_${i}`);
    }

    const store = browser.execute(brush('bins_clear', 0));
    assert.lengthOf(store, 0);
  });

  it('should brush over ordinal/nominal domains', () => {
    const xextents = [[2, 3, 4], [6, 7, 8]];
    const yextents = [
      [48, 49, 52, 53, 54, 55, 66, 67, 68, 76, 81, 87, 91],
      [16, 17, 19, 23, 24, 27, 28, 35, 39, 43, 48]
    ];

    for (let i = 0; i < hits.drag.length; i++) {
      embed(spec('unit', i, {type}, {x: {type: 'ordinal'}, y: {type: 'nominal'}}));
      const store = browser.execute(brush('drag', i));
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
      testRender(`ord_${i}`);
    }

    const store = browser.execute(brush('drag_clear', 0));
    assert.lengthOf(store, 0);
  });

  it('should brush over temporal domains', () => {
    const values = tuples.map(d => ({...d, a: new Date(2017, d.a)}));
    const toNumber = '[0].values[0].map((d) => +d)';

    embed(spec('unit', 0, {type, encodings: ['x']}, {values, x: {type: 'temporal'}}));
    let extents = [[1485969714000, 1493634384000], [1496346498000, 1504364922000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute<number[]>(brush('drag', i) + toNumber);
      assert.sameMembers(store, extents[i]);
      testRender(`temporal_${i}`);
    }

    let cleared = browser.execute(brush('drag_clear', 0));
    assert.lengthOf(cleared, 0);

    embed(spec('unit', 1, {type, encodings: ['x']}, {values, x: {type: 'temporal', timeUnit: 'day'}}));

    extents = [[1136190528000, 1136361600000], [1136449728000, 1136535264000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute<number[]>(brush('drag', i) + toNumber);
      assert.sameMembers(store, extents[i]);
      testRender(`dayTimeUnit_${i}`);
    }

    cleared = browser.execute(brush('drag_clear', 0));
    assert.lengthOf(cleared, 0);
  });

  it('should brush over log/pow scales', () => {
    for (let i = 0; i < hits.drag.length; i++) {
      embed(
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
      const store = browser.execute(brush('drag', i));
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 2);
      assert.lengthOf(store[0].values, 2);
      assert.lengthOf(store[0].values[0], 2);
      assert.lengthOf(store[0].values[1], 2);
      testRender(`logpow_${i}`);
    }
  });
});
