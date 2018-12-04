/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X} from '../../../src/channel';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble';
import {assembleTopLevelSignals, assembleUnitSelectionSignals} from '../../../src/compile/selection/selection';
import {UnitModel} from '../../../src/compile/unit';
import * as log from '../../../src/log';
import {Domain} from '../../../src/scale';
import {parseConcatModel, parseRepeatModel, parseUnitModelWithScale} from '../../util';

describe('Selection + Scales', () => {
  describe('domainRaw', () => {
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
      model.parseSelection();

      const scales = assembleScalesForModel(model.children[1]);
      const xscale = scales[0];
      const yscale = scales[1];
      const cscale = scales[2];
      const oscale = scales[3];

      assert.isObject(xscale.domain);
      assert.property(xscale, 'domainRaw');
      assert.propertyVal(xscale.domainRaw, 'signal', 'brush["date"]');

      assert.isObject(yscale.domain);
      assert.property(yscale, 'domainRaw');
      assert.deepPropertyVal(yscale.domainRaw, 'signal', 'brush2["price"]');

      assert.isObject(cscale.domain);
      assert.property(cscale, 'domainRaw');
      assert.propertyVal(cscale.domainRaw, 'signal', 'brush2["price"]');

      assert.isObject(oscale.domain);
      assert.property(oscale, 'domainRaw');
      assert.propertyVal(oscale.domainRaw, 'signal', 'null');
    });

    it('should bind both scales in diagonal repeated views', () => {
      const model = parseRepeatModel({
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

      model.parseScale();
      model.parseSelection();

      const scales = assembleScalesForModel(model.children[3]);
      assert.isTrue(scales.length === 2);
      assert.property(scales[0], 'domainRaw');
      assert.property(scales[1], 'domainRaw');
      assert.propertyVal(scales[0].domainRaw, 'signal', 'grid["Acceleration"]');
      assert.propertyVal(scales[1].domainRaw, 'signal', 'grid["Acceleration"]');
    });

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
      model.parseSelection();
      const scales = assembleScalesForModel(model.children[0]);
      assert.property(scales[0], 'domainRaw');
      assert.propertyVal(scales[0].domainRaw, 'signal', 'brush["date"]');
    });
  });

  describe('signals', () => {
    const model = parseRepeatModel({
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

    model.parseScale();
    model.parseSelection();

    it('should be marked as push: outer', () => {
      const signals = assembleUnitSelectionSignals(model.children[0] as UnitModel, []);
      const hp = signals.filter(s => s.name === 'grid_Horsepower');
      const mpg = signals.filter(s => s.name === 'grid_Miles_per_Gallon');

      assert.lengthOf(hp, 1);
      assert.propertyVal(hp[0], 'push', 'outer');
      assert.notProperty(hp[0], 'value');
      assert.notProperty(hp[0], 'update');

      assert.lengthOf(mpg, 1);
      assert.propertyVal(mpg[0], 'push', 'outer');
      assert.notProperty(mpg[0], 'value');
      assert.notProperty(mpg[0], 'update');
    });

    it('should be assembled at the top-level', () => {
      const signals = assembleTopLevelSignals(model.children[0] as UnitModel, []);
      const hp = signals.filter(s => s.name === 'grid_Horsepower');
      const mpg = signals.filter(s => s.name === 'grid_Miles_per_Gallon');
      let named = signals.filter(s => s.name === 'grid');

      assert.lengthOf(hp, 1);
      assert.lengthOf(mpg, 1);
      assert.lengthOf(named, 1);
      assert.equal(named[0].update, '{"Miles_per_Gallon": grid_Miles_per_Gallon, "Horsepower": grid_Horsepower}');

      const signals2 = assembleTopLevelSignals(model.children[1] as UnitModel, signals);
      const acc = signals2.filter(s => s.name === 'grid_Acceleration');
      named = signals2.filter(s => s.name === 'grid');

      assert.lengthOf(acc, 1);
      assert.lengthOf(named, 1);
      assert.equal(
        named[0].update,
        '{"Miles_per_Gallon": grid_Miles_per_Gallon, "Horsepower": grid_Horsepower, "Acceleration": grid_Acceleration}'
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
      model.parseSelection();
      assert.equal(localLogger.warns[0], log.message.cannotProjectOnChannelWithoutField(X));

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
      model.parseSelection();
      assert.equal(localLogger.warns[1], log.message.SCALE_BINDINGS_CONTINUOUS);
    })
  );
});
