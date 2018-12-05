/* tslint:disable:quotemark */

import {FoldTransformNode} from '../../../src/compile/data/fold';
import {Transform} from '../../../src/transform';
import {DataFlowNode} from './../../../src/compile/data/dataflow';

describe('compile/data/fold', () => {
  it('should return a proper vg transform', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['a', 'b']
    };
    const fold = new FoldTransformNode(null, transform);
    expect(fold.assemble()).toEqual({
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
    expect(fold.assemble()).toEqual({
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
    expect(fold.assemble()).toEqual({
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
    expect(fold.producedFields()).toEqual({key: true, value: true});
  });

  it('should return proper produced fields for complete "as"', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['A', 'B']
    };
    const fold = new FoldTransformNode(null, transform);
    expect(fold.producedFields()).toEqual({A: true, B: true});
  });

  it('should generate the correct hash', () => {
    const transform: Transform = {
      fold: ['a', 'b'],
      as: ['A', 'B']
    };
    const fold = new FoldTransformNode(null, transform);
    expect(fold.hash()).toEqual('FoldTransform {"as":["A","B"],"fold":["a","b"]}');
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new DataFlowNode(null);
      const fold = new FoldTransformNode(parent, {fold: ['a']});
      expect(fold.clone().parent).toBeNull();
    });
  });
});
