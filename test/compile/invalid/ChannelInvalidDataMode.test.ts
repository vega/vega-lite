import {NONPOSITION_SCALE_CHANNELS, POSITION_SCALE_CHANNELS, SCALE_CHANNELS} from '../../../src/channel.js';
import {getScaleInvalidDataMode} from '../../../src/compile/invalid/ScaleInvalidDataMode.js';
import {defaultConfig} from '../../../src/config.js';
import {MarkInvalidDataMode} from '../../../src/invalid.js';
import {PATH_MARKS, PRIMITIVE_MARKS} from '../../../src/mark.js';

describe('compile / invalid / ChannelInvalidDataMode / getChannelInvalidDataMode()', () => {
  const ALL_MARK_INVALID_MODE: MarkInvalidDataMode[] = [
    'filter',
    'break-paths-filter-domains',
    'break-paths-show-domains',
    'show',
    'break-paths-show-path-domains',
  ];

  describe.each([...PRIMITIVE_MARKS])('For all marks (%s)', (mark) => {
    it.each(ALL_MARK_INVALID_MODE)('should return always valid for count', (invalid) => {
      expect(
        getScaleInvalidDataMode({
          markDef: {type: mark, invalid},
          scaleChannel: 'color',
          scaleType: 'linear',
          isCountAggregate: true,
          config: {
            ...defaultConfig,
            scale: {
              ...defaultConfig.scale,
              invalid: {color: {value: 'red'}},
            },
          },
        }),
      ).toBe('always-valid');
    });

    it.each(ALL_MARK_INVALID_MODE)('should return always valid for count', (invalid) => {
      expect(
        getScaleInvalidDataMode({
          markDef: {type: mark, invalid},
          scaleChannel: 'color',
          scaleType: 'band',
          isCountAggregate: true,
          config: {
            ...defaultConfig,
            scale: {
              ...defaultConfig.scale,
              invalid: {color: {value: 'red'}},
            },
          },
        }),
      ).toBe('always-valid');
    });

    it.each(ALL_MARK_INVALID_MODE)(
      'should return "include" for all invalid mode (%s) if invalid output color is specified',
      (invalid) => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid},
            scaleChannel: 'color',
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {color: {value: 'red'}},
              },
            },
          }),
        ).toBe('show');
      },
    );

    it.each(ALL_MARK_INVALID_MODE)(
      'should return "include" for all invalid mode (%s) if invalid output size is specified',
      (invalid) => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid},
            scaleChannel: 'size',
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {size: {value: 4}},
              },
            },
          }),
        ).toBe('show');
      },
    );

    describe.each(POSITION_SCALE_CHANNELS)('for all position scale channel (%s)', (channel) => {
      it('should return include by default for include mode if scale invalid config is not specified', () => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid: 'show'},
            scaleChannel: channel,
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {},
              },
            },
          }),
        ).toBe('show');
      });
    });

    describe.each(NONPOSITION_SCALE_CHANNELS)('for all non-position scale channel (%s)', (channel) => {
      it('should return show by default for show mode if scale invalid config is not specified', () => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid: 'show'},
            scaleChannel: channel,
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {},
              },
            },
          }),
        ).toBe('show');
      });
    });

    describe.each(SCALE_CHANNELS)('for all scale channel (%s)', (channel) => {
      const OTHER_MODES: MarkInvalidDataMode[] = ['break-paths-filter-domains', 'break-paths-show-domains', 'filter'];

      it.each(OTHER_MODES)('should return the mode (%s)', (mode) => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid: mode},
            scaleChannel: channel,
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {},
              },
            },
          }),
        ).toEqual(mode);
      });
    });
  });

  describe.each(PATH_MARKS)('For all path marks (%s)', (mark) => {
    describe.each(SCALE_CHANNELS)('for all scale channel (%s)', (channel) => {
      it('should return the mode (%s)', () => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid: 'break-paths-show-path-domains'},
            scaleChannel: channel,
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {},
              },
            },
          }),
        ).toBe('break-paths-show-domains');
      });
    });
  });

  describe.each(PATH_MARKS)('For all path marks (%s)', (mark) => {
    describe.each(SCALE_CHANNELS)('for all scale channel (%s)', (channel) => {
      it('should return the mode (%s)', () => {
        expect(
          getScaleInvalidDataMode({
            markDef: {type: mark, invalid: 'break-paths-show-path-domains'},
            scaleChannel: channel,
            scaleType: 'linear',
            isCountAggregate: false,
            config: {
              ...defaultConfig,
              scale: {
                ...defaultConfig.scale,
                invalid: {},
              },
            },
          }),
        ).toBe('break-paths-show-domains');
      });
    });
  });
});
