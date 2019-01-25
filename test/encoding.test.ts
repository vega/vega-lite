import {X2, Y2} from '../src/channel';
import {defaultConfig} from '../src/config';
import {Encoding, extractTransformsFromEncoding, markChannelCompatible, normalizeEncoding} from '../src/encoding';
import {isPositionFieldDef} from '../src/fielddef';
import * as log from '../src/log';
import {CIRCLE, POINT, SQUARE, TICK} from '../src/mark';
import {internalField} from '../src/util';

describe('encoding', () => {
  describe('normalizeEncoding', () => {
    it(
      'should drop color channel if fill is specified',
      log.wrap(logger => {
        const encoding = normalizeEncoding(
          {
            color: {field: 'a', type: 'quantitative'},
            fill: {field: 'b', type: 'quantitative'}
          },
          'rule'
        );

        expect(encoding).toEqual({
          fill: {field: 'b', type: 'quantitative'}
        });
        expect(logger.warns[0]).toEqual(log.message.droppingColor('encoding', {fill: true}));
      })
    );

    it(
      'should drop color channel if stroke is specified',
      log.wrap(logger => {
        const encoding = normalizeEncoding(
          {
            color: {field: 'a', type: 'quantitative'},
            stroke: {field: 'b', type: 'quantitative'}
          },
          'rule'
        );

        expect(encoding).toEqual({
          stroke: {field: 'b', type: 'quantitative'}
        });
        expect(logger.warns[0]).toEqual(log.message.droppingColor('encoding', {stroke: true}));
      })
    );
  });

  describe('extractTransformsFromEncoding', () => {
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
        normalizeEncoding(
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
              format: '%b %d, %Y %H:%M',
              formatType: 'time'
            }
          },
          y: {field: 'b', type: 'quantitative'}
        }
      });
    });
    it('should extract aggregates from encoding', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncoding(
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
        normalizeEncoding(
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
        groupby: ['bin_maxbins_10_a_end', 'bin_maxbins_10_a_range', 'bin_maxbins_10_a'],
        encoding: {
          x: {field: 'bin_maxbins_10_a', type: 'quantitative', title: 'a (binned)', bin: 'binned'},
          x2: {field: 'bin_maxbins_10_a_end'},
          y: {field: internalField('count'), type: 'quantitative', title: 'Count of Records'}
        }
      });
    });
    it('should preserve auxiliary properties (i.e. axis) in encoding', () => {
      const output = extractTransformsFromEncoding(
        normalizeEncoding(
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
});
