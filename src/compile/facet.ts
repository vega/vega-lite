import * as util from '../util';
import {extend} from '../util';
import {COLUMN, ROW, X, Y} from '../channel';
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileScales} from './scale';

/**
 * return mixins that contains marks, scales, and axes for the rootGroup
 */
export function facetMixins(model: Model, marks) {
  const layout = model.layout();
  const cellConfig = model.config().cell;
  const cellWidth: any = !model.has(COLUMN) ?
      {field: {group: 'width'}} :     // cellWidth = width -- just use group's
    typeof layout.cellWidth !== 'number' ?
      {scale: model.scaleName(COLUMN), band: true} : // bandSize of the scale
      {value: layout.cellWidth};      // static value

  const cellHeight: any = !model.has(ROW) ?
      {field: {group: 'height'}} :  // cellHeight = height -- just use group's
    typeof layout.cellHeight !== 'number' ?
      {scale: model.scaleName(ROW), band: true} :  // bandSize of the scale
      {value: layout.cellHeight};   // static value

  let facetGroupProperties: any = {
    width: cellWidth,
    height: cellHeight
  };

  // add configs that are the resulting group marks properties
  ['clip', 'fill', 'fillOpacity', 'stroke', 'strokeWidth',
    'strokeOpacity', 'strokeDash', 'strokeDashOffset']
    .forEach(function(property) {
      const value = cellConfig[property];
      if (value !== undefined) {
        facetGroupProperties[property] = {value: value};
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
      scale: model.scaleName(ROW),
      field: model.field(ROW),
      offset: model.fieldDef(ROW).scale.padding / 2
    };

    facetKeys.push(model.field(ROW));
    rootAxes.push(compileAxis(ROW, model));
    if (model.has(X)) {
      // If has X, prepend a group for shared x-axes in the root group's marks
      rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
    }
    const rowAxis = model.fieldDef(ROW).axis;
    if (typeof rowAxis === 'boolean' || rowAxis.grid !== false) {
      rootMarks.push(getRowGridGroup(model, cellHeight));
    }
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
      scale: model.scaleName(COLUMN),
      field: model.field(COLUMN),
      offset: model.fieldDef(COLUMN).scale.padding / 2
    };

    facetKeys.push(model.field(COLUMN));
    rootAxes.push(compileAxis(COLUMN, model));

    if (model.has(Y)) {
      // If has Y, prepend a group for shared y-axes in the root group's marks
      rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
    }

    const colAxis = model.fieldDef(COLUMN).axis;
    if (typeof colAxis === 'boolean' || colAxis.grid !== false) {
      rootMarks.push(getColumnGridGroup(model, cellWidth));
    }
  } else { // doesn't have column
    if (model.has(Y)) { // keep y axis in the cell
      cellAxes.push(compileAxis(Y, model));
    }
  }
  const name = model.spec().name;
  let facetGroup: any = {
    name: (name ? name + '-' : '') + 'cell',
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

  return {
    marks: rootMarks,
    axes: rootAxes,
    // assuming equal cellWidth here
    scales: compileScales(
      model.channels(), // TODO: with nesting, not all scale might be a root-level
      model
    )
  };
}

function getXAxesGroup(model: Model, cellWidth, hasCol: boolean) { // TODO: VgMarks
  const name = model.spec().name;
  return extend({
      name: (name ? name + '-' : '') + 'x-axes',
      type: 'group'
    },
    hasCol ? {
      from: {
        data: model.dataTable(),
        transform: [{
          type: 'aggregate',
          groupby: [model.field(COLUMN)],
          summarize: {'*': 'count'} // just a placeholder aggregation
        }]
      }
    } : {},
    {
      properties: {
        update: {
          width: cellWidth,
          height: {field: {group: 'height'}},
          x: hasCol ? {scale: model.scaleName(COLUMN), field: model.field(COLUMN)} : {value: 0}
        }
      },
      axes: [compileAxis(X, model)]
    });
}

function getYAxesGroup(model: Model, cellHeight, hasRow: boolean) { // TODO: VgMarks
  const name = model.spec().name;
  return extend({
      name: (name ? name + '-' : '') + 'y-axes',
      type: 'group'
    },
    hasRow ? {
      from: {
        data: model.dataTable(),
        transform: [{
          type: 'aggregate',
          groupby: [model.field(ROW)],
          summarize: {'*': 'count'} // just a placeholder aggregation
        }]
      }
    } : {},
    {
      properties: {
        update: {
          width: {field: {group: 'width'}},
          height: cellHeight,
          y: hasRow ? {scale: model.scaleName(ROW), field: model.field(ROW)} : {value: 0}
        }
      },
      axes: [compileAxis(Y, model)]
    });
}

function getRowGridGroup(model: Model, cellHeight): any { // TODO: VgMarks
  const name = model.spec().name;
  const cellConfig = model.config().cell;

  const rowGrid = {
    name: (name ? name + '-' : '') + 'row-grid',
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(ROW)]}]
    },
    properties: {
      update: {
        y: {
          scale: model.scaleName(ROW),
          field: model.field(ROW)
        },
        x: {value: 0, offset: -cellConfig.gridOffset },
        x2: {field: {group: 'width'}, offset: cellConfig.gridOffset },
        stroke: { value: cellConfig.gridColor },
        strokeOpacity: { value: cellConfig.gridOpacity }
      }
    }
  };

  const rowGridOnTop = !model.has(X) || model.axis(X).orient !== 'top';
  if (rowGridOnTop) { // on top - no need to add offset
    return rowGrid;
  } // otherwise, need to offset all grid by cellHeight
  return {
    name: (name ? name + '-' : '') + 'row-grid-group',
    type: 'group',
    properties: {
      update: {
        // add group offset = `cellHeight + padding` to avoid clashing with axis
        y: cellHeight.value ? {
            // If cellHeight contains value, just use it.
            value: cellHeight,
            offset: model.fieldDef(ROW).scale.padding
          } : {
            // Otherwise, need to get it from layout data in the root group
            field: {parent: 'cellHeight'},
            offset: model.fieldDef(ROW).scale.padding
          },
        // include width so it can be referred inside row-grid
        width: {field: {group: 'width'}}
      }
    },
    marks: [rowGrid]
  };
}

