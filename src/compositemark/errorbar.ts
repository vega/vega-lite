import {AggregateOp, Orientation, SignalRef, Text} from 'vega';
import {PositionChannel} from '../channel.js';
import {
  Field,
  isContinuousFieldOrDatumDef,
  isFieldOrDatumDef,
  PositionFieldDef,
  SecondaryFieldDef,
  title,
  ValueDef,
} from '../channeldef.js';
import {Config} from '../config.js';
import {Data} from '../data.js';
import {Encoding, extractTransformsFromEncoding, normalizeEncoding} from '../encoding.js';
import {ExprRef} from '../expr.js';
import * as log from '../log/index.js';
import {isMarkDef, MarkDef} from '../mark.js';
import {NormalizerParams} from '../normalize/index.js';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec/index.js';
import {Step} from '../spec/base.js';
import {NormalizedUnitSpec} from '../spec/unit.js';
import {TitleParams} from '../title.js';
import {AggregatedFieldDef, CalculateTransform, Transform} from '../transform.js';
import {accessWithDatumToUnescapedPath, replaceAll, titleCase} from '../util.js';
import {CompositeMarkNormalizer} from './base.js';
import {
  compositeMarkContinuousAxis,
  compositeMarkOrient,
  CompositeMarkTooltipSummary,
  GenericCompositeMarkDef,
  getCompositeMarkTooltip,
  makeCompositeAggregatePartFactory,
  PartsMixins,
} from './common.js';
import {ErrorBand, ErrorBandDef} from './errorband.js';

export const ERRORBAR = 'errorbar' as const;
export type ErrorBar = typeof ERRORBAR;

export type ErrorBarExtent = 'ci' | 'iqr' | 'stderr' | 'stdev';
export type ErrorBarCenter = 'mean' | 'median';

export type ErrorInputType = 'raw' | 'aggregated-upper-lower' | 'aggregated-error';

export const ERRORBAR_PARTS = ['ticks', 'rule'] as const;

export type ErrorBarPart = (typeof ERRORBAR_PARTS)[number];

export interface ErrorExtraEncoding<F extends Field> {
  /**
   * Error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  xError?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Secondary error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  // `xError2` cannot have type as it should have the same type as `xError`
  xError2?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  yError?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Secondary error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  // `yError2` cannot have type as it should have the same type as `yError`
  yError2?: SecondaryFieldDef<F> | ValueDef<number>;
}

export type ErrorEncoding<F extends Field> = Pick<Encoding<F>, PositionChannel | 'color' | 'detail' | 'opacity'> &
  ErrorExtraEncoding<F>;

export type ErrorBarPartsMixins = PartsMixins<ErrorBarPart>;

export interface ErrorBarConfig extends ErrorBarPartsMixins {
  /** Size of the ticks of an error bar */
  size?: number;

  /** Thickness of the ticks and the bar of an error bar */
  thickness?: number;

  /**
   * The center of the errorbar. Available options include:
   * - `"mean"`: the mean of the data points.
   * - `"median"`: the median of the data points.
   *
   * __Default value:__ `"mean"`.
   * @hidden
   */

  // center is not needed right now but will be added back to the schema if future features require it.
  center?: ErrorBarCenter;

  /**
   * The extent of the rule. Available options include:
   * - `"ci"`: Extend the rule to the 95% bootstrapped confidence interval of the mean.
   * - `"stderr"`: The size of rule are set to the value of standard error, extending from the mean.
   * - `"stdev"`: The size of rule are set to the value of standard deviation, extending from the mean.
   * - `"iqr"`: Extend the rule to the q1 and q3.
   *
   * __Default value:__ `"stderr"`.
   */
  extent?: ErrorBarExtent;
}

export type ErrorBarDef = GenericCompositeMarkDef<ErrorBar> &
  ErrorBarConfig & {
    /**
     * Orientation of the error bar. This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orientation;
  };

export interface ErrorBarConfigMixins {
  /**
   * ErrorBar Config
   */
  errorbar?: ErrorBarConfig;
}

export const errorBarNormalizer = new CompositeMarkNormalizer(ERRORBAR, normalizeErrorBar);

