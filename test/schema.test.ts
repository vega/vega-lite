const assert = require('assert'),
  inspect = require('util').inspect;

const schema = require('../lib/schema.json');
const specSchema = require('../vega-lite-schema.json');
import {zSchema} from './util';

describe('Schema', function() {
  it('should be valid', function() {
    const validator = new zSchema();

    // now validate our data against the schema
    const valid = validator.validate(specSchema, schema);

    if (!valid) {
      const errors = validator.getLastErrors();
      console.log(inspect(errors, { depth: 10, colors: true }));
    }
    assert.equal(valid, true);
  });
});
