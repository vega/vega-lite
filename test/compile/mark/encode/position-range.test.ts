import {getSizeChannel, X, Y} from '../../../../src/channel';
import {rangePosition} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/position-range', () => {
  it('should return correct position for lat/lng with size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        url: 'data/zipcodes.csv'
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
      expect(mixins[`${channel}c`]['field']).toEqual(model.getName(channel));

      const sizeChannel = getSizeChannel(channel);
      expect(mixins[sizeChannel]).toEqual({value: 42});
    });
  });

  it('should return correct position for lat/lng with without size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        values: [
          {
            latitude: 0,
            longitude: 0,
            latitude2: 30,
            longitude2: 30
          },
          {
            latitude: -10,
            longitude: -10,
            latitude2: 20,
            longitude2: 20
          }
        ]
      },
      mark: 'rect',
      encoding: {
        longitude: {field: 'longitude', type: 'quantitative'},
        latitude: {field: 'latitude', type: 'quantitative'},
        longitude2: {field: 'longitude2'},
        latitude2: {field: 'latitude2'}
      }
    });

    [X, Y].forEach(channel => {
      const mixins = rangePosition(channel, model, {defaultPos: 'zeroOrMin', defaultPos2: 'zeroOrMin'});
      expect(mixins[channel]['field']).toEqual(model.getName(channel));
      expect(mixins[`${channel}2`]['field']).toEqual(model.getName(`${channel}2`));
    });
  });
});
