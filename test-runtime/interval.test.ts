import {assert} from 'chai';
import {InlineData} from '../src/data';
import {
  brush,
  compositeTypes,
  embedFn,
  hits as hitsMaster,
  spec,
  tuples
} from './util';

describe('interval selections at runtime in unit views', function() {
  const embed = embedFn(browser);
  const hits = hitsMaster.interval;
  const type = 'interval';

  it('should add extents to the store', function() {
    embed(spec('unit', {type}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.equal(store[0].intervals[1].encoding, 'y');
      assert.equal(store[0].intervals[1].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
      assert.lengthOf(store[0].intervals[1].extent, 2);
    }
  });

  it('should respect projections', function() {
    embed(spec('unit', {type, encodings: ['x']}));
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    }

    for (let i = 0; i < hits.drag.length; i++) {
      embed(spec('unit', {type, encodings: ['y']}));
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'y');
      assert.equal(store[0].intervals[0].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    }
  });

  it('should clear out stored extents', function() {
    embed(spec('unit', {type}));
    let store = browser.execute(brush('drag', 0)).value;
    assert.lengthOf(store, 1);

    store = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(store, 0);

    store = browser.execute(brush('drag', 1)).value;
    assert.lengthOf(store, 1);
  });

  it('should brush over binned domains', function() {
    embed(spec('unit', {type}, 'cond', {x: {bin: true}, y: {bin: true}}));

    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      // length == 2 indicates a quantitative scale was inverted.
      assert.lengthOf(store[0].intervals[0].extent, 2);
      assert.lengthOf(store[0].intervals[1].extent, 2);
    }

    const store = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(store, 0);
  });

  it('should brush over ordinal/nominal domains', function() {
    embed(spec('unit', {type}, 'cond',
      {x: {type: 'ordinal'}, y: {type: 'nominal'}}));

    const xextents = [[1, 2, 3], [5, 6, 7]];
    const yextents = [[48, 49, 52, 53, 54, 55, 66, 67, 68, 76, 81, 87],
      [16, 17, 19, 23, 24, 27, 28, 35, 39, 43]];

    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      assert.sameMembers(store[0].intervals[0].extent, xextents[i]);
      assert.sameMembers(store[0].intervals[1].extent, yextents[i]);
    }

    const store = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(store, 0);
  });

  it('should brush over temporal domains', function() {
    const values = tuples.map((d) => ({...d, a: new Date(2017, d.a)}));
    const toNumber = '[0].intervals[0].extent.map((d) => +d)';

    embed(spec('unit', {type, encodings: ['x']}, 'cond', {values, x: {type: 'temporal'}}));
    let extents = [[1485733878000, 1493398548000], [1496110662000, 1504011168000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i) + toNumber).value;
      assert.sameMembers(store, extents[i]);
    }

    let cleared = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(cleared, 0);

    embed(spec('unit', {type, encodings: ['x']}, 'cond', {values, x: {type: 'temporal', timeUnit: 'day'}}));

    extents = [[1136188800000, 1136275200000], [1136448000000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i) + toNumber).value;
      assert.sameMembers(store, extents[i]);
    }

    cleared = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(cleared, 0);
  });
});