export function normalizeErrorBar(
  spec: GenericUnitSpec<ErrorEncoding<string>, ErrorBar | ErrorBarDef>,
  {config}: NormalizerParams,
): NormalizedLayerSpec | NormalizedUnitSpec {
  // Need to initEncoding first so we can infer type
  spec = {
    ...spec,
    encoding: normalizeEncoding(spec.encoding, config),
  };

  const {
    transform,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    ticksOrient,
    markDef,
    outerSpec,
    tooltipEncoding,
  } = errorBarParams(spec, ERRORBAR, config);
  delete (encodingWithoutContinuousAxis as any).size;

  const makeErrorBarPart = makeCompositeAggregatePartFactory<ErrorBarPartsMixins>(
    markDef,
    continuousAxis,
    continuousAxisChannelDef,
    encodingWithoutContinuousAxis,
    config.errorbar,
  );

  const thickness = markDef.thickness;
  const size = markDef.size;
  const tick: MarkDef = {
    type: 'tick',
    orient: ticksOrient,
    aria: false,
    ...(thickness !== undefined ? {thickness} : {}),
    ...(size !== undefined ? {size} : {}),
  };

  const layer = [
    ...makeErrorBarPart({
      partName: 'ticks',
      mark: tick,
      positionPrefix: 'lower',
      extraEncoding: tooltipEncoding,
    }),
    ...makeErrorBarPart({
      partName: 'ticks',
      mark: tick,
      positionPrefix: 'upper',
      extraEncoding: tooltipEncoding,
    }),
    ...makeErrorBarPart({
      partName: 'rule',
      mark: {
        type: 'rule',
        ariaRoleDescription: 'errorbar',
        ...(thickness !== undefined ? {size: thickness} : {}),
      },
      positionPrefix: 'lower',
      endPositionPrefix: 'upper',
      extraEncoding: tooltipEncoding,
    }),
  ];

  return {
    ...outerSpec,
    transform,
    ...(layer.length > 1 ? {layer} : {...layer[0]}),
  };
}

function errorBarOrientAndInputType(
  spec: GenericUnitSpec<ErrorEncoding<string>, ErrorBar | ErrorBand | ErrorBarDef | ErrorBandDef>,
  compositeMark: ErrorBar | ErrorBand,
): {
  orient: Orientation;
  inputType: ErrorInputType;
} {
  const {encoding} = spec;

  if (errorBarIsInputTypeRaw(encoding)) {
    return {
      orient: compositeMarkOrient(spec, compositeMark),
      inputType: 'raw',
    };
  }

  const isTypeAggregatedUpperLower: boolean = errorBarIsInputTypeAggregatedUpperLower(encoding);
  const isTypeAggregatedError: boolean = errorBarIsInputTypeAggregatedError(encoding);
  const x = encoding.x;
  const y = encoding.y;

  if (isTypeAggregatedUpperLower) {
    // type is aggregated-upper-lower

    if (isTypeAggregatedError) {
      throw new Error(`${compositeMark} cannot be both type aggregated-upper-lower and aggregated-error`);
    }

    const x2 = encoding.x2;
    const y2 = encoding.y2;

    if (isFieldOrDatumDef(x2) && isFieldOrDatumDef(y2)) {
      // having both x, x2 and y, y2
      throw new Error(`${compositeMark} cannot have both x2 and y2`);
    } else if (isFieldOrDatumDef(x2)) {
      if (isContinuousFieldOrDatumDef(x)) {
        // having x, x2 quantitative and field y, y2 are not specified
        return {orient: 'horizontal', inputType: 'aggregated-upper-lower'};
      } else {
        // having x, x2 that are not both quantitative
        throw new Error(`Both x and x2 have to be quantitative in ${compositeMark}`);
      }
    } else if (isFieldOrDatumDef(y2)) {
      // y2 is a FieldDef
      if (isContinuousFieldOrDatumDef(y)) {
        // having y, y2 quantitative and field x, x2 are not specified
        return {orient: 'vertical', inputType: 'aggregated-upper-lower'};
      } else {
        // having y, y2 that are not both quantitative
        throw new Error(`Both y and y2 have to be quantitative in ${compositeMark}`);
      }
    }
    throw new Error('No ranged axis');
  } else {
    // type is aggregated-error

    const xError = encoding.xError;
    const xError2 = encoding.xError2;
    const yError = encoding.yError;
    const yError2 = encoding.yError2;

    if (isFieldOrDatumDef(xError2) && !isFieldOrDatumDef(xError)) {
      // having xError2 without xError
      throw new Error(`${compositeMark} cannot have xError2 without xError`);
    }

    if (isFieldOrDatumDef(yError2) && !isFieldOrDatumDef(yError)) {
      // having yError2 without yError
      throw new Error(`${compositeMark} cannot have yError2 without yError`);
    }

    if (isFieldOrDatumDef(xError) && isFieldOrDatumDef(yError)) {
      // having both xError and yError
      throw new Error(`${compositeMark} cannot have both xError and yError with both are quantiative`);
    } else if (isFieldOrDatumDef(xError)) {
      if (isContinuousFieldOrDatumDef(x)) {
        // having x and xError that are all quantitative
        return {orient: 'horizontal', inputType: 'aggregated-error'};
      } else {
        // having x, xError, and xError2 that are not all quantitative
        throw new Error('All x, xError, and xError2 (if exist) have to be quantitative');
      }
    } else if (isFieldOrDatumDef(yError)) {
      if (isContinuousFieldOrDatumDef(y)) {
        // having y and yError that are all quantitative
        return {orient: 'vertical', inputType: 'aggregated-error'};
      } else {
        // having y, yError, and yError2 that are not all quantitative
        throw new Error('All y, yError, and yError2 (if exist) have to be quantitative');
      }
    }
    throw new Error('No ranged axis');
  }
}

