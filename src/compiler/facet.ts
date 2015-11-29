import * as util from '../util';
import {COLUMN, ROW, X, Y, TEXT, Channel} from '../channel';
import {FieldDef} from '../schema/fielddef.schema';
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileScales} from './scale';

/**
 * return mixins that contains marks, scales, and axes for the rootGroup
 */
export function facetMixins(model: Model, marks) {
  // TODO: we might want to consolidate this in one stats table
  const layout = model.layout();

  const cellWidth: any = !model.has(COLUMN) ?
      {field: {group: 'width'}} :
    layout.cellWidth.field ?
      {scale: 'column', band: true} :
      {value: layout.cellWidth};

  const cellHeight: any = !model.has(ROW) ?
      {field: {group: 'height'}} :
    layout.cellHeight.field ?
      {scale: 'row', band: true} :
      {value: layout.cellHeight};

  let facetGroupProperties: any = {
    width: cellWidth,
    height: cellHeight,
    fill: {value: model.config('cellBackgroundColor')}
  };

  let rootMarks = [], rootAxes = [], facetKeys = [], cellAxes = [];
  const hasRow = model.has(ROW), hasCol = model.has(COLUMN);

  // TODO: add property to keep axes in cells even if row is encoded
  if (hasRow) {
    if (!model.isDimension(ROW)) {
      // TODO: add error to model instead
      util.error('Row encoding should be ordinal.');
    }
    facetGroupProperties.y = {
      scale: ROW,
      field: model.fieldRef(ROW)
    };

    facetKeys.push(model.fieldRef(ROW));
    rootAxes.push(compileAxis(ROW, model));
    if (model.has(X)) {
      // If has X, prepend a group for shared x-axes in the root group's marks
      rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
    }
  } else { // doesn't have row
    if (model.has(X)) { //keep x axis in the cell
      cellAxes.push(compileAxis(X, model));
    }
  }

  // TODO: add property to keep axes in cells even if column is encoded
  if (hasCol) {
    if (!model.isDimension(COLUMN)) {
      // TODO: add error to model instead
      util.error('Col encoding should be ordinal.');
    }
    facetGroupProperties.x = {
      scale: COLUMN,
      field: model.fieldRef(COLUMN)
    };

    facetKeys.push(model.fieldRef(COLUMN));
    rootAxes.push(compileAxis(COLUMN, model));

    if (model.has(Y)) {
      // If has Y, prepend a group for shared y-axes in the root group's marks
      rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
          }
  } else { // doesn't have column
    if (model.has(Y)) { //keep y axis in the cell
      cellAxes.push(compileAxis(Y, model));
    }
  }

  let facetGroup: any = {
    name: 'cell', // FIXME model.name() + cell
    type: 'group',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: facetKeys}]
    },
    properties: {
      update: facetGroupProperties
    },
    marks: marks
  };
  if (cellAxes.length > 0) {
    facetGroup.axes = cellAxes;
  }
  rootMarks.push(facetGroup);

  const scaleNames = model.map(function(_, channel: Channel){
    return channel; // TODO model.scaleName(channel)
  });

  return {
    marks: rootMarks,
    axes: rootAxes,
    // assuming equal cellWidth here
    scales: compileScales(scaleNames, model)
  };
}

function getXAxesGroup(model: Model, cellWidth, hasCol: boolean) {
  let xAxesGroup: any = { // TODO: VgMarks
    name: 'x-axes',
    type: 'group',
    properties: {
      update: {
        width: cellWidth,
        height: {field: {group: 'height'}},
        x: hasCol ? {scale: COLUMN, field: model.fieldRef(COLUMN)} : {value: 0},
        y: {value: - model.config('cellPadding') / 2}
      }
    },
    axes: [compileAxis(X, model)]
  };
  if (hasCol) {
    // FIXME facet is too expensive here - we only need to know unique columns
    xAxesGroup.from = {
      data: model.dataTable(),
      transform: {type: 'facet', groupby: [model.fieldRef(COLUMN)]}
    };
  }
  return xAxesGroup;
}

function getYAxesGroup(model: Model, cellHeight, hasRow: boolean) {
  let yAxesGroup: any = { // TODO: VgMarks
    name: 'y-axes',
    type: 'group',
    properties: {
      update: {
        width: {field: {group: 'width'}},
        height: cellHeight,
        x: {value: - model.config('cellPadding') / 2},
        y: hasRow ? {scale: ROW, field: model.fieldRef(ROW)} : {value: 0}
      }
    },
    axes: [compileAxis(Y, model)]
  };

  if (hasRow) {
    // FIXME facet is too expensive here - we only need to know unique rows
    yAxesGroup.from = {
      data: model.dataTable(),
      transform: {type: 'facet', groupby: [model.fieldRef(ROW)]}
    };
  }
  return yAxesGroup;
}
