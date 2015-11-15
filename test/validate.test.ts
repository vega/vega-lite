import {expect} from 'chai';
import {getEncodingMappingError} from '../src/validate';

var ZSchema = require('z-schema'),
  inspect = require('util').inspect,
  dl = require('datalib');

var vl = require('../src/vl'),
  vlSchema = require('../src/schema/schema').schema,
  vgSchema = require('../node_modules/vega/vega-schema.json'),
  examples = require('./examples');

describe('vl.validate', function() {
  describe('getEncodingMappingError()', function () {
    it('should return no error for valid specs', function() {
      expect(getEncodingMappingError({
        marktype: 'bar',
        encoding: {
          x: {name: 'a'}
        }
      })).to.be.null;

      expect(getEncodingMappingError({
        marktype: 'line',
        encoding: {
          x: {name: 'b'},
          y: {name: 'a'}
        }
      })).to.be.null;

      expect(getEncodingMappingError({
        marktype: 'area',
        encoding: {
          x: {name: 'a'},
          y: {name: 'b'}
        }
      })).to.be.null;
    });

    it('should return error for invalid specs', function() {
      expect(getEncodingMappingError({
        marktype: 'line',
        encoding: {
          x: {name: 'b'} // missing y
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: 'area',
        encoding: {
          y: {name: 'b'} // missing x
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: 'text',
        encoding: {
          y: {name: 'b'} // missing text
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: 'line',
        encoding: {
          shape: {name: 'b'} // using shape with line
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: 'area',
        encoding: {
          shape: {name: 'b'} // using shape with area
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: 'bar',
        encoding: {
          shape: {name: 'b'} // using shape with bar
        }
      })).to.be.ok;
    });
  });
});

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
