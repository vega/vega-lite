import {ExtentTransformNode} from '../../../src/compile/data/extent';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/extent', () => {
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
