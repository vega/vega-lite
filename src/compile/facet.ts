import * as util from '../util';
import {extend} from '../util';
import {COLUMN, ROW, X, Y} from '../channel';
import {isDimension} from '../fielddef';
import {Model} from './Model';

import {compileAxis, compileInnerAxis, gridShow} from './axis';
import {compileScales} from './scale';
import {applyConfig, FILL_STROKE_CONFIG} from './common';

/**
 * return mixins that contains marks, scales, and axes for the rootGroup
 */
export function facetMixins(model: Model, marks) {
  const hasRow = model.has(ROW), hasCol = model.has(COLUMN);

  if (model.has(ROW) && !isDimension(model.encoding().row)) {
    // TODO: add error to model instead
    util.error('Row encoding should be ordinal.');
  }

  if (model.has(COLUMN) && !isDimension(model.encoding().column)) {
    // TODO: add error to model instead
    util.error('Col encoding should be ordinal.');
  }

  return {
    marks: [].concat(
      getFacetGuideGroups(model),
      [getFacetGroup(model, marks)]
    ),
    // assuming equal cellWidth here
    scales: compileScales(model),
    axes: [].concat(
      hasRow && model.axis(ROW) ? [compileAxis(ROW, model)] : [],
      hasCol && model.axis(COLUMN) ? [compileAxis(COLUMN, model)] : []
    )
  };
}

function getCellAxes(model: Model) {
  const cellAxes = [];
  if (model.has(X) && model.axis(X) && gridShow(model, X)) {
    cellAxes.push(compileInnerAxis(X, model));
  }
  if (model.has(Y) && model.axis(Y) && gridShow(model, Y)) {
    cellAxes.push(compileInnerAxis(Y, model));
  }
  return cellAxes;
}

function getFacetGroup(model: Model, marks) {
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
      update: getFacetGroupProperties(model)
    },
    marks: marks
  };

  const cellAxes = getCellAxes(model);
  if (cellAxes.length > 0) {
    facetGroup.axes = cellAxes;
  }
  return facetGroup;
}

function getFacetGroupProperties(model: Model) {
  let facetGroupProperties: any = {
    x: model.has(COLUMN) ? {
        scale: model.scaleName(COLUMN),
        field: model.field(COLUMN),
        // offset by the padding
        offset: model.scale(COLUMN).padding / 2
      } : {value: model.config().facet.scale.padding / 2},

    y: model.has(ROW) ? {
      scale: model.scaleName(ROW),
      field: model.field(ROW),
      // offset by the padding
      offset: model.scale(ROW).padding / 2
    } : {value: model.config().facet.scale.padding / 2},

    width: {field: {parent: 'cellWidth'}},
    height: {field: {parent: 'cellHeight'}}
  };

  // apply both config from cell and facet.cell (with higher precedence for facet.cell)
  applyConfig(facetGroupProperties, model.config().cell, FILL_STROKE_CONFIG.concat(['clip']));
  applyConfig(facetGroupProperties, model.config().facet.cell, FILL_STROKE_CONFIG.concat(['clip']));

  return facetGroupProperties;
}

/**
 * Return groups of axes or manually drawn grids.
 */
function getFacetGuideGroups(model: Model) {
  let rootAxesGroups = [] ;

  if (model.has(X)) {
    if (model.axis(X)) {
      rootAxesGroups.push(getXAxesGroup(model));
    }
  } else {
    // TODO: consider if row has axis and if row's axis.grid is true
    if (model.has(ROW)) {
      // manually draw grid (use apply to push all members of an array)
      rootAxesGroups.push.apply(rootAxesGroups, getRowGridGroups(model));
    }
  }
  if (model.has(Y)) {
    if (model.axis(Y)) {
      rootAxesGroups.push(getYAxesGroup(model));
    }
  } else {
    // TODO: consider if column has axis and if column's axis.grid is true
    if (model.has(COLUMN)) {
      // manually draw grid (use apply to push all members of an array)
      rootAxesGroups.push.apply(rootAxesGroups, getColumnGridGroups(model));
    }
  }

  return rootAxesGroups;
}

function getXAxesGroup(model: Model) { // TODO: VgMarks
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
          summarize: {'*': ['count']} // just a placeholder aggregation
        }]
      }
    } : {},
    {
      properties: {
        update: {
          width: {field: {parent: 'cellWidth'}},
          height: {
            field: {group: 'height'}
          },
          x: hasCol ? {
            scale: model.scaleName(COLUMN),
            field: model.field(COLUMN),
            // offset by the padding
            offset: model.scale(COLUMN).padding / 2
          } : {
            // offset by the padding
            value: model.config().facet.scale.padding / 2
          }
        }
      }
    },
    model.axis(X) ? {
      axes: [compileAxis(X, model)]
    }: {}
  );
}

function getYAxesGroup(model: Model) { // TODO: VgMarks
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
          summarize: {'*': ['count']} // just a placeholder aggregation
        }]
      }
    } : {},
    {
      properties: {
        update: {
          width: {
            field: {group: 'width'}
          },
          height: {field: {parent: 'cellHeight'}},
          y: hasRow ? {
            scale: model.scaleName(ROW),
            field: model.field(ROW),
            // offset by the padding
            offset: model.scale(ROW).padding / 2
          } : {
            // offset by the padding
            value: model.config().facet.scale.padding / 2
          }
        }
      },
    },
    model.axis(Y) ? {
      axes: [compileAxis(Y, model)]
    }: {}
  );
}

function getRowGridGroups(model: Model): any[] { // TODO: VgMarks
  const name = model.spec().name;
  const facetGridConfig = model.config().facet.grid;

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
        x: {value: 0, offset: -facetGridConfig.offset },
        x2: {field: {group: 'width'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
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
        x: {value: 0, offset: -facetGridConfig.offset },
        x2: {field: {group: 'width'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
        strokeWidth: {value: 0.5}
      }
    }
  }];
}

function getColumnGridGroups(model: Model): any { // TODO: VgMarks
  const name = model.spec().name;
  const facetGridConfig = model.config().facet.grid;

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
        y: {value: 0, offset: -facetGridConfig.offset},
        y2: {field: {group: 'height'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
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
        y: {value: 0, offset: -facetGridConfig.offset},
        y2: {field: {group: 'height'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
        strokeWidth: {value: 0.5}
      }
    }
  }];
}
