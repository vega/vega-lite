import {array} from '../../../src/compile/mark/array.js';
import {compile} from '../../../src/compile/compile.js';
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
      expect((transform[0] as any).color.expr).toBe(`scale('${scaleName}', datum.$value)`);
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

  describe('encodeEntry with x/x2/y/y2 (axis/extent support)', () => {
    it('positions and sizes the image from the scaled x/x2 and y/y2 extent when both are field-encoded', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: [{x1_: -180, x2_: 180, y1_: -81, y2_: 87, width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]},
        mark: 'array',
        encoding: {
          x: {field: 'x1_', type: 'quantitative'},
          x2: {field: 'x2_'},
          y: {field: 'y1_', type: 'quantitative'},
          y2: {field: 'y2_'},
        },
      });
      const props = array.encodeEntry(model);
      const xScale = model.scaleName('x');
      const yScale = model.scaleName('y');

      expect(props.x).toEqual({
        signal: `min(scale('${xScale}', datum["x1_"]), scale('${xScale}', datum["x2_"]))`,
      });
      expect(props.width).toEqual({
        signal: `abs((scale('${xScale}', datum["x2_"])) - (scale('${xScale}', datum["x1_"])))`,
      });
      expect(props.y).toEqual({
        signal: `min(scale('${yScale}', datum["y1_"]), scale('${yScale}', datum["y2_"]))`,
      });
      expect(props.height).toEqual({
        signal: `abs((scale('${yScale}', datum["y2_"])) - (scale('${yScale}', datum["y1_"])))`,
      });
    });

    it('falls back to filling the view when only one of x/x2 (or y/y2) is encoded', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: [{x1_: 0, width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]},
        mark: 'array',
        encoding: {x: {field: 'x1_', type: 'quantitative'}},
      });
      const props = array.encodeEntry(model);
      expect(props.x).toEqual({value: 0});
      expect(props.width).toHaveProperty('signal');
      expect(props.y).toEqual({value: 0});
      expect(props.height).toHaveProperty('signal');
    });
  });

  describe('default view size', () => {
    it('uses the continuous view size, not the 20px discrete step, without position encodings', () => {
      const {spec} = compile({
        data: {values: [{width: 48, height: 32, values: [1, 2, 3, 4, 5, 6]}]},
        mark: 'array',
        encoding: {color: {field: 'values', type: 'quantitative'}},
      } as any);
      expect(spec.width).toBe(300);
      expect(spec.height).toBe(300);
    });
  });

  describe('real-domain color from the grid’s derived extent', () => {
    const gridData = {values: [{width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]};

    it('takes the domain from the derived min/max fields and uses raw $value', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: gridData,
        mark: 'array',
        encoding: {color: {field: 'values', type: 'quantitative'}},
      });
      const scaleName = model.scaleName('color');

      const transform = array.postEncodingTransform(model);
      expect((transform[0] as any).color.expr).toBe(`scale('${scaleName}', datum.$value)`);

      const colorScale = assembleScalesForModel(model).find((s: any) => s.name === scaleName) as any;
      expect(colorScale.domain.fields).toEqual(['array_min_values', 'array_max_values']);
    });

    it('emits formula transforms computing the real extent, guarded for non-array fields', () => {
      const {spec} = compile({
        data: gridData,
        mark: 'array',
        encoding: {color: {field: 'values', type: 'quantitative'}},
      } as any);
      const formulas = spec.data.flatMap((d: any) => d.transform ?? []).filter((t: any) => t.type === 'formula');

      expect(formulas).toEqual([
        {
          type: 'formula',
          expr: 'isArray(datum["values"]) ? extent(datum["values"])[0] : datum["values"]',
          as: 'array_min_values',
        },
        {
          type: 'formula',
          expr: 'isArray(datum["values"]) ? extent(datum["values"])[1] : datum["values"]',
          as: 'array_max_values',
        },
      ]);
    });

    it('respects an explicit domain, keeping raw values rather than reverting to normalized ones', () => {
      const {spec} = compile({
        data: gridData,
        mark: 'array',
        encoding: {color: {field: 'values', type: 'quantitative', scale: {domain: [0, 100]}}},
      } as any);

      expect((spec.scales as any)[0].domain).toEqual([0, 100]);
      // no point deriving an extent that the explicit domain would override
      expect(spec.data.flatMap((d: any) => d.transform ?? []).filter((t: any) => t.type === 'formula')).toEqual([]);
      expect((spec.marks[0] as any).transform[0].color.expr).toBe(`scale('color', datum.$value)`);
    });

    it('falls back to normalizing against [0, 1] when color has no field to take an extent of', () => {
      // Regression: the ordinary field-extent path over a raster field yields
      // [Infinity, -Infinity] and a scale that throws at render time
      // ("TypeError: I[i] is not a function") rather than merely looking wrong.
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: gridData,
        mark: 'array',
        encoding: {color: {datum: 5}},
      });
      const scaleName = model.scaleName('color');

      const transform = array.postEncodingTransform(model);
      expect((transform[0] as any).color.expr).toBe(`scale('${scaleName}', datum.$value / datum.$max)`);

      const colorScale = assembleScalesForModel(model).find((s: any) => s.name === scaleName) as any;
      expect(colorScale.domain).toEqual([0, 1]);
    });
  });
});
