/* tslint:disable:quotemark */
import * as fs from 'fs';
import {compile} from '../src/compile/compile';
import {normalize} from '../src/normalize/index';
import {NormalizedSpec, TopLevelSpec} from '../src/spec';
import {extractTransforms} from '../src/transformextract';
import {internalField} from '../src/util';
import {initConfig} from './../src/config';

describe('extractTransforms()', () => {
  const specsDir = './examples/specs/';
  // List of specs which don't compile to same Vega when their transforms are extracted due to
  // various bugs.
  const failsList = new Set([
    'area_temperature_range.vl.json',
    'bar_aggregate_count.vl.json',
    'bar_aggregate_sort_by_encoding.vl.json',
    'bar_aggregate_sort_mean.vl.json',
    'bar_binned_data.vl.json',
    'bar_month_temporal.vl.json',
    'bar_month.vl.json',
    'bar_sort_by_count.vl.json',
    'circle_binned_maxbins_10.vl.json',
    'circle_binned_maxbins_2.vl.json',
    'circle_binned_maxbins_20.vl.json',
    'circle_binned_maxbins_5.vl.json',
    'circle_binned.vl.json',
    'circle_github_punchcard.vl.json',
    'concat_bar_layer_circle.vl.json',
    'concat_marginal_histograms.vl.json',
    'concat_weather.vl.json',
    'errorbar_aggregate.vl.json',
    'errorbar_horizontal_aggregate.vl.json',
    'facet_independent_scale_layer_broken.vl.json',
    'hconcat_weather.vl.json',
    'histogram_bin_change.vl.json',
    'histogram_bin_transform.vl.json',
    'histogram_no_spacing.vl.json',
    'histogram_ordinal_sort.vl.json',
    'histogram_ordinal.vl.json',
    'histogram_sort_mean.vl.json',
    'histogram.vl.json',
    'interactive_concat_layer.vl.json',
    'interactive_layered_crossfilter_discrete.vl.json',
    'interactive_layered_crossfilter.vl.json',
    'interactive_seattle_weather.vl.json',
    'joinaggregate_mean_difference.vl.json',
    'layer_bar_dual_axis_minmax.vl.json',
    'layer_bar_dual_axis.vl.json',
    'layer_bar_month.vl.json',
    'layer_circle_independent_color.vl.json',
    'layer_falkensee.vl.json',
    'layer_histogram_global_mean.vl.json',
    'layer_histogram.vl.json',
    'layer_line_color_rule.vl.json',
    'layer_line_errorband_2d_horizontal_borders_strokedash.vl.json',
    'layer_line_errorband_ci.vl.json',
    'layer_line_errorband_pre_aggregated.vl.json',
    'layer_line_mean_point_raw.vl.json',
    'layer_overlay.vl.json',
    'layer_point_errorbar_1d_horizontal.vl.json',
    'layer_point_errorbar_1d_vertical.vl.json',
    'layer_point_errorbar_2d_horizontal_ci.vl.json',
    'layer_point_errorbar_2d_horizontal_color_encoding.vl.json',
    'layer_point_errorbar_2d_horizontal_custom_ticks.vl.json',
    'layer_point_errorbar_2d_horizontal_iqr.vl.json',
    'layer_point_errorbar_2d_horizontal_stdev.vl.json',
    'layer_point_errorbar_2d_horizontal.vl.json',
    'layer_point_errorbar_2d_vertical.vl.json',
    'layer_point_errorbar_ci.vl.json',
    'layer_point_errorbar_stdev.vl.json',
    'layer_precipitation_mean.vl.json',
    'layer_rect_extent.vl.json',
    'layer_scatter_errorband_1D_stdev_global_mean.vl.json',
    'line_calculate.vl.json',
    'line_color_binned.vl.json',
    'line_max_year.vl.json',
    'line_mean_month.vl.json',
    'line_month.vl.json',
    'line_quarter_legend.vl.json',
    'line_timeunit_transform.vl.json',
    'point_2d_aggregate.vl.json',
    'point_aggregate_detail.vl.json',
    'point_binned_color.vl.json',
    'point_binned_opacity.vl.json',
    'point_binned_size.vl.json',
    'point_dot_timeunit_color.vl.json',
    'rect_binned_heatmap.vl.json',
    'rect_heatmap_weather.vl.json',
    'rect_lasagna_future.vl.json',
    'repeat_histogram_flights.vl.json',
    'repeat_histogram.vl.json',
    'repeat_layer.vl.json',
    'repeat_line_weather.vl.json',
    'rule_extent.vl.json',
    'selection_brush_timeunit.vl.json',
    'selection_layer_bar_month.vl.json',
    'selection_project_binned_interval.vl.json',
    'stacked_bar_count.vl.json',
    'stacked_bar_size.vl.json',
    'stacked_bar_weather.vl.json',
    'test_aggregate_nested.vl.json',
    'time_parse_local.vl.json',
    'time_parse_utc_format.vl.json',
    'trellis_bar_histogram_label_rotated.vl.json',
    'trellis_bar_histogram.vl.json',
    'trellis_barley_layer_median.vl.json',
    'trellis_barley.vl.json',
    'trellis_barley_independent.vl.json',
    'trellis_column_year.vl.json',
    'trellis_cross_sort_array.vl.json',
    'trellis_cross_sort.vl.json',
    'trellis_line_quarter.vl.json',
    'vconcat_weather.vl.json',
    'window_top_k_others.vl.json'
  ]);
  for (const file of fs.readdirSync(specsDir)) {
    const filepath = specsDir + file;
    if (filepath.slice(-5) === '.json') {
      it(`should${failsList.has(file) ? ' NOT ' : ' '}compile ${filepath} to the same spec`, () => {
        const specString = fs.readFileSync(filepath, 'utf8');

        const spec = JSON.parse(specString);
        const config = initConfig(spec.config);
        const extractSpec = extractTransforms(normalize(spec, config), config) as TopLevelSpec;

        // convert to JSON to resolve `SignalRefWrapper`s that are lazily evaluated
        const originalCompiled = compile(spec);
        const transformCompiled = compile(extractSpec);

        if (failsList.has(file)) {
          expect(transformCompiled).not.toEqual(originalCompiled);
        } else {
          expect(transformCompiled).toEqual(originalCompiled);
        }
      });
    }
  }

  describe('extractTransformsSingle()', () => {
    it('should extract transforms from faceted spec', () => {
      const spec: NormalizedSpec = {
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
      const config = initConfig({});
      const output = extractTransforms(spec, config);
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
              aggregate: [{op: 'count', as: internalField('count')}],
              groupby: ['Worldwide_Gross']
            }
          ],
          mark: 'point',
          width: 123,
          height: 234,
          encoding: {
            x: {field: 'Worldwide_Gross', type: 'quantitative'},
            y: {field: internalField('count'), type: 'quantitative', title: 'Count of Records'}
          }
        }
      });
    });
  });
  describe('extractTransformsLayered()', () => {
    it('should extract transforms from a layered spec', () => {
      const spec: NormalizedSpec = {
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
      const config = initConfig({});
      const output = extractTransforms(normalize(spec, config), config);
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
