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
