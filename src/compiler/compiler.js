'use strict';

var summary = module.exports = require('datalib/src/stats').summary;

require('../globals');

var compiler = module.exports = {};

var Encoding = require('../Encoding'),
  axis = compiler.axis = require('./axis'),
  legend = compiler.legend = require('./legend'),
  marks = compiler.marks = require('./marks'),
  scale = compiler.scale = require('./scale');

compiler.data = require('./data');
compiler.facet = require('./facet');
compiler.group = require('./group');
compiler.layout = require('./layout');
compiler.sort = require('./sort');
compiler.stack = require('./stack');
compiler.style = require('./style');
compiler.subfacet = require('./subfacet');
compiler.time = require('./time');

compiler.compile = function (spec, stats, theme) {
  return compiler.compileEncoding(Encoding.fromSpec(spec, theme), stats);
};

compiler.shorthand = function (shorthand, stats, config, theme) {
  return compiler.compileEncoding(Encoding.fromShorthand(shorthand, config, theme), stats);
};


compiler.compileEncoding = function (encoding, stats) {
  // no need to pass stats if you pass in the data
  if (!stats && encoding.hasValues()) {
    stats = summary(encoding.data().values).reduce(function(s, p) {
      s[p.field] = p;
      return s;
    }, {});
  }

  var layout = compiler.layout(encoding, stats);

  var spec = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: compiler.data(encoding),
      // global scales contains only time unit scales
      scales: compiler.time.scales(encoding)
    };

  // FIXME remove compiler.sort after migrating to vega 2.
  spec.data = compiler.sort(spec.data, encoding, stats); // append new data

  // marks

  // TODO this line is temporary and should be refactored
  spec.marks = [compiler.group.def('cell', {
    width: layout.cellWidth ? {value: layout.cellWidth} : undefined,
    height: layout.cellHeight ? {value: layout.cellHeight} : undefined
  })];

  var style = compiler.style(encoding, stats),
    group = spec.marks[0],
    mdefs = marks.def(encoding, layout, style, stats),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  var lineType = marks[encoding.marktype()].line;

  // handle subfacets

  var details = encoding.details(),
    stack = encoding.isAggregate() && details.length > 0 && compiler.stack(spec.data, encoding, mdef); // modify spec.data, mdef.{from,properties}

  if (details.length > 0 && (stack || lineType)) {
    //subfacet to group stack / line together in one group
    compiler.subfacet(group, mdef, details, stack, encoding);
  }

  // auto-sort line/area values
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.fieldRef(f)}];
  }

  // get a flattened list of all scale names that are used in the vl spec
  var singleScaleNames = [].concat.apply([], mdefs.map(function(markProps) {
    return scale.names(markProps.properties.update);
  }));

  // Small Multiples
  if (encoding.has(ROW) || encoding.has(COL)) {
    spec = compiler.facet(group, encoding, layout, spec, singleScaleNames, stack, stats);
    spec.legends = legend.defs(encoding, style);
  } else {
    group.scales = scale.defs(singleScaleNames, encoding, layout, stats, {stack: stack});

    group.axes = [];
    if (encoding.has(X)) group.axes.push(axis.def(X, encoding, layout, stats));
    if (encoding.has(Y)) group.axes.push(axis.def(Y, encoding, layout, stats));

    group.legends = legend.defs(encoding, style);
  }



  return spec;
};

