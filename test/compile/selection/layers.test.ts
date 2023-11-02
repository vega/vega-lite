import * as selection from '../../../src/compile/selection';
import {UnitModel} from '../../../src/compile/unit';
import {parseLayerModel} from '../../util';

describe('Layered Selections', () => {
  const layers = parseLayerModel({
    layer: [
      {
        params: [
          {
            name: 'brush',
            select: 'interval'
          }
        ],
        mark: 'circle',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {field: 'Origin', type: 'nominal'}
        }
      },
      {
        params: [
          {
            name: 'brush',
            select: 'interval',
            bind: 'scales'
          }
        ],
        mark: 'square',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {field: 'Origin', type: 'nominal'}
        }
      },
      {
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {field: 'Origin', type: 'nominal'}
        }
      }
    ],
    config: {mark: {tooltip: null, invalid: 'hide'}}
  });

  layers.parse();

  it('should appropriately name the unit', () => {
    const unit = layers.children[0] as UnitModel;
    expect(selection.unitName(unit)).toBe('"layer_0"');
  });

  // Selections should augment layered marks together, rather than each
  // mark individually. This ensures correct interleaving of brush marks
  // (i.e., that the brush mark appears above all layers and thus can be
  // moved around).
  it('should pass through unit mark assembly', () => {
    expect(layers.children[0].assembleMarks()).toEqual([
      {
        name: 'layer_0_marks',
        type: 'symbol',
        style: ['circle'],
        interactive: true,
        from: {
          data: 'layer_0_main'
        },
        clip: true,
        encode: {
          update: {
            x: {
              scale: 'x',
              field: 'Horsepower'
            },
            y: {
              scale: 'y',
              field: 'Miles_per_Gallon'
            },
            ariaRoleDescription: {
              value: 'circle'
            },
            description: {
              signal:
                '"Horsepower: " + (format(datum["Horsepower"], "")) + "; Miles_per_Gallon: " + (format(datum["Miles_per_Gallon"], "")) + "; Origin: " + (isValid(datum["Origin"]) ? datum["Origin"] : ""+datum["Origin"])'
            },
            fill: [
              {
                test: '!isValid(datum["Horsepower"]) || !isFinite(+datum["Horsepower"]) || !isValid(datum["Miles_per_Gallon"]) || !isFinite(+datum["Miles_per_Gallon"])',
                value: null
              },
              {
                scale: 'color',
                field: 'Origin'
              }
            ],
            shape: {
              value: 'circle'
            },
            opacity: {
              value: 0.7
            }
          }
        }
      }
    ]);

    expect(layers.children[1].assembleMarks()).toEqual([
      {
        name: 'layer_1_marks',
        type: 'symbol',
        style: ['square'],
        interactive: true,
        from: {
          data: 'layer_1_main'
        },
        clip: true,
        encode: {
          update: {
            x: {
              scale: 'x',
              field: 'Horsepower'
            },
            y: {
              scale: 'y',
              field: 'Miles_per_Gallon'
            },
            ariaRoleDescription: {
              value: 'square'
            },
            description: {
              signal:
                '"Horsepower: " + (format(datum["Horsepower"], "")) + "; Miles_per_Gallon: " + (format(datum["Miles_per_Gallon"], "")) + "; Origin: " + (isValid(datum["Origin"]) ? datum["Origin"] : ""+datum["Origin"])'
            },
            fill: [
              {
                test: '!isValid(datum["Horsepower"]) || !isFinite(+datum["Horsepower"]) || !isValid(datum["Miles_per_Gallon"]) || !isFinite(+datum["Miles_per_Gallon"])',
                value: null
              },
              {
                scale: 'color',
                field: 'Origin'
              }
            ],
            shape: {
              value: 'square'
            },
            opacity: {
              value: 0.7
            }
          }
        }
      }
    ]);

    expect(layers.children[2].assembleMarks()).toEqual([
      {
        name: 'layer_2_marks',
        type: 'symbol',
        style: ['point'],
        interactive: false,
        from: {
          data: 'layer_2_main'
        },
        clip: true,
        encode: {
          update: {
            opacity: {
              value: 0.7
            },
            ariaRoleDescription: {
              value: 'point'
            },
            description: {
              signal:
                '"Horsepower: " + (format(datum["Horsepower"], "")) + "; Miles_per_Gallon: " + (format(datum["Miles_per_Gallon"], "")) + "; Origin: " + (isValid(datum["Origin"]) ? datum["Origin"] : ""+datum["Origin"])'
            },
            fill: [
              {
                test: '!isValid(datum["Horsepower"]) || !isFinite(+datum["Horsepower"]) || !isValid(datum["Miles_per_Gallon"]) || !isFinite(+datum["Miles_per_Gallon"])',
                value: null
              },
              {
                value: 'transparent'
              }
            ],
            stroke: [
              {
                test: '!isValid(datum["Horsepower"]) || !isFinite(+datum["Horsepower"]) || !isValid(datum["Miles_per_Gallon"]) || !isFinite(+datum["Miles_per_Gallon"])',
                value: null
              },
              {
                scale: 'color',
                field: 'Origin'
              }
            ],
            x: {
              scale: 'x',
              field: 'Horsepower'
            },
            y: {
              scale: 'y',
              field: 'Miles_per_Gallon'
            }
          }
        }
      }
    ]);
  });

  it('should assemble selection marks across layers', () => {
    const child0 = layers.children[0].assembleMarks()[0];
    const child1 = layers.children[1].assembleMarks()[0];
    const child2 = layers.children[2].assembleMarks()[0];

    expect(layers.assembleMarks()).toEqual([
      // Background brush mark for "brush" selection.
      {
        name: 'brush_brush_bg',
        type: 'rect',
        clip: true,
        encode: {
          enter: {
            fill: {value: '#333'},
            fillOpacity: {value: 0.125}
          },
          update: {
            x: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_x[0]'
              },
              {
                value: 0
              }
            ],
            y: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_y[0]'
              },
              {
                value: 0
              }
            ],
            x2: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_x[1]'
              },
              {
                value: 0
              }
            ],
            y2: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_y[1]'
              },
              {
                value: 0
              }
            ]
          }
        }
      },
      // Layer marks
      {...child0, clip: true},
      {...child1, clip: true},
      {...child2, clip: true},
      // Foreground brush mark for "brush" selection.
      {
        name: 'brush_brush',
        type: 'rect',
        clip: true,
        encode: {
          enter: {
            fill: {value: 'transparent'}
          },
          update: {
            stroke: [
              {
                test: 'brush_x[0] !== brush_x[1] && brush_y[0] !== brush_y[1]',
                value: 'white'
              },
              {value: null}
            ],
            x: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_x[0]'
              },
              {
                value: 0
              }
            ],
            y: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_y[0]'
              },
              {
                value: 0
              }
            ],
            x2: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_x[1]'
              },
              {
                value: 0
              }
            ],
            y2: [
              {
                test: 'data("brush_store").length && data("brush_store")[0].unit === "layer_0"',
                signal: 'brush_y[1]'
              },
              {
                value: 0
              }
            ]
          }
        }
      }
    ]);
  });
});
