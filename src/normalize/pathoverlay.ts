import type {SignalRef} from 'vega';
import {isObject} from 'vega-util';
import {Config} from '../config.js';
import {Encoding, normalizeEncoding} from '../encoding.js';
import {ExprRef} from '../expr.js';
import {AreaConfig, isMarkDef, LineConfig, Mark, MarkConfig, MarkDef} from '../mark.js';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec/index.js';
import {isUnitSpec} from '../spec/unit.js';
import {stack} from '../stack.js';
import {keys, omit, pick} from '../util.js';
import {NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams} from './base.js';
import {DEFAULT_REDUCED_OPACITY, initMarkdef} from '../compile/mark/init.js';
import {getMarkPropOrConfig} from '../compile/common.js';

type UnitSpecWithPathOverlay = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'line' | 'area' | 'rule' | 'trail'>>;

function dropLineAndPoint(markDef: MarkDef): MarkDef | Mark {
  const {point: _point, line: _line, ...mark} = markDef;

  return keys(mark).length > 1 ? mark : mark.type;
}

function dropLineAndPointFromConfig(config: Config<SignalRef>) {
  for (const mark of ['line', 'area', 'rule', 'trail'] as const) {
    if (config[mark]) {
      config = {
        ...config,
        // TODO: remove as any
        [mark]: omit(config[mark], ['point', 'line'] as any),
      };
    }
  }
  return config;
}

function getPointOverlay(
  markDef: MarkDef,
  markConfig: LineConfig<ExprRef | SignalRef> = {},
  encoding: Encoding<string>,
): MarkConfig<ExprRef | SignalRef> {
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
    return undefined;
  }
}

function getLineOverlay(
  markDef: MarkDef,
  markConfig: AreaConfig<ExprRef | SignalRef> = {},
): MarkConfig<ExprRef | SignalRef> {
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
    return undefined;
  }
}

export class PathOverlayNormalizer implements NonFacetUnitNormalizer<UnitSpecWithPathOverlay> {
  public name = 'path-overlay';

  public hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithPathOverlay {
    if (isUnitSpec(spec)) {
      const {mark, encoding} = spec;
      const markDef = isMarkDef(mark) ? mark : {type: mark};
      switch (markDef.type) {
        case 'line':
        case 'rule':
        case 'trail':
          return !!getPointOverlay(markDef, config[markDef.type], encoding);
        case 'area':
          return (
            // false / null are also included as we want to remove the properties
            !!getPointOverlay(markDef, config[markDef.type], encoding) ||
            !!getLineOverlay(markDef, config[markDef.type])
          );
      }
    }
    return false;
  }

  public run(spec: UnitSpecWithPathOverlay, normParams: NormalizerParams, normalize: NormalizeLayerOrUnit) {
    const {config} = normParams;
    const {params, projection, mark, name, encoding: e, ...outerSpec} = spec;

    // Need to call normalizeEncoding because we need the inferred types to correctly determine stack
    const encoding = normalizeEncoding(e, config);

    const markDef: MarkDef = isMarkDef(mark) ? mark : {type: mark};

    const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);

    const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);

    const layer: NormalizedUnitSpec[] = [
      {
        name,
        ...(params ? {params} : {}),
        mark: dropLineAndPoint({
          ...(markDef.type === 'area' &&
          getMarkPropOrConfig('opacity', markDef, config) == undefined &&
          getMarkPropOrConfig('fillOpacity', markDef, config) == undefined
            ? {opacity: DEFAULT_REDUCED_OPACITY}
            : {}),
          ...markDef,
        }),
        // drop shape from encoding as this might be used to trigger point overlay
        encoding: omit(encoding, ['shape']),
      },
    ];

    // FIXME: determine rules for applying selections.

    // Need to copy stack config to overlaid layer
    // FIXME: normalizer shouldn't call `initMarkdef`, a method from an init phase.
    const stackProps = stack(initMarkdef(markDef, encoding, config), encoding);

    let overlayEncoding = encoding;
    if (stackProps) {
      const {fieldChannel: stackFieldChannel, offset} = stackProps;
      overlayEncoding = {
        ...encoding,
        [stackFieldChannel]: {
          ...encoding[stackFieldChannel],
          ...(offset ? {stack: offset} : {}),
        },
      };
    }

    // overlay line layer should be on the edge of area but passing y2/x2 makes
    // it as "rule" mark so that it draws unwanted vertical/horizontal lines.
    // point overlay also should not have y2/x2 as it does not support.
    overlayEncoding = omit(overlayEncoding, ['y2', 'x2']);

    if (lineOverlay) {
      layer.push({
        ...(projection ? {projection} : {}),
        mark: {
          type: 'line',
          ...pick(markDef, ['clip', 'interpolate', 'tension', 'tooltip']),
          ...lineOverlay,
        },
        encoding: overlayEncoding,
      });
    }
    if (pointOverlay) {
      layer.push({
        ...(projection ? {projection} : {}),
        mark: {
          type: 'point',
          opacity: 1,
          filled: true,
          ...pick(markDef, ['clip', 'tooltip']),
          ...pointOverlay,
        },
        encoding: overlayEncoding,
      });
    }

    return normalize(
      {
        ...outerSpec,
        layer,
      },
      {
        ...normParams,
        config: dropLineAndPointFromConfig(config),
      },
    );
  }
}
