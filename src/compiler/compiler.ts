/**
 * Module for compiling Vega-lite spec into Vega spec.
 */

import {summary} from '../util';
import {Encoding} from '../Encoding';

import * as axis from './axis';
import * as legend from './legend';
import * as marks from './marks';
import * as scale from './scale';

import * as data from './data';
import * as vlFacet from './facet';
import * as vlLayout from './layout';
import * as vlStack from './stack';
import * as vlStyle from './style';
import * as subfacet from './subfacet';
import * as time from './time';

import {X, Y, ROW, COL, SOURCE} from '../consts';
import {Q, O, N, T} from '../consts';

export function compile(spec, stats, theme) {
  return compileEncoding(Encoding.fromSpec(spec, theme), stats);
};

export function shorthand(shorthand, stats, config, theme) {
  return compileEncoding(Encoding.fromShorthand(shorthand, config, theme), stats);
};

/**
 * Create a Vega specification from a Vega-lite Encoding object.
 */
export function compileEncoding(encoding, stats) {
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

  var layout = vlLayout.def(encoding, stats);

  var output:any = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: data.def(encoding),
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
  var timeScales = time.scales(encoding);
  if (timeScales.length > 0) {
    output.scales = timeScales;
  }

  var group = output.marks[0];

  // marks
  var styleCfg = vlStyle.def(encoding, stats),
    mdefs = group.marks = marks.def(encoding, layout, styleCfg),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

  var stack = encoding.stack();
  if (stack) {
    // modify mdef.{from,properties}
    vlStack.def(encoding, mdef, stack);
  }

  var lineType = marks[encoding.marktype()].line;

  // handle subfacets
  var details = encoding.details();

  if (details.length > 0 && lineType) {
    //subfacet to group area / line together in one group
    subfacet.def(group, mdef, details);
  }

  // auto-sort line/area values
  if (lineType && encoding.config('autoSortLine')) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) {
      mdef.from = {};
    }
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.fieldRef(f)}];
  }

  // get a flattened list of all scale names that are used in the vl spec
  var singleScaleNames = [].concat.apply([], mdefs.map(function(markProps) {
    return scale.names(markProps.properties.update);
  }));

  var legends = legend.defs(encoding, styleCfg);

  // Small Multiples
  if (encoding.has(ROW) || encoding.has(COL)) {
    output = vlFacet.def(group, encoding, layout, output, singleScaleNames, stats);
    if (legends.length > 0) {
      output.legends = legends;
    }
  } else {
    group.scales = scale.defs(singleScaleNames, encoding, layout, stats);

    var axes = [];
    if (encoding.has(X)) {
      axes.push(axis.def(X, encoding, layout, stats));
    }
    if (encoding.has(Y)) {
      axes.push(axis.def(Y, encoding, layout, stats));
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
