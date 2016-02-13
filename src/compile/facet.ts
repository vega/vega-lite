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
  const hasRow = model.has(ROW), hasCol = model.has(COLUMN);

  if (model.has(ROW) && !model.isDimension(ROW)) {
    // TODO: add error to model instead
    util.error('Row encoding should be ordinal.');
  }

  if (model.has(COLUMN) && !model.isDimension(COLUMN)) {
    // TODO: add error to model instead
    util.error('Col encoding should be ordinal.');
  }

  const cellWidth: any = getCellWidth(model);
  const cellHeight: any = getCellHeight(model);

  return {
    marks: [].concat(
      getFacetGuideGroups(model, cellWidth, cellHeight),
      [getFacetGroup(model, cellWidth, cellHeight, marks)]
    ),
    // assuming equal cellWidth here
    scales: compileScales(
      model.channels(), // TODO: with nesting, not all scale might be a root-level
      model
    ),
    axes: [].concat(
      hasRow && model.fieldDef(ROW).axis ? [compileAxis(ROW, model)] : [],
      hasCol && model.fieldDef(COLUMN).axis ? [compileAxis(COLUMN, model)] : []
    )
  };
}

function getCellWidth(model: Model) {
  const layout = model.layout();
  return !model.has(COLUMN) ?
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
}

function getCellHeight(model: Model) {
  const layout = model.layout();
  return !model.has(ROW) ?
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
}

function getCellAxes(model: Model) {
  const cellAxes = [];
  if (model.has(X) && model.fieldDef(X).axis && gridShow(model, X)) {
    cellAxes.push(compileInnerAxis(X, model));
  }
  if (model.has(Y) && model.fieldDef(Y).axis && gridShow(model, Y)) {
    cellAxes.push(compileInnerAxis(Y, model));
  }
  return cellAxes;
}

function getFacetGroup(model: Model, cellWidth, cellHeight, marks) {
  const name = model.spec().name;
  let facetGroup: any = {
    name: (name ? name + '-' : '') + 'cell',
    type: 'group',
    from: {
      data: model.dataTable(),
      transform: [{
        type: 'facet',
        groupby: [].concat(
          model.has(ROW) ? [model.field(ROW)] : [],
          model.has(COLUMN) ? [model.field(COLUMN)] : []
        )
      }]
    },
    properties: {
      update: getFacetGroupProperties(model, cellWidth, cellHeight)
    },
    marks: marks
  };

  const cellAxes = getCellAxes(model);
  if (cellAxes.length > 0) {
    facetGroup.axes = cellAxes;
  }
  return facetGroup;
}

function getFacetGroupProperties(model: Model, cellWidth, cellHeight) {
  const cellConfig = model.config().cell;
  let facetGroupProperties: any = extend(
    model.has(COLUMN) ? {
      x: {scale: model.scaleName(COLUMN), field: model.field(COLUMN)}
    } : {},
    model.has(ROW) ? {
      y: {scale: model.scaleName(ROW), field: model.field(ROW)}
    } : {},
    {
      width: cellWidth,
      height: cellHeight
    }
  );

  // add configs that are the resulting group marks properties
  ['clip', 'fill', 'fillOpacity', 'stroke', 'strokeWidth',
    'strokeOpacity', 'strokeDash', 'strokeDashOffset']
    .forEach(function(property) {
      const value = cellConfig[property];
      if (value !== undefined) {
        facetGroupProperties[property] = {value: value};
      }
    });

  return facetGroupProperties;
}

/**
 * Return groups of axes or manually drawn grids.
 */
function getFacetGuideGroups(model: Model, cellWidth, cellHeight) {
  let rootAxesGroups = [] ;

  if (model.has(X)) {
    if (model.fieldDef(X).axis) {
      rootAxesGroups.push(getXAxesGroup(model, cellWidth));
    }
  } else {
    // TODO: consider if row has axis and if row's axis.grid is true
    if (model.has(ROW)) {
      // manually draw grid (use apply to push all members of an array)
      rootAxesGroups.push.apply(rootAxesGroups, getRowGridGroups(model, cellHeight));
    }
  }
  if (model.has(Y)) {
    if (model.fieldDef(Y).axis) {
      rootAxesGroups.push(getYAxesGroup(model, cellHeight));
    }
  } else {
    // TODO: consider if column has axis and if column's axis.grid is true
    if (model.has(COLUMN)) {
      // manually draw grid (use apply to push all members of an array)
      rootAxesGroups.push.apply(rootAxesGroups, getColumnGridGroups(model, cellWidth));
    }
  }

  return rootAxesGroups;
}

function getXAxesGroup(model: Model, cellWidth) { // TODO: VgMarks
  const hasCol = model.has(COLUMN);
  const name = model.spec().name;
  return extend(
    {
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

function getYAxesGroup(model: Model, cellHeight) { // TODO: VgMarks
  const hasRow = model.has(ROW);
  const name = model.spec().name;
  return extend(
    {
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

function getRowGridGroups(model: Model, cellHeight): any[] { // TODO: VgMarks
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
