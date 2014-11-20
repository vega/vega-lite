var TABLE = "table";
var INDEX = "index";

var X = "x";
var Y = "y";
var SIZE = "size";
var SHAPE = "shape";
var COLOR = "color";
var ALPHA = "alpha";
var TEXT = "text";

var O = 1;
var Q = 2;
var T = 4;

var DEFAULTS = {
  barSize: 10,
  bandSize: 21,
  pointSize: 10,
  pointShape: "circle",
  strokeWidth: 2,
  color: "steelblue",
  textColor: "black",
  textAlign: "left",
  textBaseline: "middle",
  textMargin: 4,
  font: "Helvetica Neue",
  fontSize: "12",
  fontWeight: "normal",
  fontStyle: "normal"
};

function keys(obj) {
  var k = [], x;
  for (x in obj) k.push(x);
  return k;
}

function vals(obj) {
  var v = [], x;
  for (x in obj) v.push(obj[x]);
  return v;
}

function uniq(data, field) {
  var map = {}, count = 0, i, k;
  for (i=0; i<data.length; ++i) {
    k = data[i][field];
    if (!map[k]) {
      map[k] = 1;
      count += 1;
    }
  }
  return count;
}

// ----
var Encoding = (function() {

  function Encoding(marktype, enc, config) {
    this._marktype = marktype;
    this._enc = enc;
    this._cfg = config
      ? Object.create(DEFAULTS, config)
      : DEFAULTS;
  }

  var proto = Encoding.prototype;

  proto.marktype = function() {
    return this._marktype;
  };

  proto.is = function(m) {
    return this._marktype === m;
  };

  proto.has = function(x) {
    return this._enc[x] !== undefined;
  };

  proto.field = function(x, pure) {
    if (!this.has(x)) return null;
    
    var f = (pure ? "" : "data.");
    if (this._enc[x].aggr === "count") {
      return f + "count";
    } else if (this._enc[x].bin) {
      return f + "bin_" + this._enc[x].name;
    } else if (this._enc[x].aggr) {
      return f + this._enc[x].aggr + "_" + this._enc[x].name;
    } else {
      return f + this._enc[x].name;
    }
  };
  
  proto.forEach = function(f) {
    var i=0, k;
    for (k in this._enc) {
      f(k, this._enc[k], i++);
    }
  };

  proto.type = function(x) {
    return this.has(x) ? this._enc[x].type : null;
  };

  proto.isType = function(x, t) {
    var xt = this.type(x);
    if (xt == null) return false;
    return (xt & t) > 0;
  };
  
  proto.config = function(name) {
    return this._cfg[name];
  };
  
  return Encoding;

})();

// ----

function toVegaSpec(enc, data) {
  var mark = marks[enc.marktype()];
  var spec = template();
  var group = spec.marks[0];
  
  var mdef = markdef(mark, enc);

  group.marks.push(mdef);
  
  group.scales = scales(scale_names(mdef.properties.update), enc);
  
  group.axes = axes(axis_names(mdef.properties.update), enc);
  
  group.scales.forEach(function(s) {
    if (s.name === X && s.range !== "width") {
      spec.width = uniq(data, enc.field(X,1)) * s.bandWidth;
    } else if (s.name === Y && s.range !== "height") {
      spec.height = uniq(data, enc.field(Y,1)) * s.bandWidth;
    }
  });
  
  binning(spec.data[0], enc);
  
  // handle aggregates
  var dims = aggregates(spec.data[0], enc);
  if (dims.length) {
    var m = group.marks;
    group.marks = [groupdef()];
    var g = group.marks[0];
    g.marks = m;
    g.from = mdef.from;
    g.from.transform = [{type: "facet", keys: dims}];
    delete mdef.from;
  }
  
  return spec;
}

function binning(spec, enc) {
  var bins = {};
  enc.forEach(function(vv, d) {
    if (d.bin) bins[d.name] = d.name;
  });
  bins = keys(bins);
  
  if (bins.length === 0) return false;

  if (!spec.transform) spec.transform = [];
  bins.forEach(function(d) {
    spec.transform.push({
      type: "bin",
      field: "data." + d,
      output: "bin_" + d
    });
  });
  return bins;
}

