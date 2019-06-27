import {
  COLOR,
  DETAIL,
  FILLOPACITY,
  OPACITY,
  SIZE,
  STROKEOPACITY,
  STROKEWIDTH,
  UNIT_CHANNELS,
  X2,
  Y2
} from '../src/channel';
import {isPositionFieldDef} from '../src/channeldef';
import {defaultConfig} from '../src/config';
import {
  Encoding,
  extractTransformsFromEncoding,
  markChannelCompatible,
  normalizeEncoding,
  pathGroupingFields
} from '../src/encoding';
import * as log from '../src/log';
import {CIRCLE, Mark, POINT, SQUARE, TICK} from '../src/mark';
import {internalField} from '../src/util';

describe('encoding', () => {
  describe('normalizeEncoding', () => {
    it(
      'should drop color channel if fill is specified and filled = true',
      log.wrap(logger => {
        const encoding = normalizeEncoding(
          {
            color: {field: 'a', type: 'quantitative'},
            fill: {field: 'b', type: 'quantitative'}
          },
          {type: 'bar', filled: true}
        );

        expect(encoding).toEqual({
          fill: {field: 'b', type: 'quantitative'}
        });
        expect(logger.warns[0]).toEqual(log.message.droppingColor('encoding', {fill: true}));
      })
    );

    it(
      'should drop color channel if stroke is specified and filled is false',
      log.wrap(logger => {
        const encoding = normalizeEncoding(
          {
            color: {field: 'a', type: 'quantitative'},
            stroke: {field: 'b', type: 'quantitative'}
          },
          {type: 'point', filled: false}
        );

        expect(encoding).toEqual({
          stroke: {field: 'b', type: 'quantitative'}
        });
        expect(logger.warns[0]).toEqual(log.message.droppingColor('encoding', {stroke: true}));
      })
    );
  });

  describe('extractTransformsFromEncoding', () => {
    function normalizeEncodingWithMark(encoding: Encoding<string>, mark: Mark) {
      return normalizeEncoding(encoding, {type: mark});
    }

    it('should indlude axis in extracted encoding', () => {
      const encoding = extractTransformsFromEncoding(
        {
          x: {field: 'dose', type: 'ordinal', axis: {labelAngle: 15}},
          y: {field: 'response', type: 'quantitative'}
        },
        defaultConfig
      ).encoding;

      const x = encoding.x;
      expect(x).toBeDefined();
      if (isPositionFieldDef(x)) {
        expect(x.axis).toBeDefined();
        expect(x.axis.labelAngle).toBe(15);
      } else {
        expect(false).toBe(true);
      }
    });
    it('should extract time unit from encoding field definition and add axis format', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {timeUnit: 'yearmonthdatehoursminutes', field: 'a', type: 'temporal'},
            y: {field: 'b', type: 'quantitative'}
          },
          'line'
        ),
        defaultConfig
      );
      expect(output).toEqual({
        bins: [],
        timeUnits: [{timeUnit: 'yearmonthdatehoursminutes', field: 'a', as: 'yearmonthdatehoursminutes_a'}],
        aggregate: [],
        groupby: ['yearmonthdatehoursminutes_a', 'b'],
        encoding: {
          x: {
            field: 'yearmonthdatehoursminutes_a',
            type: 'temporal',
            title: 'a (year-month-date-hours-minutes)',
            axis: {
              format: '%b %d, %Y %H:%M'
            }
          },
          y: {field: 'b', type: 'quantitative'}
        }
      });
    });
    it('should produce format and formatType in axis when there is timeUnit', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {timeUnit: 'year', field: 'b', type: 'ordinal'}
          },
          'line'
        ),
        defaultConfig
      );

      expect(output.encoding.y).toEqual({
        axis: {
          format: '%Y',
          formatType: 'time'
        },
        field: 'year_b',
        title: 'b (year)',
        type: 'ordinal'
      });
    });
    it('should not produce formatType in axis when there is timeUnit with type temporal', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {timeUnit: 'year', field: 'b', type: 'temporal'}
          },
          'line'
        ),
        defaultConfig
      );

      expect(output.encoding.y).toEqual({
        axis: {
          format: '%Y'
        },
        field: 'year_b',
        title: 'b (year)',
        type: 'temporal'
      });
    });
    it('should produce format and formatType in legend when there is timeUnit', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {field: 'b', type: 'ordinal'},
            detail: {field: 'c', timeUnit: 'month', type: 'nominal'}
          },
          'line'
        ),
        defaultConfig
      );

      expect(output.encoding.detail).toEqual({
        legend: {
          format: '%b',
          formatType: 'time'
        },
        field: 'month_c',
        title: 'c (month)',
        type: 'nominal'
      });
    });
    it('should not produce formatType in legend when there is timeUnit with type temporal', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {field: 'b', type: 'ordinal'},
            detail: {field: 'c', timeUnit: 'month', type: 'temporal'}
          },
          'line'
        ),
        defaultConfig
      );

      expect(output.encoding.detail).toEqual({
        legend: {
          format: '%b'
        },
        field: 'month_c',
        title: 'c (month)',
        type: 'temporal'
      });
    });
    it('should produce format and formatType when there is timeUnit in tooltip channel or tooltip channel', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {field: 'b', type: 'ordinal'},
            tooltip: {field: 'c', timeUnit: 'month', type: 'nominal'},
            text: {field: 'c', timeUnit: 'month', type: 'nominal'}
          },
          'text'
        ),
        defaultConfig
      );
      expect(output.encoding.tooltip).toEqual({
        format: '%b',
        formatType: 'time',
        field: 'month_c',
        title: 'c (month)',
        type: 'nominal'
      });
      expect(output.encoding.text).toEqual({
        format: '%b',
        formatType: 'time',
        field: 'month_c',
        title: 'c (month)',
        type: 'nominal'
      });
    });
    it('should extract aggregates from encoding', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {
              aggregate: 'max',
              field: 'b',
              type: 'quantitative'
            }
          },
          'line'
        ),
        defaultConfig
      );
      expect(output).toEqual({
        bins: [],
        timeUnits: [],
        aggregate: [{op: 'max', field: 'b', as: 'max_b'}],
        groupby: ['a'],
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {
            field: 'max_b',
            type: 'quantitative',
            title: 'Max of b'
          }
        }
      });
    });
    it('should extract binning from encoding', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'ordinal', bin: true},
            y: {type: 'quantitative', aggregate: 'count'}
          },
          'bar'
        ),
        defaultConfig
      );
      expect(output).toEqual({
        bins: [{bin: {maxbins: 10}, field: 'a', as: 'bin_maxbins_10_a'}],
        timeUnits: [],
        aggregate: [{op: 'count', as: internalField('count')}],
        groupby: ['bin_maxbins_10_a', 'bin_maxbins_10_a_end', 'bin_maxbins_10_a_range'],
        encoding: {
          x: {field: 'bin_maxbins_10_a', type: 'quantitative', title: 'a (binned)', bin: 'binned'},
          x2: {field: 'bin_maxbins_10_a_end'},
          y: {field: internalField('count'), type: 'quantitative', title: 'Count of Records'}
        }
      });
    });
    it('should preserve auxiliary properties (i.e. axis) in encoding', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncodingWithMark(
          {
            x: {field: 'a', type: 'quantitative'},
            y: {
              aggregate: 'mean',
              field: 'b',
              type: 'quantitative',
              title: 'foo',
              axis: {title: 'foo', format: '.2e'}
            }
          },
          'line'
        ),
        defaultConfig
      );
      expect(output).toEqual({
        bins: [],
        timeUnits: [],
        aggregate: [{op: 'mean', field: 'b', as: 'mean_b'}],
        groupby: ['a'],
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {
            field: 'mean_b',
            type: 'quantitative',
            title: 'foo',
            axis: {title: 'foo', format: '.2e'}
          }
        }
      });
    });
  });

  describe('markChannelCompatible', () => {
    it('should support x2 for circle, point, square and tick mark with binned data', () => {
      const encoding: Encoding<string> = {
        x: {
          field: 'bin_start',
          bin: 'binned',
          type: 'quantitative',
          axis: {
            tickMinStep: 2
          }
        },
        x2: {
          field: 'bin_end'
        },
        y: {
          field: 'count',
          type: 'quantitative'
        }
      };
      expect(markChannelCompatible(encoding, X2, CIRCLE)).toBe(true);
      expect(markChannelCompatible(encoding, X2, POINT)).toBe(true);
      expect(markChannelCompatible(encoding, X2, SQUARE)).toBe(true);
      expect(markChannelCompatible(encoding, X2, TICK)).toBe(true);
    });

    it('should support y2 for circle, point, square and tick mark with binned data', () => {
      const encoding: Encoding<string> = {
        y: {
          field: 'bin_start',
          bin: 'binned',
          type: 'quantitative',
          axis: {
            tickMinStep: 2
          }
        },
        y2: {
          field: 'bin_end'
        },
        x: {
          field: 'count',
          type: 'quantitative'
        }
      };
      expect(markChannelCompatible(encoding, Y2, CIRCLE)).toBe(true);
      expect(markChannelCompatible(encoding, Y2, POINT)).toBe(true);
      expect(markChannelCompatible(encoding, Y2, SQUARE)).toBe(true);
      expect(markChannelCompatible(encoding, Y2, TICK)).toBe(true);
    });

    it('should not support x2 for circle, point, square and tick mark without binned data', () => {
      const encoding: Encoding<string> = {
        x: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickMinStep: 2
          }
        },
        x2: {
          field: 'bin_end'
        },
        y: {
          field: 'count',
          type: 'quantitative'
        }
      };
      expect(markChannelCompatible(encoding, X2, CIRCLE)).toBe(false);
      expect(markChannelCompatible(encoding, X2, POINT)).toBe(false);
      expect(markChannelCompatible(encoding, X2, SQUARE)).toBe(false);
      expect(markChannelCompatible(encoding, X2, TICK)).toBe(false);
    });

    it('should not support y2 for circle, point, square and tick mark with binned data', () => {
      const encoding: Encoding<string> = {
        y: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickMinStep: 2
          }
        },
        y2: {
          field: 'bin_end'
        },
        x: {
          field: 'count',
          type: 'quantitative'
        }
      };
      expect(markChannelCompatible(encoding, Y2, CIRCLE)).toBe(false);
      expect(markChannelCompatible(encoding, Y2, POINT)).toBe(false);
      expect(markChannelCompatible(encoding, Y2, SQUARE)).toBe(false);
      expect(markChannelCompatible(encoding, Y2, TICK)).toBe(false);
    });
  });

  describe('pathGroupingFields()', () => {
    it('should return fields for unaggregate detail, color, size, opacity fieldDefs.', () => {
      for (const channel of [DETAIL, COLOR, SIZE, OPACITY, FILLOPACITY, STROKEOPACITY, STROKEWIDTH]) {
        expect(pathGroupingFields('line', {[channel]: {field: 'a', type: 'nominal'}})).toEqual(['a']);
      }
    });

    it('should not return a field for size of a trail mark.', () => {
      expect(pathGroupingFields('trail', {size: {field: 'a', type: 'nominal'}})).toEqual([]);
    });

    it('should not return fields for aggregate detail, color, size, opacity fieldDefs.', () => {
      for (const channel of [DETAIL, COLOR, SIZE, OPACITY, FILLOPACITY, STROKEOPACITY, STROKEWIDTH]) {
        expect(pathGroupingFields('line', {[channel]: {aggregate: 'mean', field: 'a', type: 'nominal'}})).toEqual([]);
      }
    });

    it('should return condition detail fields for color, size, shape', () => {
      for (const channel of [COLOR, SIZE, OPACITY, FILLOPACITY, STROKEOPACITY, STROKEWIDTH]) {
        expect(
          pathGroupingFields('line', {
            [channel]: {
              condition: {selection: 'sel', field: 'a', type: 'nominal'}
            }
          })
        ).toEqual(['a']);
      }
    });

    it('should not return errors for all channels', () => {
      for (const channel of UNIT_CHANNELS) {
        expect(() => {
          pathGroupingFields('line', {
            [channel]: {field: 'a', type: 'nominal'}
          });
        }).not.toThrow();
      }
    });

    it('should not include fields from tooltip', () => {
      expect(pathGroupingFields('line', {tooltip: {field: 'a', type: 'nominal'}})).toEqual([]);
    });
  });
});
