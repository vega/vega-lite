'use strict';

var expect = require('chai').expect;

var vlsort = require('../../src/compiler/sort'),
  Encoding = require('../../src/Encoding');

describe('Sort', function() {
  var encoding = Encoding.fromSpec({
        encoding: {
          x: {name: 'foo', type: 'O', sort: [{
            name: 'bar', aggregate: 'avg'
          }]},
          y: {name: 'bar', type: 'Q'},
          color: {name: 'baz', type: 'O', sort: [{
            name: 'bar', aggregate: 'sum'
          }, {
            name: 'foo', aggregate: 'max', reverse: true
          }]}
        }
      }),
    data = [{name: RAW}, {name: AGGREGATE}];

  vlsort(data, encoding, {});

  it('should add new data and transform', function() {
    expect(data.length).to.equal(4);

    expect(data[2].transform).to.deep.equal([
      {
        type: 'aggregate',
        groupby: [ 'foo' ],
        fields: [{
          field: 'bar',
          op: 'avg'
        }]
      },
      { type: 'sort', by: [ 'avg_bar' ] }
    ]);

    expect(data[3].transform).to.deep.equal([
      {
        type: 'aggregate',
        groupby: [ 'baz' ],
        fields: [{
          field: 'bar',
          op: 'sum'
        }, {
          field: 'foo',
          op: 'max'
        }]
      },
      { type: 'sort', by: [ 'sum_bar', '-max_foo' ] }
    ]);
  });
});
