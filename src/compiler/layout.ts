/// <reference path="../../typings/d3-format.d.ts"/>

import * as d3_format from 'd3-format';
import {setter} from '../util';
import {Type} from '../consts';
import {COL, ROW, X, Y, TEXT} from '../channel';
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
  var hasRow = encoding.has(ROW),
      hasCol = encoding.has(COL),
      hasX = encoding.has(X),
      hasY = encoding.has(Y),
      marktype = encoding.marktype();

  // FIXME/HACK we need to take filter into account
  var xCardinality = hasX && encoding.isDimension(X) ? encoding.cardinality(X, stats) : 1,
    yCardinality = hasY && encoding.isDimension(Y) ? encoding.cardinality(Y, stats) : 1;

  var useSmallBand = xCardinality > encoding.config('largeBandMaxCardinality') ||
    yCardinality > encoding.config('largeBandMaxCardinality');

  var cellWidth, cellHeight, cellPadding = encoding.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (encoding.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + encoding.padding(X)) * encoding.bandWidth(X, useSmallBand);
    } else {
      cellWidth = hasCol || hasRow ? encoding.fieldDef(COL).width :  encoding.config('singleWidth');
    }
  } else {
    if (marktype === TEXT) {
      cellWidth = encoding.config('textCellWidth');
    } else {
      cellWidth = encoding.bandWidth(X);
    }
  }

  // set cellHeight
  if (hasY) {
    if (encoding.isOrdinalScale(Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellHeight = (yCardinality + encoding.padding(Y)) * encoding.bandWidth(Y, useSmallBand);
    } else {
      cellHeight = hasCol || hasRow ? encoding.fieldDef(ROW).height :  encoding.config('singleHeight');
    }
  } else {
    cellHeight = encoding.bandWidth(Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = encoding.cardinality(COL, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality =  encoding.cardinality(ROW, stats);
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
  var fieldDef = encoding.fieldDef(et),
    fieldStats = stats[fieldDef.name];

  if (fieldDef.bin) {
    // TODO once bin support range, need to update this
    return getMaxNumberLength(encoding, et, fieldStats);
  } if (fieldDef.type === Type.QUANTITATIVE) {
    return getMaxNumberLength(encoding, et, fieldStats);
  } else if (fieldDef.type === Type.TEMPORAL) {
    return time.maxLength(encoding.fieldDef(et).timeUnit, encoding);
  } else if (encoding.isTypes(et, [Type.NOMINAL, Type.ORDINAL])) {
    if(fieldStats.type === 'number') {
      return getMaxNumberLength(encoding, et, fieldStats);
    } else {
      return Math.min(fieldStats.max, encoding.axis(et).labelMaxLength || Infinity);
    }
  }
}

function offset(encoding: Encoding, stats, layout) {
  [X, Y].forEach(function (et) {
    // TODO(kanitw): Jul 19, 2015 - create a set of visual test for extraOffset
    let extraOffset = et === X ? 20 : 22;
    let fieldDef = encoding.fieldDef(et);
    let maxLength;

    if (encoding.isDimension(et) || fieldDef.type === Type.TEMPORAL) {
      maxLength = getMaxLength(encoding, stats, et);
    } else if (
      // TODO once we have #512 (allow using inferred type)
      // Need to adjust condition here.
      fieldDef.type === Type.QUANTITATIVE || fieldDef.aggregate === 'count'
    ) {
      if (
        et===Y
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
