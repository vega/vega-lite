/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Model} from './Model';

import * as vlTime from './time';
import {compileAxis} from './axis';
import {compileData} from './data';
import {compileLegends} from './legend';
import {compileMarks} from './marks';
import {compileScales} from './scale';

// TODO: stop using default if we were to keep these files
import vlFacet from './facet';
import vlLayout from './layout';
import vlStyle from './style';

import {stats as vlDataStats} from '../data';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {FieldDef} from '../schema/fielddef.schema';

export {Model} from './Model';

export function compile(spec, stats, theme?) {
  var model = new Model(spec, theme);
  // no need to pass stats if you pass in the data
  if (!stats) {
    if (model.hasValues()) {
        stats = vlDataStats(model.data().values);
    } else {
      console.error('No stats provided and data is not embedded.');
    }
  }

  var layout = vlLayout(model, stats);

  // TODO: change type to become VgSpec
  var output:any = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: compileData(model),
      marks: [{
        name: 'cell',
        type: 'group',
        properties: {
          update: {
            width: model.has(COLUMN) ?
                     {value: layout.cellWidth} :
                     {field: {group: 'width'}},
            height: model.has(ROW) ?
                    {value: layout.cellHeight} :
                    {field: {group: 'height'}}
          }
        }
      }]
    };

  // global scales contains only time unit scales
  var timeScales = vlTime.scales(model);
  if (timeScales.length > 0) {
    output.scales = timeScales;
  }
  var group = output.marks[0];

  // marks
  var styleCfg = vlStyle(model, stats),
    mdefs = group.marks = compileMarks(model, layout, styleCfg);

  var legends = compileLegends(model, styleCfg);

  // Small Multiples
  if (model.has(ROW) || model.has(COLUMN)) {
    output = vlFacet(group, model, layout, output, stats);
    if (legends.length > 0) {
      output.legends = legends;
    }
  } else {
    const scaleNames = model.reduce(
      function(names: Channel[], fieldDef: FieldDef, channel: Channel){
        names.push(channel);
        return names;
      }, []);
    group.scales = compileScales(scaleNames, model, layout, stats);

    var axes = [];
    if (model.has(X)) {
      axes.push(compileAxis(X, model, layout, stats));
    }
    if (model.has(Y)) {
      axes.push(compileAxis(Y, model, layout, stats));
    }
    if (axes.length > 0) {
      group.axes = axes;
    }

    if (legends.length > 0) {
      group.legends = legends;
    }
  }

  return {
    spec: output
    // TODO: add warning / errors here
  };
}
