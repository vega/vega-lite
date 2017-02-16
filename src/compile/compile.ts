/**
 * Module for compiling Vega-lite spec into Vega spec.
 */

import {LAYOUT} from '../data';
import * as log from '../log';
import {Model} from './model';
import {normalize, ExtendedSpec} from '../spec';
import {extend} from '../util';
import {assembleTopLevelSignals} from './selection/selection';
import {buildModel} from './common';

export function compile(inputSpec: ExtendedSpec, logger?: log.LoggerInterface) {
  if (logger) {
    // set the singleton logger to the provided logger
    log.set(logger);
  }

  try {
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
  } finally {
    // Reset the singleton logger if a logger is provided
    if (logger) {
      log.reset();
    }
  }
}

function assemble(model: Model) {
  // TODO: change type to become VgSpec
  const output = extend(
    {
      $schema: 'http://vega.github.io/schema/vega/v3.0.json',
    },
    topLevelBasicProperties(model),
    {
      // Map calculated layout width and height to width and height signals.
      signals: [
        {
          name: 'width',
          update: "data('layout')[0].width"
        },
        {
          name: 'height',
          update: "data('layout')[0].height"
        }
      ].concat(assembleTopLevelSignals(model))
    },{
      data: [].concat(
        model.assembleData([]),
        model.assembleLayout([]),
        model.assembleSelectionData([])
      ),
      marks: [assembleRootGroup(model)]
    });

  return {
    spec: output
    // TODO: add warning / errors here
  };
}

export function topLevelBasicProperties(model: Model) {
  const config = model.config;
  return extend(
    // TODO: Add other top-level basic properties (#1778)
    {padding: model.padding || config.padding},
    {autosize: 'pad'},
    config.viewport ? {viewport: config.viewport} : {},
    config.background ? {background: config.background} : {}
  );
}

export function assembleRootGroup(model: Model) {
  let rootGroup:any = extend(
    {
      name: model.getName('main'),
      type: 'group',
    },
    model.description ? {description: model.description} : {},
    {
      from: {data: model.getName(LAYOUT +'')},
      encode: {
        update: extend(
          {
            width: {field: model.getName('width')},
            height: {field: model.getName('height')}
          },
          model.assembleParentGroupProperties(model.config.cell)
        )
      }
    });

  return extend(rootGroup, model.assembleGroup());
}
