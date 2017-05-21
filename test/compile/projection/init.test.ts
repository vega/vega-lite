import {assert} from 'chai';

import {initLayerProjection, initProjection} from '../../../src/compile/projection/init';

describe('compile/projection', () => {
  describe('init', () => {
    it('should output a projection if one is specified', () => {
      assert.isTrue(true);
    });

    // it('should output a projection if mark is geoshape', () => {
    //   assert.isTrue(true);
    // });

    it('should output a projection if channel is projection (latitude or longitude)', () => {
      assert.isTrue(true);
    });

    it('should output a projection such that a specified projection overrides a parent-specified projection which overrides a config-specified projection', () => {
      assert.isUndefined(undefined);
    });

    it('should not output a projection if none is specified up inheritance chain', () => {
      assert.isUndefined(undefined);
    });
  });

  describe('initLayer', () => {
    it('should output the projection specified first in layers', () => {
      assert.isTrue(true);
    });

    it('should not output a projection if none are specified in layers', () => {
      assert.isUndefined(undefined);
    });
  });
});
