/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

import {X, Y} from '../../../src/channel';
import {unitSizeExpr} from '../../../src/compile/layout/assemble';
import * as log from '../../../src/log';

describe('compile/layout', () => {
  describe('unitSizeExpr', () => {
    it('should return correct formula for ordinal-point scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point', // point mark produce ordinal-point scale by default
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, 'bandspace(domain(\'x\').length, 1, 0.5) * 21');
    });

    it('should return correct formula for ordinal-band scale with custom padding', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rect', // rect produces ordinal-band by default
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {padding: 0.3}},
        }
      });

      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, 'bandspace(domain(\'x\').length, 0.3, 0.3) * 21');
    });

    it('should return correct formula for ordinal-band scale with custom paddingInner', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rect', // rect produces ordinal-band by default
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {paddingInner: 0.3}},
        }
      });

      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, 'bandspace(domain(\'x\').length, 0.3, 0.15) * 21');
    });

    it('should return static cell size for ordinal x-scale with null', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {rangeStep: null}}
        }
      });

      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, '200');
    });


    it('should return static cell size for ordinal y-scale with null', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          y: {field: 'a', type: 'ordinal', scale: {rangeStep: null}}
        }
      });

      const sizeExpr = unitSizeExpr(model, 'height');
      assert.equal(sizeExpr, '200');
    });

    it('should return static cell size for ordinal scale with top-level width', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        width: 205,
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, '205');
    });

    it('should return static cell size for ordinal scale with top-level width even if there is numeric rangeStep', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          width: 205,
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'ordinal', scale: {rangeStep: 21}}
          }
        });

        const sizeExpr = unitSizeExpr(model, 'width');
        assert.equal(sizeExpr, '205');
        assert.equal(localLogger.warns[0], log.message.rangeStepDropped(X));
      });
    });

    it('should return static cell width for non-ordinal x-scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });

      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, '200');
    });


    it('should return static cell size for non-ordinal y-scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          y: {field: 'a', type: 'quantitative'}
        }
      });

      const sizeExpr = unitSizeExpr(model, 'height');
      assert.equal(sizeExpr, '200');
    });

    it('should return default rangeStep if axis is not mapped', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {},
        config: {scale: {rangeStep: 17}}
      });
      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, '17');
    });

    it('should return textXRangeStep if axis is not mapped for X of text mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'text',
        encoding: {},
        config: {scale: {textXRangeStep: 91}}
      });
      const sizeExpr = unitSizeExpr(model, 'width');
      assert.equal(sizeExpr, '91');
    });

  });
});
