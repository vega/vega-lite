import {VG_AXIS_PROPERTIES} from '../src/axis';

describe('axis', () => {
  describe('VG_AXIS_PROPERTIES', () => {
    it('should have scale and orient as the first two items', () => {
      expect(VG_AXIS_PROPERTIES[0]).toBe('gridScale');
      expect(VG_AXIS_PROPERTIES[1]).toBe('scale');
      expect(VG_AXIS_PROPERTIES[2]).toBe('orient');
    });
  });
});
