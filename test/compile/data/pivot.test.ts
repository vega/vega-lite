import {PivotTransformNode} from '../../../src/compile/data/pivot';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/pivot', () => {
  it('should return a proper vg transform', () => {
    const transform: Transform = {
      pivot: 'a',
      value: 'b',
      limit: 1,
      op: 'count',
      groupby: ['c']
    };
    const pivot = new PivotTransformNode(null, transform);
    expect(pivot.assemble()).toEqual({
      type: 'pivot',
      field: 'a',
      value: 'b',
      limit: 1,
      op: 'count',
      groupby: ['c']
    });
  });

  it('should handle missing fields', () => {
    const transform: Transform = {
      pivot: 'a',
      value: 'b'
    };

    const pivot = new PivotTransformNode(null, transform);
    expect(pivot.assemble()).toEqual({
      type: 'pivot',
      field: 'a',
      value: 'b'
    });
  });

  it('should add dimensions to the groupby attribute', () => {
    const transform: Transform = {
      pivot: 'a',
      value: 'b'
    };
    const pivot = new PivotTransformNode(null, transform);
    pivot.addDimensions(['c', 'd']);
    expect(pivot.assemble().groupby).toEqual(['c', 'd']);
  });

  it('should return undefined for produced fields', () => {
    const transform: Transform = {
      pivot: 'a',
      value: 'b'
    };
    const pivot = new PivotTransformNode(null, transform);
    expect(pivot.producedFields()).toBeUndefined();
  });

  it('should return relevant dependent fields', () => {
    const transform: Transform = {
      pivot: 'a',
      value: 'b'
    };
    const pivot = new PivotTransformNode(null, transform);
    expect(pivot.dependentFields()).toEqual(new Set(['a', 'b']));
  });

  it('should generate the correct hash', () => {
    const transform: Transform = {
      pivot: 'a',
      value: 'b'
    };
    const pivot = new PivotTransformNode(null, transform);
    expect(pivot.hash()).toBe('PivotTransform {"pivot":"a","value":"b"}');
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const pivot = new PivotTransformNode(parent, {pivot: 'a', value: 'b'});
      expect(pivot.clone().parent).toBeNull();
    });
  });
});
