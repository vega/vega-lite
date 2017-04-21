import * as Ajv from 'ajv';
import {assert} from 'chai';
import {compile} from '../src/compile/compile';
import {TopLevelExtendedSpec} from '../src/spec';

const inspect = require('util').inspect;
const fs = require('fs');
const path = require('path');

const vlSchema = require('../../build/vega-lite-schema.json');
const vgSchema = require('vega/build/vega-schema.json');

const ajv = new Ajv({
  validateSchema: true,
  extendRefs: 'fail',
  allErrors: true
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'), 'http://json-schema.org/draft-04/schema#');

const validateVl = ajv.compile(vlSchema);
const validateVg = ajv.compile(vgSchema);

function validateVL(spec: TopLevelExtendedSpec) {
  const valid = validateVl(spec);
  const errors = validateVl.errors;
  if (!valid) {
    console.log(inspect(errors, {depth: 10, colors: true}));
  }
  assert(valid, errors && errors.map((err: Ajv.ErrorObject) => err.message).join(', '));

  assert.equal(spec.$schema, 'https://vega.github.io/schema/vega-lite/v2.json');
}

function validateVega(spec: TopLevelExtendedSpec) {
  const vegaSpec = compile(spec).spec;

  const valid = validateVg(vegaSpec);
  const errors = validateVg.errors;
  if (!valid) {
    console.log(inspect(errors, {depth: 10, colors: true}));
  }
  assert(valid, errors && errors.map((err: Ajv.ErrorObject) => err.message).join(', '));
}

describe('Examples', function() {
  const examples = fs.readdirSync('examples/specs');

  examples.forEach(function(example: string) {
    if (path.extname(example) !== '.json') {return;}
    const jsonSpec = JSON.parse(fs.readFileSync('examples/specs/' + example));

    describe(example, function() {
      it('should be valid vega-lite with proper $schema', function() {
        validateVL(jsonSpec);
      });

      it('should produce valid vega', function() {
        validateVega(jsonSpec);
      });
    });
  });
});
