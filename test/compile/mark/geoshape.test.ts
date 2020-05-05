import {geoshape} from '../../../src/compile/mark/geoshape';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Geoshape', () => {
  describe('encode', () => {
    it('should create no properties', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa'
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {
          color: {
            value: 'black'
          },
          opacity: {
            value: 0.8
          }
        },
        config: {mark: {tooltip: null}}
      });
      const props = geoshape.encodeEntry(model);
      expect({
        ariaRoleDescription: {
          value: 'geoshape'
        },
        fill: {
          value: 'black'
        },
        opacity: {
          value: 0.8
        }
      }).toEqual(props);
    });
  });
});
