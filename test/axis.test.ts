import {assert} from 'chai';
import {VG_AXIS_PROPERTIES} from '../src/axis';

describe('axis', () => {
  describe('VG_AXIS_PROPERTIES', () => {
    it('should have scale and orient as the first two items', () => {
      assert.equal(VG_AXIS_PROPERTIES[0], 'gridScale');
      assert.equal(VG_AXIS_PROPERTIES[1], 'scale');
      assert.equal(VG_AXIS_PROPERTIES[2], 'orient');
    });
  });
});
