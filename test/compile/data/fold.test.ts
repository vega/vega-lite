import {FoldTransformNode} from '../../../src/compile/data/fold';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/fold', () => {
  describe('assemble', () => {
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
  });

  describe('dependentFields', () => {
    it('should return proper produced fields for no "as"', () => {
      const transform: Transform = {
        fold: ['a', 'b']
      };
      const fold = new FoldTransformNode(null, transform);
      expect(fold.dependentFields()).toEqual(new Set(['a', 'b']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields for no "as"', () => {
      const transform: Transform = {
        fold: ['a', 'b']
      };
      const fold = new FoldTransformNode(null, transform);
      expect(fold.producedFields()).toEqual(new Set(['key', 'value']));
    });

    it('should return proper produced fields for complete "as"', () => {
      const transform: Transform = {
        fold: ['a', 'b'],
        as: ['A', 'B']
      };
      const fold = new FoldTransformNode(null, transform);
      expect(fold.producedFields()).toEqual(new Set(['A', 'B']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const transform: Transform = {
        fold: ['a', 'b'],
        as: ['A', 'B']
      };
      const fold = new FoldTransformNode(null, transform);
      expect(fold.hash()).toBe('FoldTransform {"as":["A","B"],"fold":["a","b"]}');
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const fold = new FoldTransformNode(parent, {fold: ['a']});
      expect(fold.clone().parent).toBeNull();
    });
  });
});