function aggregates(spec, enc) {
  var dims = {}, meas = {}, detail = {};
  enc.forEach(function(vv, d) {
    if (d.aggr) {
      meas[d.aggr+"|"+d.name] = {op:d.aggr, field:"data."+d.name};
    } else {
      dims[d.name] = enc.field(vv);
      if (vv !== X && vv !== Y) {
        detail[d.name] = dims[d.name];
      }
    }
  });
  dims = vals(dims);
  meas = vals(meas);
  
  if (meas.length === 0) return false;

  if (!spec.transform) spec.transform = [];
  spec.transform.push({
    type: "aggregate",
    groupby: dims,
    fields: meas
  });
  return vals(detail);
}

function axis_names(props) {
  return keys(keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s===X || s===Y) a[props[x].scale] = 1;
    return a;
  }, {}));
}

function axes(names, enc) {
  return names.reduce(function(a, name) {
    a.push({
      type: name,
      scale: name
    });
    return a;
  }, []);
}

function scale_names(props) {
  return keys(keys(props).reduce(function(a, x) {
    if (props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
}

function scales(names, enc) {
  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale_type(name, enc),
      domain: scale_domain(name, enc)
    };
    if (s.type === "ordinal") {
      s.sort = true;
    }

    scale_range(s, enc);
    
    return (a.push(s), a);
  }, []);
}

function scale_type(name, enc) {
  var t = "ordinal";
  switch (enc.type(name)) {
    case T: t = "time"; break;
    case Q: t = "linear"; break;
  }
  return t;
}

function scale_domain(name, enc) {
  return {data: TABLE, field: enc.field(name)};
}

function scale_range(s, enc) {
  switch (s.name) {
    case X:
      if (enc.isType(s.name, O)) {
        s.bandWidth = enc.config("bandSize");
      } else {
        s.range = "width";
      }
      s.round = true;
      s.nice = true;
      break;
    case Y:
      if (enc.isType(s.name, O)) {
        s.bandWidth = enc.config("bandSize");
      } else {
        s.range = "height";
      }
      s.round = true;
      s.nice = true;
      break;
    case SIZE:
      if (enc.is("bar")) {
        s.range = [3, enc.config("bandSize")];
      } else if (enc.is("text")) {
        s.range = [8, 40];
      } else {
        s.range = [10, 1000];
      }
      s.round = true;
      break;
    case SHAPE:
      s.range = "shapes";
      break;
    case COLOR:
      if (enc.isType(s.name, O)) {
        s.range = "category10";
      } else {
        s.range = ["#aae", "#328"];
      }
      break;
    case ALPHA:
      s.range = [0.2, 1.0];
      break;
    default:
      throw new Error("Unknown encoding name: "+s.name);
  }

  if (s.name === SIZE) {
    s.zero = false;
  }
  if (/* !enc.is("bar") && */enc.isType(s.name, O)) {
    s.points = true;
    s.padding = 1.0;
  }

}

function markdef(mark, enc) {
  var p = mark.prop(enc)
  return {
    type: mark.type,
    from: {data: TABLE},
    properties: {enter: p, update: p}
  };
}

function groupdef() {
  return {
    type: "group",
    properties: {
      enter: {
        width: {group: "width"},
        height: {group: "height"}
      }
    },
    scales: [],
    axes: [],
    marks: []
  };
}

function template() {
  return {
    width: 300,
    height: 300,
    padding: 50,
    data: [{name: TABLE}],
    marks: [groupdef()]
  };
}

// --------------------------------------------------------

var marks = {};

marks.bar = {
  type: "rect",
  prop: bar_props
};

marks.line = {
  type: "line",
  prop: line_props
};

marks.area = {
  type: "area",
  prop: area_props
};

marks.circle = {
  type: "symbol",
  prop: filled_point_props("circle")
};

marks.square = {
  type: "symbol",
  prop: filled_point_props("square")
};

marks.point = {
  type: "symbol",
  prop: point_props
};

marks.text = {
  type: "text",
  prop: text_props
};

function bar_props(e) {
  var p = {};

  // // x
  // if (e.has(X)) {
  //   p.x = {scale: X, field: e.field(X)};
  // } else if (!e.has(X)) {
  //   p.x = {value: 0};
  // }
  // // x2
  // if (e.isType(X,Q|T)) {
  //   p.x2 = {scale: X, value: 0};
  // }
  if (e.isType(X,Q|T)) {
    if (e.has(X)) {
      p.x = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.x = {value: 0};
    }
    p.x2 = {scale: X, value: 0};
  } else {
    if (e.has(X)) {
      p.xc = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.xc = {value: 0};
    } 
  }

  // // y
  // if (e.has(Y)) {
  //   p.y = {scale: Y, field: e.field(Y)};
  // } else if (!e.has(Y)) {
  //   p.y = {group: "height"};
  // }
  // // y2
  // if (e.isType(Y,Q|T)) {
  //   p.y2 = {scale: Y, value: 0};
  // }
  if (e.isType(Y,Q|T)) {
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.y = {group: "height"};
    }
    p.y2 = {scale: Y, value: 0};
  } else {
    if (e.has(Y)) {
      p.yc = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.yc = {group: "height"};
    }
  }

  // width
  if (!e.isType(X,Q|T) && e.has(SIZE)) {
    p.width = {scale: SIZE, field: e.field(SIZE)};
  } else if (e.isType(X,O) && !e.has(SIZE)) {
//    p.width = {scale: X, band: true, offset: -1};
    p.width = {value: e.config("bandSize"), offset: -1};
  } else if (!e.isType(X,Q|T) && !e.has(SIZE)) {
    p.width = {value: e.config("barSize")};
  }

  // height
  if (!e.isType(Y,Q|T) && e.has(SIZE)) {
    p.height = {scale: SIZE, field: e.field(SIZE)};
  } else if (e.isType(Y,O) && !e.has(SIZE)) {
//    p.height = {scale: Y, band: true, offset: -1};
    p.height = {value: e.config("bandSize"), offset: -1};
  } else if (!e.isType(Y,Q|T) && !e.has(SIZE)) {
    p.height = {value: e.config("barSize")};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.config("color")};
  }
  
  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  return p;
}

