import {assert} from 'chai';
import * as vl from '../src/vl';

const zSchema = require('z-schema');
const inspect = require('util').inspect;
const dl = require('datalib');

const validator = new zSchema();
const vlSchema = require('../src/schema/schema').schema,
  vgSchema = require('../node_modules/vega/vega-schema.json');

function validateAgainstSchemas(vlspec, done?) {
  var isVlValid = validator.validate(vlspec, vlSchema);
  var errors;

  if (!isVlValid) {
    errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert.deepEqual(isVlValid, true);

  var vegaSpec = vl.compile(vlspec);

  var isVgValid = validator.validate(vegaSpec, vgSchema);

  if (!isVgValid) {
    errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert.deepEqual(isVgValid, true);

  if (done) {
    done();
  }
}

describe('Examples', function() {
  var VL_EXAMPLES = dl.json('examples/vlexamples.json');

  var examples = dl.keys(VL_EXAMPLES).reduce(function(specs, groupName) {
    var group = VL_EXAMPLES[groupName];
    return dl.isArray(group) ? // need to exclude __types__: {}
      specs.concat(group) : specs;
  }, []);

  examples.forEach(function(example) {
    it('should be valid and produce valid vega for: ' + example.name, function(done) {
      var jsonData = dl.load({url: 'examples/' + example.name + '.json'});
      var data = dl.read(jsonData, {type: 'json', parse: 'auto'});
      validateAgainstSchemas(data, done);
    });
  });
});
