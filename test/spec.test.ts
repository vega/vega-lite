/* tslint:disable:quotemark */
import {assert} from 'chai';

import * as fs from 'fs';
import {compile} from '../src/compile/compile';
import {Field, FieldDef} from '../src/fielddef';
import {fieldDefs} from '../src/spec';
import {extractTransforms, fieldDefs, normalize, TopLevelSpec} from '../src/spec';
import {initConfig} from './../src/config';

describe('fieldDefs()', () => {
  it('should get all non-duplicate fieldDefs from an encoding', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'}
      }
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(spec), [
      {field: 'Horsepower', type: 'quantitative'},
      {field: 'Miles_per_Gallon', type: 'quantitative'}
    ]);
  });

  it('should get all non-duplicate fieldDefs from all layer in a LayerSpec', () => {
    const layerSpec: any = {
      data: {url: 'data/stocks.csv', format: {type: 'csv'}},
      layer: [
        {
          description: "Google's stock price over time.",
          mark: 'line',
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          description: "Google's stock price over time.",
          mark: 'point',
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'},
            color: {field: 'symbol', type: 'nominal'}
          },
          config: {mark: {filled: true}}
        }
      ]
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(layerSpec), [
      {field: 'date', type: 'temporal'},
      {field: 'price', type: 'quantitative'},
      {field: 'symbol', type: 'nominal'}
    ]);
  });

  it('should get all non-duplicate fieldDefs from all layer in a LayerSpec (merging duplicate fields with different scale types)', () => {
    const layerSpec: any = {
      data: {url: 'data/stocks.csv', format: {type: 'csv'}},
      layer: [
        {
          description: "Google's stock price over time.",
          mark: 'line',
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          description: "Google's stock price over time.",
          mark: 'point',
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'},
            color: {field: 'date', type: 'temporal', scale: {type: 'pow'}}
          },
          config: {mark: {filled: true}}
        }
      ]
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(layerSpec), [
      {field: 'date', type: 'temporal'},
      {field: 'price', type: 'quantitative'}
    ]);
  });

  it('should get all non-duplicate fieldDefs from facet and layer in a FacetSpec', () => {
    const facetSpec: any = {
      data: {url: 'data/movies.json'},
      facet: {row: {field: 'MPAA_Rating', type: 'ordinal'}},
      spec: {
        mark: 'point',
        encoding: {
          x: {field: 'Worldwide_Gross', type: 'quantitative'},
          y: {field: 'US_DVD_Sales', type: 'quantitative'}
        }
      }
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(facetSpec), [
      {field: 'MPAA_Rating', type: 'ordinal'},
      {field: 'Worldwide_Gross', type: 'quantitative'},
      {field: 'US_DVD_Sales', type: 'quantitative'}
    ]);
  });
});

describe('extractTransforms()', () => {
  it('should output specs that are equivalent when compiled', () => {
    const specsDir = './examples/specs/';
    fs.readdirSync(specsDir).forEach(file => {
      const filepath = specsDir + file;
      if (filepath.slice(-5) === '.json') {
        const spec = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        const config: any = initConfig(spec.config);

        const originalCompiled = compile(spec);
        const transformCompiled = compile(extractTransforms(normalize(spec, config), config) as TopLevelSpec);

        expect(transformCompiled).toEqual(originalCompiled);
      }
    });
  });
  describe('extractTransformsSingle()', () => {
    it('should extract transforms from faceted spec', () => {
      const spec: any = {
        name: 'faceted',
        description: 'faceted spec',
        data: {url: 'data/movies.json'},
        facet: {
          column: {field: 'MPAA_Rating', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          width: 123,
          height: 234,
          encoding: {
            x: {field: 'Worldwide_Gross', type: 'quantitative'},
            y: {type: 'quantitative', aggregate: 'count'}
          }
        }
      };
      const config = initConfig(spec.config);
      const output: any = extractTransforms(spec, config);
      assert.deepEqual(output, {
        name: 'faceted',
        description: 'faceted spec',
        data: {url: 'data/movies.json'},
        facet: {
          column: {field: 'MPAA_Rating', type: 'ordinal'}
        },
        spec: {
          transform: [
            {
              aggregate: [{op: 'count', as: 'count_*'}],
              groupby: ['Worldwide_Gross']
            }
          ],
          mark: 'point',
          width: 123,
          height: 234,
          encoding: {
            x: {field: 'Worldwide_Gross', type: 'quantitative', title: 'Worldwide_Gross'},
            y: {field: 'count_*', type: 'quantitative', title: 'Number of Records'}
          }
        }
      });
    });
  });
  describe('extractTransformsLayered()', () => {
    it('should extract transforms from a layered spec', () => {
      const spec: any = {
        data: {url: 'data/seattle-weather.csv'},
        layer: [
          {
            mark: 'bar',
            encoding: {
              x: {
                timeUnit: 'month',
                field: 'date',
                type: 'ordinal'
              },
              y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative',
                axis: {
                  grid: false
                }
              }
            }
          },
          {
            mark: 'line',
            encoding: {
              x: {
                timeUnit: 'month',
                field: 'date',
                type: 'ordinal'
              },
              y: {
                aggregate: 'mean',
                field: 'temp_max',
                type: 'quantitative',
                axis: {
                  grid: false
                },
                scale: {zero: false}
              },
              color: {value: 'firebrick'}
            }
          }
        ],
        resolve: {scale: {y: 'independent'}}
      };
      const config: any = initConfig(spec.config);
      const output: any = extractTransforms(normalize(spec, config), config);
      assert.deepEqual(
        output,
        normalize(
          {
            data: {url: 'data/seattle-weather.csv'},
            layer: [
              {
                transform: [
                  {timeUnit: 'month', field: 'date', as: 'month_date'},
                  {
                    aggregate: [{op: 'mean', field: 'precipitation', as: 'mean_precipitation'}],
                    groupby: ['month_date']
                  }
                ],
                mark: 'bar',
                encoding: {
                  x: {
                    field: 'month_date',
                    type: 'ordinal',
                    title: 'date (month)',
                    axis: {format: '%b'}
                  },
                  y: {
                    field: 'mean_precipitation',
                    type: 'quantitative',
                    title: 'Mean of precipitation',
                    axis: {
                      grid: false
                    }
                  }
                }
              },
              {
                mark: 'line',
                transform: [
                  {timeUnit: 'month', field: 'date', as: 'month_date'},
                  {
                    aggregate: [{op: 'mean', field: 'temp_max', as: 'mean_temp_max'}],
                    groupby: ['month_date']
                  }
                ],
                encoding: {
                  x: {
                    field: 'month_date',
                    type: 'ordinal',
                    title: 'date (month)',
                    axis: {format: '%b'}
                  },
                  y: {
                    field: 'mean_temp_max',
                    type: 'quantitative',
                    title: 'Mean of temp_max',
                    axis: {
                      grid: false
                    },
                    scale: {zero: false}
                  },
                  color: {value: 'firebrick'}
                }
              }
            ],
            resolve: {scale: {y: 'independent'}}
          },
          config
        )
      );
    });
  });
});
