import * as util from '../util';
import {COLUMN, ROW, X, Y} from '../channel';
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileScales, compileScaleNames} from './scale';

function groupdef(name, opt) {
  opt = opt || {};

  // TODO: Vega's Marks interface
  var group:any = {
    name: name || undefined,
    type: 'group',
    properties: {
      enter: {
        width: opt.width || {field: {group: 'width'}},
        height: opt.height || {field: {group: 'height'}}
      }
    }
  };

  if (opt.from) {
    group.from = opt.from;
  }
  if (opt.x) {
    group.properties.enter.x = opt.x;
  }
  if (opt.y) {
    group.properties.enter.y = opt.y;
  }
  if (opt.axes) {
    group.axes = opt.axes;
  }

  return group;
}

export default function(group, model: Model, layout, output, singleScaleNames, stats) {
  var enter = group.properties.enter;
  var facetKeys = [], cellAxes = [], from, axesGrp;

  var hasRow = model.has(ROW), hasCol = model.has(COLUMN);

  enter.fill = {value: model.config('cellBackgroundColor')};

  //move "from" to cell level and add facet transform
  group.from = {data: group.marks[0].from.data};

  // Hack, this needs to be refactored
  for (var i = 0; i < group.marks.length; i++) {
    var mark = group.marks[i];
    if (mark.from.transform) {
      delete mark.from.data; //need to keep transform for subfacetting case
    } else {
      delete mark.from;
    }
  }

  if (hasRow) {
    if (!model.isDimension(ROW)) {
      util.error('Row encoding should be ordinal.');
    }
    enter.y = {scale: ROW, field: model.fieldRef(ROW)};
    enter.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(model.fieldRef(ROW));

    if (hasCol) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', groupby: [model.fieldRef(COLUMN)]});
    }

    axesGrp = groupdef('x-axes', {
        axes: model.has(X) ? [compileAxis(X, model, layout, stats)] : undefined,
        x: hasCol ? {scale: COLUMN, field: model.fieldRef(COLUMN)} : {value: 0},
        width: hasCol && {'value': layout.cellWidth}, //HACK?
        from: from
      });

    output.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (output.axes = output.axes || []);
    output.axes.push(compileAxis(ROW, model, layout, stats));
  } else { // doesn't have row
    if (model.has(X)) {
      //keep x axis in the cell
      cellAxes.push(compileAxis(X, model, layout, stats));
    }
  }

  if (hasCol) {
    if (!model.isDimension(COLUMN)) {
      util.error('Col encoding should be ordinal.');
    }
    enter.x = {scale: COLUMN, field: model.fieldRef(COLUMN)};
    enter.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(model.fieldRef(COLUMN));

    if (hasRow) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', groupby: [model.fieldRef(ROW)]});
    }

    axesGrp = groupdef('y-axes', {
      axes: model.has(Y) ? [compileAxis(Y, model, layout, stats)] : undefined,
      y: hasRow && {scale: ROW, field: model.fieldRef(ROW)},
      x: hasRow && {value: 0},
      height: hasRow && {'value': layout.cellHeight}, //HACK?
      from: from
    });

    output.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (output.axes = output.axes || []);
    output.axes.push(compileAxis(COLUMN, model, layout, stats));
  } else { // doesn't have column
    if (model.has(Y)) {
      cellAxes.push(compileAxis(Y, model, layout, stats));
    }
  }

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  output.scales = (output.scales || []).concat(compileScales(
    compileScaleNames(enter).concat(singleScaleNames),
    model,
    layout,
    stats,
    true
  )); // row/column scales + cell scales

  if (cellAxes.length > 0) {
    group.axes = cellAxes;
  }

  // add facet transform
  var trans = (group.from.transform || (group.from.transform = []));
  trans.unshift({type: 'facet', groupby: facetKeys});

  return output;
}
