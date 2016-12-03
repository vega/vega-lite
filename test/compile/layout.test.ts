/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';


import * as log from '../../src/log';
import {X, Y} from '../../src/channel';
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
  });

  describe('unitSizeExpr', () => {
    it('should return correct formula for ordinal-point scale', () => {
      const model = parseUnitModel({
        mark: 'point', // point mark produce ordinal-point scale by default
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, 'max(datum["distinct_a"] + 2*0.5, 0) * 21');
    });

    it('should return correct formula for ordinal-band scale with custom padding', () => {
      const model = parseUnitModel({
        mark: 'rect', // rect produces ordinal-band by default
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {padding: 0.3}},
        }
      });

      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, 'max(datum["distinct_a"] - 0.3 + 2*0.3, 0) * 21');
    });

    it('should return correct formula for ordinal-band scale with custom paddingInner', () => {
      const model = parseUnitModel({
        mark: 'rect', // rect produces ordinal-band by default
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {paddingInner: 0.3}},
        }
      });

      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, 'max(datum["distinct_a"] - 0.3 + 2*0.15, 0) * 21');
    });

    it('should return static cell size for ordinal x-scale with fit', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {rangeStep: 'fit'}}
        }
      });

      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, '200');
    });


    it('should return static cell size for ordinal y-scale with fit', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          y: {field: 'a', type: 'ordinal', scale: {rangeStep: 'fit'}}
        }
      });

      const sizeExpr = unitSizeExpr(model, Y);
      assert.equal(sizeExpr, '200');
    });

    it('should return static cell size for ordinal scale with top-level width', () => {
      const model = parseUnitModel({
        width: 205,
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, '205');
    });

    it('should return static cell size for ordinal scale with top-level width even if there is numeric rangeStep', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseUnitModel({
          width: 205,
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'ordinal', scale: {rangeStep: 21}}
          }
        });

        const sizeExpr = unitSizeExpr(model, X);
        assert.equal(sizeExpr, '205');
        assert.equal(localLogger.warns[0], log.message.rangeStepOverridden(X));
      });
    });

    it('should return static cell width for non-ordinal x-scale', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });

      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, '200');
    });


    it('should return static cell size for non-ordinal y-scale', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          y: {field: 'a', type: 'quantitative'}
        }
      });

      const sizeExpr = unitSizeExpr(model, Y);
      assert.equal(sizeExpr, '200');
    });

    it('should return default rangeStep if axis is not mapped', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {},
        config: {scale: {rangeStep: 17}}
      });
      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, '17');
    });

    it('should return textXRangeStep if axis is not mapped for X of text mark', () => {
      const model = parseUnitModel({
        mark: 'text',
        encoding: {},
        config: {scale: {textXRangeStep: 91}}
      });
      const sizeExpr = unitSizeExpr(model, X);
      assert.equal(sizeExpr, '91');
    });

  });
});
