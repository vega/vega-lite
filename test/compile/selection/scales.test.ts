/* tslint:disable:quotemark */

import {NewSignal, PushSignal} from 'vega';
import {X} from '../../../src/channel';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble';
import {assembleTopLevelSignals, assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
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
      model.parseSelections();

      const scales = assembleScalesForModel(model.children[1]);
      const xscale = scales[0];
      const yscale = scales[1];
      const cscale = scales[2];
      const oscale = scales[3];

      expect(typeof xscale.domain).toBe('object');
      expect('domainRaw' in xscale).toBeTruthy();
      expect(xscale.domainRaw.signal).toBe('brush["date"]');

      expect(typeof yscale.domain).toBe('object');
      expect('domainRaw' in yscale).toBeTruthy();
      expect(yscale.domainRaw.signal).toBe('brush2["price"]');

      expect(typeof cscale.domain).toBe('object');
      expect('domainRaw' in cscale).toBeTruthy();
      expect(cscale.domainRaw.signal).toBe('brush2["price"]');

      expect(typeof oscale.domain).toBe('object');
      expect('domainRaw' in oscale).toBeTruthy();
      expect(oscale.domainRaw.signal).toBe('null');
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
      model.parseSelections();

      const scales = assembleScalesForModel(model.children[3]);
      expect(scales.length === 2).toBe(true);
      expect('domainRaw' in scales[0]).toBeTruthy();
      expect('domainRaw' in scales[1]).toBeTruthy();
      expect(scales[0].domainRaw.signal).toBe('grid["Acceleration"]');
      expect(scales[1].domainRaw.signal).toBe('grid["Acceleration"]');
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
      model.parseSelections();
      const scales = assembleScalesForModel(model.children[0]);
      expect('domainRaw' in scales[0]).toBeTruthy();
      expect(scales[0].domainRaw.signal).toBe('brush["date"]');
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
    model.parseSelections();

    it('should be marked as push: outer', () => {
      const signals = assembleUnitSelectionSignals(model.children[0] as UnitModel, []);
      const hp = signals.filter(s => s.name === 'grid_Horsepower') as PushSignal[];
      const mpg = signals.filter(s => s.name === 'grid_Miles_per_Gallon') as PushSignal[];

      expect(hp.length).toBe(1);
      expect(hp[0].push).toBe('outer');
      expect('value' in hp[0]).toBeFalsy();
      expect('update' in hp[0]).toBeFalsy();

      expect(mpg.length).toBe(1);
      expect(mpg[0].push).toBe('outer');
      expect('value' in mpg[0]).toBeFalsy();
      expect('update' in mpg[0]).toBeFalsy();
    });

    it('should be assembled at the top-level', () => {
      const signals = assembleTopLevelSignals(model.children[0] as UnitModel, []);
      const hp = signals.filter(s => s.name === 'grid_Horsepower');
      const mpg = signals.filter(s => s.name === 'grid_Miles_per_Gallon');
      let named = signals.filter(s => s.name === 'grid') as NewSignal[];

      expect(hp.length).toBe(1);
      expect(mpg.length).toBe(1);
      expect(named.length).toBe(1);
      expect(named[0].update).toBe('{"Miles_per_Gallon": grid_Miles_per_Gallon, "Horsepower": grid_Horsepower}');

      const signals2 = assembleTopLevelSignals(model.children[1] as UnitModel, signals);
      const acc = signals2.filter(s => s.name === 'grid_Acceleration');
      named = signals2.filter(s => s.name === 'grid');

      expect(acc.length).toBe(1);
      expect(named.length).toBe(1);
      expect(named[0].update).toEqual(
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
