import {assert} from 'chai';

import {UnitModel} from '../../src/compile/unit';
import {ExtendedUnitSpec} from '../../src/spec';
import {X, Y} from '../../src/channel';
import {POINT} from '../../src/mark';
import {LONGITUDE, LATITUDE, QUANTITATIVE} from '../../src/type';


describe('Unit', function() {
  it('should say it is unit', function() {
    const model = new UnitModel({} as ExtendedUnitSpec, null, null);
    assert(model.isUnit());
    assert(!model.isFacet());
    assert(!model.isLayer());
  });

  describe('_initScale', function() {
    it('should not initialize the scale if has type of LONGITUDE or LATITUDE', function() {
      const model = new UnitModel({
        mark: POINT,
        encoding: {
          x: {field: 'long', type: LONGITUDE},
          y: {field: 'lat', type: LATITUDE}
        }
      } as ExtendedUnitSpec, null, null);

      assert.isUndefined(model.scale(X));
      assert.isUndefined(model.scale(Y));
    });

    it('should not have the scale if user set it explicitly', function() {
      const model = new UnitModel({
        mark: POINT,
        encoding: {
          x: {field: 'long', type: QUANTITATIVE, scale: null},
        }
      } as ExtendedUnitSpec, null, null);

      assert.isUndefined(model.scale(X));
    });
  });
});

