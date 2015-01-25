var globals = require('../globals'),
  util = require('../util');


module.exports = compile;

var axis      = compile.axis        = require('./axis'),
  legends     = compile.legends     = require('./legends'),
  marks       = compile.marks       = require('./marks'),
  scale       = compile.scale       = require('./scale'),
  time        = compile.time        = require('./time'),
  aggregates  = compile.aggregates  = require('.aggregates');


function compile (encoding, stats) {
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
    spec = time(spec, encoding);
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
}

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
