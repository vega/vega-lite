import {assert} from 'chai';
import * as vl from '../src/vl';

const ZSchema = require('z-schema');
const inspect = require('util').inspect;
const dl = require('datalib');
const fs = require('fs');
const path = require('path');

const validator = new ZSchema({
  noEmptyArrays: true,
  noEmptyStrings: true
});

const vlSchema = require('../src/schema/schema').schema;
const vlSchema2 = require('../vega-lite-schema.json');
const vgSchema = require('../node_modules/vega/vega-schema.json');

function validateAgainstSchemas(vlspec) {
  const isVlValid = validator.validate(vlspec, vlSchema);
  if (!isVlValid) {
    const errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(isVlValid);

  const isVlValid2 = validator.validate(vlspec, vlSchema2);
  if (!isVlValid2) {
    const errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(isVlValid2);

  const vegaSpec = vl.compile(vlspec);

  const isVgValid = validator.validate(vegaSpec, vgSchema);
  if (!isVgValid) {
    const errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(isVgValid);
}

function getExampleList(examples) {
  return dl.keys(examples).reduce(function(specs, groupName) {
    var group = examples[groupName];
    return dl.isArray(group) ? // need to exclude __types__: {}
      specs.concat(group) : specs;
  }, []);
}

describe('Examples', function() {
  const examples = fs.readdirSync('examples/specs');

  examples.forEach(function(example) {
    if (path.extname(example) != '.json') { return; }

    it('should be valid and produce valid vega for: ' + example, function() {
      const data = JSON.parse(fs.readFileSync('examples/specs/' + example));
      validateAgainstSchemas(data);
    });
  });
});
