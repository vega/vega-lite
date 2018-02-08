/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X, Y} from '../../../src/channel';
import {getOffset, midPoint} from '../../../src/compile/mark/valueref';
import {isFieldDef, vgField} from '../../../src/fielddef';
import {MarkDef} from '../../../src/mark';
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
          assert.equal(def.field, vgField(channelDef, {suffix: 'geo'}));
        }
      });
    });
  });

  describe("getOffset", function() {
    const markDef: MarkDef = {
      "type": "point",
      "x2Offset": 100
    };
    it('should correctly get the offset value for the given channel', function() {
      assert.equal(getOffset('x2', markDef), 100);
    });
    it('should return undefined when the offset value for the given channel is not defined', function() {
      assert.equal(getOffset('x', markDef), undefined);
    });
  });
});
