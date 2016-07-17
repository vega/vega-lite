/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';

import {X} from '../../src/channel';
import {cardinalityExpr, unitSizeExpr} from '../../src/compile/layout';

describe('compile/layout', () => {
  describe('cardinalityExpr', () => {
    it('should return correct cardinality expr by default', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const expr = cardinalityExpr(model, X);
      assert.equal(expr, 'datum["distinct_a"]');
    });

    it('should return domain length if custom domain is provided', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {domain: ['a', 'b']}}
        }
      });
      const expr = cardinalityExpr(model, X);
      assert.equal(expr, '2');
    });

    it('should return complete domain of timeUnit if applicable', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const expr = cardinalityExpr(model, X);
      assert.equal(expr, '12');
    });
  });

  describe('unitSizeExpr', () => {
    it('should return correct formula for ordinal scale', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const sizeExpr = unitSizeExpr(model, X, 200);
      assert.equal(sizeExpr, '(datum["distinct_a"] + 1) * 21');
    });

    it('should return static cell size for ordinal scale with fit', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {bandSize: 'fit'}}
        }
      });

      const sizeExpr = unitSizeExpr(model, X, 200);
      assert.equal(sizeExpr, '200');
    });

    it('should return static cell size for non-ordinal scale', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });

      const sizeExpr = unitSizeExpr(model, X, 200);
      assert.equal(sizeExpr, '200');
    });

    it('should return default bandSize if axis is not mapped', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {},
        config: {scale: {bandSize: 17}}
      });
      const sizeExpr = unitSizeExpr(model, X, 200);
      assert.equal(sizeExpr, '17');
    });

    it('should return textBandWidth if axis is not mapped for X of text mark', () => {
      const model = parseUnitModel({
        mark: 'text',
        encoding: {},
        config: {scale: {textBandWidth: 91}}
      });
      const sizeExpr = unitSizeExpr(model, X, 200);
      assert.equal(sizeExpr, '91');
    });

    // TODO: top-level width / height
  });
});
