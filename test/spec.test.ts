/* tslint:disable:quotemark */
import {assert} from 'chai';

import * as fs from 'fs';
import {compile} from '../src/compile/compile';
import {Field, FieldDef} from '../src/fielddef';
import {extractTransforms, fieldDefs, normalize, TopLevelSpec} from '../src/spec';
import {StringSet} from '../src/util';
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
  const specsDir = './examples/specs/';
  // List of specs which don't compile to same Vega when their transforms are extracted due to
  // various bugs.
  const failsList: StringSet = {
    'area_temperature_range.vl.json': true,
    'bar_aggregate_count.vl.json': true,
    'bar_binned_data.vl.json': true,
    'bar_month.vl.json': true,
    'bar_month_temporal.vl.json': true,
    'bar_sort_by_count.vl.json': true,
    'circle_binned.vl.json': true,
    'circle_github_punchcard.vl.json': true,
    'concat_bar_layer_circle.vl.json': true,
    'concat_marginal_histograms.vl.json': true,
    'errorbar_aggregate.vl.json': true,
    'errorbar_horizontal_aggregate.vl.json': true,
    'facet_independent_scale_layer_broken.vl.json': true,
    'hconcat_weather.vl.json': true,
    'histogram.vl.json': true,
    'histogram_bin_change.vl.json': true,
    'histogram_bin_transform.vl.json': true,
    'histogram_no_spacing.vl.json': true,
    'histogram_ordinal.vl.json': true,
    'histogram_ordinal_sort.vl.json': true,
    'histogram_sort_mean.vl.json': true,
    'interactive_concat_layer.vl.json': true,
    'interactive_layered_crossfilter.vl.json': true,
    'interactive_layered_crossfilter_discrete.vl.json': true,
    'interactive_seattle_weather.vl.json': true,
    'layer_bar_dual_axis.vl.json': true,
    'layer_bar_dual_axis_minmax.vl.json': true,
    'layer_bar_month.vl.json': true,
    'layer_circle_independent_color.vl.json': true,
    'layer_falkensee.vl.json': true,
    'layer_histogram.vl.json': true,
    'layer_histogram_global_mean.vl.json': true,
    'layer_line_color_rule.vl.json': true,
    'layer_line_errorband_2d_horizontal_borders_strokedash.vl.json': true,
    'layer_line_errorband_ci.vl.json': true,
    'layer_line_errorband_pre_aggregated.vl.json': true,
    'layer_overlay.vl.json': true,
    'layer_point_errorbar_1d_horizontal.vl.json': true,
    'layer_point_errorbar_1d_vertical.vl.json': true,
    'layer_point_errorbar_2d_horizontal.vl.json': true,
    'layer_point_errorbar_2d_horizontal_ci.vl.json': true,
    'layer_point_errorbar_2d_horizontal_color_encoding.vl.json': true,
    'layer_point_errorbar_2d_horizontal_custom_ticks.vl.json': true,
    'layer_point_errorbar_2d_horizontal_iqr.vl.json': true,
    'layer_point_errorbar_2d_horizontal_stdev.vl.json': true,
    'layer_point_errorbar_2d_vertical.vl.json': true,
    'layer_point_errorbar_ci.vl.json': true,
    'layer_point_errorbar_stdev.vl.json': true,
    'layer_precipitation_mean.vl.json': true,
    'layer_rect_extent.vl.json': true,
    'layer_scatter_errorband_1D_stdev_global_mean.vl.json': true,
    'line_calculate.vl.json': true,
    'line_color_binned.vl.json': true,
    'line_max_year.vl.json': true,
    'line_mean_month.vl.json': true,
    'line_month.vl.json': true,
    'line_quarter_legend.vl.json': true,
    'line_timeunit_transform.vl.json': true,
    'point_2d_aggregate.vl.json': true,
    'point_binned_color.vl.json': true,
    'point_binned_opacity.vl.json': true,
    'point_binned_size.vl.json': true,
    'point_dot_timeunit_color.vl.json': true,
    'point_aggregate_detail.vl.json': true,
    'rect_binned_heatmap.vl.json': true,
    'rect_heatmap_weather.vl.json': true,
    'rect_lasagna_future.vl.json': true,
    'repeat_histogram.vl.json': true,
    'repeat_histogram_flights.vl.json': true,
    'repeat_layer.vl.json': true,
    'repeat_line_weather.vl.json': true,
    'rule_extent.vl.json': true,
    'selection_brush_timeunit.vl.json': true,
    'selection_layer_bar_month.vl.json': true,
    'selection_project_binned_interval.vl.json': true,
    'stacked_bar_count.vl.json': true,
    'stacked_bar_size.vl.json': true,
    'stacked_bar_weather.vl.json': true,
    'test_aggregate_nested.vl.json': true,
    'time_parse_local.vl.json': true,
    'time_parse_utc_format.vl.json': true,
    'trellis_bar_histogram.vl.json': true,
    'trellis_bar_histogram_label_rotated.vl.json': true,
    'trellis_barley.vl.json': true,
    'trellis_barley_layer_median.vl.json': true,
    'trellis_column_year.vl.json': true,
    'trellis_cross_sort.vl.json': true,
    'trellis_cross_sort_array.vl.json': true,
    'trellis_line_quarter.vl.json': true,
    'vconcat_weather.vl.json': true,
    'window_mean_difference.vl.json': true
  };
  fs.readdirSync(specsDir).forEach(file => {
    const filepath = specsDir + file;
    if (filepath.slice(-5) === '.json') {
      it(`should${failsList[file] ? ' NOT ' : ' '}compile ${filepath} to the same spec`, () => {
        const specString = fs.readFileSync(filepath, 'utf8');

        const spec = JSON.parse(specString);
        const config: any = initConfig(spec.config);
        const extractSpec = extractTransforms(normalize(spec, config), config) as TopLevelSpec;

        const originalCompiled = compile(spec);
        const transformCompiled = compile(extractSpec);

        if (failsList[file]) {
          expect(transformCompiled).not.toEqual(originalCompiled);
        } else {
          expect(transformCompiled).toEqual(originalCompiled);
        }
      });
    }
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
      expect(output).toEqual({
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
            x: {field: 'Worldwide_Gross', type: 'quantitative'},
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
      expect(output).toEqual(
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
