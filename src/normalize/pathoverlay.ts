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
import {getMarkPropOrConfig, getMarkStyleConfig} from '../compile/common.js';

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
  // Also drop line/point from style config so the overlaid child layers do not re-match
  // the path-overlay normalizer (which now also reads the style config) and recurse infinitely.
  if (config.style) {
    const style = {...config.style};
    for (const styleName of keys(style)) {
      if (style[styleName]) {
        // TODO: remove as any
        style[styleName] = omit(style[styleName], ['point', 'line'] as any);
      }
    }
    config = {...config, style};
  }
  return config;
}

function getPointOverlay(
  markDef: MarkDef,
  config: Config<SignalRef>,
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
    // undefined (not disabled): resolve the point overlay from the config.
    // The style config (config.style) takes precedence over the mark-type config (config[mark.type]),
    // consistent with getMarkConfig, so a point overlay can be disabled via style config.
    const stylePoint = getMarkStyleConfig('point', markDef, config.style ?? {});
    const markConfigPoint = (config[markDef.type] as LineConfig<ExprRef | SignalRef>)?.point;
    const point = stylePoint !== undefined ? stylePoint : markConfigPoint;
    if (point || encoding.shape) {
      // enable point overlay if the resolved config point is truthy or if encoding.shape is provided
      return isObject(point) ? point : {};
    } else if (point !== undefined) {
      // explicitly disabled via config (e.g. config.style[...].point: false)
      return null;
    }
    return undefined;
  }
}

function getLineOverlay(markDef: MarkDef, config: Config<SignalRef>): MarkConfig<ExprRef | SignalRef> {
  if (markDef.line) {
    // true or object
    return markDef.line === true ? {} : markDef.line;
  } else if (markDef.line !== undefined) {
    // false or null
    return null;
  } else {
    // undefined (not disabled): resolve the line overlay from the config.
    // The style config (config.style) takes precedence over the mark-type config (config[mark.type]),
    // consistent with getMarkConfig, so a line overlay can be disabled via style config (#9547).
    const styleLine = getMarkStyleConfig('line', markDef, config.style ?? {});
    const markConfigLine = (config[markDef.type] as AreaConfig<ExprRef | SignalRef>)?.line;
    const line = styleLine !== undefined ? styleLine : markConfigLine;
    if (line) {
      // enable line overlay if the resolved config line is truthy
      return line === true ? {} : line;
    } else if (line !== undefined) {
      // explicitly disabled via config (e.g. config.style[...].line: false)
      return null;
    }
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
          return !!getPointOverlay(markDef, config as Config<SignalRef>, encoding);
        case 'area':
          return (
            // false / null are also included as we want to remove the properties
            !!getPointOverlay(markDef, config as Config<SignalRef>, encoding) ||
            !!getLineOverlay(markDef, config as Config<SignalRef>)
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

    const pointOverlay = getPointOverlay(markDef, config, encoding);

    const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config);

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
