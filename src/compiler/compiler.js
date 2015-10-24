'use strict';

var summary = module.exports = require('datalib/src/stats').summary;

require('../globals');

/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
var compiler = module.exports = {};

var Encoding = require('../Encoding'),
  axis = compiler.axis = require('./axis'),
  legend = compiler.legend = require('./legend'),
  marks = compiler.marks = require('./marks'),
  scale = compiler.scale = require('./scale');

compiler.data = require('./data');
compiler.facet = require('./facet');
compiler.layout = require('./layout');
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

/**
 * Create a Vega specification from a Vega-lite Encoding object.
 */
compiler.compileEncoding = function (encoding, stats) {
  // no need to pass stats if you pass in the data
  if (!stats) {
    if (encoding.hasValues()) {
        stats = summary(encoding.data().values).reduce(function(s, p) {
        s[p.field] = p;
        return s;
      }, {});
    } else {
      console.error('No stats provided and data is not embedded.');
    }
  }

  var layout = compiler.layout(encoding, stats);

  var spec = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: compiler.data(encoding),
      // global scales contains only time unit scales
      scales: compiler.time.scales(encoding),
      marks: [{
        name: 'cell',
        type: 'group',
        properties: {
          enter: {
            width: layout.cellWidth ?
                     {value: layout.cellWidth} :
                     {field: {group: 'width'}},
            height: layout.cellHeight ?
                    {value: layout.cellHeight} :
                    {field: {group: 'height'}}
          }
        }
      }]
    };

  var group = spec.marks[0];

  // marks
  var style = compiler.style(encoding, stats),
    mdefs = group.marks = marks.def(encoding, layout, style, stats),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

  var stack = encoding.stack();
  if (stack) {
    // modify mdef.{from,properties}
    compiler.stack(encoding, mdef, stack);
  }

  var lineType = marks[encoding.marktype()].line;

  // handle subfacets
  var details = encoding.details();

  if (details.length > 0 && lineType) {
    //subfacet to group area / line together in one group
    compiler.subfacet(group, mdef, details);
  }

  // auto-sort line/area values
  if (lineType && encoding.config('autoSortLine')) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) {
      mdef.from = {};
    }
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.fieldRef(f)}];
  }

  // get a flattened list of all scale names that are used in the vl spec
  var singleScaleNames = [].concat.apply([], mdefs.map(function(markProps) {
    return scale.names(markProps.properties.update);
  }));

  // Small Multiples
  if (encoding.has(ROW) || encoding.has(COL)) {
    spec = compiler.facet(group, encoding, layout, spec, singleScaleNames, stats);
    spec.legends = legend.defs(encoding, style);
  } else {
    group.scales = scale.defs(singleScaleNames, encoding, layout, stats);
    group.axes = [];
    if (encoding.has(X)) {
      group.axes.push(axis.def(X, encoding, layout, stats));
    }
    if (encoding.has(Y)) {
      group.axes.push(axis.def(Y, encoding, layout, stats));
    }

    group.legends = legend.defs(encoding, style);
  }

  return spec;
};
