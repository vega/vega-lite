import {assert} from 'chai';
import {InlineData} from '../src/data';
import {
  brush,
  compositeTypes,
  data,
  embed as embedFn,
  hits as hitsMaster,
  unit
} from './util';

describe('interval selections at runtime in unit views', function() {
  const embed = embedFn.bind(null, browser);
  const hits = hitsMaster.interval;

  it('should add extents to the store', function() {
    embed('unit', null, null, {sel: {type: 'interval'}});
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
    embed('unit', null, null, {sel: {type: 'interval', encodings: ['x']}});
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    }

    for (let i = 0; i < hits.drag.length; i++) {
      embed('unit', null, null, {sel: {type: 'interval', encodings: ['y']}});
      const store = browser.execute(brush('drag', i)).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'y');
      assert.equal(store[0].intervals[0].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    }
  });

  it('should clear out stored extents', function() {
    embed('unit', null, null, {sel: {type: 'interval'}});
    let store = browser.execute(brush('drag', 0)).value;
    assert.lengthOf(store, 1);

    store = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(store, 0);

    store = browser.execute(brush('drag', 1)).value;
    assert.lengthOf(store, 1);
  });

  it('should brush over binned domains', function() {
    embed('unit', null, unit({bin: true}, {bin: true}),
      {sel: {type: 'interval'}});

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
    embed('unit', null, unit({type: 'ordinal'}, {type: 'nominal'}),
      {sel: {type: 'interval'}});

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
    const values = data.map((d) => ({...d, a: new Date(2017, d.a)}));
    const drag = brush('drag', 0) + '[0].intervals[0].extent.map((d) => +d)';

    embed('unit', values, unit({type: 'temporal'}), {sel: {type: 'interval', encodings: ['x']}});
    let extents = [[1485733878000, 1493398548000], [1485733878000, 1493398548000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(drag).value;
      assert.sameMembers(store, extents[i]);
    }

    let cleared = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(cleared, 0);

    embed('unit', values, unit({type: 'temporal', timeUnit: 'day'}),
      {sel: {type: 'interval', encodings: ['x']}});

    extents = [[1136188800000, 1136275200000], [1136188800000, 1136275200000]];
    for (let i = 0; i < hits.drag.length; i++) {
      const store = browser.execute(drag).value;
      assert.sameMembers(store, extents[i]);
    }

    cleared = browser.execute(brush('drag_clear', 0)).value;
    assert.lengthOf(cleared, 0);
  });
});
