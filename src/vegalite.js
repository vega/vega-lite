(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.vl = factory();
  }
}(this, function() {

// BEGINNING OF THIS MODULE

var vl = {};
var TABLE = "table";
var STACKED = "stacked";
var INDEX = "index";

var X = "x";
var Y = "y";
var ROW = "row";
var COL = "col";
var SIZE = "size";
var SHAPE = "shape";
var COLOR = "color";
var ALPHA = "alpha";
var TEXT = "text";

var O = 1;
var Q = 2;
var T = 4;

vl.dataTypes = {"O": O, "Q": Q, "T": T};

// inverse mapping e.g., 1=>O
vl.dataTypeNames = ["O","Q","T"].reduce(function(r,x) {
  r[vl.dataTypes[x]] = x; return r;
},{});

vl.DEFAULTS = {
  // template
  dataUrl: undefined, //for easier export
  width: 300,
  height: 300,

  //small multiples
  cellHeight: 200, // will be overwritten by bandWidth
  cellWidth: 200, // will be overwritten by bandWidth
  cellPadding: 10,
  cellBackgroundColor: "#fafafa",

  // marks
  barSize: 10,
  bandSize: 21,
  pointSize: 50,
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
  fontStyle: "normal",

  // scales
  xZero: true,
  xReverse: false,
  yZero: true,
  yReverse: false
};

vl.keys = function (obj) {
  var k = [], x;
  for (x in obj) k.push(x);
  return k;
}

vl.vals = function (obj) {
  var v = [], x;
  for (x in obj) v.push(obj[x]);
  return v;
}

function find(list, pattern) {
  var l = list.filter(function(x) {
    return x[pattern.name] === pattern.value;
  });
  return l.length && l[0] || null;
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

function duplicate(obj) {
  return JSON.parse(JSON.stringify(obj));
};

// ----
vl.Encoding = (function() {

  function Encoding(marktype, enc, config) {
    this._marktype = marktype;
    this._enc = enc;
    this._cfg = config
      ? Object.create(vl.DEFAULTS, config)
      : vl.DEFAULTS;
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

  // get "field" property for vega
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

  proto.toJSON = function(space, excludeConfig){
    var enc = duplicate(this._enc), json;

    // convert type's bitcode to type name
    for(var e in enc){
      enc[e].type = vl.dataTypeNames[enc[e].type];
    }

    json = {
      marktype: this._marktype,
      enc: enc
    }

    if(!excludeConfig){
      json.cfg = this._cfg
    }

    return json;
  };

  proto.toShorthand = function(){
    var enc = this._enc;
    return this._marktype + "." + vl.keys(enc).map(function(e){
      var v = enc[e];
        return e + "-" +
          (v.aggr ? v.aggr+"_" : "") +
          (v.bin ? "bin_" : "") +
          v.name + "-" + vl.dataTypeNames[v.type];
      }
    ).join(".");
  }

  Encoding.parseJSON = function(json){
    var enc = duplicate(json.enc),
      cfg = vl.keys(json.cfg).reduce(function(o, k){
          o[k] = {value: json.cfg[k]};
          return o;
        }, {});

    //convert type from string to bitcode (e.g, O=1)
    for(var e in enc){
      enc[e].type = vl.dataTypes[enc[e].type];
    }



    return new Encoding(json.marktype, enc, cfg);
  }

  return Encoding;

})();

// ----

vl.error = function(msg){
  console.error("[VL Error]", msg);
}

vl.toVegaSpec = function(enc, data) {
  var spec = template(enc),
      group = spec.marks[0],
      mark = marks[enc.marktype()],
      mdef = markdef(mark, enc);

  var hasRow = enc.has(ROW), hasCol=enc.has(COL);

  group.marks.push(mdef);

  // HACK to set chart size
  // NOTE: this fails for plots driven by derived values (e.g., aggregates)
  // One solution is to update Vega to support auto-sizing
  // In the meantime, auto-padding (mostly) does the trick
  var colCardinality= hasCol ? uniq(data, enc.field(COL,1)) : 1,
    rowCardinality= hasRow ? uniq(data, enc.field(ROW,1)) : 1;

  var cellWidth = enc.config("cellWidth") || enc.config("width") * 1.0 /colCardinality,
    cellHeight = enc.config("cellHeight") || enc.config("height") * 1.0 / rowCardinality,
    cellPadding = enc.config("cellPadding");

  if(enc.has(X) && enc.isType(X, O)){ //ordinal field will override parent
    cellWidth = uniq(data, enc.field(X,1)) * enc.config("bandSize");
    spec.width = cellWidth * colCardinality + cellPadding * (colCardinality-1);
  }

  if(enc.has(Y) && enc.isType(Y, O)){
    cellHeight = uniq(data, enc.field(Y,1)) * enc.config("bandSize");
    spec.height = cellHeight * rowCardinality + cellPadding * (colCardinality-1);
  }

  binning(spec.data[0], enc);

  var lineType = marks[enc.marktype()].line;

  // handle subfacets
  var aggResult = aggregates(spec.data[0], enc),
    details = aggResult.details,
    hasDetails = details && details.length > 0,
    stack = hasDetails && stacking(spec, enc, mdef);

  if (hasDetails){
    if(stack || lineType){
      var m = group.marks,
        g = groupdef("subfacet", {marks: m});

      group.marks = [g];
      g.from = mdef.from;
      delete mdef.from;

      //TODO test LOD -- we should support stack / line without color (LOD) field
      var trans = (g.from.transform || (g.from.transform=[]));
      trans.unshift({type: "facet", keys: details});

      if(stack && enc.has(COLOR)){
        trans.unshift({type: "sort", by: enc.field(COLOR)});
      }
    }
  }

  // auto-sort line/area values
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
    var f = (enc.isType(X,Q|T) && enc.isType(Y,O)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    mdef.from.transform = [{type: "sort", by: enc.field(f)}];
  }

  // Small Multiples
  if(hasRow || hasCol){
    var enter = group.properties.enter;
    var facetKeys = [], cellAxes=[];

    enter.fill = {value: enc.config("cellBackgroundColor")};

    //move "from" to cell level and add facet transform
    group.from = {data: group.marks[0].from.data};

    if(group.marks[0].from.transform){
      delete group.marks[0].from.data;
    }else{
      delete group.marks[0].from;
    }
    if(hasRow){
      if(!enc.isType(ROW, O)){
        vl.error("Row encoding should be ordinal.");
      }
      enter.y = {scale: ROW, field: "keys."+ facetKeys.length};
      enter.height = {"value": cellHeight}; // HACK

      facetKeys.push(enc.field(ROW));

      var from;
      if(hasCol){
        from = duplicate(group.from);
        from.transform = from.transform || [];
        from.transform.unshift({type: "facet", keys: [enc.field(COL)]});
      }

      var axesGrp = groupdef("x-axes", {
        axes: vl.axis.defs(["x"], enc),
        x: hasCol && {scale: COL, field: "keys.0"},
        width: hasCol && {"value": cellWidth}, //HACK?
        from: from
      });

      spec.marks.push(axesGrp);
    }else{ // doesn't have row
      //keep x axis in the cell
      cellAxes.push.apply(cellAxes,vl.axis.defs(["x"], enc));
    }

    if(hasCol){
      if(!enc.isType(COL, O)){
        vl.error("Col encoding should be ordinal.");
      }
      enter.x = {scale: COL, field: "keys."+ facetKeys.length};
      enter.width = {"value": cellWidth}; // HACK

      facetKeys.push(enc.field(COL));

      var from;
      if(hasRow){
        from = duplicate(group.from);
        from.transform = from.transform || [];
        from.transform.unshift({type: "facet", keys: [enc.field(ROW)]});
      }

      var axesGrp = groupdef("y-axes", {
        axes: vl.axis.defs(["y"], enc),
        y: hasRow && {scale: ROW, field: "keys.0"},
        height: hasRow && {"value": cellHeight}, //HACK?
        from: from
      });

      spec.marks.push(axesGrp);
    }else{ // doesn't have col
      cellAxes.push.apply(cellAxes,vl.axis.defs(["y"], enc));
    }

    // assuming equal cellWidth here
    // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
    spec.scales = vl.scale.defs(
      scale_names(enter).concat(scale_names(mdef.properties.update)),
      enc,
      {cellWidth: cellWidth, cellHeight: cellHeight, stack: stack}
    ); // row/col scales + cell scales

    if(cellAxes.length > 0){
      group.axes = cellAxes;
    }

    // add facet transform
    var trans = (group.from.transform || (group.from.transform=[]));
    trans.unshift({type: "facet", keys: facetKeys});

  }else{
    group.scales = vl.scale.defs(scale_names(mdef.properties.update), enc,
      {stack: stack});
    group.axes = vl.axis.defs(axis_names(mdef.properties.update), enc);
  }

  return spec;
}

function binning(spec, enc) {
  var bins = {};
  enc.forEach(function(vv, d) {
    if (d.bin) bins[d.name] = d.name;
  });
  bins = vl.keys(bins);

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
      if (vv !== X && vv !== Y && vv !== ROW && vv !== COL) {
        detail[d.name] = dims[d.name];
      }
    }
  });
  dims = vl.vals(dims);
  meas = vl.vals(meas);

  if(meas.length > 0){
    if (!spec.transform) spec.transform = [];
    spec.transform.push({
      type: "aggregate",
      groupby: dims,
      fields: meas
    });
  }
  return {
    details: vl.vals(detail),
    aggregated: meas.length > 0
  }
}

function stacking(spec, enc, mdef, scales) {
  if (!marks[enc.marktype()].stack) return false;
  if (!enc.has(COLOR)) return false;

  var dim = X, val = Y, idx = 1;
  if (enc.isType(X,Q|T) && !enc.isType(Y,Q|T) && enc.has(Y)) {
    dim = Y;
    val = X;
    idx = 0;
  }

  // add transform to compute sums for scale
  spec.data.push({
    name: STACKED,
    source: TABLE,
    transform: [{
      type: "aggregate",
      groupby: [enc.field(dim)], //TODO: group by outer facet too?
      fields: [{op: "sum", field: enc.field(val)}]
    }]
  });
  // TODO: for small multiple we might need to calculate max of all facet?

  // update scale mapping
  // var s = find(scales ||[], {name:"name", value:val});
  // s.domain = {
  //   data: STACKED,
  //   field: "data.sum_" + enc.field(val, true)
  // };

  // add stack transform to mark
  mdef.from.transform = [{
    type: "stack",
    point: enc.field(dim),
    height: enc.field(val),
    output: {y1: val, y0: val+"2"}
  }];

  // TODO: This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {scale: val, field: val};
  mdef.properties.update[val+"2"] = mdef.properties.enter[val+"2"] = {scale: val, field: val+"2"};

  return val; //return stack encoding
}

function axis_names(props) {
  return vl.keys(vl.keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s===X || s===Y) a[props[x].scale] = 1;
    return a;
  }, {}));
}

