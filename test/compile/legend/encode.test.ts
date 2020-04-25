import {COLOR, SIZE} from '../../../src/channel';
import {LegendComponent} from '../../../src/compile/legend/component';
import * as encode from '../../../src/compile/legend/encode';
import {getLegendType} from '../../../src/compile/legend/properties';
import {Encoding} from '../../../src/encoding';
import {parseUnitModelWithScale} from '../../util';

describe('compile/legend', () => {
  const symbolLegend = new LegendComponent({type: 'symbol'});
  const gradientLegend = new LegendComponent({type: 'gradient'});

  describe('encode.symbols', () => {
    it('should not have fill, strokeDash, or strokeDashOffset', () => {
      const legendType = getLegendType({legend: {}, channel: COLOR, scaleType: 'ordinal'});
      const symbol = encode.symbols(
        {},
        {
          fieldOrDatumDef: {field: 'a', type: 'nominal'},
          model: parseUnitModelWithScale({
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'nominal'},
              color: {field: 'a', type: 'nominal'}
            }
          }),
          channel: COLOR,
          legendCmpt: symbolLegend,
          legendType
        }
      );
      expect(symbol.fill).toEqual({value: 'transparent'});
      expect((symbol ?? {}).strokeDash).not.toBeDefined();
      expect((symbol ?? {}).strokeDashOffset).not.toBeDefined();
    });

    it('should have fill if a color encoding exists', () => {
      const legendType = getLegendType({legend: {}, channel: COLOR, scaleType: 'ordinal'});
      const symbol = encode.symbols(
        {},
        {
          fieldOrDatumDef: {field: 'a', type: 'quantitative'},
          model: parseUnitModelWithScale({
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
          channel: SIZE,
          legendCmpt: symbolLegend,
          legendType
        }
      );
      expect(symbol.fill).toEqual({value: 'black'});
      expect(symbol.fillOpacity).toEqual({value: 0.3});
    });

    it('should have default opacity', () => {
      const legendType = getLegendType({legend: {}, channel: COLOR, scaleType: 'ordinal'});
      const symbol = encode.symbols(
        {},
        {
          fieldOrDatumDef: {field: 'a', type: 'nominal'},
          model: parseUnitModelWithScale({
            mark: 'point',
            encoding: {
              color: {field: 'a', type: 'nominal'}
            }
          }),
          channel: COLOR,
          legendCmpt: symbolLegend,
          legendType
        }
      );
      expect(symbol.opacity['value']).toEqual(0.7); // default opacity is 0.7.
    });

    it('should return the maximum value when there is a condition', () => {
      const legendType = getLegendType({legend: {}, channel: COLOR, scaleType: 'ordinal'});
      const symbol = encode.symbols(
        {},
        {
          fieldOrDatumDef: {field: 'a', type: 'nominal'},
          model: parseUnitModelWithScale({
            mark: 'point',
            encoding: {
              color: {field: 'a', type: 'nominal'},
              opacity: {
                condition: {selection: 'brush', value: 1},
                value: 0
              }
            }
          }),
          channel: COLOR,
          legendCmpt: symbolLegend,
          legendType
        }
      );
      expect(symbol.opacity['value']).toEqual(1);
    });
  });

  describe('encode.gradient', () => {
    it('should have default opacity', () => {
      const gradient = encode.gradient(
        {},
        {
          fieldOrDatumDef: {field: 'a', type: 'quantitative'},
          model: parseUnitModelWithScale({
            mark: 'point',
            encoding: {
              color: {field: 'a', type: 'nominal'}
            }
          }),
          channel: COLOR,
          legendCmpt: gradientLegend,
          legendType: 'gradient'
        }
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
        encoding: {color: fieldDef},
        config: {customFormatTypes: true}
      });
      const label = encode.labels(
        {},
        {fieldOrDatumDef: fieldDef, model, channel: COLOR, legendCmpt: symbolLegend, legendType: 'symbol'}
      );
      expect(label.text).toEqual({signal: 'customDateFormat(datum.value, "abc")'});
    });
  });
});
