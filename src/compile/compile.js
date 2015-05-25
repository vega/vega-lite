'use strict';

var summary = module.exports = require('datalib/src/stats').summary;

require('../globals');

module.exports = compile;

var Encoding = require('../Encoding'),
  axis = compile.axis = require('./axis'),
  filter = compile.filter = require('./filter'),
  legend = compile.legend = require('./legend'),
  marks = compile.marks = require('./marks'),
  scale = compile.scale = require('./scale');

compile.aggregate = require('./aggregate');
compile.bin = require('./bin');
compile.facet = require('./facet');
compile.group = require('./group');
compile.layout = require('./layout');
compile.sort = require('./sort');
compile.stack = require('./stack');
compile.style = require('./style');
compile.subfacet = require('./subfacet');
compile.template = require('./template');
compile.time = require('./time');

function compile(spec, stats, theme) {
  return compile.encoding(Encoding.fromSpec(spec, theme), stats);
}

compile.shorthand = function (shorthand, stats, config, theme) {
  return compile.encoding(Encoding.fromShorthand(shorthand, config, theme), stats);
};

compile.encoding = function (encoding, stats) {
  // no need to pass stats if you pass in the data
  if (!stats && encoding.hasValues()) {
    stats = summary(encoding.data('values')).reduce(function(s, p) {
      s[p.field] = p;
      return s;
    }, {});
  }

  var layout = compile.layout(encoding, stats),
    style = compile.style(encoding, stats),
    spec = compile.template(encoding, layout, stats),
    group = spec.marks[0],
    mark = marks[encoding.marktype()],
    mdefs = marks.def(mark, encoding, layout, style),
    mdef = mdefs[0];  // TODO: remove this dirty hack by refactoring the whole flow

  filter.addFilters(spec, encoding);
  var sorting = compile.sort(spec, encoding, stats);

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  compile.bin(spec.data[1], encoding);

  var lineType = marks[encoding.marktype()].line;

  spec = compile.time(spec, encoding);

  // handle subfacets
  var aggResult = compile.aggregate(spec, encoding),
    details = aggResult.details,
    hasDetails = details && details.length > 0,
    stack = hasDetails && compile.stack(spec, encoding, mdef, aggResult.facets);

  if (hasDetails && (stack || lineType)) {
    //subfacet to group stack / line together in one group
    compile.subfacet(group, mdef, details, stack, encoding);
  }

  // auto-sort line/area values
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.field(f)}];
  }

  // Small Multiples
  if (hasRow || hasCol) {
    spec = compile.facet(group, encoding, layout, style, sorting, spec, mdef, stack, stats);
    spec.legends = legend.defs(encoding);
  } else {
    group.scales = scale.defs(scale.names(mdef.properties.update), encoding, layout, stats, style, sorting, {stack: stack});
    group.axes = axis.defs(axis.names(mdef.properties.update), encoding, layout, stats);
    group.legends = legend.defs(encoding);
  }

  filter.filterLessThanZero(spec, encoding);

  return spec;
};

