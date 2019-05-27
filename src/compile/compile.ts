import {Spec as VgSpec, LoggerInterface} from 'vega';
import * as vlFieldDef from '../channeldef';
import {Config, initConfig, stripAndRedirectConfig} from '../config';
import * as log from '../log';
import {normalize} from '../normalize/index';
import {isLayerSpec, isUnitSpec, LayoutSizeMixins, TopLevel, TopLevelSpec} from '../spec';
import {
  AutoSizeParams,
  Datasets,
  extractTopLevelProperties,
  normalizeAutoSize,
  TopLevelProperties
} from '../spec/toplevel';
import {keys, mergeDeep} from '../util';
import {buildModel} from './buildmodel';
import {assembleRootData} from './data/assemble';
// import {draw} from './data/debug';
import {optimizeDataflow} from './data/optimize';
import {Model} from './model';

export interface CompileOptions {
  config?: Config;
  logger?: LoggerInterface;

  fieldTitle?: vlFieldDef.FieldTitleFormatter;
}

/**
 * Vega-Lite's main function, for compiling Vega-lite spec into Vega spec.
 *
 * At a high-level, we make the following transformations in different phases:
 *
 * Input spec
 *     |
 *     |  (Normalization)
 *     v
 * Normalized Spec (Row/Column channels in single-view specs becomes faceted specs, composite marks becomes layered specs.)
 *     |
 *     |  (Build Model)
 *     v
 * A model tree of the spec
 *     |
 *     |  (Parse)
 *     v
 * A model tree with parsed components (intermediate structure of visualization primitives in a format that can be easily merged)
 *     |
 *     | (Optimize)
 *     v
 * A model tree with parsed components with the data component optimized
 *     |
 *     | (Assemble)
 *     v
 * Vega spec
 */
export function compile(inputSpec: TopLevelSpec, opt: CompileOptions = {}) {
  // 0. Augment opt with default opts
  if (opt.logger) {
    // set the singleton logger to the provided logger
    log.set(opt.logger);
  }

  if (opt.fieldTitle) {
    // set the singleton field title formatter
    vlFieldDef.setTitleFormatter(opt.fieldTitle);
  }

  try {
    // 1. Initialize config by deep merging default config with the config provided via option and the input spec.
    const config = initConfig(mergeDeep({}, opt.config, inputSpec.config));

    // 2. Normalize: Convert input spec -> normalized spec

    // - Decompose all extended unit specs into composition of unit spec.  For example, a box plot get expanded into multiple layers of bars, ticks, and rules. The shorthand row/column channel is also expanded to a facet spec.
    const spec = normalize(inputSpec, config);
    // - Normalize autosize to be a autosize properties object.
    const autosize = normalizeAutoSize(inputSpec.autosize, config.autosize, isLayerSpec(spec) || isUnitSpec(spec));

    // 3. Build Model: normalized spec -> Model (a tree structure)

    // This phases instantiates the models with default config by doing a top-down traversal. This allows us to pass properties that child models derive from their parents via their constructors.
    // See the abstract `Model` class and its children (UnitModel, LayerModel, FacetModel, RepeatModel, ConcatModel) for different types of models.
    const model: Model = buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');

    // 4 Parse: Model --> Model with components

    // Note that components = intermediate representations that are equivalent to Vega specs.
    // We need these intermediate representation because we need to merge many visualization "components" like projections, scales, axes, and legends.
    // We will later convert these components into actual Vega specs in the assemble phase.

    // In this phase, we do a bottom-up traversal over the whole tree to
    // parse for each type of components once (e.g., data, layout, mark, scale).
    // By doing bottom-up traversal, we start parsing components of unit specs and
    // then merge child components of parent composite specs.
    //
    // Please see inside model.parse() for order of different components parsed.
    model.parse();

    // draw(model.component.data.sources);

    // 5. Optimize the dataflow.  This will modify the data component of the model.
    optimizeDataflow(model.component.data, model);

    // 6. Assemble: convert model components --> Vega Spec.
    return assembleTopLevelModel(
      model,
      getTopLevelProperties(inputSpec, config, autosize),
      inputSpec.datasets,
      inputSpec.usermeta
    );
  } finally {
    // Reset the singleton logger if a logger is provided
    if (opt.logger) {
      log.reset();
    }
    // Reset the singleton field title formatter if provided
    if (opt.fieldTitle) {
      vlFieldDef.resetTitleFormatter();
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
function assembleTopLevelModel(
  model: Model,
  topLevelProperties: TopLevelProperties & LayoutSizeMixins,
  datasets: Datasets = {},
  usermeta: object
) {
  // Config with Vega-Lite only config removed.
  const vgConfig = model.config ? stripAndRedirectConfig(model.config) : undefined;

  const data = [].concat(
    model.assembleSelectionData([]),
    // only assemble data in the root
    assembleRootData(model.component.data, datasets)
  );

  const projections = model.assembleProjections();
  const title = model.assembleTitle();
  const style = model.assembleGroupStyle();
  const encodeEntry = model.assembleGroupEncodeEntry(true);

  let layoutSignals = model.assembleLayoutSignals();

  // move width and height signals with values to top level
  layoutSignals = layoutSignals.filter(signal => {
    if ((signal.name === 'width' || signal.name === 'height') && signal.value !== undefined) {
      topLevelProperties[signal.name] = +signal.value;
      return false;
    }
    return true;
  });

  const output: VgSpec = {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    ...(model.description ? {description: model.description} : {}),
    ...topLevelProperties,
    ...(title ? {title} : {}),
    ...(style ? {style} : {}),
    ...(encodeEntry ? {encode: {update: encodeEntry}} : {}),
    data,
    ...(projections.length > 0 ? {projections: projections} : {}),
    ...model.assembleGroup([...layoutSignals, ...model.assembleSelectionTopLevelSignals([])]),
    ...(vgConfig ? {config: vgConfig} : {}),
    ...(usermeta ? {usermeta} : {})
  };

  return {
    spec: output
    // TODO: add warning / errors here
  };
}
