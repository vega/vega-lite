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

  const cellWidth: any = !model.has(COLUMN) ?
      {field: {group: 'width'}} :     // cellWidth = width -- just use group's
    layout.cellWidth.field ?
      {scale: model.scale(COLUMN), band: true} : // bandSize of the scale
      {value: layout.cellWidth};      // static value

  const cellHeight: any = !model.has(ROW) ?
      {field: {group: 'height'}} :  // cellHeight = height -- just use group's
    layout.cellHeight.field ?
      {scale: model.scale(ROW), band: true} :  // bandSize of the scale
      {value: layout.cellHeight};   // static value

  let facetGroupProperties: any = {
    width: cellWidth,
    height: cellHeight
  };

  // add configs that are the resulting group marks properties
  ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
    'strokeOpacity', 'strokeDash', 'strokeDashOffset']
    .forEach(function(property) {
      const value = model.cellConfig(property);
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
      scale: model.scale(ROW),
      field: model.field(ROW),
      offset: model.cellConfig('padding') / 2
    };

    facetKeys.push(model.field(ROW));
    rootAxes.push(compileAxis(ROW, model));
    if (model.has(X)) {
      // If has X, prepend a group for shared x-axes in the root group's marks
      rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
    }

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
      scale: model.scale(COLUMN),
      field: model.field(COLUMN),
      offset: model.cellConfig('padding') / 2
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
          x: hasCol ? {scale: model.scale(COLUMN), field: model.field(COLUMN)} : {value: 0}
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
          y: hasRow ? {scale: model.scale(ROW), field: model.field(ROW)} : {value: 0}
        }
      },
      axes: [compileAxis(Y, model)]
    });
}

function getRowRulesGroup(model: Model, cellHeight): any { // TODO: VgMarks
  const name = model.spec().name;
  const rowRules = {
    name: (name ? name + '-' : '') + 'row-rules',
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(ROW)]}]
    },
    properties: {
      update: {
        y: {
          scale: model.scale(ROW),
          field: model.field(ROW)
        },
        x: {value: 0, offset: -model.cellConfig('gridOffset') },
        x2: {field: {group: 'width'}, offset: model.cellConfig('gridOffset') },
        stroke: { value: model.cellConfig('gridColor') },
        strokeOpacity: { value: model.cellConfig('gridOpacity') }
      }
    }
  };

  const rowRulesOnTop = !model.has(X) || model.fieldDef(X).axis.orient !== 'top';
  if (rowRulesOnTop) { // on top - no need to add offset
    return rowRules;
  } // otherwise, need to offset all rules by cellHeight
  return {
    name: (name ? name + '-' : '') + 'row-rules-group',
    type: 'group',
    properties: {
      update: {
        // add group offset = `cellHeight + padding` to avoid clashing with axis
        y: cellHeight.value ? {
            // If cellHeight contains value, just use it.
            value: cellHeight,
            offset: model.cellConfig('padding')
          } : {
            // Otherwise, need to get it from layout data in the root group
            field: {parent: 'cellHeight'},
            offset: model.cellConfig('padding')
          },
        // include width so it can be referred inside row-rules
        width: {field: {group: 'width'}}
      }
    },
    marks: [rowRules]
  };
}

function getColumnRulesGroup(model: Model, cellWidth): any { // TODO: VgMarks
  const name = model.spec().name;
  const columnRules = {
    name: (name ? name + '-' : '') + 'column-rules',
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(COLUMN)]}]
    },
    properties: {
      update: {
        x: {
          scale: model.scale(COLUMN),
          field: model.field(COLUMN)
        },
        y: {value: 0, offset: -model.cellConfig('gridOffset')},
        y2: {field: {group: 'height'}, offset: model.cellConfig('gridOffset') },
        stroke: { value: model.cellConfig('gridColor') },
        strokeOpacity: { value: model.cellConfig('gridOpacity') }
      }
    }
  };

  const colRulesOnLeft = !model.has(Y) || model.fieldDef(Y).axis.orient === 'right';
  if (colRulesOnLeft) { // on left, no need to add global offset
    return columnRules;
  } // otherwise, need to offset all rules by cellWidth
  return {
    name: (name ? name + '-' : '') + 'column-rules-group',
    type: 'group',
    properties: {
      update: {
        // Add group offset = `cellWidth + padding` to avoid clashing with axis
        x: cellWidth.value ? {
             // If cellWidth contains value, just use it.
             value: cellWidth,
             offset: model.cellConfig('padding')
           } : {
             // Otherwise, need to get it from layout data in the root group
             field: {parent: 'cellWidth'},
             offset: model.cellConfig('padding')
           },
        // include height so it can be referred inside column-rules
        height: {field: {group: 'height'}}
      }
    },
    marks: [columnRules]
  };
}
