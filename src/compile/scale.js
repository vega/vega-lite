var globals = require("../globals"),
  util = require("../util");

var scale = module.exports = {};

scale.names = function (props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
};

scale.defs = function (names, encoding, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale.type(name, encoding),
      domain: scale_domain(name, encoding, opt)
    };
    if (s.type === "ordinal" && !encoding.bin(name)) {
      s.sort = true;
    }

    scale_range(s, encoding, opt);

    return (a.push(s), a);
  }, []);
};

scale.type = function (name, encoding) {
  var fn;
  switch (encoding.type(name)) {
    case O: return "ordinal";
    case T:
      switch(encoding.fn(name)){
        case "second":
        case "minute":
        case "hour":
        case "day":
        case "date":
        case "month":
          return "ordinal";
        case "year":
          return "linear";
      }
      return "time";
    case Q:
      if (encoding.bin(name)) {
        return "ordinal";
      }
      return encoding.scale(name).type;
  }
};

function scale_domain(name, encoding, opt) {
  if (encoding.type(name) === T){
    switch(encoding.fn(name)){
      case "second":
      case "minute":  return util.range(0, 60);
      case "hour":    return util.range(0, 24);
      case "day":     return util.range(0, 7);
      case "date":    return util.range(0, 32);
      case "month":   return util.range(0, 12);
    }
  }

  if (encoding.bin(name)) {
    // TODO: add includeEmptyConfig here
    if (opt.stats) {
      var bins = util.getbins(opt.stats[encoding.fieldName(name)]);
      var domain = util.range(bins.start, bins.stop, bins.step);
      return name===Y ? domain.reverse() : domain;
    }
  }

  return name == opt.stack ?
    {
      data: STACKED,
      field: "data." + (opt.facet ? "max_" :"") + "sum_" + encoding.field(name, true)
    }:
    {data: TABLE, field: encoding.field(name)};
}

function scale_range(s, encoding, opt) {
  var spec = encoding.scale(s.name);
  switch (s.name) {
    case X:
      if (s.type==="ordinal") {
        s.bandWidth = encoding.band(X).size;
      } else {
        s.range = opt.cellWidth ? [0, opt.cellWidth] : "width";
        s.zero = spec.zero;
        s.reverse = spec.reverse;
      }
      s.round = true;
      if (s.type==="time"){
        s.nice = encoding.fn(s.name);
      }else{
        s.nice = true;
      }
      break;
    case Y:
      if (s.type==="ordinal") {
        s.bandWidth = encoding.band(Y).size;
      } else {
        s.range = opt.cellHeight ? [opt.cellHeight, 0] : "height";
        s.zero = spec.zero;
        s.reverse = spec.reverse;
      }

      s.round = true;

      if (s.type==="time"){
        s.nice = encoding.fn(s.name) || encoding.config("timeScaleNice");
      }else{
        s.nice = true;
      }
      break;
    case ROW: // support only ordinal
      s.bandWidth = opt.cellHeight || encoding.config("cellHeight");
      s.round = true;
      s.nice = true;
      break;
    case COL: // support only ordinal
      s.bandWidth = opt.cellWidth || encoding.config("cellWidth");
      s.round = true;
      s.nice = true;
      break;
    case SIZE:
      if (encoding.is("bar")) {
        s.range = [3, Math.max(encoding.band(X).size, encoding.band(Y).size)];
      } else if (encoding.is(TEXT)) {
        s.range = [8, 40];
      } else {
        s.range = [10, 1000];
      }
      s.round = true;
      s.zero = false;
      break;
    case SHAPE:
      s.range = "shapes";
      break;
    case COLOR:
      if (s.type === "ordinal") {
        s.range = "category10";
      } else {
        s.range = ["#ddf", "steelblue"];
        s.zero = false;
      }
      break;
    case ALPHA:
      s.range = [0.2, 1.0];
      break;
    default:
      throw new Error("Unknown encoding name: "+s.name);
  }

  switch(s.name){
    case ROW:
    case COL:
      s.padding = encoding.config("cellPadding");
      s.outerPadding = 0;
      break;
    case X:
    case Y:
      if (s.type === "ordinal") { //&& !s.bandWidth
        s.points = true;
        s.padding = encoding.config("bandPadding");
      }
  }
}
