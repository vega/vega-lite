import * as util from '../util';
import {Enctype} from '../consts';

import axis from './axis';
import * as scale from './scale';

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

export default function(group, encoding, layout, output, singleScaleNames, stats) {
  var enter = group.properties.enter;
  var facetKeys = [], cellAxes = [], from, axesGrp;

  var hasRow = encoding.has(Enctype.ROW), hasCol = encoding.has(Enctype.COL);

  enter.fill = {value: encoding.config('cellBackgroundColor')};

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
    if (!encoding.isDimension(Enctype.ROW)) {
      util.error('Row encoding should be ordinal.');
    }
    enter.y = {scale: Enctype.ROW, field: encoding.fieldRef(Enctype.ROW)};
    enter.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(encoding.fieldRef(Enctype.ROW));

    if (hasCol) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', groupby: [encoding.fieldRef(Enctype.COL)]});
    }

    axesGrp = groupdef('x-axes', {
        axes: encoding.has(Enctype.X) ? [axis(Enctype.X, encoding, layout, stats)] : undefined,
        x: hasCol ? {scale: Enctype.COL, field: encoding.fieldRef(Enctype.COL)} : {value: 0},
        width: hasCol && {'value': layout.cellWidth}, //HACK?
        from: from
      });

    output.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (output.axes = output.axes || []);
    output.axes.push(axis(Enctype.ROW, encoding, layout, stats));
  } else { // doesn't have row
    if (encoding.has(Enctype.X)) {
      //keep x axis in the cell
      cellAxes.push(axis(Enctype.X, encoding, layout, stats));
    }
  }

  if (hasCol) {
    if (!encoding.isDimension(Enctype.COL)) {
      util.error('Col encoding should be ordinal.');
    }
    enter.x = {scale: Enctype.COL, field: encoding.fieldRef(Enctype.COL)};
    enter.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(encoding.fieldRef(Enctype.COL));

    if (hasRow) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', groupby: [encoding.fieldRef(Enctype.ROW)]});
    }

    axesGrp = groupdef('y-axes', {
      axes: encoding.has(Enctype.Y) ? [axis(Enctype.Y, encoding, layout, stats)] : undefined,
      y: hasRow && {scale: Enctype.ROW, field: encoding.fieldRef(Enctype.ROW)},
      x: hasRow && {value: 0},
      height: hasRow && {'value': layout.cellHeight}, //HACK?
      from: from
    });

    output.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (output.axes = output.axes || []);
    output.axes.push(axis(Enctype.COL, encoding, layout, stats));
  } else { // doesn't have col
    if (encoding.has(Enctype.Y)) {
      cellAxes.push(axis(Enctype.Y, encoding, layout, stats));
    }
  }

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  output.scales = (output.scales || []).concat(scale.defs(
    scale.names(enter).concat(singleScaleNames),
    encoding,
    layout,
    stats,
    true
  )); // row/col scales + cell scales

  if (cellAxes.length > 0) {
    group.axes = cellAxes;
  }

  // add facet transform
  var trans = (group.from.transform || (group.from.transform = []));
  trans.unshift({type: 'facet', groupby: facetKeys});

  return output;
}
