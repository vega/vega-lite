var assert = require('assert'),
  zSchema = require('z-schema'),
  inspect = require('util').inspect;

var schema = require('../lib/schema.json'),
  util = require('../src/schema/schemautil'),
  specSchema = require('../src/schema/schema').schema;

describe('Schema', function() {
  it('should be valid', function() {
    var validator = new zSchema();

    // now validate our data against the schema
    var valid = validator.validate(specSchema, schema);

    if (!valid) {
      var errors = validator.getLastErrors();
      console.log(inspect(errors, { depth: 10, colors: true }));
    }
    assert.equal(valid, true);
  });
});

describe('Util', function() {
  it('instantiate simple schema', function() {
    var simpleSchema = {
      type: 'object', required: ['fooBaz'],
      properties: {
        foo: {type: 'array'},
        fooBar: {type: 'string', default: 'baz'},
        fooBaz: {type: 'string', enum: ['a', 'b']}}};
    assert.deepEqual(
      util.instantiate(simpleSchema),
      {fooBar: 'baz'});
  });

  it('remove defaults', function() {
    var spec = {
      marktype: 'point',
      encoding: {
        x: { field: 'dsp', type: 'quantitative', scale: {type: 'linear'}
      },
        color: { field: 'cyl', type: 'ordinal' }
      },
      data: {
        formatType: 'json',
        url: 'data/cars.json'
      }
    };

    var expected = {
      marktype: 'point',
      encoding: {
        x: { field: 'dsp', type: 'quantitative' },
        color: { field: 'cyl', type: 'ordinal' }
      },
      data: {
        url: 'data/cars.json'
      }
    };

    var actual = util.subtract(spec, util.instantiate(specSchema));
    assert.deepEqual(actual, expected);
  });

  it('subtract with different types', function() {
    var a = {a: 'foo', b: 'bar', 'baz': [1, 2, 3]};
    var b = {a: 'foo', b: 'hi', 'baz': 'hi'};

    assert.deepEqual(
      util.subtract(a, b),
      {b: 'bar', baz: [1, 2, 3]});

    assert.equal(util.subtract(a, b).baz instanceof Array, true);
  });

  it('merge objects', function() {
     var a = {a: 'foo', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}};
    var b = {a: 'fuu'};

    assert.deepEqual(
      util.merge(a, b),
      {a: 'fuu', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}});
  });

  it('merge objects reversed', function() {
    var a = {a: 'foo', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}};
    var b = {a: 'fuu'};

    assert.deepEqual(
      util.merge(b, a),
      {a: 'foo', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}});
  });
});
