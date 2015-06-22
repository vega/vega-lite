var expect = require('chai').expect;

var bin = require('../../src/compiler/bin'),
  Encoding = require('../../src/Encoding');

describe('vl.compile.bin', function() {
  it('return correct bin', function() {
    var dataTable = {name: TABLE, source: RAW},
      spec = {
        encoding: {
          'y': {
            'bin': {'maxbins': 15},
            'name': 'Acceleration',
            'type': 'Q'
          }
        }
      };

    bin(dataTable, Encoding.fromSpec(spec));
    expect(dataTable).to.eql({
      name: 'table',
      source: 'raw',
      transform: [{
        type: 'bin',
        field: 'data.Acceleration',
        output: 'data.bin_Acceleration',
        maxbins: 15
      }]
    });
  });
});