!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vl=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var globals = require("./globals"),
    util = require("./util"),
    consts = require('./consts');

var vl = util.merge(consts, util);

vl.schema = require('./schema');
vl.Encoding = require('./Encoding');
vl.axis = require('./axis');
vl.compile = require('./compile');
vl.data = require('./data');
vl.legends = require('./legends');
vl.marks = require('./marks')
vl.scale = require('./scale');

module.exports = vl;

},{"./Encoding":2,"./axis":3,"./compile":4,"./consts":5,"./data":6,"./globals":7,"./legends":8,"./marks":9,"./scale":10,"./schema":11,"./util":13}],2:[function(require,module,exports){
"use strict";

var global = require('./globals'),
  consts = require('./consts'),
  util = require('./util'),
  schema = require('./schema');

var Encoding = module.exports = (function() {

  function Encoding(marktype, enc, config) {
    this._marktype = marktype;
    this._enc = enc; // {encType1:field1, ...}
    this._cfg = util.merge(Object.create(consts.DEFAULTS), config);
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

  proto.enc = function(x){
    return this._enc[x];
  };

  // get "field" property for vega
  proto.field = function(x, nodata, nofn) {
    if (!this.has(x)) return null;

    var f = (nodata ? "" : "data.");

    if (this._enc[x].aggr === "count") {
      return f + "count";
    } else if (!nofn && this._enc[x].bin) {
      return f + "bin_" + this._enc[x].name;
    } else if (!nofn && this._enc[x].aggr) {
      return f + this._enc[x].aggr + "_" + this._enc[x].name;
    } else if (!nofn && this._enc[x].fn){
      return f + this._enc[x].fn + "_" + this._enc[x].name;
    } else {
      return f + this._enc[x].name;
    }
  };

  proto.fieldName = function(x){
    return this._enc[x].name;
  }

  proto.fieldTitle = function(x){
    if (this._enc[x].aggr) {
      return this._enc[x].aggr + "(" + this._enc[x].name + ")";
    } else {
      return this._enc[x].name;
    }
  }

  proto.scale = function(x){
    return this._enc[x].scale || {};
  }

  proto.axis = function(x){
    return this._enc[x].axis || {};
  }

  proto.aggr = function(x){
    return this._enc[x].aggr;
  }

  proto.bin = function(x){
    return this._enc[x].bin;
  }

  proto.legend = function(x){
    return this._enc[x].legend;
  }

  proto.fn = function(x){
    return this._enc[x].fn;
  }

  proto.any = function(f){
    return util.any(this._enc, f);
  }

  proto.all = function(f){
    return util.all(this._enc, f);
  }

  proto.length = function(){
    return util.keys(this._enc).length;
  }

  proto.reduce = function(f, init){
    var r = init, i=0;
    for (k in this._enc){
      r = f(r, this._enc[k], k, this._enc);
    }
    return r;
  }

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

  proto.toSpec = function(excludeConfig){
    var enc = util.duplicate(this._enc),
      spec;

    // convert type's bitcode to type name
    for(var e in enc){
      enc[e].type = consts.dataTypeNames[enc[e].type];
    }

    spec = {
      marktype: this._marktype,
      enc: enc
    }

    if(!excludeConfig){
      spec.cfg = util.duplicate(this._cfg)
    }

    return spec;
  };

  proto.toShorthand = function(){
    var enc = this._enc;
    return this._marktype + "." + util.keys(enc).map(function(e){
      var v = enc[e];
        return e + "-" +
          (v.aggr ? v.aggr+"_" : "") +
          (v.fn ? v.fn+"_" : "") +
          (v.bin ? "bin_" : "") +
          (v.name || "") + "-" +
          consts.dataTypeNames[v.type];
      }
    ).join(".");
  }

  Encoding.parseShorthand = function(shorthand, cfg){
    var enc = shorthand.split("."),
      marktype = enc.shift();

    enc = enc.reduce(function(m, e){
      var split = e.split("-"),
        enctype = split[0],
        o = {name: split[1], type: consts.dataTypes[split[2]]};

      // check aggregate type
      for(var i in schema.aggr.enum){
        var a = schema.aggr.enum[i];
        if(o.name.indexOf(a+"_") == 0){
          o.name = o.name.substr(a.length+1);
          if (a=="count" && o.name.length === 0) o.name = "*";
          o.aggr = a;
          break;
        }
      }
      // check time fn
      for(var i in schema.timefns){
        var f = schema.timefns[i];
        if(o.name && o.name.indexOf(f+"_") == 0){
          o.name = o.name.substr(o.length+1);
          o.fn = f;
          break;
        }
      }

      // check bin
      if(o.name && o.name.indexOf("bin_") == 0){
        o.name = o.name.substr(4);
        o.bin = true;
      }

      m[enctype] = o;
      return m;
    }, {});

    return new Encoding(marktype, enc, cfg);
  }

  Encoding.fromSpec = function(spec, extraCfg) {
    var enc = util.duplicate(spec.enc);

    //convert type from string to bitcode (e.g, O=1)
    for(var e in enc){
      enc[e].type = consts.dataTypes[enc[e].type];
    }

    return new Encoding(spec.marktype, enc, util.merge(spec.cfg, extraCfg || {}));
  }

  return Encoding;

})();

},{"./consts":5,"./globals":7,"./schema":11,"./util":13}],3:[function(require,module,exports){
var globals = require('./globals'),
  util = require('./util');

var axis = module.exports = {};

axis.names = function (props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s===X || s===Y) a[props[x].scale] = 1;
    return a;
  }, {}));
}

axis.defs = function(names, encoding, opt) {
  return names.reduce(function(a, name) {
    a.push(axis_def(name, encoding, opt));
    return a;
  }, []);
}

function axis_def(name, encoding, opt){
  var type = name, axis;
  var isCol = name==COL, isRow = name==ROW;
  if(isCol) type = "x";
  if(isRow) type = "y";

  var axis = {
    type: type,
    scale: name,
    ticks: 3 //TODO(kanitw): better determine # of ticks
  };

  if (encoding.axis(name).grid) {
    axis.grid = true;
    axis.layer = "back";
  }

  if (encoding.axis(name).title) {
    //show title by default

    axis = axis_title(axis, name, encoding, opt);
  }

  if(isRow || isCol){
    axis.properties = {
      ticks: { opacity: {value: 0} },
      majorTicks: { opacity: {value: 0} },
      axis: { opacity: {value: 0} }
    };
  }
  if(isCol){
    axis.offset = [opt.xAxisMargin || 0, encoding.config("yAxisMargin")];
    axis.orient = "top";
  }

  if (name=="x" && (encoding.isType(name, O) || encoding.bin(name))) {
    axis.properties = {
      labels: {
        angle: {value: 270},
        align: {value: "right"},
        baseline: {value: "middle"}
      }
    }
  }

  return axis;
}

