import {TypedFieldDef} from '../../../../src/channeldef';
import {rectBinPosition} from '../../../../src/compile/mark/encode';
import {defaultConfig} from '../../../../src/config';
import * as log from '../../../../src/log';

describe('compile/mark/encoding/position-rect', () => {
  const config = defaultConfig;
  describe('rectBinPosition', () => {
    it('produces correct x-mixins for signal reverse', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'x',
        band: 1,
        scaleName: undefined,
        reverse: {signal: 'r'},
        spacing: 2,
        markDef: {type: 'bar'},
        config
      });
      expect(props.x[1].offset).toEqual({
        signal: 'r ? 2 : 0'
      });
      expect(props.x2[1].offset).toEqual({
        signal: 'r ? 0 : 2'
      });
    });

    it('produces correct y-mixins for signal reverse', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'x', bin: true, type: 'quantitative'};
      const props = rectBinPosition({
        fieldDef,
        channel: 'y',
        band: 1,
        scaleName: undefined,
        reverse: {signal: 'r'},
        spacing: 2,
        markDef: {type: 'bar'},
        config
      });
      expect(props.y2[1].offset).toEqual({
        signal: 'r ? 2 : 0'
      });
      expect(props.y[1].offset).toEqual({
        signal: 'r ? 0 : 2'
      });
    });

    it(
      'generates warning for invalid binned spec without x2',
      log.wrap(logger => {
        const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = rectBinPosition({
          fieldDef,
          channel: 'x',
          band: 1,
          scaleName: undefined,
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
          band: 1,
          scaleName: undefined,
          reverse: false,
          markDef: {type: 'bar'},
          config
        });
        expect(props).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('y2'));
      })
    );
  });
});
