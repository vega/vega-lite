/// <reference path="../../typings/d3-format.d.ts"/>

import {FieldDef} from '../schema/fielddef.schema';

import {setter} from '../util';
import {COLUMN, ROW, X, Y, TEXT, Channel} from '../channel';
import {LAYOUT} from '../data';
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
      return {data: LAYOUT, field: 'cellWidth'};
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
    return {data: LAYOUT, field: 'width'};
  }
  return cellWidth;
}

function getCellHeight(model: Model): LayoutValue {
  if (model.has(Y)) {
    if (model.isOrdinalScale(Y)) { // calculate in data
      return {data: LAYOUT, field: 'cellHeight'};
    } else {
      return model.config(model.isFacet() ? 'cellHeight' : 'singleHeight');
    }
  }
  return model.bandWidth(Y);
}

function getHeight(model: Model, cellHeight: LayoutValue): LayoutValue {
  if (model.has(ROW)) {
    return {data: LAYOUT, field: 'height'};
  }
  return cellHeight;
}
