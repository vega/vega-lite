var expect = require('chai').expect;

var aggregate = require('../../src/compiler/aggregate'),
  Encoding = require('../../src/Encoding');

describe('vl.compile.aggregate', function() {
  it('return correct aggregation', function() {
    var dataTable = {
        name: TABLE,
        source: RAW
      },
      spec = {
        encoding: {
          'y': {
            'aggregate': 'sum',
            'name': 'Acceleration',
            'type': 'Q'
          },
          'x': {
            'name': 'origin',
            "type": "O"
          },
        }
      };

    aggregate(dataTable, Encoding.fromSpec(spec));
    expect(dataTable).to.eql({
      "name": "table",
      "source": "raw",
      "transform": [{
        "type": "aggregate",
        "groupby": ["data.origin"],
        "fields": [{
          "op": "sum",
          "field": "data.Acceleration"
        }]
      }]
    });
  });
});