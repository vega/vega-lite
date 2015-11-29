/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileData} from './data';
import {facetMixins} from './facet';
import {compileLegends} from './legend';
import {compileMarks} from './marks';
import {compileScales} from './scale';
import * as vlTime from './time';
import {extend} from '../util';

import {LAYOUT} from '../data';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {FieldDef} from '../schema/fielddef.schema';

export {Model} from './Model';

export function compile(spec, theme?) {
  var model = new Model(spec, theme);
  const layout = model.layout();

  var rootGroup:any = {
    name: 'root',
    type: 'group',
    from: {data: LAYOUT},
    properties: {
      update: {
        width: layout.width.field ?
               {field: layout.width.field} :
               {value: layout.width},
        height: layout.height.field ?
                {field: layout.height.field} :
                {value: layout.height}
      }
    }
  };

  const marks = compileMarks(model);

  // Small Multiples
  if (model.has(ROW) || model.has(COLUMN)) {
    // put the marks inside a facet cell's group
    extend(rootGroup, facetMixins(model, marks));
  } else {
    rootGroup.marks = marks.map(function(marks) {
      marks.from = marks.from || {};
      marks.from.data = model.dataTable();
      return marks;
    });
    const scaleNames = model.map(function(_, channel: Channel){
        return channel; // TODO model.scaleName(channel)
      });
    rootGroup.scales = compileScales(scaleNames, model);

    var axes = (model.has(X) ? [compileAxis(X, model)] : [])
      .concat(model.has(Y) ? [compileAxis(Y, model)] : []);
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
      // FIXME replace 'singleWidth|Height' below with 'auto' once Vega has it.
      width: layout.width.field ? model.config('singleWidth') : layout.width,
      height: layout.height.field ? model.config('singleHeight') : layout.height,
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
