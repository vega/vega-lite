import {assert} from 'chai';
import * as scale from '../src/scale';
import {some} from '../src/util';

describe('scale', () => {
  describe('scaleTypeSupportProperty', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all scale properties', () => {
      for (let prop of scale.SCALE_PROPERTIES) {
        assert(some(scale.SCALE_TYPES, (scaleType) => {
          return scale.scaleTypeSupportProperty(scaleType, prop);
        }));
      }
    });

    // TODO: write more test blindly (Don't look at our code, just look at D3 code.)

    assert.isFalse(scale.scaleTypeSupportProperty('bin-linear', 'zero'));
  });

  describe('scaleTypes', () => {
    it('should either hasContinuousDomain or hasDiscreteDomain', () => {
      for (let scaleType of scale.SCALE_TYPES) {
        assert(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType));
      }
    });
  });
});
