import {expect} from 'chai';
import {getEncodingMappingError} from '../src/validate';
import {BAR, LINE, AREA, TEXT} from '../src/marktype';

var zSchema = require('z-schema'),
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
        marktype: BAR,
        encoding: {
          x: {field: 'a'}
        }
      })).to.be.null;

      expect(getEncodingMappingError({
        marktype: LINE,
        encoding: {
          x: {field: 'b'},
          y: {field: 'a'}
        }
      })).to.be.null;

      expect(getEncodingMappingError({
        marktype: AREA,
        encoding: {
          x: {field: 'a'},
          y: {field: 'b'}
        }
      })).to.be.null;
    });

    it('should return error for invalid specs', function() {
      expect(getEncodingMappingError({
        marktype: LINE,
        encoding: {
          x: {field: 'b'} // missing y
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: AREA,
        encoding: {
          y: {field: 'b'} // missing x
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: TEXT,
        encoding: {
          y: {field: 'b'} // missing text
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: LINE,
        encoding: {
          shape: {field: 'b'} // using shape with line
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: AREA,
        encoding: {
          shape: {field: 'b'} // using shape with area
        }
      })).to.be.ok;

      expect(getEncodingMappingError({
        marktype: BAR,
        encoding: {
          shape: {field: 'b'} // using shape with bar
        }
      })).to.be.ok;
    });
  });
});

describe('Examples', function() {

  examples.forEach(function(example) {
    validateAgainstSchemas(example.spec, example.title);
  });

  var validator = new zSchema();
  var errors;

  function validateAgainstSchemas(vlspec, title) {
    it('should be valid and produce valid vega for: ' + title, function() {
      var isVlValid = validator.validate(vlspec, vlSchema);

      if (!isVlValid) {
        errors = validator.getLastErrors();
        console.log(inspect(errors, { depth: 10, colors: true }));
      }
      expect(isVlValid).to.eql(true);

      var vegaSpec = vl.compile(vlspec);

      var isVgValid = validator.validate(vegaSpec, vgSchema);

      if (!isVgValid) {
        errors = validator.getLastErrors();
        console.log(inspect(errors, { depth: 10, colors: true }));
      }
      expect(isVgValid).to.eql(true);
    });
  }
});
