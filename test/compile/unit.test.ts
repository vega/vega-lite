import {assert} from 'chai';

import {UnitModel} from '../../src/compile/unit';
import {ExtendedUnitSpec} from '../../src/spec';
import {parseUnitModel} from '../util';

describe('Unit', function() {
  it('should say it is unit', function() {
    const model = new UnitModel({} as ExtendedUnitSpec, null, null);
    assert(model.isUnit());
    assert(!model.isFacet());
    assert(!model.isLayer());
  });

  describe('initSize', () => {
    it('should have width, height = provided top-level width, height', () => {
      const model = parseUnitModel({
        width: 123,
        height: 456,
        mark: 'text',
        encoding: {},
        config: {scale: {textBandWidth: 91}}
      });

      assert.equal(model.width, 123);
      assert.equal(model.height, 456);
    });

    it('should have width = default textBandWidth for text mark without x', () => {
      const model = parseUnitModel({
        mark: 'text',
        encoding: {},
        config: {scale: {textBandWidth: 91}}
      });

      assert.equal(model.width, 91);
    });

    it('should have width/height = config.scalebandSize for non-text mark without x,y', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {},
        config: {scale: {bandSize: 23}}
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
          x: {field: 'a', type: 'ordinal', scale: {bandSize: 'fit'}},
          y: {field: 'b', type: 'ordinal', scale: {bandSize: 'fit'}}
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
