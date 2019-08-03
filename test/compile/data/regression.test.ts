import {RegressionTransformNode} from '../../../src/compile/data/regression';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/fold', () => {
  describe('assemble', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x',
        groupby: ['a', 'b'],
        method: 'poly',
        order: 3,
        extent: [0, 10],
        params: false,
        as: ['u', 'v']
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.assemble()).toEqual({
        type: 'regression',
        x: 'x',
        y: 'y',
        groupby: ['a', 'b'],
        method: 'poly',
        order: 3,
        extent: [0, 10],
        params: false,
        as: ['u', 'v']
      });
    });

    it('should handle missing "as" field', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x'
      };

      const regression = new RegressionTransformNode(null, transform);
      expect(regression.assemble()).toEqual({
        type: 'regression',
        x: 'x',
        y: 'y',
        as: ['x', 'y']
      });
    });

    it('should handle partial "as" field', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x',
        as: ['A'] as any
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.assemble()).toEqual({
        type: 'regression',
        x: 'x',
        y: 'y',
        as: ['A', 'y']
      });
    });
  });

  describe('dependentFields', () => {
    it('should return proper dependent fields', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x',
        groupby: ['f', 'g']
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.dependentFields()).toEqual(new Set(['x', 'y', 'f', 'g']));
    });

    it('should return proper dependent fields without groupby', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x'
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.dependentFields()).toEqual(new Set(['x', 'y']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields for no "as"', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x'
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.producedFields()).toEqual(new Set(['x', 'y']));
    });

    it('should return proper produced fields for complete "as"', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x',
        as: ['A', 'B']
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.producedFields()).toEqual(new Set(['A', 'B']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const transform: Transform = {
        regression: 'y',
        on: 'x',
        as: ['A', 'B']
      };
      const regression = new RegressionTransformNode(null, transform);
      expect(regression.hash()).toBe('RegressionTransform {"as":["A","B"],"on":"x","regression":"y"}');
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const regression = new RegressionTransformNode(parent, {regression: 'y', on: 'x'});
      expect(regression.clone().parent).toBeNull();
    });
  });
});
