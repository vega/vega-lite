var expect = require('chai').expect,
  _ = require('lodash');

var globals = require('../src/globals'),
  compile = require('../src/compile'),
  Encoding = require('../src/Encoding');

describe('vl.compile', function () {
  describe('timeField', function () {
    var fieldName = 'a',
      fn = 'month',
      encoding = Encoding.fromSpec({
        enc: {
          x: {name: fieldName, type:"T", fn: fn}
        }
      }),
      spec = compile.timeField({
        data: [{name:TABLE}]
      }, encoding, {});

    it('add formula transform', function () {
      expect(spec.transform).to.be.ok();
      expect(spec.transform.filter(function(t){
        return t.type === "formula" && t.field == encoding.field('x') &&
          t.expr === "new Date(d.data."+fieldName+")."+fn+"()";
      }).length).to.be.above(0);
    });

    it('should add custom axis scale', function () {
      expect(spec.scales.filter(function(scale){
        return scale.name == "time-"+fn;
      }).length).to.equal(1);
    });
  });
});