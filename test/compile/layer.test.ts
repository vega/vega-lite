import {parseLayerModel} from '../util';

describe('Layer', () => {
  describe('parseScale', () => {
    it('should merge domains', () => {
      const model = parseLayerModel({
        layer: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'}
            }
          },
          {
            mark: 'point',
            encoding: {
              x: {field: 'b', type: 'ordinal'}
            }
          }
        ]
      });
      expect(model.children).toHaveLength(2);
      model.parseScale();

      expect(model.component.scales['x'].get('domains')).toEqual([
        {
          data: 'layer_0_main',
          field: 'a',
          sort: true
        },
        {
          data: 'layer_1_main',
          field: 'b',
          sort: true
        }
      ]);
    });

    it('should use explicit domains if specified', () => {
      const model = parseLayerModel({
        layer: [
          {
            mark: 'point',
            encoding: {
              x: {scale: {domain: [1, 2, 3]}, field: 'b', type: 'ordinal'}
            }
          },
          {
            mark: 'point',
            encoding: {
              x: {field: 'b', type: 'ordinal'}
            }
          }
        ]
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
            x: {field: 'a', type: 'quantitative'}
          }
        },
        {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'}
          }
        }
      ],
      resolve: {
        scale: {
          x: 'independent'
        }
      }
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
          field: 'a'
        }
      ]);
      expect(model.children[1].component.scales['x'].get('domains')).toEqual([
        {
          data: 'layer_1_main',
          field: 'b'
        }
      ]);
    });

    it('should create second axis on top', () => {
      model.parseAxesAndHeaders();

      expect(model.component.axes['x']).toHaveLength(2);
      expect(model.component.axes['x'][1].implicit.orient).toBe('top');
    });
  });
});
