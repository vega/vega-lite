'use strict';

var d3 = require('./color');

module.exports = function (a, b) {
  a = d3.lab(a);
  b = d3.lab(b);
  var al = a.l,
      aa = a.a,
      ab = a.b,
      bl = b.l - al,
      ba = b.a - aa,
      bb = b.b - ab;
  return function(t) {
    return d3.lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + '';
  };
};