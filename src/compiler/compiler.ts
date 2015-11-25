/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Model} from './Model';

import * as vlTime from './time';
import {compileAxis} from './axis';
import {compileData} from './data';
import {facetMixins} from './facet';
import {compileLegends} from './legend';
import {compileMarks} from './marks';
import {compileScales} from './scale';

// TODO: stop using default if we were to keep these files
import vlLayout from './layout';
import * as util from '../util';

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

  var rootGroup:any = {
    name: 'root',
    type: 'group',
    // TODO: add from: {data: 'stats'}
    properties: {
      update: {
        // TODO replace with signal or inline calculation
        width: {value: layout.width},
        height: {value: layout.height}
      }
    }
  };

  const marks = compileMarks(model, layout);

  // Small Multiples
  if (model.has(ROW) || model.has(COLUMN)) {
    // put the marks inside a facet cell's group
    util.extend(rootGroup, facetMixins(model, marks, layout, stats));
  } else {
    rootGroup.marks = marks.map(function(marks) {
      marks.from = marks.from || {};
      marks.from.data = model.dataTable();
      return marks;
    });
    const scaleNames = model.map(function(_, channel: Channel){
        return channel; // TODO model.scaleName(channel)
      });
    rootGroup.scales = compileScales(scaleNames, model, layout, stats);

    var axes = (model.has(X) ? [compileAxis(X, model, layout, stats)] : [])
      .concat(model.has(Y) ? [compileAxis(Y, model, layout, stats)] : []);
    if (axes.length > 0) {
      rootGroup.axes = axes;
    }
  }

  // legends (similar for either facets or non-facets
  var legends = compileLegends(model);
  if (legends.length > 0) {
    rootGroup.legends = legends;
  }

  // TODO: change type to become VgSpec
  var output:any = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: compileData(model),
      marks: [rootGroup]
    };

  // FIXME(domoritz): remove this
  // global scales contains only time unit scales
  var timeScales = vlTime.scales(model);
  if (timeScales.length > 0) {
    output.scales = timeScales;
  }

  return {
    spec: output
    // TODO: add warning / errors here
  };
}