function point_props(e) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: "height"};
  }

  // size
  if (e.has(SIZE)) {
    p.size = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(X)) {
    p.size = {value: e.config("pointSize")};
  }
  
  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.field(SHAPE)};
  } else if (!e.has(X)) {
    p.shape = {value: e.config("pointShape")};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.config("color")};
  }
  
  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }
  
  p.strokeWidth = {value: e.config("strokeWidth")};

  return p;
}

function line_props(e) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: "height"};
  }
  
  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.config("color")};
  }
  
  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }
  
  p.strokeWidth = {value: e.config("strokeWidth")};

  return p;
}

function area_props(e) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }
  // x2
  if (e.isType(X,Q)) {
    p.x2 = {scale: X, value: 0};
    p.orient = {value: "horizontal"};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: "height"};
  }
  // y2
  if (e.isType(Y,Q)) {
    p.y2 = {scale: Y, value: 0};
  }
  
  // stroke
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.config("color")};
  }
  
  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  return p;
}

function filled_point_props(shape) {
  return function(e) {
    var p = {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.x = {value: 0};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.y = {group: "height"};
    }

    // size
    if (e.has(SIZE)) {
      p.size = {scale: SIZE, field: e.field(SIZE)};
    } else if (!e.has(X)) {
      p.size = {value: e.config("pointSize")};
    }
  
    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.field(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.config("color")};
    }
  
    // alpha
    if (e.has(ALPHA)) {
      p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
    }

    return p;
  };
}

function text_props(e) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: "height"};
  }

  // size
  if (e.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(X)) {
    p.fontSize = {value: e.config("fontSize")};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.config("textColor")};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  // text
  if (e.has(TEXT)) {
    p.text = {field: e.field(TEXT)};
  } else {
    p.text = {value: "Abc"};
  }
  
  p.font = {value: e.config("font")};
  p.fontWeight = {value: e.config("fontWeight")};
  p.fontStyle = {value: e.config("fontStyle")};
  p.baseline = {value: e.config("textBaseline")};
  
  // align
  if (e.has(X)) {
    if (e.isType(X,O)) {
      p.align = {value: "left"};
      p.dx = {value: e.config("textMargin")};
    } else {
      p.align = {value: "center"}
    }
  } else if (e.has(Y)) {
    p.align = {value: "left"};
    p.dx = {value: e.config("textMargin")};
  } else {
    p.align = {value: e.config("textAlign")};
  }
  
  return p;
}