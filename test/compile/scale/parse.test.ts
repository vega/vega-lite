/* tslint:disable:quotemark */

import {toSet} from 'vega-util';
import {parseScale, parseScaleCore} from '../../../src/compile/scale/parse';
import {SELECTION_DOMAIN} from '../../../src/compile/selection/selection';
import * as log from '../../../src/log';
import {NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES, SCALE_PROPERTIES} from '../../../src/scale';
import {without} from '../../../src/util';
import {parseModel, parseModelWithScale, parseUnitModelWithScale} from '../../util';

describe('src/compile', () => {
  it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', () => {
    expect(toSet(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES)).toEqual(
      toSet(without(SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme']))
    );
  });

  describe('parseScaleCore', () => {
    it('respects explicit scale type', () => {
      const model = parseModel({
        data: {url: 'data/seattle-weather.csv'},
        layer: [
          {
            mark: 'bar',
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative'
              }
            }
          },
          {
            mark: 'rule',
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative',
                scale: {type: 'log'}
              }
            }
          }
        ]
      });
      parseScaleCore(model);
      expect(model.getScaleComponent('y').explicit.type).toEqual('log');
    });

    it('respects explicit scale type', () => {
      const model = parseModel({
        data: {url: 'data/seattle-weather.csv'},
        layer: [
          {
            mark: 'bar',
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative',
                scale: {type: 'log'}
              }
            }
          },
          {
            mark: 'rule',
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      parseScaleCore(model);
      expect(model.getScaleComponent('y').explicit.type).toEqual('log');
    });

    // TODO: this actually shouldn't get merged
    it(
      'favors the first explicit scale type',
      log.wrap(localLogger => {
        const model = parseModel({
          data: {url: 'data/seattle-weather.csv'},
          layer: [
            {
              mark: 'bar',
              encoding: {
                y: {
                  aggregate: 'mean',
                  field: 'precipitation',
                  type: 'quantitative',
                  scale: {type: 'log'}
                }
              }
            },
            {
              mark: 'rule',
              encoding: {
                y: {
                  aggregate: 'mean',
                  field: 'precipitation',
                  type: 'quantitative',
                  scale: {type: 'pow'}
                }
              }
            }
          ]
        });
        parseScaleCore(model);
        expect(model.getScaleComponent('y').explicit.type).toEqual('log');
        expect(localLogger.warns[0]).toEqual(log.message.mergeConflictingProperty('type', 'scale', 'log', 'pow'));
      })
    );

    it('favors the band over point', () => {
      const model = parseModel({
        data: {url: 'data/seattle-weather.csv'},
        layer: [
          {
            mark: 'point',
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative'
              },
              x: {field: 'weather', type: 'nominal'}
            }
          },
          {
            mark: 'bar',
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative'
              },
              x: {field: 'weather', type: 'nominal'}
            }
          }
        ]
      });
      parseScaleCore(model);
      expect(model.getScaleComponent('x').implicit.type).toEqual('band');
    });

    it('correctly ignores x/y when lon/lat', () => {
      const model = parseModel({
        data: {
          url: 'data/zipcodes.csv',
          format: {
            type: 'csv'
          }
        },
        mark: 'point',
        encoding: {
          longitude: {
            field: 'longitude',
            type: 'quantitative'
          },
          latitude: {
            field: 'latitude',
            type: 'quantitative'
          }
        }
      });
      parseScaleCore(model);
      expect(model.getScaleComponent('x')).toBeUndefined();
      expect(model.getScaleComponent('y')).toBeUndefined();
    });

    it('correctly ignores shape when geojson', () => {
      const model = parseModel({
        mark: 'geoshape',
        data: {url: 'data/income.json'},
        transform: [
          {
            lookup: 'id',
            from: {
              data: {
                url: 'data/us-10m.json',
                format: {type: 'topojson', feature: 'states'}
              },
              key: 'id'
            },
            as: 'geo'
          }
        ],
        encoding: {
          shape: {field: 'geo', type: 'geojson'}
        }
      });
      parseScaleCore(model);
      expect(model.getScaleComponent('shape')).toBeUndefined();
    });
  });

  describe('parseScale', () => {
    it(
      'does not throw warning when two equivalent objects are specified',
      log.wrap(logger => {
        const model = parseModel({
          data: {url: 'data/seattle-weather.csv'},
          layer: [
            {
              mark: 'circle',
              encoding: {
                y: {
                  field: 'a',
                  type: 'nominal',
                  scale: {rangeStep: 17}
                }
              }
            },
            {
              mark: 'point',
              encoding: {
                y: {
                  field: 'a',
                  type: 'nominal',
                  scale: {rangeStep: 17}
                }
              }
            }
          ]
        });
        parseScale(model);
        expect(model.getScaleComponent('y').explicit.range).toEqual({step: 17});
        expect(logger.warns).toHaveLength(0);
      })
    );

    describe('x ordinal point', () => {
      it('should create an x point scale with rangeStep and no range', () => {
        const model = parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            x: {field: 'origin', type: 'nominal'}
          }
        });
        const scale = model.getScaleComponent('x');
        expect(scale.implicit.type).toEqual('point');
        expect(scale.implicit.range).toEqual({step: 20});
      });
    });

    it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {field: 'origin', type: 'nominal', scale: {type: 'band', padding: 0.6}}
        }
      });
      const scale = model.getScaleComponent('x');
      expect(scale.explicit.padding).toEqual(0.6);
      expect(scale.get('paddingInner')).toBeUndefined();
      expect(scale.get('paddingOuter')).toBeUndefined();
    });

    it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {field: 'origin', type: 'nominal', scale: {type: 'band'}}
        },
        config: {
          scale: {bandPaddingInner: 0.3}
        }
      });
      const scale = model.getScaleComponent('x');
      expect(scale.implicit.paddingInner).toEqual(0.3);
      expect(scale.implicit.paddingOuter).toEqual(0.15);
      expect(scale.get('padding')).toBeUndefined();
    });

    describe('nominal with color', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          color: {field: 'origin', type: 'nominal'}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should create correct color scale', () => {
        expect(scale.implicit.name).toEqual('color');
        expect(scale.implicit.type).toEqual('ordinal');
        expect(scale.domains).toEqual([
          {
            data: 'main',
            field: 'origin',
            sort: true
          }
        ]);
        expect(scale.implicit.range).toEqual('category');
      });
    });

    describe('ordinal with color', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          color: {field: 'origin', type: 'ordinal'}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should create linear color scale', () => {
        expect(scale.implicit.name).toEqual('color');
        expect(scale.implicit.type).toEqual('ordinal');

        expect(scale.domains).toEqual([
          {
            data: 'main',
            field: 'origin',
            sort: true
          }
        ]);
      });
    });

    describe('quantitative with color', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          color: {field: 'origin', type: 'quantitative'}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should create linear color scale', () => {
        expect(scale.implicit.name).toEqual('color');
        expect(scale.implicit.type).toEqual('linear');
        expect(scale.implicit.range).toEqual('ramp');

        expect(scale.domains).toEqual([
          {
            data: 'main',
            field: 'origin'
          }
        ]);
      });
    });

    describe('color with bin', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          color: {field: 'origin', type: 'quantitative', bin: true}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should add correct scales', () => {
        expect(scale.implicit.name).toEqual('color');
        expect(scale.implicit.type).toEqual('bin-ordinal');
        expect(scale.implicit.bins).toMatchObject({signal: 'bin_maxbins_6_origin_bins'});
      });
    });

    describe('ordinal color with bin', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          color: {field: 'origin', type: 'ordinal', bin: true}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should add correct scales', () => {
        expect(scale.implicit.name).toEqual('color');
        expect(scale.implicit.type).toEqual('ordinal');
        expect(scale.implicit.bins).toBeUndefined();
      });
    });

    describe('opacity with bin', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          opacity: {field: 'origin', type: 'quantitative', bin: true}
        }
      });

      const scale = model.getScaleComponent('opacity');

      it('should add correct scales', () => {
        expect(scale.implicit.name).toEqual('opacity');
        expect(scale.implicit.type).toEqual('linear');
        expect(scale.implicit.bins).toMatchObject({signal: 'bin_maxbins_6_origin_bins'});
      });
    });

    describe('size with bin', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          size: {field: 'origin', type: 'quantitative', bin: true}
        }
      });

      const scale = model.getScaleComponent('size');

      it('should add correct scales', () => {
        expect(scale.implicit.name).toEqual('size');
        expect(scale.implicit.type).toEqual('linear');
        expect(scale.implicit.bins).toMatchObject({signal: 'bin_maxbins_6_origin_bins'});
      });
    });

    describe('color with time unit', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          color: {field: 'origin', type: 'temporal', timeUnit: 'year'}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should add correct scales', () => {
        expect(scale.implicit.name).toEqual('color');
        expect(scale.implicit.type).toEqual('time');
      });
    });

    describe('selection domain', () => {
      const model = parseUnitModelWithScale({
        mark: 'area',
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            scale: {domain: {selection: 'brush', encoding: 'x'}}
          },
          y: {
            field: 'date',
            type: 'temporal',
            scale: {domain: {selection: 'foobar', field: 'Miles_per_Gallon'}}
          }
        }
      });

      const xScale = model.getScaleComponent('x');
      const yscale = model.getScaleComponent('y');

      it('should add a raw selection domain', () => {
        expect('domainRaw' in xScale.explicit).toBeTruthy();
        expect(xScale.explicit.domainRaw['signal']).toBe(SELECTION_DOMAIN + '{"encoding":"x","selection":"brush"}');

        expect('domainRaw' in yscale.explicit).toBeTruthy();
        expect(yscale.explicit.domainRaw['signal']).toBe(
          SELECTION_DOMAIN + '{"field":"Miles_per_Gallon","selection":"foobar"}'
        );
      });
    });
  });

  describe('parseScaleDomain', () => {
    describe('faceted domains', () => {
      it('should use cloned subtree', () => {
        const model = parseModelWithScale({
          facet: {
            row: {field: 'symbol', type: 'nominal'}
          },
          data: {url: 'foo.csv'},
          spec: {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative'}
            }
          }
        });

        expect(model.component.scales.x.domains).toEqual([
          {
            data: 'scale_child_main',
            field: 'a'
          }
        ]);
      });

      it('should not use cloned subtree if the data is not faceted', () => {
        const model = parseModelWithScale({
          facet: {
            row: {field: 'symbol', type: 'nominal'}
          },
          data: {url: 'foo.csv'},
          spec: {
            data: {url: 'foo'},
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative'}
            }
          }
        });

        expect(model.component.scales.x.domains).toEqual([
          {
            data: 'child_main',
            field: 'a'
          }
        ]);
      });

      it('should not use cloned subtree if the scale is independent', () => {
        const model = parseModelWithScale({
          facet: {
            row: {field: 'symbol', type: 'nominal'}
          },
          data: {url: 'foo.csv'},
          spec: {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative'}
            }
          },
          resolve: {
            scale: {
              x: 'independent'
            }
          }
        });

        expect(model.children[0].component.scales.x.domains).toEqual([
          {
            data: 'child_main',
            field: 'a'
          }
        ]);
      });
    });
  });
});
