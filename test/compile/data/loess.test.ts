import {LoessTransformNode} from '../../../src/compile/data/loess';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/fold', () => {
  describe('assemble', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x',
        groupby: ['a', 'b'],
        bandwidth: 0.3,
        as: ['u', 'v']
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.assemble()).toEqual({
        type: 'loess',
        x: 'x',
        y: 'y',
        groupby: ['a', 'b'],
        bandwidth: 0.3,
        as: ['u', 'v']
      });
    });

    it('should handle missing "as" field', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x'
      };

      const loess = new LoessTransformNode(null, transform);
      expect(loess.assemble()).toEqual({
        type: 'loess',
        x: 'x',
        y: 'y',
        as: ['x', 'y']
      });
    });

    it('should handle partial "as" field', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x',
        as: ['A'] as any
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.assemble()).toEqual({
        type: 'loess',
        x: 'x',
        y: 'y',
        as: ['A', 'y']
      });
    });
  });

  describe('dependentFields', () => {
    it('should return proper dependent fields', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x',
        groupby: ['f', 'g']
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.dependentFields()).toEqual(new Set(['x', 'y', 'f', 'g']));
    });

    it('should return proper dependent fields without groupby', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x'
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.dependentFields()).toEqual(new Set(['x', 'y']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields for no "as"', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x'
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.producedFields()).toEqual(new Set(['x', 'y']));
    });

    it('should return proper produced fields for complete "as"', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x',
        as: ['A', 'B']
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.producedFields()).toEqual(new Set(['A', 'B']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const transform: Transform = {
        loess: 'y',
        on: 'x',
        as: ['A', 'B']
      };
      const loess = new LoessTransformNode(null, transform);
      expect(loess.hash()).toBe('LoessTransform {"as":["A","B"],"loess":"y","on":"x"}');
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const loess = new LoessTransformNode(parent, {loess: 'y', on: 'x'});
      expect(loess.clone().parent).toBeNull();
    });
  });
});
