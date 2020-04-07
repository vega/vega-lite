import {nonPosition} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/nonPosition', () => {
  it('respects default value for a particular channel', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {
          field: 'Acceleration',
          type: 'quantitative'
        },
        y: {
          field: 'Horsepower',
          type: 'quantitative'
        }
      }
    });

    const mixins = nonPosition('opacity', model);
    expect(mixins.opacity).toEqual({value: 0.7});
  });
});
