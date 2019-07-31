import {FlattenTransformNode} from '../../../src/compile/data/flatten';
import {Transform} from '../../../src/transform';

describe('compile/data/flatten', () => {
  describe('FlattenTransformNode', () => {
    describe('assemble', () => {
      it('should return a proper vg transform', () => {
        const transform: Transform = {
          flatten: ['a', 'b'],
          as: ['a', 'b']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.assemble()).toEqual({
          type: 'flatten',
          fields: ['a', 'b'],
          as: ['a', 'b']
        });
      });

      it('should handle missing "as" field', () => {
        const transform: Transform = {
          flatten: ['a', 'b']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.assemble()).toEqual({
          type: 'flatten',
          fields: ['a', 'b'],
          as: ['a', 'b']
        });
      });

      it('should handle partial "as" field', () => {
        const transform: Transform = {
          flatten: ['a', 'b'],
          as: ['A']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.assemble()).toEqual({
          type: 'flatten',
          fields: ['a', 'b'],
          as: ['A', 'b']
        });
      });
    });

    describe('dependentFields', () => {
      it('should return proper produced fields', () => {
        const transform: Transform = {
          flatten: ['a', 'b']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.dependentFields()).toEqual(new Set(['a', 'b']));
      });
    });

    describe('producedFields', () => {
      it('should return proper produced fields', () => {
        const transform: Transform = {
          flatten: ['a', 'b']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.producedFields()).toEqual(new Set(['a', 'b']));
      });

      it('should return proper produced fields with as', () => {
        const transform: Transform = {
          flatten: ['a', 'b'],
          as: ['foo', 'bar']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.producedFields()).toEqual(new Set(['foo', 'bar']));
      });
    });

    describe('hash', () => {
      it('should generate the correct hash', () => {
        const transform: Transform = {
          flatten: ['a', 'b']
        };
        const flatten = new FlattenTransformNode(null, transform);
        expect(flatten.hash()).toBe('FlattenTransform {"as":["a","b"],"flatten":["a","b"]}');
      });
    });
  });
});
