'use strict';
/* jshint ignore:start */

var d3 = module.exports = {
  map: require('./map')
};

d3.color = d3_color;

function d3_color() {}
d3_color.prototype.toString = function() {
  return this.rgb() + '';
};
d3.hsl = d3_hsl;

function d3_hsl(h, s, l) {

  return this instanceof d3_hsl ? void(this.h = +h, this.s = +s, this.l = +l) : arguments.length <
    2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl,
      d3_hsl) : new d3_hsl(h, s, l);
}
var d3_hslPrototype = d3_hsl.prototype = new d3_color();
d3_hslPrototype.brighter = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  return new d3_hsl(this.h, this.s, this.l / k);
};
d3_hslPrototype.darker = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  return new d3_hsl(this.h, this.s, k * this.l);
};
d3_hslPrototype.rgb = function() {
  return d3_hsl_rgb(this.h, this.s, this.l);
};

function d3_hsl_rgb(h, s, l) {
  var m1, m2;
  h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
  s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
  l = l < 0 ? 0 : l > 1 ? 1 : l;
  m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
  m1 = 2 * l - m2;

  function v(h) {
    if (h > 360) h -= 360;
    else if (h < 0) h += 360;
    if (h < 60) return m1 + (m2 - m1) * h / 60;
    if (h < 180) return m2;
    if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
    return m1;
  }

  function vv(h) {
    return Math.round(v(h) * 255);
  }
  return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
}
d3.hcl = d3_hcl;

function d3_hcl(h, c, l) {
  return this instanceof d3_hcl ? void(this.h = +h, this.c = +c, this.l = +l) : arguments.length <
    2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l,
      h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(
      h, c, l);
}
var d3_hclPrototype = d3_hcl.prototype = new d3_color();
d3_hclPrototype.brighter = function(k) {
  return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
};
d3_hclPrototype.darker = function(k) {
  return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
};
d3_hclPrototype.rgb = function() {
  return d3_hcl_lab(this.h, this.c, this.l).rgb();
};

function d3_hcl_lab(h, c, l) {
  if (isNaN(h)) h = 0;
  if (isNaN(c)) c = 0;
  return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
}
d3.lab = d3_lab;

function d3_lab(l, a, b) {
  return this instanceof d3_lab ? void(this.l = +l, this.a = +a, this.b = +b) : arguments.length <
    2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h,
      l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
}
var d3_lab_K = 18;
var d3_lab_X = .95047,
  d3_lab_Y = 1,
  d3_lab_Z = 1.08883;
var d3_labPrototype = d3_lab.prototype = new d3_color();
d3_labPrototype.brighter = function(k) {
  return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this
    .b);
};
d3_labPrototype.darker = function(k) {
  return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
};
d3_labPrototype.rgb = function() {
  return d3_lab_rgb(this.l, this.a, this.b);
};

d3.lab_rgb = function d3_lab_rgb(l, a, b) {
  var y = (l + 16) / 116,
    x = y + a / 500,
    z = y - b / 200;
  x = d3_lab_xyz(x) * d3_lab_X;
  y = d3_lab_xyz(y) * d3_lab_Y;
  z = d3_lab_xyz(z) * d3_lab_Z;
  return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 *
    x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 *
    z));
}

function d3_lab_hcl(l, a, b) {
  return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(
    NaN, NaN, l);
}

function d3_lab_xyz(x) {
  return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
}

function d3_xyz_lab(x) {
  return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
}

function d3_xyz_rgb(r) {
  return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
}
d3.rgb = d3_rgb;

function d3_rgb(r, g, b) {
  return this instanceof d3_rgb ? void(this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length <
    2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb,
      d3_hsl_rgb) : new d3_rgb(r, g, b);
}

function d3_rgbNumber(value) {
  return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
}

function d3_rgbString(value) {
  return d3_rgbNumber(value) + "";
}
var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
d3_rgbPrototype.brighter = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  var r = this.r,
    g = this.g,
    b = this.b,
    i = 30;
  if (!r && !g && !b) return new d3_rgb(i, i, i);
  if (r && r < i) r = i;
  if (g && g < i) g = i;
  if (b && b < i) b = i;
  return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
};
d3_rgbPrototype.darker = function(k) {
  k = Math.pow(.7, arguments.length ? k : 1);
  return new d3_rgb(k * this.r, k * this.g, k * this.b);
};
d3_rgbPrototype.hsl = function() {
  return d3_rgb_hsl(this.r, this.g, this.b);
};
d3_rgbPrototype.toString = function() {
  return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
};

function d3_rgb_hex(v) {
  return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
}

function d3_rgb_parse(format, rgb, hsl) {
  var r = 0,
    g = 0,
    b = 0,
    m1, m2, color;
  m1 = /([a-z]+)\((.*)\)/i.exec(format);
  if (m1) {
    m2 = m1[2].split(",");
    switch (m1[1]) {
      case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

      case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(
            m2[2]));
        }
    }
  }
  if (color = d3_rgb_names.get(format.toLowerCase())) {
    return rgb(color.r, color.g, color.b);
  }
  if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
    if (format.length === 4) {
      r = (color & 3840) >> 4;
      r = r >> 4 | r;
      g = color & 240;
      g = g >> 4 | g;
      b = color & 15;
      b = b << 4 | b;
    } else if (format.length === 7) {
      r = (color & 16711680) >> 16;
      g = (color & 65280) >> 8;
      b = color & 255;
    }
  }
  return rgb(r, g, b);
}

function d3_rgb_hsl(r, g, b) {
  var min = Math.min(r /= 255, g /= 255, b /= 255),
    max = Math.max(r, g, b),
    d = max - min,
    h, s, l = (max + min) / 2;
  if (d) {
    s = l < .5 ? d / (max + min) : d / (2 - max - min);
    if (r == max) h = (g - b) / d + (g < b ? 6 : 0);
    else if (g == max) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  } else {
    h = NaN;
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new d3_hsl(h, s, l);
}

function d3_rgb_lab(r, g, b) {
  r = d3_rgb_xyz(r);
  g = d3_rgb_xyz(g);
  b = d3_rgb_xyz(b);
  var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X),
    y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y),
    z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
  return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
}

function d3_rgb_xyz(r) {
  return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
}

function d3_rgb_parseNumber(c) {
  var f = parseFloat(c);
  return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
}
var d3_rgb_names = d3.map({
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
});
d3_rgb_names.forEach(function(key, value) {
  d3_rgb_names.set(key, d3_rgbNumber(value));
});
/* jshint ignore:end */
