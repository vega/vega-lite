import {expect} from 'chai';

import * as time from '../../src/compiler/time';
import {Model} from '../../src/compiler/Model';

describe('time', function() {
  var field = 'a',
    timeUnit = 'month',
    encoding = new Model({
      encoding: {
        x: {name: field, type: 'temporal', timeUnit: timeUnit}
      }
    }),
    scales = time.scales(encoding);


  it('should add custom axis scale', function() {
    expect(scales.filter(function(scale) {
      return scale.name === 'time-'+ timeUnit;
    }).length).to.equal(1);
  });

  describe('maxLength', function() {
    it('should return max length of the month custom scale', function () {
      expect(time.maxLength('month', new Model({marktype: 'point'})))
        .to.eql(3);
    });

    it('should return max length of the day custom scale', function () {
      expect(time.maxLength('day', new Model({marktype: 'point'})))
        .to.eql(3);
    });

    it('should return max length of the month custom scale', function () {
      expect(time.maxLength('month', new Model({
        config: {
          timeScaleLabelLength: 0
        }
      }))).to.eql(9);
    });
  });
});
