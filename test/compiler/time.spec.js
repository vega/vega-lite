'use strict';

var expect = require('chai').expect;

var time = require('../../src/compiler/time'),
  Encoding = require('../../src/Encoding');

describe('time', function() {
  var fieldName = 'a',
    timeUnit = 'month',
    encoding = Encoding.fromSpec({
      encoding: {
        x: {name: fieldName, type: 'T', timeUnit: timeUnit}
      }
    }),
    spec = time({data: [{name: RAW}, {name: TABLE}]}, encoding, {});

  it('should add formula transform', function() {
    var data = spec.data[0];
    expect(data.transform).to.be.ok;

    expect(data.transform.filter(function(t) {
      return t.type === 'formula' && t.field === encoding.fieldRef('x') &&
        t.expr === time.formula(encoding._enc.x);
    }).length).to.be.above(0);
  });

  it('should add custom axis scale', function() {
    expect(spec.scales.filter(function(scale) {
      return scale.name == 'time-'+ timeUnit;
    }).length).to.equal(1);
  });

  describe('maxLength', function(){
    it('should return max length based on time format', function () {
      expect(time.maxLength(undefined /*no timeUnit*/, {
          config: function(){ return '%A %B %e %H:%M:%S %Y';}
        }))
        .to.eql('Wednesday September 17 04:00:00 2014'.length);
    });

    it('should return max length of the month custom scale', function () {
      expect(time.maxLength('month', Encoding.fromSpec({mark: 'point'})))
        .to.eql(3);
    });

    it('should return max length of the day custom scale', function () {
      expect(time.maxLength('day', Encoding.fromSpec({mark: 'point'})))
        .to.eql(3);
    });

    it.only('should return max length of the month custom scale', function () {
      expect(time.maxLength('month', Encoding.fromSpec({
        mark: 'point',
        config: {
          timeScaleLabelLength: 0
        }
      }))).to.eql(9);
    });
  });
});
