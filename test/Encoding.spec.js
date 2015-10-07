'use strict';

var expect = require('chai').expect;

var Encoding = require('../src/Encoding');

describe('Encoding.fromShorthand()', function () {
  it('should parse shorthand correctly', function () {
    var shorthand = 'mark=point|x=Effect__Amount_of_damage,O|y=mean_Cost__Total_$,Q';
    var encoding = Encoding.fromShorthand(shorthand);
    expect(encoding.has('y')).ok;
    expect(encoding.has('x')).ok;

  });
});

