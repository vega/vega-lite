'use strict';

var expect = require('chai').expect;

var Encoding = require('../src/Encoding');

describe('encoding.filter()', function () {
  var spec = {
      marktype: 'point',
      enc: {
        y: {name: 'Q', type:'Q'},
        x: {name: 'T', type:'T'},
        color: {name: 'O', type:'O'}
      }
    };
  it('should add filterNull for Q and T by default', function () {
    var encoding = Encoding.fromSpec(spec),
      filter = encoding.filter();
    expect(filter.length).to.equal(2);
    expect(filter.indexOf({name: 'O', type:'O'})).to.equal(-1);
  });

  it('should add filterNull for O when specified', function () {
    var encoding = Encoding.fromSpec(spec, null, {
      filterNull: {O: true}
    }),
      filter = encoding.filter();
    expect(filter.length).to.equal(3);
  });
});