function errorBarIsInputTypeRaw(encoding: ErrorEncoding<string>): boolean {
  return (
    (isFieldOrDatumDef(encoding.x) || isFieldOrDatumDef(encoding.y)) &&
    !isFieldOrDatumDef(encoding.x2) &&
    !isFieldOrDatumDef(encoding.y2) &&
    !isFieldOrDatumDef(encoding.xError) &&
    !isFieldOrDatumDef(encoding.xError2) &&
    !isFieldOrDatumDef(encoding.yError) &&
    !isFieldOrDatumDef(encoding.yError2)
  );
}

function errorBarIsInputTypeAggregatedUpperLower(encoding: ErrorEncoding<string>): boolean {
  return isFieldOrDatumDef(encoding.x2) || isFieldOrDatumDef(encoding.y2);
}

function errorBarIsInputTypeAggregatedError(encoding: ErrorEncoding<string>): boolean {
  return (
    isFieldOrDatumDef(encoding.xError) ||
    isFieldOrDatumDef(encoding.xError2) ||
    isFieldOrDatumDef(encoding.yError) ||
    isFieldOrDatumDef(encoding.yError2)
  );
}

export function errorBarParams<
  M extends ErrorBar | ErrorBand,
  MD extends GenericCompositeMarkDef<M> & (ErrorBarDef | ErrorBandDef),
