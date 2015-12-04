import * as util from '../util';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileScales} from './scale';

/**
 * return mixins that contains marks, scales, and axes for the rootGroup
 */
export function facetMixins(model: Model, marks) {
  const layout = model.layout();

  const cellWidth: any = !model.has(COLUMN) ?
      {field: {group: 'width'}} :     // cellWidth = width -- just use group's
    layout.cellWidth.field ?
      {scale: 'column', band: true} : // bandSize of the scale
      {value: layout.cellWidth};      // static value

  const cellHeight: any = !model.has(ROW) ?
      {field: {group: 'height'}} :  // cellHeight = height -- just use group's
    layout.cellHeight.field ?
      {scale: 'row', band: true} :  // bandSize of the scale
      {value: layout.cellHeight};   // static value

  let facetGroupProperties: any = {
    width: cellWidth,
    height: cellHeight
  };

  // add configs that are the resulting group marks properties
  const cellConfig = model.config('cell');
  ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
    'strokeOpacity', 'strokeDash', 'strokeDashOffset']
    .forEach(function(property) {
      const value = cellConfig[property];
      if (value !== undefined) {
        facetGroupProperties[property] = value;
      }
    });

  let rootMarks = [], rootAxes = [], facetKeys = [], cellAxes = [];
  const hasRow = model.has(ROW), hasCol = model.has(COLUMN);

  // TODO(#90): add property to keep axes in cells even if row is encoded
  if (hasRow) {
    if (!model.isDimension(ROW)) {
      // TODO: add error to model instead
      util.error('Row encoding should be ordinal.');
    }
    facetGroupProperties.y = {
      scale: ROW,
      field: model.field(ROW)
    };

    facetKeys.push(model.field(ROW));
    rootAxes.push(compileAxis(ROW, model));
    if (model.has(X)) {
      // If has X, prepend a group for shared x-axes in the root group's marks
      rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
    }

    // TODO: add properties to make rule optional
    rootMarks.push(getRowRulesGroup(model, cellHeight));
  } else { // doesn't have row
    if (model.has(X)) { // keep x axis in the cell
      cellAxes.push(compileAxis(X, model));
    }
  }

  // TODO(#90): add property to keep axes in cells even if column is encoded
  if (hasCol) {
    if (!model.isDimension(COLUMN)) {
      // TODO: add error to model instead
      util.error('Col encoding should be ordinal.');
    }
    facetGroupProperties.x = {
      scale: COLUMN,
      field: model.field(COLUMN)
    };

    facetKeys.push(model.field(COLUMN));
    rootAxes.push(compileAxis(COLUMN, model));

    if (model.has(Y)) {
      // If has Y, prepend a group for shared y-axes in the root group's marks
      rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
    }
    // TODO: add properties to make rule optional
    rootMarks.push(getColumnRulesGroup(model, cellWidth));
  } else { // doesn't have column
    if (model.has(Y)) { // keep y axis in the cell
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
        x: hasCol ? {scale: COLUMN, field: model.field(COLUMN)} : {value: 0},
        y: {value: - model.config('cell').padding / 2}
      }
    },
    axes: [compileAxis(X, model)]
  };
  if (hasCol) {
    // FIXME facet is too expensive here - we only need to know unique columns
    xAxesGroup.from = {
      data: model.dataTable(),
      transform: {type: 'facet', groupby: [model.field(COLUMN)]}
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
        x: {value: - model.config('cell').padding / 2},
        y: hasRow ? {scale: ROW, field: model.field(ROW)} : {value: 0}
      }
    },
    axes: [compileAxis(Y, model)]
  };

  if (hasRow) {
    // FIXME facet is too expensive here - we only need to know unique rows
    yAxesGroup.from = {
      data: model.dataTable(),
      transform: {type: 'facet', groupby: [model.field(ROW)]}
    };
  }
  return yAxesGroup;
}

function getRowRulesGroup(model: Model, cellHeight): any { // TODO: VgMarks
  const rowRulesOnTop = !model.has(X) || model.fieldDef(X).axis.orient !== 'top';
  const offset = model.config('cell').padding / 2 - 1;
  const rowRules = {
    name: 'row-rules',
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(ROW)]}]
    },
    properties: {
      update: {
        y: {
          scale: 'row',
          field: model.field(ROW),
          offset: (rowRulesOnTop ? -1 : 1) * offset
        },
        x: {value: 0, offset: -model.config('cell').gridOffset},
        x2: {field: {group: 'width'}, offset: model.config('cell').gridOffset},
        stroke: { value: model.config('cell').gridColor },
        strokeOpacity: { value: model.config('cell').gridOpacity }
      }
    }
  };

  if (rowRulesOnTop) { // on top - no need to add offset
    return rowRules;
  } // otherwise, need to offset all rules by cellHeight
  return {
    name: 'row-rules-group',
    type: 'group',
    properties: {
      update: {
        // add offset to avoid clashing with axis
        y: cellHeight.value ?
          // If cellHeight contains value, just use it.
          cellHeight :
          // Otherwise, need to get it from layout data in the root group
          {field: {parent: 'cellHeight'}},

        // include width so it can be referred inside row-rules
        width: {field: {group: 'width'}}
      }
    },
    marks: [rowRules]
  };
}

function getColumnRulesGroup(model: Model, cellWidth): any { // TODO: VgMarks
  const colRulesOnLeft = !model.has(Y) || model.fieldDef(Y).axis.orient === 'right';
  const offset = model.config('cell').padding / 2 - 1;
  const columnRules = {
    name: 'column-rules',
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(COLUMN)]}]
    },
    properties: {
      update: {
        x: {
          scale: 'column',
          field: model.field(COLUMN),
          offset: (colRulesOnLeft ? -1 : 1) * offset
        },
        y: {value: 0, offset: -model.config('cell').gridOffset},
        y2: {field: {group: 'height'}, offset: model.config('cell').gridOffset},
        stroke: { value: model.config('cell').gridColor },
        strokeOpacity: { value: model.config('cell').gridOpacity }
      }
    }
  };

  if (colRulesOnLeft) { // on left, no need to add global offset
    return columnRules;
  } // otherwise, need to offset all rules by cellWidth
  return {
    name: 'column-rules-group',
    type: 'group',
    properties: {
      update: {
        // Add offset to avoid clashing with axis
        x: cellWidth.value ?
           // If cellWidth contains value, just use it.
           cellWidth :
           // Otherwise, need to get it from layout data in the root group
           {field: {parent: 'cellWidth'}},

        // include height so it can be referred inside column-rules
        height: {field: {group: 'height'}}
      }
    },
    marks: [columnRules]
  };
}
