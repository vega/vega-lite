import {COLUMN, FACET_CHANNELS, ROW} from '../../src/channel';
import {defaultConfig, initConfig} from '../../src/config';
import * as log from '../../src/log';
import {LocalLogger} from '../../src/log';
import {normalize} from '../../src/normalize';
import {TopLevelSpec} from '../../src/spec';

describe('normalize()', () => {
  it('throws errors for invalid spec', () => {
    expect(() => normalize({} as any)).toThrow(log.message.invalidSpec({}));
  });

  describe('normalizeRepeat', () => {
    it(
      'should ignore columns from repeat with row/column',
      log.wrap((localLogger: LocalLogger) => {
        const spec: TopLevelSpec = {
          $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
          repeat: {column: ['Horsepower', 'Miles_per_Gallon', 'Acceleration', 'Displacement']},
          columns: 2,
          spec: {
            data: {url: 'data/cars.json'},
            mark: 'bar',
            encoding: {
              x: {
                field: {repeat: 'column'},
                bin: true,
                type: 'quantitative'
              },
              y: {aggregate: 'count', type: 'quantitative'},
              color: {field: 'Origin', type: 'nominal'}
            }
          }
        };
        const normalized = normalize(spec);
        expect(normalized['columns']).toBe(4);
        expect(localLogger.warns[0]).toEqual(log.message.columnsNotSupportByRowCol('repeat'));
      })
    );

    it('normalizes repeat layer', () => {
      const spec: TopLevelSpec = {
        data: {
          url: 'data/movies.json'
        },
        repeat: {
          layer: ['US_Gross', 'Worldwide_Gross']
        },
        spec: {
          mark: 'line',
          encoding: {
            x: {
              bin: true,
              field: 'IMDB_Rating',
              type: 'quantitative'
            },
            y: {
              aggregate: 'mean',
              field: {repeat: 'layer'},
              type: 'quantitative'
            }
          }
        }
      };
      const normalized = normalize(spec);
      expect(normalized['layer']).toHaveLength(2);
    });
  });

  describe('normalizeFacetedUnit', () => {
    for (const channel of FACET_CHANNELS) {
      it(`should convert single extended spec with ${channel} into a composite spec`, () => {
        const fieldDef = {field: 'MPAA_Rating', type: 'ordinal'};
        const layoutMixins = {spacing: 13};
        const spec: any = {
          name: 'faceted',
          width: 123,
          height: 234,
          description: 'faceted spec',
          data: {url: 'data/movies.json'},
          mark: 'point',
          encoding: {
            [channel]: {...fieldDef, ...layoutMixins},
            x: {field: 'Worldwide_Gross', type: 'quantitative'},
            y: {field: 'US_DVD_Sales', type: 'quantitative'}
          }
        };

        const config = initConfig(spec.config);
        const expectedFacet =
          channel === 'facet'
            ? fieldDef
            : {
                [channel]: fieldDef
              };

        expect(normalize(spec, config)).toEqual({
          name: 'faceted',
          description: 'faceted spec',
          data: {url: 'data/movies.json'},
          spacing: channel === 'facet' ? 13 : {[channel]: 13},
          facet: expectedFacet,
          spec: {
            mark: 'point',
            width: 123,
            height: 234,
            encoding: {
              x: {field: 'Worldwide_Gross', type: 'quantitative'},
              y: {field: 'US_DVD_Sales', type: 'quantitative'}
            }
          }
        });
      });
    }

    for (const channel of [ROW, COLUMN]) {
      it(
        `should drop facet if ${channel} is also specified`,
        log.wrap(localLogger => {
          const spec: any = {
            data: {url: 'data/movies.json'},
            mark: 'point',
            encoding: {
              [channel]: {field: 'MPAA_Rating', type: 'ordinal'},
              facet: {field: 'todrop', type: 'ordinal'},
              x: {field: 'Worldwide_Gross', type: 'quantitative'},
              y: {field: 'US_DVD_Sales', type: 'quantitative'}
            }
          };

          const config = initConfig(spec.config);
          expect(normalize(spec, config)).toEqual({
            data: {url: 'data/movies.json'},
            facet: {
              [channel]: {field: 'MPAA_Rating', type: 'ordinal'}
            },
            spec: {
              mark: 'point',
              encoding: {
                x: {field: 'Worldwide_Gross', type: 'quantitative'},
                y: {field: 'US_DVD_Sales', type: 'quantitative'}
              }
            }
          });
          expect(localLogger.warns[0]).toEqual(log.message.facetChannelDropped([channel]));
        })
      );
    }
  });

  describe('normalizeFacet', () => {
    it(
      'should drop columns from facet with row/column',
      log.wrap((localLogger: LocalLogger) => {
        const spec: TopLevelSpec = {
          data: {url: 'data/cars.json'},
          facet: {column: {field: 'a', type: 'nominal'}},
          columns: 2,
          spec: {
            mark: 'bar',
            encoding: {
              x: {
                field: {repeat: 'column'},
                bin: true,
                type: 'quantitative'
              },
              y: {aggregate: 'count', type: 'quantitative'},
              color: {field: 'Origin', type: 'nominal'}
            }
          }
        };
        const normalized = normalize(spec);
        expect(normalized['columns']).toBeUndefined();
        expect(localLogger.warns[0]).toEqual(log.message.columnsNotSupportByRowCol('facet'));
      })
    );

    it('should produce correct layered specs for mean point and vertical error bar', () => {
      expect(
        normalize(
          {
            description:
              'A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.',
            data: {url: 'data/population.json'},
            transform: [{calculate: "(datum.sex==1) ? 'Men':'Women'", as: 'sex'}],
            facet: {row: {field: 'sex', type: 'ordinal'}},
            spec: {
              layer: [
                {
                  mark: 'errorbar',
                  encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative'}}
                },
                {
                  mark: {type: 'point', opacity: 1, filled: true},
                  encoding: {
                    x: {field: 'age', type: 'ordinal'},
                    y: {field: 'people', type: 'quantitative', aggregate: 'mean'}
                  }
                }
              ]
            }
          },
          defaultConfig
        )
      ).toEqual({
        description:
          'A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.',
        data: {
          url: 'data/population.json'
        },
        transform: [
          {
            calculate: "(datum.sex==1) ? 'Men':'Women'",
            as: 'sex'
          }
        ],
        facet: {
          row: {
            field: 'sex',
            type: 'ordinal'
          }
        },
        spec: {
          layer: [
            {
              transform: [
                {
                  aggregate: [
                    {op: 'stderr', field: 'people', as: 'extent_people'},
                    {op: 'mean', field: 'people', as: 'center_people'}
                  ],
                  groupby: ['age']
                },
                {
                  calculate: 'datum["center_people"] + datum["extent_people"]',
                  as: 'upper_people'
                },
                {
                  calculate: 'datum["center_people"] - datum["extent_people"]',
                  as: 'lower_people'
                }
              ],
              mark: {type: 'rule', ariaRoleDescription: 'errorbar', style: 'errorbar-rule'},
              encoding: {
                y: {
                  field: 'lower_people',
                  type: 'quantitative',
                  title: 'people'
                },
                y2: {field: 'upper_people'},
                x: {field: 'age', type: 'ordinal'},
                tooltip: [
                  {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
                  {field: 'upper_people', title: 'Mean + stderr of people', type: 'quantitative'},
                  {field: 'lower_people', title: 'Mean - stderr of people', type: 'quantitative'},
                  {field: 'age', type: 'ordinal'}
                ]
              }
            },
            {
              mark: {type: 'point', opacity: 1, filled: true},
              encoding: {
                x: {field: 'age', type: 'ordinal'},
                y: {field: 'people', type: 'quantitative', aggregate: 'mean'}
              }
            }
          ]
        }
      });
    });
  });

  describe('normalizeLayer', () => {
    it('correctly passes shared projection and encoding to children of layer', () => {
      const output = normalize(
        {
          data: {url: 'data/population.json'},
          projection: {type: 'mercator'},
          encoding: {
            x: {field: 'age', type: 'ordinal'}
          },
          layer: [
            {mark: 'point'},
            {
              layer: [
                {mark: 'rule'},
                {
                  mark: 'text',
                  encoding: {
                    text: {field: 'a', type: 'nominal'}
                  }
                }
              ]
            }
          ]
        },
        defaultConfig
      );

      expect(output).toEqual({
        data: {url: 'data/population.json'},
        layer: [
          {
            projection: {type: 'mercator'},
            mark: 'point',
            encoding: {
              x: {field: 'age', type: 'ordinal'}
            }
          },
          {
            layer: [
              {
                projection: {type: 'mercator'},
                mark: 'rule',
                encoding: {
                  x: {field: 'age', type: 'ordinal'}
                }
              },
              {
                projection: {type: 'mercator'},
                mark: 'text',
                encoding: {
                  x: {field: 'age', type: 'ordinal'},
                  text: {field: 'a', type: 'nominal'}
                }
              }
            ]
          }
        ]
      });
    });

    it('correctly passes shared encoding type/scale to children of layer', () => {
      const output = normalize(
        {
          data: {url: 'data/population.json'},
          encoding: {
            x: {type: 'quantitative', scale: {type: 'log'}, axis: {title: null}},
            color: {scale: {range: ['blue', 'green']}}
          },
          layer: [
            {mark: 'point', encoding: {x: {field: 'a'}}},
            {
              layer: [
                {mark: 'rule', encoding: {x: {field: 'b'}}},
                {
                  mark: 'text',
                  encoding: {
                    x: {field: 'c'},
                    color: {field: 'b1'},
                    text: {field: 'a', type: 'nominal'}
                  }
                },
                {
                  mark: 'text',
                  encoding: {x: {value: 1}, color: {condition: {test: 'a', field: 'b'}, value: 'red'}}
                },
                {
                  mark: 'text'
                }
              ]
            }
          ]
        },
        defaultConfig
      );

      expect(output).toEqual({
        data: {url: 'data/population.json'},
        layer: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative', scale: {type: 'log'}, axis: {title: null}}
            }
          },
          {
            layer: [
              {
                mark: 'rule',
                encoding: {
                  x: {field: 'b', type: 'quantitative', scale: {type: 'log'}, axis: {title: null}}
                }
              },
              {
                mark: 'text',
                encoding: {
                  x: {field: 'c', type: 'quantitative', scale: {type: 'log'}, axis: {title: null}},
                  color: {field: 'b1', scale: {range: ['blue', 'green']}},
                  text: {field: 'a', type: 'nominal'}
                }
              },
              {
                mark: 'text',
                encoding: {
                  x: {value: 1},
                  color: {condition: {test: 'a', field: 'b', scale: {range: ['blue', 'green']}}, value: 'red'}
                }
              },
              {
                mark: 'text'
              }
            ]
          }
        ]
      });
    });

    it(
      'correctly overrides shared projection and throws warnings',
      log.wrap((localLogger: LocalLogger) => {
        const output = normalize(
          {
            data: {url: 'data/population.json'},
            projection: {type: 'mercator'},
            encoding: {
              x: {field: 'age', type: 'ordinal'}
            },
            layer: [
              {
                projection: {type: 'albersUsa'},
                mark: 'rule'
              },
              {
                mark: 'text',
                encoding: {
                  x: {field: 'a', type: 'nominal'}
                }
              }
            ]
          },
          defaultConfig
        );

        expect(localLogger.warns).toHaveLength(1);

        expect(localLogger.warns[0]).toEqual(
          log.message.projectionOverridden({
            parentProjection: {type: 'mercator'},
            projection: {type: 'albersUsa'}
          })
        );

        expect(output).toEqual({
          data: {url: 'data/population.json'},
          layer: [
            {
              projection: {type: 'albersUsa'},
              mark: 'rule',
              encoding: {
                x: {field: 'age', type: 'ordinal'}
              }
            },
            {
              projection: {type: 'mercator'},
              mark: 'text',
              encoding: {
                x: {field: 'a', type: 'nominal'}
              }
            }
          ]
        });
      })
    );
  });
});
