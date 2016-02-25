/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Model} from './Model';

import {compileAxis} from './axis';
import {compileData} from './data';
import {compileLayoutData} from './layout';
import {facetMixins} from './facet';
import {compileLegends} from './legend';
import {compileMark} from './mark/mark';
import {compileScales} from './scale';
import {applyConfig, FILL_STROKE_CONFIG} from './common';
import {extend} from '../util';

import {LAYOUT} from '../data';
import {COLUMN, ROW, X, Y} from '../channel';

export {Model} from './Model';

export function compile(spec) {
  const model = new Model(spec);
  const config = model.config();

  // TODO: change type to become VgSpec
  const output = extend(
    spec.name ? { name: spec.name } : {},
    {
      // Set size to 1 because we rely on padding anyway
      width: 1,
      height: 1,
      padding: 'auto'
    },
    config.viewport ? { viewport: config.viewport } : {},
    config.background ? { background: config.background } : {},
    {
      data: compileData(model).concat([compileLayoutData(model)]),
      marks: [compileRootGroup(model)]
    });

  return {
    spec: output
    // TODO: add warning / errors here
  };
}

export function compileRootGroup(model: Model) {
  const spec = model.spec();

  let rootGroup:any = extend({
      name: spec.name ? spec.name + '-root' : 'root',
      type: 'group',
    },
    spec.description ? {description: spec.description} : {},
    {
      from: {data: LAYOUT},
      properties: {
        update: {
          width: {field: 'width'},
          height: {field: 'height'}
        }
      }
    });

  const marks = compileMark(model);

  // Small Multiples
  if (model.has(ROW) || model.has(COLUMN)) {
    // put the marks inside a facet cell's group
    extend(rootGroup, facetMixins(model, marks));
  } else {
    applyConfig(rootGroup.properties.update, model.config().cell, FILL_STROKE_CONFIG.concat(['clip']));
    rootGroup.marks = marks;
    rootGroup.scales = compileScales(model);

    const axes = (model.has(X) && model.axis(X) ? [compileAxis(X, model)] : [])
      .concat(model.has(Y) && model.axis(Y) ? [compileAxis(Y, model)] : []);
    if (axes.length > 0) {
      rootGroup.axes = axes;
    }
  }

  // legends (similar for either facets or non-facets
  const legends = compileLegends(model);
  if (legends.length > 0) {
    rootGroup.legends = legends;
  }
  return rootGroup;
}
