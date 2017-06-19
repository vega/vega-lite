import * as Ajv from 'ajv';
import {assert} from 'chai';
import {inspect} from 'util';

const specSchema = require('../../build/vega-lite-schema.json');
const metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');

describe('Schema', function() {
  it('should be valid', function() {
    const ajv = new Ajv({
      allErrors: true,
      verbose: true,
      extendRefs: 'fail'
    });

    ajv.addMetaSchema(metaSchema, 'http://json-schema.org/draft-04/schema#');

    // now validate our data against the schema
    const valid = ajv.validateSchema(specSchema);

    if (!valid) {
      console.log(inspect(ajv.errors, {depth: 10, colors: true}));
    }
    assert.equal(valid, true);
  });
});
