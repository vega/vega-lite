import {assert} from 'chai';
import * as vl from '../src/vl';
import {zSchema} from '../test/util';

const inspect = require('util').inspect;
const fs = require('fs');
const path = require('path');

const validator = new zSchema({
  noEmptyArrays: true,
  noEmptyStrings: true
});

const vlSchema = require('../vega-lite-schema.json');
const vgSchema = require('../node_modules/vega/vega-schema.json');

function validateAgainstSchemas(vlspec) {
  const isVlValid = validator.validate(vlspec, vlSchema);
  if (!isVlValid) {
    const errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(isVlValid);

  const vegaSpec = vl.compile(vlspec).spec;

  const isVgValid = validator.validate(vegaSpec, vgSchema);
  if (!isVgValid) {
    const errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(isVgValid);
}

describe('Examples', function() {
  const examples = fs.readdirSync('examples/specs');

  examples.forEach(function(example) {
    if (path.extname(example) !== '.json') { return; }

    it('should be valid and produce valid vega for: ' + example, function() {
      const data = JSON.parse(fs.readFileSync('examples/specs/' + example));
      validateAgainstSchemas(data);
    });
  });
});
