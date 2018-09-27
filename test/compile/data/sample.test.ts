import {DataFlowNode} from './../../../src/compile/data/dataflow';
/* tslint:disable:quotemark */

import {assert} from 'chai';
import {SampleTransformNode} from '../../../src/compile/data/sample';
import {Transform} from '../../../src/transform';

describe('compile/data/sample', () => {
  describe('SampleTransformNode', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        sample: 500
      };
      const sample = new SampleTransformNode(null, transform);
      assert.deepEqual(sample.assemble(), {
        type: 'sample',
        size: 500
      });
    });
    it('should generate the correct hash', () => {
      const transform: Transform = {
        sample: 500
      };
      const sample = new SampleTransformNode(null, transform);
      assert.deepEqual(sample.hash(), 'SampleTransform {"sample":500}');
    });

    it('should never clone parent', () => {
      const parent = new DataFlowNode(null);
      const sample = new SampleTransformNode(parent, {
        sample: 500
      });
      expect(sample.clone().parent).toBeNull();
    });
  });
});
