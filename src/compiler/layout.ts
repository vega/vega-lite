/// <reference path="../../typings/d3-format.d.ts"/>

import {FieldDef} from '../schema/fielddef.schema';

import * as d3_format from 'd3-format';
import {setter} from '../util';
import {COLUMN, ROW, X, Y, TEXT, Channel} from '../channel';
import {Model} from './Model';
import * as time from './time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';

export default function(model: Model, stats) {
  var layout = box(model, stats);
  layout = offset(model, stats, layout);
  return layout;
}

/*
  HACK to set chart size
  NOTE: this fails for plots driven by derived values (e.g., aggregates)
  One solution is to update Vega to support auto-sizing
  In the meantime, auto-padding (mostly) does the trick
 */
function box(model: Model, stats) {
  var hasRow = model.has(ROW),
      hasCol = model.has(COLUMN),
      hasX = model.has(X),
      hasY = model.has(Y),
      marktype = model.marktype();

  // FIXME/HACK we need to take filter into account
  var xCardinality = hasX && model.isDimension(X) ? model.cardinality(X, stats) : 1,
    yCardinality = hasY && model.isDimension(Y) ? model.cardinality(Y, stats) : 1;

  var useSmallBand = xCardinality > model.config('largeBandMaxCardinality') ||
    yCardinality > model.config('largeBandMaxCardinality');

  var cellWidth, cellHeight, cellPadding = model.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (model.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + model.padding(X)) * model.bandWidth(X, useSmallBand);
    } else {
      cellWidth = hasCol || hasRow ? model.fieldDef(COLUMN).width :  model.config('singleWidth');
    }
  } else {
    if (marktype === TEXT) {
      cellWidth = model.config('textCellWidth');
    } else {
      cellWidth = model.bandWidth(X);
    }
  }

  // set cellHeight
  if (hasY) {
    if (model.isOrdinalScale(Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellHeight = (yCardinality + model.padding(Y)) * model.bandWidth(Y, useSmallBand);
    } else {
      cellHeight = hasCol || hasRow ? model.fieldDef(ROW).height :  model.config('singleHeight');
    }
  } else {
    cellHeight = model.bandWidth(Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = model.cardinality(COLUMN, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality =  model.cardinality(ROW, stats);
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

function getMaxNumberLength(model: Model, channel: Channel, fieldStats) {
  var format = model.numberFormat(channel);
  return d3_format.format(format)(fieldStats.max).length;
}

// TODO(#600) revise this
function getMaxLength(model: Model, stats, channel: Channel) {
  var fieldDef: FieldDef = model.fieldDef(channel),
    fieldStats = stats[fieldDef.field];

  if (fieldDef.bin) {
    // TODO once bin support range, need to update this
    return getMaxNumberLength(model, channel, fieldStats);
  } if (fieldDef.type === QUANTITATIVE) {
    return getMaxNumberLength(model, channel, fieldStats);
  } else if (fieldDef.type === TEMPORAL) {
    return time.maxLength(model.fieldDef(channel).timeUnit, model);
  } else if (model.isTypes(channel, [NOMINAL, ORDINAL])) {
    if(fieldStats.type === 'number') {
      return getMaxNumberLength(model, channel, fieldStats);
    } else {
      return Math.min(fieldStats.max, model.axis(channel).labelMaxLength || Infinity);
    }
  }
}

function offset(model: Model, stats, layout) {
  [X, Y].forEach(function (channel) {
    // TODO(kanitw): Jul 19, 2015 - create a set of visual test for extraOffset
    let extraOffset = channel === X ? 20 : 22;
    let fieldDef = model.fieldDef(channel);
    let maxLength;

    if (model.isDimension(channel) || fieldDef.type === TEMPORAL) {
      maxLength = getMaxLength(model, stats, channel);
    } else if (
      // TODO once we have #512 (allow using inferred type)
      // Need to adjust condition here.
      fieldDef.type === QUANTITATIVE || fieldDef.aggregate === 'count'
    ) {
      if (
        channel===Y
        // || (channel===X && false)
        // FIXME determine when X would rotate, but should move this to axis.js first #506
      ) {
        maxLength = getMaxLength(model, stats, channel);
      }
    } else {
      // nothing
    }

    if (maxLength) {
      setter(layout,[channel, 'axisTitleOffset'], model.config('characterWidth') *  maxLength + extraOffset);
    } else {
      // if no max length (no rotation case), use maxLength = 3
      setter(layout,[channel, 'axisTitleOffset'], model.config('characterWidth') * 3 + extraOffset);
    }

  });
  return layout;
}
