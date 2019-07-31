import {SampleTransformNode} from '../../../src/compile/data/sample';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/sample', () => {
  describe('SampleTransformNode', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        sample: 500
      };
      const sample = new SampleTransformNode(null, transform);
      expect(sample.assemble()).toEqual({
        type: 'sample',
        size: 500
      });
    });
    it('should generate the correct hash', () => {
      const transform: Transform = {
        sample: 500
      };
      const sample = new SampleTransformNode(null, transform);
      expect(sample.hash()).toBe('SampleTransform {"sample":500}');
    });

    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const sample = new SampleTransformNode(parent, {
        sample: 500
      });
      expect(sample.clone().parent).toBeNull();
    });
  });
});
