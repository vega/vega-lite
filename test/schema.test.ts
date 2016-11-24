import {assert} from 'chai';
import * as Ajv from 'ajv';
import {inspect} from 'util';

const specSchema = require('../vega-lite-schema.json');

describe('Schema', function() {
  it('should be valid', function() {
    const ajv = new Ajv({
      allErrors: true,
      verbose: true
    });

    // now validate our data against the schema
    const valid = ajv.validateSchema(specSchema);

    if (!valid) {
      const errors = ajv.errors;
      console.log(inspect(errors, { depth: 10, colors: true }));
    }
    assert.equal(valid, true);
  });
});
