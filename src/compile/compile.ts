/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Config, initConfig} from '../config';
import * as log from '../log';
import {normalize, TopLevel, TopLevelExtendedSpec} from '../spec';
import {extractTopLevelProperties, TopLevelProperties} from '../toplevelprops';
import {extend, keys} from '../util';
import {buildModel} from './common';
import {Model} from './model';
import {assembleTopLevelSignals} from './selection/selection';

export function compile(inputSpec: TopLevelExtendedSpec, logger?: log.LoggerInterface) {
  if (logger) {
    // set the singleton logger to the provided logger
    log.set(logger);
  }

  try {
    // 1. Convert input spec into a normal form
    // (Decompose all extended unit specs into composition of unit spec.)
    const spec = normalize(inputSpec);

    // 2. Instantiate the model with default config
    const config = initConfig(inputSpec.config);
    const model = buildModel(spec, null, '', config);

    // 3. Parse each part of the model to produce components that will be assembled later
    // We traverse the whole tree to parse once for each type of components
    // (e.g., data, layout, mark, scale).
    // Please see inside model.parse() for order for compilation.
    model.parse();

    // 4. Assemble a Vega Spec from the parsed components in 3.
    return assemble(model, getTopLevelProperties(inputSpec, config));
  } finally {
    // Reset the singleton logger if a logger is provided
    if (logger) {
      log.reset();
    }
  }
}


function getTopLevelProperties(topLevelSpec: TopLevel<any>, config: Config) {
  return {
    ...extractTopLevelProperties(config),
    ...extractTopLevelProperties(topLevelSpec),
  };
}

function assemble(model: Model, topLevelProperties: TopLevelProperties) {
  // TODO: change type to become VgSpec
  const output = {
    $schema: 'http://vega.github.io/schema/vega/v3.0.json',
    ...(model.description ? {description: model.description} : {}),
    autosize: 'pad', // By using Vega layout, we don't support custom autosize
    ...topLevelProperties,
    data: [].concat(
      model.assembleData(),
      model.assembleSelectionData([])
    ),
    ...model.assembleGroup(
      [].concat(
        // TODO(https://github.com/vega/vega-lite/issues/2198):
        // Merge the top-level's width/height signal with the top-level model
        // so we can remove this special casing based on model.name
        (
          model.name ? [
            // If model has name, its calculated width and height will not be named width and height, need to map it to the global width and height signals.
            {name: 'width', update: model.getName('width')},
            {name: 'height', update: model.getName('height')}
          ] : []
        ),

        model.assembleLayoutSignals(),
        assembleTopLevelSignals(model)
      )
    )
  };

  return {
    spec: output
    // TODO: add warning / errors here
  };
}
