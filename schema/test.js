var schema = require("./schema.json"),
  specSchema = require("./schema.js").spec,
  assert = require('assert'),
  tv4 = require("tv4"),
  _ = require("lodash"),
  inspect = require('util').inspect;

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

describe("Schema", function () {
  it("schema should be valid", function () {

    // validate schema against meta schema
    tv4.addSchema("http://json-schema.org/draft-04/schema", schema);

    var result = tv4.validateMultiple(specSchema, schema, true, true);
    var errors = result.errors;

    console.log("Before:", errors.length);

    // ignore our own special properties
    var errors = _.filter(errors, function(err) {
      return !(
        err.code === 0 ||  // https://github.com/geraintluff/tv4/issues/74
        err.code === 1000 && (err.dataPath.endsWith("supportedTypes")
                              || err.dataPath.endsWith("supportedEnums")));
    });

    console.log("After:", errors.length);

    if (errors.length) {
      console.log(inspect(errors, true, 5));
    }
    assert.equal(0, errors.length);
  });
});
