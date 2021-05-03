import {LayerModel} from '../../src/compile/layer';
import {UnitModel} from '../../src/compile/unit';
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

  describe("label's avoidMarks", () => {
    const model = parseLayerModel({
      layer: [
        {
          mark: 'point',
          encoding: {
            label: {field: 'b', type: 'quantitative'}
          }
        },
        {
          layer: [
            {
              mark: 'point',
              encoding: {
                label: {field: 'b', type: 'quantitative', avoid: 'all-marks'}
              }
            },
            {
              mark: 'point',
              encoding: {
                label: {field: 'b', type: 'quantitative', avoid: 'base-mark'}
              }
            },
            {
              mark: 'point',
              encoding: {
                label: {field: 'b', type: 'quantitative', avoid: {ancestor: 2}}
              }
            },
            {
              mark: 'point',
              encoding: {
                label: {field: 'b', type: 'quantitative', avoid: {ancestor: 1}}
              }
            }
          ]
        },
        {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'}
          }
        }
      ]
    });

    model.parse();

    it('should have 3 children', () => {
      expect(model.children).toHaveLength(3);
    });

    it('should avoid correct marks and labels', () => {
      expect((model.children[0] as UnitModel).labelMark.transform[0].avoidMarks).toBeUndefined();
      expect(((model.children[1] as LayerModel).children[0] as UnitModel).labelMark.transform[0].avoidMarks).toEqual([
        'layer_1_layer_1_marks',
        'layer_1_layer_2_marks',
        'layer_1_layer_3_marks',
        'layer_0_marks',
        'layer_2_marks',
        'layer_0_marks_label'
      ]);
      expect(((model.children[1] as LayerModel).children[1] as UnitModel).labelMark.transform[0].avoidMarks).toEqual([
        'layer_1_layer_0_marks_label',
        'layer_0_marks_label'
      ]);
      expect(((model.children[1] as LayerModel).children[2] as UnitModel).labelMark.transform[0].avoidMarks).toEqual([
        'layer_1_layer_0_marks',
        'layer_1_layer_1_marks',
        'layer_1_layer_3_marks',
        'layer_1_layer_0_marks_label',
        'layer_1_layer_1_marks_label',
        'layer_0_marks',
        'layer_2_marks',
        'layer_0_marks_label'
      ]);
      expect(((model.children[1] as LayerModel).children[3] as UnitModel).labelMark.transform[0].avoidMarks).toEqual([
        'layer_1_layer_0_marks',
        'layer_1_layer_1_marks',
        'layer_1_layer_2_marks',
        'layer_1_layer_0_marks_label',
        'layer_1_layer_1_marks_label',
        'layer_1_layer_2_marks_label',
        'layer_0_marks_label'
      ]);
    });

    it('should assemble label to the end', () => {
      const marks = model.assembleMarks();
      expect(true).toBe(true);
      expect(marks.map(mark => mark.type)).toEqual([
        'symbol',
        'symbol',
        'symbol',
        'symbol',
        'symbol',
        'symbol',
        'text',
        'text',
        'text',
        'text',
        'text'
      ]);
      expect(marks.slice(6).map(mark => mark.transform[0])).toStrictEqual([
        {
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
          offset: [2, 2, 2, 2, 2, 2, 2, 2, 2]
        },
        {
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
          offset: [2, 2, 2, 2, 2, 2, 2, 2, 2],
          avoidMarks: [
            'layer_1_layer_1_marks',
            'layer_1_layer_2_marks',
            'layer_1_layer_3_marks',
            'layer_0_marks',
            'layer_2_marks',
            'layer_0_marks_label'
          ]
        },
        {
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
          offset: [2, 2, 2, 2, 2, 2, 2, 2, 2],
          avoidMarks: ['layer_1_layer_0_marks_label', 'layer_0_marks_label']
        },
        {
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
          offset: [2, 2, 2, 2, 2, 2, 2, 2, 2],
          avoidMarks: [
            'layer_1_layer_0_marks',
            'layer_1_layer_1_marks',
            'layer_1_layer_3_marks',
            'layer_1_layer_0_marks_label',
            'layer_1_layer_1_marks_label',
            'layer_0_marks',
            'layer_2_marks',
            'layer_0_marks_label'
          ]
        },
        {
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
          offset: [2, 2, 2, 2, 2, 2, 2, 2, 2],
          avoidMarks: [
            'layer_1_layer_0_marks',
            'layer_1_layer_1_marks',
            'layer_1_layer_2_marks',
            'layer_1_layer_0_marks_label',
            'layer_1_layer_1_marks_label',
            'layer_1_layer_2_marks_label',
            'layer_0_marks_label'
          ]
        }
      ]);
    });
  });
});
