import * as util from '../util';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {FieldDef} from '../schema/fielddef.schema';
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileScales} from './scale';

export default function(group, model: Model, layout, output, stats) {
  var update = group.properties.update;
  var facetKeys = [], cellAxes = [], from;

  var hasRow = model.has(ROW), hasCol = model.has(COLUMN);

  update.fill = {value: model.config('cellBackgroundColor')};

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
      // TODO: add error to model instead
      util.error('Row encoding should be ordinal.');
    }
    update.y = {scale: ROW, field: model.fieldRef(ROW)};
    update.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(model.fieldRef(ROW));

    if (hasCol) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', groupby: [model.fieldRef(COLUMN)]});
    }

    if (model.has(X)) {
      // prepend a group for shared x-axes in the root group's marks
      output.marks.unshift({
        name: 'x-axes',
        type: 'group',
        from: from,
        properties: {
          update: {
            width: hasCol ? {'value': layout.cellWidth} : {field: {group: 'width'}},
            height: {field: {group: 'height'}},
            x: hasCol ? {scale: COLUMN, field: model.fieldRef(COLUMN)} : {value: 0},
          }
        },
        axes: [compileAxis(X, model, layout, stats)]
      });
    }


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
      // TODO: add error to model instead
      util.error('Col encoding should be ordinal.');
    }
    update.x = {scale: COLUMN, field: model.fieldRef(COLUMN)};
    update.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(model.fieldRef(COLUMN));

    if (hasRow) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', groupby: [model.fieldRef(ROW)]});
    }

    if (model.has(Y)) {
      // prepend a group for shared y-axes in the root group's marks
      output.marks.unshift({
        name: 'y-axes',
        type: 'group',
        from: from,
        properties: {
          update: {
            width: {field: {group: 'width'}},
            height: hasRow ? {'value': layout.cellHeight} : {field: {group: 'height'}},
            x: hasCol ? {scale: COLUMN, field: model.fieldRef(COLUMN)} : {value: 0},
          }
        },
        axes: [compileAxis(Y, model, layout, stats)]
      });

    }

    (output.axes = output.axes || []);
    output.axes.push(compileAxis(COLUMN, model, layout, stats));
  } else { // doesn't have column
    if (model.has(Y)) {
      cellAxes.push(compileAxis(Y, model, layout, stats));
    }
  }

  const scaleNames = model.reduce(
    function(names: Channel[], fieldDef: FieldDef, channel: Channel){
      names.push(channel);
      return names;
    }, []);

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  output.scales = (output.scales || []).concat(compileScales(
    scaleNames,
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
