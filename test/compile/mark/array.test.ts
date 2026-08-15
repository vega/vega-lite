import {array} from '../../../src/compile/mark/array.js';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util.js';

describe('Mark: Array', () => {
  describe('encodeEntry', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: [{width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]},
      mark: 'array',
      encoding: {color: {field: 'values', type: 'quantitative'}},
    });
    const props = array.encodeEntry(model);

    it('renders as an image mark at the origin', () => {
      expect(props.x).toEqual({value: 0});
      expect(props.y).toEqual({value: 0});
      expect(props.image).toEqual({field: 'image'});
      expect(props.aspect).toEqual({value: false});
    });

    it('sizes from the view size signal', () => {
      expect(props.width).toHaveProperty('signal');
      expect(props.height).toHaveProperty('signal');
    });
  });

  describe('postEncodingTransform', () => {
    it('emits a heatmap transform referencing $value, and the name matches an assembled scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: [{width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]},
        mark: 'array',
        encoding: {color: {field: 'values', type: 'quantitative'}},
      });
      const transform = array.postEncodingTransform(model);
      expect(transform).toHaveLength(1);
      expect(transform[0].type).toBe('heatmap');
      const scaleName = model.scaleName('color');
      expect((transform[0] as any).color.expr).toBe(`scale('${scaleName}', datum.$value / datum.$max)`);
      expect((transform[0] as any).opacity).toBe(1);

      const scales = assembleScalesForModel(model);
      expect(scales.some((s: any) => s.name === scaleName)).toBe(true);
    });

    it('omits color and opacity when there is no color encoding, letting Heatmap default to its own opacity gradient', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: [{width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]},
        mark: 'array',
        encoding: {},
      });
      const transform = array.postEncodingTransform(model);
      expect((transform[0] as any).color).toBeUndefined();
      expect((transform[0] as any).opacity).toBeUndefined();
    });
  });
});
