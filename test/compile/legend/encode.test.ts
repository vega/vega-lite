import {SignalRef} from 'vega-typings';
import {COLOR, SIZE} from '../../../src/channel';
import {setCustomFormatTypes} from '../../../src/compile/format';
import {LegendComponent} from '../../../src/compile/legend/component';
import * as encode from '../../../src/compile/legend/encode';
import {Encoding} from '../../../src/encoding';
import {TimeUnit} from '../../../src/timeunit';
import {TEMPORAL} from '../../../src/type';
import {parseUnitModelWithScale} from '../../util';

describe('compile/legend', () => {
  const symbolLegend = new LegendComponent({type: 'symbol'});
  const gradientLegend = new LegendComponent({type: 'gradient'});

  describe('encode.symbols', () => {
    it('should not have fill, strokeDash, or strokeDashOffset', () => {
      const symbol = encode.symbols(
        {field: 'a', type: 'nominal'},
        {},
        parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'nominal'},
            color: {field: 'a', type: 'nominal'}
          }
        }),
        COLOR,
        symbolLegend
      );
      expect(symbol.fill).toEqual({value: 'transparent'});
      expect((symbol ?? {}).strokeDash).not.toBeDefined();
      expect((symbol ?? {}).strokeDashOffset).not.toBeDefined();
    });

    it('should have fill if a color encoding exists', () => {
      const symbol = encode.symbols(
        {field: 'a', type: 'quantitative'},
        {},
        parseUnitModelWithScale({
          mark: {
            type: 'circle',
            opacity: 0.3
          },
          encoding: {
            x: {field: 'a', type: 'nominal'},
            color: {field: 'a', type: 'nominal'},
            size: {field: 'a', type: 'quantitative'}
          }
        }),
        SIZE,
        symbolLegend
      );
      expect(symbol.fill).toEqual({value: 'black'});
      expect(symbol.fillOpacity).toEqual({value: 0.3});
    });

    it('should have default opacity', () => {
      const symbol = encode.symbols(
        {field: 'a', type: 'nominal'},
        {},
        parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            color: {field: 'a', type: 'nominal'}
          }
        }),
        COLOR,
        symbolLegend
      );
      expect(symbol.opacity['value']).toEqual(0.7); // default opacity is 0.7.
    });

    it('should return the maximum value when there is a condition', () => {
      const symbol = encode.symbols(
        {field: 'a', type: 'nominal'},
        {},
        parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            color: {field: 'a', type: 'nominal'},
            opacity: {
              condition: {selection: 'brush', value: 1},
              value: 0
            }
          }
        }),
        COLOR,
        symbolLegend
      );
      expect(symbol.opacity['value']).toEqual(1);
    });
  });

  describe('encode.gradient', () => {
    it('should have default opacity', () => {
      const gradient = encode.gradient(
        {field: 'a', type: 'quantitative'},
        {},
        parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            color: {field: 'a', type: 'nominal'}
          }
        }),
        COLOR,
        gradientLegend
      );

      expect(gradient.opacity['value']).toEqual(0.7); // default opacity is 0.7.
    });
  });

  describe('encode.labels', () => {
    it('returns correct expression for custom format Type', () => {
      const fieldDef: Encoding<string>['color'] = {
        field: 'a',
        type: 'temporal',
        legend: {format: 'abc', formatType: 'customDateFormat'}
      };
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {color: fieldDef}
      });
      setCustomFormatTypes(['customDateFormat']);
      const label = encode.labels(fieldDef, {}, model, COLOR, symbolLegend);
      expect(label.text).toEqual({signal: 'customDateFormat(datum.value, "abc")'});
      setCustomFormatTypes([]);
    });

    it('should return correct expression for the timeUnit: TimeUnit.MONTH', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal'},
          color: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.MONTH};
      const label = encode.labels(fieldDef, {}, model, COLOR, symbolLegend);
      const expected =
        'timeFormat(datum.value, timeUnitSpecifier(["month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))';
      expect((label.text as SignalRef).signal).toEqual(expected);
    });

    it('should return correct expression for the timeUnit: TimeUnit.QUARTER', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal'},
          color: {field: 'a', type: 'temporal', timeUnit: 'quarter'}
        }
      });

      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.QUARTER};
      const label = encode.labels(fieldDef, {}, model, COLOR, symbolLegend);
      const expected =
        'timeFormat(datum.value, timeUnitSpecifier(["quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))';
      expect((label.text as SignalRef).signal).toEqual(expected);
    });
  });
});
