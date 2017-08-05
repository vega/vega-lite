/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
import {Config, initConfig, stripConfig} from '../config';
import * as log from '../log';
import {normalize, TopLevel, TopLevelExtendedSpec} from '../spec';
import {extractTopLevelProperties, TopLevelProperties} from '../toplevelprops';
import {extend, keys} from '../util';
import {buildModel} from './common';
import {LayerModel} from './layer';
import {Model} from './model';
import {UnitModel} from './unit';


export function compile(inputSpec: TopLevelExtendedSpec, logger?: log.LoggerInterface) {
  if (logger) {
    // set the singleton logger to the provided logger
    log.set(logger);
  }

  try {
    // 1. initialize config
    const config = initConfig(inputSpec.config);

    // 2. Convert input spec into a normalized form
    // (Decompose all extended unit specs into composition of unit spec.)
    const spec = normalize(inputSpec, config);

    // 3. Instantiate the models with default config by doing a top-down traversal.
    // This allows us to pass properties that child models derive from their parents via their constructors.
    const model = buildModel(spec, null, '', undefined, undefined, config);

    // 4. Parse parts of each model to produce components that can be merged
    // and assembled easily as a part of a model.
    // In this phase, we do a bottom-up traversal over the whole tree to
    // parse for each type of components once (e.g., data, layout, mark, scale).
    // By doing bottom-up traversal, we start parsing components of unit specs and
    // then merge child components of parent composite specs.
    //
    // Please see inside model.parse() for order of different components parsed.
    model.parse();

    // 5. Assemble a Vega Spec from the parsed components in 3.
    return assembleTopLevelModel(model, getTopLevelProperties(inputSpec, config));
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

/*
 * Assemble the top-level model.
 *
 * Note: this couldn't be `model.assemble()` since the top-level model
 * needs some special treatment to generate top-level properties.
 */
function assembleTopLevelModel(model: Model, topLevelProperties: TopLevelProperties) {
  // TODO: change type to become VgSpec

  // Config with Vega-Lite only config removed.
  const vgConfig = model.config ? stripConfig(model.config) : undefined;

  // autoResize has to be put under autosize
  const {autoResize, ...topLevelProps} = topLevelProperties;
  const title = model.assembleTitle();

  const encode = model.assembleParentGroupProperties();
  if (encode) {
    delete encode.width;
    delete encode.height;
  }

  const output = {
    $schema: 'https://vega.github.io/schema/vega/v3.0.json',
    ...(model.description ? {description: model.description} : {}),
    // By using Vega layout, we don't support custom autosize
    autosize: topLevelProperties.autoResize ? {type: 'pad', resize: true} : 'pad',
    ...topLevelProps,
    ...(title? {title} : {}),
    ...(encode ? {encode: {update: encode}} : {}),
    data: [].concat(
      model.assembleSelectionData([]),
      model.assembleData()
    ),
    ...model.assembleGroup([
      ...model.assembleLayoutSignals(),
      ...model.assembleSelectionTopLevelSignals([])
    ]),
    ...(vgConfig ? {config: vgConfig} : {})
  };

  return {
    spec: output
    // TODO: add warning / errors here
  };
}
