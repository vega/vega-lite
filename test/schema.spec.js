'use strict';

var assert = require('assert'),
  ZSchema = require("z-schema"),
  _ = require('lodash'),
  inspect = require('util').inspect;

var schema = require('../lib/schema.json'),
  util = require('../src/schema/schemautil.js'),
  specSchema = require('../src/schema/schema.js').schema;

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

describe('Schema', function() {
  it('should be valid', function() {
    var validator = new ZSchema();

    // now validate our data against the schema
    var valid = validator.validate(specSchema, schema);

    if (!valid) {
      var errors = validator.getLastErrors();
      console.log(inspect(errors, { depth: 10, colors: true }));
    }
    assert.equal(valid, true);
  });

  it('field def should have supportedMarktypes', function() {
    var encProps = specSchema.properties.enc.properties;
    for (var k in encProps) {
      assert.notEqual(encProps[k].supportedMarktypes, undefined);
    }
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
      {foo: [], fooBar: 'baz'});
  });

  it('remove defaults', function() {
    var spec = {
      marktype: 'point',
      enc: {
        x: { name: 'dsp', type: 'Q', scale: {type: 'linear'}
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
    };

    var expected = {
      marktype: 'point',
      enc: {
        x: { name: 'dsp', type: 'Q' },
        color: { name: 'cyl', type: 'O' }
      },
      cfg: {
        dataUrl: 'data/cars.json',
        vegaServerTable: 'cars_json'
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
