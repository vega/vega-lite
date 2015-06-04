'use strict';

var expect = require('chai').expect;

var time = require('../../src/compile/time'),
  Encoding = require('../../src/Encoding');

describe('Time', function() {
  var fieldName = 'a',
    timeUnit = 'month',
    encoding = Encoding.fromSpec({
      encoding: {
        x: {name: fieldName, type: 'T', timeUnit: timeUnit}
      }
    }),
    spec = time({data: [{name: RAW}, {name: TABLE}]}, encoding, {});

  it('should add formula transform', function() {
    var data = spec.data[1];
    expect(data.transform).to.be.ok();

    expect(data.transform.filter(function(t) {
      return t.type === 'formula' && t.field === encoding.field('x') &&
        t.expr === time.formula(encoding._enc.x);
    }).length).to.be.above(0);
  });

  it('should add custom axis scale', function() {
    expect(spec.scales.filter(function(scale) {
      return scale.name == 'time-'+ timeUnit;
    }).length).to.equal(1);
  });
});
