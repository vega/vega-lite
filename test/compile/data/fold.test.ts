import {DataFlowNode} from './../../../src/compile/data/dataflow';
/* tslint:disable:quotemark */

import {assert} from 'chai';
import {FoldTransformNode} from '../../../src/compile/data/fold';
import {Transform} from '../../../src/transform';

describe('compile/data/fold', () => {
  it('should return a proper vg transform', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['a', 'b']
    };
    const fold = new FoldTransformNode(null, transform);
    assert.deepEqual(fold.assemble(), {
      type: 'fold',
      fields: ['a', 'b'],
      as: ['a', 'b']
    });
  });

  it('should handle missing "as" field', () => {
    const transform: Transform = {
      fold: ['a', 'b']
    };

    const fold = new FoldTransformNode(null, transform);
    assert.deepEqual(fold.assemble(), {
      type: 'fold',
      fields: ['a', 'b'],
      as: ['key', 'value']
    });
  });

  it('should handle partial "as" field', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['A'] as any
    };
    const fold = new FoldTransformNode(null, transform);
    assert.deepEqual(fold.assemble(), {
      type: 'fold',
      fields: ['a', 'b'],
      as: ['A', 'value']
    });
  });

  it('should return proper produced fields for no "as"', () => {
    const transform: Transform = {
      fold: ['a', 'b']
    };
    const fold = new FoldTransformNode(null, transform);
    assert.deepEqual(fold.producedFields(), {key: true, value: true});
  });

  it('should return proper produced fields for complete "as"', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['A', 'B']
    };
    const fold = new FoldTransformNode(null, transform);
    assert.deepEqual(fold.producedFields(), {A: true, B: true});
  });

  it('should generate the correct hash', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['A', 'B']
    };
    const fold = new FoldTransformNode(null, transform);
    assert.deepEqual(fold.hash(), 'FoldTransform {"as":["A","B"],"fold":["a","b"]}');
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new DataFlowNode(null);
      const fold = new FoldTransformNode(parent, {fold: ['a']});
      expect(fold.clone().parent).toBeNull();
    });
  });
});
