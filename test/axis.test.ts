import {VG_AXIS_PROPERTIES} from '../src/axis';

describe('axis', () => {
  describe('VG_AXIS_PROPERTIES', () => {
    it('should have scale and orient as the first two items', () => {
      expect(VG_AXIS_PROPERTIES[0]).toEqual('gridScale');
      expect(VG_AXIS_PROPERTIES[1]).toEqual('scale');
      expect(VG_AXIS_PROPERTIES[2]).toEqual('orient');
    });
  });
});
