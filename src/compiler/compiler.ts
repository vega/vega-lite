/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Model} from './Model';

import * as vlScale from './scale';
import * as vlTime from './time';
import {compileAxis} from './axis';
import {compileData} from './data';
import * as vlLegend from './legend';
import * as vlMarks from './marks';
import vlFacet from './facet';
import vlLayout from './layout';
import vlStack from './stack';
import vlStyle from './style';
import vlSubfacet from './subfacet';

import * as vlData from '../data';
import {COLUMN, ROW, X, Y} from '../channel';

export {Model} from './Model';

export function compile(spec, stats, theme?) {
  var model = new Model(spec, theme);
  // no need to pass stats if you pass in the data
  if (!stats) {
    if (model.hasValues()) {
        stats = vlData.stats(model.data().values);
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
          enter: {
            width: layout.cellWidth ?
                     {value: layout.cellWidth} :
                     {field: {group: 'width'}},
            height: layout.cellHeight ?
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
    mdefs = group.marks = vlMarks.defs(model, layout, styleCfg),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

  var stack = model.stack();
  if (stack) {
    // modify mdef.{from,properties}
    vlStack(model, mdef, stack);
  }

  var lineType = vlMarks[model.marktype()].line;

  // handle subfacets
  var details = model.details();

  if (details.length > 0 && lineType) {
    //subfacet to group area / line together in one group
    vlSubfacet(group, mdef, details);
  }

  // auto-sort line/area values
  if (lineType && model.config('autoSortLine')) {
    var f = (model.isMeasure(X) && model.isDimension(Y)) ? Y : X;
    if (!mdef.from) {
      mdef.from = {};
    }
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + model.fieldRef(f)}];
  }

  // get a flattened list of all scale names that are used in the vl spec
  var singleScaleNames = [].concat.apply([], mdefs.map(function(markProps) {
    return vlScale.names(markProps.properties.update);
  }));

  var legends = vlLegend.defs(model, styleCfg);

  // Small Multiples
  if (model.has(ROW) || model.has(COLUMN)) {
    output = vlFacet(group, model, layout, output, singleScaleNames, stats);
    if (legends.length > 0) {
      output.legends = legends;
    }
  } else {
    group.scales = vlScale.defs(singleScaleNames, model, layout, stats);

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
