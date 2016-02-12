import * as util from '../util';
import {extend} from '../util';
import {COLUMN, ROW, X, Y} from '../channel';
import {Model} from './Model';

import {compileAxis, compileInnerAxis, gridShow} from './axis';
import {compileScales} from './scale';

/**
 * return mixins that contains marks, scales, and axes for the rootGroup
 */
export function facetMixins(model: Model, marks) {
  const layout = model.layout();
  const cellConfig = model.config().cell;
  const cellWidth: any = !model.has(COLUMN) ?
      { // cellWidth = width -- use group's
        field: {group: 'width'},
        // Need to offset the padding because width calculation need to overshoot
        // by the padding size to allow padding to be integer (can't rely on
        // ordinal scale's padding since it is fraction.)
        offset: model.has(COLUMN) ? -model.fieldDef(COLUMN).scale.padding : undefined
      } :
    typeof layout.cellWidth !== 'number' ?
      {field: {parent: 'cellWidth'}} : // bandSize of the scale
      {value: layout.cellWidth};      // static value

  const cellHeight: any = !model.has(ROW) ?
      { // cellHeight = height -- use group's
        field: {group: 'height'},
        // Need to offset the padding because height calculation need to overshoot
        // by the padding size to allow padding to be integer (can't rely on
        // ordinal scale's padding since it is fraction.)
        offset: model.has(ROW) ? -model.fieldDef(ROW).scale.padding : undefined
      } :
    typeof layout.cellHeight !== 'number' ?
      {field: {parent: 'cellHeight'}} :  // bandSize of the scale
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
      field: model.field(ROW)
    };

    facetKeys.push(model.field(ROW));
    rootAxes.push(compileAxis(ROW, model));
    if (model.has(X)) {
      // If has X, prepend a group for shared x-axes in the root group's marks
      rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
    }
    const rowAxis = model.fieldDef(ROW).axis;
    if (typeof rowAxis === 'boolean' || rowAxis.grid !== false) {
      if (model.has(X)) {
        if (gridShow(model, X)) {
          // If has X and a grid show be shown, add grid-only x-axis to the cell
          cellAxes.push(compileInnerAxis(X, model));
        }
      } else {
        // Otherwise, manually draw grids between cells
        // Note: this is a weird syntax for pushing multiple items
        rootMarks.push.apply(rootMarks, getRowGridGroups(model, cellHeight));
      }
    }
  } else { // doesn't have row
    if (model.has(X) && model.fieldDef(X).axis) { // keep x axis in the cell
      cellAxes.push(compileInnerAxis(X, model));
      rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
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
      field: model.field(COLUMN)
    };

    facetKeys.push(model.field(COLUMN));
    rootAxes.push(compileAxis(COLUMN, model));

    if (model.has(Y)) {
      // If has Y, prepend a group for shared y-axes in the root group's marks
      rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
    }

    const colAxis = model.fieldDef(COLUMN).axis;
    if (typeof colAxis === 'boolean' || colAxis.grid !== false) {
      if (model.has(Y)) {
        if (gridShow(model, Y)) {
          // If has Y and a grid show be shown, add grid-only y-axis to the cell
          cellAxes.push(compileInnerAxis(Y, model));
        }
      } else {
        // Otherwise, manually draw grids between cells
        // Note: this is a weird syntax for pushing multiple items
        rootMarks.push.apply(rootMarks, getColumnGridGroups(model, cellWidth));
      }
    }
  } else { // doesn't have column
    if (model.has(Y) && model.fieldDef(Y).axis) { // keep y axis in the cell
      cellAxes.push(compileInnerAxis(Y, model));
      rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
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
      from: { // TODO: if we do facet transform at the parent level we can same some transform here
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
          height: {
            field: {group: 'height'},
            // Need to offset the padding because height calculation need to overshoot
            // by the padding size to allow padding to be integer (can't rely on
            // ordinal scale's padding since it is fraction.)
            offset: model.has(ROW) ? -model.fieldDef(ROW).scale.padding : undefined
          },
          x: hasCol ? {scale: model.scaleName(COLUMN), field: model.field(COLUMN)} : {value: 0}
        }
      }
    },
    model.fieldDef(X).axis ? {
      axes: [compileAxis(X, model)]
    }: {}
  );
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
          width: {
            field: {group: 'width'},
            // Need to offset the padding because width calculation need to overshoot
            // by the padding size to allow padding to be integer (can't rely on
            // ordinal scale's padding since it is fraction.)
            offset: model.has(COLUMN) ? -model.fieldDef(COLUMN).scale.padding : undefined
          },
          height: cellHeight,
          y: hasRow ? {scale: model.scaleName(ROW), field: model.field(ROW)} : {value: 0}
        }
      },
    },
    model.fieldDef(Y).axis ? {
      axes: [compileAxis(Y, model)]
    }: {}
  );
}

function getRowGridGroups(model: Model, cellHeight): any { // TODO: VgMarks
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
        strokeOpacity: { value: cellConfig.gridOpacity },
        strokeWidth: {value: 0.5}
      }
    }
  };

  return [rowGrid, {
    name: (name ? name + '-' : '') + 'row-grid-end',
    type: 'rule',
    properties: {
      update: {
        y: { field: {group: 'height'}},
        x: {value: 0, offset: -cellConfig.gridOffset },
        x2: {field: {group: 'width'}, offset: cellConfig.gridOffset },
        stroke: { value: cellConfig.gridColor },
        strokeOpacity: { value: cellConfig.gridOpacity },
        strokeWidth: {value: 0.5}
      }
    }
  }];
}

function getColumnGridGroups(model: Model, cellWidth): any { // TODO: VgMarks
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
        strokeOpacity: { value: cellConfig.gridOpacity },
        strokeWidth: {value: 0.5}
      }
    }
  };

  return [columnGrid,  {
    name: (name ? name + '-' : '') + 'column-grid-end',
    type: 'rule',
    properties: {
      update: {
        x: { field: {group: 'width'}},
        y: {value: 0, offset: -cellConfig.gridOffset},
        y2: {field: {group: 'height'}, offset: cellConfig.gridOffset },
        stroke: { value: cellConfig.gridColor },
        strokeOpacity: { value: cellConfig.gridOpacity },
        strokeWidth: {value: 0.5}
      }
    }
  }];
}
