import {ExtentTransformNode} from '../../../src/compile/data/extent';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';
import {isExtent} from '../../../src/transform';

describe('compile/data/extent', () => {
  describe('isExtent', () => {
    it('should return true for a regular extent transform', () => {
      expect(isExtent({extent: 'a', param: 'A'})).toBe(true);
    });

    it('should return false for a regression transform', () => {
      expect(isExtent({regression: 'a', on: 'b', extent: [0, 10]})).toBe(false);
    });

    it('should return false for a density transform', () => {
      expect(isExtent({density: 'a', extent: [0, 10]})).toBe(false);
    });
  });

  describe('assemble', () => {
    it('should return a proper vg transform', () => {
      const transform: Transform = {
        extent: 'a',
        param: 'a_extent'
      };
      const extent = new ExtentTransformNode(null, transform);
      expect(extent.assemble()).toEqual({
        type: 'extent',
        field: 'a',
        signal: 'a_extent'
      });
    });
  });

  describe('producedFields', () => {
    it('should return empty set', () => {
      const transform: Transform = {
        extent: 'a',
        param: 'A'
      };
      const extent = new ExtentTransformNode(null, transform);
      expect(extent.producedFields()).toEqual(new Set([]));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const transform: Transform = {
        extent: 'a',
        param: 'A'
      };
      const extent = new ExtentTransformNode(null, transform);
      expect(extent.hash()).toBe('ExtentTransform {"extent":"a","param":"A"}');
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const extent = new ExtentTransformNode(parent, {extent: 'a', param: 'A'});
      expect(extent.clone().parent).toBeNull();
    });
  });
});
