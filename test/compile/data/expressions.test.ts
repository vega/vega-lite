import {getDependentFields} from '../../../src/compile/data/expressions';

describe('compile/data/expressions', () => {
  describe('getDependentFields', () => {
    it('calcuates right dependent fields for simple expression', () => {
      expect(getDependentFields('datum.x + datum.y')).toEqual({x: true, y: true});
    });

    it('calcuates right dependent fields for compres expression', () => {
      expect(getDependentFields('toString(datum.x) + 12')).toEqual({x: true});
    });

    it('calculates right dependent fields for nested field', () => {
      expect(getDependentFields('datum.x.y')).toEqual({x: true, 'x.y': true});
      expect(getDependentFields('datum["x.y"]')).toEqual({'x.y': true});
    });
  });
});
