import {assert} from 'chai';
import {
  isScaleChannel,
  rangeType,
  SINGLE_DEF_CHANNELS,
  supportMark,
  X2,
  XERROR,
  XERROR2,
  Y2,
  YERROR,
  YERROR2
} from '../src/channel';
import {CHANNELS, NONPOSITION_SCALE_CHANNELS, SCALE_CHANNELS, UNIT_CHANNELS} from '../src/channel';
import {Encoding} from '../src/encoding';
import {CIRCLE, POINT, PRIMITIVE_MARKS, SQUARE, TICK} from '../src/mark';
import {without} from '../src/util';

describe('channel', () => {
  describe('UNIT_CHANNELS', () => {
    it('should be CHANNELS without row and column', () => {
      assert.deepEqual(UNIT_CHANNELS, without(CHANNELS, ['row', 'column']));
    });
  });

  describe('SINGLE_DEF_CHANNELS', () => {
    it('should be CHANNELS without detail and order', () => {
      assert.deepEqual(SINGLE_DEF_CHANNELS, without(CHANNELS, ['detail', 'order']));
    });
  });

  describe('SCALE_CHANNELS', () => {
    it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL, TOOLTIP', () => {
      assert.deepEqual(
        SCALE_CHANNELS,
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
      assert.deepEqual(NONPOSITION_SCALE_CHANNELS, without(SCALE_CHANNELS, ['x', 'y']));
    });
  });

  describe('isScaleChannel', () => {
    it('should return true for all scale channel', () => {
      for (const channel of SCALE_CHANNELS) {
        assert(isScaleChannel(channel));
      }
    });
  });

  describe('rangeType', () => {
    it('should be defined for all channels (no error).', () => {
      for (const c of CHANNELS) {
        assert.doesNotThrow(() => {
          rangeType(c);
        });
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
          field: 'bin_end',
          type: 'quantitative'
        },
        y: {
          field: 'count',
          type: 'quantitative'
        }
      };
      assert.isTrue(supportMark(encoding, X2, CIRCLE));
      assert.isTrue(supportMark(encoding, X2, POINT));
      assert.isTrue(supportMark(encoding, X2, SQUARE));
      assert.isTrue(supportMark(encoding, X2, TICK));
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
          field: 'bin_end',
          type: 'quantitative'
        },
        x: {
          field: 'count',
          type: 'quantitative'
        }
      };
      assert.isTrue(supportMark(encoding, Y2, CIRCLE));
      assert.isTrue(supportMark(encoding, Y2, POINT));
      assert.isTrue(supportMark(encoding, Y2, SQUARE));
      assert.isTrue(supportMark(encoding, Y2, TICK));
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
          field: 'bin_end',
          type: 'quantitative'
        },
        y: {
          field: 'count',
          type: 'quantitative'
        }
      };
      assert.isFalse(supportMark(encoding, X2, CIRCLE));
      assert.isFalse(supportMark(encoding, X2, POINT));
      assert.isFalse(supportMark(encoding, X2, SQUARE));
      assert.isFalse(supportMark(encoding, X2, TICK));
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
          field: 'bin_end',
          type: 'quantitative'
        },
        x: {
          field: 'count',
          type: 'quantitative'
        }
      };
      assert.isFalse(supportMark(encoding, Y2, CIRCLE));
      assert.isFalse(supportMark(encoding, Y2, POINT));
      assert.isFalse(supportMark(encoding, Y2, SQUARE));
      assert.isFalse(supportMark(encoding, Y2, TICK));
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
        assert.isFalse(supportMark(encoding, XERROR, m));
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
          field: 'count',
          type: 'quantitative'
        }
      };

      for (const m of PRIMITIVE_MARKS) {
        assert.isFalse(supportMark(encoding, XERROR2, m));
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
        assert.isFalse(supportMark(encoding, YERROR, m));
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
          field: 'count',
          type: 'quantitative'
        }
      };

      for (const m of PRIMITIVE_MARKS) {
        assert.isFalse(supportMark(encoding, YERROR2, m));
      }
    });
  });
});
