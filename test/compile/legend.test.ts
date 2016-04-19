/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {X} from '../../src/channel';
import * as legend from '../../src/compile/legend';

describe('Legend', function() {
  describe('parseLegend()', function() {
    it('should output explicitly specified properties', function() {
      // FIXME test this
      it('should produce a Vega axis object with correct type and scale', function() {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        });
        const def = legend.parseLegend(model, X);
        assert.isObject(def);
        assert.equal(def.title, "a");
      });
    });
  });

  describe('offset()', function () {
    it('should add explicitly specified offset', function () {
      const offset = legend.offset({offset: 10}, {field: 'a'});
      assert.deepEqual(offset, 10);
    });

    it('should return 0 by default', function () {
      const offset = legend.offset({}, {field: 'a'});
      assert.deepEqual(offset, 0);
    });
  });

  describe('orient()', function () {
    it('should add explicitly specified orient', function () {
      const orient = legend.orient({orient: "horizontal"}, {field: 'a'});
      assert.deepEqual(orient, "horizontal");
    });

    it('should return vertical by default', function () {
      const orient = legend.orient({}, {field: 'a'});
      assert.deepEqual(orient, "vertical");
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

  describe('properties.symbols', function() {
    it('should initialize if filled', function() {
      const symbol = legend.properties.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", }
          }
        }), X);
    });
  });
});
