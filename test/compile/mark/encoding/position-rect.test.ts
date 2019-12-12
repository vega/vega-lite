import {TypedFieldDef} from '../../../../src/channeldef';
import {rectBinPosition} from '../../../../src/compile/mark/encode';
import * as log from '../../../../src/log';

describe('compile/mark/encoding/position-rect', () => {
  describe('rectBinPosition', () => {
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
          markDef: {type: 'bar'}
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
          markDef: {type: 'bar'}
        });
        expect(props).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('y2'));
      })
    );
  });
});
