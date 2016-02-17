const assert = require('assert'),
  zSchema = require('z-schema'),
  inspect = require('util').inspect;

const schema = require('../lib/schema.json');
const specSchema = require('../vega-lite-schema.json');

import * as schemautil from '../src/schema/schemautil';

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

describe('Util', function() {
  it('instantiate simple schema', function() {
    const simpleSchema = {
      type: 'object', required: ['fooBaz'],
      properties: {
        foo: {type: 'array'},
        fooBar: {type: 'string', default: 'baz'},
        fooBaz: {type: 'string', enum: ['a', 'b']}}};
    assert.deepEqual(
      schemautil.instantiate(simpleSchema),
      {fooBar: 'baz'});
  });

  it('remove defaults', function() {
    const spec = {
      mark: 'point',
      encoding: {
        x: { field: 'dsp', type: 'quantitative'},
        color: { field: 'cyl', type: 'ordinal' }
      },
      data: {
        formatType: 'json',
        url: 'data/cars.json'
      }
    };

    const expected = {
      mark: 'point',
      encoding: {
        x: { field: 'dsp', type: 'quantitative'},
        color: { field: 'cyl', type: 'ordinal' }
      },
      data: {
        formatType: 'json',
        url: 'data/cars.json'
      }
    };

    const actual = schemautil.subtract(spec, specSchema);
    assert.deepEqual(actual, expected);
  });

  it('subtract with different types', function() {
    const a = {a: 'foo', b: 'bar', 'baz': [1, 2, 3]};
    const b = {a: 'foo', b: 'hi', 'baz': 'hi'};

    assert.deepEqual(
      schemautil.subtract(a, b),
      {b: 'bar', baz: [1, 2, 3]});

    assert.equal(schemautil.subtract(a, b).baz instanceof Array, true);
  });

  it('merge objects', function() {
     const a = {a: 'foo', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}};
    const b = {a: 'fuu'};

    assert.deepEqual(
      schemautil.mergeDeep(a, b),
      {a: 'fuu', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}});
  });

  it('merge objects reversed', function() {
    const a = {a: 'foo', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}};
    const b = {a: 'fuu'};

    assert.deepEqual(
      schemautil.mergeDeep(b, a),
      {a: 'foo', b: {'bar': 0, 'baz': [], 'qux': [1, 2, 3]}});
  });
});
