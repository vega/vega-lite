/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import {X} from '../../src/channel';
import * as legend from '../../src/compile/legend';

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = legend.title({field: 'a', legend: {title: 'Custom'}});
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = legend.title({field: 'a', legend: {}});
      assert.deepEqual(title, 'a');
    });
  });

  describe('formatMixins()', function() {
    it('should not be added for bin', function() {
      assert.deepEqual(legend.formatMixins(parseModel({
        mark: "point",
        encoding: {
          x: {field:'a', bin: true}
        }
      }), X), {});
    });
  });
});
