import {OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX} from '../../../../src/compile/data/timeunit.js';
import {rectPosition} from '../../../../src/compile/mark/encode/position-rect.js';
import * as log from '../../../../src/log/index.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util.js';

describe('compile/mark/encode/position-rect', () => {
  describe('rectPosition', () => {
    it('produces correct x-mixins for signal reverse', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {
            bin: true,
            field: 'x',
            type: 'quantitative',
            scale: {reverse: {signal: 'r'}},
          },
        },
        config: {bar: {minBandSize: null}},
      });

      const props = rectPosition(model, 'x');
      expect((props.x as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -0.5',
      });
      expect((props.x2 as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 0.5',
      });
    });

    it('produces correct x-mixins for xOffset without x', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: 'bar',
        encoding: {
          xOffset: {
            field: 'a',
            type: 'nominal',
          },
          y: {
            field: 'b',
            type: 'quantitative',
          },
        },
      });

      const props = rectPosition(model, 'x');
      expect(props.x).toEqual({
        signal: 'width',
        mult: 0.5,
        offset: {scale: 'xOffset', field: 'a'},
      });
      expect(props.width).toEqual({
        signal: `max(0.25, bandwidth('xOffset'))`,
      });
    });

    it('produces correct x-mixins for timeUnit with bandPosition = 0', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {
            timeUnit: 'yearmonth',
            field: 'date',
            type: 'temporal',
            bandPosition: 0,
          },
        },
      });

      const props = rectPosition(model, 'x');
      expect((props.x as any).field).toBe(`yearmonth_date_${OFFSETTED_RECT_END_SUFFIX}`);
      expect((props.x2 as any).field).toBe(`yearmonth_date_${OFFSETTED_RECT_START_SUFFIX}`);
    });

    it('produces correct xc for tick with explicit size and timeUnitBandPosition = 0', () => {
      // https://github.com/vega/vega-lite/issues/9836
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'tick', size: {expr: '20'}},
        encoding: {
          x: {timeUnit: 'binnedutcyear', field: 'date', type: 'temporal'},
          y: {field: 'v', type: 'quantitative'},
        },
        config: {tick: {timeUnitBandPosition: 0}},
      });

      const props = rectPosition(model, 'x');
      // With bandPosition=0, the tick center should sit on the bin start
      // (the raw `date` field), matching the bar's center under the same
      // timeUnitBandPosition: 0 config.
      expect((props.xc as any).scale).toBe('x');
      expect((props.xc as any).field).toBe('date');
    });

    it('uses bandPosition 0 for a centered bar with explicit size and xOffset encoding', () => {
      // Exercises the `offsetType === 'encoding' ? 0 : 0.5` branch of
      // `positionAndSize`. The explicit `size` forces center alignment; the
      // sub-band shift then comes from the xOffset encoding.
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar', size: 20},
        encoding: {
          x: {field: 'a', type: 'nominal'},
          xOffset: {field: 'b', type: 'nominal'},
          y: {field: 'c', type: 'quantitative'},
        },
      });

      const props = rectPosition(model, 'x');
      expect((props.xc as any).scale).toBe('x');
      expect((props.xc as any).field).toBe('a');
      expect((props.xc as any).offset?.scale).toBe('xOffset');
      expect((props.xc as any).offset?.field).toBe('b');
    });

    it('produces correct x for a left-aligned bar with signal bandSize', () => {
      // Exercises the `isSignalRef(bandSize)` branch of the
      // non-center position expression in `positionAndSize`.
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar', align: 'left', size: {signal: 's'}},
        encoding: {
          x: {field: 'a', type: 'nominal'},
          y: {field: 'b', type: 'quantitative'},
        },
      });

      const props = rectPosition(model, 'x');
      // A signal-valued band size drops into the `(1-${bandSize})/2` branch.
      expect((props.x as any).band?.signal).toContain('(1-');
      expect((props.width as any).signal).toBe('s');
    });

    it('produces correct x for a left-aligned bar with numeric size', () => {
      // Exercises the final `: 0` fallback branch of the non-center
      // position expression in `positionAndSize`.
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar', align: 'left', size: 20},
        encoding: {
          x: {field: 'a', type: 'nominal'},
          y: {field: 'b', type: 'quantitative'},
        },
      });

      const props = rectPosition(model, 'x');
      expect((props.x as any).scale).toBe('x');
      expect((props.x as any).field).toBe('a');
      expect(props.width).toEqual({value: 20});
    });

    it('produces correct x-mixins for binned data with step and start field, without end field', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {
            bin: {binned: true, step: 2},
            field: 'x',
            type: 'quantitative',
          },
        },
        config: {bar: {minBandSize: null}},
      });

      const props = rectPosition(model, 'x');

      expect(props.x).toEqual({
        signal: 'scale("x", datum["x"] + 2)',
        offset: 0,
      });
    });

    it('produces correct y-mixins for signal reverse', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: 'bar',
        encoding: {
          y: {
            bin: true,
            field: 'x',
            type: 'quantitative',
            scale: {reverse: {signal: 'r'}},
          },
        },
        config: {bar: {minBandSize: null}},
      });

      const props = rectPosition(model, 'y');
      expect((props.y2 as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -0.5',
      });
      expect((props.y as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 0.5',
      });
    });

    it('produces correct x-mixins for signal reverse with custom spacing', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar', binSpacing: 2},
        encoding: {
          x: {
            bin: true,
            field: 'x',
            type: 'quantitative',
            scale: {reverse: {signal: 'r'}},
          },
        },
        config: {bar: {minBandSize: null}},
      });

      const props = rectPosition(model, 'x');

      expect((props.x as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -1',
      });
      expect((props.x2 as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 1',
      });
    });

    it('produces correct y-mixins for signal reverse with different spacing', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar', binSpacing: 2},
        encoding: {
          y: {
            bin: true,
            field: 'x',
            type: 'quantitative',
            scale: {reverse: {signal: 'r'}},
          },
        },
        config: {bar: {minBandSize: null}},
      });

      const props = rectPosition(model, 'y');
      expect((props.y2 as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -1',
      });
      expect((props.y as any).offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 1',
      });
    });

    it(
      'generates warning for invalid binned spec without x2',
      log.wrap((logger) => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          data: {values: []},
          mark: {type: 'bar', binSpacing: 2},
          encoding: {
            x: {
              bin: 'binned',
              field: 'x',
              type: 'quantitative',
              scale: {reverse: {signal: 'r'}},
            },
          },
        });

        const props = rectPosition(model, 'x');
        expect(props).toBeUndefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('x2'));
      }),
    );

    it(
      'generates warning for invalid binned spec without y2',
      log.wrap((logger) => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          data: {values: []},
          mark: {type: 'bar', binSpacing: 2},
          encoding: {
            y: {
              bin: 'binned',
              field: 'y',
              type: 'quantitative',
              scale: {reverse: {signal: 'r'}},
            },
          },
        });

        const props = rectPosition(model, 'y');
        expect(props).toBeUndefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('y2'));
      }),
    );

    it('produces correct x-mixins for signal translate', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {
            bin: true,
            field: 'x',
            type: 'quantitative',
            axis: {translate: {signal: 't'}},
          },
        },
        config: {bar: {minBandSize: null}},
      });
      model.parseAxesAndHeaders();

      const props = rectPosition(model, 'x');
      expect((props.x as any).offset).toEqual({
        signal: 't + -0.5',
      });
      expect((props.x2 as any).offset).toEqual({
        signal: 't + 0.5',
      });
    });

    it('produces correct x-mixins for signal translate, signal reverse, signal offset', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar', xOffset: {signal: 'o'}},
        encoding: {
          x: {
            bin: true,
            field: 'x',
            type: 'quantitative',
            scale: {reverse: {signal: 'r'}},
            axis: {translate: {signal: 't'}},
          },
        },
        config: {bar: {minBandSize: null}},
      });
      model.parseAxesAndHeaders();

      const props = rectPosition(model, 'x');
      expect((props.x as any).offset).toEqual({
        signal: 't + (r ? -1 : 1) * (o + -0.5)',
      });
      expect((props.x2 as any).offset).toEqual({
        signal: 't + (r ? -1 : 1) * (o + 0.5)',
      });
    });

    it('produces correct default y-mixins for empty y encoding', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {values: []},
        mark: {type: 'bar'},
        encoding: {
          x: {
            field: 'x',
            type: 'quantitative',
            aggregate: 'mean',
          },
        },
      });

      const props = rectPosition(model, 'y');
      expect(props.height).toEqual({
        signal: '0.9 * height',
      });
    });
  });
});
