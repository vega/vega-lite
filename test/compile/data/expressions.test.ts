import {getDependentFields, getDependentSignals} from '../../../src/compile/data/expressions.js';

describe('compile/data/expressions', () => {
  describe('getDependentFields', () => {
    it('calcuates right dependent fields for simple expression', () => {
      expect(getDependentFields('datum.x + datum.y')).toEqual(new Set(['x', 'y']));
    });

    it('calcuates right dependent fields for complex expression', () => {
      expect(getDependentFields('toString(datum.x) + 12')).toEqual(new Set(['x']));
    });

    it('calculates right dependent fields for nested field', () => {
      expect(getDependentFields('datum.x.y')).toEqual(new Set(['x', 'x.y']));
      expect(getDependentFields('datum["x.y"]')).toEqual(new Set(['x.y']));
    });
  });

  describe('getDependentSignals', () => {
    it('distinguishes signal references from datum fields and function names', () => {
      expect(getDependentSignals('max(frame_value, datum.frame_value, datum[field_name])')).toEqual(
        new Set(['frame_value', 'field_name']),
      );
      expect(getDependentSignals('datum["frame_value"]')).toEqual(new Set());
    });
  });
});
