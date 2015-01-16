var schema = require("./schema.json"),
  utils = require("./utils.js"),
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

describe("Utils", function() {
  it("instantiate simple schema", function() {
    var simpleSchema = {
      type: 'object', required: ['fooBaz'],
      properties: {
        fooBar: {type: 'string', default: 'baz'},
        fooBaz: {type: 'string', enum: ['a', 'b']}}};
    assert.deepEqual(
      utils.instantiate(simpleSchema),
      {fooBar: 'baz', fooBaz: 'a'});
  });

  it("remove defaults", function() {
    var spec = {
      marktype: 'point',
      enc: {
        x: { name: 'dsp', type: 'Q', scale: {type: "linear"}
     },
       color: { name: 'cyl', type: 'O' }
     },
      cfg: {
        useVegaServer: false,
        vegaServerUrl: 'http://localhost:3001',
        dataFormatType: null,
        dataUrl: 'data/cars.json',
        vegaServerTable: 'cars_json'
      }
    }

    var expected = {
      enc: {
        x: { name: 'dsp', type: 'Q' },
        color: { name: 'cyl' }
      },
      cfg: {
        dataUrl: 'data/cars.json',
        vegaServerTable: 'cars_json'
      }
    };

    var actual = utils.difference(utils.instantiate(specSchema), spec);
    assert.deepEqual(actual, expected);
  });

  it("merge objects", function() {
     var a = {a: "foo", b: {"bar": 0, "baz": [], "qux": [1, 2, 3]}};
    var b = {a: "fuu"};

    assert.deepEqual(
      utils.merge(a, b),
      {a: "fuu", b: {"bar": 0, "baz": [], "qux": [1, 2, 3]}});
  });

  it("merge objects reversed", function() {
    var a = {a: "foo", b: {"bar": 0, "baz": [], "qux": [1, 2, 3]}};
    var b = {a: "fuu"};

    assert.deepEqual(
      utils.merge(b, a),
      {a: "foo", b: {"bar": 0, "baz": [], "qux": [1, 2, 3]}});
  });
});
