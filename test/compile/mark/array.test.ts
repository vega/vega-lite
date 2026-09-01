import {array} from '../../../src/compile/mark/array.js';
import {compile} from '../../../src/compile/compile.js';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util.js';

const GRID = {values: [{width: 3, height: 2, values: [1, 2, 3, 4, 5, 6]}]};
const COLOR = {field: 'values', type: 'quantitative'} as const;

function model(spec: any) {
  return parseUnitModelWithScaleAndLayoutSize({data: GRID, mark: 'array', ...spec});
}

function formulas(spec: any, {grid = false} = {}) {
  return spec.data
    .flatMap((d: any) => d.transform ?? [])
    .filter((t: any) => t.type === 'formula' && (grid || t.as !== '__array_grid'));
}

describe('Mark: Array', () => {
  describe('encodeEntry', () => {
    it('draws the grid image across the whole view', () => {
      const props = array.encodeEntry(model({encoding: {color: COLOR}}));

      expect(array.vgMark).toBe('image');
      expect(props.image).toEqual({field: 'image'});
      expect(props.x).toEqual({value: 0});
      expect(props.y).toEqual({value: 0});
      expect(props.width).toEqual({signal: 'width'});
      expect(props.height).toEqual({signal: 'height'});
      expect(props.aspect).toEqual({value: false});
    });

    it('fits the grid inside the view when aspect is true', () => {
      const props = array.encodeEntry(model({mark: {type: 'array', aspect: true}, encoding: {color: COLOR}}));
      expect(props.aspect).toEqual({value: true});
    });

    it('positions and sizes the image from the x/x2 and y/y2 extent', () => {
      const unit = model({
        encoding: {
          x: {field: 'left', type: 'quantitative'},
          x2: {field: 'right'},
          y: {field: 'bottom', type: 'quantitative'},
          y2: {field: 'top'},
        },
      });
      const props = array.encodeEntry(unit);
      const x = unit.scaleName('x');
      const y = unit.scaleName('y');

      expect(props.x).toEqual({signal: `min(scale('${x}', datum["left"]), scale('${x}', datum["right"]))`});
      expect(props.width).toEqual({
        signal: `abs((scale('${x}', datum["right"])) - (scale('${x}', datum["left"])))`,
      });
      expect(props.y).toEqual({signal: `min(scale('${y}', datum["bottom"]), scale('${y}', datum["top"]))`});
      expect(props.height).toEqual({
        signal: `abs((scale('${y}', datum["top"])) - (scale('${y}', datum["bottom"])))`,
      });
    });

    it('covers the whole view when only one end of the extent is encoded', () => {
      const props = array.encodeEntry(model({encoding: {x: {field: 'left', type: 'quantitative'}}}));
      expect(props.x).toEqual({value: 0});
      expect(props.width).toEqual({signal: 'width'});
    });
  });

  describe('postEncodingTransform', () => {
    it('colors each cell by passing its value through the color scale', () => {
      const unit = model({encoding: {color: COLOR}});
      const [transform] = array.postEncodingTransform(unit) as any[];

      expect(transform.type).toBe('heatmap');
      expect(transform.color.expr).toBe(`scale('${unit.scaleName('color')}', datum.$value)`);
    });

    it('reads a grid of only width, height and values, so other fields cannot crop the raster', () => {
      // Vega's heatmap transform crops on x1/x2/y1/y2 taken from the grid it is given.
      const {spec} = compile({data: GRID, mark: 'array', encoding: {color: COLOR}} as any);
      const [grid] = formulas(spec, {grid: true});

      expect(grid).toEqual({
        type: 'formula',
        expr: '{width: datum.width, height: datum.height, values: datum["values"]}',
        as: '__array_grid',
      });
      expect((spec.marks[0] as any).transform[0].field).toBe('datum.__array_grid');
    });

    it('hides cells that have no value', () => {
      const [transform] = array.postEncodingTransform(model({encoding: {color: COLOR}})) as any[];
      expect(transform.opacity).toEqual({expr: 'isValid(datum.$value) ? 1 : 0'});
    });

    it('reads the grid from the color field, whatever it is called', () => {
      const {spec} = compile({
        data: {values: [{width: 3, height: 2, temperature: [1, 2, 3, 4, 5, 6]}]},
        mark: 'array',
        encoding: {color: {field: 'temperature', type: 'quantitative'}},
      } as any);
      const [grid] = formulas(spec, {grid: true});

      expect(grid.expr).toBe('{width: datum.width, height: datum.height, values: datum["temperature"]}');
    });

    it('shades by opacity alone when color is not encoded', () => {
      const [transform] = array.postEncodingTransform(model({encoding: {}})) as any[];
      expect(transform.color).toBeUndefined();
      expect(transform.opacity).toBeUndefined();
    });
  });

  describe('tooltip', () => {
    it('reports the range of the grid, which holds no single value to show', () => {
      const {spec} = compile({
        data: GRID,
        mark: {type: 'array', tooltip: true},
        encoding: {color: COLOR},
      } as any);

      expect((spec.marks[0] as any).encode.update.tooltip).toEqual({
        signal:
          '{"values": format(extent(datum["values"])[0], "") + " \u2013 " + format(extent(datum["values"])[1], "")}',
      });
    });
  });

  describe('color domain', () => {
    it('derives the domain from the grid’s own value range', () => {
      const {spec} = compile({data: GRID, mark: 'array', encoding: {color: COLOR}} as any);

      expect(formulas(spec)).toEqual([
        {type: 'formula', expr: 'extent(datum["values"])[0]', as: 'array_min_values'},
        {type: 'formula', expr: 'extent(datum["values"])[1]', as: 'array_max_values'},
      ]);
      expect((spec.scales as any)[0].domain.fields).toEqual(['array_min_values', 'array_max_values']);
    });

    it('respects an explicit domain and skips deriving one', () => {
      const {spec} = compile({
        data: GRID,
        mark: 'array',
        encoding: {color: {...COLOR, scale: {domain: [0, 100]}}},
      } as any);

      expect((spec.scales as any)[0].domain).toEqual([0, 100]);
      expect(formulas(spec)).toEqual([]);
    });

    it('leaves the domain alone when color is not a field', () => {
      const unit = model({encoding: {color: {datum: 5}}});
      const [transform] = array.postEncodingTransform(unit) as any[];

      expect(transform.color).toBeUndefined();
      const scale = assembleScalesForModel(unit).find((s: any) => s.name === unit.scaleName('color')) as any;
      expect(scale.domain).toEqual([5]);
    });
  });

  describe('axis flag', () => {
    const withAxis = {data: GRID, mark: {type: 'array', axis: true}, encoding: {color: COLOR}};

    it('labels the grid with its own extent, in cells', () => {
      const {normalized} = compile(withAxis as any) as any;

      expect(normalized.encoding.x).toEqual({field: '__array_x0', type: 'quantitative', title: null});
      expect(normalized.encoding.x2).toEqual({field: 'width'});
      expect(normalized.encoding.y).toEqual({field: '__array_y0', type: 'quantitative', title: null});
      expect(normalized.encoding.y2).toEqual({field: 'height'});
      expect(normalized.transform).toEqual([
        {calculate: '0', as: '__array_x0'},
        {calculate: '0', as: '__array_y0'},
      ]);
      expect(normalized.mark).toEqual({type: 'array'});
    });

    it('labels the grid over its extent field when set to "extent"', () => {
      const {normalized} = compile({
        data: {values: [{extent: [-180, 180, -81, 87], ...GRID.values[0]}]},
        mark: {type: 'array', axis: 'extent'},
        encoding: {color: COLOR},
      } as any) as any;

      expect(normalized.encoding.x).toEqual({field: 'extent[0]', type: 'quantitative', title: null});
      expect(normalized.encoding.x2).toEqual({field: 'extent[1]'});
      expect(normalized.encoding.y).toEqual({field: 'extent[2]', type: 'quantitative', title: null});
      expect(normalized.encoding.y2).toEqual({field: 'extent[3]'});
      expect(normalized.transform).toBeUndefined();
    });

    it('gives the x scale a domain running from zero to the grid width', () => {
      const {spec} = compile(withAxis as any);
      const x = (spec.scales as any).find((s: any) => s.name === 'x');
      expect(x.domain.fields).toEqual(['__array_x0', 'width']);
    });

    it('leaves an extent the user encoded themselves alone', () => {
      const {normalized} = compile({
        ...withAxis,
        encoding: {...withAxis.encoding, x: {field: 'left', type: 'quantitative'}, x2: {field: 'right'}},
      } as any) as any;

      expect(normalized.encoding.x).toEqual({field: 'left', type: 'quantitative'});
      expect(normalized.encoding.x2).toEqual({field: 'right'});
      expect(normalized.encoding.y).toEqual({field: '__array_y0', type: 'quantitative', title: null});
    });

    it('lets an encoding that names no data adjust the generated axis', () => {
      const {normalized} = compile({
        ...withAxis,
        encoding: {...withAxis.encoding, x: {axis: {grid: false}}},
      } as any) as any;

      expect(normalized.encoding.x).toEqual({
        field: '__array_x0',
        type: 'quantitative',
        title: null,
        axis: {grid: false},
      });
      expect(normalized.encoding.x2).toEqual({field: 'width'});
    });

    it('can be turned on for every array mark through the config', () => {
      const {normalized} = compile({
        data: GRID,
        mark: 'array',
        encoding: {color: COLOR},
        config: {array: {axis: true}},
      } as any) as any;
      expect(normalized.encoding.x2).toEqual({field: 'width'});
    });

    it('adds nothing without the flag', () => {
      const {normalized} = compile({data: GRID, mark: 'array', encoding: {color: COLOR}} as any) as any;
      expect(normalized.encoding.x).toBeUndefined();
      expect(normalized.transform).toBeUndefined();
    });
  });

  describe('scales and layout', () => {
    it('keeps position scale domains exactly as given, so the axis lines up with the raster', () => {
      const {spec} = compile({
        data: {values: [{left: 0, right: 48, bottom: 0, top: 32, ...GRID.values[0]}]},
        mark: 'array',
        encoding: {
          x: {field: 'left', type: 'quantitative'},
          x2: {field: 'right'},
          y: {field: 'bottom', type: 'quantitative'},
          y2: {field: 'top'},
        },
      } as any);

      for (const name of ['x', 'y']) {
        const scale = (spec.scales as any).find((s: any) => s.name === name);
        expect(scale.nice).toBeUndefined();
        expect(scale.zero).toBeUndefined();
      }
    });

    it('uses the continuous view size, not the discrete step, without a position encoding', () => {
      const {spec} = compile({data: GRID, mark: 'array', encoding: {color: COLOR}} as any);
      expect(spec.width).toBe(300);
      expect(spec.height).toBe(300);
    });
  });
});
