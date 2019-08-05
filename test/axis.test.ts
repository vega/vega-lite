import {AXIS_COMPONENT_PROPERTIES} from '../src/compile/axis/component';

describe('axis', () => {
  describe('VG_AXIS_PROPERTIES', () => {
    it('should have scale and orient as the first two items', () => {
      expect(AXIS_COMPONENT_PROPERTIES[0]).toBe('gridScale');
      expect(AXIS_COMPONENT_PROPERTIES[1]).toBe('scale');
      expect(AXIS_COMPONENT_PROPERTIES[2]).toBe('orient');
    });
  });
});
