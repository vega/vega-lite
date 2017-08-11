/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';

import * as log from '../../src/log';

import {compile} from '../../src/compile/compile';


describe('Compile', function() {
  it('should throw error for invalid spec', () => {
    assert.throws(() => {
      compile({} as any);
    }, Error, log.message.INVALID_SPEC);
  });

  describe('compile', () => {
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
      assert.deepEqual(spec.signals, [
        {
          name: 'width',
          update: "21"
        },
        {
          name: 'height',
          update: "21"
        }
      ]);
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
      assert.deepEqual(spec.signals, [
        {
          name: 'width',
          update: "21"
        },
        {
          name: 'height',
          update: "21"
        }
      ]);

      assert.equal(spec.data.length, 1); // just source.
      assert.equal(spec.marks.length, 1); // just the root group
    });

    it('should set resize to true if requested', () => {
      const spec = compile({
        "autoResize": true,
        "mark": "point",
        "encoding": {}
      }).spec;

      assert(spec.autosize.resize);
    });

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

    it('should return a title for a concat spec and augment the title with non-mark title config (e.g., anchor).', () => {
      const spec = compile({
        "data": {
          "values": [{"a": "A","b": 28}]
        },
        "title": {"text": "test"},
        "hconcat": [{
          "mark": "point",
          "encoding": {}
        }],
        "config": {"title": {"anchor": "start"}}
      }).spec;
      assert.deepEqual(spec.title, {text: 'test', anchor: 'start'});
    });
  });
});
