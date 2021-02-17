import {TypedFieldDef} from '../../../../src/channeldef';
import {rectBinPosition} from '../../../../src/compile/mark/encode';
import {defaultConfig} from '../../../../src/config';
import * as log from '../../../../src/log';

describe('compile/mark/encode/position-rect', () => {
  const config = defaultConfig;
  describe('rectBinPosition', () => {
    it('produces correct x-mixins for signal reverse', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'x',
        bandSize: 1,
        scaleName: undefined,
        reverse: {signal: 'r'},
        axisTranslate: 0.5, // Vega default
        spacing: 1,
        markDef: {type: 'bar'},
        config
      });
      expect(props.x[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -0.5'
      });
      expect(props.x2[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 0.5'
      });
    });

    it('produces correct x-mixins for binned data with step and start field, without end field', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: {binned: true, step: 2}, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'x',
        bandSize: 1,
        scaleName: 'x',
        reverse: false,
        axisTranslate: 0.5, // Vega default
        spacing: 1,
        markDef: {type: 'bar'},
        config
      });
      expect(props.x).toEqual({
        signal: 'scale("x", datum["x"] + 2)',
        offset: 0
      });
    });

    it('produces correct y-mixins for signal reverse', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'y',
        bandSize: 1,
        scaleName: undefined,
        axisTranslate: 0.5, // Vega default
        reverse: {signal: 'r'},
        spacing: 1,
        markDef: {type: 'bar'},
        config
      });
      expect(props.y2[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -0.5'
      });
      expect(props.y[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 0.5'
      });
    });

    it('produces correct x-mixins for signal reverse (different values)', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'x',
        bandSize: 1,
        scaleName: undefined,
        axisTranslate: 0.5, // Vega default
        reverse: {signal: 'r'},
        spacing: 2,
        markDef: {type: 'bar'},
        config
      });
      expect(props.x[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -1'
      });
      expect(props.x2[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 1'
      });
    });

    it('produces correct y-mixins for signal reverse with different spacing', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'y',
        bandSize: 1,
        scaleName: undefined,
        axisTranslate: 0.5, // Vega default
        reverse: {signal: 'r'},
        spacing: 2,
        markDef: {type: 'bar'},
        config
      });
      expect(props.y2[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * -1'
      });
      expect(props.y[1].offset).toEqual({
        signal: '0.5 + (r ? -1 : 1) * 1'
      });
    });

    it(
      'generates warning for invalid binned spec without x2',
      log.wrap(logger => {
        const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = rectBinPosition({
          fieldDef,
          channel: 'x',
          bandSize: 1,
          scaleName: undefined,
          axisTranslate: 0.5, // Vega default
          reverse: false,
          markDef: {type: 'bar'},
          config
        });
        expect(props).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('x2'));
      })
    );

    it(
      'generates warning for invalid binned spec without y2',
      log.wrap(logger => {
        const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = rectBinPosition({
          fieldDef,
          channel: 'y',
          bandSize: 1,
          scaleName: undefined,
          axisTranslate: 0.5, // Vega default
          reverse: false,
          markDef: {type: 'bar'},
          config
        });
        expect(props).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('y2'));
      })
    );

    it('produces correct x-mixins for signal translate', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'x',
        bandSize: 1,
        scaleName: undefined,
        axisTranslate: {signal: 't'}, // Vega default
        reverse: false,
        spacing: 1,
        markDef: {type: 'bar'},
        config
      });
      expect(props.x[1].offset).toEqual({
        signal: 't + -0.5'
      });
      expect(props.x2[1].offset).toEqual({
        signal: 't + 0.5'
      });
    });

    it('produces correct x-mixins for signal translate, signal reverse, signal offset', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'x',
        bandSize: 1,
        scaleName: undefined,
        axisTranslate: {signal: 't'}, // Vega default
        reverse: {signal: 'r'},
        spacing: 1,
        markDef: {type: 'bar', xOffset: {signal: 'o'}},
        config
      });
      expect(props.x[1].offset).toEqual({
        signal: 't + (r ? -1 : 1) * (o + -0.5)'
      });
      expect(props.x2[1].offset).toEqual({
        signal: 't + (r ? -1 : 1) * (o + 0.5)'
      });
    });
  });
});
