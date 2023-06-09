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

    it('should handle missing "param" field', () => {
      const transform: Transform = {
        extent: 'a'
      };

      const extent = new ExtentTransformNode(null, transform);
      expect(extent.assemble()).toEqual({
        type: 'extent',
        field: 'a',
        signal: 'extent'
      });
    });
  });

  describe('dependentFields', () => {
    it('should return proper produced fields for no "param"', () => {
      const transform: Transform = {
        extent: 'a'
      };
      const extent = new ExtentTransformNode(null, transform);
      expect(extent.dependentFields()).toEqual(new Set(['a']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields for no "param"', () => {
      const transform: Transform = {
        extent: 'a'
      };
      const fold = new ExtentTransformNode(null, transform);
      expect(fold.producedFields()).toEqual(new Set(['extent']));
    });

    it('should return proper produced fields for complete "param"', () => {
      const transform: Transform = {
        extent: 'a',
        param: 'A'
      };
      const extent = new ExtentTransformNode(null, transform);
      expect(extent.producedFields()).toEqual(new Set(['A']));
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
      const extent = new ExtentTransformNode(parent, {extent: 'a'});
      expect(extent.clone().parent).toBeNull();
    });
  });
});
