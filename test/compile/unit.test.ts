import {assert} from 'chai';

import * as log from '../../src/log';
import {UnitModel} from '../../src/compile/unit';
import {X, SHAPE, DETAIL} from '../../src/channel';
import {BAR} from '../../src/mark';
import {ExtendedUnitSpec} from '../../src/spec';
import {QUANTITATIVE} from '../../src/type';
import {parseUnitModel} from '../util';

describe('UnitModel', function() {
  it('should say it is unit', function() {
    const model = new UnitModel({} as ExtendedUnitSpec, null, null);
    assert(model.isUnit());
    assert(!model.isFacet());
    assert(!model.isLayer());
  });

  describe('initEncoding', () => {
    it('should drop unsupported channel and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            shape: {field: 'a', type: 'quantitative'}
          }
        });
        assert.equal(model.encoding().shape, undefined);
        assert.equal(localLogger.warns[0], log.message.incompatibleChannel(SHAPE, BAR));
      });
    });

    it('should drop channel without field and value and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {type: 'quantitative'}
          }
        });
        assert.equal(model.encoding().x, undefined);
        assert.equal(localLogger.warns[0], log.message.emptyFieldDef({type: QUANTITATIVE}, X));
      });
    });

    it('should drop a fieldDef without field and value from the channel def list and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            detail: [
              {field: 'a', type: 'ordinal'},
              {value: 'b'},
              {type: 'quantitative'}
            ]
          }
        });
        assert.deepEqual(model.encoding().detail, [
          {field: 'a', type: 'ordinal'},
          {value: 'b'}
        ]);
        assert.equal(localLogger.warns[0], log.message.emptyFieldDef({type: QUANTITATIVE}, DETAIL));
      });
    });

  });

  describe('initSize', () => {
    it('should have width, height = provided top-level width, height', () => {
      const model = parseUnitModel({
        width: 123,
        height: 456,
        mark: 'text',
        encoding: {},
        config: {scale: {textXRangeStep: 91}}
      });

      assert.equal(model.width, 123);
      assert.equal(model.height, 456);
    });

    it('should have width = default textXRangeStep for text mark without x', () => {
      const model = parseUnitModel({
        mark: 'text',
        encoding: {},
        config: {scale: {textXRangeStep: 91}}
      });

      assert.equal(model.width, 91);
    });

    it('should have width/height = config.scale.rangeStep  for non-text mark without x,y', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {},
        config: {scale: {rangeStep: 23}}
      });

      assert.equal(model.width, 23);
      assert.equal(model.height, 23);
    });

    it('should have width/height = config.cell.width/height for non-ordinal x,y', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'}
        },
        config: {cell: {width: 123, height: 456}}
      });

      assert.equal(model.width, 123);
      assert.equal(model.height, 456);
    });

    it('should have width/height = config.cell.width/height for non-ordinal x,y', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {rangeStep: null}},
          y: {field: 'b', type: 'ordinal', scale: {rangeStep: null}}
        },
        config: {cell: {width: 123, height: 456}}
      });

      assert.equal(model.width, 123);
      assert.equal(model.height, 456);
    });

    it('should have width/height = undefined for non-ordinal x,y', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'ordinal'}
        },
        config: {cell: {width: 123, height: 456}}
      });

      assert.equal(model.width, undefined);
      assert.equal(model.height, undefined);
    });
  });
});
