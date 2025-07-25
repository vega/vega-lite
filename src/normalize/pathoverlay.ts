import {SignalRef} from 'vega';
import {isObject} from 'vega-util';
import {getAncestorLevel, LabelDef} from '../channeldef';
import {Config} from '../config';
import {Encoding, normalizeEncoding, pathGroupingFields} from '../encoding';
import {ExprRef} from '../expr';
import {AreaConfig, isMarkDef, LineConfig, Mark, MarkConfig, MarkDef} from '../mark';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec';
import {isUnitSpec} from '../spec/unit';
import {stack} from '../stack';
import {keys, omit, pick} from '../util';
import {NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams} from './base';

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
        [mark]: omit(config[mark], ['point', 'line'] as any)
      };
    }
  }
  return config;
}

function getPointOverlay(
  markDef: MarkDef,
  markConfig: LineConfig<ExprRef | SignalRef> = {},
  encoding: Encoding<string>
): MarkConfig<ExprRef | SignalRef> {
  if (
    markDef.point === 'transparent' ||
    // if the main mark is a single line/trail/area chart, create an invisible point overlay for label.
    (!markDef.point && encoding.label && pathGroupingFields(markDef.type, encoding).length <= 0)
  ) {
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
  markConfig: AreaConfig<ExprRef | SignalRef> = {}
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

function incrementAvoidLevel(labelDef: LabelDef<string>): LabelDef<string> {
  const ancestorLevel = getAncestorLevel(labelDef.avoid);
  return {...labelDef, avoid: {ancestor: ancestorLevel + 1}};
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
    if (encoding.label) {
      encoding.label = incrementAvoidLevel(encoding.label);
    }

    const markDef: MarkDef = isMarkDef(mark) ? mark : {type: mark};

    const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
    const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);

    const isMultiSeriesPath = pathGroupingFields(markDef.type, spec.encoding).length > 0;

    const layer: NormalizedUnitSpec[] = [
      {
        name,
        ...(params ? {params} : {}),
        mark: dropLineAndPoint({
          // TODO: extract this 0.7 to be shared with default opacity for point/tick/...
          ...(markDef.type === 'area' && markDef.opacity === undefined && markDef.fillOpacity === undefined
            ? {opacity: 0.7}
            : {}),
          ...markDef
        }),
        // drop shape from encoding as this might be used to trigger point overlay
        // If the main mark is multi-series line/trail or stacked area, label the main mark.
        encoding: omit(encoding, ['shape', ...(isMultiSeriesPath ? [] : ['label' as const])])
      }
    ];

    // FIXME: determine rules for applying selections.

    // Need to copy stack config to overlayed layer
    const stackProps = stack(markDef, encoding);

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
          ...lineOverlay
        },
        // Drop label. Only add label to the area mark for stacked area chart.
        // Or, only add label to the point overlay for single area chart.
        encoding: omit(overlayEncoding, ['label'])
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
          ...pointOverlay
        },
        // If the main mark is a single line/trail/area chart, label the point overlay instead of the main mark.
        encoding: omit(overlayEncoding, isMultiSeriesPath ? ['label'] : [])
      });
    }

    return normalize(
      {
        ...outerSpec,
        layer
      },
      {
        ...normParams,
        config: dropLineAndPointFromConfig(config)
      }
    );
  }
}
