import {isObject} from 'vega-util';
import {COLUMN, ROW} from './channel';
import * as compositeMark from './compositemark';
import {Config} from './config';
import {channelHasField, Encoding} from './encoding';
import {Field, RepeatRef} from './fielddef';
import * as log from './log';
import {
  AnyMark,
  AreaConfig,
  isMarkDef,
  isPathMark,
  isPrimitiveMark,
  LineConfig,
  Mark,
  MarkConfig,
  MarkDef
} from './mark';
import {Projection} from './projection';
import {
  CompositeUnitSpec,
  ExtendedLayerSpec,
  FacetedCompositeUnitSpec,
  GenericFacetSpec,
  GenericHConcatSpec,
  GenericRepeatSpec,
  GenericSpec,
  GenericUnitSpec,
  GenericVConcatSpec,
  isFacetSpec,
  isHConcatSpec,
  isLayerSpec,
  isRepeatSpec,
  isUnitSpec,
  isVConcatSpec,
  NormalizedConcatSpec,
  NormalizedFacetSpec,
  NormalizedLayerSpec,
  NormalizedRepeatSpec,
  NormalizedSpec,
  NormalizedUnitSpec,
  TopLevel,
  TopLevelSpec
} from './spec';
import {stack} from './stack';
import {keys, omit, pick} from './util';

export function normalizeTopLevelSpec(
  spec: TopLevelSpec | GenericSpec<CompositeUnitSpec, ExtendedLayerSpec> | FacetedCompositeUnitSpec,
  config: Config
): TopLevel<NormalizedSpec> {
  return normalize(spec, config);
}

/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
function normalize(
  spec: GenericSpec<CompositeUnitSpec, ExtendedLayerSpec> | FacetedCompositeUnitSpec,
  config: Config
): NormalizedSpec {
  if (isFacetSpec(spec)) {
    return normalizeFacet(spec, config);
  }
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, config);
  }
  if (isRepeatSpec(spec)) {
    return normalizeRepeat(spec, config);
  }
  if (isVConcatSpec(spec)) {
    return normalizeVConcat(spec, config);
  }
  if (isHConcatSpec(spec)) {
    return normalizeHConcat(spec, config);
  }
  if (isUnitSpec(spec)) {
    const hasRow = channelHasField(spec.encoding, ROW);
    const hasColumn = channelHasField(spec.encoding, COLUMN);

    if (hasRow || hasColumn) {
      return normalizeFacetedUnit(spec, config);
    }
    return normalizeNonFacetUnit(spec, config);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function normalizeFacet(
  spec: GenericFacetSpec<CompositeUnitSpec, ExtendedLayerSpec>,
  config: Config
): NormalizedFacetSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
    spec: normalize(subspec, config) as any
  };
}

function mergeEncoding(opt: {parentEncoding: Encoding<any>; encoding: Encoding<any>}): Encoding<any> {
  const {parentEncoding, encoding} = opt;
  if (parentEncoding && encoding) {
    const overriden = keys(parentEncoding).reduce((o, key) => {
      if (encoding[key]) {
        o.push(key);
      }
      return o;
    }, []);

    if (overriden.length > 0) {
      log.warn(log.message.encodingOverridden(overriden));
    }
  }

  const merged = {
    ...(parentEncoding || {}),
    ...(encoding || {})
  };
  return keys(merged).length > 0 ? merged : undefined;
}

function mergeProjection(opt: {parentProjection: Projection; projection: Projection}) {
  const {parentProjection, projection} = opt;
  if (parentProjection && projection) {
    log.warn(log.message.projectionOverridden({parentProjection, projection}));
  }
  return projection || parentProjection;
}

function normalizeLayer(
  spec: ExtendedLayerSpec,
  config: Config,
  parentEncoding?: Encoding<string | RepeatRef>,
  parentProjection?: Projection
): NormalizedLayerSpec {
  const {layer, encoding, projection, ...rest} = spec;
  const mergedEncoding = mergeEncoding({parentEncoding, encoding});
  const mergedProjection = mergeProjection({parentProjection, projection});
  return {
    ...rest,
    layer: layer.map(subspec => {
      if (isLayerSpec(subspec)) {
        return normalizeLayer(subspec, config, mergedEncoding, mergedProjection);
      }
      return normalizeNonFacetUnit(subspec, config, mergedEncoding, mergedProjection);
    })
  };
}

function normalizeRepeat(
  spec: GenericRepeatSpec<CompositeUnitSpec, ExtendedLayerSpec>,
  config: Config
): NormalizedRepeatSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: normalize(subspec, config)
  };
}

function normalizeVConcat(
  spec: GenericVConcatSpec<CompositeUnitSpec, ExtendedLayerSpec>,
  config: Config
): NormalizedConcatSpec {
  const {vconcat: vconcat, ...rest} = spec;
  return {
    ...rest,
    vconcat: vconcat.map(subspec => normalize(subspec, config))
  };
}

function normalizeHConcat(
  spec: GenericHConcatSpec<CompositeUnitSpec, ExtendedLayerSpec>,
  config: Config
): NormalizedConcatSpec {
  const {hconcat: hconcat, ...rest} = spec;
  return {
    ...rest,
    hconcat: hconcat.map(subspec => normalize(subspec, config))
  };
}

