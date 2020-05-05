import {SampleTransformNode} from '../../../src/compile/data/sample';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

const transform: Transform = {
  sample: 500
};

describe('compile/data/sample', () => {
  describe('SampleTransformNode', () => {
    it('should return a proper vg transform', () => {
      const sample = new SampleTransformNode(null, transform);
      expect(sample.assemble()).toEqual({
        type: 'sample',
        size: 500
      });
    });

    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const sample = new SampleTransformNode(parent, transform);
      expect(sample.clone().parent).toBeNull();
    });

    describe('producedFields', () => {
      it('should generate the correct hash', () => {
        const sample = new SampleTransformNode(null, transform);
        expect(sample.hash()).toBe('SampleTransform {"sample":500}');
      });

      it('should produce different hashes for different samples', () => {
        const sample1 = new SampleTransformNode(null, {sample: 42});
        const sample2 = new SampleTransformNode(null, {sample: 123});
        expect(sample1.hash()).not.toBe(sample2.hash());
      });

      it('should return empty set', () => {
        const sample = new SampleTransformNode(null, transform);
        expect(sample.producedFields()).toEqual(new Set());
      });
    });

    describe('dependentFields', () => {
      it('should return empty set', () => {
        const sample = new SampleTransformNode(null, transform);
        expect(sample.dependentFields()).toEqual(new Set());
      });
    });
  });
});
