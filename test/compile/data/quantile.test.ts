import {QuantileTransformNode} from '../../../src/compile/data/quantile';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/fold', () => {
  describe('assemble', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        quantile: 'x',
        groupby: ['a', 'b'],
        step: 0.05,
        as: ['p', 'v']
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.assemble()).toEqual({
        type: 'quantile',
        field: 'x',
        groupby: ['a', 'b'],
        step: 0.05,
        as: ['p', 'v']
      });
    });

    it('should handle missing "as" field', () => {
      const transform: Transform = {
        quantile: 'x'
      };

      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.assemble()).toEqual({
        type: 'quantile',
        field: 'x',
        as: ['prob', 'value']
      });
    });

    it('should handle partial "as" field', () => {
      const transform: Transform = {
        quantile: 'x',
        as: ['A'] as any
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.assemble()).toEqual({
        type: 'quantile',
        field: 'x',
        as: ['A', 'value']
      });
    });
  });

  describe('dependentFields', () => {
    it('should return proper dependent fields', () => {
      const transform: Transform = {
        quantile: 'x',
        groupby: ['f', 'g']
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.dependentFields()).toEqual(new Set(['x', 'f', 'g']));
    });

    it('should return proper dependent fields without groupby', () => {
      const transform: Transform = {
        quantile: 'x'
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.dependentFields()).toEqual(new Set(['x']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields for no "as"', () => {
      const transform: Transform = {
        quantile: 'x'
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.producedFields()).toEqual(new Set(['prob', 'value']));
    });

    it('should return proper produced fields for complete "as"', () => {
      const transform: Transform = {
        quantile: 'x',
        as: ['A', 'B']
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.producedFields()).toEqual(new Set(['A', 'B']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const transform: Transform = {
        quantile: 'x',
        as: ['A', 'B']
      };
      const quantile = new QuantileTransformNode(null, transform);
      expect(quantile.hash()).toBe('QuantileTransform {"as":["A","B"],"quantile":"x"}');
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const quantile = new QuantileTransformNode(parent, {quantile: 'x'});
      expect(quantile.clone().parent).toBeNull();
    });
  });
});
