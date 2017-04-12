/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Config, initConfig} from '../config';
import {LAYOUT} from '../data';
import * as log from '../log';
import {ExtendedSpec, normalize, TopLevel} from '../spec';
import {extractTopLevelProperties, TopLevelProperties} from '../toplevelprops';
import {extend} from '../util';
import {buildModel} from './common';
import {Model} from './model';
import {assembleTopLevelSignals} from './selection/selection';

export function compile(inputSpec: TopLevel<ExtendedSpec>, logger?: log.LoggerInterface) {
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
  const output = extend(
    {
      $schema: 'http://vega.github.io/schema/vega/v3.0.json',
    },
    {autosize: 'pad'}, // Currently we don't support custom autosize
    topLevelProperties,
    {
      // Map calculated layout width and height to width and height signals.
      signals: [
        {
          name: 'width',
          update: `data('${model.getName(LAYOUT)}')[0].${model.getName('width')}`
        },
        {
          name: 'height',
          update: `data('${model.getName(LAYOUT)}')[0].${model.getName('height')}`
        }
      ].concat(assembleTopLevelSignals(model))
    },{
      data: [].concat(
        model.assembleData(),
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

export function assembleRootGroup(model: Model) {
  const rootGroup = extend(
    {
      name: model.getName('main-group'),
      type: 'group',
    },
    model.description ? {description: model.description} : {},
    {
      from: {data: model.getName(LAYOUT)},
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
