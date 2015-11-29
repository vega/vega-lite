import {expect} from 'chai';

import * as time from '../../src/compiler/time';
import {Model} from '../../src/compiler/Model';

describe('time', function() {
  var field = 'a',
    timeUnit = 'month',
    encoding = new Model({
      encoding: {
        x: {field: field, type: 'temporal', timeUnit: timeUnit}
      }
    }),
    scales = time.scales(encoding);


  it('should add custom axis scale', function() {
    expect(scales.filter(function(scale) {
      return scale.name === 'time-'+ timeUnit;
    }).length).to.equal(1);
  });
});
