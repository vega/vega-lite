import {Model} from './Model';

import {COLUMN, ROW, X, Y, TEXT} from '../channel';
import {TEXT as TEXT_MARK} from '../mark';
import {LAYOUT} from '../data';

interface DataRef {
  data?: string;
  field?: string;
  value?: string;
}

export interface Layout {
  cellWidth: LayoutValue;
  cellHeight: LayoutValue;
  width: LayoutValue;
  height: LayoutValue;
}

// value that we can put in scale's domain/range (either a number, or a data ref)
type LayoutValue = number | DataRef;

export function compileLayout(model: Model): Layout {
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
      return {data: LAYOUT, field: 'cellWidth'};
    }
    return model.config().cell.width;
  }
  if (model.mark() === TEXT_MARK) {
    return model.config().textCellWidth;
  }
  return model.fieldDef(X).scale.bandWidth;
}

function getWidth(model: Model, cellWidth: LayoutValue): LayoutValue {
  if (model.has(COLUMN)) { // calculate in data
    return {data: LAYOUT, field: 'width'};
  }
  return cellWidth;
}

function getCellHeight(model: Model): LayoutValue {
  if (model.has(Y)) {
    if (model.isOrdinalScale(Y)) { // calculate in data
      return {data: LAYOUT, field: 'cellHeight'};
    } else {
      return model.config().cell.height;
    }
  }
  return model.fieldDef(Y).scale.bandWidth;
}

function getHeight(model: Model, cellHeight: LayoutValue): LayoutValue {
  if (model.has(ROW)) {
    return {data: LAYOUT, field: 'height'};
  }
  return cellHeight;
}
