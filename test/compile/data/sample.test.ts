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
      assert.deepEqual(sample.hash(), 'SampleTransformNode {"sample":500}');
    });
  });
});