// BEGIN: AXES

vl.axis = {};
vl.axis.defs = function(names, enc) {
  return names.reduce(function(a, name) {
    a.push({
      type: name,
      scale: name,
      ticks: 3 //TODO(kanitw): better determine # of ticks
    });
    return a;
  }, []);
}

// END: AXES

// BEGIN: SCALE
vl.scale = {};

function scale_names(props) {
  return vl.keys(vl.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
}

vl.scale.defs = function (names, enc, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale_type(name, enc),
      domain: scale_domain(name, enc, opt)
    };
    if (s.type === "ordinal") {
      s.sort = true;
    }

    scale_range(s, enc, opt);

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

function scale_domain(name, enc, opt) {
  return name == opt.stack ?
    {data: STACKED, field: "data.sum_" + enc.field(name, true)}:
    {data: TABLE, field: enc.field(name)};
}

function scale_range(s, enc, opt) {
  switch (s.name) {
    case X:
      if (enc.isType(s.name, O)) {
        s.bandWidth = enc.config("bandSize");
      } else {
        s.range = opt.cellWidth ? [0, opt.cellWidth] : "width";
        s.zero = enc.config("xZero");
        s.reverse = enc.config("xReverse");
      }
      s.round = true;
      s.nice = true;
      break;
    case Y:
      if (enc.isType(s.name, O)) {
        s.bandWidth = enc.config("bandSize");
      } else {
        s.range = opt.cellHeight ? [opt.cellHeight, 0] : "height";
        s.zero = enc.config("yZero");
        s.reverse = enc.config("yReverse");
      }
      s.round = true;
      s.nice = true;
      break;
    case ROW:
      s.bandWidth = opt.cellHeight || enc.config("cellHeight");
      s.round = true;
      s.nice = true;
      break;
    case COL:
      s.bandWidth = opt.cellWidth || enc.config("cellWidth");
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
      s.zero = false;
      break;
    case SHAPE:
      s.range = "shapes";
      break;
    case COLOR:
      if (enc.isType(s.name, O)) {
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
      s.padding = 0.1;
      break;
    default:
      if (enc.isType(s.name, O) ) { //&& !s.bandWidth
        s.points = true;
        s.padding = 1.0;
      }
  }
}

// END: SCALE

// BEGIN: MARKS
function markdef(mark, enc) {
  var p = mark.prop(enc)
  return {
    type: mark.type,
    from: {data: TABLE},
    properties: {enter: p, update: p}
  };
}

function groupdef(name, opt) {
  opt = opt || {};
  return {
    _name: name || undefined,
    type: "group",
    from: opt.from,
    properties: {
      enter: {
        x: opt.x || undefined,
        y: opt.y || undefined,
        width: opt.width || {group: "width"},
        height: opt.height || {group: "height"}
      }
    },
    scales: opt.scales || undefined,
    axes: opt.axes || undefined,
    marks: opt.marks || []
  };
}

function template(enc) {
  var data = {name:TABLE},
    dataUrl = enc.config("dataUrl");
  if(dataUrl) data.url = dataUrl;

  return {
    width: enc.config("width"),
    height: enc.config("height"),
    padding: "auto",
    data: [data],
    marks: [groupdef("cell")]
  };
}

// --------------------------------------------------------

var marks = {};

marks.bar = {
  type: "rect",
  stack: true,
  prop: bar_props
};

marks.line = {
  type: "line",
  line: true,
  prop: line_props
};

marks.area = {
  type: "area",
  stack: true,
  line: true,
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

  // x
  if (e.isType(X,Q|T)) {
    p.x = {scale: X, field: e.field(X)};
    if (!e.isType(Y,Q|T) && e.has(Y)) {
      p.x2 = {scale: X, value: 0};
    }
  } else if (e.has(X)) {
    p.xc = {scale: X, field: e.field(X)};
  } else {
    p.xc = {value: 0};
  }

  // y
  if (e.isType(Y,Q|T)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.yc = {scale: Y, field: e.field(Y)};
  } else {
    p.yc = {group: "height"};
  }

  // width
  if (!e.isType(X,Q|T)) {
    if (e.has(SIZE)) {
      p.width = {scale: SIZE, field: e.field(SIZE)};
    } else {
      // p.width = {scale: X, band: true, offset: -1};
      p.width = {value: e.config("bandSize"), offset: -1};
    }
  } else if (!e.isType(Y,O)) {
    p.width = {value: e.config("bandSize"), offset: -1};
  }

  // height
  if (!e.isType(Y,Q|T)) {
    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.field(SIZE)};
    } else {
      // p.height = {scale: Y, band: true, offset: -1};
      p.height = {value: e.config("bandSize"), offset: -1};
    }
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
  } else if (!e.has(SIZE)) {
    p.size = {value: e.config("pointSize")};
  }

  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.field(SHAPE)};
  } else if (!e.has(SHAPE)) {
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
  if (e.isType(X,Q|T)) {
    p.x = {scale: X, field: e.field(X)};
    if (!e.isType(Y,Q|T) && e.has(Y)) {
      p.x2 = {scale: X, value: 0};
      p.orient = {value: "horizontal"};
    }
  } else if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isType(Y,Q|T)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else {
    p.y = {group: "height"};
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

return vl;

// END MARKS

// END OF THIS MODULE

}));