function axis_title(axis, name, encoding, opt){
  axis.title = encoding.fieldTitle(name);
  if(name==Y){
    axis.titleOffset = 60;
    // TODO: set appropriate titleOffset
    // maybe based on some string length from stats
  }
  return axis;
}

},{"./globals":7,"./util":13}],4:[function(require,module,exports){
var globals = require('./globals'),
  util = require('./util'),
  axis = require('./axis'),
  legends = require('./legends'),
  marks = require('./marks'),
  scale = require('./scale');

var compile = module.exports = function(encoding, stats) {
  var size = setSize(encoding, stats),
    cellWidth = size.cellWidth,
    cellHeight = size.cellHeight;

  var hasAgg = encoding.any(function(v, k){
    return v.aggr !== undefined;
  });

  var spec = template(encoding, size, stats),
    group = spec.marks[0],
    mark = marks[encoding.marktype()],
    mdef = markdef(mark, encoding, {
      hasAggregate: hasAgg
    });

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  var preaggregatedData = encoding.config("useVegaServer");

  group.marks.push(mdef);
  // TODO: return value not used
  binning(spec.data[0], encoding, {preaggregatedData: preaggregatedData});

  var lineType = marks[encoding.marktype()].line;

  if(!preaggregatedData){
    encoding.forEach(function(encType, field){
      if(field.type === T && field.fn){
        timeTransform(spec.data[0], encoding, encType, field);
      }
    });
  }

  // handle subfacets
  var aggResult = aggregates(spec.data[0], encoding, {preaggregatedData: preaggregatedData}),
    details = aggResult.details,
    hasDetails = details && details.length > 0,
    stack = hasDetails && stacking(spec, encoding, mdef, aggResult.facets);

  if (hasDetails && (stack || lineType)) {
    //subfacet to group stack / line together in one group
    subfacet(group, mdef, details, stack, encoding);
  }

  // auto-sort line/area values
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
    var f = (encoding.isType(X, Q | T) && encoding.isType(Y, O)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    mdef.from.transform = [{type: "sort", by: encoding.field(f)}];
  }

  // Small Multiples
  if (hasRow || hasCol) {
    spec = facet(group, encoding, cellHeight, cellWidth, spec, mdef, stack, stats);
  } else {
    group.scales = scale.defs(scale.names(mdef.properties.update), encoding,
      {stack: stack, stats: stats});
    group.axes = axis.defs(axis.names(mdef.properties.update), encoding);
    group.legends = legends.defs(encoding);
  }
  return spec;
};

function getCardinality(encoding, encType, stats){
  var field = encoding.fieldName(encType);
  if (encoding.bin(encType)) {
    var bins = util.getbins(stats[field]);
    return (bins.stop - bins.start) / bins.step;
  }
  return stats[field].cardinality;
}

function setSize(encoding, stats) {
  var hasRow = encoding.has(ROW),
      hasCol = encoding.has(COL),
      hasX = encoding.has(X),
      hasY = encoding.has(Y);

  // HACK to set chart size
  // NOTE: this fails for plots driven by derived values (e.g., aggregates)
  // One solution is to update Vega to support auto-sizing
  // In the meantime, auto-padding (mostly) does the trick
  //
  var colCardinality = hasCol ? getCardinality(encoding, COL, stats) : 1,
    rowCardinality = hasRow ? getCardinality(encoding, ROW, stats) : 1;

  var cellWidth = hasX ?
      +encoding.config("cellWidth") || encoding.config("width") * 1.0 / colCardinality :
      encoding.marktype() === "text" ?
        +encoding.config("textCellWidth") :
        +encoding.config("bandSize"),
    cellHeight = hasY ?
      +encoding.config("cellHeight") || encoding.config("height") * 1.0 / rowCardinality :
      +encoding.config("bandSize"),
    cellPadding = encoding.config("cellPadding"),
    bandPadding = encoding.config("bandPadding"),
    width = encoding.config("_minWidth"),
    height = encoding.config("_minHeight");

  if (hasX && (encoding.isType(X, O) || encoding.bin(X))) { //ordinal field will override parent
    // bands within cell use rangePoints()
    var xCardinality = getCardinality(encoding, X, stats);
    cellWidth = (xCardinality + bandPadding) * +encoding.config("bandSize");
  }
  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells
  width = cellWidth * ((1 + cellPadding) * (colCardinality-1) + 1);

  if (hasY && (encoding.isType(Y, O) || encoding.bin(Y))) {
    // bands within cell use rangePoint()
    var yCardinality = getCardinality(encoding, Y, stats);
    cellHeight = (yCardinality + bandPadding) * +encoding.config("bandSize");
  }
  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells
  height = cellHeight * ((1 + cellPadding) * (rowCardinality-1) + 1);

  return {
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    width: width,
    height:height
  };
}

function facet(group, encoding, cellHeight, cellWidth, spec, mdef, stack, stats) {
    var enter = group.properties.enter;
    var facetKeys = [], cellAxes = [];

    var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

    var xAxisMargin = encoding.has(Y) ? encoding.config("xAxisMargin") : undefined;

    enter.fill = {value: encoding.config("cellBackgroundColor")};

    //move "from" to cell level and add facet transform
    group.from = {data: group.marks[0].from.data};

    if (group.marks[0].from.transform) {
      delete group.marks[0].from.data; //need to keep transform for subfacetting case
    } else {
      delete group.marks[0].from;
    }
    if (hasRow) {
      if (!encoding.isType(ROW, O)) {
        util.error("Row encoding should be ordinal.");
      }
      enter.y = {scale: ROW, field: "keys." + facetKeys.length};
      enter.height = {"value": cellHeight}; // HACK

      facetKeys.push(encoding.field(ROW));

      var from;
      if (hasCol) {
        from = util.duplicate(group.from);
        from.transform = from.transform || [];
        from.transform.unshift({type: "facet", keys: [encoding.field(COL)]});
      }

      var axesGrp = groupdef("x-axes", {
          axes: encoding.has(X) ?  axis.defs(["x"], encoding) : undefined,
          x: hasCol ? {scale: COL, field: "keys.0", offset: xAxisMargin} : {value: xAxisMargin},
          width: hasCol && {"value": cellWidth}, //HACK?
          from: from
        });

      spec.marks.push(axesGrp);
      (spec.axes = spec.axes || []);
      spec.axes.push.apply(spec.axes, axis.defs(["row"], encoding));
    } else { // doesn't have row
      if(encoding.has(X)){
        //keep x axis in the cell
        cellAxes.push.apply(cellAxes, axis.defs(["x"], encoding));
      }
    }

    if (hasCol) {
      if (!encoding.isType(COL, O)) {
        util.error("Col encoding should be ordinal.");
      }
      enter.x = {scale: COL, field: "keys." + facetKeys.length};
      enter.width = {"value": cellWidth}; // HACK

      facetKeys.push(encoding.field(COL));

      var from;
      if (hasRow) {
        from = util.duplicate(group.from);
        from.transform = from.transform || [];
        from.transform.unshift({type: "facet", keys: [encoding.field(ROW)]});
      }

      var axesGrp = groupdef("y-axes", {
        axes: encoding.has(Y) ? axis.defs(["y"], encoding) : undefined,
        y: hasRow && {scale: ROW, field: "keys.0"},
        x: hasRow && {value: xAxisMargin},
        height: hasRow && {"value": cellHeight}, //HACK?
        from: from
      });

      spec.marks.push(axesGrp);
      (spec.axes = spec.axes || [])
      spec.axes.push.apply(spec.axes, axis.defs(["col"], encoding, {
        xAxisMargin: xAxisMargin
      }));
    } else { // doesn't have col
      if(encoding.has(Y)){
        cellAxes.push.apply(cellAxes, axis.defs(["y"], encoding));
      }
    }

    if(hasRow){
      if(enter.x) enter.x.offset= xAxisMargin;
      else enter.x = {value: xAxisMargin};
    }
    if(hasCol){
      //TODO fill here..
    }

    // assuming equal cellWidth here
    // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
    spec.scales = (spec.scales ||[]).concat(scale.defs(
      scale.names(enter).concat(scale.names(mdef.properties.update)),
      encoding,
      {cellWidth: cellWidth, cellHeight: cellHeight, stack: stack, facet:true, stats: stats}
    )); // row/col scales + cell scales

    if (cellAxes.length > 0) {
      group.axes = cellAxes;
    }

    // add facet transform
    var trans = (group.from.transform || (group.from.transform = []));
    trans.unshift({type: "facet", keys: facetKeys});

  return spec;
  }

function subfacet(group, mdef, details, stack, encoding) {
  var m = group.marks,
    g = groupdef("subfacet", {marks: m});

  group.marks = [g];
  g.from = mdef.from;
  delete mdef.from;

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.unshift({type: "facet", keys: details});

  if (stack && encoding.has(COLOR)) {
    trans.unshift({type: "sort", by: encoding.field(COLOR)});
  }
}

function getTimeFn(fn){
  switch(fn){
    case "second": return "getUTCSeconds";
    case "minute": return "getUTCMinutes";
    case "hour": return "getUTCHours";
    case "day": return "getUTCDay";
    case "date": return "getUTCDate";
    case "month": return "getUTCMonth";
    case "year": return "getUTCFullYear";
  }
  console.error("no function specified for date");
}

function timeTransform(spec, encoding, encType, field){
  var func = getTimeFn(field.fn);

  spec.transform = spec.transform || [];
  spec.transform.push({
    type: "formula",
    field: encoding.field(encType),
    expr: "new Date(d.data."+field.name+")."+func+"()"
  });
  return spec;
}

function binning(spec, encoding, opt) {
  opt = opt || {};
  var bins = {};
  encoding.forEach(function(vv, d) {
    if (d.bin) bins[d.name] = d.name;
  });
  bins = util.keys(bins);

  if (bins.length === 0 || opt.preaggregatedData) return false;

  if (!spec.transform) spec.transform = [];
  bins.forEach(function(d) {
    spec.transform.push({
      type: "bin",
      field: "data." + d,
      output: "data.bin_" + d,
      maxbins: MAX_BINS
    });
  });
  return bins;
}

function aggregates(spec, encoding, opt) {
  opt = opt || {};
  var dims = {}, meas = {}, detail = {}, facets={};
  encoding.forEach(function(encType, field) {
    if (field.aggr) {
      if(field.aggr==="count"){
        meas["count"] = {op:"count", field:"*"};
      }else{
        meas[field.aggr+"|"+field.name] = {
          op:field.aggr,
          field:"data."+field.name
        };
      }
    } else {
      dims[field.name] = encoding.field(encType);
      if (encType==ROW || encType == COL){
        facets[field.name] = dims[field.name];
      }else if (encType !== X && encType !== Y) {
        detail[field.name] = dims[field.name];
      }
    }
  });
  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0 && !opt.preaggregatedData) {
    if (!spec.transform) spec.transform = [];
    spec.transform.push({
      type: "aggregate",
      groupby: dims,
      fields: meas
    });

    if (encoding.marktype() === TEXT) {
      meas.forEach( function (m) {
        var fieldName = m.field.substr(5), //remove "data."
          field = "data." + (m.op ? m.op + "_" : "") + fieldName;
        spec.transform.push({
          type: "formula",
          field: field,
          expr: "d3.format('.2f')(d."+field+")"
        });
      });
    }
  }
  return {
    details: util.vals(detail),
    dims: dims,
    facets: util.vals(facets),
    aggregated: meas.length > 0
  }
}

function stacking(spec, encoding, mdef, facets) {
  if (!marks[encoding.marktype()].stack) return false;
  if (!encoding.has(COLOR)) return false;

  var dim = X, val = Y, idx = 1;
  if (encoding.isType(X,Q|T) && !encoding.isType(Y,Q|T) && encoding.has(Y)) {
    dim = Y;
    val = X;
    idx = 0;
  }

  // add transform to compute sums for scale
  var stacked = {
    name: STACKED,
    source: TABLE,
    transform: [{
      type: "aggregate",
      groupby: [encoding.field(dim)].concat(facets), // dim and other facets
      fields: [{op: "sum", field: encoding.field(val)}] // TODO check if field with aggr is correct?
    }]
  };

  if(facets && facets.length > 0){
    stacked.transform.push({ //calculate max for each facet
      type: "aggregate",
      groupby: facets,
      fields: [{op: "max", field: "data.sum_" + encoding.field(val, true)}]
    });
  }

  spec.data.push(stacked);

  // add stack transform to mark
  mdef.from.transform = [{
    type: "stack",
    point: encoding.field(dim),
    height: encoding.field(val),
    output: {y1: val, y0: val+"2"}
  }];

  // TODO: This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {scale: val, field: val};
  mdef.properties.update[val+"2"] = mdef.properties.enter[val+"2"] = {scale: val, field: val+"2"};

  return val; //return stack encoding
}


function markdef(mark, encoding, opt) {
  var p = mark.prop(encoding, opt)
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

function template(encoding, size, stats) { //hack use stats

  var data = {name:TABLE, format: {type: encoding.config("dataFormatType")}},
    dataUrl = vl.data.getUrl(encoding, stats);
  if(dataUrl) data.url = dataUrl;

  var preaggregatedData = encoding.config("useVegaServer");

  encoding.forEach(function(encType, field){
    if(field.type == T){
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = "date";
    }else if(field.type == Q){
      data.format.parse = data.format.parse || {};
      if (field.aggr === "count") {
        var name = "count";
      } else if(preaggregatedData && field.bin){
        var name = "bin_" + field.name;
      } else if(preaggregatedData && field.aggr){
        var name = field.aggr + "_" + field.name;
      } else{
        var name = field.name;
      }
      data.format.parse[name] = "number";
    }
  });

  return {
    width: size.width,
    height: size.height,
    padding: "auto",
    data: [data],
    marks: [groupdef("cell", {
      width: size.cellWidth ? {value: size.cellWidth}: undefined,
      height: size.cellHeight ? {value: size.cellHeight} : undefined
    })]
  };
}

},{"./axis":3,"./globals":7,"./legends":8,"./marks":9,"./scale":10,"./util":13}],5:[function(require,module,exports){
var globals = require('./globals');

var consts = module.exports = {};

consts.encodingTypes = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, ALPHA, TEXT];

consts.dataTypes = {"O": O, "Q": Q, "T": T};

consts.dataTypeNames = ["O","Q","T"].reduce(function(r,x) {
  r[consts.dataTypes[x]] = x; return r;
},{});

consts.DEFAULTS = {
  // template
  width: undefined,
  height: undefined,
  viewport: undefined,
  _minWidth: 20,
  _minHeight: 20,

  // data source
  dataUrl: undefined, //for easier export
  useVegaServer: false,
  vegaServerUrl: "http://localhost:3001",
  vegaServerTable: undefined,
  dataFormatType: "json",

  //small multiples
  cellHeight: 200, // will be overwritten by bandWidth
  cellWidth: 200, // will be overwritten by bandWidth
  cellPadding: 0.1,
  cellBackgroundColor: "#fdfdfd",
  xAxisMargin: 80,
  yAxisMargin: 0,
  textCellWidth: 90,

  // marks
  bandSize: 21,
  bandPadding: 1,
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
  opacity: 1,
  _thickOpacity: 0.5,
  _thinOpacity: 0.2,

  // scales
  // TODO remove _xZero, ...
  _xZero: true,
  _xReverse: false,
  _yZero: true,
  _yReverse: false,
  timeScaleNice: "day"
};
},{"./globals":7}],6:[function(require,module,exports){
// TODO rename getDataUrl to vl.data.getUrl() ?

var util = require('./util');

var data = module.exports = {};

data.getUrl = function getDataUrl(encoding, stats) {
  if (!encoding.config("useVegaServer")) {
    // don't use vega server
    return encoding.config("dataUrl");
  }

  if (encoding.length() === 0) {
    // no fields
    return;
  }

  var fields = []
  encoding.forEach(function(encType, field){
    var obj = {
      name: encoding.field(encType, true),
      field: field.name
    }
    if (field.aggr) {
      obj.aggr = field.aggr
    }
    if (field.bin) {
      obj.binSize = util.getbins(stats[field.name]).step;
    }
    fields.push(obj);
  });

  var query = {
    table: encoding.config("vegaServerTable"),
    fields: fields
  }

  return encoding.config("vegaServerUrl") + "/query/?q=" + JSON.stringify(query)
};

/**
 * @param  {Object} data data in JSON/javascript object format
 * @return Array of {name: __name__, type: "number|text|time|location"}
 */
data.getSchema = function(data){
  var schema = [],
    fields = util.keys(data[0]);

  fields.forEach(function(k){
    // find non-null data
    var i=0, datum = data[i][k];
    while(datum === "" || datum === null || datum === undefined){
      datum = data[++i][k];
    }

    //TODO(kanitw): better type inference here
    var type = (typeof datum === "number") ? "number" :
      isNaN(Date.parse(datum)) ? "text" : "time";

    schema.push({name: k, type: type});
  });

  return schema;
};

data.getStats = function(data){ // hack
  var stats = {},
    fields = util.keys(data[0]);

  fields.forEach(function(k) {
    var stat = util.minmax(data, k);
    stat.cardinality = util.uniq(data, k);
    stat.count = data.length;
    stats[k] = stat;
  });
  return stats;
};

},{"./util":13}],7:[function(require,module,exports){
(function (global){
// declare global constant
var g = global || window;

g.TABLE = "table";
g.STACKED = "stacked";
g.INDEX = "index";

g.X = "x";
g.Y = "y";
g.ROW = "row";
g.COL = "col";
g.SIZE = "size";
g.SHAPE = "shape";
g.COLOR = "color";
g.ALPHA = "alpha";
g.TEXT = "text";

g.O = 1;
g.Q = 2;
g.T = 4;

//TODO refactor this to be config?
g.MAX_BINS = 20;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
var global = require('./globals');

var legends = module.exports = {};

legends.defs = function(encoding) {
  var legends = [];

  // TODO: support alpha

  if (encoding.has(COLOR) && encoding.legend(COLOR)) {
    legends.push({
      fill: COLOR,
      title: encoding.fieldTitle(COLOR),
      orient: "right"
    });
  }

  if (encoding.has(SIZE) && encoding.legend(SIZE)) {
    legends.push({
      size: SIZE,
      title: encoding.fieldTitle(SIZE),
      orient: legends.length === 1 ? "left" : "right"
    });
  }

  if (encoding.has(SHAPE) && encoding.legend(SHAPE)) {
    if (legends.length === 2) {
      // TODO: fix this
      console.error("Vegalite currently only supports two legends");
      return legends;
    }
    legends.push({
      shape: SHAPE,
      title: encoding.fieldTitle(SHAPE),
      orient: legends.length === 1 ? "left" : "right"
    });
  }

  return legends;
}
},{"./globals":7}],9:[function(require,module,exports){
var globals = require("./globals"),
  util = require("./util");

var marks = module.exports = {};

marks.bar = {
  type: "rect",
  stack: true,
  prop: bar_props,
  requiredEncoding: ["x", "y"],
  supportedEncoding: {row:1, col:1, x:1, y:1, size:1, color:1, alpha:1}
};

marks.line = {
  type: "line",
  line: true,
  prop: line_props,
  requiredEncoding: ["x", "y"],
  supportedEncoding: {row:1, col:1, x:1, y:1, color:1, alpha:1}
};

marks.area = {
  type: "area",
  stack: true,
  line: true,
  requiredEncoding: ["x", "y"],
  prop: area_props,
  supportedEncoding: marks.line.supportedEncoding
};

marks.circle = {
  type: "symbol",
  prop: filled_point_props("circle"),
  supportedEncoding: {row:1, col:1, x:1, y:1, size:1, color:1, alpha:1}
};

marks.square = {
  type: "symbol",
  prop: filled_point_props("square"),
  supportedEncoding: marks.circle.supportedEncoding
};

marks.point = {
  type: "symbol",
  prop: point_props,
  supportedEncoding: {row:1, col:1, x:1, y:1, size:1, color:1, alpha:1, shape:1}
};

marks.text = {
  type: "text",
  prop: text_props,
  requiredEncoding: ["text"],
  supportedEncoding: {row:1, col:1, size:1, color:1, alpha:1, text:1}
};

function bar_props(e) {
  var p = {};

  // x
  if (e.isType(X,Q|T) && !e.bin(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.has(Y) && (!e.isType(Y,Q|T) || e.bin(Y))) {
      p.x2 = {scale: X, value: 0};
    }
  } else if (e.has(X)) {
    p.xc = {scale: X, field: e.field(X)};
  } else {
    p.xc = {value: 0};
  }

  // y
  if (e.isType(Y,Q|T) && !e.bin(Y)) {
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
      p.width = {value: +e.config("bandSize"), offset: -1};
    }
  } else if (!e.isType(Y,O) && !e.bin(Y)) {
    p.width = {value: +e.config("bandSize"), offset: -1};
  }

  // height
  if (!e.isType(Y,Q|T)) {
    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.field(SIZE)};
    } else {
      // p.height = {scale: Y, band: true, offset: -1};
      p.height = {value: +e.config("bandSize"), offset: -1};
    }
  } else if (!e.isType(X,O) && !e.bin(X)) {
    p.height = {value: +e.config("bandSize"), offset: -1};
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

function point_props(e, opt) {
  var p = {};
  opt = opt || {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: e.config("bandSize")/2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.config("bandSize")/2};
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
  }else{
    p.opacity = {
      value: e.config("opacity") || e.config(opt.hasAggregate ? "_thickOpacity" : "_thinOpacity")
    };
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
  return function(e, opt) {
    var p = {};
    opt = opt || {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.x = {value: e.config("bandSize")/2};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.y = {value: e.config("bandSize")/2};
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
    }else {
      p.opacity = {
        value: e.config("opacity") || e.config(opt.hasAggregate ? "_thickOpacity" : "_thinOpacity")
      };
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
    p.x = {value: e.config("bandSize")/2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.config("bandSize")/2};
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
},{"./globals":7,"./util":13}],10:[function(require,module,exports){
var globals = require("./globals"),
  util = require("./util");

var scale = module.exports = {};

scale.names = function (props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
}

scale.defs = function (names, encoding, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale_type(name, encoding),
      domain: scale_domain(name, encoding, opt)
    };
    if (s.type === "ordinal" && !encoding.bin(name)) {
      s.sort = true;
    }

    scale_range(s, encoding, opt);

    return (a.push(s), a);
  }, []);
}

function scale_type(name, encoding) {
  switch (encoding.type(name)) {
    case O: return "ordinal";
    case T:
      if (encoding.fn(name)) {
        return "linear";
      }
      return "time";
    case Q:
      if (encoding.bin(name)) {
        return "ordinal";
      }
      return encoding.scale(name).type || "linear";
  }
}

function scale_domain(name, encoding, opt) {
  if (encoding.type(name) === T){
    switch(encoding.fn(name)){
      case "second":
      case "minute": return [0, 59];
      case "hour": return [0, 23];
      case "day": return [0, 6];
      case "date": return [1, 31];
      case "month": return [0, 11];
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
      if (encoding.isType(s.name, O) || encoding.bin(s.name)) {
        s.bandWidth = +encoding.config("bandSize");
      } else {
        s.range = opt.cellWidth ? [0, opt.cellWidth] : "width";
        //TODO zero and reverse should become generic, and we just read default from either the schema or the schema generator
        s.zero = spec.zero || encoding.config("_xZero");
        s.reverse = spec.reverse || encoding.config("_xReverse");
      }
      s.round = true;
      if (encoding.isType(s.name, T)){
        s.nice = encoding.aggr(s.name) || encoding.config("timeScaleNice");
      }else{
        s.nice = true;
      }
      break;
    case Y:
      if (encoding.isType(s.name, O) || encoding.bin(s.name)) {
        s.bandWidth = +encoding.config("bandSize");
      } else {
        s.range = opt.cellHeight ? [opt.cellHeight, 0] : "height";
        //TODO zero and reverse should become generic, and we just read default from either the schema or the schema generator
        s.zero = spec.zero || encoding.config("_yZero");
        s.reverse = spec.reverse || encoding.config("_yReverse");
      }

      s.round = true;

      if (encoding.isType(s.name, T)){
        s.nice = encoding.aggr(s.name);
      }else{
        s.nice = true;
      }
      break;
    case ROW:
      s.bandWidth = opt.cellHeight || encoding.config("cellHeight");
      s.round = true;
      s.nice = true;
      break;
    case COL:
      s.bandWidth = opt.cellWidth || encoding.config("cellWidth");
      s.round = true;
      s.nice = true;
      break;
    case SIZE:
      if (encoding.is("bar")) {
        s.range = [3, +encoding.config("bandSize")];
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
      if (encoding.isType(s.name, O)) {
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
      if (encoding.isType(s.name, O) || encoding.bin(s.name) ) { //&& !s.bandWidth
        s.points = true;
        s.padding = encoding.config("bandPadding");
      }
  }
}
},{"./globals":7,"./util":13}],11:[function(require,module,exports){
// Package of defining Vegalite Specification's json schema
//
var schema = module.exports = {},
  util = require('./util');

schema.util = require('./schemautil');

schema.marktype = {
  type: "string",
  enum: ["point", "bar", "line", "area", "circle", "square", "text"]
};

schema.aggr = {
  type: "string",
  enum: ["avg", "sum", "min", "max", "count"],
  supportedEnums: {
    Q: ["avg", "sum", "min", "max", "count"],
    O: ["count"],
    T: ["avg", "min", "max", "count"],
    "": ["count"],
  },
  supportedTypes: {"Q": true, "O": true, "T": true, "": true}
};

schema.timefns = ["month", "year", "day", "date", "hour", "minute", "second"];

schema.fn = {
  type: "string",
  enum: schema.timefns,
  supportedTypes: {"T": true}
}

//TODO(kanitw): add other type of function here

schema.scale_type = {
  type: "string",
  enum: ["linear", "log","pow", "sqrt", "quantile"],
  default: "linear",
  supportedTypes: {"Q": true}
};

schema.field = {
  type: "object",
  required: ["name", "type"],
  properties: {
    name: {
      type: "string"
    }
  }
};

var clone = util.duplicate;
var merge = schema.util.merge;

var typicalField = merge(clone(schema.field), {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["O", "Q", "T"]
    },
    bin: {
      type: "boolean",
      supportedTypes: {"Q": true, "O": true}
    },
    aggr: schema.aggr,
    fn: schema.fn,
    scale: {
      type: "object",
      properties: {
        type: schema.scale_type,
        reverse: { type: "boolean", default: false },
        zero: {
          type: "boolean",
          description: "Include zero",
          default: false,
          supportedTypes: {"Q": true}
        },
        nice: {
          type: "string",
          enum: ["second", "minute", "hour", "day", "week", "month", "year"],
          supportedTypes: {"T": true}
        }
      }
    }
  }
});

var onlyOrdinalField = merge(clone(schema.field), {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["O"]
    },
    bin: {
      type: "boolean",
      supportedTypes: {"O": true}
    },
    aggr: {
      type: "string",
      enum: ["count"],
      supportedTypes: {"O": true}
    }
  }
});

var axisMixin = {
  type: "object",
  properties: {
    axis: {
      type: "object",
      properties: {
        grid: { type: "boolean", default: false },
        title: { type: "boolean", default: true }
      }
    }
  }
}

var legendMixin = {
  type: "object",
  properties: {
    legend: { type: "boolean", default: true }
  }
}

var textMixin = {
  type: "object",
  properties: {
    text: {
      type: "object",
      properties: {
        weight: {
          type: "string",
          enum: ["normal", "bold"],
          default: "normal",
          supportedTypes: {"T": true}
        },
        size: {
          type: "integer",
          default: 10,
          minimum: 0,
          supportedTypes: {"T": true}
        },
        font: {
          type: "string",
          default: "Halvetica Neue",
          supportedTypes: {"T": true}
        }
      }
    }
  }
}

var x = merge(clone(typicalField), axisMixin);
var y = clone(x);

var row = clone(onlyOrdinalField);
var col = clone(row);

var size = merge(clone(typicalField), legendMixin);
var color = merge(clone(typicalField), legendMixin);
var alpha = clone(typicalField);
var shape = merge(clone(onlyOrdinalField), legendMixin);

var text = merge(clone(typicalField), textMixin);

var cfg = {
  type: "object",
  properties: {
    dataFormatType: {
      type: "string",
      enum: ["json", "csv"]
    },
    useVegaServer: {
      type: "boolean",
      default: false
    },
    dataUrl: {
      type: "string"
    },
    vegaServerTable: {
      type: "string"
    },
    vegaServerUrl: {
      type: "string",
      default: "http://localhost:3001"
    }
  }
}

/** @type Object Schema of a vegalite specification */
schema.schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  required: ["marktype", "enc", "cfg"],
  properties: {
    marktype: schema.marktype,
    enc: {
      type: "object",
      properties: {
        x: x,
        y: y,
        row: row,
        col: col,
        size: size,
        color: color,
        alpha: alpha,
        shape: shape,
        text: text
      }
    },
    cfg: cfg
  }
};

/** Instantiate a verbose vl spec from the schema */
schema.instantiate = function(){
  return schema.util.instantiate(schema.schema);
}

},{"./schemautil":12,"./util":13}],12:[function(require,module,exports){
var util = module.exports = {};

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0
}

// instantiate a schema
util.instantiate = function(schema, required) {
  if (schema.type === 'object') {
    schema.required = schema.required ? schema.required : [];
    var instance = {};
    for (var name in schema.properties) {
      var child = schema.properties[name];
      instance[name] = util.instantiate(child, schema.required.indexOf(name) != -1);
    };
    return instance;
  } else if ('default' in schema) {
    return schema.default;
  } else if (schema.enum && required) {
    return schema.enum[0];
  }
  return undefined;
};

// remove all defaults from an instance
util.difference = function(defaults, instance) {
  var changes = {};
  for (var prop in instance) {
    if (!defaults || defaults[prop] !== instance[prop]) {
      if (typeof instance[prop] == "object") {
        var c = util.difference(defaults[prop], instance[prop]);
        if (!isEmpty(c))
          changes[prop] = c;
      } else {
        changes[prop] = instance[prop];
      }
    }
  }
  return changes;
};

// recursively merges instance into defaults
util.merge = function (defaults, instance) {
  if (typeof instance!=='object' || instance===null) {
    return defaults;
  }

  for (var p in instance) {
    if (!instance.hasOwnProperty(p))
      continue;
    if (instance[p]===undefined )
      continue;
    if (typeof instance[p] !== 'object' || instance[p] === null) {
      defaults[p] = instance[p];
    } else if (typeof defaults[p] !== 'object' || defaults[p] === null) {
      defaults[p] = util.merge(instance[p].constructor === Array ? [] : {}, instance[p]);
    } else {
      util.merge(defaults[p], instance[p]);
    }
  }
  return defaults;
}

},{}],13:[function(require,module,exports){
var util = module.exports = {};

util.keys = function (obj) {
  var k = [], x;
  for (x in obj) k.push(x);
  return k;
}

util.vals = function (obj) {
  var v = [], x;
  for (x in obj) v.push(obj[x]);
  return v;
}

util.range = function (start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error("infinite range");
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
}

util.find = function (list, pattern) {
  var l = list.filter(function(x) {
    return x[pattern.name] === pattern.value;
  });
  return l.length && l[0] || null;
}

util.uniq = function (data, field) {
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

util.minmax = function (data, field) {
  var stats = {min: +Infinity, max: -Infinity};
  for (i=0; i<data.length; ++i) {
    var v = data[i][field];
    if (v > stats.max) stats.max = v;
    if (v < stats.min) stats.min = v;
  }
  return stats;
}

util.duplicate = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

util.any = function(arr, f){
  var i=0, k;
  for (k in arr) {
    if(f(arr[k], k, i++)) return true;
  }
  return false;
}

util.all = function(arr, f){
  var i=0, k;
  for (k in arr) {
    if(!f(arr[k], k, i++)) return false;
  }
  return true;
}

util.merge = function(dest, src){
  return util.keys(src).reduce(function(c, k){
    c[k] = src[k];
    return c;
  }, dest);
};

util.getbins = function (stats) {
  return vg.bins({
    min: stats.min,
    max: stats.max,
    maxbins: MAX_BINS
  });
}


util.error = function(msg){
  console.error("[VL Error]", msg);
}


},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmwiLCJzcmMvRW5jb2RpbmcuanMiLCJzcmMvYXhpcy5qcyIsInNyYy9jb21waWxlLmpzIiwic3JjL2NvbnN0cy5qcyIsInNyYy9kYXRhLmpzIiwic3JjL2dsb2JhbHMuanMiLCJzcmMvbGVnZW5kcy5qcyIsInNyYy9tYXJrcy5qcyIsInNyYy9zY2FsZS5qcyIsInNyYy9zY2hlbWEuanMiLCJzcmMvc2NoZW1hdXRpbC5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGdsb2JhbHMgPSByZXF1aXJlKFwiLi9nbG9iYWxzXCIpLFxuICAgIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpLFxuICAgIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyk7XG5cbnZhciB2bCA9IHV0aWwubWVyZ2UoY29uc3RzLCB1dGlsKTtcblxudmwuc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEnKTtcbnZsLkVuY29kaW5nID0gcmVxdWlyZSgnLi9FbmNvZGluZycpO1xudmwuYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpO1xudmwuY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZScpO1xudmwuZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmwubGVnZW5kcyA9IHJlcXVpcmUoJy4vbGVnZW5kcycpO1xudmwubWFya3MgPSByZXF1aXJlKCcuL21hcmtzJylcbnZsLnNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYScpO1xuXG52YXIgRW5jb2RpbmcgPSBtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBFbmNvZGluZyhtYXJrdHlwZSwgZW5jLCBjb25maWcpIHtcbiAgICB0aGlzLl9tYXJrdHlwZSA9IG1hcmt0eXBlO1xuICAgIHRoaXMuX2VuYyA9IGVuYzsgLy8ge2VuY1R5cGUxOmZpZWxkMSwgLi4ufVxuICAgIHRoaXMuX2NmZyA9IHV0aWwubWVyZ2UoT2JqZWN0LmNyZWF0ZShjb25zdHMuREVGQVVMVFMpLCBjb25maWcpO1xuICB9XG5cbiAgdmFyIHByb3RvID0gRW5jb2RpbmcucHJvdG90eXBlO1xuXG4gIHByb3RvLm1hcmt0eXBlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmt0eXBlO1xuICB9O1xuXG4gIHByb3RvLmlzID0gZnVuY3Rpb24obSkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZSA9PT0gbTtcbiAgfTtcblxuICBwcm90by5oYXMgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHByb3RvLmVuYyA9IGZ1bmN0aW9uKHgpe1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF07XG4gIH07XG5cbiAgLy8gZ2V0IFwiZmllbGRcIiBwcm9wZXJ0eSBmb3IgdmVnYVxuICBwcm90by5maWVsZCA9IGZ1bmN0aW9uKHgsIG5vZGF0YSwgbm9mbikge1xuICAgIGlmICghdGhpcy5oYXMoeCkpIHJldHVybiBudWxsO1xuXG4gICAgdmFyIGYgPSAobm9kYXRhID8gXCJcIiA6IFwiZGF0YS5cIik7XG5cbiAgICBpZiAodGhpcy5fZW5jW3hdLmFnZ3IgPT09IFwiY291bnRcIikge1xuICAgICAgcmV0dXJuIGYgKyBcImNvdW50XCI7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbeF0uYmluKSB7XG4gICAgICByZXR1cm4gZiArIFwiYmluX1wiICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbeF0uYWdncikge1xuICAgICAgcmV0dXJuIGYgKyB0aGlzLl9lbmNbeF0uYWdnciArIFwiX1wiICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbeF0uZm4pe1xuICAgICAgcmV0dXJuIGYgKyB0aGlzLl9lbmNbeF0uZm4gKyBcIl9cIiArIHRoaXMuX2VuY1t4XS5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZiArIHRoaXMuX2VuY1t4XS5uYW1lO1xuICAgIH1cbiAgfTtcblxuICBwcm90by5maWVsZE5hbWUgPSBmdW5jdGlvbih4KXtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLm5hbWU7XG4gIH1cblxuICBwcm90by5maWVsZFRpdGxlID0gZnVuY3Rpb24oeCl7XG4gICAgaWYgKHRoaXMuX2VuY1t4XS5hZ2dyKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZW5jW3hdLmFnZ3IgKyBcIihcIiArIHRoaXMuX2VuY1t4XS5uYW1lICsgXCIpXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9XG4gIH1cblxuICBwcm90by5zY2FsZSA9IGZ1bmN0aW9uKHgpe1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uc2NhbGUgfHwge307XG4gIH1cblxuICBwcm90by5heGlzID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5heGlzIHx8IHt9O1xuICB9XG5cbiAgcHJvdG8uYWdnciA9IGZ1bmN0aW9uKHgpe1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uYWdncjtcbiAgfVxuXG4gIHByb3RvLmJpbiA9IGZ1bmN0aW9uKHgpe1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uYmluO1xuICB9XG5cbiAgcHJvdG8ubGVnZW5kID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5sZWdlbmQ7XG4gIH1cblxuICBwcm90by5mbiA9IGZ1bmN0aW9uKHgpe1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uZm47XG4gIH1cblxuICBwcm90by5hbnkgPSBmdW5jdGlvbihmKXtcbiAgICByZXR1cm4gdXRpbC5hbnkodGhpcy5fZW5jLCBmKTtcbiAgfVxuXG4gIHByb3RvLmFsbCA9IGZ1bmN0aW9uKGYpe1xuICAgIHJldHVybiB1dGlsLmFsbCh0aGlzLl9lbmMsIGYpO1xuICB9XG5cbiAgcHJvdG8ubGVuZ3RoID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdXRpbC5rZXlzKHRoaXMuX2VuYykubGVuZ3RoO1xuICB9XG5cbiAgcHJvdG8ucmVkdWNlID0gZnVuY3Rpb24oZiwgaW5pdCl7XG4gICAgdmFyIHIgPSBpbml0LCBpPTA7XG4gICAgZm9yIChrIGluIHRoaXMuX2VuYyl7XG4gICAgICByID0gZihyLCB0aGlzLl9lbmNba10sIGssIHRoaXMuX2VuYyk7XG4gICAgfVxuICAgIHJldHVybiByO1xuICB9XG5cbiAgcHJvdG8uZm9yRWFjaCA9IGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgaT0wLCBrO1xuICAgIGZvciAoayBpbiB0aGlzLl9lbmMpIHtcbiAgICAgIGYoaywgdGhpcy5fZW5jW2tdLCBpKyspO1xuICAgIH1cbiAgfTtcblxuICBwcm90by50eXBlID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLmhhcyh4KSA/IHRoaXMuX2VuY1t4XS50eXBlIDogbnVsbDtcbiAgfTtcblxuICBwcm90by5pc1R5cGUgPSBmdW5jdGlvbih4LCB0KSB7XG4gICAgdmFyIHh0ID0gdGhpcy50eXBlKHgpO1xuICAgIGlmICh4dCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuICh4dCAmIHQpID4gMDtcbiAgfTtcblxuICBwcm90by5jb25maWcgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NmZ1tuYW1lXTtcbiAgfTtcblxuICBwcm90by50b1NwZWMgPSBmdW5jdGlvbihleGNsdWRlQ29uZmlnKXtcbiAgICB2YXIgZW5jID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fZW5jKSxcbiAgICAgIHNwZWM7XG5cbiAgICAvLyBjb252ZXJ0IHR5cGUncyBiaXRjb2RlIHRvIHR5cGUgbmFtZVxuICAgIGZvcih2YXIgZSBpbiBlbmMpe1xuICAgICAgZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVOYW1lc1tlbmNbZV0udHlwZV07XG4gICAgfVxuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcmt0eXBlOiB0aGlzLl9tYXJrdHlwZSxcbiAgICAgIGVuYzogZW5jXG4gICAgfVxuXG4gICAgaWYoIWV4Y2x1ZGVDb25maWcpe1xuICAgICAgc3BlYy5jZmcgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9jZmcpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cbiAgcHJvdG8udG9TaG9ydGhhbmQgPSBmdW5jdGlvbigpe1xuICAgIHZhciBlbmMgPSB0aGlzLl9lbmM7XG4gICAgcmV0dXJuIHRoaXMuX21hcmt0eXBlICsgXCIuXCIgKyB1dGlsLmtleXMoZW5jKS5tYXAoZnVuY3Rpb24oZSl7XG4gICAgICB2YXIgdiA9IGVuY1tlXTtcbiAgICAgICAgcmV0dXJuIGUgKyBcIi1cIiArXG4gICAgICAgICAgKHYuYWdnciA/IHYuYWdncitcIl9cIiA6IFwiXCIpICtcbiAgICAgICAgICAodi5mbiA/IHYuZm4rXCJfXCIgOiBcIlwiKSArXG4gICAgICAgICAgKHYuYmluID8gXCJiaW5fXCIgOiBcIlwiKSArXG4gICAgICAgICAgKHYubmFtZSB8fCBcIlwiKSArIFwiLVwiICtcbiAgICAgICAgICBjb25zdHMuZGF0YVR5cGVOYW1lc1t2LnR5cGVdO1xuICAgICAgfVxuICAgICkuam9pbihcIi5cIik7XG4gIH1cblxuICBFbmNvZGluZy5wYXJzZVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgY2ZnKXtcbiAgICB2YXIgZW5jID0gc2hvcnRoYW5kLnNwbGl0KFwiLlwiKSxcbiAgICAgIG1hcmt0eXBlID0gZW5jLnNoaWZ0KCk7XG5cbiAgICBlbmMgPSBlbmMucmVkdWNlKGZ1bmN0aW9uKG0sIGUpe1xuICAgICAgdmFyIHNwbGl0ID0gZS5zcGxpdChcIi1cIiksXG4gICAgICAgIGVuY3R5cGUgPSBzcGxpdFswXSxcbiAgICAgICAgbyA9IHtuYW1lOiBzcGxpdFsxXSwgdHlwZTogY29uc3RzLmRhdGFUeXBlc1tzcGxpdFsyXV19O1xuXG4gICAgICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICAgICAgZm9yKHZhciBpIGluIHNjaGVtYS5hZ2dyLmVudW0pe1xuICAgICAgICB2YXIgYSA9IHNjaGVtYS5hZ2dyLmVudW1baV07XG4gICAgICAgIGlmKG8ubmFtZS5pbmRleE9mKGErXCJfXCIpID09IDApe1xuICAgICAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoYS5sZW5ndGgrMSk7XG4gICAgICAgICAgaWYgKGE9PVwiY291bnRcIiAmJiBvLm5hbWUubGVuZ3RoID09PSAwKSBvLm5hbWUgPSBcIipcIjtcbiAgICAgICAgICBvLmFnZ3IgPSBhO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBjaGVjayB0aW1lIGZuXG4gICAgICBmb3IodmFyIGkgaW4gc2NoZW1hLnRpbWVmbnMpe1xuICAgICAgICB2YXIgZiA9IHNjaGVtYS50aW1lZm5zW2ldO1xuICAgICAgICBpZihvLm5hbWUgJiYgby5uYW1lLmluZGV4T2YoZitcIl9cIikgPT0gMCl7XG4gICAgICAgICAgby5uYW1lID0gby5uYW1lLnN1YnN0cihvLmxlbmd0aCsxKTtcbiAgICAgICAgICBvLmZuID0gZjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjaGVjayBiaW5cbiAgICAgIGlmKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZihcImJpbl9cIikgPT0gMCl7XG4gICAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoNCk7XG4gICAgICAgIG8uYmluID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbVtlbmN0eXBlXSA9IG87XG4gICAgICByZXR1cm4gbTtcbiAgICB9LCB7fSk7XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKG1hcmt0eXBlLCBlbmMsIGNmZyk7XG4gIH1cblxuICBFbmNvZGluZy5mcm9tU3BlYyA9IGZ1bmN0aW9uKHNwZWMsIGV4dHJhQ2ZnKSB7XG4gICAgdmFyIGVuYyA9IHV0aWwuZHVwbGljYXRlKHNwZWMuZW5jKTtcblxuICAgIC8vY29udmVydCB0eXBlIGZyb20gc3RyaW5nIHRvIGJpdGNvZGUgKGUuZywgTz0xKVxuICAgIGZvcih2YXIgZSBpbiBlbmMpe1xuICAgICAgZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVzW2VuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHNwZWMubWFya3R5cGUsIGVuYywgdXRpbC5tZXJnZShzcGVjLmNmZywgZXh0cmFDZmcgfHwge30pKTtcbiAgfVxuXG4gIHJldHVybiBFbmNvZGluZztcblxufSkoKTtcbiIsInZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIGF4aXMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5heGlzLm5hbWVzID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIHZhciBzID0gcHJvcHNbeF0uc2NhbGU7XG4gICAgaWYgKHM9PT1YIHx8IHM9PT1ZKSBhW3Byb3BzW3hdLnNjYWxlXSA9IDE7XG4gICAgcmV0dXJuIGE7XG4gIH0sIHt9KSk7XG59XG5cbmF4aXMuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgb3B0KSB7XG4gIHJldHVybiBuYW1lcy5yZWR1Y2UoZnVuY3Rpb24oYSwgbmFtZSkge1xuICAgIGEucHVzaChheGlzX2RlZihuYW1lLCBlbmNvZGluZywgb3B0KSk7XG4gICAgcmV0dXJuIGE7XG4gIH0sIFtdKTtcbn1cblxuZnVuY3Rpb24gYXhpc19kZWYobmFtZSwgZW5jb2RpbmcsIG9wdCl7XG4gIHZhciB0eXBlID0gbmFtZSwgYXhpcztcbiAgdmFyIGlzQ29sID0gbmFtZT09Q09MLCBpc1JvdyA9IG5hbWU9PVJPVztcbiAgaWYoaXNDb2wpIHR5cGUgPSBcInhcIjtcbiAgaWYoaXNSb3cpIHR5cGUgPSBcInlcIjtcblxuICB2YXIgYXhpcyA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIHNjYWxlOiBuYW1lLFxuICAgIHRpY2tzOiAzIC8vVE9ETyhrYW5pdHcpOiBiZXR0ZXIgZGV0ZXJtaW5lICMgb2YgdGlja3NcbiAgfTtcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5ncmlkKSB7XG4gICAgYXhpcy5ncmlkID0gdHJ1ZTtcbiAgICBheGlzLmxheWVyID0gXCJiYWNrXCI7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS50aXRsZSkge1xuICAgIC8vc2hvdyB0aXRsZSBieSBkZWZhdWx0XG5cbiAgICBheGlzID0gYXhpc190aXRsZShheGlzLCBuYW1lLCBlbmNvZGluZywgb3B0KTtcbiAgfVxuXG4gIGlmKGlzUm93IHx8IGlzQ29sKXtcbiAgICBheGlzLnByb3BlcnRpZXMgPSB7XG4gICAgICB0aWNrczogeyBvcGFjaXR5OiB7dmFsdWU6IDB9IH0sXG4gICAgICBtYWpvclRpY2tzOiB7IG9wYWNpdHk6IHt2YWx1ZTogMH0gfSxcbiAgICAgIGF4aXM6IHsgb3BhY2l0eToge3ZhbHVlOiAwfSB9XG4gICAgfTtcbiAgfVxuICBpZihpc0NvbCl7XG4gICAgYXhpcy5vZmZzZXQgPSBbb3B0LnhBeGlzTWFyZ2luIHx8IDAsIGVuY29kaW5nLmNvbmZpZyhcInlBeGlzTWFyZ2luXCIpXTtcbiAgICBheGlzLm9yaWVudCA9IFwidG9wXCI7XG4gIH1cblxuICBpZiAobmFtZT09XCJ4XCIgJiYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBPKSB8fCBlbmNvZGluZy5iaW4obmFtZSkpKSB7XG4gICAgYXhpcy5wcm9wZXJ0aWVzID0ge1xuICAgICAgbGFiZWxzOiB7XG4gICAgICAgIGFuZ2xlOiB7dmFsdWU6IDI3MH0sXG4gICAgICAgIGFsaWduOiB7dmFsdWU6IFwicmlnaHRcIn0sXG4gICAgICAgIGJhc2VsaW5lOiB7dmFsdWU6IFwibWlkZGxlXCJ9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF4aXM7XG59XG5cbmZ1bmN0aW9uIGF4aXNfdGl0bGUoYXhpcywgbmFtZSwgZW5jb2RpbmcsIG9wdCl7XG4gIGF4aXMudGl0bGUgPSBlbmNvZGluZy5maWVsZFRpdGxlKG5hbWUpO1xuICBpZihuYW1lPT1ZKXtcbiAgICBheGlzLnRpdGxlT2Zmc2V0ID0gNjA7XG4gICAgLy8gVE9ETzogc2V0IGFwcHJvcHJpYXRlIHRpdGxlT2Zmc2V0XG4gICAgLy8gbWF5YmUgYmFzZWQgb24gc29tZSBzdHJpbmcgbGVuZ3RoIGZyb20gc3RhdHNcbiAgfVxuICByZXR1cm4gYXhpcztcbn1cbiIsInZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBsZWdlbmRzID0gcmVxdWlyZSgnLi9sZWdlbmRzJyksXG4gIG1hcmtzID0gcmVxdWlyZSgnLi9tYXJrcycpLFxuICBzY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxudmFyIGNvbXBpbGUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgc2l6ZSA9IHNldFNpemUoZW5jb2RpbmcsIHN0YXRzKSxcbiAgICBjZWxsV2lkdGggPSBzaXplLmNlbGxXaWR0aCxcbiAgICBjZWxsSGVpZ2h0ID0gc2l6ZS5jZWxsSGVpZ2h0O1xuXG4gIHZhciBoYXNBZ2cgPSBlbmNvZGluZy5hbnkoZnVuY3Rpb24odiwgayl7XG4gICAgcmV0dXJuIHYuYWdnciAhPT0gdW5kZWZpbmVkO1xuICB9KTtcblxuICB2YXIgc3BlYyA9IHRlbXBsYXRlKGVuY29kaW5nLCBzaXplLCBzdGF0cyksXG4gICAgZ3JvdXAgPSBzcGVjLm1hcmtzWzBdLFxuICAgIG1hcmsgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXSxcbiAgICBtZGVmID0gbWFya2RlZihtYXJrLCBlbmNvZGluZywge1xuICAgICAgaGFzQWdncmVnYXRlOiBoYXNBZ2dcbiAgICB9KTtcblxuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpO1xuXG4gIHZhciBwcmVhZ2dyZWdhdGVkRGF0YSA9IGVuY29kaW5nLmNvbmZpZyhcInVzZVZlZ2FTZXJ2ZXJcIik7XG5cbiAgZ3JvdXAubWFya3MucHVzaChtZGVmKTtcbiAgLy8gVE9ETzogcmV0dXJuIHZhbHVlIG5vdCB1c2VkXG4gIGJpbm5pbmcoc3BlYy5kYXRhWzBdLCBlbmNvZGluZywge3ByZWFnZ3JlZ2F0ZWREYXRhOiBwcmVhZ2dyZWdhdGVkRGF0YX0pO1xuXG4gIHZhciBsaW5lVHlwZSA9IG1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLmxpbmU7XG5cbiAgaWYoIXByZWFnZ3JlZ2F0ZWREYXRhKXtcbiAgICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGVuY1R5cGUsIGZpZWxkKXtcbiAgICAgIGlmKGZpZWxkLnR5cGUgPT09IFQgJiYgZmllbGQuZm4pe1xuICAgICAgICB0aW1lVHJhbnNmb3JtKHNwZWMuZGF0YVswXSwgZW5jb2RpbmcsIGVuY1R5cGUsIGZpZWxkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcbiAgdmFyIGFnZ1Jlc3VsdCA9IGFnZ3JlZ2F0ZXMoc3BlYy5kYXRhWzBdLCBlbmNvZGluZywge3ByZWFnZ3JlZ2F0ZWREYXRhOiBwcmVhZ2dyZWdhdGVkRGF0YX0pLFxuICAgIGRldGFpbHMgPSBhZ2dSZXN1bHQuZGV0YWlscyxcbiAgICBoYXNEZXRhaWxzID0gZGV0YWlscyAmJiBkZXRhaWxzLmxlbmd0aCA+IDAsXG4gICAgc3RhY2sgPSBoYXNEZXRhaWxzICYmIHN0YWNraW5nKHNwZWMsIGVuY29kaW5nLCBtZGVmLCBhZ2dSZXN1bHQuZmFjZXRzKTtcblxuICBpZiAoaGFzRGV0YWlscyAmJiAoc3RhY2sgfHwgbGluZVR5cGUpKSB7XG4gICAgLy9zdWJmYWNldCB0byBncm91cCBzdGFjayAvIGxpbmUgdG9nZXRoZXIgaW4gb25lIGdyb3VwXG4gICAgc3ViZmFjZXQoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBhdXRvLXNvcnQgbGluZS9hcmVhIHZhbHVlc1xuICAvL1RPRE8oa2FuaXR3KTogaGF2ZSBzb21lIGNvbmZpZyB0byB0dXJuIG9mZiBhdXRvLXNvcnQgZm9yIGxpbmUgKGZvciBsaW5lIGNoYXJ0IHRoYXQgZW5jb2RlcyB0ZW1wb3JhbCBpbmZvcm1hdGlvbilcbiAgaWYgKGxpbmVUeXBlKSB7XG4gICAgdmFyIGYgPSAoZW5jb2RpbmcuaXNUeXBlKFgsIFEgfCBUKSAmJiBlbmNvZGluZy5pc1R5cGUoWSwgTykpID8gWSA6IFg7XG4gICAgaWYgKCFtZGVmLmZyb20pIG1kZWYuZnJvbSA9IHt9O1xuICAgIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe3R5cGU6IFwic29ydFwiLCBieTogZW5jb2RpbmcuZmllbGQoZil9XTtcbiAgfVxuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAoaGFzUm93IHx8IGhhc0NvbCkge1xuICAgIHNwZWMgPSBmYWNldChncm91cCwgZW5jb2RpbmcsIGNlbGxIZWlnaHQsIGNlbGxXaWR0aCwgc3BlYywgbWRlZiwgc3RhY2ssIHN0YXRzKTtcbiAgfSBlbHNlIHtcbiAgICBncm91cC5zY2FsZXMgPSBzY2FsZS5kZWZzKHNjYWxlLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpLCBlbmNvZGluZyxcbiAgICAgIHtzdGFjazogc3RhY2ssIHN0YXRzOiBzdGF0c30pO1xuICAgIGdyb3VwLmF4ZXMgPSBheGlzLmRlZnMoYXhpcy5uYW1lcyhtZGVmLnByb3BlcnRpZXMudXBkYXRlKSwgZW5jb2RpbmcpO1xuICAgIGdyb3VwLmxlZ2VuZHMgPSBsZWdlbmRzLmRlZnMoZW5jb2RpbmcpO1xuICB9XG4gIHJldHVybiBzcGVjO1xufTtcblxuZnVuY3Rpb24gZ2V0Q2FyZGluYWxpdHkoZW5jb2RpbmcsIGVuY1R5cGUsIHN0YXRzKXtcbiAgdmFyIGZpZWxkID0gZW5jb2RpbmcuZmllbGROYW1lKGVuY1R5cGUpO1xuICBpZiAoZW5jb2RpbmcuYmluKGVuY1R5cGUpKSB7XG4gICAgdmFyIGJpbnMgPSB1dGlsLmdldGJpbnMoc3RhdHNbZmllbGRdKTtcbiAgICByZXR1cm4gKGJpbnMuc3RvcCAtIGJpbnMuc3RhcnQpIC8gYmlucy5zdGVwO1xuICB9XG4gIHJldHVybiBzdGF0c1tmaWVsZF0uY2FyZGluYWxpdHk7XG59XG5cbmZ1bmN0aW9uIHNldFNpemUoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSxcbiAgICAgIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpLFxuICAgICAgaGFzWCA9IGVuY29kaW5nLmhhcyhYKSxcbiAgICAgIGhhc1kgPSBlbmNvZGluZy5oYXMoWSk7XG5cbiAgLy8gSEFDSyB0byBzZXQgY2hhcnQgc2l6ZVxuICAvLyBOT1RFOiB0aGlzIGZhaWxzIGZvciBwbG90cyBkcml2ZW4gYnkgZGVyaXZlZCB2YWx1ZXMgKGUuZy4sIGFnZ3JlZ2F0ZXMpXG4gIC8vIE9uZSBzb2x1dGlvbiBpcyB0byB1cGRhdGUgVmVnYSB0byBzdXBwb3J0IGF1dG8tc2l6aW5nXG4gIC8vIEluIHRoZSBtZWFudGltZSwgYXV0by1wYWRkaW5nIChtb3N0bHkpIGRvZXMgdGhlIHRyaWNrXG4gIC8vXG4gIHZhciBjb2xDYXJkaW5hbGl0eSA9IGhhc0NvbCA/IGdldENhcmRpbmFsaXR5KGVuY29kaW5nLCBDT0wsIHN0YXRzKSA6IDEsXG4gICAgcm93Q2FyZGluYWxpdHkgPSBoYXNSb3cgPyBnZXRDYXJkaW5hbGl0eShlbmNvZGluZywgUk9XLCBzdGF0cykgOiAxO1xuXG4gIHZhciBjZWxsV2lkdGggPSBoYXNYID9cbiAgICAgICtlbmNvZGluZy5jb25maWcoXCJjZWxsV2lkdGhcIikgfHwgZW5jb2RpbmcuY29uZmlnKFwid2lkdGhcIikgKiAxLjAgLyBjb2xDYXJkaW5hbGl0eSA6XG4gICAgICBlbmNvZGluZy5tYXJrdHlwZSgpID09PSBcInRleHRcIiA/XG4gICAgICAgICtlbmNvZGluZy5jb25maWcoXCJ0ZXh0Q2VsbFdpZHRoXCIpIDpcbiAgICAgICAgK2VuY29kaW5nLmNvbmZpZyhcImJhbmRTaXplXCIpLFxuICAgIGNlbGxIZWlnaHQgPSBoYXNZID9cbiAgICAgICtlbmNvZGluZy5jb25maWcoXCJjZWxsSGVpZ2h0XCIpIHx8IGVuY29kaW5nLmNvbmZpZyhcImhlaWdodFwiKSAqIDEuMCAvIHJvd0NhcmRpbmFsaXR5IDpcbiAgICAgICtlbmNvZGluZy5jb25maWcoXCJiYW5kU2l6ZVwiKSxcbiAgICBjZWxsUGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZyhcImNlbGxQYWRkaW5nXCIpLFxuICAgIGJhbmRQYWRkaW5nID0gZW5jb2RpbmcuY29uZmlnKFwiYmFuZFBhZGRpbmdcIiksXG4gICAgd2lkdGggPSBlbmNvZGluZy5jb25maWcoXCJfbWluV2lkdGhcIiksXG4gICAgaGVpZ2h0ID0gZW5jb2RpbmcuY29uZmlnKFwiX21pbkhlaWdodFwiKTtcblxuICBpZiAoaGFzWCAmJiAoZW5jb2RpbmcuaXNUeXBlKFgsIE8pIHx8IGVuY29kaW5nLmJpbihYKSkpIHsgLy9vcmRpbmFsIGZpZWxkIHdpbGwgb3ZlcnJpZGUgcGFyZW50XG4gICAgLy8gYmFuZHMgd2l0aGluIGNlbGwgdXNlIHJhbmdlUG9pbnRzKClcbiAgICB2YXIgeENhcmRpbmFsaXR5ID0gZ2V0Q2FyZGluYWxpdHkoZW5jb2RpbmcsIFgsIHN0YXRzKTtcbiAgICBjZWxsV2lkdGggPSAoeENhcmRpbmFsaXR5ICsgYmFuZFBhZGRpbmcpICogK2VuY29kaW5nLmNvbmZpZyhcImJhbmRTaXplXCIpO1xuICB9XG4gIC8vIENlbGwgYmFuZHMgdXNlIHJhbmdlQmFuZHMoKS4gVGhlcmUgYXJlIG4tMSBwYWRkaW5nLiAgT3V0ZXJwYWRkaW5nID0gMCBmb3IgY2VsbHNcbiAgd2lkdGggPSBjZWxsV2lkdGggKiAoKDEgKyBjZWxsUGFkZGluZykgKiAoY29sQ2FyZGluYWxpdHktMSkgKyAxKTtcblxuICBpZiAoaGFzWSAmJiAoZW5jb2RpbmcuaXNUeXBlKFksIE8pIHx8IGVuY29kaW5nLmJpbihZKSkpIHtcbiAgICAvLyBiYW5kcyB3aXRoaW4gY2VsbCB1c2UgcmFuZ2VQb2ludCgpXG4gICAgdmFyIHlDYXJkaW5hbGl0eSA9IGdldENhcmRpbmFsaXR5KGVuY29kaW5nLCBZLCBzdGF0cyk7XG4gICAgY2VsbEhlaWdodCA9ICh5Q2FyZGluYWxpdHkgKyBiYW5kUGFkZGluZykgKiArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIik7XG4gIH1cbiAgLy8gQ2VsbCBiYW5kcyB1c2UgcmFuZ2VCYW5kcygpLiBUaGVyZSBhcmUgbi0xIHBhZGRpbmcuICBPdXRlcnBhZGRpbmcgPSAwIGZvciBjZWxsc1xuICBoZWlnaHQgPSBjZWxsSGVpZ2h0ICogKCgxICsgY2VsbFBhZGRpbmcpICogKHJvd0NhcmRpbmFsaXR5LTEpICsgMSk7XG5cbiAgcmV0dXJuIHtcbiAgICBjZWxsV2lkdGg6IGNlbGxXaWR0aCxcbiAgICBjZWxsSGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6aGVpZ2h0XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZhY2V0KGdyb3VwLCBlbmNvZGluZywgY2VsbEhlaWdodCwgY2VsbFdpZHRoLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpIHtcbiAgICB2YXIgZW50ZXIgPSBncm91cC5wcm9wZXJ0aWVzLmVudGVyO1xuICAgIHZhciBmYWNldEtleXMgPSBbXSwgY2VsbEF4ZXMgPSBbXTtcblxuICAgIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgICB2YXIgeEF4aXNNYXJnaW4gPSBlbmNvZGluZy5oYXMoWSkgPyBlbmNvZGluZy5jb25maWcoXCJ4QXhpc01hcmdpblwiKSA6IHVuZGVmaW5lZDtcblxuICAgIGVudGVyLmZpbGwgPSB7dmFsdWU6IGVuY29kaW5nLmNvbmZpZyhcImNlbGxCYWNrZ3JvdW5kQ29sb3JcIil9O1xuXG4gICAgLy9tb3ZlIFwiZnJvbVwiIHRvIGNlbGwgbGV2ZWwgYW5kIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgICBncm91cC5mcm9tID0ge2RhdGE6IGdyb3VwLm1hcmtzWzBdLmZyb20uZGF0YX07XG5cbiAgICBpZiAoZ3JvdXAubWFya3NbMF0uZnJvbS50cmFuc2Zvcm0pIHtcbiAgICAgIGRlbGV0ZSBncm91cC5tYXJrc1swXS5mcm9tLmRhdGE7IC8vbmVlZCB0byBrZWVwIHRyYW5zZm9ybSBmb3Igc3ViZmFjZXR0aW5nIGNhc2VcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGdyb3VwLm1hcmtzWzBdLmZyb207XG4gICAgfVxuICAgIGlmIChoYXNSb3cpIHtcbiAgICAgIGlmICghZW5jb2RpbmcuaXNUeXBlKFJPVywgTykpIHtcbiAgICAgICAgdXRpbC5lcnJvcihcIlJvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC5cIik7XG4gICAgICB9XG4gICAgICBlbnRlci55ID0ge3NjYWxlOiBST1csIGZpZWxkOiBcImtleXMuXCIgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICAgIGVudGVyLmhlaWdodCA9IHtcInZhbHVlXCI6IGNlbGxIZWlnaHR9OyAvLyBIQUNLXG5cbiAgICAgIGZhY2V0S2V5cy5wdXNoKGVuY29kaW5nLmZpZWxkKFJPVykpO1xuXG4gICAgICB2YXIgZnJvbTtcbiAgICAgIGlmIChoYXNDb2wpIHtcbiAgICAgICAgZnJvbSA9IHV0aWwuZHVwbGljYXRlKGdyb3VwLmZyb20pO1xuICAgICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgICBmcm9tLnRyYW5zZm9ybS51bnNoaWZ0KHt0eXBlOiBcImZhY2V0XCIsIGtleXM6IFtlbmNvZGluZy5maWVsZChDT0wpXX0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXhlc0dycCA9IGdyb3VwZGVmKFwieC1heGVzXCIsIHtcbiAgICAgICAgICBheGVzOiBlbmNvZGluZy5oYXMoWCkgPyAgYXhpcy5kZWZzKFtcInhcIl0sIGVuY29kaW5nKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IENPTCwgZmllbGQ6IFwia2V5cy4wXCIsIG9mZnNldDogeEF4aXNNYXJnaW59IDoge3ZhbHVlOiB4QXhpc01hcmdpbn0sXG4gICAgICAgICAgd2lkdGg6IGhhc0NvbCAmJiB7XCJ2YWx1ZVwiOiBjZWxsV2lkdGh9LCAvL0hBQ0s/XG4gICAgICAgICAgZnJvbTogZnJvbVxuICAgICAgICB9KTtcblxuICAgICAgc3BlYy5tYXJrcy5wdXNoKGF4ZXNHcnApO1xuICAgICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSk7XG4gICAgICBzcGVjLmF4ZXMucHVzaC5hcHBseShzcGVjLmF4ZXMsIGF4aXMuZGVmcyhbXCJyb3dcIl0sIGVuY29kaW5nKSk7XG4gICAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIHJvd1xuICAgICAgaWYoZW5jb2RpbmcuaGFzKFgpKXtcbiAgICAgICAgLy9rZWVwIHggYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgICBjZWxsQXhlcy5wdXNoLmFwcGx5KGNlbGxBeGVzLCBheGlzLmRlZnMoW1wieFwiXSwgZW5jb2RpbmcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzQ29sKSB7XG4gICAgICBpZiAoIWVuY29kaW5nLmlzVHlwZShDT0wsIE8pKSB7XG4gICAgICAgIHV0aWwuZXJyb3IoXCJDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuXCIpO1xuICAgICAgfVxuICAgICAgZW50ZXIueCA9IHtzY2FsZTogQ09MLCBmaWVsZDogXCJrZXlzLlwiICsgZmFjZXRLZXlzLmxlbmd0aH07XG4gICAgICBlbnRlci53aWR0aCA9IHtcInZhbHVlXCI6IGNlbGxXaWR0aH07IC8vIEhBQ0tcblxuICAgICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGQoQ09MKSk7XG5cbiAgICAgIHZhciBmcm9tO1xuICAgICAgaWYgKGhhc1Jvdykge1xuICAgICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICAgIGZyb20udHJhbnNmb3JtID0gZnJvbS50cmFuc2Zvcm0gfHwgW107XG4gICAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6IFwiZmFjZXRcIiwga2V5czogW2VuY29kaW5nLmZpZWxkKFJPVyldfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBheGVzR3JwID0gZ3JvdXBkZWYoXCJ5LWF4ZXNcIiwge1xuICAgICAgICBheGVzOiBlbmNvZGluZy5oYXMoWSkgPyBheGlzLmRlZnMoW1wieVwiXSwgZW5jb2RpbmcpIDogdW5kZWZpbmVkLFxuICAgICAgICB5OiBoYXNSb3cgJiYge3NjYWxlOiBST1csIGZpZWxkOiBcImtleXMuMFwifSxcbiAgICAgICAgeDogaGFzUm93ICYmIHt2YWx1ZTogeEF4aXNNYXJnaW59LFxuICAgICAgICBoZWlnaHQ6IGhhc1JvdyAmJiB7XCJ2YWx1ZVwiOiBjZWxsSGVpZ2h0fSwgLy9IQUNLP1xuICAgICAgICBmcm9tOiBmcm9tXG4gICAgICB9KTtcblxuICAgICAgc3BlYy5tYXJrcy5wdXNoKGF4ZXNHcnApO1xuICAgICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSlcbiAgICAgIHNwZWMuYXhlcy5wdXNoLmFwcGx5KHNwZWMuYXhlcywgYXhpcy5kZWZzKFtcImNvbFwiXSwgZW5jb2RpbmcsIHtcbiAgICAgICAgeEF4aXNNYXJnaW46IHhBeGlzTWFyZ2luXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIGNvbFxuICAgICAgaWYoZW5jb2RpbmcuaGFzKFkpKXtcbiAgICAgICAgY2VsbEF4ZXMucHVzaC5hcHBseShjZWxsQXhlcywgYXhpcy5kZWZzKFtcInlcIl0sIGVuY29kaW5nKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaGFzUm93KXtcbiAgICAgIGlmKGVudGVyLngpIGVudGVyLngub2Zmc2V0PSB4QXhpc01hcmdpbjtcbiAgICAgIGVsc2UgZW50ZXIueCA9IHt2YWx1ZTogeEF4aXNNYXJnaW59O1xuICAgIH1cbiAgICBpZihoYXNDb2wpe1xuICAgICAgLy9UT0RPIGZpbGwgaGVyZS4uXG4gICAgfVxuXG4gICAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgICAvLyBUT0RPOiBzdXBwb3J0IGhldGVyb2dlbm91cyBjZWxsV2lkdGggKG1heWJlIGJ5IHVzaW5nIG11bHRpcGxlIHNjYWxlcz8pXG4gICAgc3BlYy5zY2FsZXMgPSAoc3BlYy5zY2FsZXMgfHxbXSkuY29uY2F0KHNjYWxlLmRlZnMoXG4gICAgICBzY2FsZS5uYW1lcyhlbnRlcikuY29uY2F0KHNjYWxlLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpKSxcbiAgICAgIGVuY29kaW5nLFxuICAgICAge2NlbGxXaWR0aDogY2VsbFdpZHRoLCBjZWxsSGVpZ2h0OiBjZWxsSGVpZ2h0LCBzdGFjazogc3RhY2ssIGZhY2V0OnRydWUsIHN0YXRzOiBzdGF0c31cbiAgICApKTsgLy8gcm93L2NvbCBzY2FsZXMgKyBjZWxsIHNjYWxlc1xuXG4gICAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgICB9XG5cbiAgICAvLyBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gICAgdmFyIHRyYW5zID0gKGdyb3VwLmZyb20udHJhbnNmb3JtIHx8IChncm91cC5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gICAgdHJhbnMudW5zaGlmdCh7dHlwZTogXCJmYWNldFwiLCBrZXlzOiBmYWNldEtleXN9KTtcblxuICByZXR1cm4gc3BlYztcbiAgfVxuXG5mdW5jdGlvbiBzdWJmYWNldChncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKSB7XG4gIHZhciBtID0gZ3JvdXAubWFya3MsXG4gICAgZyA9IGdyb3VwZGVmKFwic3ViZmFjZXRcIiwge21hcmtzOiBtfSk7XG5cbiAgZ3JvdXAubWFya3MgPSBbZ107XG4gIGcuZnJvbSA9IG1kZWYuZnJvbTtcbiAgZGVsZXRlIG1kZWYuZnJvbTtcblxuICAvL1RPRE8gdGVzdCBMT0QgLS0gd2Ugc2hvdWxkIHN1cHBvcnQgc3RhY2sgLyBsaW5lIHdpdGhvdXQgY29sb3IgKExPRCkgZmllbGRcbiAgdmFyIHRyYW5zID0gKGcuZnJvbS50cmFuc2Zvcm0gfHwgKGcuZnJvbS50cmFuc2Zvcm0gPSBbXSkpO1xuICB0cmFucy51bnNoaWZ0KHt0eXBlOiBcImZhY2V0XCIsIGtleXM6IGRldGFpbHN9KTtcblxuICBpZiAoc3RhY2sgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHRyYW5zLnVuc2hpZnQoe3R5cGU6IFwic29ydFwiLCBieTogZW5jb2RpbmcuZmllbGQoQ09MT1IpfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGltZUZuKGZuKXtcbiAgc3dpdGNoKGZuKXtcbiAgICBjYXNlIFwic2Vjb25kXCI6IHJldHVybiBcImdldFVUQ1NlY29uZHNcIjtcbiAgICBjYXNlIFwibWludXRlXCI6IHJldHVybiBcImdldFVUQ01pbnV0ZXNcIjtcbiAgICBjYXNlIFwiaG91clwiOiByZXR1cm4gXCJnZXRVVENIb3Vyc1wiO1xuICAgIGNhc2UgXCJkYXlcIjogcmV0dXJuIFwiZ2V0VVRDRGF5XCI7XG4gICAgY2FzZSBcImRhdGVcIjogcmV0dXJuIFwiZ2V0VVRDRGF0ZVwiO1xuICAgIGNhc2UgXCJtb250aFwiOiByZXR1cm4gXCJnZXRVVENNb250aFwiO1xuICAgIGNhc2UgXCJ5ZWFyXCI6IHJldHVybiBcImdldFVUQ0Z1bGxZZWFyXCI7XG4gIH1cbiAgY29uc29sZS5lcnJvcihcIm5vIGZ1bmN0aW9uIHNwZWNpZmllZCBmb3IgZGF0ZVwiKTtcbn1cblxuZnVuY3Rpb24gdGltZVRyYW5zZm9ybShzcGVjLCBlbmNvZGluZywgZW5jVHlwZSwgZmllbGQpe1xuICB2YXIgZnVuYyA9IGdldFRpbWVGbihmaWVsZC5mbik7XG5cbiAgc3BlYy50cmFuc2Zvcm0gPSBzcGVjLnRyYW5zZm9ybSB8fCBbXTtcbiAgc3BlYy50cmFuc2Zvcm0ucHVzaCh7XG4gICAgdHlwZTogXCJmb3JtdWxhXCIsXG4gICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpLFxuICAgIGV4cHI6IFwibmV3IERhdGUoZC5kYXRhLlwiK2ZpZWxkLm5hbWUrXCIpLlwiK2Z1bmMrXCIoKVwiXG4gIH0pO1xuICByZXR1cm4gc3BlYztcbn1cblxuZnVuY3Rpb24gYmlubmluZyhzcGVjLCBlbmNvZGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgdmFyIGJpbnMgPSB7fTtcbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbih2diwgZCkge1xuICAgIGlmIChkLmJpbikgYmluc1tkLm5hbWVdID0gZC5uYW1lO1xuICB9KTtcbiAgYmlucyA9IHV0aWwua2V5cyhiaW5zKTtcblxuICBpZiAoYmlucy5sZW5ndGggPT09IDAgfHwgb3B0LnByZWFnZ3JlZ2F0ZWREYXRhKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKCFzcGVjLnRyYW5zZm9ybSkgc3BlYy50cmFuc2Zvcm0gPSBbXTtcbiAgYmlucy5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICBzcGVjLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6IFwiYmluXCIsXG4gICAgICBmaWVsZDogXCJkYXRhLlwiICsgZCxcbiAgICAgIG91dHB1dDogXCJkYXRhLmJpbl9cIiArIGQsXG4gICAgICBtYXhiaW5zOiBNQVhfQklOU1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGJpbnM7XG59XG5cbmZ1bmN0aW9uIGFnZ3JlZ2F0ZXMoc3BlYywgZW5jb2RpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG4gIHZhciBkaW1zID0ge30sIG1lYXMgPSB7fSwgZGV0YWlsID0ge30sIGZhY2V0cz17fTtcbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihlbmNUeXBlLCBmaWVsZCkge1xuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBpZihmaWVsZC5hZ2dyPT09XCJjb3VudFwiKXtcbiAgICAgICAgbWVhc1tcImNvdW50XCJdID0ge29wOlwiY291bnRcIiwgZmllbGQ6XCIqXCJ9O1xuICAgICAgfWVsc2V7XG4gICAgICAgIG1lYXNbZmllbGQuYWdncitcInxcIitmaWVsZC5uYW1lXSA9IHtcbiAgICAgICAgICBvcDpmaWVsZC5hZ2dyLFxuICAgICAgICAgIGZpZWxkOlwiZGF0YS5cIitmaWVsZC5uYW1lXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpbXNbZmllbGQubmFtZV0gPSBlbmNvZGluZy5maWVsZChlbmNUeXBlKTtcbiAgICAgIGlmIChlbmNUeXBlPT1ST1cgfHwgZW5jVHlwZSA9PSBDT0wpe1xuICAgICAgICBmYWNldHNbZmllbGQubmFtZV0gPSBkaW1zW2ZpZWxkLm5hbWVdO1xuICAgICAgfWVsc2UgaWYgKGVuY1R5cGUgIT09IFggJiYgZW5jVHlwZSAhPT0gWSkge1xuICAgICAgICBkZXRhaWxbZmllbGQubmFtZV0gPSBkaW1zW2ZpZWxkLm5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGRpbXMgPSB1dGlsLnZhbHMoZGltcyk7XG4gIG1lYXMgPSB1dGlsLnZhbHMobWVhcyk7XG5cbiAgaWYgKG1lYXMubGVuZ3RoID4gMCAmJiAhb3B0LnByZWFnZ3JlZ2F0ZWREYXRhKSB7XG4gICAgaWYgKCFzcGVjLnRyYW5zZm9ybSkgc3BlYy50cmFuc2Zvcm0gPSBbXTtcbiAgICBzcGVjLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6IFwiYWdncmVnYXRlXCIsXG4gICAgICBncm91cGJ5OiBkaW1zLFxuICAgICAgZmllbGRzOiBtZWFzXG4gICAgfSk7XG5cbiAgICBpZiAoZW5jb2RpbmcubWFya3R5cGUoKSA9PT0gVEVYVCkge1xuICAgICAgbWVhcy5mb3JFYWNoKCBmdW5jdGlvbiAobSkge1xuICAgICAgICB2YXIgZmllbGROYW1lID0gbS5maWVsZC5zdWJzdHIoNSksIC8vcmVtb3ZlIFwiZGF0YS5cIlxuICAgICAgICAgIGZpZWxkID0gXCJkYXRhLlwiICsgKG0ub3AgPyBtLm9wICsgXCJfXCIgOiBcIlwiKSArIGZpZWxkTmFtZTtcbiAgICAgICAgc3BlYy50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgICAgdHlwZTogXCJmb3JtdWxhXCIsXG4gICAgICAgICAgZmllbGQ6IGZpZWxkLFxuICAgICAgICAgIGV4cHI6IFwiZDMuZm9ybWF0KCcuMmYnKShkLlwiK2ZpZWxkK1wiKVwiXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgZGV0YWlsczogdXRpbC52YWxzKGRldGFpbCksXG4gICAgZGltczogZGltcyxcbiAgICBmYWNldHM6IHV0aWwudmFscyhmYWNldHMpLFxuICAgIGFnZ3JlZ2F0ZWQ6IG1lYXMubGVuZ3RoID4gMFxuICB9XG59XG5cbmZ1bmN0aW9uIHN0YWNraW5nKHNwZWMsIGVuY29kaW5nLCBtZGVmLCBmYWNldHMpIHtcbiAgaWYgKCFtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5zdGFjaykgcmV0dXJuIGZhbHNlO1xuICBpZiAoIWVuY29kaW5nLmhhcyhDT0xPUikpIHJldHVybiBmYWxzZTtcblxuICB2YXIgZGltID0gWCwgdmFsID0gWSwgaWR4ID0gMTtcbiAgaWYgKGVuY29kaW5nLmlzVHlwZShYLFF8VCkgJiYgIWVuY29kaW5nLmlzVHlwZShZLFF8VCkgJiYgZW5jb2RpbmcuaGFzKFkpKSB7XG4gICAgZGltID0gWTtcbiAgICB2YWwgPSBYO1xuICAgIGlkeCA9IDA7XG4gIH1cblxuICAvLyBhZGQgdHJhbnNmb3JtIHRvIGNvbXB1dGUgc3VtcyBmb3Igc2NhbGVcbiAgdmFyIHN0YWNrZWQgPSB7XG4gICAgbmFtZTogU1RBQ0tFRCxcbiAgICBzb3VyY2U6IFRBQkxFLFxuICAgIHRyYW5zZm9ybTogW3tcbiAgICAgIHR5cGU6IFwiYWdncmVnYXRlXCIsXG4gICAgICBncm91cGJ5OiBbZW5jb2RpbmcuZmllbGQoZGltKV0uY29uY2F0KGZhY2V0cyksIC8vIGRpbSBhbmQgb3RoZXIgZmFjZXRzXG4gICAgICBmaWVsZHM6IFt7b3A6IFwic3VtXCIsIGZpZWxkOiBlbmNvZGluZy5maWVsZCh2YWwpfV0gLy8gVE9ETyBjaGVjayBpZiBmaWVsZCB3aXRoIGFnZ3IgaXMgY29ycmVjdD9cbiAgICB9XVxuICB9O1xuXG4gIGlmKGZhY2V0cyAmJiBmYWNldHMubGVuZ3RoID4gMCl7XG4gICAgc3RhY2tlZC50cmFuc2Zvcm0ucHVzaCh7IC8vY2FsY3VsYXRlIG1heCBmb3IgZWFjaCBmYWNldFxuICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgIGdyb3VwYnk6IGZhY2V0cyxcbiAgICAgIGZpZWxkczogW3tvcDogXCJtYXhcIiwgZmllbGQ6IFwiZGF0YS5zdW1fXCIgKyBlbmNvZGluZy5maWVsZCh2YWwsIHRydWUpfV1cbiAgICB9KTtcbiAgfVxuXG4gIHNwZWMuZGF0YS5wdXNoKHN0YWNrZWQpO1xuXG4gIC8vIGFkZCBzdGFjayB0cmFuc2Zvcm0gdG8gbWFya1xuICBtZGVmLmZyb20udHJhbnNmb3JtID0gW3tcbiAgICB0eXBlOiBcInN0YWNrXCIsXG4gICAgcG9pbnQ6IGVuY29kaW5nLmZpZWxkKGRpbSksXG4gICAgaGVpZ2h0OiBlbmNvZGluZy5maWVsZCh2YWwpLFxuICAgIG91dHB1dDoge3kxOiB2YWwsIHkwOiB2YWwrXCIyXCJ9XG4gIH1dO1xuXG4gIC8vIFRPRE86IFRoaXMgaXMgc3VwZXIgaGFjay1pc2ggLS0gY29uc29saWRhdGUgaW50byBtb2R1bGFyIG1hcmsgcHJvcGVydGllcz9cbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWxdID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbF0gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbH07XG4gIG1kZWYucHJvcGVydGllcy51cGRhdGVbdmFsK1wiMlwiXSA9IG1kZWYucHJvcGVydGllcy5lbnRlclt2YWwrXCIyXCJdID0ge3NjYWxlOiB2YWwsIGZpZWxkOiB2YWwrXCIyXCJ9O1xuXG4gIHJldHVybiB2YWw7IC8vcmV0dXJuIHN0YWNrIGVuY29kaW5nXG59XG5cblxuZnVuY3Rpb24gbWFya2RlZihtYXJrLCBlbmNvZGluZywgb3B0KSB7XG4gIHZhciBwID0gbWFyay5wcm9wKGVuY29kaW5nLCBvcHQpXG4gIHJldHVybiB7XG4gICAgdHlwZTogbWFyay50eXBlLFxuICAgIGZyb206IHtkYXRhOiBUQUJMRX0sXG4gICAgcHJvcGVydGllczoge2VudGVyOiBwLCB1cGRhdGU6IHB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdyb3VwZGVmKG5hbWUsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG4gIHJldHVybiB7XG4gICAgX25hbWU6IG5hbWUgfHwgdW5kZWZpbmVkLFxuICAgIHR5cGU6IFwiZ3JvdXBcIixcbiAgICBmcm9tOiBvcHQuZnJvbSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBlbnRlcjoge1xuICAgICAgICB4OiBvcHQueCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHk6IG9wdC55IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IG9wdC53aWR0aCB8fCB7Z3JvdXA6IFwid2lkdGhcIn0sXG4gICAgICAgIGhlaWdodDogb3B0LmhlaWdodCB8fCB7Z3JvdXA6IFwiaGVpZ2h0XCJ9XG4gICAgICB9XG4gICAgfSxcbiAgICBzY2FsZXM6IG9wdC5zY2FsZXMgfHwgdW5kZWZpbmVkLFxuICAgIGF4ZXM6IG9wdC5heGVzIHx8IHVuZGVmaW5lZCxcbiAgICBtYXJrczogb3B0Lm1hcmtzIHx8IFtdXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGVuY29kaW5nLCBzaXplLCBzdGF0cykgeyAvL2hhY2sgdXNlIHN0YXRzXG5cbiAgdmFyIGRhdGEgPSB7bmFtZTpUQUJMRSwgZm9ybWF0OiB7dHlwZTogZW5jb2RpbmcuY29uZmlnKFwiZGF0YUZvcm1hdFR5cGVcIil9fSxcbiAgICBkYXRhVXJsID0gdmwuZGF0YS5nZXRVcmwoZW5jb2RpbmcsIHN0YXRzKTtcbiAgaWYoZGF0YVVybCkgZGF0YS51cmwgPSBkYXRhVXJsO1xuXG4gIHZhciBwcmVhZ2dyZWdhdGVkRGF0YSA9IGVuY29kaW5nLmNvbmZpZyhcInVzZVZlZ2FTZXJ2ZXJcIik7XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihlbmNUeXBlLCBmaWVsZCl7XG4gICAgaWYoZmllbGQudHlwZSA9PSBUKXtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlID0gZGF0YS5mb3JtYXQucGFyc2UgfHwge307XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZVtmaWVsZC5uYW1lXSA9IFwiZGF0ZVwiO1xuICAgIH1lbHNlIGlmKGZpZWxkLnR5cGUgPT0gUSl7XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZSA9IGRhdGEuZm9ybWF0LnBhcnNlIHx8IHt9O1xuICAgICAgaWYgKGZpZWxkLmFnZ3IgPT09IFwiY291bnRcIikge1xuICAgICAgICB2YXIgbmFtZSA9IFwiY291bnRcIjtcbiAgICAgIH0gZWxzZSBpZihwcmVhZ2dyZWdhdGVkRGF0YSAmJiBmaWVsZC5iaW4pe1xuICAgICAgICB2YXIgbmFtZSA9IFwiYmluX1wiICsgZmllbGQubmFtZTtcbiAgICAgIH0gZWxzZSBpZihwcmVhZ2dyZWdhdGVkRGF0YSAmJiBmaWVsZC5hZ2dyKXtcbiAgICAgICAgdmFyIG5hbWUgPSBmaWVsZC5hZ2dyICsgXCJfXCIgKyBmaWVsZC5uYW1lO1xuICAgICAgfSBlbHNle1xuICAgICAgICB2YXIgbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgICB9XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZVtuYW1lXSA9IFwibnVtYmVyXCI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiBzaXplLndpZHRoLFxuICAgIGhlaWdodDogc2l6ZS5oZWlnaHQsXG4gICAgcGFkZGluZzogXCJhdXRvXCIsXG4gICAgZGF0YTogW2RhdGFdLFxuICAgIG1hcmtzOiBbZ3JvdXBkZWYoXCJjZWxsXCIsIHtcbiAgICAgIHdpZHRoOiBzaXplLmNlbGxXaWR0aCA/IHt2YWx1ZTogc2l6ZS5jZWxsV2lkdGh9OiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6IHNpemUuY2VsbEhlaWdodCA/IHt2YWx1ZTogc2l6ZS5jZWxsSGVpZ2h0fSA6IHVuZGVmaW5lZFxuICAgIH0pXVxuICB9O1xufVxuIiwidmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmNvbnN0cy5lbmNvZGluZ1R5cGVzID0gW1gsIFksIFJPVywgQ09MLCBTSVpFLCBTSEFQRSwgQ09MT1IsIEFMUEhBLCBURVhUXTtcblxuY29uc3RzLmRhdGFUeXBlcyA9IHtcIk9cIjogTywgXCJRXCI6IFEsIFwiVFwiOiBUfTtcblxuY29uc3RzLmRhdGFUeXBlTmFtZXMgPSBbXCJPXCIsXCJRXCIsXCJUXCJdLnJlZHVjZShmdW5jdGlvbihyLHgpIHtcbiAgcltjb25zdHMuZGF0YVR5cGVzW3hdXSA9IHg7IHJldHVybiByO1xufSx7fSk7XG5cbmNvbnN0cy5ERUZBVUxUUyA9IHtcbiAgLy8gdGVtcGxhdGVcbiAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gIHZpZXdwb3J0OiB1bmRlZmluZWQsXG4gIF9taW5XaWR0aDogMjAsXG4gIF9taW5IZWlnaHQ6IDIwLFxuXG4gIC8vIGRhdGEgc291cmNlXG4gIGRhdGFVcmw6IHVuZGVmaW5lZCwgLy9mb3IgZWFzaWVyIGV4cG9ydFxuICB1c2VWZWdhU2VydmVyOiBmYWxzZSxcbiAgdmVnYVNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIixcbiAgdmVnYVNlcnZlclRhYmxlOiB1bmRlZmluZWQsXG4gIGRhdGFGb3JtYXRUeXBlOiBcImpzb25cIixcblxuICAvL3NtYWxsIG11bHRpcGxlc1xuICBjZWxsSGVpZ2h0OiAyMDAsIC8vIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgYmFuZFdpZHRoXG4gIGNlbGxXaWR0aDogMjAwLCAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aFxuICBjZWxsUGFkZGluZzogMC4xLFxuICBjZWxsQmFja2dyb3VuZENvbG9yOiBcIiNmZGZkZmRcIixcbiAgeEF4aXNNYXJnaW46IDgwLFxuICB5QXhpc01hcmdpbjogMCxcbiAgdGV4dENlbGxXaWR0aDogOTAsXG5cbiAgLy8gbWFya3NcbiAgYmFuZFNpemU6IDIxLFxuICBiYW5kUGFkZGluZzogMSxcbiAgcG9pbnRTaXplOiA1MCxcbiAgcG9pbnRTaGFwZTogXCJjaXJjbGVcIixcbiAgc3Ryb2tlV2lkdGg6IDIsXG4gIGNvbG9yOiBcInN0ZWVsYmx1ZVwiLFxuICB0ZXh0Q29sb3I6IFwiYmxhY2tcIixcbiAgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgdGV4dEJhc2VsaW5lOiBcIm1pZGRsZVwiLFxuICB0ZXh0TWFyZ2luOiA0LFxuICBmb250OiBcIkhlbHZldGljYSBOZXVlXCIsXG4gIGZvbnRTaXplOiBcIjEyXCIsXG4gIGZvbnRXZWlnaHQ6IFwibm9ybWFsXCIsXG4gIGZvbnRTdHlsZTogXCJub3JtYWxcIixcbiAgb3BhY2l0eTogMSxcbiAgX3RoaWNrT3BhY2l0eTogMC41LFxuICBfdGhpbk9wYWNpdHk6IDAuMixcblxuICAvLyBzY2FsZXNcbiAgLy8gVE9ETyByZW1vdmUgX3haZXJvLCAuLi5cbiAgX3haZXJvOiB0cnVlLFxuICBfeFJldmVyc2U6IGZhbHNlLFxuICBfeVplcm86IHRydWUsXG4gIF95UmV2ZXJzZTogZmFsc2UsXG4gIHRpbWVTY2FsZU5pY2U6IFwiZGF5XCJcbn07IiwiLy8gVE9ETyByZW5hbWUgZ2V0RGF0YVVybCB0byB2bC5kYXRhLmdldFVybCgpID9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIGRhdGEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5kYXRhLmdldFVybCA9IGZ1bmN0aW9uIGdldERhdGFVcmwoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIGlmICghZW5jb2RpbmcuY29uZmlnKFwidXNlVmVnYVNlcnZlclwiKSkge1xuICAgIC8vIGRvbid0IHVzZSB2ZWdhIHNlcnZlclxuICAgIHJldHVybiBlbmNvZGluZy5jb25maWcoXCJkYXRhVXJsXCIpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmxlbmd0aCgpID09PSAwKSB7XG4gICAgLy8gbm8gZmllbGRzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGZpZWxkcyA9IFtdXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZW5jVHlwZSwgZmllbGQpe1xuICAgIHZhciBvYmogPSB7XG4gICAgICBuYW1lOiBlbmNvZGluZy5maWVsZChlbmNUeXBlLCB0cnVlKSxcbiAgICAgIGZpZWxkOiBmaWVsZC5uYW1lXG4gICAgfVxuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBvYmouYWdnciA9IGZpZWxkLmFnZ3JcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJpbikge1xuICAgICAgb2JqLmJpblNpemUgPSB1dGlsLmdldGJpbnMoc3RhdHNbZmllbGQubmFtZV0pLnN0ZXA7XG4gICAgfVxuICAgIGZpZWxkcy5wdXNoKG9iaik7XG4gIH0pO1xuXG4gIHZhciBxdWVyeSA9IHtcbiAgICB0YWJsZTogZW5jb2RpbmcuY29uZmlnKFwidmVnYVNlcnZlclRhYmxlXCIpLFxuICAgIGZpZWxkczogZmllbGRzXG4gIH1cblxuICByZXR1cm4gZW5jb2RpbmcuY29uZmlnKFwidmVnYVNlcnZlclVybFwiKSArIFwiL3F1ZXJ5Lz9xPVwiICsgSlNPTi5zdHJpbmdpZnkocXVlcnkpXG59O1xuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBkYXRhIGluIEpTT04vamF2YXNjcmlwdCBvYmplY3QgZm9ybWF0XG4gKiBAcmV0dXJuIEFycmF5IG9mIHtuYW1lOiBfX25hbWVfXywgdHlwZTogXCJudW1iZXJ8dGV4dHx0aW1lfGxvY2F0aW9uXCJ9XG4gKi9cbmRhdGEuZ2V0U2NoZW1hID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBzY2hlbWEgPSBbXSxcbiAgICBmaWVsZHMgPSB1dGlsLmtleXMoZGF0YVswXSk7XG5cbiAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgLy8gZmluZCBub24tbnVsbCBkYXRhXG4gICAgdmFyIGk9MCwgZGF0dW0gPSBkYXRhW2ldW2tdO1xuICAgIHdoaWxlKGRhdHVtID09PSBcIlwiIHx8IGRhdHVtID09PSBudWxsIHx8IGRhdHVtID09PSB1bmRlZmluZWQpe1xuICAgICAgZGF0dW0gPSBkYXRhWysraV1ba107XG4gICAgfVxuXG4gICAgLy9UT0RPKGthbml0dyk6IGJldHRlciB0eXBlIGluZmVyZW5jZSBoZXJlXG4gICAgdmFyIHR5cGUgPSAodHlwZW9mIGRhdHVtID09PSBcIm51bWJlclwiKSA/IFwibnVtYmVyXCIgOlxuICAgICAgaXNOYU4oRGF0ZS5wYXJzZShkYXR1bSkpID8gXCJ0ZXh0XCIgOiBcInRpbWVcIjtcblxuICAgIHNjaGVtYS5wdXNoKHtuYW1lOiBrLCB0eXBlOiB0eXBlfSk7XG4gIH0pO1xuXG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5kYXRhLmdldFN0YXRzID0gZnVuY3Rpb24oZGF0YSl7IC8vIGhhY2tcbiAgdmFyIHN0YXRzID0ge30sXG4gICAgZmllbGRzID0gdXRpbC5rZXlzKGRhdGFbMF0pO1xuXG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICB2YXIgc3RhdCA9IHV0aWwubWlubWF4KGRhdGEsIGspO1xuICAgIHN0YXQuY2FyZGluYWxpdHkgPSB1dGlsLnVuaXEoZGF0YSwgayk7XG4gICAgc3RhdC5jb3VudCA9IGRhdGEubGVuZ3RoO1xuICAgIHN0YXRzW2tdID0gc3RhdDtcbiAgfSk7XG4gIHJldHVybiBzdGF0cztcbn07XG4iLCIvLyBkZWNsYXJlIGdsb2JhbCBjb25zdGFudFxudmFyIGcgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5nLlRBQkxFID0gXCJ0YWJsZVwiO1xuZy5TVEFDS0VEID0gXCJzdGFja2VkXCI7XG5nLklOREVYID0gXCJpbmRleFwiO1xuXG5nLlggPSBcInhcIjtcbmcuWSA9IFwieVwiO1xuZy5ST1cgPSBcInJvd1wiO1xuZy5DT0wgPSBcImNvbFwiO1xuZy5TSVpFID0gXCJzaXplXCI7XG5nLlNIQVBFID0gXCJzaGFwZVwiO1xuZy5DT0xPUiA9IFwiY29sb3JcIjtcbmcuQUxQSEEgPSBcImFscGhhXCI7XG5nLlRFWFQgPSBcInRleHRcIjtcblxuZy5PID0gMTtcbmcuUSA9IDI7XG5nLlQgPSA0O1xuXG4vL1RPRE8gcmVmYWN0b3IgdGhpcyB0byBiZSBjb25maWc/XG5nLk1BWF9CSU5TID0gMjA7IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgbGVnZW5kcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmxlZ2VuZHMuZGVmcyA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBsZWdlbmRzID0gW107XG5cbiAgLy8gVE9ETzogc3VwcG9ydCBhbHBoYVxuXG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmxlZ2VuZChDT0xPUikpIHtcbiAgICBsZWdlbmRzLnB1c2goe1xuICAgICAgZmlsbDogQ09MT1IsXG4gICAgICB0aXRsZTogZW5jb2RpbmcuZmllbGRUaXRsZShDT0xPUiksXG4gICAgICBvcmllbnQ6IFwicmlnaHRcIlxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSVpFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0laRSkpIHtcbiAgICBsZWdlbmRzLnB1c2goe1xuICAgICAgc2l6ZTogU0laRSxcbiAgICAgIHRpdGxlOiBlbmNvZGluZy5maWVsZFRpdGxlKFNJWkUpLFxuICAgICAgb3JpZW50OiBsZWdlbmRzLmxlbmd0aCA9PT0gMSA/IFwibGVmdFwiIDogXCJyaWdodFwiXG4gICAgfSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNIQVBFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0hBUEUpKSB7XG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBUT0RPOiBmaXggdGhpc1xuICAgICAgY29uc29sZS5lcnJvcihcIlZlZ2FsaXRlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIHR3byBsZWdlbmRzXCIpO1xuICAgICAgcmV0dXJuIGxlZ2VuZHM7XG4gICAgfVxuICAgIGxlZ2VuZHMucHVzaCh7XG4gICAgICBzaGFwZTogU0hBUEUsXG4gICAgICB0aXRsZTogZW5jb2RpbmcuZmllbGRUaXRsZShTSEFQRSksXG4gICAgICBvcmllbnQ6IGxlZ2VuZHMubGVuZ3RoID09PSAxID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCJcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsZWdlbmRzO1xufSIsInZhciBnbG9iYWxzID0gcmVxdWlyZShcIi4vZ2xvYmFsc1wiKSxcbiAgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbnZhciBtYXJrcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbm1hcmtzLmJhciA9IHtcbiAgdHlwZTogXCJyZWN0XCIsXG4gIHN0YWNrOiB0cnVlLFxuICBwcm9wOiBiYXJfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFtcInhcIiwgXCJ5XCJdLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzoxLCBjb2w6MSwgeDoxLCB5OjEsIHNpemU6MSwgY29sb3I6MSwgYWxwaGE6MX1cbn07XG5cbm1hcmtzLmxpbmUgPSB7XG4gIHR5cGU6IFwibGluZVwiLFxuICBsaW5lOiB0cnVlLFxuICBwcm9wOiBsaW5lX3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbXCJ4XCIsIFwieVwiXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6MSwgY29sOjEsIHg6MSwgeToxLCBjb2xvcjoxLCBhbHBoYToxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogXCJhcmVhXCIsXG4gIHN0YWNrOiB0cnVlLFxuICBsaW5lOiB0cnVlLFxuICByZXF1aXJlZEVuY29kaW5nOiBbXCJ4XCIsIFwieVwiXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmxpbmUuc3VwcG9ydGVkRW5jb2Rpbmdcbn07XG5cbm1hcmtzLmNpcmNsZSA9IHtcbiAgdHlwZTogXCJzeW1ib2xcIixcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKFwiY2lyY2xlXCIpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzoxLCBjb2w6MSwgeDoxLCB5OjEsIHNpemU6MSwgY29sb3I6MSwgYWxwaGE6MX1cbn07XG5cbm1hcmtzLnNxdWFyZSA9IHtcbiAgdHlwZTogXCJzeW1ib2xcIixcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKFwic3F1YXJlXCIpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzogbWFya3MuY2lyY2xlLnN1cHBvcnRlZEVuY29kaW5nXG59O1xuXG5tYXJrcy5wb2ludCA9IHtcbiAgdHlwZTogXCJzeW1ib2xcIixcbiAgcHJvcDogcG9pbnRfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OjEsIGNvbDoxLCB4OjEsIHk6MSwgc2l6ZToxLCBjb2xvcjoxLCBhbHBoYToxLCBzaGFwZToxfVxufTtcblxubWFya3MudGV4dCA9IHtcbiAgdHlwZTogXCJ0ZXh0XCIsXG4gIHByb3A6IHRleHRfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFtcInRleHRcIl0sXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OjEsIGNvbDoxLCBzaXplOjEsIGNvbG9yOjEsIGFscGhhOjEsIHRleHQ6MX1cbn07XG5cbmZ1bmN0aW9uIGJhcl9wcm9wcyhlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc1R5cGUoWCxRfFQpICYmICFlLmJpbihYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmhhcyhZKSAmJiAoIWUuaXNUeXBlKFksUXxUKSB8fCBlLmJpbihZKSkpIHtcbiAgICAgIHAueDIgPSB7c2NhbGU6IFgsIHZhbHVlOiAwfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnhjID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54YyA9IHt2YWx1ZTogMH07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmlzVHlwZShZLFF8VCkgJiYgIWUuYmluKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gICAgcC55MiA9IHtzY2FsZTogWSwgdmFsdWU6IDB9O1xuICB9IGVsc2UgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIHAueWMgPSB7Z3JvdXA6IFwiaGVpZ2h0XCJ9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmlzVHlwZShYLFF8VCkpIHtcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAud2lkdGggPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcC53aWR0aCA9IHtzY2FsZTogWCwgYmFuZDogdHJ1ZSwgb2Zmc2V0OiAtMX07XG4gICAgICBwLndpZHRoID0ge3ZhbHVlOiArZS5jb25maWcoXCJiYW5kU2l6ZVwiKSwgb2Zmc2V0OiAtMX07XG4gICAgfVxuICB9IGVsc2UgaWYgKCFlLmlzVHlwZShZLE8pICYmICFlLmJpbihZKSkge1xuICAgIHAud2lkdGggPSB7dmFsdWU6ICtlLmNvbmZpZyhcImJhbmRTaXplXCIpLCBvZmZzZXQ6IC0xfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaXNUeXBlKFksUXxUKSkge1xuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC5oZWlnaHQgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcC5oZWlnaHQgPSB7c2NhbGU6IFksIGJhbmQ6IHRydWUsIG9mZnNldDogLTF9O1xuICAgICAgcC5oZWlnaHQgPSB7dmFsdWU6ICtlLmNvbmZpZyhcImJhbmRTaXplXCIpLCBvZmZzZXQ6IC0xfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaXNUeXBlKFgsTykgJiYgIWUuYmluKFgpKSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6ICtlLmNvbmZpZyhcImJhbmRTaXplXCIpLCBvZmZzZXQ6IC0xfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS5jb25maWcoXCJjb2xvclwiKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBwb2ludF9wcm9wcyhlLCBvcHQpIHtcbiAgdmFyIHAgPSB7fTtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiBlLmNvbmZpZyhcImJhbmRTaXplXCIpLzJ9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuY29uZmlnKFwiYmFuZFNpemVcIikvMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS5jb25maWcoXCJwb2ludFNpemVcIil9O1xuICB9XG5cbiAgLy8gc2hhcGVcbiAgaWYgKGUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7c2NhbGU6IFNIQVBFLCBmaWVsZDogZS5maWVsZChTSEFQRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBlLmNvbmZpZyhcInBvaW50U2hhcGVcIil9O1xuICB9XG5cbiAgLy8gc3Ryb2tlXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLmNvbmZpZyhcImNvbG9yXCIpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9ZWxzZXtcbiAgICBwLm9wYWNpdHkgPSB7XG4gICAgICB2YWx1ZTogZS5jb25maWcoXCJvcGFjaXR5XCIpIHx8IGUuY29uZmlnKG9wdC5oYXNBZ2dyZWdhdGUgPyBcIl90aGlja09wYWNpdHlcIiA6IFwiX3RoaW5PcGFjaXR5XCIpXG4gICAgfTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKFwic3Ryb2tlV2lkdGhcIil9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBsaW5lX3Byb3BzKGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogMH07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHtncm91cDogXCJoZWlnaHRcIn07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUuY29uZmlnKFwiY29sb3JcIil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH1cblxuICBwLnN0cm9rZVdpZHRoID0ge3ZhbHVlOiBlLmNvbmZpZyhcInN0cm9rZVdpZHRoXCIpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXJlYV9wcm9wcyhlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc1R5cGUoWCxRfFQpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gICAgaWYgKCFlLmlzVHlwZShZLFF8VCkgJiYgZS5oYXMoWSkpIHtcbiAgICAgIHAueDIgPSB7c2NhbGU6IFgsIHZhbHVlOiAwfTtcbiAgICAgIHAub3JpZW50ID0ge3ZhbHVlOiBcImhvcml6b250YWxcIn07XG4gICAgfVxuICB9IGVsc2UgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaXNUeXBlKFksUXxUKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICAgIHAueTIgPSB7c2NhbGU6IFksIHZhbHVlOiAwfTtcbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIHAueSA9IHtncm91cDogXCJoZWlnaHRcIn07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS5jb25maWcoXCJjb2xvclwiKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBmaWxsZWRfcG9pbnRfcHJvcHMoc2hhcGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUsIG9wdCkge1xuICAgIHZhciBwID0ge307XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5jb25maWcoXCJiYW5kU2l6ZVwiKS8yfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKGUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3ZhbHVlOiBlLmNvbmZpZyhcImJhbmRTaXplXCIpLzJ9O1xuICAgIH1cblxuICAgIC8vIHNpemVcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgICBwLnNpemUgPSB7dmFsdWU6IGUuY29uZmlnKFwicG9pbnRTaXplXCIpfTtcbiAgICB9XG5cbiAgICAvLyBzaGFwZVxuICAgIHAuc2hhcGUgPSB7dmFsdWU6IHNoYXBlfTtcblxuICAgIC8vIGZpbGxcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLmNvbmZpZyhcImNvbG9yXCIpfTtcbiAgICB9XG5cbiAgICAvLyBhbHBoYVxuICAgIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gICAgfWVsc2Uge1xuICAgICAgcC5vcGFjaXR5ID0ge1xuICAgICAgICB2YWx1ZTogZS5jb25maWcoXCJvcGFjaXR5XCIpIHx8IGUuY29uZmlnKG9wdC5oYXNBZ2dyZWdhdGUgPyBcIl90aGlja09wYWNpdHlcIiA6IFwiX3RoaW5PcGFjaXR5XCIpXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogZS5jb25maWcoXCJiYW5kU2l6ZVwiKS8yfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmNvbmZpZyhcImJhbmRTaXplXCIpLzJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC5mb250U2l6ZSA9IHt2YWx1ZTogZS5jb25maWcoXCJmb250U2l6ZVwiKX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUuY29uZmlnKFwidGV4dENvbG9yXCIpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9XG5cbiAgLy8gdGV4dFxuICBpZiAoZS5oYXMoVEVYVCkpIHtcbiAgICBwLnRleHQgPSB7ZmllbGQ6IGUuZmllbGQoVEVYVCl9O1xuICB9IGVsc2Uge1xuICAgIHAudGV4dCA9IHt2YWx1ZTogXCJBYmNcIn07XG4gIH1cblxuICBwLmZvbnQgPSB7dmFsdWU6IGUuY29uZmlnKFwiZm9udFwiKX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZS5jb25maWcoXCJmb250V2VpZ2h0XCIpfTtcbiAgcC5mb250U3R5bGUgPSB7dmFsdWU6IGUuY29uZmlnKFwiZm9udFN0eWxlXCIpfTtcbiAgcC5iYXNlbGluZSA9IHt2YWx1ZTogZS5jb25maWcoXCJ0ZXh0QmFzZWxpbmVcIil9O1xuXG4gIC8vIGFsaWduXG4gIGlmIChlLmhhcyhYKSkge1xuICAgIGlmIChlLmlzVHlwZShYLE8pKSB7XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiBcImxlZnRcIn07XG4gICAgICBwLmR4ID0ge3ZhbHVlOiBlLmNvbmZpZyhcInRleHRNYXJnaW5cIil9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiBcImNlbnRlclwifVxuICAgIH1cbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkge1xuICAgIHAuYWxpZ24gPSB7dmFsdWU6IFwibGVmdFwifTtcbiAgICBwLmR4ID0ge3ZhbHVlOiBlLmNvbmZpZyhcInRleHRNYXJnaW5cIil9O1xuICB9IGVsc2Uge1xuICAgIHAuYWxpZ24gPSB7dmFsdWU6IGUuY29uZmlnKFwidGV4dEFsaWduXCIpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufSIsInZhciBnbG9iYWxzID0gcmVxdWlyZShcIi4vZ2xvYmFsc1wiKSxcbiAgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbnZhciBzY2FsZSA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnNjYWxlLm5hbWVzID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufVxuXG5zY2FsZS5kZWZzID0gZnVuY3Rpb24gKG5hbWVzLCBlbmNvZGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICB2YXIgcyA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB0eXBlOiBzY2FsZV90eXBlKG5hbWUsIGVuY29kaW5nKSxcbiAgICAgIGRvbWFpbjogc2NhbGVfZG9tYWluKG5hbWUsIGVuY29kaW5nLCBvcHQpXG4gICAgfTtcbiAgICBpZiAocy50eXBlID09PSBcIm9yZGluYWxcIiAmJiAhZW5jb2RpbmcuYmluKG5hbWUpKSB7XG4gICAgICBzLnNvcnQgPSB0cnVlO1xuICAgIH1cblxuICAgIHNjYWxlX3JhbmdlKHMsIGVuY29kaW5nLCBvcHQpO1xuXG4gICAgcmV0dXJuIChhLnB1c2gocyksIGEpO1xuICB9LCBbXSk7XG59XG5cbmZ1bmN0aW9uIHNjYWxlX3R5cGUobmFtZSwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChlbmNvZGluZy50eXBlKG5hbWUpKSB7XG4gICAgY2FzZSBPOiByZXR1cm4gXCJvcmRpbmFsXCI7XG4gICAgY2FzZSBUOlxuICAgICAgaWYgKGVuY29kaW5nLmZuKG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBcImxpbmVhclwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidGltZVwiO1xuICAgIGNhc2UgUTpcbiAgICAgIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIFwib3JkaW5hbFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVuY29kaW5nLnNjYWxlKG5hbWUpLnR5cGUgfHwgXCJsaW5lYXJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiBzY2FsZV9kb21haW4obmFtZSwgZW5jb2RpbmcsIG9wdCkge1xuICBpZiAoZW5jb2RpbmcudHlwZShuYW1lKSA9PT0gVCl7XG4gICAgc3dpdGNoKGVuY29kaW5nLmZuKG5hbWUpKXtcbiAgICAgIGNhc2UgXCJzZWNvbmRcIjpcbiAgICAgIGNhc2UgXCJtaW51dGVcIjogcmV0dXJuIFswLCA1OV07XG4gICAgICBjYXNlIFwiaG91clwiOiByZXR1cm4gWzAsIDIzXTtcbiAgICAgIGNhc2UgXCJkYXlcIjogcmV0dXJuIFswLCA2XTtcbiAgICAgIGNhc2UgXCJkYXRlXCI6IHJldHVybiBbMSwgMzFdO1xuICAgICAgY2FzZSBcIm1vbnRoXCI6IHJldHVybiBbMCwgMTFdO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAvLyBUT0RPOiBhZGQgaW5jbHVkZUVtcHR5Q29uZmlnIGhlcmVcbiAgICBpZiAob3B0LnN0YXRzKSB7XG4gICAgICB2YXIgYmlucyA9IHV0aWwuZ2V0YmlucyhvcHQuc3RhdHNbZW5jb2RpbmcuZmllbGROYW1lKG5hbWUpXSk7XG4gICAgICB2YXIgZG9tYWluID0gdXRpbC5yYW5nZShiaW5zLnN0YXJ0LCBiaW5zLnN0b3AsIGJpbnMuc3RlcCk7XG4gICAgICByZXR1cm4gbmFtZT09PVkgPyBkb21haW4ucmV2ZXJzZSgpIDogZG9tYWluO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lID09IG9wdC5zdGFjayA/XG4gICAge1xuICAgICAgZGF0YTogU1RBQ0tFRCxcbiAgICAgIGZpZWxkOiBcImRhdGEuXCIgKyAob3B0LmZhY2V0ID8gXCJtYXhfXCIgOlwiXCIpICsgXCJzdW1fXCIgKyBlbmNvZGluZy5maWVsZChuYW1lLCB0cnVlKVxuICAgIH06XG4gICAge2RhdGE6IFRBQkxFLCBmaWVsZDogZW5jb2RpbmcuZmllbGQobmFtZSl9O1xufVxuXG5mdW5jdGlvbiBzY2FsZV9yYW5nZShzLCBlbmNvZGluZywgb3B0KSB7XG4gIHZhciBzcGVjID0gZW5jb2Rpbmcuc2NhbGUocy5uYW1lKTtcbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFg6XG4gICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSwgTykgfHwgZW5jb2RpbmcuYmluKHMubmFtZSkpIHtcbiAgICAgICAgcy5iYW5kV2lkdGggPSArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gb3B0LmNlbGxXaWR0aCA/IFswLCBvcHQuY2VsbFdpZHRoXSA6IFwid2lkdGhcIjtcbiAgICAgICAgLy9UT0RPIHplcm8gYW5kIHJldmVyc2Ugc2hvdWxkIGJlY29tZSBnZW5lcmljLCBhbmQgd2UganVzdCByZWFkIGRlZmF1bHQgZnJvbSBlaXRoZXIgdGhlIHNjaGVtYSBvciB0aGUgc2NoZW1hIGdlbmVyYXRvclxuICAgICAgICBzLnplcm8gPSBzcGVjLnplcm8gfHwgZW5jb2RpbmcuY29uZmlnKFwiX3haZXJvXCIpO1xuICAgICAgICBzLnJldmVyc2UgPSBzcGVjLnJldmVyc2UgfHwgZW5jb2RpbmcuY29uZmlnKFwiX3hSZXZlcnNlXCIpO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSwgVCkpe1xuICAgICAgICBzLm5pY2UgPSBlbmNvZGluZy5hZ2dyKHMubmFtZSkgfHwgZW5jb2RpbmcuY29uZmlnKFwidGltZVNjYWxlTmljZVwiKTtcbiAgICAgIH1lbHNle1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsIE8pIHx8IGVuY29kaW5nLmJpbihzLm5hbWUpKSB7XG4gICAgICAgIHMuYmFuZFdpZHRoID0gK2VuY29kaW5nLmNvbmZpZyhcImJhbmRTaXplXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IG9wdC5jZWxsSGVpZ2h0ID8gW29wdC5jZWxsSGVpZ2h0LCAwXSA6IFwiaGVpZ2h0XCI7XG4gICAgICAgIC8vVE9ETyB6ZXJvIGFuZCByZXZlcnNlIHNob3VsZCBiZWNvbWUgZ2VuZXJpYywgYW5kIHdlIGp1c3QgcmVhZCBkZWZhdWx0IGZyb20gZWl0aGVyIHRoZSBzY2hlbWEgb3IgdGhlIHNjaGVtYSBnZW5lcmF0b3JcbiAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvIHx8IGVuY29kaW5nLmNvbmZpZyhcIl95WmVyb1wiKTtcbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlIHx8IGVuY29kaW5nLmNvbmZpZyhcIl95UmV2ZXJzZVwiKTtcbiAgICAgIH1cblxuICAgICAgcy5yb3VuZCA9IHRydWU7XG5cbiAgICAgIGlmIChlbmNvZGluZy5pc1R5cGUocy5uYW1lLCBUKSl7XG4gICAgICAgIHMubmljZSA9IGVuY29kaW5nLmFnZ3Iocy5uYW1lKTtcbiAgICAgIH1lbHNle1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBST1c6XG4gICAgICBzLmJhbmRXaWR0aCA9IG9wdC5jZWxsSGVpZ2h0IHx8IGVuY29kaW5nLmNvbmZpZyhcImNlbGxIZWlnaHRcIik7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTDpcbiAgICAgIHMuYmFuZFdpZHRoID0gb3B0LmNlbGxXaWR0aCB8fCBlbmNvZGluZy5jb25maWcoXCJjZWxsV2lkdGhcIik7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNJWkU6XG4gICAgICBpZiAoZW5jb2RpbmcuaXMoXCJiYXJcIikpIHtcbiAgICAgICAgcy5yYW5nZSA9IFszLCArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIildO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy5pcyhURVhUKSkge1xuICAgICAgICBzLnJhbmdlID0gWzgsIDQwXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMucmFuZ2UgPSBbMTAsIDEwMDBdO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICBzLnJhbmdlID0gXCJzaGFwZXNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MT1I6XG4gICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSwgTykpIHtcbiAgICAgICAgcy5yYW5nZSA9IFwiY2F0ZWdvcnkxMFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IFtcIiNkZGZcIiwgXCJzdGVlbGJsdWVcIl07XG4gICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBTFBIQTpcbiAgICAgIHMucmFuZ2UgPSBbMC4yLCAxLjBdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gZW5jb2RpbmcgbmFtZTogXCIrcy5uYW1lKTtcbiAgfVxuXG4gIHN3aXRjaChzLm5hbWUpe1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MOlxuICAgICAgcy5wYWRkaW5nID0gZW5jb2RpbmcuY29uZmlnKFwiY2VsbFBhZGRpbmdcIik7XG4gICAgICBzLm91dGVyUGFkZGluZyA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsIE8pIHx8IGVuY29kaW5nLmJpbihzLm5hbWUpICkgeyAvLyYmICFzLmJhbmRXaWR0aFxuICAgICAgICBzLnBvaW50cyA9IHRydWU7XG4gICAgICAgIHMucGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZyhcImJhbmRQYWRkaW5nXCIpO1xuICAgICAgfVxuICB9XG59IiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhbGl0ZSBTcGVjaWZpY2F0aW9uJ3MganNvbiBzY2hlbWFcbi8vXG52YXIgc2NoZW1hID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5zY2hlbWEudXRpbCA9IHJlcXVpcmUoJy4vc2NoZW1hdXRpbCcpO1xuXG5zY2hlbWEubWFya3R5cGUgPSB7XG4gIHR5cGU6IFwic3RyaW5nXCIsXG4gIGVudW06IFtcInBvaW50XCIsIFwiYmFyXCIsIFwibGluZVwiLCBcImFyZWFcIiwgXCJjaXJjbGVcIiwgXCJzcXVhcmVcIiwgXCJ0ZXh0XCJdXG59O1xuXG5zY2hlbWEuYWdnciA9IHtcbiAgdHlwZTogXCJzdHJpbmdcIixcbiAgZW51bTogW1wiYXZnXCIsIFwic3VtXCIsIFwibWluXCIsIFwibWF4XCIsIFwiY291bnRcIl0sXG4gIHN1cHBvcnRlZEVudW1zOiB7XG4gICAgUTogW1wiYXZnXCIsIFwic3VtXCIsIFwibWluXCIsIFwibWF4XCIsIFwiY291bnRcIl0sXG4gICAgTzogW1wiY291bnRcIl0sXG4gICAgVDogW1wiYXZnXCIsIFwibWluXCIsIFwibWF4XCIsIFwiY291bnRcIl0sXG4gICAgXCJcIjogW1wiY291bnRcIl0sXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB7XCJRXCI6IHRydWUsIFwiT1wiOiB0cnVlLCBcIlRcIjogdHJ1ZSwgXCJcIjogdHJ1ZX1cbn07XG5cbnNjaGVtYS50aW1lZm5zID0gW1wibW9udGhcIiwgXCJ5ZWFyXCIsIFwiZGF5XCIsIFwiZGF0ZVwiLCBcImhvdXJcIiwgXCJtaW51dGVcIiwgXCJzZWNvbmRcIl07XG5cbnNjaGVtYS5mbiA9IHtcbiAgdHlwZTogXCJzdHJpbmdcIixcbiAgZW51bTogc2NoZW1hLnRpbWVmbnMsXG4gIHN1cHBvcnRlZFR5cGVzOiB7XCJUXCI6IHRydWV9XG59XG5cbi8vVE9ETyhrYW5pdHcpOiBhZGQgb3RoZXIgdHlwZSBvZiBmdW5jdGlvbiBoZXJlXG5cbnNjaGVtYS5zY2FsZV90eXBlID0ge1xuICB0eXBlOiBcInN0cmluZ1wiLFxuICBlbnVtOiBbXCJsaW5lYXJcIiwgXCJsb2dcIixcInBvd1wiLCBcInNxcnRcIiwgXCJxdWFudGlsZVwiXSxcbiAgZGVmYXVsdDogXCJsaW5lYXJcIixcbiAgc3VwcG9ydGVkVHlwZXM6IHtcIlFcIjogdHJ1ZX1cbn07XG5cbnNjaGVtYS5maWVsZCA9IHtcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcmVxdWlyZWQ6IFtcIm5hbWVcIiwgXCJ0eXBlXCJdLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIH1cbiAgfVxufTtcblxudmFyIGNsb25lID0gdXRpbC5kdXBsaWNhdGU7XG52YXIgbWVyZ2UgPSBzY2hlbWEudXRpbC5tZXJnZTtcblxudmFyIHR5cGljYWxGaWVsZCA9IG1lcmdlKGNsb25lKHNjaGVtYS5maWVsZCksIHtcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBlbnVtOiBbXCJPXCIsIFwiUVwiLCBcIlRcIl1cbiAgICB9LFxuICAgIGJpbjoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBzdXBwb3J0ZWRUeXBlczoge1wiUVwiOiB0cnVlLCBcIk9cIjogdHJ1ZX1cbiAgICB9LFxuICAgIGFnZ3I6IHNjaGVtYS5hZ2dyLFxuICAgIGZuOiBzY2hlbWEuZm4sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGU6IHNjaGVtYS5zY2FsZV90eXBlLFxuICAgICAgICByZXZlcnNlOiB7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0OiBmYWxzZSB9LFxuICAgICAgICB6ZXJvOiB7XG4gICAgICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiSW5jbHVkZSB6ZXJvXCIsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIlFcIjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgbmljZToge1xuICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgZW51bTogW1wic2Vjb25kXCIsIFwibWludXRlXCIsIFwiaG91clwiLCBcImRheVwiLCBcIndlZWtcIiwgXCJtb250aFwiLCBcInllYXJcIl0sXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIlRcIjogdHJ1ZX1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBvbmx5T3JkaW5hbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiBcIm9iamVjdFwiLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGVudW06IFtcIk9cIl1cbiAgICB9LFxuICAgIGJpbjoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBzdXBwb3J0ZWRUeXBlczoge1wiT1wiOiB0cnVlfVxuICAgIH0sXG4gICAgYWdncjoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGVudW06IFtcImNvdW50XCJdLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIk9cIjogdHJ1ZX1cbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgYXhpc01peGluID0ge1xuICB0eXBlOiBcIm9iamVjdFwiLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYXhpczoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3JpZDogeyB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdDogZmFsc2UgfSxcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG52YXIgbGVnZW5kTWl4aW4gPSB7XG4gIHR5cGU6IFwib2JqZWN0XCIsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfVxuICB9XG59XG5cbnZhciB0ZXh0TWl4aW4gPSB7XG4gIHR5cGU6IFwib2JqZWN0XCIsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0ZXh0OiB7XG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgIGVudW06IFtcIm5vcm1hbFwiLCBcImJvbGRcIl0sXG4gICAgICAgICAgZGVmYXVsdDogXCJub3JtYWxcIixcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczoge1wiVFwiOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCIsXG4gICAgICAgICAgZGVmYXVsdDogMTAsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczoge1wiVFwiOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICBmb250OiB7XG4gICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICBkZWZhdWx0OiBcIkhhbHZldGljYSBOZXVlXCIsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIlRcIjogdHJ1ZX1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG52YXIgeCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIGF4aXNNaXhpbik7XG52YXIgeSA9IGNsb25lKHgpO1xuXG52YXIgcm93ID0gY2xvbmUob25seU9yZGluYWxGaWVsZCk7XG52YXIgY29sID0gY2xvbmUocm93KTtcblxudmFyIHNpemUgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCBsZWdlbmRNaXhpbik7XG52YXIgY29sb3IgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCBsZWdlbmRNaXhpbik7XG52YXIgYWxwaGEgPSBjbG9uZSh0eXBpY2FsRmllbGQpO1xudmFyIHNoYXBlID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGxlZ2VuZE1peGluKTtcblxudmFyIHRleHQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB0ZXh0TWl4aW4pO1xuXG52YXIgY2ZnID0ge1xuICB0eXBlOiBcIm9iamVjdFwiLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZGF0YUZvcm1hdFR5cGU6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBlbnVtOiBbXCJqc29uXCIsIFwiY3N2XCJdXG4gICAgfSxcbiAgICB1c2VWZWdhU2VydmVyOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBkYXRhVXJsOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgfSxcbiAgICB2ZWdhU2VydmVyVGFibGU6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICB9LFxuICAgIHZlZ2FTZXJ2ZXJVcmw6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiXG4gICAgfVxuICB9XG59XG5cbi8qKiBAdHlwZSBPYmplY3QgU2NoZW1hIG9mIGEgdmVnYWxpdGUgc3BlY2lmaWNhdGlvbiAqL1xuc2NoZW1hLnNjaGVtYSA9IHtcbiAgJHNjaGVtYTogXCJodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSNcIixcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcmVxdWlyZWQ6IFtcIm1hcmt0eXBlXCIsIFwiZW5jXCIsIFwiY2ZnXCJdLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbWFya3R5cGU6IHNjaGVtYS5tYXJrdHlwZSxcbiAgICBlbmM6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2w6IGNvbCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgdGV4dDogdGV4dFxuICAgICAgfVxuICAgIH0sXG4gICAgY2ZnOiBjZmdcbiAgfVxufTtcblxuLyoqIEluc3RhbnRpYXRlIGEgdmVyYm9zZSB2bCBzcGVjIGZyb20gdGhlIHNjaGVtYSAqL1xuc2NoZW1hLmluc3RhbnRpYXRlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHNjaGVtYS51dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5zY2hlbWEpO1xufVxuIiwidmFyIHV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDBcbn1cblxuLy8gaW5zdGFudGlhdGUgYSBzY2hlbWFcbnV0aWwuaW5zdGFudGlhdGUgPSBmdW5jdGlvbihzY2hlbWEsIHJlcXVpcmVkKSB7XG4gIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzY2hlbWEucmVxdWlyZWQgPSBzY2hlbWEucmVxdWlyZWQgPyBzY2hlbWEucmVxdWlyZWQgOiBbXTtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICB2YXIgY2hpbGQgPSBzY2hlbWEucHJvcGVydGllc1tuYW1lXTtcbiAgICAgIGluc3RhbmNlW25hbWVdID0gdXRpbC5pbnN0YW50aWF0ZShjaGlsZCwgc2NoZW1hLnJlcXVpcmVkLmluZGV4T2YobmFtZSkgIT0gLTEpO1xuICAgIH07XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICByZXR1cm4gc2NoZW1hLmRlZmF1bHQ7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLmVudW0gJiYgcmVxdWlyZWQpIHtcbiAgICByZXR1cm4gc2NoZW1hLmVudW1bMF07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8vIHJlbW92ZSBhbGwgZGVmYXVsdHMgZnJvbSBhbiBpbnN0YW5jZVxudXRpbC5kaWZmZXJlbmNlID0gZnVuY3Rpb24oZGVmYXVsdHMsIGluc3RhbmNlKSB7XG4gIHZhciBjaGFuZ2VzID0ge307XG4gIGZvciAodmFyIHByb3AgaW4gaW5zdGFuY2UpIHtcbiAgICBpZiAoIWRlZmF1bHRzIHx8IGRlZmF1bHRzW3Byb3BdICE9PSBpbnN0YW5jZVtwcm9wXSkge1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZVtwcm9wXSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHZhciBjID0gdXRpbC5kaWZmZXJlbmNlKGRlZmF1bHRzW3Byb3BdLCBpbnN0YW5jZVtwcm9wXSk7XG4gICAgICAgIGlmICghaXNFbXB0eShjKSlcbiAgICAgICAgICBjaGFuZ2VzW3Byb3BdID0gYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnN0YW5jZVtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG4vLyByZWN1cnNpdmVseSBtZXJnZXMgaW5zdGFuY2UgaW50byBkZWZhdWx0c1xudXRpbC5tZXJnZSA9IGZ1bmN0aW9uIChkZWZhdWx0cywgaW5zdGFuY2UpIHtcbiAgaWYgKHR5cGVvZiBpbnN0YW5jZSE9PSdvYmplY3QnIHx8IGluc3RhbmNlPT09bnVsbCkge1xuICAgIHJldHVybiBkZWZhdWx0cztcbiAgfVxuXG4gIGZvciAodmFyIHAgaW4gaW5zdGFuY2UpIHtcbiAgICBpZiAoIWluc3RhbmNlLmhhc093blByb3BlcnR5KHApKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKGluc3RhbmNlW3BdPT09dW5kZWZpbmVkIClcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgaW5zdGFuY2VbcF0gIT09ICdvYmplY3QnIHx8IGluc3RhbmNlW3BdID09PSBudWxsKSB7XG4gICAgICBkZWZhdWx0c1twXSA9IGluc3RhbmNlW3BdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmF1bHRzW3BdICE9PSAnb2JqZWN0JyB8fCBkZWZhdWx0c1twXSA9PT0gbnVsbCkge1xuICAgICAgZGVmYXVsdHNbcF0gPSB1dGlsLm1lcmdlKGluc3RhbmNlW3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSA/IFtdIDoge30sIGluc3RhbmNlW3BdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXRpbC5tZXJnZShkZWZhdWx0c1twXSwgaW5zdGFuY2VbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmYXVsdHM7XG59XG4iLCJ2YXIgdXRpbCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnV0aWwua2V5cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGsgPSBbXSwgeDtcbiAgZm9yICh4IGluIG9iaikgay5wdXNoKHgpO1xuICByZXR1cm4gaztcbn1cblxudXRpbC52YWxzID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgdiA9IFtdLCB4O1xuICBmb3IgKHggaW4gb2JqKSB2LnB1c2gob2JqW3hdKTtcbiAgcmV0dXJuIHY7XG59XG5cbnV0aWwucmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcihcImluZmluaXRlIHJhbmdlXCIpO1xuICB2YXIgcmFuZ2UgPSBbXSwgaSA9IC0xLCBqO1xuICBpZiAoc3RlcCA8IDApIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPiBzdG9wKSByYW5nZS5wdXNoKGopO1xuICBlbHNlIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPCBzdG9wKSByYW5nZS5wdXNoKGopO1xuICByZXR1cm4gcmFuZ2U7XG59XG5cbnV0aWwuZmluZCA9IGZ1bmN0aW9uIChsaXN0LCBwYXR0ZXJuKSB7XG4gIHZhciBsID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB4W3BhdHRlcm4ubmFtZV0gPT09IHBhdHRlcm4udmFsdWU7XG4gIH0pO1xuICByZXR1cm4gbC5sZW5ndGggJiYgbFswXSB8fCBudWxsO1xufVxuXG51dGlsLnVuaXEgPSBmdW5jdGlvbiAoZGF0YSwgZmllbGQpIHtcbiAgdmFyIG1hcCA9IHt9LCBjb3VudCA9IDAsIGksIGs7XG4gIGZvciAoaT0wOyBpPGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICBrID0gZGF0YVtpXVtmaWVsZF07XG4gICAgaWYgKCFtYXBba10pIHtcbiAgICAgIG1hcFtrXSA9IDE7XG4gICAgICBjb3VudCArPSAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY291bnQ7XG59XG5cbnV0aWwubWlubWF4ID0gZnVuY3Rpb24gKGRhdGEsIGZpZWxkKSB7XG4gIHZhciBzdGF0cyA9IHttaW46ICtJbmZpbml0eSwgbWF4OiAtSW5maW5pdHl9O1xuICBmb3IgKGk9MDsgaTxkYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHYgPSBkYXRhW2ldW2ZpZWxkXTtcbiAgICBpZiAodiA+IHN0YXRzLm1heCkgc3RhdHMubWF4ID0gdjtcbiAgICBpZiAodiA8IHN0YXRzLm1pbikgc3RhdHMubWluID0gdjtcbiAgfVxuICByZXR1cm4gc3RhdHM7XG59XG5cbnV0aWwuZHVwbGljYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cbnV0aWwuYW55ID0gZnVuY3Rpb24oYXJyLCBmKXtcbiAgdmFyIGk9MCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmKGYoYXJyW2tdLCBrLCBpKyspKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbnV0aWwuYWxsID0gZnVuY3Rpb24oYXJyLCBmKXtcbiAgdmFyIGk9MCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmKCFmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG51dGlsLm1lcmdlID0gZnVuY3Rpb24oZGVzdCwgc3JjKXtcbiAgcmV0dXJuIHV0aWwua2V5cyhzcmMpLnJlZHVjZShmdW5jdGlvbihjLCBrKXtcbiAgICBjW2tdID0gc3JjW2tdO1xuICAgIHJldHVybiBjO1xuICB9LCBkZXN0KTtcbn07XG5cbnV0aWwuZ2V0YmlucyA9IGZ1bmN0aW9uIChzdGF0cykge1xuICByZXR1cm4gdmcuYmlucyh7XG4gICAgbWluOiBzdGF0cy5taW4sXG4gICAgbWF4OiBzdGF0cy5tYXgsXG4gICAgbWF4YmluczogTUFYX0JJTlNcbiAgfSk7XG59XG5cblxudXRpbC5lcnJvciA9IGZ1bmN0aW9uKG1zZyl7XG4gIGNvbnNvbGUuZXJyb3IoXCJbVkwgRXJyb3JdXCIsIG1zZyk7XG59XG5cbiJdfQ==
