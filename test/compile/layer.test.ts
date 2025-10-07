import {parseLayerModel} from '../util.js';
import {parseModelWithScale} from '../util.js';

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

  describe('legend merging behavior across channels and fields', () => {
    it('uses explicit fields from children to create a single legend across channels', () => {
      const model = parseLayerModel({
        layer: [
          {
            data: {
              values: [
                {x: 0, y: 0, kind: 'a'},
                {x: 1, y: 1, kind: 'a'},
                {x: 0, y: 1, kind: 'b'},
              ]
            },
            mark: 'line',
            encoding: {
              x: {field: 'x', type: 'quantitative'},
              y: {field: 'y', type: 'quantitative'},
              color: {field: 'kind', type: 'nominal'},
              strokeDash: {field: 'kind', type: 'nominal'},
            },
          },
        ],
      });

      model.parseScale();
      model.parseLegends();
      const legends = model.assembleLegends();
      expect(legends).toHaveLength(1);
      expect(legends[0].strokeDash).toBe('strokeDash');
      expect(legends[0].stroke).toBe('color');
    });
    it('does not merge legends for aggregate count on different channels (color vs size)', () => {
      const model = parseModelWithScale({
        vconcat: [
          {
            layer: [
              {
                mark: 'rect',
                encoding: {
                  x: {bin: {maxbins: 10}, field: 'IMDB Rating'},
                  y: {bin: {maxbins: 10}, field: 'Rotten Tomatoes Rating'},
                  color: {aggregate: 'count', legend: {title: 'All Movies Count'}},
                },
              },
              {
                transform: [{filter: {param: 'pts'}}],
                mark: 'point',
                encoding: {
                  x: {bin: {maxbins: 10}, field: 'IMDB Rating'},
                  y: {bin: {maxbins: 10}, field: 'Rotten Tomatoes Rating'},
                  size: {aggregate: 'count', legend: {title: 'Selected Category Count'}},
                  color: {value: '#666'},
                },
              },
            ],
          },
          {
            width: 330,
            height: 120,
            mark: 'bar',
            params: [{name: 'pts', select: {type: 'point', encodings: ['x']}}],
            encoding: {
              x: {field: 'Major Genre', axis: {labelAngle: -40}},
              y: {aggregate: 'count'},
              color: {condition: {param: 'pts', value: 'steelblue'}, value: 'grey'},
            },
          },
        ],
        resolve: {legend: {color: 'independent', size: 'independent'}},
      });

      model.parseLegends();

      const layerChild: any = (model as any).children?.[0];
      const legends = layerChild ? layerChild.assembleLegends() : [];
      const hasColorLegend = legends.some((l: any) => l.fill === 'color' || l.stroke === 'color');
      const hasSizeLegend = legends.some((l: any) => l.size === 'size');
      expect(hasColorLegend).toBe(true);
      expect(hasSizeLegend).toBe(true);
      expect(legends.length).toBeGreaterThan(1);
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
});
