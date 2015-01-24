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
    // TODO: caching
    var encDefaults = schema.util.instantiate(schema.schema.properties.enc);
    var cfgDefaults = schema.util.instantiate(schema.schema.properties.cfg);

    // Hack
    for (var k in consts.DEFAULTS) {
      cfgDefaults[k] = consts.DEFAULTS[k];
    }

    // remove field defs that we don't use in encoding
    for (var k in encDefaults) {
      if (!enc[k]) {
        delete encDefaults[k];
      }
    }

    this._marktype = marktype;
    this._enc = schema.util.merge(encDefaults, enc);
    this._cfg = schema.util.merge(cfgDefaults, config);
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
    var type = (typeof datum === "number") ? "Q":
      isNaN(Date.parse(datum)) ? "O" : "T";

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
      default: false,
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
      default: false,
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
    // template
    width: {
      type: "integer",
      default: undefined
    },
    height: {
      type: "integer",
      default: undefined
    },
    viewport: {
      type: "array",
      items: {
        type: ["integer"]
      },
      default: undefined
    },
    _minWidth: {
      type: "integer",
      default: 20
    },
    _minHeight: {
      type: "integer",
      default: 20
    },

    // data source
    dataFormatType: {
      type: "string",
      enum: ["json", "csv"],
      default: "json"
    },
    useVegaServer: {
      type: "boolean",
      default: false
    },
    dataUrl: {
      type: "string",
      default: undefined
    },
    vegaServerTable: {
      type: "string",
      default: undefined
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmwiLCJzcmMvRW5jb2RpbmcuanMiLCJzcmMvYXhpcy5qcyIsInNyYy9jb21waWxlLmpzIiwic3JjL2NvbnN0cy5qcyIsInNyYy9kYXRhLmpzIiwic3JjL2dsb2JhbHMuanMiLCJzcmMvbGVnZW5kcy5qcyIsInNyYy9tYXJrcy5qcyIsInNyYy9zY2FsZS5qcyIsInNyYy9zY2hlbWEuanMiLCJzcmMvc2NoZW1hdXRpbC5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGdsb2JhbHMgPSByZXF1aXJlKFwiLi9nbG9iYWxzXCIpLFxuICAgIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpLFxuICAgIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyk7XG5cbnZhciB2bCA9IHV0aWwubWVyZ2UoY29uc3RzLCB1dGlsKTtcblxudmwuc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEnKTtcbnZsLkVuY29kaW5nID0gcmVxdWlyZSgnLi9FbmNvZGluZycpO1xudmwuYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpO1xudmwuY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZScpO1xudmwuZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmwubGVnZW5kcyA9IHJlcXVpcmUoJy4vbGVnZW5kcycpO1xudmwubWFya3MgPSByZXF1aXJlKCcuL21hcmtzJylcbnZsLnNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYScpO1xuXG52YXIgRW5jb2RpbmcgPSBtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBFbmNvZGluZyhtYXJrdHlwZSwgZW5jLCBjb25maWcpIHtcbiAgICAvLyBUT0RPOiBjYWNoaW5nXG4gICAgdmFyIGVuY0RlZmF1bHRzID0gc2NoZW1hLnV0aWwuaW5zdGFudGlhdGUoc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuYyk7XG4gICAgdmFyIGNmZ0RlZmF1bHRzID0gc2NoZW1hLnV0aWwuaW5zdGFudGlhdGUoc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmNmZyk7XG5cbiAgICAvLyBIYWNrXG4gICAgZm9yICh2YXIgayBpbiBjb25zdHMuREVGQVVMVFMpIHtcbiAgICAgIGNmZ0RlZmF1bHRzW2tdID0gY29uc3RzLkRFRkFVTFRTW2tdO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBmaWVsZCBkZWZzIHRoYXQgd2UgZG9uJ3QgdXNlIGluIGVuY29kaW5nXG4gICAgZm9yICh2YXIgayBpbiBlbmNEZWZhdWx0cykge1xuICAgICAgaWYgKCFlbmNba10pIHtcbiAgICAgICAgZGVsZXRlIGVuY0RlZmF1bHRzW2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21hcmt0eXBlID0gbWFya3R5cGU7XG4gICAgdGhpcy5fZW5jID0gc2NoZW1hLnV0aWwubWVyZ2UoZW5jRGVmYXVsdHMsIGVuYyk7XG4gICAgdGhpcy5fY2ZnID0gc2NoZW1hLnV0aWwubWVyZ2UoY2ZnRGVmYXVsdHMsIGNvbmZpZyk7XG4gIH1cblxuICB2YXIgcHJvdG8gPSBFbmNvZGluZy5wcm90b3R5cGU7XG5cbiAgcHJvdG8ubWFya3R5cGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGU7XG4gIH07XG5cbiAgcHJvdG8uaXMgPSBmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmt0eXBlID09PSBtO1xuICB9O1xuXG4gIHByb3RvLmhhcyA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdICE9PSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgcHJvdG8uZW5jID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XTtcbiAgfTtcblxuICAvLyBnZXQgXCJmaWVsZFwiIHByb3BlcnR5IGZvciB2ZWdhXG4gIHByb3RvLmZpZWxkID0gZnVuY3Rpb24oeCwgbm9kYXRhLCBub2ZuKSB7XG4gICAgaWYgKCF0aGlzLmhhcyh4KSkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgZiA9IChub2RhdGEgPyBcIlwiIDogXCJkYXRhLlwiKTtcblxuICAgIGlmICh0aGlzLl9lbmNbeF0uYWdnciA9PT0gXCJjb3VudFwiKSB7XG4gICAgICByZXR1cm4gZiArIFwiY291bnRcIjtcbiAgICB9IGVsc2UgaWYgKCFub2ZuICYmIHRoaXMuX2VuY1t4XS5iaW4pIHtcbiAgICAgIHJldHVybiBmICsgXCJiaW5fXCIgKyB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9IGVsc2UgaWYgKCFub2ZuICYmIHRoaXMuX2VuY1t4XS5hZ2dyKSB7XG4gICAgICByZXR1cm4gZiArIHRoaXMuX2VuY1t4XS5hZ2dyICsgXCJfXCIgKyB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9IGVsc2UgaWYgKCFub2ZuICYmIHRoaXMuX2VuY1t4XS5mbil7XG4gICAgICByZXR1cm4gZiArIHRoaXMuX2VuY1t4XS5mbiArIFwiX1wiICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvLmZpZWxkTmFtZSA9IGZ1bmN0aW9uKHgpe1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgfVxuXG4gIHByb3RvLmZpZWxkVGl0bGUgPSBmdW5jdGlvbih4KXtcbiAgICBpZiAodGhpcy5fZW5jW3hdLmFnZ3IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbmNbeF0uYWdnciArIFwiKFwiICsgdGhpcy5fZW5jW3hdLm5hbWUgKyBcIilcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5uYW1lO1xuICAgIH1cbiAgfVxuXG4gIHByb3RvLnNjYWxlID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5zY2FsZSB8fCB7fTtcbiAgfVxuXG4gIHByb3RvLmF4aXMgPSBmdW5jdGlvbih4KXtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLmF4aXMgfHwge307XG4gIH1cblxuICBwcm90by5hZ2dyID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5hZ2dyO1xuICB9XG5cbiAgcHJvdG8uYmluID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5iaW47XG4gIH1cblxuICBwcm90by5sZWdlbmQgPSBmdW5jdGlvbih4KXtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLmxlZ2VuZDtcbiAgfVxuXG4gIHByb3RvLmZuID0gZnVuY3Rpb24oeCl7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5mbjtcbiAgfVxuXG4gIHByb3RvLmFueSA9IGZ1bmN0aW9uKGYpe1xuICAgIHJldHVybiB1dGlsLmFueSh0aGlzLl9lbmMsIGYpO1xuICB9XG5cbiAgcHJvdG8uYWxsID0gZnVuY3Rpb24oZil7XG4gICAgcmV0dXJuIHV0aWwuYWxsKHRoaXMuX2VuYywgZik7XG4gIH1cblxuICBwcm90by5sZW5ndGggPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB1dGlsLmtleXModGhpcy5fZW5jKS5sZW5ndGg7XG4gIH1cblxuICBwcm90by5yZWR1Y2UgPSBmdW5jdGlvbihmLCBpbml0KXtcbiAgICB2YXIgciA9IGluaXQsIGk9MDtcbiAgICBmb3IgKGsgaW4gdGhpcy5fZW5jKXtcbiAgICAgIHIgPSBmKHIsIHRoaXMuX2VuY1trXSwgaywgdGhpcy5fZW5jKTtcbiAgICB9XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBwcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZikge1xuICAgIHZhciBpPTAsIGs7XG4gICAgZm9yIChrIGluIHRoaXMuX2VuYykge1xuICAgICAgZihrLCB0aGlzLl9lbmNba10sIGkrKyk7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvLnR5cGUgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKHgpID8gdGhpcy5fZW5jW3hdLnR5cGUgOiBudWxsO1xuICB9O1xuXG4gIHByb3RvLmlzVHlwZSA9IGZ1bmN0aW9uKHgsIHQpIHtcbiAgICB2YXIgeHQgPSB0aGlzLnR5cGUoeCk7XG4gICAgaWYgKHh0ID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gKHh0ICYgdCkgPiAwO1xuICB9O1xuXG4gIHByb3RvLmNvbmZpZyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2ZnW25hbWVdO1xuICB9O1xuXG4gIHByb3RvLnRvU3BlYyA9IGZ1bmN0aW9uKGV4Y2x1ZGVDb25maWcpe1xuICAgIHZhciBlbmMgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9lbmMpLFxuICAgICAgc3BlYztcblxuICAgIC8vIGNvbnZlcnQgdHlwZSdzIGJpdGNvZGUgdG8gdHlwZSBuYW1lXG4gICAgZm9yKHZhciBlIGluIGVuYyl7XG4gICAgICBlbmNbZV0udHlwZSA9IGNvbnN0cy5kYXRhVHlwZU5hbWVzW2VuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFya3R5cGU6IHRoaXMuX21hcmt0eXBlLFxuICAgICAgZW5jOiBlbmNcbiAgICB9XG5cbiAgICBpZighZXhjbHVkZUNvbmZpZyl7XG4gICAgICBzcGVjLmNmZyA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2NmZylcbiAgICB9XG5cbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICBwcm90by50b1Nob3J0aGFuZCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVuYyA9IHRoaXMuX2VuYztcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGUgKyBcIi5cIiArIHV0aWwua2V5cyhlbmMpLm1hcChmdW5jdGlvbihlKXtcbiAgICAgIHZhciB2ID0gZW5jW2VdO1xuICAgICAgICByZXR1cm4gZSArIFwiLVwiICtcbiAgICAgICAgICAodi5hZ2dyID8gdi5hZ2dyK1wiX1wiIDogXCJcIikgK1xuICAgICAgICAgICh2LmZuID8gdi5mbitcIl9cIiA6IFwiXCIpICtcbiAgICAgICAgICAodi5iaW4gPyBcImJpbl9cIiA6IFwiXCIpICtcbiAgICAgICAgICAodi5uYW1lIHx8IFwiXCIpICsgXCItXCIgK1xuICAgICAgICAgIGNvbnN0cy5kYXRhVHlwZU5hbWVzW3YudHlwZV07XG4gICAgICB9XG4gICAgKS5qb2luKFwiLlwiKTtcbiAgfVxuXG4gIEVuY29kaW5nLnBhcnNlU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kLCBjZmcpe1xuICAgIHZhciBlbmMgPSBzaG9ydGhhbmQuc3BsaXQoXCIuXCIpLFxuICAgICAgbWFya3R5cGUgPSBlbmMuc2hpZnQoKTtcblxuICAgIGVuYyA9IGVuYy5yZWR1Y2UoZnVuY3Rpb24obSwgZSl7XG4gICAgICB2YXIgc3BsaXQgPSBlLnNwbGl0KFwiLVwiKSxcbiAgICAgICAgZW5jdHlwZSA9IHNwbGl0WzBdLFxuICAgICAgICBvID0ge25hbWU6IHNwbGl0WzFdLCB0eXBlOiBjb25zdHMuZGF0YVR5cGVzW3NwbGl0WzJdXX07XG5cbiAgICAgIC8vIGNoZWNrIGFnZ3JlZ2F0ZSB0eXBlXG4gICAgICBmb3IodmFyIGkgaW4gc2NoZW1hLmFnZ3IuZW51bSl7XG4gICAgICAgIHZhciBhID0gc2NoZW1hLmFnZ3IuZW51bVtpXTtcbiAgICAgICAgaWYoby5uYW1lLmluZGV4T2YoYStcIl9cIikgPT0gMCl7XG4gICAgICAgICAgby5uYW1lID0gby5uYW1lLnN1YnN0cihhLmxlbmd0aCsxKTtcbiAgICAgICAgICBpZiAoYT09XCJjb3VudFwiICYmIG8ubmFtZS5sZW5ndGggPT09IDApIG8ubmFtZSA9IFwiKlwiO1xuICAgICAgICAgIG8uYWdnciA9IGE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIHRpbWUgZm5cbiAgICAgIGZvcih2YXIgaSBpbiBzY2hlbWEudGltZWZucyl7XG4gICAgICAgIHZhciBmID0gc2NoZW1hLnRpbWVmbnNbaV07XG4gICAgICAgIGlmKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZihmK1wiX1wiKSA9PSAwKXtcbiAgICAgICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKG8ubGVuZ3RoKzEpO1xuICAgICAgICAgIG8uZm4gPSBmO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIGJpblxuICAgICAgaWYoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKFwiYmluX1wiKSA9PSAwKXtcbiAgICAgICAgby5uYW1lID0gby5uYW1lLnN1YnN0cig0KTtcbiAgICAgICAgby5iaW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBtW2VuY3R5cGVdID0gbztcbiAgICAgIHJldHVybiBtO1xuICAgIH0sIHt9KTtcblxuICAgIHJldHVybiBuZXcgRW5jb2RpbmcobWFya3R5cGUsIGVuYywgY2ZnKTtcbiAgfVxuXG4gIEVuY29kaW5nLmZyb21TcGVjID0gZnVuY3Rpb24oc3BlYywgZXh0cmFDZmcpIHtcbiAgICB2YXIgZW5jID0gdXRpbC5kdXBsaWNhdGUoc3BlYy5lbmMpO1xuXG4gICAgLy9jb252ZXJ0IHR5cGUgZnJvbSBzdHJpbmcgdG8gYml0Y29kZSAoZS5nLCBPPTEpXG4gICAgZm9yKHZhciBlIGluIGVuYyl7XG4gICAgICBlbmNbZV0udHlwZSA9IGNvbnN0cy5kYXRhVHlwZXNbZW5jW2VdLnR5cGVdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRW5jb2Rpbmcoc3BlYy5tYXJrdHlwZSwgZW5jLCB1dGlsLm1lcmdlKHNwZWMuY2ZnLCBleHRyYUNmZyB8fCB7fSkpO1xuICB9XG5cbiAgcmV0dXJuIEVuY29kaW5nO1xuXG59KSgpO1xuIiwidmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgYXhpcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmF4aXMubmFtZXMgPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgcmV0dXJuIHV0aWwua2V5cyh1dGlsLmtleXMocHJvcHMpLnJlZHVjZShmdW5jdGlvbihhLCB4KSB7XG4gICAgdmFyIHMgPSBwcm9wc1t4XS5zY2FsZTtcbiAgICBpZiAocz09PVggfHwgcz09PVkpIGFbcHJvcHNbeF0uc2NhbGVdID0gMTtcbiAgICByZXR1cm4gYTtcbiAgfSwge30pKTtcbn1cblxuYXhpcy5kZWZzID0gZnVuY3Rpb24obmFtZXMsIGVuY29kaW5nLCBvcHQpIHtcbiAgcmV0dXJuIG5hbWVzLnJlZHVjZShmdW5jdGlvbihhLCBuYW1lKSB7XG4gICAgYS5wdXNoKGF4aXNfZGVmKG5hbWUsIGVuY29kaW5nLCBvcHQpKTtcbiAgICByZXR1cm4gYTtcbiAgfSwgW10pO1xufVxuXG5mdW5jdGlvbiBheGlzX2RlZihuYW1lLCBlbmNvZGluZywgb3B0KXtcbiAgdmFyIHR5cGUgPSBuYW1lLCBheGlzO1xuICB2YXIgaXNDb2wgPSBuYW1lPT1DT0wsIGlzUm93ID0gbmFtZT09Uk9XO1xuICBpZihpc0NvbCkgdHlwZSA9IFwieFwiO1xuICBpZihpc1JvdykgdHlwZSA9IFwieVwiO1xuXG4gIHZhciBheGlzID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG5hbWUsXG4gICAgdGlja3M6IDMgLy9UT0RPKGthbml0dyk6IGJldHRlciBkZXRlcm1pbmUgIyBvZiB0aWNrc1xuICB9O1xuXG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLmdyaWQpIHtcbiAgICBheGlzLmdyaWQgPSB0cnVlO1xuICAgIGF4aXMubGF5ZXIgPSBcImJhY2tcIjtcbiAgfVxuXG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLnRpdGxlKSB7XG4gICAgLy9zaG93IHRpdGxlIGJ5IGRlZmF1bHRcblxuICAgIGF4aXMgPSBheGlzX3RpdGxlKGF4aXMsIG5hbWUsIGVuY29kaW5nLCBvcHQpO1xuICB9XG5cbiAgaWYoaXNSb3cgfHwgaXNDb2wpe1xuICAgIGF4aXMucHJvcGVydGllcyA9IHtcbiAgICAgIHRpY2tzOiB7IG9wYWNpdHk6IHt2YWx1ZTogMH0gfSxcbiAgICAgIG1ham9yVGlja3M6IHsgb3BhY2l0eToge3ZhbHVlOiAwfSB9LFxuICAgICAgYXhpczogeyBvcGFjaXR5OiB7dmFsdWU6IDB9IH1cbiAgICB9O1xuICB9XG4gIGlmKGlzQ29sKXtcbiAgICBheGlzLm9mZnNldCA9IFtvcHQueEF4aXNNYXJnaW4gfHwgMCwgZW5jb2RpbmcuY29uZmlnKFwieUF4aXNNYXJnaW5cIildO1xuICAgIGF4aXMub3JpZW50ID0gXCJ0b3BcIjtcbiAgfVxuXG4gIGlmIChuYW1lPT1cInhcIiAmJiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIE8pIHx8IGVuY29kaW5nLmJpbihuYW1lKSkpIHtcbiAgICBheGlzLnByb3BlcnRpZXMgPSB7XG4gICAgICBsYWJlbHM6IHtcbiAgICAgICAgYW5nbGU6IHt2YWx1ZTogMjcwfSxcbiAgICAgICAgYWxpZ246IHt2YWx1ZTogXCJyaWdodFwifSxcbiAgICAgICAgYmFzZWxpbmU6IHt2YWx1ZTogXCJtaWRkbGVcIn1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXhpcztcbn1cblxuZnVuY3Rpb24gYXhpc190aXRsZShheGlzLCBuYW1lLCBlbmNvZGluZywgb3B0KXtcbiAgYXhpcy50aXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSk7XG4gIGlmKG5hbWU9PVkpe1xuICAgIGF4aXMudGl0bGVPZmZzZXQgPSA2MDtcbiAgICAvLyBUT0RPOiBzZXQgYXBwcm9wcmlhdGUgdGl0bGVPZmZzZXRcbiAgICAvLyBtYXliZSBiYXNlZCBvbiBzb21lIHN0cmluZyBsZW5ndGggZnJvbSBzdGF0c1xuICB9XG4gIHJldHVybiBheGlzO1xufVxuIiwidmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBheGlzID0gcmVxdWlyZSgnLi9heGlzJyksXG4gIGxlZ2VuZHMgPSByZXF1aXJlKCcuL2xlZ2VuZHMnKSxcbiAgbWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyksXG4gIHNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG52YXIgY29tcGlsZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBzaXplID0gc2V0U2l6ZShlbmNvZGluZywgc3RhdHMpLFxuICAgIGNlbGxXaWR0aCA9IHNpemUuY2VsbFdpZHRoLFxuICAgIGNlbGxIZWlnaHQgPSBzaXplLmNlbGxIZWlnaHQ7XG5cbiAgdmFyIGhhc0FnZyA9IGVuY29kaW5nLmFueShmdW5jdGlvbih2LCBrKXtcbiAgICByZXR1cm4gdi5hZ2dyICE9PSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIHZhciBzcGVjID0gdGVtcGxhdGUoZW5jb2RpbmcsIHNpemUsIHN0YXRzKSxcbiAgICBncm91cCA9IHNwZWMubWFya3NbMF0sXG4gICAgbWFyayA9IG1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLFxuICAgIG1kZWYgPSBtYXJrZGVmKG1hcmssIGVuY29kaW5nLCB7XG4gICAgICBoYXNBZ2dyZWdhdGU6IGhhc0FnZ1xuICAgIH0pO1xuXG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgdmFyIHByZWFnZ3JlZ2F0ZWREYXRhID0gZW5jb2RpbmcuY29uZmlnKFwidXNlVmVnYVNlcnZlclwiKTtcblxuICBncm91cC5tYXJrcy5wdXNoKG1kZWYpO1xuICAvLyBUT0RPOiByZXR1cm4gdmFsdWUgbm90IHVzZWRcbiAgYmlubmluZyhzcGVjLmRhdGFbMF0sIGVuY29kaW5nLCB7cHJlYWdncmVnYXRlZERhdGE6IHByZWFnZ3JlZ2F0ZWREYXRhfSk7XG5cbiAgdmFyIGxpbmVUeXBlID0gbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0ubGluZTtcblxuICBpZighcHJlYWdncmVnYXRlZERhdGEpe1xuICAgIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZW5jVHlwZSwgZmllbGQpe1xuICAgICAgaWYoZmllbGQudHlwZSA9PT0gVCAmJiBmaWVsZC5mbil7XG4gICAgICAgIHRpbWVUcmFuc2Zvcm0oc3BlYy5kYXRhWzBdLCBlbmNvZGluZywgZW5jVHlwZSwgZmllbGQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gaGFuZGxlIHN1YmZhY2V0c1xuICB2YXIgYWdnUmVzdWx0ID0gYWdncmVnYXRlcyhzcGVjLmRhdGFbMF0sIGVuY29kaW5nLCB7cHJlYWdncmVnYXRlZERhdGE6IHByZWFnZ3JlZ2F0ZWREYXRhfSksXG4gICAgZGV0YWlscyA9IGFnZ1Jlc3VsdC5kZXRhaWxzLFxuICAgIGhhc0RldGFpbHMgPSBkZXRhaWxzICYmIGRldGFpbHMubGVuZ3RoID4gMCxcbiAgICBzdGFjayA9IGhhc0RldGFpbHMgJiYgc3RhY2tpbmcoc3BlYywgZW5jb2RpbmcsIG1kZWYsIGFnZ1Jlc3VsdC5mYWNldHMpO1xuXG4gIGlmIChoYXNEZXRhaWxzICYmIChzdGFjayB8fCBsaW5lVHlwZSkpIHtcbiAgICAvL3N1YmZhY2V0IHRvIGdyb3VwIHN0YWNrIC8gbGluZSB0b2dldGhlciBpbiBvbmUgZ3JvdXBcbiAgICBzdWJmYWNldChncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKTtcbiAgfVxuXG4gIC8vIGF1dG8tc29ydCBsaW5lL2FyZWEgdmFsdWVzXG4gIC8vVE9ETyhrYW5pdHcpOiBoYXZlIHNvbWUgY29uZmlnIHRvIHR1cm4gb2ZmIGF1dG8tc29ydCBmb3IgbGluZSAoZm9yIGxpbmUgY2hhcnQgdGhhdCBlbmNvZGVzIHRlbXBvcmFsIGluZm9ybWF0aW9uKVxuICBpZiAobGluZVR5cGUpIHtcbiAgICB2YXIgZiA9IChlbmNvZGluZy5pc1R5cGUoWCwgUSB8IFQpICYmIGVuY29kaW5nLmlzVHlwZShZLCBPKSkgPyBZIDogWDtcbiAgICBpZiAoIW1kZWYuZnJvbSkgbWRlZi5mcm9tID0ge307XG4gICAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7dHlwZTogXCJzb3J0XCIsIGJ5OiBlbmNvZGluZy5maWVsZChmKX1dO1xuICB9XG5cbiAgLy8gU21hbGwgTXVsdGlwbGVzXG4gIGlmIChoYXNSb3cgfHwgaGFzQ29sKSB7XG4gICAgc3BlYyA9IGZhY2V0KGdyb3VwLCBlbmNvZGluZywgY2VsbEhlaWdodCwgY2VsbFdpZHRoLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpO1xuICB9IGVsc2Uge1xuICAgIGdyb3VwLnNjYWxlcyA9IHNjYWxlLmRlZnMoc2NhbGUubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSksIGVuY29kaW5nLFxuICAgICAge3N0YWNrOiBzdGFjaywgc3RhdHM6IHN0YXRzfSk7XG4gICAgZ3JvdXAuYXhlcyA9IGF4aXMuZGVmcyhheGlzLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpLCBlbmNvZGluZyk7XG4gICAgZ3JvdXAubGVnZW5kcyA9IGxlZ2VuZHMuZGVmcyhlbmNvZGluZyk7XG4gIH1cbiAgcmV0dXJuIHNwZWM7XG59O1xuXG5mdW5jdGlvbiBnZXRDYXJkaW5hbGl0eShlbmNvZGluZywgZW5jVHlwZSwgc3RhdHMpe1xuICB2YXIgZmllbGQgPSBlbmNvZGluZy5maWVsZE5hbWUoZW5jVHlwZSk7XG4gIGlmIChlbmNvZGluZy5iaW4oZW5jVHlwZSkpIHtcbiAgICB2YXIgYmlucyA9IHV0aWwuZ2V0YmlucyhzdGF0c1tmaWVsZF0pO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgcmV0dXJuIHN0YXRzW2ZpZWxkXS5jYXJkaW5hbGl0eTtcbn1cblxuZnVuY3Rpb24gc2V0U2l6ZShlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLFxuICAgICAgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCksXG4gICAgICBoYXNYID0gZW5jb2RpbmcuaGFzKFgpLFxuICAgICAgaGFzWSA9IGVuY29kaW5nLmhhcyhZKTtcblxuICAvLyBIQUNLIHRvIHNldCBjaGFydCBzaXplXG4gIC8vIE5PVEU6IHRoaXMgZmFpbHMgZm9yIHBsb3RzIGRyaXZlbiBieSBkZXJpdmVkIHZhbHVlcyAoZS5nLiwgYWdncmVnYXRlcylcbiAgLy8gT25lIHNvbHV0aW9uIGlzIHRvIHVwZGF0ZSBWZWdhIHRvIHN1cHBvcnQgYXV0by1zaXppbmdcbiAgLy8gSW4gdGhlIG1lYW50aW1lLCBhdXRvLXBhZGRpbmcgKG1vc3RseSkgZG9lcyB0aGUgdHJpY2tcbiAgLy9cbiAgdmFyIGNvbENhcmRpbmFsaXR5ID0gaGFzQ29sID8gZ2V0Q2FyZGluYWxpdHkoZW5jb2RpbmcsIENPTCwgc3RhdHMpIDogMSxcbiAgICByb3dDYXJkaW5hbGl0eSA9IGhhc1JvdyA/IGdldENhcmRpbmFsaXR5KGVuY29kaW5nLCBST1csIHN0YXRzKSA6IDE7XG5cbiAgdmFyIGNlbGxXaWR0aCA9IGhhc1ggP1xuICAgICAgK2VuY29kaW5nLmNvbmZpZyhcImNlbGxXaWR0aFwiKSB8fCBlbmNvZGluZy5jb25maWcoXCJ3aWR0aFwiKSAqIDEuMCAvIGNvbENhcmRpbmFsaXR5IDpcbiAgICAgIGVuY29kaW5nLm1hcmt0eXBlKCkgPT09IFwidGV4dFwiID9cbiAgICAgICAgK2VuY29kaW5nLmNvbmZpZyhcInRleHRDZWxsV2lkdGhcIikgOlxuICAgICAgICArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIiksXG4gICAgY2VsbEhlaWdodCA9IGhhc1kgP1xuICAgICAgK2VuY29kaW5nLmNvbmZpZyhcImNlbGxIZWlnaHRcIikgfHwgZW5jb2RpbmcuY29uZmlnKFwiaGVpZ2h0XCIpICogMS4wIC8gcm93Q2FyZGluYWxpdHkgOlxuICAgICAgK2VuY29kaW5nLmNvbmZpZyhcImJhbmRTaXplXCIpLFxuICAgIGNlbGxQYWRkaW5nID0gZW5jb2RpbmcuY29uZmlnKFwiY2VsbFBhZGRpbmdcIiksXG4gICAgYmFuZFBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoXCJiYW5kUGFkZGluZ1wiKSxcbiAgICB3aWR0aCA9IGVuY29kaW5nLmNvbmZpZyhcIl9taW5XaWR0aFwiKSxcbiAgICBoZWlnaHQgPSBlbmNvZGluZy5jb25maWcoXCJfbWluSGVpZ2h0XCIpO1xuXG4gIGlmIChoYXNYICYmIChlbmNvZGluZy5pc1R5cGUoWCwgTykgfHwgZW5jb2RpbmcuYmluKFgpKSkgeyAvL29yZGluYWwgZmllbGQgd2lsbCBvdmVycmlkZSBwYXJlbnRcbiAgICAvLyBiYW5kcyB3aXRoaW4gY2VsbCB1c2UgcmFuZ2VQb2ludHMoKVxuICAgIHZhciB4Q2FyZGluYWxpdHkgPSBnZXRDYXJkaW5hbGl0eShlbmNvZGluZywgWCwgc3RhdHMpO1xuICAgIGNlbGxXaWR0aCA9ICh4Q2FyZGluYWxpdHkgKyBiYW5kUGFkZGluZykgKiArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIik7XG4gIH1cbiAgLy8gQ2VsbCBiYW5kcyB1c2UgcmFuZ2VCYW5kcygpLiBUaGVyZSBhcmUgbi0xIHBhZGRpbmcuICBPdXRlcnBhZGRpbmcgPSAwIGZvciBjZWxsc1xuICB3aWR0aCA9IGNlbGxXaWR0aCAqICgoMSArIGNlbGxQYWRkaW5nKSAqIChjb2xDYXJkaW5hbGl0eS0xKSArIDEpO1xuXG4gIGlmIChoYXNZICYmIChlbmNvZGluZy5pc1R5cGUoWSwgTykgfHwgZW5jb2RpbmcuYmluKFkpKSkge1xuICAgIC8vIGJhbmRzIHdpdGhpbiBjZWxsIHVzZSByYW5nZVBvaW50KClcbiAgICB2YXIgeUNhcmRpbmFsaXR5ID0gZ2V0Q2FyZGluYWxpdHkoZW5jb2RpbmcsIFksIHN0YXRzKTtcbiAgICBjZWxsSGVpZ2h0ID0gKHlDYXJkaW5hbGl0eSArIGJhbmRQYWRkaW5nKSAqICtlbmNvZGluZy5jb25maWcoXCJiYW5kU2l6ZVwiKTtcbiAgfVxuICAvLyBDZWxsIGJhbmRzIHVzZSByYW5nZUJhbmRzKCkuIFRoZXJlIGFyZSBuLTEgcGFkZGluZy4gIE91dGVycGFkZGluZyA9IDAgZm9yIGNlbGxzXG4gIGhlaWdodCA9IGNlbGxIZWlnaHQgKiAoKDEgKyBjZWxsUGFkZGluZykgKiAocm93Q2FyZGluYWxpdHktMSkgKyAxKTtcblxuICByZXR1cm4ge1xuICAgIGNlbGxXaWR0aDogY2VsbFdpZHRoLFxuICAgIGNlbGxIZWlnaHQ6IGNlbGxIZWlnaHQsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDpoZWlnaHRcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmFjZXQoZ3JvdXAsIGVuY29kaW5nLCBjZWxsSGVpZ2h0LCBjZWxsV2lkdGgsIHNwZWMsIG1kZWYsIHN0YWNrLCBzdGF0cykge1xuICAgIHZhciBlbnRlciA9IGdyb3VwLnByb3BlcnRpZXMuZW50ZXI7XG4gICAgdmFyIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdO1xuXG4gICAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLCBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKTtcblxuICAgIHZhciB4QXhpc01hcmdpbiA9IGVuY29kaW5nLmhhcyhZKSA/IGVuY29kaW5nLmNvbmZpZyhcInhBeGlzTWFyZ2luXCIpIDogdW5kZWZpbmVkO1xuXG4gICAgZW50ZXIuZmlsbCA9IHt2YWx1ZTogZW5jb2RpbmcuY29uZmlnKFwiY2VsbEJhY2tncm91bmRDb2xvclwiKX07XG5cbiAgICAvL21vdmUgXCJmcm9tXCIgdG8gY2VsbCBsZXZlbCBhbmQgYWRkIGZhY2V0IHRyYW5zZm9ybVxuICAgIGdyb3VwLmZyb20gPSB7ZGF0YTogZ3JvdXAubWFya3NbMF0uZnJvbS5kYXRhfTtcblxuICAgIGlmIChncm91cC5tYXJrc1swXS5mcm9tLnRyYW5zZm9ybSkge1xuICAgICAgZGVsZXRlIGdyb3VwLm1hcmtzWzBdLmZyb20uZGF0YTsgLy9uZWVkIHRvIGtlZXAgdHJhbnNmb3JtIGZvciBzdWJmYWNldHRpbmcgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZ3JvdXAubWFya3NbMF0uZnJvbTtcbiAgICB9XG4gICAgaWYgKGhhc1Jvdykge1xuICAgICAgaWYgKCFlbmNvZGluZy5pc1R5cGUoUk9XLCBPKSkge1xuICAgICAgICB1dGlsLmVycm9yKFwiUm93IGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLlwiKTtcbiAgICAgIH1cbiAgICAgIGVudGVyLnkgPSB7c2NhbGU6IFJPVywgZmllbGQ6IFwia2V5cy5cIiArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgICAgZW50ZXIuaGVpZ2h0ID0ge1widmFsdWVcIjogY2VsbEhlaWdodH07IC8vIEhBQ0tcblxuICAgICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGQoUk9XKSk7XG5cbiAgICAgIHZhciBmcm9tO1xuICAgICAgaWYgKGhhc0NvbCkge1xuICAgICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICAgIGZyb20udHJhbnNmb3JtID0gZnJvbS50cmFuc2Zvcm0gfHwgW107XG4gICAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6IFwiZmFjZXRcIiwga2V5czogW2VuY29kaW5nLmZpZWxkKENPTCldfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBheGVzR3JwID0gZ3JvdXBkZWYoXCJ4LWF4ZXNcIiwge1xuICAgICAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhYKSA/ICBheGlzLmRlZnMoW1wieFwiXSwgZW5jb2RpbmcpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHg6IGhhc0NvbCA/IHtzY2FsZTogQ09MLCBmaWVsZDogXCJrZXlzLjBcIiwgb2Zmc2V0OiB4QXhpc01hcmdpbn0gOiB7dmFsdWU6IHhBeGlzTWFyZ2lufSxcbiAgICAgICAgICB3aWR0aDogaGFzQ29sICYmIHtcInZhbHVlXCI6IGNlbGxXaWR0aH0sIC8vSEFDSz9cbiAgICAgICAgICBmcm9tOiBmcm9tXG4gICAgICAgIH0pO1xuXG4gICAgICBzcGVjLm1hcmtzLnB1c2goYXhlc0dycCk7XG4gICAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICAgIHNwZWMuYXhlcy5wdXNoLmFwcGx5KHNwZWMuYXhlcywgYXhpcy5kZWZzKFtcInJvd1wiXSwgZW5jb2RpbmcpKTtcbiAgICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgcm93XG4gICAgICBpZihlbmNvZGluZy5oYXMoWCkpe1xuICAgICAgICAvL2tlZXAgeCBheGlzIGluIHRoZSBjZWxsXG4gICAgICAgIGNlbGxBeGVzLnB1c2guYXBwbHkoY2VsbEF4ZXMsIGF4aXMuZGVmcyhbXCJ4XCJdLCBlbmNvZGluZykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNDb2wpIHtcbiAgICAgIGlmICghZW5jb2RpbmcuaXNUeXBlKENPTCwgTykpIHtcbiAgICAgICAgdXRpbC5lcnJvcihcIkNvbCBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC5cIik7XG4gICAgICB9XG4gICAgICBlbnRlci54ID0ge3NjYWxlOiBDT0wsIGZpZWxkOiBcImtleXMuXCIgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICAgIGVudGVyLndpZHRoID0ge1widmFsdWVcIjogY2VsbFdpZHRofTsgLy8gSEFDS1xuXG4gICAgICBmYWNldEtleXMucHVzaChlbmNvZGluZy5maWVsZChDT0wpKTtcblxuICAgICAgdmFyIGZyb207XG4gICAgICBpZiAoaGFzUm93KSB7XG4gICAgICAgIGZyb20gPSB1dGlsLmR1cGxpY2F0ZShncm91cC5mcm9tKTtcbiAgICAgICAgZnJvbS50cmFuc2Zvcm0gPSBmcm9tLnRyYW5zZm9ybSB8fCBbXTtcbiAgICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogXCJmYWNldFwiLCBrZXlzOiBbZW5jb2RpbmcuZmllbGQoUk9XKV19KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGF4ZXNHcnAgPSBncm91cGRlZihcInktYXhlc1wiLCB7XG4gICAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhZKSA/IGF4aXMuZGVmcyhbXCJ5XCJdLCBlbmNvZGluZykgOiB1bmRlZmluZWQsXG4gICAgICAgIHk6IGhhc1JvdyAmJiB7c2NhbGU6IFJPVywgZmllbGQ6IFwia2V5cy4wXCJ9LFxuICAgICAgICB4OiBoYXNSb3cgJiYge3ZhbHVlOiB4QXhpc01hcmdpbn0sXG4gICAgICAgIGhlaWdodDogaGFzUm93ICYmIHtcInZhbHVlXCI6IGNlbGxIZWlnaHR9LCAvL0hBQ0s/XG4gICAgICAgIGZyb206IGZyb21cbiAgICAgIH0pO1xuXG4gICAgICBzcGVjLm1hcmtzLnB1c2goYXhlc0dycCk7XG4gICAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKVxuICAgICAgc3BlYy5heGVzLnB1c2guYXBwbHkoc3BlYy5heGVzLCBheGlzLmRlZnMoW1wiY29sXCJdLCBlbmNvZGluZywge1xuICAgICAgICB4QXhpc01hcmdpbjogeEF4aXNNYXJnaW5cbiAgICAgIH0pKTtcbiAgICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgY29sXG4gICAgICBpZihlbmNvZGluZy5oYXMoWSkpe1xuICAgICAgICBjZWxsQXhlcy5wdXNoLmFwcGx5KGNlbGxBeGVzLCBheGlzLmRlZnMoW1wieVwiXSwgZW5jb2RpbmcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihoYXNSb3cpe1xuICAgICAgaWYoZW50ZXIueCkgZW50ZXIueC5vZmZzZXQ9IHhBeGlzTWFyZ2luO1xuICAgICAgZWxzZSBlbnRlci54ID0ge3ZhbHVlOiB4QXhpc01hcmdpbn07XG4gICAgfVxuICAgIGlmKGhhc0NvbCl7XG4gICAgICAvL1RPRE8gZmlsbCBoZXJlLi5cbiAgICB9XG5cbiAgICAvLyBhc3N1bWluZyBlcXVhbCBjZWxsV2lkdGggaGVyZVxuICAgIC8vIFRPRE86IHN1cHBvcnQgaGV0ZXJvZ2Vub3VzIGNlbGxXaWR0aCAobWF5YmUgYnkgdXNpbmcgbXVsdGlwbGUgc2NhbGVzPylcbiAgICBzcGVjLnNjYWxlcyA9IChzcGVjLnNjYWxlcyB8fFtdKS5jb25jYXQoc2NhbGUuZGVmcyhcbiAgICAgIHNjYWxlLm5hbWVzKGVudGVyKS5jb25jYXQoc2NhbGUubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSkpLFxuICAgICAgZW5jb2RpbmcsXG4gICAgICB7Y2VsbFdpZHRoOiBjZWxsV2lkdGgsIGNlbGxIZWlnaHQ6IGNlbGxIZWlnaHQsIHN0YWNrOiBzdGFjaywgZmFjZXQ6dHJ1ZSwgc3RhdHM6IHN0YXRzfVxuICAgICkpOyAvLyByb3cvY29sIHNjYWxlcyArIGNlbGwgc2NhbGVzXG5cbiAgICBpZiAoY2VsbEF4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAuYXhlcyA9IGNlbGxBeGVzO1xuICAgIH1cblxuICAgIC8vIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgICB2YXIgdHJhbnMgPSAoZ3JvdXAuZnJvbS50cmFuc2Zvcm0gfHwgKGdyb3VwLmZyb20udHJhbnNmb3JtID0gW10pKTtcbiAgICB0cmFucy51bnNoaWZ0KHt0eXBlOiBcImZhY2V0XCIsIGtleXM6IGZhY2V0S2V5c30pO1xuXG4gIHJldHVybiBzcGVjO1xuICB9XG5cbmZ1bmN0aW9uIHN1YmZhY2V0KGdyb3VwLCBtZGVmLCBkZXRhaWxzLCBzdGFjaywgZW5jb2RpbmcpIHtcbiAgdmFyIG0gPSBncm91cC5tYXJrcyxcbiAgICBnID0gZ3JvdXBkZWYoXCJzdWJmYWNldFwiLCB7bWFya3M6IG19KTtcblxuICBncm91cC5tYXJrcyA9IFtnXTtcbiAgZy5mcm9tID0gbWRlZi5mcm9tO1xuICBkZWxldGUgbWRlZi5mcm9tO1xuXG4gIC8vVE9ETyB0ZXN0IExPRCAtLSB3ZSBzaG91bGQgc3VwcG9ydCBzdGFjayAvIGxpbmUgd2l0aG91dCBjb2xvciAoTE9EKSBmaWVsZFxuICB2YXIgdHJhbnMgPSAoZy5mcm9tLnRyYW5zZm9ybSB8fCAoZy5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6IFwiZmFjZXRcIiwga2V5czogZGV0YWlsc30pO1xuXG4gIGlmIChzdGFjayAmJiBlbmNvZGluZy5oYXMoQ09MT1IpKSB7XG4gICAgdHJhbnMudW5zaGlmdCh7dHlwZTogXCJzb3J0XCIsIGJ5OiBlbmNvZGluZy5maWVsZChDT0xPUil9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUaW1lRm4oZm4pe1xuICBzd2l0Y2goZm4pe1xuICAgIGNhc2UgXCJzZWNvbmRcIjogcmV0dXJuIFwiZ2V0VVRDU2Vjb25kc1wiO1xuICAgIGNhc2UgXCJtaW51dGVcIjogcmV0dXJuIFwiZ2V0VVRDTWludXRlc1wiO1xuICAgIGNhc2UgXCJob3VyXCI6IHJldHVybiBcImdldFVUQ0hvdXJzXCI7XG4gICAgY2FzZSBcImRheVwiOiByZXR1cm4gXCJnZXRVVENEYXlcIjtcbiAgICBjYXNlIFwiZGF0ZVwiOiByZXR1cm4gXCJnZXRVVENEYXRlXCI7XG4gICAgY2FzZSBcIm1vbnRoXCI6IHJldHVybiBcImdldFVUQ01vbnRoXCI7XG4gICAgY2FzZSBcInllYXJcIjogcmV0dXJuIFwiZ2V0VVRDRnVsbFllYXJcIjtcbiAgfVxuICBjb25zb2xlLmVycm9yKFwibm8gZnVuY3Rpb24gc3BlY2lmaWVkIGZvciBkYXRlXCIpO1xufVxuXG5mdW5jdGlvbiB0aW1lVHJhbnNmb3JtKHNwZWMsIGVuY29kaW5nLCBlbmNUeXBlLCBmaWVsZCl7XG4gIHZhciBmdW5jID0gZ2V0VGltZUZuKGZpZWxkLmZuKTtcblxuICBzcGVjLnRyYW5zZm9ybSA9IHNwZWMudHJhbnNmb3JtIHx8IFtdO1xuICBzcGVjLnRyYW5zZm9ybS5wdXNoKHtcbiAgICB0eXBlOiBcImZvcm11bGFcIixcbiAgICBmaWVsZDogZW5jb2RpbmcuZmllbGQoZW5jVHlwZSksXG4gICAgZXhwcjogXCJuZXcgRGF0ZShkLmRhdGEuXCIrZmllbGQubmFtZStcIikuXCIrZnVuYytcIigpXCJcbiAgfSk7XG4gIHJldHVybiBzcGVjO1xufVxuXG5mdW5jdGlvbiBiaW5uaW5nKHNwZWMsIGVuY29kaW5nLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuICB2YXIgYmlucyA9IHt9O1xuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKHZ2LCBkKSB7XG4gICAgaWYgKGQuYmluKSBiaW5zW2QubmFtZV0gPSBkLm5hbWU7XG4gIH0pO1xuICBiaW5zID0gdXRpbC5rZXlzKGJpbnMpO1xuXG4gIGlmIChiaW5zLmxlbmd0aCA9PT0gMCB8fCBvcHQucHJlYWdncmVnYXRlZERhdGEpIHJldHVybiBmYWxzZTtcblxuICBpZiAoIXNwZWMudHJhbnNmb3JtKSBzcGVjLnRyYW5zZm9ybSA9IFtdO1xuICBiaW5zLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgIHNwZWMudHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogXCJiaW5cIixcbiAgICAgIGZpZWxkOiBcImRhdGEuXCIgKyBkLFxuICAgICAgb3V0cHV0OiBcImRhdGEuYmluX1wiICsgZCxcbiAgICAgIG1heGJpbnM6IE1BWF9CSU5TXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYmlucztcbn1cblxuZnVuY3Rpb24gYWdncmVnYXRlcyhzcGVjLCBlbmNvZGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgdmFyIGRpbXMgPSB7fSwgbWVhcyA9IHt9LCBkZXRhaWwgPSB7fSwgZmFjZXRzPXt9O1xuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGVuY1R5cGUsIGZpZWxkKSB7XG4gICAgaWYgKGZpZWxkLmFnZ3IpIHtcbiAgICAgIGlmKGZpZWxkLmFnZ3I9PT1cImNvdW50XCIpe1xuICAgICAgICBtZWFzW1wiY291bnRcIl0gPSB7b3A6XCJjb3VudFwiLCBmaWVsZDpcIipcIn07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgbWVhc1tmaWVsZC5hZ2dyK1wifFwiK2ZpZWxkLm5hbWVdID0ge1xuICAgICAgICAgIG9wOmZpZWxkLmFnZ3IsXG4gICAgICAgICAgZmllbGQ6XCJkYXRhLlwiK2ZpZWxkLm5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGltc1tmaWVsZC5uYW1lXSA9IGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpO1xuICAgICAgaWYgKGVuY1R5cGU9PVJPVyB8fCBlbmNUeXBlID09IENPTCl7XG4gICAgICAgIGZhY2V0c1tmaWVsZC5uYW1lXSA9IGRpbXNbZmllbGQubmFtZV07XG4gICAgICB9ZWxzZSBpZiAoZW5jVHlwZSAhPT0gWCAmJiBlbmNUeXBlICE9PSBZKSB7XG4gICAgICAgIGRldGFpbFtmaWVsZC5uYW1lXSA9IGRpbXNbZmllbGQubmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgZGltcyA9IHV0aWwudmFscyhkaW1zKTtcbiAgbWVhcyA9IHV0aWwudmFscyhtZWFzKTtcblxuICBpZiAobWVhcy5sZW5ndGggPiAwICYmICFvcHQucHJlYWdncmVnYXRlZERhdGEpIHtcbiAgICBpZiAoIXNwZWMudHJhbnNmb3JtKSBzcGVjLnRyYW5zZm9ybSA9IFtdO1xuICAgIHNwZWMudHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgIGdyb3VwYnk6IGRpbXMsXG4gICAgICBmaWVsZHM6IG1lYXNcbiAgICB9KTtcblxuICAgIGlmIChlbmNvZGluZy5tYXJrdHlwZSgpID09PSBURVhUKSB7XG4gICAgICBtZWFzLmZvckVhY2goIGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHZhciBmaWVsZE5hbWUgPSBtLmZpZWxkLnN1YnN0cig1KSwgLy9yZW1vdmUgXCJkYXRhLlwiXG4gICAgICAgICAgZmllbGQgPSBcImRhdGEuXCIgKyAobS5vcCA/IG0ub3AgKyBcIl9cIiA6IFwiXCIpICsgZmllbGROYW1lO1xuICAgICAgICBzcGVjLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcImZvcm11bGFcIixcbiAgICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgICAgZXhwcjogXCJkMy5mb3JtYXQoJy4yZicpKGQuXCIrZmllbGQrXCIpXCJcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkZXRhaWxzOiB1dGlsLnZhbHMoZGV0YWlsKSxcbiAgICBkaW1zOiBkaW1zLFxuICAgIGZhY2V0czogdXRpbC52YWxzKGZhY2V0cyksXG4gICAgYWdncmVnYXRlZDogbWVhcy5sZW5ndGggPiAwXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RhY2tpbmcoc3BlYywgZW5jb2RpbmcsIG1kZWYsIGZhY2V0cykge1xuICBpZiAoIW1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLnN0YWNrKSByZXR1cm4gZmFsc2U7XG4gIGlmICghZW5jb2RpbmcuaGFzKENPTE9SKSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBkaW0gPSBYLCB2YWwgPSBZLCBpZHggPSAxO1xuICBpZiAoZW5jb2RpbmcuaXNUeXBlKFgsUXxUKSAmJiAhZW5jb2RpbmcuaXNUeXBlKFksUXxUKSAmJiBlbmNvZGluZy5oYXMoWSkpIHtcbiAgICBkaW0gPSBZO1xuICAgIHZhbCA9IFg7XG4gICAgaWR4ID0gMDtcbiAgfVxuXG4gIC8vIGFkZCB0cmFuc2Zvcm0gdG8gY29tcHV0ZSBzdW1zIGZvciBzY2FsZVxuICB2YXIgc3RhY2tlZCA9IHtcbiAgICBuYW1lOiBTVEFDS0VELFxuICAgIHNvdXJjZTogVEFCTEUsXG4gICAgdHJhbnNmb3JtOiBbe1xuICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgIGdyb3VwYnk6IFtlbmNvZGluZy5maWVsZChkaW0pXS5jb25jYXQoZmFjZXRzKSwgLy8gZGltIGFuZCBvdGhlciBmYWNldHNcbiAgICAgIGZpZWxkczogW3tvcDogXCJzdW1cIiwgZmllbGQ6IGVuY29kaW5nLmZpZWxkKHZhbCl9XSAvLyBUT0RPIGNoZWNrIGlmIGZpZWxkIHdpdGggYWdnciBpcyBjb3JyZWN0P1xuICAgIH1dXG4gIH07XG5cbiAgaWYoZmFjZXRzICYmIGZhY2V0cy5sZW5ndGggPiAwKXtcbiAgICBzdGFja2VkLnRyYW5zZm9ybS5wdXNoKHsgLy9jYWxjdWxhdGUgbWF4IGZvciBlYWNoIGZhY2V0XG4gICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgZ3JvdXBieTogZmFjZXRzLFxuICAgICAgZmllbGRzOiBbe29wOiBcIm1heFwiLCBmaWVsZDogXCJkYXRhLnN1bV9cIiArIGVuY29kaW5nLmZpZWxkKHZhbCwgdHJ1ZSl9XVxuICAgIH0pO1xuICB9XG5cbiAgc3BlYy5kYXRhLnB1c2goc3RhY2tlZCk7XG5cbiAgLy8gYWRkIHN0YWNrIHRyYW5zZm9ybSB0byBtYXJrXG4gIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe1xuICAgIHR5cGU6IFwic3RhY2tcIixcbiAgICBwb2ludDogZW5jb2RpbmcuZmllbGQoZGltKSxcbiAgICBoZWlnaHQ6IGVuY29kaW5nLmZpZWxkKHZhbCksXG4gICAgb3V0cHV0OiB7eTE6IHZhbCwgeTA6IHZhbCtcIjJcIn1cbiAgfV07XG5cbiAgLy8gVE9ETzogVGhpcyBpcyBzdXBlciBoYWNrLWlzaCAtLSBjb25zb2xpZGF0ZSBpbnRvIG1vZHVsYXIgbWFyayBwcm9wZXJ0aWVzP1xuICBtZGVmLnByb3BlcnRpZXMudXBkYXRlW3ZhbF0gPSBtZGVmLnByb3BlcnRpZXMuZW50ZXJbdmFsXSA9IHtzY2FsZTogdmFsLCBmaWVsZDogdmFsfTtcbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWwrXCIyXCJdID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbCtcIjJcIl0gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbCtcIjJcIn07XG5cbiAgcmV0dXJuIHZhbDsgLy9yZXR1cm4gc3RhY2sgZW5jb2Rpbmdcbn1cblxuXG5mdW5jdGlvbiBtYXJrZGVmKG1hcmssIGVuY29kaW5nLCBvcHQpIHtcbiAgdmFyIHAgPSBtYXJrLnByb3AoZW5jb2RpbmcsIG9wdClcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBtYXJrLnR5cGUsXG4gICAgZnJvbToge2RhdGE6IFRBQkxFfSxcbiAgICBwcm9wZXJ0aWVzOiB7ZW50ZXI6IHAsIHVwZGF0ZTogcH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBkZWYobmFtZSwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgcmV0dXJuIHtcbiAgICBfbmFtZTogbmFtZSB8fCB1bmRlZmluZWQsXG4gICAgdHlwZTogXCJncm91cFwiLFxuICAgIGZyb206IG9wdC5mcm9tLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGVudGVyOiB7XG4gICAgICAgIHg6IG9wdC54IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgeTogb3B0LnkgfHwgdW5kZWZpbmVkLFxuICAgICAgICB3aWR0aDogb3B0LndpZHRoIHx8IHtncm91cDogXCJ3aWR0aFwifSxcbiAgICAgICAgaGVpZ2h0OiBvcHQuaGVpZ2h0IHx8IHtncm91cDogXCJoZWlnaHRcIn1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNjYWxlczogb3B0LnNjYWxlcyB8fCB1bmRlZmluZWQsXG4gICAgYXhlczogb3B0LmF4ZXMgfHwgdW5kZWZpbmVkLFxuICAgIG1hcmtzOiBvcHQubWFya3MgfHwgW11cbiAgfTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGUoZW5jb2RpbmcsIHNpemUsIHN0YXRzKSB7IC8vaGFjayB1c2Ugc3RhdHNcblxuICB2YXIgZGF0YSA9IHtuYW1lOlRBQkxFLCBmb3JtYXQ6IHt0eXBlOiBlbmNvZGluZy5jb25maWcoXCJkYXRhRm9ybWF0VHlwZVwiKX19LFxuICAgIGRhdGFVcmwgPSB2bC5kYXRhLmdldFVybChlbmNvZGluZywgc3RhdHMpO1xuICBpZihkYXRhVXJsKSBkYXRhLnVybCA9IGRhdGFVcmw7XG5cbiAgdmFyIHByZWFnZ3JlZ2F0ZWREYXRhID0gZW5jb2RpbmcuY29uZmlnKFwidXNlVmVnYVNlcnZlclwiKTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGVuY1R5cGUsIGZpZWxkKXtcbiAgICBpZihmaWVsZC50eXBlID09IFQpe1xuICAgICAgZGF0YS5mb3JtYXQucGFyc2UgPSBkYXRhLmZvcm1hdC5wYXJzZSB8fCB7fTtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlW2ZpZWxkLm5hbWVdID0gXCJkYXRlXCI7XG4gICAgfWVsc2UgaWYoZmllbGQudHlwZSA9PSBRKXtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlID0gZGF0YS5mb3JtYXQucGFyc2UgfHwge307XG4gICAgICBpZiAoZmllbGQuYWdnciA9PT0gXCJjb3VudFwiKSB7XG4gICAgICAgIHZhciBuYW1lID0gXCJjb3VudFwiO1xuICAgICAgfSBlbHNlIGlmKHByZWFnZ3JlZ2F0ZWREYXRhICYmIGZpZWxkLmJpbil7XG4gICAgICAgIHZhciBuYW1lID0gXCJiaW5fXCIgKyBmaWVsZC5uYW1lO1xuICAgICAgfSBlbHNlIGlmKHByZWFnZ3JlZ2F0ZWREYXRhICYmIGZpZWxkLmFnZ3Ipe1xuICAgICAgICB2YXIgbmFtZSA9IGZpZWxkLmFnZ3IgKyBcIl9cIiArIGZpZWxkLm5hbWU7XG4gICAgICB9IGVsc2V7XG4gICAgICAgIHZhciBuYW1lID0gZmllbGQubmFtZTtcbiAgICAgIH1cbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlW25hbWVdID0gXCJudW1iZXJcIjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHNpemUud2lkdGgsXG4gICAgaGVpZ2h0OiBzaXplLmhlaWdodCxcbiAgICBwYWRkaW5nOiBcImF1dG9cIixcbiAgICBkYXRhOiBbZGF0YV0sXG4gICAgbWFya3M6IFtncm91cGRlZihcImNlbGxcIiwge1xuICAgICAgd2lkdGg6IHNpemUuY2VsbFdpZHRoID8ge3ZhbHVlOiBzaXplLmNlbGxXaWR0aH06IHVuZGVmaW5lZCxcbiAgICAgIGhlaWdodDogc2l6ZS5jZWxsSGVpZ2h0ID8ge3ZhbHVlOiBzaXplLmNlbGxIZWlnaHR9IDogdW5kZWZpbmVkXG4gICAgfSldXG4gIH07XG59XG4iLCJ2YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgY29uc3RzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuY29uc3RzLmVuY29kaW5nVHlwZXMgPSBbWCwgWSwgUk9XLCBDT0wsIFNJWkUsIFNIQVBFLCBDT0xPUiwgQUxQSEEsIFRFWFRdO1xuXG5jb25zdHMuZGF0YVR5cGVzID0ge1wiT1wiOiBPLCBcIlFcIjogUSwgXCJUXCI6IFR9O1xuXG5jb25zdHMuZGF0YVR5cGVOYW1lcyA9IFtcIk9cIixcIlFcIixcIlRcIl0ucmVkdWNlKGZ1bmN0aW9uKHIseCkge1xuICByW2NvbnN0cy5kYXRhVHlwZXNbeF1dID0geDsgcmV0dXJuIHI7XG59LHt9KTtcblxuY29uc3RzLkRFRkFVTFRTID0ge1xuICAvL3NtYWxsIG11bHRpcGxlc1xuICBjZWxsSGVpZ2h0OiAyMDAsIC8vIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgYmFuZFdpZHRoXG4gIGNlbGxXaWR0aDogMjAwLCAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aFxuICBjZWxsUGFkZGluZzogMC4xLFxuICBjZWxsQmFja2dyb3VuZENvbG9yOiBcIiNmZGZkZmRcIixcbiAgeEF4aXNNYXJnaW46IDgwLFxuICB5QXhpc01hcmdpbjogMCxcbiAgdGV4dENlbGxXaWR0aDogOTAsXG5cbiAgLy8gbWFya3NcbiAgYmFuZFNpemU6IDIxLFxuICBiYW5kUGFkZGluZzogMSxcbiAgcG9pbnRTaXplOiA1MCxcbiAgcG9pbnRTaGFwZTogXCJjaXJjbGVcIixcbiAgc3Ryb2tlV2lkdGg6IDIsXG4gIGNvbG9yOiBcInN0ZWVsYmx1ZVwiLFxuICB0ZXh0Q29sb3I6IFwiYmxhY2tcIixcbiAgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgdGV4dEJhc2VsaW5lOiBcIm1pZGRsZVwiLFxuICB0ZXh0TWFyZ2luOiA0LFxuICBmb250OiBcIkhlbHZldGljYSBOZXVlXCIsXG4gIGZvbnRTaXplOiBcIjEyXCIsXG4gIGZvbnRXZWlnaHQ6IFwibm9ybWFsXCIsXG4gIGZvbnRTdHlsZTogXCJub3JtYWxcIixcbiAgb3BhY2l0eTogMSxcbiAgX3RoaWNrT3BhY2l0eTogMC41LFxuICBfdGhpbk9wYWNpdHk6IDAuMixcblxuICAvLyBzY2FsZXNcbiAgLy8gVE9ETyByZW1vdmUgX3haZXJvLCAuLi5cbiAgX3haZXJvOiB0cnVlLFxuICBfeFJldmVyc2U6IGZhbHNlLFxuICBfeVplcm86IHRydWUsXG4gIF95UmV2ZXJzZTogZmFsc2UsXG4gIHRpbWVTY2FsZU5pY2U6IFwiZGF5XCJcbn07IiwiLy8gVE9ETyByZW5hbWUgZ2V0RGF0YVVybCB0byB2bC5kYXRhLmdldFVybCgpID9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIGRhdGEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5kYXRhLmdldFVybCA9IGZ1bmN0aW9uIGdldERhdGFVcmwoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIGlmICghZW5jb2RpbmcuY29uZmlnKFwidXNlVmVnYVNlcnZlclwiKSkge1xuICAgIC8vIGRvbid0IHVzZSB2ZWdhIHNlcnZlclxuICAgIHJldHVybiBlbmNvZGluZy5jb25maWcoXCJkYXRhVXJsXCIpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmxlbmd0aCgpID09PSAwKSB7XG4gICAgLy8gbm8gZmllbGRzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGZpZWxkcyA9IFtdXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZW5jVHlwZSwgZmllbGQpe1xuICAgIHZhciBvYmogPSB7XG4gICAgICBuYW1lOiBlbmNvZGluZy5maWVsZChlbmNUeXBlLCB0cnVlKSxcbiAgICAgIGZpZWxkOiBmaWVsZC5uYW1lXG4gICAgfVxuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBvYmouYWdnciA9IGZpZWxkLmFnZ3JcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJpbikge1xuICAgICAgb2JqLmJpblNpemUgPSB1dGlsLmdldGJpbnMoc3RhdHNbZmllbGQubmFtZV0pLnN0ZXA7XG4gICAgfVxuICAgIGZpZWxkcy5wdXNoKG9iaik7XG4gIH0pO1xuXG4gIHZhciBxdWVyeSA9IHtcbiAgICB0YWJsZTogZW5jb2RpbmcuY29uZmlnKFwidmVnYVNlcnZlclRhYmxlXCIpLFxuICAgIGZpZWxkczogZmllbGRzXG4gIH1cblxuICByZXR1cm4gZW5jb2RpbmcuY29uZmlnKFwidmVnYVNlcnZlclVybFwiKSArIFwiL3F1ZXJ5Lz9xPVwiICsgSlNPTi5zdHJpbmdpZnkocXVlcnkpXG59O1xuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBkYXRhIGluIEpTT04vamF2YXNjcmlwdCBvYmplY3QgZm9ybWF0XG4gKiBAcmV0dXJuIEFycmF5IG9mIHtuYW1lOiBfX25hbWVfXywgdHlwZTogXCJudW1iZXJ8dGV4dHx0aW1lfGxvY2F0aW9uXCJ9XG4gKi9cbmRhdGEuZ2V0U2NoZW1hID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBzY2hlbWEgPSBbXSxcbiAgICBmaWVsZHMgPSB1dGlsLmtleXMoZGF0YVswXSk7XG5cbiAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgLy8gZmluZCBub24tbnVsbCBkYXRhXG4gICAgdmFyIGk9MCwgZGF0dW0gPSBkYXRhW2ldW2tdO1xuICAgIHdoaWxlKGRhdHVtID09PSBcIlwiIHx8IGRhdHVtID09PSBudWxsIHx8IGRhdHVtID09PSB1bmRlZmluZWQpe1xuICAgICAgZGF0dW0gPSBkYXRhWysraV1ba107XG4gICAgfVxuXG4gICAgLy9UT0RPKGthbml0dyk6IGJldHRlciB0eXBlIGluZmVyZW5jZSBoZXJlXG4gICAgdmFyIHR5cGUgPSAodHlwZW9mIGRhdHVtID09PSBcIm51bWJlclwiKSA/IFwiUVwiOlxuICAgICAgaXNOYU4oRGF0ZS5wYXJzZShkYXR1bSkpID8gXCJPXCIgOiBcIlRcIjtcblxuICAgIHNjaGVtYS5wdXNoKHtuYW1lOiBrLCB0eXBlOiB0eXBlfSk7XG4gIH0pO1xuXG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5kYXRhLmdldFN0YXRzID0gZnVuY3Rpb24oZGF0YSl7IC8vIGhhY2tcbiAgdmFyIHN0YXRzID0ge30sXG4gICAgZmllbGRzID0gdXRpbC5rZXlzKGRhdGFbMF0pO1xuXG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICB2YXIgc3RhdCA9IHV0aWwubWlubWF4KGRhdGEsIGspO1xuICAgIHN0YXQuY2FyZGluYWxpdHkgPSB1dGlsLnVuaXEoZGF0YSwgayk7XG4gICAgc3RhdC5jb3VudCA9IGRhdGEubGVuZ3RoO1xuICAgIHN0YXRzW2tdID0gc3RhdDtcbiAgfSk7XG4gIHJldHVybiBzdGF0cztcbn07XG4iLCIvLyBkZWNsYXJlIGdsb2JhbCBjb25zdGFudFxudmFyIGcgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5nLlRBQkxFID0gXCJ0YWJsZVwiO1xuZy5TVEFDS0VEID0gXCJzdGFja2VkXCI7XG5nLklOREVYID0gXCJpbmRleFwiO1xuXG5nLlggPSBcInhcIjtcbmcuWSA9IFwieVwiO1xuZy5ST1cgPSBcInJvd1wiO1xuZy5DT0wgPSBcImNvbFwiO1xuZy5TSVpFID0gXCJzaXplXCI7XG5nLlNIQVBFID0gXCJzaGFwZVwiO1xuZy5DT0xPUiA9IFwiY29sb3JcIjtcbmcuQUxQSEEgPSBcImFscGhhXCI7XG5nLlRFWFQgPSBcInRleHRcIjtcblxuZy5PID0gMTtcbmcuUSA9IDI7XG5nLlQgPSA0O1xuXG4vL1RPRE8gcmVmYWN0b3IgdGhpcyB0byBiZSBjb25maWc/XG5nLk1BWF9CSU5TID0gMjA7IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgbGVnZW5kcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmxlZ2VuZHMuZGVmcyA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBsZWdlbmRzID0gW107XG5cbiAgLy8gVE9ETzogc3VwcG9ydCBhbHBoYVxuXG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmxlZ2VuZChDT0xPUikpIHtcbiAgICBsZWdlbmRzLnB1c2goe1xuICAgICAgZmlsbDogQ09MT1IsXG4gICAgICB0aXRsZTogZW5jb2RpbmcuZmllbGRUaXRsZShDT0xPUiksXG4gICAgICBvcmllbnQ6IFwicmlnaHRcIlxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSVpFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0laRSkpIHtcbiAgICBsZWdlbmRzLnB1c2goe1xuICAgICAgc2l6ZTogU0laRSxcbiAgICAgIHRpdGxlOiBlbmNvZGluZy5maWVsZFRpdGxlKFNJWkUpLFxuICAgICAgb3JpZW50OiBsZWdlbmRzLmxlbmd0aCA9PT0gMSA/IFwibGVmdFwiIDogXCJyaWdodFwiXG4gICAgfSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNIQVBFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0hBUEUpKSB7XG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBUT0RPOiBmaXggdGhpc1xuICAgICAgY29uc29sZS5lcnJvcihcIlZlZ2FsaXRlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIHR3byBsZWdlbmRzXCIpO1xuICAgICAgcmV0dXJuIGxlZ2VuZHM7XG4gICAgfVxuICAgIGxlZ2VuZHMucHVzaCh7XG4gICAgICBzaGFwZTogU0hBUEUsXG4gICAgICB0aXRsZTogZW5jb2RpbmcuZmllbGRUaXRsZShTSEFQRSksXG4gICAgICBvcmllbnQ6IGxlZ2VuZHMubGVuZ3RoID09PSAxID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCJcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsZWdlbmRzO1xufSIsInZhciBnbG9iYWxzID0gcmVxdWlyZShcIi4vZ2xvYmFsc1wiKSxcbiAgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbnZhciBtYXJrcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbm1hcmtzLmJhciA9IHtcbiAgdHlwZTogXCJyZWN0XCIsXG4gIHN0YWNrOiB0cnVlLFxuICBwcm9wOiBiYXJfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFtcInhcIiwgXCJ5XCJdLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzoxLCBjb2w6MSwgeDoxLCB5OjEsIHNpemU6MSwgY29sb3I6MSwgYWxwaGE6MX1cbn07XG5cbm1hcmtzLmxpbmUgPSB7XG4gIHR5cGU6IFwibGluZVwiLFxuICBsaW5lOiB0cnVlLFxuICBwcm9wOiBsaW5lX3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbXCJ4XCIsIFwieVwiXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6MSwgY29sOjEsIHg6MSwgeToxLCBjb2xvcjoxLCBhbHBoYToxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogXCJhcmVhXCIsXG4gIHN0YWNrOiB0cnVlLFxuICBsaW5lOiB0cnVlLFxuICByZXF1aXJlZEVuY29kaW5nOiBbXCJ4XCIsIFwieVwiXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmxpbmUuc3VwcG9ydGVkRW5jb2Rpbmdcbn07XG5cbm1hcmtzLmNpcmNsZSA9IHtcbiAgdHlwZTogXCJzeW1ib2xcIixcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKFwiY2lyY2xlXCIpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzoxLCBjb2w6MSwgeDoxLCB5OjEsIHNpemU6MSwgY29sb3I6MSwgYWxwaGE6MX1cbn07XG5cbm1hcmtzLnNxdWFyZSA9IHtcbiAgdHlwZTogXCJzeW1ib2xcIixcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKFwic3F1YXJlXCIpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzogbWFya3MuY2lyY2xlLnN1cHBvcnRlZEVuY29kaW5nXG59O1xuXG5tYXJrcy5wb2ludCA9IHtcbiAgdHlwZTogXCJzeW1ib2xcIixcbiAgcHJvcDogcG9pbnRfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OjEsIGNvbDoxLCB4OjEsIHk6MSwgc2l6ZToxLCBjb2xvcjoxLCBhbHBoYToxLCBzaGFwZToxfVxufTtcblxubWFya3MudGV4dCA9IHtcbiAgdHlwZTogXCJ0ZXh0XCIsXG4gIHByb3A6IHRleHRfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFtcInRleHRcIl0sXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OjEsIGNvbDoxLCBzaXplOjEsIGNvbG9yOjEsIGFscGhhOjEsIHRleHQ6MX1cbn07XG5cbmZ1bmN0aW9uIGJhcl9wcm9wcyhlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc1R5cGUoWCxRfFQpICYmICFlLmJpbihYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmhhcyhZKSAmJiAoIWUuaXNUeXBlKFksUXxUKSB8fCBlLmJpbihZKSkpIHtcbiAgICAgIHAueDIgPSB7c2NhbGU6IFgsIHZhbHVlOiAwfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnhjID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54YyA9IHt2YWx1ZTogMH07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmlzVHlwZShZLFF8VCkgJiYgIWUuYmluKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gICAgcC55MiA9IHtzY2FsZTogWSwgdmFsdWU6IDB9O1xuICB9IGVsc2UgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIHAueWMgPSB7Z3JvdXA6IFwiaGVpZ2h0XCJ9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmlzVHlwZShYLFF8VCkpIHtcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAud2lkdGggPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcC53aWR0aCA9IHtzY2FsZTogWCwgYmFuZDogdHJ1ZSwgb2Zmc2V0OiAtMX07XG4gICAgICBwLndpZHRoID0ge3ZhbHVlOiArZS5jb25maWcoXCJiYW5kU2l6ZVwiKSwgb2Zmc2V0OiAtMX07XG4gICAgfVxuICB9IGVsc2UgaWYgKCFlLmlzVHlwZShZLE8pICYmICFlLmJpbihZKSkge1xuICAgIHAud2lkdGggPSB7dmFsdWU6ICtlLmNvbmZpZyhcImJhbmRTaXplXCIpLCBvZmZzZXQ6IC0xfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaXNUeXBlKFksUXxUKSkge1xuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC5oZWlnaHQgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcC5oZWlnaHQgPSB7c2NhbGU6IFksIGJhbmQ6IHRydWUsIG9mZnNldDogLTF9O1xuICAgICAgcC5oZWlnaHQgPSB7dmFsdWU6ICtlLmNvbmZpZyhcImJhbmRTaXplXCIpLCBvZmZzZXQ6IC0xfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaXNUeXBlKFgsTykgJiYgIWUuYmluKFgpKSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6ICtlLmNvbmZpZyhcImJhbmRTaXplXCIpLCBvZmZzZXQ6IC0xfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS5jb25maWcoXCJjb2xvclwiKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBwb2ludF9wcm9wcyhlLCBvcHQpIHtcbiAgdmFyIHAgPSB7fTtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiBlLmNvbmZpZyhcImJhbmRTaXplXCIpLzJ9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuY29uZmlnKFwiYmFuZFNpemVcIikvMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS5jb25maWcoXCJwb2ludFNpemVcIil9O1xuICB9XG5cbiAgLy8gc2hhcGVcbiAgaWYgKGUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7c2NhbGU6IFNIQVBFLCBmaWVsZDogZS5maWVsZChTSEFQRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBlLmNvbmZpZyhcInBvaW50U2hhcGVcIil9O1xuICB9XG5cbiAgLy8gc3Ryb2tlXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLmNvbmZpZyhcImNvbG9yXCIpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9ZWxzZXtcbiAgICBwLm9wYWNpdHkgPSB7XG4gICAgICB2YWx1ZTogZS5jb25maWcoXCJvcGFjaXR5XCIpIHx8IGUuY29uZmlnKG9wdC5oYXNBZ2dyZWdhdGUgPyBcIl90aGlja09wYWNpdHlcIiA6IFwiX3RoaW5PcGFjaXR5XCIpXG4gICAgfTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKFwic3Ryb2tlV2lkdGhcIil9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBsaW5lX3Byb3BzKGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogMH07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHtncm91cDogXCJoZWlnaHRcIn07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUuY29uZmlnKFwiY29sb3JcIil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH1cblxuICBwLnN0cm9rZVdpZHRoID0ge3ZhbHVlOiBlLmNvbmZpZyhcInN0cm9rZVdpZHRoXCIpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXJlYV9wcm9wcyhlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc1R5cGUoWCxRfFQpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gICAgaWYgKCFlLmlzVHlwZShZLFF8VCkgJiYgZS5oYXMoWSkpIHtcbiAgICAgIHAueDIgPSB7c2NhbGU6IFgsIHZhbHVlOiAwfTtcbiAgICAgIHAub3JpZW50ID0ge3ZhbHVlOiBcImhvcml6b250YWxcIn07XG4gICAgfVxuICB9IGVsc2UgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaXNUeXBlKFksUXxUKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICAgIHAueTIgPSB7c2NhbGU6IFksIHZhbHVlOiAwfTtcbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIHAueSA9IHtncm91cDogXCJoZWlnaHRcIn07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS5jb25maWcoXCJjb2xvclwiKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBmaWxsZWRfcG9pbnRfcHJvcHMoc2hhcGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUsIG9wdCkge1xuICAgIHZhciBwID0ge307XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5jb25maWcoXCJiYW5kU2l6ZVwiKS8yfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKGUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3ZhbHVlOiBlLmNvbmZpZyhcImJhbmRTaXplXCIpLzJ9O1xuICAgIH1cblxuICAgIC8vIHNpemVcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgICBwLnNpemUgPSB7dmFsdWU6IGUuY29uZmlnKFwicG9pbnRTaXplXCIpfTtcbiAgICB9XG5cbiAgICAvLyBzaGFwZVxuICAgIHAuc2hhcGUgPSB7dmFsdWU6IHNoYXBlfTtcblxuICAgIC8vIGZpbGxcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLmNvbmZpZyhcImNvbG9yXCIpfTtcbiAgICB9XG5cbiAgICAvLyBhbHBoYVxuICAgIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gICAgfWVsc2Uge1xuICAgICAgcC5vcGFjaXR5ID0ge1xuICAgICAgICB2YWx1ZTogZS5jb25maWcoXCJvcGFjaXR5XCIpIHx8IGUuY29uZmlnKG9wdC5oYXNBZ2dyZWdhdGUgPyBcIl90aGlja09wYWNpdHlcIiA6IFwiX3RoaW5PcGFjaXR5XCIpXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogZS5jb25maWcoXCJiYW5kU2l6ZVwiKS8yfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmNvbmZpZyhcImJhbmRTaXplXCIpLzJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC5mb250U2l6ZSA9IHt2YWx1ZTogZS5jb25maWcoXCJmb250U2l6ZVwiKX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUuY29uZmlnKFwidGV4dENvbG9yXCIpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9XG5cbiAgLy8gdGV4dFxuICBpZiAoZS5oYXMoVEVYVCkpIHtcbiAgICBwLnRleHQgPSB7ZmllbGQ6IGUuZmllbGQoVEVYVCl9O1xuICB9IGVsc2Uge1xuICAgIHAudGV4dCA9IHt2YWx1ZTogXCJBYmNcIn07XG4gIH1cblxuICBwLmZvbnQgPSB7dmFsdWU6IGUuY29uZmlnKFwiZm9udFwiKX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZS5jb25maWcoXCJmb250V2VpZ2h0XCIpfTtcbiAgcC5mb250U3R5bGUgPSB7dmFsdWU6IGUuY29uZmlnKFwiZm9udFN0eWxlXCIpfTtcbiAgcC5iYXNlbGluZSA9IHt2YWx1ZTogZS5jb25maWcoXCJ0ZXh0QmFzZWxpbmVcIil9O1xuXG4gIC8vIGFsaWduXG4gIGlmIChlLmhhcyhYKSkge1xuICAgIGlmIChlLmlzVHlwZShYLE8pKSB7XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiBcImxlZnRcIn07XG4gICAgICBwLmR4ID0ge3ZhbHVlOiBlLmNvbmZpZyhcInRleHRNYXJnaW5cIil9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiBcImNlbnRlclwifVxuICAgIH1cbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkge1xuICAgIHAuYWxpZ24gPSB7dmFsdWU6IFwibGVmdFwifTtcbiAgICBwLmR4ID0ge3ZhbHVlOiBlLmNvbmZpZyhcInRleHRNYXJnaW5cIil9O1xuICB9IGVsc2Uge1xuICAgIHAuYWxpZ24gPSB7dmFsdWU6IGUuY29uZmlnKFwidGV4dEFsaWduXCIpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufSIsInZhciBnbG9iYWxzID0gcmVxdWlyZShcIi4vZ2xvYmFsc1wiKSxcbiAgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbnZhciBzY2FsZSA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnNjYWxlLm5hbWVzID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufVxuXG5zY2FsZS5kZWZzID0gZnVuY3Rpb24gKG5hbWVzLCBlbmNvZGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICB2YXIgcyA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB0eXBlOiBzY2FsZV90eXBlKG5hbWUsIGVuY29kaW5nKSxcbiAgICAgIGRvbWFpbjogc2NhbGVfZG9tYWluKG5hbWUsIGVuY29kaW5nLCBvcHQpXG4gICAgfTtcbiAgICBpZiAocy50eXBlID09PSBcIm9yZGluYWxcIiAmJiAhZW5jb2RpbmcuYmluKG5hbWUpKSB7XG4gICAgICBzLnNvcnQgPSB0cnVlO1xuICAgIH1cblxuICAgIHNjYWxlX3JhbmdlKHMsIGVuY29kaW5nLCBvcHQpO1xuXG4gICAgcmV0dXJuIChhLnB1c2gocyksIGEpO1xuICB9LCBbXSk7XG59XG5cbmZ1bmN0aW9uIHNjYWxlX3R5cGUobmFtZSwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChlbmNvZGluZy50eXBlKG5hbWUpKSB7XG4gICAgY2FzZSBPOiByZXR1cm4gXCJvcmRpbmFsXCI7XG4gICAgY2FzZSBUOlxuICAgICAgaWYgKGVuY29kaW5nLmZuKG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBcImxpbmVhclwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidGltZVwiO1xuICAgIGNhc2UgUTpcbiAgICAgIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIFwib3JkaW5hbFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVuY29kaW5nLnNjYWxlKG5hbWUpLnR5cGUgfHwgXCJsaW5lYXJcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiBzY2FsZV9kb21haW4obmFtZSwgZW5jb2RpbmcsIG9wdCkge1xuICBpZiAoZW5jb2RpbmcudHlwZShuYW1lKSA9PT0gVCl7XG4gICAgc3dpdGNoKGVuY29kaW5nLmZuKG5hbWUpKXtcbiAgICAgIGNhc2UgXCJzZWNvbmRcIjpcbiAgICAgIGNhc2UgXCJtaW51dGVcIjogcmV0dXJuIFswLCA1OV07XG4gICAgICBjYXNlIFwiaG91clwiOiByZXR1cm4gWzAsIDIzXTtcbiAgICAgIGNhc2UgXCJkYXlcIjogcmV0dXJuIFswLCA2XTtcbiAgICAgIGNhc2UgXCJkYXRlXCI6IHJldHVybiBbMSwgMzFdO1xuICAgICAgY2FzZSBcIm1vbnRoXCI6IHJldHVybiBbMCwgMTFdO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAvLyBUT0RPOiBhZGQgaW5jbHVkZUVtcHR5Q29uZmlnIGhlcmVcbiAgICBpZiAob3B0LnN0YXRzKSB7XG4gICAgICB2YXIgYmlucyA9IHV0aWwuZ2V0YmlucyhvcHQuc3RhdHNbZW5jb2RpbmcuZmllbGROYW1lKG5hbWUpXSk7XG4gICAgICB2YXIgZG9tYWluID0gdXRpbC5yYW5nZShiaW5zLnN0YXJ0LCBiaW5zLnN0b3AsIGJpbnMuc3RlcCk7XG4gICAgICByZXR1cm4gbmFtZT09PVkgPyBkb21haW4ucmV2ZXJzZSgpIDogZG9tYWluO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lID09IG9wdC5zdGFjayA/XG4gICAge1xuICAgICAgZGF0YTogU1RBQ0tFRCxcbiAgICAgIGZpZWxkOiBcImRhdGEuXCIgKyAob3B0LmZhY2V0ID8gXCJtYXhfXCIgOlwiXCIpICsgXCJzdW1fXCIgKyBlbmNvZGluZy5maWVsZChuYW1lLCB0cnVlKVxuICAgIH06XG4gICAge2RhdGE6IFRBQkxFLCBmaWVsZDogZW5jb2RpbmcuZmllbGQobmFtZSl9O1xufVxuXG5mdW5jdGlvbiBzY2FsZV9yYW5nZShzLCBlbmNvZGluZywgb3B0KSB7XG4gIHZhciBzcGVjID0gZW5jb2Rpbmcuc2NhbGUocy5uYW1lKTtcbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFg6XG4gICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSwgTykgfHwgZW5jb2RpbmcuYmluKHMubmFtZSkpIHtcbiAgICAgICAgcy5iYW5kV2lkdGggPSArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gb3B0LmNlbGxXaWR0aCA/IFswLCBvcHQuY2VsbFdpZHRoXSA6IFwid2lkdGhcIjtcbiAgICAgICAgLy9UT0RPIHplcm8gYW5kIHJldmVyc2Ugc2hvdWxkIGJlY29tZSBnZW5lcmljLCBhbmQgd2UganVzdCByZWFkIGRlZmF1bHQgZnJvbSBlaXRoZXIgdGhlIHNjaGVtYSBvciB0aGUgc2NoZW1hIGdlbmVyYXRvclxuICAgICAgICBzLnplcm8gPSBzcGVjLnplcm8gfHwgZW5jb2RpbmcuY29uZmlnKFwiX3haZXJvXCIpO1xuICAgICAgICBzLnJldmVyc2UgPSBzcGVjLnJldmVyc2UgfHwgZW5jb2RpbmcuY29uZmlnKFwiX3hSZXZlcnNlXCIpO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSwgVCkpe1xuICAgICAgICBzLm5pY2UgPSBlbmNvZGluZy5hZ2dyKHMubmFtZSkgfHwgZW5jb2RpbmcuY29uZmlnKFwidGltZVNjYWxlTmljZVwiKTtcbiAgICAgIH1lbHNle1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsIE8pIHx8IGVuY29kaW5nLmJpbihzLm5hbWUpKSB7XG4gICAgICAgIHMuYmFuZFdpZHRoID0gK2VuY29kaW5nLmNvbmZpZyhcImJhbmRTaXplXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IG9wdC5jZWxsSGVpZ2h0ID8gW29wdC5jZWxsSGVpZ2h0LCAwXSA6IFwiaGVpZ2h0XCI7XG4gICAgICAgIC8vVE9ETyB6ZXJvIGFuZCByZXZlcnNlIHNob3VsZCBiZWNvbWUgZ2VuZXJpYywgYW5kIHdlIGp1c3QgcmVhZCBkZWZhdWx0IGZyb20gZWl0aGVyIHRoZSBzY2hlbWEgb3IgdGhlIHNjaGVtYSBnZW5lcmF0b3JcbiAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvIHx8IGVuY29kaW5nLmNvbmZpZyhcIl95WmVyb1wiKTtcbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlIHx8IGVuY29kaW5nLmNvbmZpZyhcIl95UmV2ZXJzZVwiKTtcbiAgICAgIH1cblxuICAgICAgcy5yb3VuZCA9IHRydWU7XG5cbiAgICAgIGlmIChlbmNvZGluZy5pc1R5cGUocy5uYW1lLCBUKSl7XG4gICAgICAgIHMubmljZSA9IGVuY29kaW5nLmFnZ3Iocy5uYW1lKTtcbiAgICAgIH1lbHNle1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBST1c6XG4gICAgICBzLmJhbmRXaWR0aCA9IG9wdC5jZWxsSGVpZ2h0IHx8IGVuY29kaW5nLmNvbmZpZyhcImNlbGxIZWlnaHRcIik7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTDpcbiAgICAgIHMuYmFuZFdpZHRoID0gb3B0LmNlbGxXaWR0aCB8fCBlbmNvZGluZy5jb25maWcoXCJjZWxsV2lkdGhcIik7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNJWkU6XG4gICAgICBpZiAoZW5jb2RpbmcuaXMoXCJiYXJcIikpIHtcbiAgICAgICAgcy5yYW5nZSA9IFszLCArZW5jb2RpbmcuY29uZmlnKFwiYmFuZFNpemVcIildO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy5pcyhURVhUKSkge1xuICAgICAgICBzLnJhbmdlID0gWzgsIDQwXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMucmFuZ2UgPSBbMTAsIDEwMDBdO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICBzLnJhbmdlID0gXCJzaGFwZXNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MT1I6XG4gICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSwgTykpIHtcbiAgICAgICAgcy5yYW5nZSA9IFwiY2F0ZWdvcnkxMFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IFtcIiNkZGZcIiwgXCJzdGVlbGJsdWVcIl07XG4gICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBTFBIQTpcbiAgICAgIHMucmFuZ2UgPSBbMC4yLCAxLjBdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gZW5jb2RpbmcgbmFtZTogXCIrcy5uYW1lKTtcbiAgfVxuXG4gIHN3aXRjaChzLm5hbWUpe1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MOlxuICAgICAgcy5wYWRkaW5nID0gZW5jb2RpbmcuY29uZmlnKFwiY2VsbFBhZGRpbmdcIik7XG4gICAgICBzLm91dGVyUGFkZGluZyA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsIE8pIHx8IGVuY29kaW5nLmJpbihzLm5hbWUpICkgeyAvLyYmICFzLmJhbmRXaWR0aFxuICAgICAgICBzLnBvaW50cyA9IHRydWU7XG4gICAgICAgIHMucGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZyhcImJhbmRQYWRkaW5nXCIpO1xuICAgICAgfVxuICB9XG59IiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhbGl0ZSBTcGVjaWZpY2F0aW9uJ3MganNvbiBzY2hlbWFcbi8vXG52YXIgc2NoZW1hID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5zY2hlbWEudXRpbCA9IHJlcXVpcmUoJy4vc2NoZW1hdXRpbCcpO1xuXG5zY2hlbWEubWFya3R5cGUgPSB7XG4gIHR5cGU6IFwic3RyaW5nXCIsXG4gIGVudW06IFtcInBvaW50XCIsIFwiYmFyXCIsIFwibGluZVwiLCBcImFyZWFcIiwgXCJjaXJjbGVcIiwgXCJzcXVhcmVcIiwgXCJ0ZXh0XCJdXG59O1xuXG5zY2hlbWEuYWdnciA9IHtcbiAgdHlwZTogXCJzdHJpbmdcIixcbiAgZW51bTogW1wiYXZnXCIsIFwic3VtXCIsIFwibWluXCIsIFwibWF4XCIsIFwiY291bnRcIl0sXG4gIHN1cHBvcnRlZEVudW1zOiB7XG4gICAgUTogW1wiYXZnXCIsIFwic3VtXCIsIFwibWluXCIsIFwibWF4XCIsIFwiY291bnRcIl0sXG4gICAgTzogW1wiY291bnRcIl0sXG4gICAgVDogW1wiYXZnXCIsIFwibWluXCIsIFwibWF4XCIsIFwiY291bnRcIl0sXG4gICAgXCJcIjogW1wiY291bnRcIl0sXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB7XCJRXCI6IHRydWUsIFwiT1wiOiB0cnVlLCBcIlRcIjogdHJ1ZSwgXCJcIjogdHJ1ZX1cbn07XG5cbnNjaGVtYS50aW1lZm5zID0gW1wibW9udGhcIiwgXCJ5ZWFyXCIsIFwiZGF5XCIsIFwiZGF0ZVwiLCBcImhvdXJcIiwgXCJtaW51dGVcIiwgXCJzZWNvbmRcIl07XG5cbnNjaGVtYS5mbiA9IHtcbiAgdHlwZTogXCJzdHJpbmdcIixcbiAgZW51bTogc2NoZW1hLnRpbWVmbnMsXG4gIHN1cHBvcnRlZFR5cGVzOiB7XCJUXCI6IHRydWV9XG59XG5cbi8vVE9ETyhrYW5pdHcpOiBhZGQgb3RoZXIgdHlwZSBvZiBmdW5jdGlvbiBoZXJlXG5cbnNjaGVtYS5zY2FsZV90eXBlID0ge1xuICB0eXBlOiBcInN0cmluZ1wiLFxuICBlbnVtOiBbXCJsaW5lYXJcIiwgXCJsb2dcIixcInBvd1wiLCBcInNxcnRcIiwgXCJxdWFudGlsZVwiXSxcbiAgZGVmYXVsdDogXCJsaW5lYXJcIixcbiAgc3VwcG9ydGVkVHlwZXM6IHtcIlFcIjogdHJ1ZX1cbn07XG5cbnNjaGVtYS5maWVsZCA9IHtcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcmVxdWlyZWQ6IFtcIm5hbWVcIiwgXCJ0eXBlXCJdLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIH1cbiAgfVxufTtcblxudmFyIGNsb25lID0gdXRpbC5kdXBsaWNhdGU7XG52YXIgbWVyZ2UgPSBzY2hlbWEudXRpbC5tZXJnZTtcblxudmFyIHR5cGljYWxGaWVsZCA9IG1lcmdlKGNsb25lKHNjaGVtYS5maWVsZCksIHtcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBlbnVtOiBbXCJPXCIsIFwiUVwiLCBcIlRcIl1cbiAgICB9LFxuICAgIGJpbjoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB7XCJRXCI6IHRydWUsIFwiT1wiOiB0cnVlfVxuICAgIH0sXG4gICAgYWdncjogc2NoZW1hLmFnZ3IsXG4gICAgZm46IHNjaGVtYS5mbixcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHlwZTogc2NoZW1hLnNjYWxlX3R5cGUsXG4gICAgICAgIHJldmVyc2U6IHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHQ6IGZhbHNlIH0sXG4gICAgICAgIHplcm86IHtcbiAgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJJbmNsdWRlIHplcm9cIixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczoge1wiUVwiOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICBuaWNlOiB7XG4gICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICBlbnVtOiBbXCJzZWNvbmRcIiwgXCJtaW51dGVcIiwgXCJob3VyXCIsIFwiZGF5XCIsIFwid2Vla1wiLCBcIm1vbnRoXCIsIFwieWVhclwiXSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczoge1wiVFwiOiB0cnVlfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxudmFyIG9ubHlPcmRpbmFsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6IFwib2JqZWN0XCIsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZW51bTogW1wiT1wiXVxuICAgIH0sXG4gICAgYmluOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIk9cIjogdHJ1ZX1cbiAgICB9LFxuICAgIGFnZ3I6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBlbnVtOiBbXCJjb3VudFwiXSxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB7XCJPXCI6IHRydWV9XG4gICAgfVxuICB9XG59KTtcblxudmFyIGF4aXNNaXhpbiA9IHtcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcHJvcGVydGllczoge1xuICAgIGF4aXM6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdyaWQ6IHsgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHQ6IGZhbHNlIH0sXG4gICAgICAgIHRpdGxlOiB7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudmFyIGxlZ2VuZE1peGluID0ge1xuICB0eXBlOiBcIm9iamVjdFwiLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiB7IHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH1cbiAgfVxufVxuXG52YXIgdGV4dE1peGluID0ge1xuICB0eXBlOiBcIm9iamVjdFwiLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdGV4dDoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgd2VpZ2h0OiB7XG4gICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICBlbnVtOiBbXCJub3JtYWxcIiwgXCJib2xkXCJdLFxuICAgICAgICAgIGRlZmF1bHQ6IFwibm9ybWFsXCIsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIlRcIjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHtcIlRcIjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgZm9udDoge1xuICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgZGVmYXVsdDogXCJIYWx2ZXRpY2EgTmV1ZVwiLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7XCJUXCI6IHRydWV9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudmFyIHggPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCBheGlzTWl4aW4pO1xudmFyIHkgPSBjbG9uZSh4KTtcblxudmFyIHJvdyA9IGNsb25lKG9ubHlPcmRpbmFsRmllbGQpO1xudmFyIGNvbCA9IGNsb25lKHJvdyk7XG5cbnZhciBzaXplID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwgbGVnZW5kTWl4aW4pO1xudmFyIGNvbG9yID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwgbGVnZW5kTWl4aW4pO1xudmFyIGFscGhhID0gY2xvbmUodHlwaWNhbEZpZWxkKTtcbnZhciBzaGFwZSA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBsZWdlbmRNaXhpbik7XG5cbnZhciB0ZXh0ID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwgdGV4dE1peGluKTtcblxudmFyIGNmZyA9IHtcbiAgdHlwZTogXCJvYmplY3RcIixcbiAgcHJvcGVydGllczoge1xuICAgIC8vIHRlbXBsYXRlXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogW1wiaW50ZWdlclwiXVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgX21pbldpZHRoOiB7XG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIGRlZmF1bHQ6IDIwXG4gICAgfSxcbiAgICBfbWluSGVpZ2h0OiB7XG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIGRlZmF1bHQ6IDIwXG4gICAgfSxcblxuICAgIC8vIGRhdGEgc291cmNlXG4gICAgZGF0YUZvcm1hdFR5cGU6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBlbnVtOiBbXCJqc29uXCIsIFwiY3N2XCJdLFxuICAgICAgZGVmYXVsdDogXCJqc29uXCJcbiAgICB9LFxuICAgIHVzZVZlZ2FTZXJ2ZXI6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGRhdGFVcmw6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZlZ2FTZXJ2ZXJUYWJsZToge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmVnYVNlcnZlclVybDoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxXCJcbiAgICB9XG4gIH1cbn1cblxuLyoqIEB0eXBlIE9iamVjdCBTY2hlbWEgb2YgYSB2ZWdhbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5zY2hlbWEuc2NoZW1hID0ge1xuICAkc2NoZW1hOiBcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hI1wiLFxuICB0eXBlOiBcIm9iamVjdFwiLFxuICByZXF1aXJlZDogW1wibWFya3R5cGVcIiwgXCJlbmNcIiwgXCJjZmdcIl0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBtYXJrdHlwZTogc2NoZW1hLm1hcmt0eXBlLFxuICAgIGVuYzoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeSxcbiAgICAgICAgcm93OiByb3csXG4gICAgICAgIGNvbDogY29sLFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgc2hhcGU6IHNoYXBlLFxuICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICB9XG4gICAgfSxcbiAgICBjZmc6IGNmZ1xuICB9XG59O1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5zY2hlbWEuaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gc2NoZW1hLnV0aWwuaW5zdGFudGlhdGUoc2NoZW1hLnNjaGVtYSk7XG59XG4iLCJ2YXIgdXRpbCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciBpc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMFxufVxuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxudXRpbC5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKHNjaGVtYSwgcmVxdWlyZWQpIHtcbiAgaWYgKHNjaGVtYS50eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHNjaGVtYS5yZXF1aXJlZCA9IHNjaGVtYS5yZXF1aXJlZCA/IHNjaGVtYS5yZXF1aXJlZCA6IFtdO1xuICAgIHZhciBpbnN0YW5jZSA9IHt9O1xuICAgIGZvciAodmFyIG5hbWUgaW4gc2NoZW1hLnByb3BlcnRpZXMpIHtcbiAgICAgIHZhciBjaGlsZCA9IHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVdO1xuICAgICAgaW5zdGFuY2VbbmFtZV0gPSB1dGlsLmluc3RhbnRpYXRlKGNoaWxkLCBzY2hlbWEucmVxdWlyZWQuaW5kZXhPZihuYW1lKSAhPSAtMSk7XG4gICAgfTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSBpZiAoJ2RlZmF1bHQnIGluIHNjaGVtYSkge1xuICAgIHJldHVybiBzY2hlbWEuZGVmYXVsdDtcbiAgfSBlbHNlIGlmIChzY2hlbWEuZW51bSAmJiByZXF1aXJlZCkge1xuICAgIHJldHVybiBzY2hlbWEuZW51bVswXTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuLy8gcmVtb3ZlIGFsbCBkZWZhdWx0cyBmcm9tIGFuIGluc3RhbmNlXG51dGlsLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihkZWZhdWx0cywgaW5zdGFuY2UpIHtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIGlmICghZGVmYXVsdHMgfHwgZGVmYXVsdHNbcHJvcF0gIT09IGluc3RhbmNlW3Byb3BdKSB7XG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlW3Byb3BdID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdmFyIGMgPSB1dGlsLmRpZmZlcmVuY2UoZGVmYXVsdHNbcHJvcF0sIGluc3RhbmNlW3Byb3BdKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGMpKVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGluc3RhbmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2hhbmdlcztcbn07XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBpbnN0YW5jZSBpbnRvIGRlZmF1bHRzXG51dGlsLm1lcmdlID0gZnVuY3Rpb24gKGRlZmF1bHRzLCBpbnN0YW5jZSkge1xuICBpZiAodHlwZW9mIGluc3RhbmNlIT09J29iamVjdCcgfHwgaW5zdGFuY2U9PT1udWxsKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRzO1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBpbnN0YW5jZSkge1xuICAgIGlmICghaW5zdGFuY2UuaGFzT3duUHJvcGVydHkocCkpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAoaW5zdGFuY2VbcF09PT11bmRlZmluZWQgKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBpbnN0YW5jZVtwXSAhPT0gJ29iamVjdCcgfHwgaW5zdGFuY2VbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzW3BdID0gaW5zdGFuY2VbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmYXVsdHNbcF0gIT09ICdvYmplY3QnIHx8IGRlZmF1bHRzW3BdID09PSBudWxsKSB7XG4gICAgICBkZWZhdWx0c1twXSA9IHV0aWwubWVyZ2UoaW5zdGFuY2VbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ID8gW10gOiB7fSwgaW5zdGFuY2VbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB1dGlsLm1lcmdlKGRlZmF1bHRzW3BdLCBpbnN0YW5jZVtwXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWZhdWx0cztcbn1cbiIsInZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudXRpbC5rZXlzID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgayA9IFtdLCB4O1xuICBmb3IgKHggaW4gb2JqKSBrLnB1c2goeCk7XG4gIHJldHVybiBrO1xufVxuXG51dGlsLnZhbHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciB2ID0gW10sIHg7XG4gIGZvciAoeCBpbiBvYmopIHYucHVzaChvYmpbeF0pO1xuICByZXR1cm4gdjtcbn1cblxudXRpbC5yYW5nZSA9IGZ1bmN0aW9uIChzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICBzdGVwID0gMTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKChzdG9wIC0gc3RhcnQpIC8gc3RlcCA9PSBJbmZpbml0eSkgdGhyb3cgbmV3IEVycm9yKFwiaW5maW5pdGUgcmFuZ2VcIik7XG4gIHZhciByYW5nZSA9IFtdLCBpID0gLTEsIGo7XG4gIGlmIChzdGVwIDwgMCkgd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA+IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIGVsc2Ugd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA8IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIHJldHVybiByYW5nZTtcbn1cblxudXRpbC5maW5kID0gZnVuY3Rpb24gKGxpc3QsIHBhdHRlcm4pIHtcbiAgdmFyIGwgPSBsaXN0LmZpbHRlcihmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHhbcGF0dGVybi5uYW1lXSA9PT0gcGF0dGVybi52YWx1ZTtcbiAgfSk7XG4gIHJldHVybiBsLmxlbmd0aCAmJiBsWzBdIHx8IG51bGw7XG59XG5cbnV0aWwudW5pcSA9IGZ1bmN0aW9uIChkYXRhLCBmaWVsZCkge1xuICB2YXIgbWFwID0ge30sIGNvdW50ID0gMCwgaSwgaztcbiAgZm9yIChpPTA7IGk8ZGF0YS5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBkYXRhW2ldW2ZpZWxkXTtcbiAgICBpZiAoIW1hcFtrXSkge1xuICAgICAgbWFwW2tdID0gMTtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3VudDtcbn1cblxudXRpbC5taW5tYXggPSBmdW5jdGlvbiAoZGF0YSwgZmllbGQpIHtcbiAgdmFyIHN0YXRzID0ge21pbjogK0luZmluaXR5LCBtYXg6IC1JbmZpbml0eX07XG4gIGZvciAoaT0wOyBpPGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgdiA9IGRhdGFbaV1bZmllbGRdO1xuICAgIGlmICh2ID4gc3RhdHMubWF4KSBzdGF0cy5tYXggPSB2O1xuICAgIGlmICh2IDwgc3RhdHMubWluKSBzdGF0cy5taW4gPSB2O1xuICB9XG4gIHJldHVybiBzdGF0cztcbn1cblxudXRpbC5kdXBsaWNhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudXRpbC5hbnkgPSBmdW5jdGlvbihhcnIsIGYpe1xuICB2YXIgaT0wLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYoZihhcnJba10sIGssIGkrKykpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxudXRpbC5hbGwgPSBmdW5jdGlvbihhcnIsIGYpe1xuICB2YXIgaT0wLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYoIWYoYXJyW2tdLCBrLCBpKyspKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnV0aWwubWVyZ2UgPSBmdW5jdGlvbihkZXN0LCBzcmMpe1xuICByZXR1cm4gdXRpbC5rZXlzKHNyYykucmVkdWNlKGZ1bmN0aW9uKGMsIGspe1xuICAgIGNba10gPSBzcmNba107XG4gICAgcmV0dXJuIGM7XG4gIH0sIGRlc3QpO1xufTtcblxudXRpbC5nZXRiaW5zID0gZnVuY3Rpb24gKHN0YXRzKSB7XG4gIHJldHVybiB2Zy5iaW5zKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBNQVhfQklOU1xuICB9KTtcbn1cblxuXG51dGlsLmVycm9yID0gZnVuY3Rpb24obXNnKXtcbiAgY29uc29sZS5lcnJvcihcIltWTCBFcnJvcl1cIiwgbXNnKTtcbn1cblxuIl19
