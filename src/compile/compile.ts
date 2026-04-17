import type {AutoSizeType, LoggerInterface, Spec as VgSpec} from 'vega';
import {isString, mergeConfig} from 'vega-util';
import {getPositionScaleChannel} from '../channel.js';
import * as vlFieldDef from '../channeldef.js';
import {Config, initConfig, stripAndRedirectConfig} from '../config.js';
import * as log from '../log/index.js';
import {normalize} from '../normalize/index.js';
import {assembleParameterSignals} from '../parameter.js';
import {isSelectionParameter} from '../selection.js';
import {LayoutSizeMixins, TopLevel, TopLevelSpec} from '../spec/index.js';
import {
  AutoSizeParams,
  Datasets,
  extractTopLevelProperties,
  getFitType,
  isFitType,
  TopLevelProperties,
} from '../spec/toplevel.js';
import {Dict, keys} from '../util.js';
import {buildModel} from './buildmodel.js';
import {assembleRootData} from './data/assemble.js';
import {optimizeDataflow} from './data/optimize.js';
import {Model} from './model.js';

export interface CompileOptions {
  /**
   * Sets a Vega-Lite configuration.
   */
  config?: Config;

  /**
   * Sets a custom logger.
   */
  logger?: LoggerInterface;

  /**
   * Sets a field title formatter.
   */
  fieldTitle?: vlFieldDef.FieldTitleFormatter;
}

/**
 * Vega-Lite's main function, for compiling Vega-Lite spec into Vega spec.
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
 *
 * @param inputSpec The Vega-Lite specification.
 * @param opt       Optional arguments passed to the Vega-Lite compiler.
 * @returns         An object containing the compiled Vega spec and normalized Vega-Lite spec.
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
    const config = initConfig(mergeConfig(opt.config, inputSpec.config));

    // 2. Normalize: Convert input spec -> normalized spec

    // - Decompose all extended unit specs into composition of unit spec. For example, a box plot get expanded into multiple layers of bars, ticks, and rules. The shorthand row/column channel is also expanded to a facet spec.
    // - Normalize autosize and width or height spec
    const spec = normalize(inputSpec, config);

    // 3. Build Model: normalized spec -> Model (a tree structure)

    // This phases instantiates the models with default config by doing a top-down traversal. This allows us to pass properties that child models derive from their parents via their constructors.
    // See the abstract `Model` class and its children (UnitModel, LayerModel, FacetModel, ConcatModel) for different types of models.
    const model: Model = buildModel(spec, null, '', undefined, config);

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

    // drawDataflow(model.component.data.sources);

    // 5. Optimize the dataflow. This will modify the data component of the model.
    optimizeDataflow(model.component.data, model);

    // drawDataflow(model.component.data.sources);

    // 6. Assemble: convert model components --> Vega Spec.
    const vgSpec = assembleTopLevelModel(
      model,
      getTopLevelProperties(inputSpec, spec.autosize, config, model),
      inputSpec.datasets,
      inputSpec.usermeta,
    );

    return {
      spec: vgSpec,
      normalized: spec,
    };
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

function getTopLevelProperties(
  inputSpec: TopLevel<any>,
  autosize: AutoSizeType | AutoSizeParams,
  config: Config,
  model: Model,
) {
  const width = model.component.layoutSize.get('width');
  const height = model.component.layoutSize.get('height');
  if (autosize === undefined) {
    autosize = {type: 'pad'};
    if (model.hasAxisOrientSignalRef()) {
      autosize.resize = true;
    }
  } else if (isString(autosize)) {
    autosize = {type: autosize};
  }
  if (width && height && isFitType(autosize.type)) {
    if (width === 'step' && height === 'step') {
      log.warn(log.message.droppingFit());
      autosize.type = 'pad';
    } else if (width === 'step' || height === 'step') {
      // effectively XOR, because else if

      // get step dimension
      const sizeType = width === 'step' ? 'width' : 'height';
      // log that we're dropping fit for respective channel
      log.warn(log.message.droppingFit(getPositionScaleChannel(sizeType)));

      // setting type to inverse fit (so if we dropped fit-x, type is now fit-y)
      const inverseSizeType = sizeType === 'width' ? 'height' : 'width';
      autosize.type = getFitType(inverseSizeType);
    }
  }

  return {
    ...(keys(autosize).length === 1 && autosize.type
      ? autosize.type === 'pad'
        ? {}
        : {autosize: autosize.type}
      : {autosize}),
    ...extractTopLevelProperties(config, false),
    ...extractTopLevelProperties(inputSpec, true),
  };
}

/*
 * Assemble the top-level model to a Vega spec.
 *
 * Note: this couldn't be `model.assemble()` since the top-level model
 * needs some special treatment to generate top-level properties.
 */
