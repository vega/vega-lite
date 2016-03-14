/**
 * Module for compiling Vega-lite spec into Vega spec.
 */

import {LAYOUT} from '../data';
import {Model} from './model';
import {normalize, ExtendedSpec} from '../spec';
import {extend} from '../util';

import {buildModel} from './common';

export function compile(inputSpec: ExtendedSpec) {
  // 1. Convert input spec into a normal form
  // (Decompose all extended unit specs into composition of unit spec.)
  const spec = normalize(inputSpec);

  // 2. Instantiate the model with default properties
  const model = buildModel(spec, null, '');

  // 3. Parse each part of the model to produce components that will be assembled later
  // We traverse the whole tree to parse once for each type of components
  // (e.g., data, layout, mark, scale).
  // Please see inside model.parse() for order for compilation.
  model.parse();

  // 4. Assemble a Vega Spec from the parsed components in 3.
  return assemble(model);
}

function assemble(model: Model) {
  const config = model.config();

  // TODO: change type to become VgSpec
  const output = extend(
    {
      // Set size to 1 because we rely on padding anyway
      width: 1,
      height: 1,
      padding: 'auto'
    },
    config.viewport ? { viewport: config.viewport } : {},
    config.background ? { background: config.background } : {},
    {
      // TODO: signal: model.assembleSelectionSignal
      data: [].concat(
        model.assembleData([]),
        model.assembleLayout([])
        // TODO: model.assembleSelectionData
      ),
      marks: [assembleRootGroup(model)]
    });

  return {
    spec: output
    // TODO: add warning / errors here
  };
}

export function assembleRootGroup(model: Model) {
  let rootGroup:any = extend({
      name: model.name('root'),
      type: 'group',
    },
    model.description() ? {description: model.description()} : {},
    {
      from: {data: LAYOUT},
      properties: {
        update: extend(
          {
            width: {field: 'width'},
            height: {field: 'height'}
          },
          model.assembleParentGroupProperties(model.config().cell)
        )
      }
    });

  return extend(rootGroup, model.assembleGroup());
}
