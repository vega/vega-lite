/* tslint:disable:quotemark */

import {assert} from 'chai';

import * as log from '../../src/log';

import {compile} from '../../src/compile/compile';


describe('compile/compile', function() {
  it('should throw error for invalid spec', () => {
    assert.throws(() => {
      compile({} as any);
    }, Error, log.message.INVALID_SPEC);
  });

  it('should return a spec with default top-level properties, size signals, data, marks, and title', () => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "title": {"text": "test"},
      "mark": "point",
      "encoding": {}
    }).spec;

    assert.equal(spec.padding, 5);
    assert.equal(spec.autosize, 'pad');
    assert.equal(spec.width, 21);
    assert.equal(spec.height, 21);
    assert.deepEqual(spec.title, {text: 'test'});

    assert.equal(spec.data.length, 1); // just source
    assert.equal(spec.marks.length, 1); // just the root group
  });

  it('should return a spec with specified top-level properties, size signals, data and marks', () => {
    const spec = compile({
      "padding": 123,
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "mark": "point",
      "encoding": {}
    }).spec;

    assert.equal(spec.padding, 123);
    assert.equal(spec.autosize, 'pad');
    assert.equal(spec.width, 21);
    assert.equal(spec.height, 21);

    assert.equal(spec.data.length, 1); // just source.
    assert.equal(spec.marks.length, 1); // just the root group
  });

  it('should use size signal for bar chart width', () => {
    const spec = compile({
      "data": {"values": [{"a": "A","b": 28}]},
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    }).spec;

    assert.deepEqual(spec.signals, [{
      name: 'x_step',
      value: 21
    }, {
      name: 'width',
      update: `bandspace(domain('x').length, 0.1, 0.05) * x_step`
    }]);
    assert.equal(spec.height, 200);
  });

  it('should set resize to true if requested', () => {
    const spec = compile({
      "autosize": {
        "resize": true
      },
      "mark": "point",
      "encoding": {}
    }).spec;

    assert(spec.autosize.resize);
  });

  it('should set autosize to fit and containment if requested', () => {
    const spec = compile({
      "autosize": {
        "type": "fit",
        "contains": "content"
      },
      "mark": "point",
      "encoding": {}
    }).spec;

    assert.deepEqual(spec.autosize, {type: 'fit', contains: 'content'});
  });

  it('should set autosize to fit if requested', () => {
    const spec = compile({
      "autosize": "fit",
      "mark": "point",
      "encoding": {}
    }).spec;

    assert.equal(spec.autosize, "fit");
  });

  it('warn if size is data driven and autosize is fit', log.wrap((localLogger) => {
    const spec = compile({
      "data": {"values": [{"a": "A","b": 28}]},
      "mark": "bar",
      "autosize": "fit",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    }).spec;
    assert.equal(localLogger.warns[0], log.message.CANNOT_FIX_RANGE_STEP_WITH_FIT);
    assert.equal(spec.width, 200);
    assert.equal(spec.height, 200);
  }));

  it('warn if trying to fit composed spec', log.wrap((localLogger) => {
    const spec = compile({
      "data": {"values": [{"a": "A","b": 28}]},
      "autosize": "fit",
      "vconcat": [{
        "mark": "point",
        "encoding": {}
      }]
    }).spec;
    assert.equal(localLogger.warns[0], log.message.FIT_NON_SINGLE);
    assert.equal(spec.autosize, 'pad');
  }));

  it('should return title for a layered spec.', () => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "title": {"text": "test"},
      "layer": [{
        "mark": "point",
        "encoding": {}
      }]
    }).spec;
    assert.deepEqual(spec.title, {text: 'test'});
  });

  it('should return title (string) for a layered spec.', () => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "title": "test",
      "layer": [{
        "mark": "point",
        "encoding": {}
      }]
    }).spec;
    assert.deepEqual(spec.title, {text: 'test'});
  });

  it('should return title from a child of a layer spec if parent has no title.', () => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "layer": [{
        "title": {"text": "test"},
        "mark": "point",
        "encoding": {}
      }]
    }).spec;
    assert.deepEqual(spec.title, {text: 'test'});
  });

  it('should return a title for a concat spec, throw warning if anchor is set to other values than "start" and automatically set anchor to "start".', log.wrap((localLogger) => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "title": {"text": "test"},
      "hconcat": [{
        "mark": "point",
        "encoding": {}
      }],
      "config": {"title": {"anchor": "middle"}}
    }).spec;
    assert.deepEqual(spec.title, {
      text: 'test',
      anchor: 'start' // We only support anchor as start for concat
    });
    assert.equal(localLogger.warns[0], log.message.cannotSetTitleAnchor('concat'));
  }));

  it('should return a title for a concat spec, automatically set anchor to "start", and augment the title with non-mark title config (e.g., offset).', () => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "title": {"text": "test"},
      "hconcat": [{
        "mark": "point",
        "encoding": {}
      }],
      "config": {"title": {"offset": 5}}
    }).spec;
    assert.deepEqual(spec.title, {
      text: 'test',
      anchor: 'start',
      offset: 5
    });
  });

  it('should not have title if there is no title.', () => {
    const spec = compile({
      "data": {
        "values": [{"a": "A","b": 28}]
      },
      "hconcat": [{
        "mark": "point",
        "encoding": {}
      }],
      "config": {"title": {"offset": 5}}
    }).spec;
    assert.isUndefined(spec.title);
  });

  it('should use provided config.', () => {
    const spec = compile({
      mark: "point",
      encoding: {}
    }, {config: {
      background: "blue"
    }}).spec;
    assert.equal(spec.config.background, "blue");
  });

  it('should merge spec and provided config.', () => {
    const spec = compile({
      mark: "point",
      encoding: {},
      config: {
        background: "red"
      }
    }, {config: {
      background: "blue"
    }}).spec;
    assert.equal(spec.config.background, "red");
  });

  it('should return a spec with projections (implicit)', () => {
    const spec = compile({
      "mark": "geoshape",
      "data": {
        "url": "data/us-10m.json",
        "format": {
          "type": "topojson",
          "feature": "states"
        }
      },
      "encoding": {}
    }).spec;
    console.log(spec);
    assert.isDefined(spec.projections);
  });

  it('should return a spec with projections (explicit)', () => {
    const spec = compile({
      "mark": "geoshape",
      "projection": {
        "type": "albersUsa"
      },
      "data": {
        "url": "data/us-10m.json",
        "format": {
          "type": "topojson",
          "feature": "states"
        }
      },
      "encoding": {}
    }).spec;
    assert.isDefined(spec.projections);
  });
});
