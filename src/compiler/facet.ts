import * as util from '../util';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {FieldDef} from '../schema/fielddef.schema';
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileScales} from './scale';

/**
 * return mixins that contains marks, scales, and axes for the rootGroup
 */
export function facetMixins(model: Model, marks, layout, stats) {
  let facetGroupProperties: any = {
    width: model.has(COLUMN) ?
             {value: layout.cellWidth} :
             {field: {group: 'width'}},
    height: model.has(ROW) ?
            {value: layout.cellHeight} :
            {field: {group: 'height'}},
    fill: {value: model.config('cellBackgroundColor')}
  };

  let rootMarks = [], rootAxes = [], facetKeys = [], cellAxes = [];
  const hasRow = model.has(ROW), hasCol = model.has(COLUMN);
  if (hasRow) {
    if (!model.isDimension(ROW)) {
      // TODO: add error to model instead
      util.error('Row encoding should be ordinal.');
    }
    facetGroupProperties.y = {
      scale: ROW,
      field: model.fieldRef(ROW)
    };
    facetGroupProperties.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(model.fieldRef(ROW));

    rootAxes.push(compileAxis(ROW, model, layout, stats));

    if (model.has(X)) {
      // If has X, prepend a group for shared x-axes in the root group's marks
      let xAxesGroup: any = { // VgMarks
        name: 'x-axes',
        type: 'group',
        properties: {
          update: {
            width: hasCol ? {'value': layout.cellWidth} : {field: {group: 'width'}},
            height: {field: {group: 'height'}},
            x: hasCol ? {scale: COLUMN, field: model.fieldRef(COLUMN)} : {value: 0},
          }
        },
        axes: [compileAxis(X, model, layout, stats)]
      };
      if (hasCol) {
        xAxesGroup.from = {
          data: model.dataTable(),
          transform: {type: 'facet', groupby: [model.fieldRef(COLUMN)]}
        };
      }
      rootMarks.push(xAxesGroup);
    }
  } else { // doesn't have row
    if (model.has(X)) {
      //keep x axis in the cell
      cellAxes.push(compileAxis(X, model, layout, stats));
    }
  }

  if (hasCol) {
    if (!model.isDimension(COLUMN)) {
      // TODO: add error to model instead
      util.error('Col encoding should be ordinal.');
    }
    facetGroupProperties.x = {
      scale: COLUMN,
      field: model.fieldRef(COLUMN)
    };
    facetGroupProperties.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(model.fieldRef(COLUMN));

    rootAxes.push(compileAxis(COLUMN, model, layout, stats));

    if (model.has(Y)) {
      // If has Y, prepend a group for shared y-axes in the root group's marks
      let yAxesGroup: any = { // VgMarks
        name: 'y-axes',
        type: 'group',
        properties: {
          update: {
            width: {field: {group: 'width'}},
            height: hasRow ? {'value': layout.cellHeight} : {field: {group: 'height'}},
            x: hasCol ? {scale: COLUMN, field: model.fieldRef(COLUMN)} : {value: 0},
          }
        },
        axes: [compileAxis(Y, model, layout, stats)]
      };

      if (hasRow) {
        yAxesGroup.from = {
          data: model.dataTable(),
          transform: {type: 'facet', groupby: [model.fieldRef(ROW)]}
        };
      }
      rootMarks.push(yAxesGroup);
    }

  } else { // doesn't have column
    if (model.has(Y)) {
      cellAxes.push(compileAxis(Y, model, layout, stats));
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
    scales: compileScales(scaleNames, model, layout, stats, true)
  };
}
