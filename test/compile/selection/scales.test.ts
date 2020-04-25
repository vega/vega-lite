import {NewSignal, PushSignal} from 'vega';
import {X} from '../../../src/channel';
import {Model} from '../../../src/compile/model';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble';
import {assembleTopLevelSignals, assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {UnitModel} from '../../../src/compile/unit';
import * as log from '../../../src/log';
import {Domain} from '../../../src/scale';
import {parseConcatModel, parseUnitModelWithScale, parseModel} from '../../util';

describe('Selection + Scales', () => {
  describe('selectionExtent', () => {
    it('is assembled from selection parameter', () => {
      const model = parseConcatModel({
        vconcat: [
          {
            mark: 'area',
            selection: {
              brush: {type: 'interval', encodings: ['x']},
              brush2: {type: 'multi', fields: ['price'], resolve: 'intersect'}
            },
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'}
            }
          },
          {
            selection: {
              brush3: {type: 'interval'}
            },
            mark: 'area',
            encoding: {
              x: {
                field: 'date',
                type: 'temporal',
                scale: {domain: {selection: 'brush', encoding: 'x'}}
              },
              y: {
                field: 'price',
                type: 'quantitative',
                scale: {domain: {selection: 'brush2', field: 'price'}}
              },
              color: {
                field: 'symbol',
                type: 'nominal',
                scale: {domain: {selection: 'brush2'} as Domain}
              },
              opacity: {
                field: 'symbol',
                type: 'nominal',
                scale: {domain: {selection: 'brush3'} as Domain}
              }
            }
          }
        ],
        resolve: {
          scale: {
            color: 'independent',
            opacity: 'independent'
          }
        }
      });

      model.parseScale();
      model.parseSelections();

      const scales = assembleScalesForModel(model.children[1]);
      const xscale = scales[0];
      const yscale = scales[1];
      const cscale = scales[2];
      const oscale = scales[3];

      expect(typeof xscale.domain).toBe('object');
      expect(xscale).toHaveProperty('domainRaw');
      expect(xscale.domainRaw).toEqual({signal: 'brush["date"]'});

      expect(typeof yscale.domain).toBe('object');
      expect(yscale).toHaveProperty('domainRaw');
      expect(yscale.domainRaw).toEqual({signal: 'brush2["price"]'});

      expect(typeof cscale.domain).toBe('object');
      expect(cscale).toHaveProperty('domainRaw');
      expect(cscale.domainRaw).toEqual({signal: 'brush2["price"]'});

      expect(typeof oscale.domain).toBe('object');
      expect(oscale).toHaveProperty('domainRaw');
      expect(oscale.domainRaw).toEqual({signal: 'brush3["date"]'});
    });

    // FIXME: https://github.com/vega/vega-lite/issues/6000
    // it('should bind both scales in diagonal repeated views', () => {
    //   const model = parseModel({
    //     repeat: {
    //       row: ['Horsepower', 'Acceleration'],
    //       column: ['Miles_per_Gallon', 'Acceleration']
    //     },
    //     spec: {
    //       data: {url: 'data/cars.json'},
    //       mark: 'point',
    //       selection: {
    //         grid: {
    //           type: 'interval',
    //           resolve: 'global',
    //           bind: 'scales'
    //         }
    //       },
    //       encoding: {
    //         x: {field: {repeat: 'column'}, type: 'quantitative'},
    //         y: {field: {repeat: 'row'}, type: 'quantitative'},
    //         color: {field: 'Origin', type: 'nominal'}
    //       }
    //     }
    //   });

    //   model.parseScale();
    //   model.parseSelections();

    //   const scales = assembleScalesForModel(model.children[3]);
    //   expect(scales.length === 2).toBe(true);
    //   expect(scales[0]).toHaveProperty('domainRaw');
    //   expect(scales[1]).toHaveProperty('domainRaw');
    //   expect(scales[0].domainRaw).toEqual({signal: 'grid["Acceleration"]'});
    //   expect(scales[1].domainRaw).toEqual({signal: 'grid["Acceleration"]'});
    // });

    it('should be merged for layered views', () => {
      const model = parseConcatModel({
        data: {url: 'data/sp500.csv'},
        vconcat: [
          {
            layer: [
              {
                mark: 'point',
                encoding: {
                  x: {
                    field: 'date',
                    type: 'temporal',
                    scale: {domain: {selection: 'brush'}}
                  },
                  y: {field: 'price', type: 'quantitative'}
                }
              }
            ]
          },
          {
            mark: 'area',
            selection: {
              brush: {type: 'interval', encodings: ['x']}
            },
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'}
            }
          }
        ]
      });

      model.parseScale();
      model.parseSelections();
      const scales = assembleScalesForModel(model.children[0]);
      expect(scales[0]).toHaveProperty('domainRaw');
      expect(scales[0].domainRaw).toEqual({signal: 'brush["date"]'});
    });

    it('should handle nested field references', () => {
      let model: Model = parseUnitModelWithScale({
        selection: {
          grid: {
            type: 'interval',
            bind: 'scales'
          }
        },
        data: {
          values: [{nested: {a: '1', b: 28}}, {nested: {a: '2', b: 55}}, {nested: {a: '3', b: 43}}]
        },
        mark: 'point',
        encoding: {
          y: {
            field: 'nested.a',
            type: 'quantitative'
          },
          x: {
            field: 'nested.b',
            type: 'quantitative'
          }
        }
      });
      model.parseSelections();

      let scales = assembleScalesForModel(model);
      expect(scales[0]).toHaveProperty('domainRaw');
      expect(scales[0].domainRaw).toEqual({signal: 'grid["nested.b"]'});
      expect(scales[1]).toHaveProperty('domainRaw');
      expect(scales[1].domainRaw).toEqual({signal: 'grid["nested.a"]'});

      model = parseConcatModel({
        vconcat: [
          {
            mark: 'area',
            selection: {
              brush: {type: 'interval', encodings: ['x']}
            },
            encoding: {
              x: {field: 'nested.a', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'}
            }
          },
          {
            mark: 'area',
            encoding: {
              x: {
                field: 'date',
                type: 'temporal',
                scale: {domain: {selection: 'brush', encoding: 'x'}}
              },
              y: {
                field: 'price',
                type: 'quantitative'
              }
            }
          },
          {
            mark: 'area',
            encoding: {
              x: {
                field: 'date',
                type: 'temporal',
                scale: {domain: {selection: 'brush', field: 'nested.a'}}
              },
              y: {
                field: 'price',
                type: 'quantitative'
              }
            }
          }
        ],
        resolve: {
          scale: {
            color: 'independent',
            opacity: 'independent'
          }
        }
      });

      model.parseScale();
      model.parseSelections();

      scales = assembleScalesForModel(model.children[1]);
      expect(scales[0]).toHaveProperty('domainRaw');
      expect(scales[0].domainRaw).toEqual({signal: 'brush["nested.a"]'});

      scales = assembleScalesForModel(model.children[2]);
      expect(scales[0]).toHaveProperty('domainRaw');
      expect(scales[0].domainRaw).toEqual({signal: 'brush["nested.a"]'});
    });
  });

  describe('signals', () => {
    const repeatModel = parseModel({
      repeat: {
        row: ['Horsepower', 'Acceleration'],
        column: ['Miles_per_Gallon', 'Acceleration']
      },
      spec: {
        data: {url: 'data/cars.json'},
        mark: 'point',
        selection: {
          grid: {
            type: 'interval',
            resolve: 'global',
            bind: 'scales'
          }
        },
        encoding: {
          x: {field: {repeat: 'column'}, type: 'quantitative'},
          y: {field: {repeat: 'row'}, type: 'quantitative'},
          color: {field: 'Origin', type: 'nominal'}
        }
      }
    });

    const concatModel = parseConcatModel({
      data: {url: 'data/cars.json'},
      hconcat: [
        {
          mark: 'point',
          encoding: {
            x: {type: 'quantitative', field: 'Miles_per_Gallon'},
            y: {type: 'quantitative', field: 'Weight_in_lbs'}
          },
          selection: {selector001: {type: 'interval', bind: 'scales'}}
        },
        {
          mark: 'point',
          encoding: {
            x: {type: 'quantitative', field: 'Acceleration'},
            y: {type: 'quantitative', field: 'Horsepower'}
          },
          selection: {selector001: {type: 'interval', bind: 'scales'}}
        }
      ]
    });

    repeatModel.parseScale();
    repeatModel.parseSelections();

    concatModel.parseScale();
    concatModel.parseSelections();

    it('should be marked as push: outer', () => {
      const signals = assembleUnitSelectionSignals(repeatModel.children[0] as UnitModel, []);
      const hp = signals.filter(s => s.name === 'grid_Horsepower') as PushSignal[];
      const mpg = signals.filter(s => s.name === 'grid_Miles_per_Gallon') as PushSignal[];

      expect(hp).toHaveLength(1);
      expect(hp[0].push).toBe('outer');
      expect(hp[0]).not.toHaveProperty('value');
      expect(hp[0]).not.toHaveProperty('update');

      expect(mpg).toHaveLength(1);
      expect(mpg[0].push).toBe('outer');
      expect(mpg[0]).not.toHaveProperty('value');
      expect(mpg[0]).not.toHaveProperty('update');
    });

    it('should be assembled at the top-level', () => {
      const signals = assembleTopLevelSignals(repeatModel.children[0] as UnitModel, []);
      const hp = signals.filter(s => s.name === 'grid_Horsepower');
      const mpg = signals.filter(s => s.name === 'grid_Miles_per_Gallon');
      let named = signals.filter(s => s.name === 'grid') as NewSignal[];

      expect(hp).toHaveLength(1);
      expect(mpg).toHaveLength(1);
      expect(named).toHaveLength(1);
      expect(named[0].update).toBe('{"Miles_per_Gallon": grid_Miles_per_Gallon, "Horsepower": grid_Horsepower}');

      const signals2 = assembleTopLevelSignals(repeatModel.children[1] as UnitModel, signals);
      const acc = signals2.filter(s => s.name === 'grid_Acceleration');
      named = signals2.filter(s => s.name === 'grid');

      expect(acc).toHaveLength(1);
      expect(named).toHaveLength(1);
      expect(named[0].update).toEqual(
        '{"Miles_per_Gallon": grid_Miles_per_Gallon, "Horsepower": grid_Horsepower, "Acceleration": grid_Acceleration}'
      );

      const signals3 = assembleTopLevelSignals(
        concatModel.children[1] as UnitModel,
        assembleTopLevelSignals(concatModel.children[0] as UnitModel, [])
      );
      const namedSelector = signals3.filter(s => s.name === 'selector001') as NewSignal[];
      expect(namedSelector[0].update).toBe(
        '{"Miles_per_Gallon": selector001_Miles_per_Gallon, "Weight_in_lbs": selector001_Weight_in_lbs, "Acceleration": selector001_Acceleration, "Horsepower": selector001_Horsepower}'
      );
    });
  });

  it(
    'should not bind for unavailable/unsupported scales',
    log.wrap(localLogger => {
      let model = parseUnitModelWithScale({
        data: {url: 'data/cars.json'},
        selection: {
          grid: {type: 'interval', bind: 'scales'}
        },
        mark: 'circle',
        encoding: {
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });
      model.parseSelections();
      expect(localLogger.warns[0]).toEqual(log.message.cannotProjectOnChannelWithoutField(X));

      model = parseUnitModelWithScale({
        data: {url: 'data/cars.json'},
        selection: {
          grid: {type: 'interval', bind: 'scales'}
        },
        mark: 'circle',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });
      model.parseSelections();
      expect(localLogger.warns[1]).toEqual(log.message.SCALE_BINDINGS_CONTINUOUS);
    })
  );
});
