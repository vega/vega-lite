const assert = require('assert'),
  zSchema = require('z-schema'),
  inspect = require('util').inspect;

const schema = require('../lib/schema.json');
const specSchema = require('../vega-lite-schema.json');

describe('Schema', function() {
  it('should be valid', function() {
    // formatters are not used, just registered to we can validate the schema
    zSchema.registerFormat('color', function (str) {
      return false;
    });
    zSchema.registerFormat('font', function (str) {
      return false;
    });

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
