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
    it('should return a spec with default top-level properties, size signals, data and marks', () => {
      const spec = compile({
        "data": {
          "values": [{"a": "A","b": 28}]
        },
        "mark": "point",
        "encoding": {}
      }).spec;

      assert.equal(spec.padding, 5);
      assert.deepEqual(spec.autosize, {
        type: 'pad',
        resize: true
      });
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
      assert.deepEqual(spec.autosize, {
        type: 'pad',
        resize: true
      });
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
  });
});
