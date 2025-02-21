import {DensityTransformNode} from '../../../src/compile/data/density.js';
import {Transform} from '../../../src/transform.js';
import {PlaceholderDataFlowNode} from './util.js';

describe('compile/data/fold', () => {
  describe('assemble', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        density: 'v',
        groupby: ['a', 'b'],
        cumulative: false,
        counts: false,
        bandwidth: 0.5,
        extent: [0, 10],
        minsteps: 25,
        maxsteps: 200,
        as: ['x', 'y'],
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.assemble()).toEqual({
        type: 'kde',
        field: 'v',
        groupby: ['a', 'b'],
        cumulative: false,
        counts: false,
        bandwidth: 0.5,
        extent: [0, 10],
        minsteps: 25,
        maxsteps: 200,
        resolve: 'shared',
        as: ['x', 'y'],
      });
    });

    it('should handle missing "as" field', () => {
      const transform: Transform = {
        density: 'v',
      };

      const density = new DensityTransformNode(null, transform);
      expect(density.assemble()).toEqual({
        type: 'kde',
        field: 'v',
        resolve: 'shared',
        as: ['value', 'density'],
      });
    });

    it('should handle partial "as" field', () => {
      const transform: Transform = {
        density: 'v',
        as: ['A'] as any,
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.assemble()).toEqual({
        type: 'kde',
        field: 'v',
        resolve: 'shared',
        as: ['A', 'density'],
      });
    });

    it('should add resolve "independent" if we set it explicitly', () => {
      const transform: Transform = {
        density: 'v',
        groupby: ['a'],
        resolve: 'independent',
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.assemble()).toEqual({
        type: 'kde',
        groupby: ['a'],
        field: 'v',
        resolve: 'independent',
        as: ['value', 'density'],
      });
    });
  });

  describe('dependentFields', () => {
    it('should return proper dependent fields', () => {
      const transform: Transform = {
        density: 'v',
        groupby: ['f', 'g'],
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.dependentFields()).toEqual(new Set(['v', 'f', 'g']));
    });

    it('should return proper dependent fields without groupby', () => {
      const transform: Transform = {
        density: 'v',
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.dependentFields()).toEqual(new Set(['v']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields for no "as"', () => {
      const transform: Transform = {
        density: 'v',
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.producedFields()).toEqual(new Set(['value', 'density']));
    });

    it('should return proper produced fields for complete "as"', () => {
      const transform: Transform = {
        density: 'v',
        as: ['A', 'B'],
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.producedFields()).toEqual(new Set(['A', 'B']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const transform: Transform = {
        density: 'v',
        as: ['A', 'B'],
      };
      const density = new DensityTransformNode(null, transform);
      expect(density.hash()).toBe('DensityTransform {"as":["A","B"],"density":"v","resolve":"shared"}');
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const density = new DensityTransformNode(parent, {density: 'v'});
      expect(density.clone().parent).toBeNull();
    });
  });
});
