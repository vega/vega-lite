import {
  CHANNELS,
  isScaleChannel,
  NONPOSITION_SCALE_CHANNELS,
  rangeType,
  SCALE_CHANNELS,
  SINGLE_DEF_CHANNELS,
  supportMark,
  UNIT_CHANNELS,
  X2,
  XERROR,
  XERROR2,
  Y2,
  YERROR,
  YERROR2
} from '../src/channel';
import {Encoding} from '../src/encoding';
import {CIRCLE, POINT, PRIMITIVE_MARKS, SQUARE, TICK} from '../src/mark';
import {without} from '../src/util';

describe('channel', () => {
  describe('UNIT_CHANNELS', () => {
    it('should be CHANNELS without row and column', () => {
      expect(UNIT_CHANNELS).toEqual(without(CHANNELS, ['row', 'column']));
    });
  });

  describe('SINGLE_DEF_CHANNELS', () => {
    it('should be CHANNELS without detail and order', () => {
      expect(SINGLE_DEF_CHANNELS).toEqual(without(CHANNELS, ['detail', 'order']));
    });
  });

  describe('SCALE_CHANNELS', () => {
    it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL, TOOLTIP', () => {
      expect(SCALE_CHANNELS).toEqual(
        without(UNIT_CHANNELS, [
          'x2',
          'y2',
          'xError',
          'yError',
          'xError2',
          'yError2',
          'latitude',
          'longitude',
          'latitude2',
          'longitude2',
          'order',
          'detail',
          'key',
          'text',
          'label',
          'tooltip',
          'href'
        ])
      );
    });
  });

  describe('NONPOSITION_SCALE_CHANNELS', () => {
    it('should be SCALE_CHANNELS without x, y, x2, y2', () => {
      expect(NONPOSITION_SCALE_CHANNELS).toEqual(without(SCALE_CHANNELS, ['x', 'y']));
    });
  });

  describe('isScaleChannel', () => {
    it('should return true for all scale channel', () => {
      for (const channel of SCALE_CHANNELS) {
        expect(isScaleChannel(channel)).toBeTruthy();
      }
    });
  });

  describe('rangeType', () => {
    it('should be defined for all channels (no error).', () => {
      for (const c of CHANNELS) {
        expect(() => {
          rangeType(c);
        }).not.toThrow();
      }
    });
  });

  describe('supportMark', () => {
    it('should support x2 for circle, point, square and tick mark with binned data', () => {
      const encoding: Encoding<string> = {
        x: {
          field: 'bin_start',
          bin: 'binned',
          type: 'quantitative',
          axis: {
            tickStep: 2
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
      expect(supportMark(encoding, X2, CIRCLE)).toBe(true);
      expect(supportMark(encoding, X2, POINT)).toBe(true);
      expect(supportMark(encoding, X2, SQUARE)).toBe(true);
      expect(supportMark(encoding, X2, TICK)).toBe(true);
    });

    it('should support y2 for circle, point, square and tick mark with binned data', () => {
      const encoding: Encoding<string> = {
        y: {
          field: 'bin_start',
          bin: 'binned',
          type: 'quantitative',
          axis: {
            tickStep: 2
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
      expect(supportMark(encoding, Y2, CIRCLE)).toBe(true);
      expect(supportMark(encoding, Y2, POINT)).toBe(true);
      expect(supportMark(encoding, Y2, SQUARE)).toBe(true);
      expect(supportMark(encoding, Y2, TICK)).toBe(true);
    });

    it('should not support x2 for circle, point, square and tick mark without binned data', () => {
      const encoding: Encoding<string> = {
        x: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickStep: 2
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
      expect(supportMark(encoding, X2, CIRCLE)).toBe(false);
      expect(supportMark(encoding, X2, POINT)).toBe(false);
      expect(supportMark(encoding, X2, SQUARE)).toBe(false);
      expect(supportMark(encoding, X2, TICK)).toBe(false);
    });

    it('should not support y2 for circle, point, square and tick mark with binned data', () => {
      const encoding: Encoding<string> = {
        y: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickStep: 2
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
      expect(supportMark(encoding, Y2, CIRCLE)).toBe(false);
      expect(supportMark(encoding, Y2, POINT)).toBe(false);
      expect(supportMark(encoding, Y2, SQUARE)).toBe(false);
      expect(supportMark(encoding, Y2, TICK)).toBe(false);
    });

    it('should not support xError for all marks', () => {
      const encoding: Encoding<string> = {
        y: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickStep: 2
          }
        },
        x: {
          field: 'count',
          type: 'quantitative'
        },
        xError: {
          field: 'count',
          type: 'quantitative'
        }
      };

      for (const m of PRIMITIVE_MARKS) {
        expect(supportMark(encoding, XERROR, m)).toBe(false);
      }
    });

    it('should not support xError2 for all marks', () => {
      const encoding: Encoding<string> = {
        y: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickStep: 2
          }
        },
        x: {
          field: 'count',
          type: 'quantitative'
        },
        xError2: {
          field: 'count'
        }
      };

      for (const m of PRIMITIVE_MARKS) {
        expect(supportMark(encoding, XERROR2, m)).toBe(false);
      }
    });

    it('should not support yError for all marks', () => {
      const encoding: Encoding<string> = {
        x: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickStep: 2
          }
        },
        y: {
          field: 'count',
          type: 'quantitative'
        },
        yError: {
          field: 'count',
          type: 'quantitative'
        }
      };

      for (const m of PRIMITIVE_MARKS) {
        expect(supportMark(encoding, YERROR, m)).toBe(false);
      }
    });

    it('should not support yError2 for all marks', () => {
      const encoding: Encoding<string> = {
        x: {
          field: 'bin_start',
          type: 'quantitative',
          axis: {
            tickStep: 2
          }
        },
        y: {
          field: 'count',
          type: 'quantitative'
        },
        yError2: {
          field: 'count'
        }
      };

      for (const m of PRIMITIVE_MARKS) {
        expect(supportMark(encoding, YERROR2, m)).toBe(false);
      }
    });
  });
});