>(
  spec: GenericUnitSpec<ErrorEncoding<string>, M | MD>,
  compositeMark: M,
  config: Config,
): {
  transform: Transform[];
  groupby: string[];
  continuousAxisChannelDef: PositionFieldDef<string>;
  continuousAxis: 'x' | 'y';
  encodingWithoutContinuousAxis: ErrorEncoding<string>;
  ticksOrient: Orientation;
  markDef: MD;
  outerSpec: {
    data?: Data;
    title?: Text | TitleParams<ExprRef | SignalRef>;
    name?: string;
    description?: string;
    transform?: Transform[];
    width?: number | 'container' | Step;
    height?: number | 'container' | Step;
  };
  tooltipEncoding: ErrorEncoding<string>;
} {
  // TODO: use selection
  const {mark, encoding, params, projection: _p, ...outerSpec} = spec;
  const markDef: MD = isMarkDef(mark) ? mark : ({type: mark} as MD);

  // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
  if (params) {
    log.warn(log.message.selectionNotSupported(compositeMark));
  }

  const {orient, inputType} = errorBarOrientAndInputType(spec, compositeMark);
  const {
    continuousAxisChannelDef,
    continuousAxisChannelDef2,
    continuousAxisChannelDefError,
    continuousAxisChannelDefError2,
    continuousAxis,
  } = compositeMarkContinuousAxis(spec, orient, compositeMark);

  const {errorBarSpecificAggregate, postAggregateCalculates, tooltipSummary, tooltipTitleWithFieldName} =
    errorBarAggregationAndCalculation(
      markDef,
      continuousAxisChannelDef,
      continuousAxisChannelDef2,
      continuousAxisChannelDefError,
      continuousAxisChannelDefError2,
      inputType,
      compositeMark,
      config,
    );

  const {
    [continuousAxis]: oldContinuousAxisChannelDef,
    [continuousAxis === 'x' ? 'x2' : 'y2']: oldContinuousAxisChannelDef2,
    [continuousAxis === 'x' ? 'xError' : 'yError']: oldContinuousAxisChannelDefError,
    [continuousAxis === 'x' ? 'xError2' : 'yError2']: oldContinuousAxisChannelDefError2,
    ...oldEncodingWithoutContinuousAxis
  } = encoding;

  const {
    bins,
    timeUnits,
    aggregate: oldAggregate,
    groupby: oldGroupBy,
    encoding: encodingWithoutContinuousAxis,
  } = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config);

  const aggregate: AggregatedFieldDef[] = [...oldAggregate, ...errorBarSpecificAggregate];
  const groupby: string[] = inputType !== 'raw' ? [] : oldGroupBy;

  const tooltipEncoding: ErrorEncoding<string> = getCompositeMarkTooltip(
    tooltipSummary,
    continuousAxisChannelDef,
    encodingWithoutContinuousAxis,
    tooltipTitleWithFieldName,
  );

  return {
    transform: [
      ...(outerSpec.transform ?? []),
      ...bins,
      ...timeUnits,
      ...(aggregate.length === 0 ? [] : [{aggregate, groupby}]),
      ...postAggregateCalculates,
    ],
    groupby,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    ticksOrient: orient === 'vertical' ? 'horizontal' : 'vertical',
    markDef,
    outerSpec,
    tooltipEncoding,
  };
}

function errorBarAggregationAndCalculation<
  M extends ErrorBar | ErrorBand,
  MD extends GenericCompositeMarkDef<M> & (ErrorBarDef | ErrorBandDef),
