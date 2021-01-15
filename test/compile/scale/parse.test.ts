import {toSet} from 'vega-util';
import {parseScaleCore, parseScales} from '../../../src/compile/scale/parse';
import * as log from '../../../src/log';
import {NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES, SCALE_PROPERTIES} from '../../../src/scale';
import {parseModel, parseModelWithScale, parseUnitModelWithScale, without} from '../../util';

describe('src/compile', () => {
  it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES without type, domain, and range properties', () => {
    expect(toSet(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES)).toEqual(
      toSet(without(SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeMax', 'rangeMin', 'scheme']))
    );
  });

  describe('parseScaleCore', () => {
    it('respects explicit scale type from second layer', () => {
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
      expect(model.getScaleComponent('y').explicit.type).toBe('log');
    });

    it('respects explicit scale type from first layer', () => {
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
      expect(model.getScaleComponent('y').explicit.type).toBe('log');
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
        expect(model.getScaleComponent('y').explicit.type).toBe('log');
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
      expect(model.getScaleComponent('x').implicit.type).toBe('band');
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
                  scale: {padding: 0.2}
                }
              }
            },
            {
              mark: 'point',
              encoding: {
                y: {
                  field: 'a',
                  type: 'nominal',
                  scale: {padding: 0.2}
                }
              }
            }
          ]
        });
        parseScales(model);
        expect(model.getScaleComponent('y').explicit.padding).toEqual(0.2);
        expect(logger.warns).toHaveLength(0);
      })
    );

    it('should converts date time object in domainMin/Max to signal', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            scale: {
              domainMin: {year: 2002},
              domainMax: {year: 2012}
            }
          }
        }
      });
      const scale = model.getScaleComponent('x');
      expect(scale.explicit.domainMin).toEqual({signal: 'datetime(2002, 0, 1, 0, 0, 0, 0)'});
      expect(scale.explicit.domainMax).toEqual({signal: 'datetime(2012, 0, 1, 0, 0, 0, 0)'});
    });

    describe('x ordinal point', () => {
      it('should create an x point scale with a step-based range', () => {
        const model = parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            x: {field: 'origin', type: 'nominal'}
          }
        });
        const scale = model.getScaleComponent('x');
        expect(scale.implicit.type).toBe('point');
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
        expect(scale.implicit.name).toBe('color');
        expect(scale.implicit.type).toBe('ordinal');
        expect(scale.get('domains')).toEqual([
          {
            data: 'main',
            field: 'origin',
            sort: true
          }
        ]);
        expect(scale.implicit.range).toBe('category');
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
        expect(scale.implicit.name).toBe('color');
        expect(scale.implicit.type).toBe('ordinal');

        expect(scale.get('domains')).toEqual([
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
        expect(scale.implicit.name).toBe('color');
        expect(scale.implicit.type).toBe('linear');
        expect(scale.implicit.range).toBe('ramp');

        expect(scale.get('domains')).toEqual([
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
        expect(scale.implicit.name).toBe('color');
        expect(scale.implicit.type).toBe('bin-ordinal');
        expect(scale.implicit.bins).toEqual({signal: 'bin_maxbins_6_origin_bins'});
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
        expect(scale.implicit.name).toBe('color');
        expect(scale.implicit.type).toBe('ordinal');
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
        expect(scale.implicit.name).toBe('opacity');
        expect(scale.implicit.type).toBe('linear');
        expect(scale.implicit.bins).toEqual({signal: 'bin_maxbins_6_origin_bins'});
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
        expect(scale.implicit.name).toBe('size');
        expect(scale.implicit.type).toBe('linear');
        expect(scale.implicit.bins).toEqual({signal: 'bin_maxbins_6_origin_bins'});
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
        expect(scale.implicit.name).toBe('color');
        expect(scale.implicit.type).toBe('time');
      });
    });

    describe('selection domain', () => {
      const model = parseUnitModelWithScale({
        mark: 'area',
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            scale: {domain: {param: 'brush', encoding: 'x'}}
          },
          y: {
            field: 'date',
            type: 'temporal',
            scale: {domain: {param: 'foobar', field: 'Miles_per_Gallon'}}
          }
        }
      });

      const xScale = model.getScaleComponent('x');
      const yScale = model.getScaleComponent('y');

      it('should add a selection extent', () => {
        expect('selectionExtent' in xScale.explicit).toBeTruthy();
        expect(xScale.explicit.selectionExtent.param).toEqual('brush');
        expect(xScale.explicit.selectionExtent['encoding']).toEqual('x');

        expect('selectionExtent' in yScale.explicit).toBeTruthy();
        expect(yScale.explicit.selectionExtent.param).toEqual('foobar');
        expect(yScale.explicit.selectionExtent['field']).toEqual('Miles_per_Gallon');
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

        expect(model.component.scales.x.get('domains')).toEqual([
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

        expect(model.component.scales.x.get('domains')).toEqual([
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

        expect(model.children[0].component.scales.x.get('domains')).toEqual([
          {
            data: 'child_main',
            field: 'a'
          }
        ]);
      });

      it(
        'should show warning if two domains are merged',
        log.wrap(localLogger => {
          const model = parseModelWithScale({
            layer: [
              {
                mark: 'point',
                encoding: {
                  y: {field: 'foo', type: 'nominal', scale: {domain: [1, 2, 3]}}
                }
              },
              {
                mark: 'point',
                encoding: {
                  y: {field: 'foo', type: 'nominal', scale: {domain: [2, 3, 4]}}
                }
              }
            ]
          });

          expect(model.children[0].component.scales.y.get('domains')).toEqual([[1, 2, 3]]);
          expect(model.children[1].component.scales.y.get('domains')).toEqual([[2, 3, 4]]);

          expect(localLogger.warns).toEqual([
            'Conflicting scale property "domains" ([[1,2,3]] and [[2,3,4]]). Using the union of the two domains.'
          ]);
        })
      );
    });
  });
});
