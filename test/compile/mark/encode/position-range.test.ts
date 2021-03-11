import {getSizeChannel, X, Y} from '../../../../src/channel';
import {rangePosition} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/position-range', () => {
  it('should return correctly for lat/lng with size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        url: 'data/zipcodes.csv',
        format: {
          type: 'csv'
        }
      },
      mark: {
        type: 'image',
        width: 42,
        height: 42
      },
      encoding: {
        longitude: {
          field: 'longitude',
          type: 'quantitative'
        },
        latitude: {
          field: 'latitude',
          type: 'quantitative'
        }
      }
    });

    [X, Y].forEach(channel => {
      const mixins = rangePosition(channel, model, {defaultPos: 'zeroOrMin', defaultPos2: 'zeroOrMin'});
      expect(mixins[channel + 'c']['field']).toEqual(model.getName(channel));

      const sizeChannel = getSizeChannel(channel);
      expect(mixins[sizeChannel]).toEqual({value: 42});
    });
  });
});