>(
  markDef: MD,
  continuousAxisChannelDef: PositionFieldDef<string>,
  continuousAxisChannelDef2: SecondaryFieldDef<string>,
  continuousAxisChannelDefError: SecondaryFieldDef<string>,
  continuousAxisChannelDefError2: SecondaryFieldDef<string>,
  inputType: ErrorInputType,
  compositeMark: M,
  config: Config,
): {
  postAggregateCalculates: CalculateTransform[];
  errorBarSpecificAggregate: AggregatedFieldDef[];
  tooltipSummary: CompositeMarkTooltipSummary[];
  tooltipTitleWithFieldName: boolean;
} {
  let errorBarSpecificAggregate: AggregatedFieldDef[] = [];
  let postAggregateCalculates: CalculateTransform[] = [];
  const continuousFieldName: string = continuousAxisChannelDef.field;

  let tooltipSummary: CompositeMarkTooltipSummary[];
  let tooltipTitleWithFieldName = false;

  if (inputType === 'raw') {
    const center: ErrorBarCenter = markDef.center
      ? markDef.center
      : markDef.extent
        ? markDef.extent === 'iqr'
          ? 'median'
          : 'mean'
        : config.errorbar.center;
    const extent: ErrorBarExtent = markDef.extent ? markDef.extent : center === 'mean' ? 'stderr' : 'iqr';

    if ((center === 'median') !== (extent === 'iqr')) {
      log.warn(log.message.errorBarCenterIsUsedWithWrongExtent(center, extent, compositeMark));
    }

    if (extent === 'stderr' || extent === 'stdev') {
      errorBarSpecificAggregate = [
        {op: extent, field: continuousFieldName, as: `extent_${continuousFieldName}`},
        {op: center, field: continuousFieldName, as: `center_${continuousFieldName}`},
      ];

      postAggregateCalculates = [
        {
          calculate: `${accessWithDatumToUnescapedPath(`center_${continuousFieldName}`)} + ${accessWithDatumToUnescapedPath(`extent_${continuousFieldName}`)}`,
          as: `upper_${continuousFieldName}`,
        },
        {
          calculate: `${accessWithDatumToUnescapedPath(`center_${continuousFieldName}`)} - ${accessWithDatumToUnescapedPath(`extent_${continuousFieldName}`)}`,
          as: `lower_${continuousFieldName}`,
        },
      ];

      tooltipSummary = [
        {fieldPrefix: 'center_', titlePrefix: titleCase(center)},
        {fieldPrefix: 'upper_', titlePrefix: getTitlePrefix(center, extent, '+')},
        {fieldPrefix: 'lower_', titlePrefix: getTitlePrefix(center, extent, '-')},
      ];
      tooltipTitleWithFieldName = true;
    } else {
      let centerOp: AggregateOp;
      let lowerExtentOp: AggregateOp;
      let upperExtentOp: AggregateOp;
      if (extent === 'ci') {
        centerOp = 'mean';
        lowerExtentOp = 'ci0';
        upperExtentOp = 'ci1';
      } else {
        centerOp = 'median';
        lowerExtentOp = 'q1';
        upperExtentOp = 'q3';
      }

      errorBarSpecificAggregate = [
        {op: lowerExtentOp, field: continuousFieldName, as: `lower_${continuousFieldName}`},
        {op: upperExtentOp, field: continuousFieldName, as: `upper_${continuousFieldName}`},
        {op: centerOp, field: continuousFieldName, as: `center_${continuousFieldName}`},
      ];

      tooltipSummary = [
        {
          fieldPrefix: 'upper_',
          titlePrefix: title({field: continuousFieldName, aggregate: upperExtentOp, type: 'quantitative'}, config, {
            allowDisabling: false,
          }),
        },
        {
          fieldPrefix: 'lower_',
          titlePrefix: title({field: continuousFieldName, aggregate: lowerExtentOp, type: 'quantitative'}, config, {
            allowDisabling: false,
          }),
        },
        {
          fieldPrefix: 'center_',
          titlePrefix: title({field: continuousFieldName, aggregate: centerOp, type: 'quantitative'}, config, {
            allowDisabling: false,
          }),
        },
      ];
    }
  } else {
    if (markDef.center || markDef.extent) {
      log.warn(log.message.errorBarCenterAndExtentAreNotNeeded(markDef.center, markDef.extent));
    }

    if (inputType === 'aggregated-upper-lower') {
      tooltipSummary = [];
      postAggregateCalculates = [
        {
          calculate: accessWithDatumToUnescapedPath(continuousAxisChannelDef2.field),
          as: `upper_${continuousFieldName}`,
        },
        {calculate: accessWithDatumToUnescapedPath(continuousFieldName), as: `lower_${continuousFieldName}`},
      ];
    } else if (inputType === 'aggregated-error') {
      tooltipSummary = [{fieldPrefix: '', titlePrefix: continuousFieldName}];
      postAggregateCalculates = [
        {
          calculate: `${accessWithDatumToUnescapedPath(continuousFieldName)} + ${accessWithDatumToUnescapedPath(continuousAxisChannelDefError.field)}`,
          as: `upper_${continuousFieldName}`,
        },
      ];

      if (continuousAxisChannelDefError2) {
        postAggregateCalculates.push({
          calculate: `${accessWithDatumToUnescapedPath(continuousFieldName)} + ${accessWithDatumToUnescapedPath(continuousAxisChannelDefError2.field)}`,
          as: `lower_${continuousFieldName}`,
        });
      } else {
        postAggregateCalculates.push({
          calculate: `${accessWithDatumToUnescapedPath(continuousFieldName)} - ${accessWithDatumToUnescapedPath(continuousAxisChannelDefError.field)}`,
          as: `lower_${continuousFieldName}`,
        });
      }
    }

    for (const postAggregateCalculate of postAggregateCalculates) {
      tooltipSummary.push({
        fieldPrefix: postAggregateCalculate.as.substring(0, 6),
        titlePrefix: replaceAll(replaceAll(postAggregateCalculate.calculate, "datum['", ''), "']", ''),
      });
    }
  }
  return {postAggregateCalculates, errorBarSpecificAggregate, tooltipSummary, tooltipTitleWithFieldName};
}

function getTitlePrefix(center: ErrorBarCenter, extent: ErrorBarExtent, operation: '+' | '-'): string {
  return `${titleCase(center)} ${operation} ${extent}`;
}
