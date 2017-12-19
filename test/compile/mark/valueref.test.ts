/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X, Y} from '../../../src/channel';
import {midPoint} from '../../../src/compile/mark/valueref';
import {field, isFieldDef} from '../../../src/fielddef';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/mark/valueref', () => {
  describe('midPoint()', function() {
    it('should return correctly for lat/lng', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {
          "url": "data/zipcodes.csv",
          "format": {
            "type": "csv"
          }
        },
        "mark": "point",
        "encoding": {
          "x": {
            "field": "longitude",
            "type": "longitude"
          },
          "y": {
            "field": "latitude",
            "type": "latitude"
          }
        }
      });

      [X, Y].forEach((channel) => {
        const channelDef = model.encoding[channel];
        const scaleName = model.scaleName(channel);
        const scaleComponent = model.getScaleComponent(channel);
        const def = midPoint(
          channel, channelDef, scaleName, scaleComponent,
          null, null
        );
        assert.isTrue(channelDef && isFieldDef(channelDef));
        if (channelDef && isFieldDef(channelDef)) {
          assert.equal(def.field, field(channelDef, {suffix: 'geo'}));
        }
      });
    });
  });
});
