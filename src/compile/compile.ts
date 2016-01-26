/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileData} from './data';
import {facetMixins} from './facet';
import {compileLegends} from './legend';
import {compileMark} from './mark';
import {compileScales} from './scale';
import {extend, keys} from '../util';

import {LAYOUT} from '../data';
import {COLUMN, ROW, X, Y} from '../channel';

export {Model} from './Model';

export function compile(spec) {
  const model = new Model(spec);
  const layout = model.layout();

  // FIXME replace FIT with appropriate mechanism once Vega has it
  const FIT = 1;

  const config = model.config();

  // TODO: change type to become VgSpec
  const output = extend(
    spec.name ? { name: spec.name } : {},
    {
      width: typeof layout.width !== 'number' ? FIT : layout.width,
      height: typeof layout.height !== 'number' ? FIT : layout.height,
      padding: 'auto'
    },
    config.viewport ? { viewport: config.viewport } : {},
    config.background ? { background: config.background } : {},
    keys(config.scene).length > 0 ? scene(config) : {},
    {
      data: compileData(model),
      marks: [compileRootGroup(model)]
    });

  return {
    spec: output
    // TODO: add warning / errors here
  };
}

function scene(config) {
  return ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
    'strokeOpacity', 'strokeDash', 'strokeDashOffset'].
      reduce(function(topLevelConfig: any, property) {
      const value = config.scene[property];
      if (value !== undefined) {
        topLevelConfig.scene = topLevelConfig.scene || {};
        topLevelConfig.scene[property] = {value: value};
      }
      return topLevelConfig;
  }, {});
}

export function compileRootGroup(model: Model) {
  const spec = model.spec();
  const width = model.layout().width;
  const height = model.layout().height;

  let rootGroup:any = extend({
      name: spec.name ? spec.name + '-root' : 'root',
      type: 'group',
    },
    spec.description ? {description: spec.description} : {},
    {
      from: {data: LAYOUT},
      properties: {
        update: {
          width: typeof width !== 'number' ?
                 {field: width.field} :
                 {value: width},
          height: typeof height !== 'number' ?
                  {field: height.field} :
                  {value: height}
        }
      }
    });

  const marks = compileMark(model);

  // Small Multiples
  if (model.has(ROW) || model.has(COLUMN)) {
    // put the marks inside a facet cell's group
    extend(rootGroup, facetMixins(model, marks));
  } else {
    rootGroup.marks = marks;
    rootGroup.scales = compileScales(model.channels(), model);

    var axes = (model.has(X) && model.fieldDef(X).axis ? [compileAxis(X, model)] : [])
      .concat(model.has(Y) && model.fieldDef(Y).axis ? [compileAxis(Y, model)] : []);
    if (axes.length > 0) {
      rootGroup.axes = axes;
    }
  }

  // legends (similar for either facets or non-facets
  var legends = compileLegends(model);
  if (legends.length > 0) {
    rootGroup.legends = legends;
  }
  return rootGroup;
}
