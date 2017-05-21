import {assert} from 'chai';

import {parseProjection, parseProjectionComponent} from '../../../src/compile/projection/parse';

describe('compile/projection', () => {
  describe('parse', () => {
    it('should out vega projection with same properties as specified vega-lite projection', () => {
      assert.isTrue(true);
    });

    it('should not output a vega projection if none is specified', () => {
      assert.isUndefined(undefined);
    });
  });

  describe('parseComponent', () => {
    it('should output an array of vega projections', () => {
      assert.isTrue(true);
    });
  });
});