function assembleTopLevelModel(
  model: Model,
  topLevelProperties: TopLevelProperties & LayoutSizeMixins,
  datasets: Datasets = {},
  usermeta: Dict<any>,
): VgSpec {
  // Config with Vega-Lite only config removed.
  const vgConfig = model.config ? stripAndRedirectConfig(model.config) : undefined;

  const rootData = assembleRootData(model.component.data, datasets);
  const data = model.assembleSelectionData(rootData);

  const projections = model.assembleProjections();
  const title = model.assembleTitle();
  const style = model.assembleGroupStyle();
  const encodeEntry = model.assembleGroupEncodeEntry(true);

  let layoutSignals = model.assembleLayoutSignals();

  // move width and height signals with values to top level
  layoutSignals = layoutSignals.filter((signal) => {
    if ((signal.name === 'width' || signal.name === 'height') && signal.value !== undefined) {
      topLevelProperties[signal.name] = +signal.value;
      return false;
    }
    return true;
  });

  const {params, ...otherTopLevelProps} = topLevelProperties;
  const group = model.assembleGroup([
    ...layoutSignals,
    ...model.assembleSelectionTopLevelSignals([]),
    ...assembleParameterSignals(params),
  ]);

  const parameterSignalNames = new Set(
    (params || []).filter((param) => !isSelectionParameter(param)).map((param) => param.name),
  );

  rewriteSignalDomainRefs(group, parameterSignalNames);

  return {
    $schema: 'https://vega.github.io/schema/vega/v6.json',
    ...(model.description ? {description: model.description} : {}),
    ...otherTopLevelProps,
    ...(title ? {title} : {}),
    ...(style ? {style} : {}),
    ...(encodeEntry ? {encode: {update: encodeEntry}} : {}),
    data,
    ...(projections.length > 0 ? {projections} : {}),
    ...group,
    ...(vgConfig ? {config: vgConfig} : {}),
    ...(usermeta ? {usermeta} : {}),
  };
}

function rewriteSignalDomainRefs(group: any, parameterSignalNames: Set<string>) {
  if (!group?.signals || !group?.scales) return;

  const helperScaleName = new Map<string, string>();

  for (const signal of group.signals) {
    if (!parameterSignalNames.has(signal.name)) continue;

    for (const key of ['init', 'update']) {
      const expr = signal[key];
      if (!isString(expr) || expr.indexOf('domain(') < 0) continue;

      signal[key] = expr.replace(/domain\((['"])([^'"]+)\1\)/g, (match: string, _quote: string, scaleName: string) => {
        const helper = helperScaleFor(scaleName, group, helperScaleName, parameterSignalNames);
        return helper ? `domain('${helper}')` : match;
      });
    }
  }
}

function helperScaleFor(
  scaleName: string,
  group: any,
  helperScaleName: Map<string, string>,
  parameterSignalNames: Set<string>,
) {
  if (helperScaleName.has(scaleName)) {
    return helperScaleName.get(scaleName);
  }

  const scale = (group.scales as any[]).find((s) => s.name === scaleName);
  if (!scale || !scale.domain || !scale.domain.signal) return null;
  if (!parameterSignalNames.has(scale.domain.signal)) return null;

  const ref = findScaleFieldRef(group.marks, scaleName, undefined);
  if (!ref) return null;

  const helper = `__${scaleName}_domain_source`;
  if (!(group.scales as any[]).some((s) => s.name === helper)) {
    group.scales.push({
      name: helper,
      type: scale.type,
      domain: {data: ref.data, field: ref.field},
    });
  }

  helperScaleName.set(scaleName, helper);
  return helper;
}

type ScaleFieldRef = {data: string; field: string} | null;

function findScaleFieldRef(marks: any[], scaleName: string, inheritedData: string): ScaleFieldRef {
  for (const mark of marks || []) {
    const facetDataName = mark.from?.facet?.data;
    const fromDataName = mark.from?.data;
    const dataName = fromDataName === 'facet' ? inheritedData : fromDataName || facetDataName || inheritedData;
    const found = findScaleFieldInEncode(mark.encode, scaleName, dataName);
    if (found) return found;

    const nested = findScaleFieldRef(mark.marks, scaleName, facetDataName || dataName);
    if (nested) return nested;
  }
  return null;
}

function findScaleFieldInEncode(encode: any, scaleName: string, dataName: string): ScaleFieldRef {
  for (const blockName of keys(encode || {})) {
    const block = encode[blockName] || {};
    for (const key of keys(block)) {
      const value = block[key];
      if (value?.scale === scaleName && isString(value.field) && dataName) {
        return {data: dataName, field: value.field};
      }
    }
  }
  return null;
}