function getColumnGridGroup(model: Model, cellWidth): any { // TODO: VgMarks
  const name = model.spec().name;
  const cellConfig = model.config().cell;

  const columnGrid = {
    name: (name ? name + '-' : '') + 'column-grid',
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(COLUMN)]}]
    },
    properties: {
      update: {
        x: {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN)
        },
        y: {value: 0, offset: -cellConfig.gridOffset},
        y2: {field: {group: 'height'}, offset: cellConfig.gridOffset },
        stroke: { value: cellConfig.gridColor },
        strokeOpacity: { value: cellConfig.gridOpacity }
      }
    }
  };

  const columnGridOnLeft = !model.has(Y) || model.axis(Y).orient === 'right';
  if (columnGridOnLeft) { // on left, no need to add global offset
    return columnGrid;
  } // otherwise, need to offset all grid by cellWidth
  return {
    name: (name ? name + '-' : '') + 'column-grid-group',
    type: 'group',
    properties: {
      update: {
        // Add group offset = `cellWidth + padding` to avoid clashing with axis
        x: cellWidth.value ? {
             // If cellWidth contains value, just use it.
             value: cellWidth,
             offset: model.fieldDef(COLUMN).scale.padding
           } : {
             // Otherwise, need to get it from layout data in the root group
             field: {parent: 'cellWidth'},
             offset: model.fieldDef(COLUMN).scale.padding
           },
        // include height so it can be referred inside column-grid
        height: {field: {group: 'height'}}
      }
    },
    marks: [columnGrid]
  };
}
