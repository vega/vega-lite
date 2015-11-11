/**
 * Module for compiling Vega-lite spec into Vega spec.
 */

import {summary} from '../util';
import Encoding from '../Encoding';

import * as vlScale from './scale';
import * as vlTime from './time';
import * as vlAxis from './axis';
import * as vlLegend from './legend';
import * as vlMarks from './marks';
import {getMark} from './marks';
import vlData from './data';
import vlFacet from './facet';
import vlLayout from './layout';
import vlStack from './stack';
import vlStyle from './style';
import vlSubfacet from './subfacet';

import {Enctype, Type} from '../consts';

export function compile(spec, stats, theme?) {
  return compileEncoding(Encoding.fromSpec(spec, theme), stats);
};

export function shorthand(shorthand: string, stats, config, theme) {
  return compileEncoding(Encoding.fromShorthand(shorthand, config, theme), stats);
};

/**
 * Create a Vega specification from a Vega-lite Encoding object.
 */
export function compileEncoding(encoding: Encoding, stats) {
  // no need to pass stats if you pass in the data
  if (!stats) {
    if (encoding.hasValues()) {
        stats = summary(encoding.data().values).reduce(function(s, p) {
        s[p.field] = p;
        return s;
      }, {});
    } else {
      console.error('No stats provided and data is not embedded.');
    }
  }

  var layout = vlLayout(encoding, stats);

  // TODO: change type to become VgSpec
  var output:any = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: vlData(encoding),
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
  var timeScales = vlTime.scales(encoding);
  if (timeScales.length > 0) {
    output.scales = timeScales;
  }

  var group = output.marks[0];

  // marks
  var styleCfg = vlStyle(encoding, stats),
    mdefs = group.marks = vlMarks.defs(encoding, layout, styleCfg),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

  var stack = encoding.stack();
  if (stack) {
    // modify mdef.{from,properties}
    vlStack(encoding, mdef, stack);
  }

  var lineType = getMark(encoding.marktype()).line;

  // handle subfacets
  var details = encoding.details();

  if (details.length > 0 && lineType) {
    //subfacet to group area / line together in one group
    vlSubfacet(group, mdef, details);
  }

  // auto-sort line/area values
  if (lineType && encoding.config('autoSortLine')) {
    var f = (encoding.isMeasure(Enctype.X) && encoding.isDimension(Enctype.Y)) ? Enctype.Y : Enctype.X;
    if (!mdef.from) {
      mdef.from = {};
    }
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.fieldRef(f)}];
  }

  // get a flattened list of all scale names that are used in the vl spec
  var singleScaleNames = [].concat.apply([], mdefs.map(function(markProps) {
    return vlScale.names(markProps.properties.update);
  }));

  var legends = vlLegend.defs(encoding, styleCfg);

  // Small Multiples
  if (encoding.has(Enctype.ROW) || encoding.has(Enctype.COL)) {
    output = vlFacet(group, encoding, layout, output, singleScaleNames, stats);
    if (legends.length > 0) {
      output.legends = legends;
    }
  } else {
    group.scales = vlScale.defs(singleScaleNames, encoding, layout, stats);

    var axes = [];
    if (encoding.has(Enctype.X)) {
      axes.push(vlAxis.def(Enctype.X, encoding, layout, stats));
    }
    if (encoding.has(Enctype.Y)) {
      axes.push(vlAxis.def(Enctype.Y, encoding, layout, stats));
    }
    if (axes.length > 0) {
      group.axes = axes;
    }

    if (legends.length > 0) {
      group.legends = legends;
    }
  }

  return output;
};
