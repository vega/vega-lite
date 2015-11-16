/// <reference path="../../typings/d3-format.d.ts"/>

import * as d3_format from 'd3-format';
import {setter} from '../util';
import {Enctype, Type} from '../consts';
import Encoding from '../Encoding';

import * as time from './time';

export default function(encoding: Encoding, stats) {
  var layout = box(encoding, stats);
  layout = offset(encoding, stats, layout);
  return layout;
}

/*
  HACK to set chart size
  NOTE: this fails for plots driven by derived values (e.g., aggregates)
  One solution is to update Vega to support auto-sizing
  In the meantime, auto-padding (mostly) does the trick
 */
function box(encoding: Encoding, stats) {
  var hasRow = encoding.has(Enctype.ROW),
      hasCol = encoding.has(Enctype.COL),
      hasX = encoding.has(Enctype.X),
      hasY = encoding.has(Enctype.Y),
      marktype = encoding.marktype();

  // FIXME/HACK we need to take filter into account
  var xCardinality = hasX && encoding.isDimension(Enctype.X) ? encoding.cardinality(Enctype.X, stats) : 1,
    yCardinality = hasY && encoding.isDimension(Enctype.Y) ? encoding.cardinality(Enctype.Y, stats) : 1;

  var useSmallBand = xCardinality > encoding.config('largeBandMaxCardinality') ||
    yCardinality > encoding.config('largeBandMaxCardinality');

  var cellWidth, cellHeight, cellPadding = encoding.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (encoding.isOrdinalScale(Enctype.X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + encoding.padding(Enctype.X)) * encoding.bandWidth(Enctype.X, useSmallBand);
    } else {
      cellWidth = hasCol || hasRow ? encoding.encDef(Enctype.COL).width :  encoding.config('singleWidth');
    }
  } else {
    if (marktype === Enctype.TEXT) {
      cellWidth = encoding.config('textCellWidth');
    } else {
      cellWidth = encoding.bandWidth(Enctype.X);
    }
  }

  // set cellHeight
  if (hasY) {
    if (encoding.isOrdinalScale(Enctype.Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellHeight = (yCardinality + encoding.padding(Enctype.Y)) * encoding.bandWidth(Enctype.Y, useSmallBand);
    } else {
      cellHeight = hasCol || hasRow ? encoding.encDef(Enctype.ROW).height :  encoding.config('singleHeight');
    }
  } else {
    cellHeight = encoding.bandWidth(Enctype.Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = encoding.cardinality(Enctype.COL, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality =  encoding.cardinality(Enctype.ROW, stats);
    height = cellHeight * ((1 + cellPadding) * (rowCardinality - 1) + 1);
  }

  return {
    // width and height of the whole cell
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    cellPadding: cellPadding,
    // width and height of the chart
    width: width,
    height: height,
    // information about x and y, such as band size
    x: {useSmallBand: useSmallBand},
    y: {useSmallBand: useSmallBand}
  };
}

function getMaxNumberLength(encoding: Encoding, et, fieldStats) {
  var format = encoding.numberFormat(et);
  return d3_format.format(format)(fieldStats.max).length;
}

// TODO(#600) revise this
function getMaxLength(encoding: Encoding, stats, et) {
  var encDef = encoding.encDef(et),
    fieldStats = stats[encDef.name];

  if (encDef.bin) {
    // TODO once bin support range, need to update this
    return getMaxNumberLength(encoding, et, fieldStats);
  } if (encDef.type === Type.Quantitative) {
    return getMaxNumberLength(encoding, et, fieldStats);
  } else if (encDef.type === Type.Temporal) {
    return time.maxLength(encoding.encDef(et).timeUnit, encoding);
  } else if (encoding.isTypes(et, [Type.Nominal, Type.Ordinal])) {
    if(fieldStats.type === 'number') {
      return getMaxNumberLength(encoding, et, fieldStats);
    } else {
      return Math.min(fieldStats.max, encoding.axis(et).labelMaxLength || Infinity);
    }
  }
}

function offset(encoding: Encoding, stats, layout) {
  [Enctype.X, Enctype.Y].forEach(function (et) {
    // TODO(kanitw): Jul 19, 2015 - create a set of visual test for extraOffset
    let extraOffset = et === Enctype.X ? 20 : 22;
    let encDef = encoding.encDef(et);
    let maxLength;

    if (encoding.isDimension(et) || encDef.type === Type.Temporal) {
      maxLength = getMaxLength(encoding, stats, et);
    } else if (
      // TODO once we have #512 (allow using inferred type)
      // Need to adjust condition here.
      encDef.type === Type.Quantitative || encDef.aggregate === 'count'
    ) {
      if (
        et===Enctype.Y
        // || (et===X && false)
        // FIXME determine when X would rotate, but should move this to axis.js first #506
      ) {
        maxLength = getMaxLength(encoding, stats, et);
      }
    } else {
      // nothing
    }

    if (maxLength) {
      setter(layout,[et, 'axisTitleOffset'], encoding.config('characterWidth') *  maxLength + extraOffset);
    } else {
      // if no max length (no rotation case), use maxLength = 3
      setter(layout,[et, 'axisTitleOffset'], encoding.config('characterWidth') * 3 + extraOffset);
    }

  });
  return layout;
}
