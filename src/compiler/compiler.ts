/**
 * Module for compiling Vega-lite spec into Vega spec.
 */

import {summary} from '../util';
import {Model} from './Model';

import * as vlScale from './scale';
import * as vlTime from './time';
import * as vlAxis from './axis';
import * as vlLegend from './legend';
import * as vlMarks from './marks';
import vlData from './data';
import vlFacet from './facet';
import vlLayout from './layout';
import vlStack from './stack';
import vlStyle from './style';
import vlSubfacet from './subfacet';
import {COL, ROW, X, Y} from '../channel';


export function compile(spec, stats, theme?) {
  return compileModel(new Model(spec, theme), stats);
}

/**
 * Create a Vega specification from a Vega-lite Model object.
 */
function compileModel(model: Model, stats) {
  // no need to pass stats if you pass in the data
  if (!stats) {
    if (model.hasValues()) {
        stats = summary(model.data().values).reduce(function(s, p) {
        s[p.field] = p;
        return s;
      }, {});
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
      data: vlData(model),
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
  if (model.has(ROW) || model.has(COL)) {
    output = vlFacet(group, model, layout, output, singleScaleNames, stats);
    if (legends.length > 0) {
      output.legends = legends;
    }
  } else {
    group.scales = vlScale.defs(singleScaleNames, model, layout, stats);

    var axes = [];
    if (model.has(X)) {
      axes.push(vlAxis.def(X, model, layout, stats));
    }
    if (model.has(Y)) {
      axes.push(vlAxis.def(Y, model, layout, stats));
    }
    if (axes.length > 0) {
      group.axes = axes;
    }

    if (legends.length > 0) {
      group.legends = legends;
    }
  }

  return output;
}
