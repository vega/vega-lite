import {scaleTypeSupportProperty, SCALE_TYPES, SCALE_PROPERTIES} from '../src/scale';
import {assert} from 'chai';
import {some} from '../src/util';

describe('scale', () => {
  describe('scaleTypeSupportProperty', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all scale properties', () => {
      for (let prop of SCALE_PROPERTIES) {
        assert(some(SCALE_TYPES, (scaleType) => {
          return scaleTypeSupportProperty(scaleType, prop);
        }));
      }
    });

    // TODO: write more test blindly (Don't look at our code, just look at D3 code.)
  });
});
