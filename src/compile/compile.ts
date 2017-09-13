import {Config, initConfig, stripAndRedirectConfig} from '../config';
import * as log from '../log';
import {isLayerSpec, isUnitSpec, LayoutSizeMixins, normalize, TopLevel, TopLevelExtendedSpec} from '../spec';
import {AutoSizeParams, extractTopLevelProperties, normalizeAutoSize, TopLevelProperties} from '../toplevelprops';
import {keys} from '../util';
import {buildModel} from './buildmodel';
import {assembleRootData} from './data/assemble';
import {optimizeDataflow} from './data/optimize';
import {Model} from './model';

/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
export function compile(inputSpec: TopLevelExtendedSpec, logger?: log.LoggerInterface) {
  if (logger) {
    // set the singleton logger to the provided logger
    log.set(logger);
  }

  try {
    // 1. initialize config
    const config = initConfig(inputSpec.config);

    // 2. Convert input spec into a normalized form
    // (Normalize autosize to be a autosize properties object.)
    // (Decompose all extended unit specs into composition of unit spec.)
    const spec = normalize(inputSpec, config);

    // 3. Instantiate the models with default config by doing a top-down traversal.
    // This allows us to pass properties that child models derive from their parents via their constructors.
    const autosize = normalizeAutoSize(inputSpec.autosize, isLayerSpec(spec) || isUnitSpec(spec));
    const model = buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');

    // 4. Parse parts of each model to produce components that can be merged
    // and assembled easily as a part of a model.
    // In this phase, we do a bottom-up traversal over the whole tree to
    // parse for each type of components once (e.g., data, layout, mark, scale).
    // By doing bottom-up traversal, we start parsing components of unit specs and
    // then merge child components of parent composite specs.
    //
    // Please see inside model.parse() for order of different components parsed.
    model.parse();

    // 5. Optimize the datafow.
    optimizeDataflow(model.component.data);

    // 6. Assemble a Vega Spec from the parsed components.
    return assembleTopLevelModel(model, getTopLevelProperties(inputSpec, config, autosize));
  } finally {
    // Reset the singleton logger if a logger is provided
    if (logger) {
      log.reset();
    }
  }
}


function getTopLevelProperties(topLevelSpec: TopLevel<any>, config: Config, autosize: AutoSizeParams) {
  return {
    autosize: keys(autosize).length === 1 && autosize.type ? autosize.type : autosize,
    ...extractTopLevelProperties(config),
    ...extractTopLevelProperties(topLevelSpec)
  };
}

/*
 * Assemble the top-level model.
 *
 * Note: this couldn't be `model.assemble()` since the top-level model
 * needs some special treatment to generate top-level properties.
 */
function assembleTopLevelModel(model: Model, topLevelProperties: TopLevelProperties & LayoutSizeMixins) {
  // TODO: change type to become VgSpec

  // Config with Vega-Lite only config removed.
  const vgConfig = model.config ? stripAndRedirectConfig(model.config) : undefined;
  const title = model.assembleTitle();
  const style = model.assembleGroupStyle();

  let layoutSignals = model.assembleLayoutSignals();

  // move width and height signals with values to top level
  layoutSignals = layoutSignals.filter(signal => {
    if ((signal.name === 'width' || signal.name === 'height') && signal.value !== undefined) {
      topLevelProperties[signal.name] = signal.value;
      return false;
    }
    return true;
  });

  const output = {
    $schema: 'https://vega.github.io/schema/vega/v3.0.json',
    ...(model.description ? {description: model.description} : {}),
    ...topLevelProperties,
    ...(title? {title} : {}),
    ...(style? {style} : {}),
    data: [].concat(
      model.assembleSelectionData([]),
      // only assemble data in the root
      assembleRootData(model.component.data)
    ),
    ...model.assembleGroup([
      ...layoutSignals,
      ...model.assembleSelectionTopLevelSignals([])
    ]),
    ...(vgConfig ? {config: vgConfig} : {})
  };

  return {
    spec: output
    // TODO: add warning / errors here
  };
}