function normalizeFacetedUnit(spec: FacetedCompositeUnitSpec, config: Config): NormalizedFacetSpec {
  // New encoding in the inside spec should not contain row / column
  // as row/column should be moved to facet
  const {row: row, column: column, ...encoding} = spec.encoding;

  // Mark and encoding should be moved into the inner spec
  const {mark, width, projection, height, selection, encoding: _, ...outerSpec} = spec;

  return {
    ...outerSpec,
    facet: {
      ...(row ? {row} : {}),
      ...(column ? {column} : {})
    },
    spec: normalizeNonFacetUnit(
      {
        ...(projection ? {projection} : {}),
        mark,
        ...(width ? {width} : {}),
        ...(height ? {height} : {}),
        encoding,
        ...(selection ? {selection} : {})
      },
      config
    )
  };
}

function isNonFacetUnitSpecWithPrimitiveMark(
  spec: GenericUnitSpec<Encoding<Field>, AnyMark>
): spec is GenericUnitSpec<Encoding<Field>, Mark> {
  return isPrimitiveMark(spec.mark);
}

function getPointOverlay(markDef: MarkDef, markConfig: LineConfig, encoding: Encoding<Field>): MarkConfig {
  if (markDef.point === 'transparent') {
    return {opacity: 0};
  } else if (markDef.point) {
    // truthy : true or object
    return isObject(markDef.point) ? markDef.point : {};
  } else if (markDef.point !== undefined) {
    // false or null
    return null;
  } else {
    // undefined (not disabled)
    if (markConfig.point || encoding.shape) {
      // enable point overlay if config[mark].point is truthy or if encoding.shape is provided
      return isObject(markConfig.point) ? markConfig.point : {};
    }
    // markDef.point is defined as falsy
    return null;
  }
}

function getLineOverlay(markDef: MarkDef, markConfig: AreaConfig): MarkConfig {
  if (markDef.line) {
    // true or object
    return markDef.line === true ? {} : markDef.line;
  } else if (markDef.line !== undefined) {
    // false or null
    return null;
  } else {
    // undefined (not disabled)
    if (markConfig.line) {
      // enable line overlay if config[mark].line is truthy
      return markConfig.line === true ? {} : markConfig.line;
    }
    // markDef.point is defined as falsy
    return null;
  }
}

function normalizeNonFacetUnit(
  spec: GenericUnitSpec<Encoding<Field>, AnyMark>,
  config: Config,
  parentEncoding?: Encoding<string | RepeatRef>,
  parentProjection?: Projection
): NormalizedUnitSpec | NormalizedLayerSpec {
  const {encoding, projection} = spec;
  const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;

  // merge parent encoding / projection first
  if (parentEncoding || parentProjection) {
    const mergedProjection = mergeProjection({parentProjection, projection});
    const mergedEncoding = mergeEncoding({parentEncoding, encoding});
    return normalizeNonFacetUnit(
      {
        ...spec,
        ...(mergedProjection ? {projection: mergedProjection} : {}),
        ...(mergedEncoding ? {encoding: mergedEncoding} : {})
      },
      config
    );
  }

  if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
    // TODO: thoroughly test

    if (mark === 'line' && (encoding.x2 || encoding.y2)) {
      log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));

      return normalizeNonFacetUnit(
        {
          mark: 'rule',
          ...spec
        },
        config,
        parentEncoding,
        parentProjection
      );
    }

    if (isPathMark(mark)) {
      return normalizePathOverlay(spec, config);
    }

    return spec; // Nothing to normalize
  } else {
    return compositeMark.normalize(spec, config);
  }
}

function dropLineAndPoint(markDef: MarkDef): MarkDef | Mark {
  const {point: _point, line: _line, ...mark} = markDef;

  return keys(mark).length > 1 ? mark : mark.type;
}

function normalizePathOverlay(spec: NormalizedUnitSpec, config: Config = {}): NormalizedLayerSpec | NormalizedUnitSpec {
  // _ is used to denote a dropped property of the unit spec
  // which should not be carried over to the layer spec
  const {selection, projection, encoding, mark, ...outerSpec} = spec;
  const markDef = isMarkDef(mark) ? mark : {type: mark};

  const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
  const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);

  if (!pointOverlay && !lineOverlay) {
    return {
      ...spec,
      // Do not include point / line overlay in the normalize spec
      mark: dropLineAndPoint(markDef)
    };
  }

  const layer: NormalizedUnitSpec[] = [
    {
      ...(selection ? {selection} : {}),
      // Do not include point / line overlay in the normalize spec
      mark: dropLineAndPoint({
        ...markDef,
        // make area mark translucent by default
        // TODO: extract this 0.7 to be shared with default opacity for point/tick/...
        ...(markDef.type === 'area' ? {opacity: 0.7} : {})
      }),
      // drop shape from encoding as this might be used to trigger point overlay
      encoding: omit(encoding, ['shape'])
    }
  ];

  // FIXME: determine rules for applying selections.

  // Need to copy stack config to overlayed layer
  const stackProps = stack(markDef, encoding, config ? config.stack : undefined);

  let overlayEncoding = encoding;
  if (stackProps) {
    const {fieldChannel: stackFieldChannel, offset} = stackProps;
    overlayEncoding = {
      ...encoding,
      [stackFieldChannel]: {
        ...encoding[stackFieldChannel],
        ...(offset ? {stack: offset} : {})
      }
    };
  }

  if (lineOverlay) {
    layer.push({
      ...(projection ? {projection} : {}),
      mark: {
        type: 'line',
        ...pick(markDef, ['clip', 'interpolate', 'tension']),
        ...lineOverlay
      },
      encoding: overlayEncoding
    });
  }
  if (pointOverlay) {
    layer.push({
      ...(projection ? {projection} : {}),
      mark: {
        type: 'point',
        opacity: 1,
        filled: true,
        ...pick(markDef, ['clip']),
        ...pointOverlay
      },
      encoding: overlayEncoding
    });
  }

  return {
    ...outerSpec,
    layer
  };
}
