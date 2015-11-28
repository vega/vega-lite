/// <reference path="../../typings/d3-format.d.ts"/>

import {FieldDef} from '../schema/fielddef.schema';

import {setter} from '../util';
import {COLUMN, ROW, X, Y, TEXT, Channel} from '../channel';
import {STATS} from '../data';
import {Model} from './Model';
import * as time from './time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {roundFloat} from '../util';

interface DataRef {
  data?: string;
  field?: string;
  value?: string;
}

type LayoutValue = number | DataRef;

export function compileLayout(model: Model) {
  const cellWidth = getCellWidth(model);
  const cellHeight = getCellHeight(model);
  return {
    // width and height of the whole cell
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    // width and height of the chart
    width: getWidth(model, cellWidth),
    height: getHeight(model, cellHeight)
  };
}

function getCellWidth(model: Model): LayoutValue {
  if (model.has(X)) {
    if (model.isOrdinalScale(X)) { // calculate in data
      return {data: STATS, field: 'cellWidth'};
    }
    return model.config(model.isFacet() ? 'cellWidth' : 'singleWidth');
  }
  if (model.marktype() === TEXT) {
    return model.config('textCellWidth');
  }
  return model.bandWidth(X);
}

function getWidth(model: Model, cellWidth: LayoutValue): LayoutValue {
  if (model.has(COLUMN)) { // calculate in data
    return {data: STATS, field: 'width'};
  }
  return cellWidth;
}

function getCellHeight(model: Model): LayoutValue {
  if (model.has(Y)) {
    if (model.isOrdinalScale(Y)) { // calculate in data
      return {data: STATS, field: 'cellHeight'};
    } else {
      return model.config(model.isFacet() ? 'cellHeight' : 'singleHeight');
    }
  }
  return model.bandWidth(Y);
}

function getHeight(model: Model, cellHeight: LayoutValue): LayoutValue {
  if (model.has(ROW)) {
    return {data: STATS, field: 'height'};
  }
  return cellHeight;
}

export default function(model: Model, stats) {
  return box(model, stats);
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

  var cellWidth, cellHeight, cellPadding = model.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (model.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + model.padding(X)) * model.bandWidth(X);
    } else {
      cellWidth =  model.config(hasCol || hasRow ? 'cellWidth' : 'singleWidth');
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
      cellHeight = (yCardinality + model.padding(Y)) * model.bandWidth(Y);
    } else {
      cellHeight = model.config(hasCol || hasRow ? 'cellHeight' : 'singleHeight');
    }
  } else {
    cellHeight = model.bandWidth(Y);
  }

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = model.cardinality(COLUMN, stats);
    width = cellWidth * colCardinality + cellPadding * (colCardinality - 1) ;
  }
  if (hasRow) {
    var rowCardinality =  model.cardinality(ROW, stats);
    height = cellHeight * rowCardinality + cellPadding * (rowCardinality - 1);
  }

  return {
    // width and height of the whole cell
    cellWidth: roundFloat(cellWidth),
    cellHeight: roundFloat(cellHeight),
    cellPadding: cellPadding,
    // width and height of the chart
    width: roundFloat(width),
    height: roundFloat(height)
  };
}
