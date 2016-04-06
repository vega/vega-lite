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

function validateVL(spec) {
  const valid = validator.validate(spec, vlSchema);
  const errors = validator.getLastErrors();
  if (!valid) {
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(valid, errors && errors.map((err) => {return err.message; }).join(', '));
}

function validateVega(spec) {
  const vegaSpec = vl.compile(spec).spec;

  const valid = validator.validate(vegaSpec, vgSchema);
  const errors = validator.getLastErrors();
  if (!valid) {
    console.log(vegaSpec.marks[0].marks[0].properties);
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(valid, errors && errors.map((err) => {return err.message; }).join(', '));
}

describe('Examples', function() {
  const examples = fs.readdirSync('examples/specs');

  examples.forEach(function(example) {
    if (path.extname(example) !== '.json') { return; }
    const jsonSpec = JSON.parse(fs.readFileSync('examples/specs/' + example));

    describe(example, function() {
      it('should be valid vega-lite', function() {
        validateVL(jsonSpec);
      });

      it('should produce valid vega', function() {
        validateVega(jsonSpec);
      });
    });
  });
});
