import {X, Y} from '../../../../src/channel';
import {pointPosition} from '../../../../src/compile/mark/encode';
import {pointPositionDefaultRef} from '../../../../src/compile/mark/encode/position-point';
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
  it('should have scale for secondary channel', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {type: 'bar'},
      encoding: {
        x: {
          field: 'x',
          type: 'quantitative',
          scale: {
            domain: [1, 4],
            reverse: true
          },
          stack: false
        },
        y: {field: 'y', type: 'nominal'}
      },
      data: {
        values: [
          {x: 2, y: 'A'},
          {x: 3, y: 'B'}
        ]
      }
    });
    () => {
      const channel1 = 'x';
      const defaultPos = 'zeroOrMin';
      const scaleName = model.scaleName(channel1);
      const scale = model.getScaleComponent(channel1);
      const channel = 'x2';
      const mixins = pointPositionDefaultRef({model, defaultPos, channel, scaleName, scale});
      expect(mixins[channel].scale).toEqual(scaleName);
    };
  });
});
