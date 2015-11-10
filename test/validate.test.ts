'use strict';

var expect = require('chai').expect,
  ZSchema = require('z-schema'),
  inspect = require('util').inspect,
  dl = require('datalib');

var vl = require('../src/vl'),
  vlSchema = require('../src/schema/schema').schema,
  vgSchema = require('../node_modules/vega/vega-schema.json'),
  examples = require('./examples');


describe('Examples', function() {

  examples.forEach(function(example) {
    validateAgainstSchemas(example.spec, example.title);
  });

  var validator = new ZSchema();
  var errors;

  function validateAgainstSchemas(vlspec, title) {
    it('should be valid and produce valid vega for: ' + title, function() {
      var isVlValid = validator.validate(vlspec, vlSchema);

      if (!isVlValid) {
        errors = validator.getLastErrors();
        console.log(inspect(errors, { depth: 10, colors: true }));
      }
      expect(isVlValid).to.eql(true);

      var stats;

      if (vlspec.data.url) {
        var data = dl.read(dl.load({
          file: vlspec.data.url
        }), {type: 'json', parse: 'auto'});
        stats = vl.data.stats(data);
      }
      var vegaSpec = vl.compile(vlspec, stats);

      var isVgValid = validator.validate(vegaSpec, vgSchema);

      if (!isVgValid) {
        errors = validator.getLastErrors();
        console.log(inspect(errors, { depth: 10, colors: true }));
      }
      expect(isVgValid).to.eql(true);
    });
  }
});
