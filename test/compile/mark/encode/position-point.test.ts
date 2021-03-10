import {getSizeChannel, X, Y} from '../../../../src/channel';
import {pointPosition} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/position-point', () => {
  it('should return correctly for lat/lng', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        url: 'data/zipcodes.csv',
        format: {
          type: 'csv'
        }
      },
      mark: 'point',
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
      const mixins = pointPosition(channel, model, {defaultPos: 'zeroOrMin'});
      expect(mixins[channel]['field']).toEqual(model.getName(channel));
    });
  });

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
      const mixins = pointPosition(channel, model, {defaultPos: 'zeroOrMin'});
      expect(mixins[channel]['field']).toEqual(model.getName(channel));

      const sizeChannel = getSizeChannel(channel);
      expect(mixins[sizeChannel]).toEqual({[sizeChannel]: 42});
    });
  });
});
