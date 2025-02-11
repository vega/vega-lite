import {X, Y} from '../../../../src/channel.js';
import {pointPosition} from '../../../../src/compile/mark/encode.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util.js';

describe('compile/mark/encode/position-point', () => {
  it('should return correctly for lat/lng', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        url: 'data/zipcodes.csv',
        format: {
          type: 'csv',
        },
      },
      mark: 'point',
      encoding: {
        longitude: {
          field: 'longitude',
          type: 'quantitative',
        },
        latitude: {
          field: 'latitude',
          type: 'quantitative',
        },
      },
    });

    [X, Y].forEach((channel) => {
      const mixins = pointPosition(channel, model, {defaultPos: 'zeroOrMin'});
      expect((mixins[channel] as any).field).toEqual(model.getName(channel));
    });
  });
});
