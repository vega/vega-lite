/* tslint:disable:quotemark */

import {assert} from 'chai';

import {rangeStep, type, domain, parseScaleComponent, initScale, defaultProperty} from '../../src/compile/scale';
import {SOURCE, SUMMARY} from '../../src/data';
import {parseUnitModel} from '../util';

import * as log from '../../src/log';
import {X, Y, SHAPE, DETAIL, ROW, COLUMN, Channel, NONSPATIAL_SCALE_CHANNELS} from '../../src/channel';
import {RANGESTEP_FIT, ScaleType, defaultScaleConfig} from '../../src/scale';
import {Mark, POINT, RECT, BAR, TEXT} from '../../src/mark';
import * as mark from '../../src/mark';
import {ExtendedUnitSpec} from '../../src/spec';
import {TimeUnit} from '../../src/timeunit';
import {TEMPORAL, ORDINAL, Type} from '../../src/type';

describe('Scale', function() {
  describe('type()', function() {
    it('should return null for channel without scale', function() {
      assert.deepEqual(
        type(undefined, {
          field: 'a',
          type: TEMPORAL,
          timeUnit: TimeUnit.YEARMONTH
        }, DETAIL, POINT, true),
        null
      );
    });

    it('should return time for most of time unit.', function() {
      // See exception in the next test)
      const TIMEUNITS = [
        TimeUnit.YEAR,
        TimeUnit.DATE,
        TimeUnit.MINUTES,
        TimeUnit.SECONDS,
        TimeUnit.MILLISECONDS,
        TimeUnit.YEARMONTH,
        TimeUnit.YEARMONTHDATE,
        TimeUnit.YEARMONTHDATEHOURS,
        TimeUnit.YEARMONTHDATEHOURSMINUTES,
        TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
        TimeUnit.HOURSMINUTES,
        TimeUnit.HOURSMINUTESSECONDS,
        TimeUnit.MINUTESSECONDS,
        TimeUnit.SECONDSMILLISECONDS,
        TimeUnit.YEARQUARTER,
        TimeUnit.QUARTERMONTH,
        TimeUnit.YEARQUARTERMONTH,
      ];
      for (const timeUnit of TIMEUNITS) {
        assert.deepEqual(
          type(undefined, {
            field: 'a',
            type: TEMPORAL,
            timeUnit: timeUnit
          }, Y, POINT, true),
          ScaleType.TIME
        );
      }
    });

    it('should return a discrete scale for hours, day, month, quarter for x-y', function() {
      [TimeUnit.MONTH, TimeUnit.HOURS, TimeUnit.DAY, TimeUnit.QUARTER].forEach((timeUnit) => {
        assert.deepEqual(
          type(undefined, {
            field: 'a',
            type: TEMPORAL,
            timeUnit: timeUnit
          }, Y, POINT, true),
          ScaleType.POINT
        );
      });
    });

    it('should return ordinal for shape', function() {
      assert.deepEqual(
        type(undefined, {
          field: 'a',
          type: TEMPORAL,
          timeUnit: TimeUnit.YEARMONTH
        }, SHAPE, POINT, true),
        ScaleType.ORDINAL_LOOKUP
      );
    });

    it('should return ordinal for shape even if other type is specified', function() {
      [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach((badScaleType) => {
        log.runLocalLogger((localLogger) => {
          assert.deepEqual(
            type(badScaleType, {
              field: 'a',
              type: TEMPORAL,
              timeUnit: TimeUnit.YEARMONTH
            }, SHAPE, POINT, true),
            ScaleType.ORDINAL_LOOKUP
          );
          assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(SHAPE, badScaleType, ScaleType.ORDINAL_LOOKUP));
        });
      });
    });

    it('should return band for row/column', function() {
      [ROW, COLUMN].forEach((channel) => {
        assert.deepEqual(
          type(undefined, {
            field: 'a',
            type: TEMPORAL,
            timeUnit: TimeUnit.YEARMONTH
          }, channel, POINT, true),
          ScaleType.BAND
        );
      });
    });

    it('should return band for row/column even if other type is specified', function() {
      [ROW, COLUMN].forEach((channel) => {
        [ScaleType.LINEAR, ScaleType.ORDINAL_LOOKUP, ScaleType.POINT].forEach((badScaleType) => {
          log.runLocalLogger((localLogger) => {
            assert.deepEqual(
              type(badScaleType, {
                field: 'a',
                type: TEMPORAL,
                timeUnit: TimeUnit.YEARMONTH
              }, channel, POINT, true),
              ScaleType.BAND
            );
            assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, ScaleType.BAND));
          });
        });
      });
    });

    it('should return band scale for ordinal X,Y when mark is rect', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: ORDINAL}, channel, RECT, true), ScaleType.BAND);
      });
    });

    it('should return band scale for X,Y when mark is bar and rangeStep is undefined (fit)', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: ORDINAL}, channel, BAR, false), ScaleType.BAND);
      });
    });

    it('should return point scale for X,Y when mark is bar and rangeStep is defined', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: ORDINAL}, channel, BAR, true), ScaleType.POINT);
      });
    });

    it('should return point scale for X,Y when mark is point', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: ORDINAL}, channel, POINT, true), ScaleType.POINT);
      });
    });

    it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', () => {
      [X, Y].forEach((channel) => {
        log.runLocalLogger((localLogger) => {
          assert.equal(type('ordinal', {field: 'a', type: ORDINAL}, channel, POINT, true), ScaleType.POINT);
          assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
        });
      });
    });
  });

  describe('initScale', () => {
    it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', () => {
      const scale = initScale(100, 'bar', 'x',
        {field: 'a', type: 'ordinal', scale: {type: 'band', padding: 0.6}},
        {}
      );
      assert.equal(scale.padding, 0.6);
      assert.isUndefined(scale.paddingInner);
      assert.isUndefined(scale.paddingOuter);
    });

    it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', () => {
      const scale = initScale(100, 'bar', 'x',
        {field: 'a', type: 'ordinal', scale: {type: 'band'}},
        {bandPaddingInner: 0.3}
      );
      assert.equal(scale.paddingInner, 0.3);
      assert.equal(scale.paddingOuter, 0.15);
      assert.isUndefined(scale.padding);
    });

  });

  describe('defaultProperty', () => {
    describe('nice', () => {
      // TODO:
    });

    describe('paddingInner', () => {
      it('should be undefined if padding is specified.', () => {
        assert.equal(defaultProperty.paddingInner(10, 'x', {}), undefined);
      });

      it('should be bandPaddingInner if channel is x or y and padding is not specified.', () => {
        assert.equal(defaultProperty.paddingInner(undefined, 'x', {bandPaddingInner: 15}), 15);
        assert.equal(defaultProperty.paddingInner(undefined, 'y', {bandPaddingInner: 15}), 15);
      });

      it('should be undefined for non-xy channels.', () => {
        for (let c of NONSPATIAL_SCALE_CHANNELS) {
          assert.equal(defaultProperty.paddingInner(undefined, c, {bandPaddingInner: 15}), undefined);
        }
      });
    });

    describe('paddingOuter', () => {
      it('should be undefined if padding is specified.', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.equal(defaultProperty.paddingOuter(10, 'x', scaleType, 0, {}), undefined);
        }
      });

      it('should be pointPadding for point scale if channel is x or y and padding is not specified.', () => {
        for (let c of ['x', 'y'] as Channel[]) {
          assert.equal(defaultProperty.paddingOuter(undefined, c, 'point', 0, {pointPadding: 13}), 13);
        }
      });

      it('should be config.scale.bandPaddingOuter for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', () => {
        for (let c of ['x', 'y'] as Channel[]) {
          assert.equal(defaultProperty.paddingOuter(undefined, c, 'band', 0, {bandPaddingOuter: 16}), 16);
        }
      });
      it('should be paddingInner/2 for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', () => {
        for (let c of ['x', 'y'] as Channel[]) {
          assert.equal(defaultProperty.paddingOuter(undefined, c, 'band', 10, {}), 5);
        }
      });

      it('should be undefined for non-xy channels.', () => {
        for (let c of NONSPATIAL_SCALE_CHANNELS) {
          for (let scaleType of ['point', 'band'] as ScaleType[]) {
            assert.equal(defaultProperty.paddingOuter(undefined, c, scaleType, 0, {}), undefined);
          }
        }
      });
    });

    describe('round', () => {
      it('should return scaleConfig.round for x, y, row, column.', () => {
        for (let c of ['x', 'y', 'row', 'column'] as Channel[]) {
          assert(defaultProperty.round(c, {round: true}));
          assert(!defaultProperty.round(c, {round: false}));
        }
      });

      it('should return undefined other channels (not x, y, row, column).', () => {
        for (let c of NONSPATIAL_SCALE_CHANNELS) {
          assert.isUndefined(defaultProperty.round(c, {round: true}));
          assert.isUndefined(defaultProperty.round(c, {round: false}));
        }
      });
    });

    describe('zero', () => {
      it('should return true when mapping a quantitative field to size', () => {
        assert(defaultProperty.zero({}, 'size', {field: 'a', type: 'quantitative'}));
      });

      it('should return false when mapping a ordinal field to size', () => {
        assert(!defaultProperty.zero({}, 'size', {field: 'a', type: 'ordinal'}));
      });

      it('should return true when mapping a non-binned quantitative field to x/y', () => {
        for (let channel of ['x', 'y'] as Channel[]) {
          assert(defaultProperty.zero({}, channel, {field: 'a', type: 'quantitative'}));
        }
      });

      it('should return false when mapping a binned quantitative field to x/y', () => {
        for (let channel of ['x', 'y'] as Channel[]) {
          assert(!defaultProperty.zero({}, channel, {bin: true, field: 'a', type: 'quantitative'}));
        }
      });

      it('should return false when mapping a non-binned quantitative field with custom domain to x/y', () => {
        for (let channel of ['x', 'y'] as Channel[]) {
          assert(!defaultProperty.zero({domain: [1, 5]}, channel, {
            bin: true, field: 'a', type: 'quantitative'
          }));
        }
      });
    });
  });

  describe('rangeStep()', () => {

    it('should return undefined if rangeStep spec is fit', () => {
      const size = rangeStep(RANGESTEP_FIT, 180, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
    });

    it('should return undefined if top-level size is provided for ordinal scale', () => {
      const size = rangeStep(undefined, 180, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
    });

    it('should return undefined if top-level size is provided for ordinal scale and throw warning if rangeStep is specified', log.wrap((logger) => {
      const size = rangeStep(21, 180, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
      assert.equal(logger.warns[0], log.message.rangeStepOverridden(X));
    }));

    it('should return provided rangeStep for ordinal scale', () => {
      const size = rangeStep(21, undefined, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, 21);
    });

    it('should return provided textXRangeStep for x-ordinal scale', () => {
      const size = rangeStep(undefined, undefined, TEXT, X, defaultScaleConfig);
      assert.deepEqual(size, defaultScaleConfig.textXRangeStep);
    });

    it('should return provided rangeStep for other ordinal scale', () => {
      const size = rangeStep(undefined, undefined, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, defaultScaleConfig.rangeStep);
    });
  });

  describe('domain()', function() {
    it('should return domain for stack', function() {
      const model = parseUnitModel({
        mark: "bar",
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'origin',
            type: 'quantitative'
          },
          x: {field: 'x', type: "ordinal"},
          color: {field: 'color', type: "ordinal"},
          row: {field: 'row', type: 'ordinal'}
        }
      });

      const _domain = domain(model.scale(Y), model, Y);

      assert.deepEqual(_domain, {
        data: 'stacked_scale',
        field: 'sum_sum_origin'
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain for binned Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                bin: {maxbins: 15},
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain, {
            data: SOURCE,
            fields: [
              'bin_origin_start',
              'bin_origin_end'
            ]
          });
        });

      it('should return the raw domain if useRawDomain is true for non-bin, non-sum Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'sum',
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SUMMARY);
        });

      it('should return the right custom domain', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              field: 'horsepower',
              type: "quantitative",
              scale: {domain: [0,200]}
            }
          }
        });
        const _domain = domain(model.scale(Y), model, Y);

        assert.deepEqual(_domain, [0, 200]);
      });

      it('should return the aggregated domain if useRawDomain is false', function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'min',
                field: 'origin',
                scale: {useRawDomain: false},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if useRawDomain is true for raw T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SOURCE);
        });

      it('should return the raw domain if useRawDomain is true for year T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal",
                timeUnit: 'year'
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SOURCE);
          assert.operator(_domain.field.indexOf('year'), '>', -1);
        });

      it('should return the correct domain for month T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                type: "temporal",
                timeUnit: 'month'
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain, { data: 'source', field: 'month_origin', sort: {field: 'month_origin', op: 'min',} });
        });

        it('should return the correct domain for yearmonth T',
          function() {
            const model = parseUnitModel({
              mark: "point",
              encoding: {
                y: {
                  field: 'origin',
                  type: "temporal",
                  timeUnit: 'yearmonth'
                }
              }
            });
            const _domain = domain(model.scale(Y), model, Y);

            assert.deepEqual(_domain, {
              data: 'source', field: 'yearmonth_origin',
              sort: {field: 'yearmonth_origin', op: 'min'}
            });
          });

      it('should return the right custom domain with DateTime objects', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              field: 'year',
              type: "temporal",
              scale: {domain: [{year: 1970}, {year: 1980}]}
            }
          }
        });
        const _domain = domain(model.scale(Y), model, Y);

        assert.deepEqual(_domain, [
          new Date(1970, 0, 1).getTime(),
          new Date(1980, 0, 1).getTime()
        ]);
      });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        const sortDef = {op: 'min' as 'min', field:'Acceleration'};
        const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal", sort: sortDef}
            }
          });

        assert.deepEqual(domain(model.scale(Y), model, Y), {
            data: "source",
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal"}
            }
          });

        assert.deepEqual(domain(model.scale(Y), model, Y), {
            data: "source",
            field: 'origin',
            sort: true
          });
      });
    });
  });

  describe('parseScaleComponent', () => {
    describe('x ordinal point', () => {
      it('should create a main x point scale with rangeStep and no range', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: { field: 'origin', type: "nominal"}
          }
        });
        const scales = parseScaleComponent(model)['x'];
        assert.equal(scales.main.type, 'point');
        assert.equal(scales.main.rangeStep, 21);
        assert.equal(scales.main.range, undefined);
      });
    });

    describe('nominal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: { field: 'origin', type: "nominal"}
        }
      });

      const scales = parseScaleComponent(model)['color'];

      it('should create correct main color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'ordinal');
        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin',
          sort: true
        });
        assert.deepEqual(scales.main.scheme, 'category10');
        assert.deepEqual(scales.main.rangeStep, undefined);
      });
    });

    describe('ordinal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: { field: 'origin', type: "ordinal"}
        }
      });

      const scales = parseScaleComponent(model)['color'];

      it('should create index color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'index');

        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin',
          sort: true
        });
      });
    });

    describe('color with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: { field: "origin", type: "quantitative", bin: true}
          }
        });

      const scales = parseScaleComponent(model)['color'];

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'sequential');

        assert.equal(scales.binLegend.name, 'color_bin_legend');
        assert.equal(scales.binLegend.type, 'point');

        assert.equal(scales.binLegendLabel.name, 'color_bin_legend_label');
        assert.equal(scales.binLegendLabel.type, 'ordinal');
      });

      it('should sort domain and range for labels', function() {
        assert.deepEqual(scales.binLegendLabel.domain, {
          data: 'source',
          field: 'bin_origin_start',
          sort: true
        });
        assert.deepEqual(scales.binLegendLabel.range, {
          data: 'source',
          field: 'bin_origin_range',
          sort: {"field": "bin_origin_start","op": "min"}
        });
      });
    });

    describe('color with time unit', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: 'origin', type: "temporal", timeUnit: "year"}
          }
        });

      const scales = parseScaleComponent(model)['color'];

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'sequential');
        assert.equal(scales.binLegend, undefined);
        assert.equal(scales.binLegendLabel, undefined);
      });
    });
  });

  describe('rangeMixins()', function() {
    describe('row', function() {
      // TODO:
    });

    describe('column', function() {
      // TODO:
    });

    describe('x', function() {
      // TODO: X
    });

    describe('y', function() {
      // TODO: Y
    });

    describe('color', function() {
      it('should use default nominalColorScheme for a nominal color field.', () => {
        const model = parseUnitModel({
          "data": {"url": "data/cars.json"},
          "mark": "point",
          "encoding": {
            "color": {"field": "Origin", "type": "nominal"}
          }
        });
        const scales = parseScaleComponent(model)['color'];
        assert.deepEqual(scales.main.scheme, mark.defaultMarkConfig.nominalColorScheme);
      });

      it('should use default sequentialColorSchema for a ordinal/temporal/quantitative color field.', () => {
        for (let type of ['ordinal', 'temporal', 'quantitative'] as Type[]) {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "color": {"field": "Origin", "type": type}
            }
          });
          const scales = parseScaleComponent(model)['color'];
          assert.deepEqual(scales.main.scheme, mark.defaultMarkConfig.sequentialColorScheme);
        }
      });
    });

    describe('opacity', function() {
      it('should use default opacityRange as opacity\'s scale range.', () => {
        const model = parseUnitModel({
          "data": {"url": "data/cars.json"},
          "mark": "point",
          "encoding": {
            "opacity": {"field": "Acceleration", "type": "quantitative"}
          }
        });
        const scales = parseScaleComponent(model)['opacity'];
        assert.deepEqual(scales.main.range, [mark.defaultMarkConfig.minOpacity, mark.defaultMarkConfig.maxOpacity]);
      });
    });

    describe('size', function() {
      describe('bar', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "bar",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            },
            config: {
              bar: {
                minBandSize: 2,
                maxBandSize: 9
              }
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [2, 9]);
        });

        it('should return [continuousBandSize, bandWidth-1] if min/maxBarSize are not specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "bar",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultBarConfig.continuousBandSize, 10]);
        });
      });

      describe('tick', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "tick",
            "encoding": {
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            },
            config: {
              tick: {
                minBandSize: 4,
                maxBandSize: 9
              }
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [4, 9]);
        });

        it('should return [(default)minBandSize, bandWidth-1] if min/maxBarSize are not specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "tick",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultTickConfig.minBandSize, 20]);
        });
      });

      describe('text', function() {
        it('should return [minFontSize, maxFontSize]', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "text",
            "encoding": {
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultTextConfig.minFontSize, mark.defaultTextConfig.maxFontSize]);
        });
      });

      describe('rule', function() {
        it('should return [minStrokeWidth, maxStrokeWidth]', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "rule",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultRuleConfig.minStrokeWidth, mark.defaultRuleConfig.maxStrokeWidth]);
        });
      });

      describe('point, square, circle', function() {
        it('should return [minSize, maxSize]', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            let spec: ExtendedUnitSpec = {
              "data": {"url": "data/cars.json"},
              "mark": m,
              "encoding": {
                "y": {"field": "Acceleration", "type": "quantitative"},
                // not truly ordinal, just say ordinal for the sake of testing
                "size": {"field": "Origin", "type": "ordinal"}
              },
              config: {}
            };
            spec.config[m] = {
              minSize: 5,
              maxSize: 25
            };
            const model = parseUnitModel(spec);
            const scales = parseScaleComponent(model)['size'];
            assert.deepEqual(scales.main.range, [5, 25]);
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Origin", "type": "ordinal", "scale": {"rangeStep": 11}},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 13}},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Origin", "type": "ordinal", "scale": {"rangeStep": 11}},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 13}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [9, 81]);
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Origin", "type": "ordinal", "scale": {"rangeStep": 11}},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 13}},
              "size": {"field": "Acceleration", "type": "quantitative", "scale": {"zero": false}}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [9, 81]);
          // TODO: this actually should throw warning too.
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });

        it('should return [9, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=false, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [9, 81]);
        });

        it('should return [0, (yRangeStep-2)^2] if y is discrete and x is continuous and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "x": {"field": "Acceleration", "type": "quantitative"},
              "y": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            }
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });

        it('should return [0, (scaleConfig.rangeStep-2)^2] if y is discrete and x is continuous and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "x": {"field": "Acceleration", "type": "quantitative"},
              "y": {"field": "Acceleration", "type": "quantitative"},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            },
            "config": {"scale": {"rangeStep": 11}}
          });
          const scales = parseScaleComponent(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });
      });
    });

    describe('shape', function() {
      it('should use default shapes as shape\'s scale range.', () => {
        const model = parseUnitModel({
          "data": {"url": "data/cars.json"},
          "mark": "point",
          "encoding": {
            "shape": {"field": "Origin", "type": "nominal"}
          }
        });
        const scales = parseScaleComponent(model)['shape'];
        assert.deepEqual(scales.main.range, mark.defaultPointConfig.shapes);
      });
    });
  });

  describe('reverse()', function() {
    // FIXME
  });
});
