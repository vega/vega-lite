'use strict';

var expect = require('chai').expect,
  _ = require('lodash');

var time = require('../../src/compile/time'),
  Encoding = require('../../src/Encoding');

describe('Time', function() {
  var fieldName = 'a',
    fn = 'month',
    encoding = Encoding.fromSpec({
      enc: {
        x: {name: fieldName, type: 'T', fn: fn}
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
      return scale.name == 'time-'+ fn;
    }).length).to.equal(1);
  });
});
