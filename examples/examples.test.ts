import {assert} from 'chai';
import * as vl from '../src/vl';
import * as Ajv from 'ajv';

const inspect = require('util').inspect;
const fs = require('fs');
const path = require('path');

const vlSchema = require('../vega-lite-schema.json');
const vgSchema = require('vega/build/vega-schema.json');

const ajv = new Ajv({
  validateSchema: false,
  extendRefs: true,
  allErrors: true
});
const validateVl = ajv.compile(vlSchema);
const validateVg = ajv.compile(vgSchema);

function validateVL(spec: vl.spec.ExtendedSpec) {
  const valid = validateVl(spec);
  const errors = validateVl.errors;
  if (!valid) {
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(valid, errors && errors.map((err: Ajv.ErrorObject) => err.message).join(', '));
}

function validateVega(spec: vl.spec.ExtendedSpec) {
  const vegaSpec = vl.compile(spec).spec;

  const valid = validateVg(vegaSpec);
  const errors = validateVg.errors;
  if (!valid) {
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(valid, errors && errors.map((err: Ajv.ErrorObject) => err.message).join(', '));
}

describe('Examples', function() {
  const examples = fs.readdirSync('examples/specs');

  examples.forEach(function(example: string) {
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
