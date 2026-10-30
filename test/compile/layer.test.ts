import {parse} from 'vega';
import {compile} from '../../src/compile/compile.js';
import {TopLevelSpec} from '../../src/index.js';
import {parseLayerModel} from '../util.js';

describe('Layer', () => {
  describe('parseScale', () => {
    it('should merge domains', () => {
      const model = parseLayerModel({
        layer: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'},
            },
          },
          {
            mark: 'point',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
            },
          },
        ],
      });
      expect(model.children).toHaveLength(2);
      model.parseScale();

      expect(model.component.scales['x'].get('domains')).toEqual([
        {
          data: 'layer_0_main',
          field: 'a',
          sort: true,
        },
        {
          data: 'layer_1_main',
          field: 'b',
          sort: true,
        },
      ]);
    });

    it('should use explicit domains if specified', () => {
      const model = parseLayerModel({
        layer: [
          {
            mark: 'point',
            encoding: {
              x: {scale: {domain: [1, 2, 3]}, field: 'b', type: 'ordinal'},
            },
          },
          {
            mark: 'point',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
            },
          },
        ],
      });
      model.parseScale();

      expect(model.component.scales['x'].get('domains')).toEqual([[1, 2, 3]]);
    });
  });

  describe('dual axis chart', () => {
    const model = parseLayerModel({
      layer: [
        {
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'quantitative'},
          },
        },
        {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
          },
        },
      ],
      resolve: {
        scale: {
          x: 'independent',
        },
      },
    });

    it('should have two children', () => {
      expect(model.children).toHaveLength(2);
    });

    it('should leave scales in children when set to be independent', () => {
      model.parseScale();

      expect(model.component.scales['x']).toBeUndefined();
      expect(model.children[0].component.scales['x'].get('domains')).toEqual([
        {
          data: 'layer_0_main',
          field: 'a',
        },
      ]);
      expect(model.children[1].component.scales['x'].get('domains')).toEqual([
        {
          data: 'layer_1_main',
          field: 'b',
        },
      ]);
    });

    it('should create second axis on top', () => {
      model.parseAxesAndHeaders();

      expect(model.component.axes['x']).toHaveLength(2);
      expect(model.component.axes['x'][1].implicit.orient).toBe('top');
    });
  });

  describe('assembleSignals', () => {
    // A parameter declared on a layer is pushed into each of its children, so
    // every child assembles the same selection signals for it.
    const layeredSelection = {
      data: {url: 'data/cars.json'},
      params: [{name: 'sel', select: {type: 'point', fields: ['Origin']}}],
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      },
      layer: [{mark: 'point'}, {mark: {type: 'text', dy: -10}, encoding: {text: {field: 'Origin'}}}],
    } as TopLevelSpec;

    it('should not emit duplicate signals for a layer-level selection', () => {
      const names = compile(layeredSelection).spec.signals.map((s) => s.name);
      expect(names).toHaveLength(new Set(names).size);
    });

    it('should produce a parseable spec for a layer-level selection', () => {
      expect(() => parse(compile(layeredSelection).spec)).not.toThrow();
    });

    it('should keep signals that only one child defines', () => {
      const names = compile({
        data: {url: 'data/cars.json'},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        },
        layer: [
          {mark: 'point', params: [{name: 'first', select: 'point'}]},
          {mark: 'point', params: [{name: 'second', select: 'interval'}]},
        ],
      } as TopLevelSpec).spec.signals.map((s) => s.name);

      expect(names).toEqual(expect.arrayContaining(['first_tuple', 'second_x']));
      expect(names).toHaveLength(new Set(names).size);
    });
  });
});
