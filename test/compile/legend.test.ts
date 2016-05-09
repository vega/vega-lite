/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {X} from '../../src/channel';
import * as legend from '../../src/compile/legend';

describe('Legend', function() {
  describe('parseLegend()', function() {
    it('should output explicitly specified properties', function() {
      // FIXME test this
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = legend.title({title: 'Custom'}, {field: 'a'});
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = legend.title({}, {field: 'a'});
      assert.deepEqual(title, 'a');
    });
    
   it('should add unit to title by default', function () {
      const title = legend.title({}, {field: 'a', unit: '$'});
      assert.deepEqual(title, 'a in $');
    });
    
    it('should add unit to title by if specified as in unitPosition', function () {
      const title = legend.title({}, {field: 'a', unit: '$', unitPosition: 'title'});
      assert.deepEqual(title, 'a in $');
    });
  });

  describe('formatMixins()', function() {
    it('should not be added for bin', function() {
      assert.deepEqual(legend.formatMixins({}, parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', bin: true}
        }
      }), X), {});
    });
  });

  describe('labels()', function () {
    let modelSpec = {
      
    }
    it('should add prefix when unit is defined and unitPosition if prefix', function() {
      
    });
  });

  describe('properties.symbols', function() {
    // FIXME test
  });
});
