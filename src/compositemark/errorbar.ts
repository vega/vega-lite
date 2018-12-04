import {Channel} from '../channel';
import {Config} from '../config';
import {Data} from '../data';
import {Encoding, extractTransformsFromEncoding} from '../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef} from '../fielddef';
import * as log from '../log';
import {isMarkDef, MarkDef} from '../mark';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec';
import {TitleParams} from '../title';
import {AggregatedFieldDef, CalculateTransform, Transform} from '../transform';
import {Flag, keys} from '../util';
import {Orient} from '../vega.schema';
import {
  compositeMarkContinuousAxis,
  compositeMarkOrient,
  filterUnsupportedChannels,
  GenericCompositeMarkDef,
  makeCompositeAggregatePartFactory,
  PartsMixins
} from './common';
import {ErrorBand, ErrorBandDef} from './errorband';

export const ERRORBAR: 'errorbar' = 'errorbar';
export type ErrorBar = typeof ERRORBAR;

export type ErrorBarExtent = 'ci' | 'iqr' | 'stderr' | 'stdev';
export type ErrorBarCenter = 'mean' | 'median';

export type ErrorBarPart = 'ticks' | 'rule';

export type ErrorInputType = 'raw' | 'aggregated-upper-lower' | 'aggregated-error';

const ERRORBAR_PART_INDEX: Flag<ErrorBarPart> = {
  ticks: 1,
  rule: 1
};

export const ERRORBAR_PARTS = keys(ERRORBAR_PART_INDEX);

export type ErrorBarPartsMixins = PartsMixins<ErrorBarPart>;

export interface ErrorBarConfig extends ErrorBarPartsMixins {
  /**
   * The center of the errorbar. Available options include:
   * - `"mean"`: the mean of the data points.
   * - `"median"`: the median of the data points.
   *
   * __Default value:__ `"mean"`.
   * @hide
   */

  // center is not needed right now but will be added back to the schema if future features require it.
  center?: ErrorBarCenter;

  /**
   * The extent of the rule. Available options include:
   * - `"ci"`: Extend the rule to the confidence interval of the mean.
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
     * Orientation of the error bar.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orient;
  };

export interface ErrorBarConfigMixins {
  /**
   * ErrorBar Config
   */
  errorbar?: ErrorBarConfig;
}

export function normalizeErrorBar(
  spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>,
  config: Config
): NormalizedLayerSpec {
  const {
    transform,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    ticksOrient,
    markDef,
    outerSpec
  } = errorBarParams(spec, ERRORBAR, config);

  const makeErrorBarPart = makeCompositeAggregatePartFactory<ErrorBarPartsMixins>(
    markDef,
    continuousAxis,
    continuousAxisChannelDef,
    encodingWithoutContinuousAxis,
    config.errorbar
  );

  const tick: MarkDef = {type: 'tick', orient: ticksOrient};

  return {
    ...outerSpec,
    transform,
    layer: [
      ...makeErrorBarPart('ticks', tick, 'lower'),
      ...makeErrorBarPart('ticks', tick, 'upper'),
      ...makeErrorBarPart('rule', 'rule', 'lower', 'upper')
    ]
  };
}

function errorBarOrientAndInputType(
  spec: GenericUnitSpec<Encoding<Field>, ErrorBar | ErrorBand | ErrorBarDef | ErrorBandDef>,
  compositeMark: ErrorBar | ErrorBand
): {
  orient: Orient;
  inputType: ErrorInputType;
} {
  const {encoding} = spec;

  if (errorBarIsInputTypeRaw(encoding)) {
    return {
      orient: compositeMarkOrient(spec, compositeMark),
      inputType: 'raw'
    };
  }

  const isTypeAggregatedUpperLower: boolean = errorBarIsInputTypeAggregatedUpperLower(encoding);
  const isTypeAggregatedError: boolean = errorBarIsInputTypeAggregatedError(encoding);
  const x = encoding.x;
  const y = encoding.y;

  if (isTypeAggregatedUpperLower) {
    // type is aggregated-upper-lower

    if (isTypeAggregatedError) {
      throw new Error(compositeMark + ' cannot be both type aggregated-upper-lower and aggregated-error');
    }

    const x2 = encoding.x2;
    const y2 = encoding.y2;

    if (isFieldDef(x2) && isFieldDef(y2)) {
      // having both x, x2 and y, y2
      throw new Error(compositeMark + ' cannot have both x2 and y2');
    } else if (isFieldDef(x2)) {
      if (isContinuous(x2) && isFieldDef(x) && isContinuous(x)) {
        // having x, x2 quantitative and field y, y2 are not specified
        return {orient: 'horizontal', inputType: 'aggregated-upper-lower'};
      } else {
        // having x, x2 that are not both quantitative
        throw new Error('Both x and x2 have to be quantitative in ' + compositeMark);
      }
    } else {
      // y2 is a FieldDef
      if (isContinuous(y2 as FieldDef<string>) && isFieldDef(y) && isContinuous(y)) {
        // having y, y2 quantitative and field x, x2 are not specified
        return {orient: 'vertical', inputType: 'aggregated-upper-lower'};
      } else {
        // having y, y2 that are not both quantitative
        throw new Error('Both y and y2 have to be quantitative in ' + compositeMark);
      }
    }
  } else {
    // type is aggregated-error

    const xError = encoding.xError;
    const xError2 = encoding.xError2;
    const yError = encoding.yError;
    const yError2 = encoding.yError2;

    if (isFieldDef(xError2) && !isFieldDef(xError)) {
      // having xError2 without xError
      throw new Error(compositeMark + ' cannot have xError2 without xError');
    }

    if (isFieldDef(yError2) && !isFieldDef(yError)) {
      // having yError2 without yError
      throw new Error(compositeMark + ' cannot have yError2 without yError');
    }

    if (isFieldDef(xError) && isFieldDef(yError)) {
      // having both xError and yError
      throw new Error(compositeMark + ' cannot have both xError and yError with both are quantiative');
    } else if (isFieldDef(xError)) {
      if (isContinuous(xError) && isFieldDef(x) && isContinuous(x) && (!isFieldDef(xError2) || isContinuous(xError2))) {
        // having x, xError, xError2 that are all quantitative, or x and xError that are quantitative without xError2
        return {orient: 'horizontal', inputType: 'aggregated-error'};
      } else {
        // having x, xError, and xError2 that are not all quantitative
        throw new Error('All x, xError, and xError2 (if exist) have to be quantitative');
      }
    } else {
      if (
        isContinuous(yError as FieldDef<string>) &&
        isFieldDef(y) &&
        isContinuous(y) &&
        (!isFieldDef(yError2) || isContinuous(yError2))
      ) {
        // having y, yError, yError2 that are all quantitative, or y and yError that are quantitative without yError2
        return {orient: 'vertical', inputType: 'aggregated-error'};
      } else {
        // having y, yError, and yError2 that are not all quantitative
        throw new Error('All y, yError, and yError2 (if exist) have to be quantitative');
      }
    }
  }
}

function errorBarIsInputTypeRaw(encoding: Encoding<Field>): boolean {
  return (
    (isFieldDef(encoding.x) || isFieldDef(encoding.y)) &&
    !isFieldDef(encoding.x2) &&
    !isFieldDef(encoding.y2) &&
    !isFieldDef(encoding.xError) &&
    !isFieldDef(encoding.xError2) &&
    !isFieldDef(encoding.yError) &&
    !isFieldDef(encoding.yError2)
  );
}

function errorBarIsInputTypeAggregatedUpperLower(encoding: Encoding<Field>): boolean {
  return isFieldDef(encoding.x2) || isFieldDef(encoding.y2);
}

function errorBarIsInputTypeAggregatedError(encoding: Encoding<Field>): boolean {
  return (
    isFieldDef(encoding.xError) ||
    isFieldDef(encoding.xError2) ||
    isFieldDef(encoding.yError) ||
    isFieldDef(encoding.yError2)
  );
}

export const errorBarSupportedChannels: Channel[] = [
  'x',
  'y',
  'x2',
  'y2',
  'xError',
  'yError',
  'xError2',
  'yError2',
  'color',
  'detail',
  'opacity'
];

export function errorBarParams<
  M extends ErrorBar | ErrorBand,
  MD extends GenericCompositeMarkDef<M> & (ErrorBarDef | ErrorBandDef)
>(
  spec: GenericUnitSpec<Encoding<string>, M | MD>,
  compositeMark: M,
  config: Config
): {
  transform: Transform[];
  groupby: string[];
  continuousAxisChannelDef: PositionFieldDef<string>;
  continuousAxis: 'x' | 'y';
  encodingWithoutContinuousAxis: Encoding<string>;
  ticksOrient: Orient;
  markDef: MD;
  outerSpec: {
    data?: Data;
    title?: string | TitleParams;
    name?: string;
    description?: string;
    transform?: Transform[];
    width?: number;
    height?: number;
  };
} {
  spec = filterUnsupportedChannels<M, MD>(spec, errorBarSupportedChannels, compositeMark);

  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;
  const markDef: MD = isMarkDef(mark) ? mark : ({type: mark} as MD);

  // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
  if (selection) {
    log.warn(log.message.selectionNotSupported(compositeMark));
  }

  const {orient, inputType} = errorBarOrientAndInputType(spec, compositeMark);
  const {
    continuousAxisChannelDef,
    continuousAxisChannelDef2,
    continuousAxisChannelDefError,
    continuousAxisChannelDefError2,
    continuousAxis
  } = compositeMarkContinuousAxis(spec, orient, compositeMark);

  const {errorBarSpecificAggregate, postAggregateCalculates} = errorBarAggregationAndCalculation(
    markDef,
    continuousAxisChannelDef,
    continuousAxisChannelDef2,
    continuousAxisChannelDefError,
    continuousAxisChannelDefError2,
    inputType,
    compositeMark,
    config
  );

  const {
    [continuousAxis]: oldContinuousAxisChannelDef,
    [continuousAxis + '2']: oldContinuousAxisChannelDef2,
    [continuousAxis + 'Error']: oldContinuousAxisChannelDefError,
    [continuousAxis + 'Error2']: oldContinuousAxisChannelDefError2,
    ...oldEncodingWithoutContinuousAxis
  } = encoding;

  const {
    bins,
    timeUnits,
    aggregate: oldAggregate,
    groupby: oldGroupBy,
    encoding: encodingWithoutContinuousAxis
  } = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config);

  const aggregate: AggregatedFieldDef[] = [...oldAggregate, ...errorBarSpecificAggregate];
  const groupby: string[] = inputType !== 'raw' ? [] : oldGroupBy;

  return {
    transform: [
      ...(outerSpec.transform || []),
      ...bins,
      ...timeUnits,
      ...(!aggregate.length ? [] : [{aggregate, groupby}]),
      ...postAggregateCalculates
    ],
    groupby,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    ticksOrient: orient === 'vertical' ? 'horizontal' : 'vertical',
    markDef,
    outerSpec
  };
}

function errorBarAggregationAndCalculation<
  M extends ErrorBar | ErrorBand,
  MD extends GenericCompositeMarkDef<M> & (ErrorBarDef | ErrorBandDef)
>(
  markDef: MD,
  continuousAxisChannelDef: PositionFieldDef<string>,
  continuousAxisChannelDef2: PositionFieldDef<string>,
  continuousAxisChannelDefError: PositionFieldDef<string>,
  continuousAxisChannelDefError2: PositionFieldDef<string>,
  inputType: ErrorInputType,
  compositeMark: M,
  config: Config
): {
  postAggregateCalculates: CalculateTransform[];
  errorBarSpecificAggregate: AggregatedFieldDef[];
} {
  let errorBarSpecificAggregate: AggregatedFieldDef[] = [];
  let postAggregateCalculates: CalculateTransform[] = [];
  const continuousFieldName: string = continuousAxisChannelDef.field;

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
        {op: extent, field: continuousFieldName, as: 'extent_' + continuousFieldName},
        {op: center, field: continuousFieldName, as: 'center_' + continuousFieldName}
      ];

      postAggregateCalculates = [
        {
          calculate: `datum.center_${continuousFieldName} + datum.extent_${continuousFieldName}`,
          as: 'upper_' + continuousFieldName
        },
        {
          calculate: `datum.center_${continuousFieldName} - datum.extent_${continuousFieldName}`,
          as: 'lower_' + continuousFieldName
        }
      ];
    } else {
      if (markDef.center && markDef.extent) {
        log.warn(log.message.errorBarCenterIsNotNeeded(markDef.extent, compositeMark));
      }

      errorBarSpecificAggregate = [
        {op: extent === 'ci' ? 'ci0' : 'q1', field: continuousFieldName, as: 'lower_' + continuousFieldName},
        {op: extent === 'ci' ? 'ci1' : 'q3', field: continuousFieldName, as: 'upper_' + continuousFieldName}
      ];
    }
  } else {
    if (markDef.center || markDef.extent) {
      log.warn(log.message.errorBarCenterAndExtentAreNotNeeded(markDef.center, markDef.extent));
    }

    if (inputType === 'aggregated-upper-lower') {
      postAggregateCalculates = [
        {calculate: `datum.${continuousFieldName}`, as: `lower_` + continuousFieldName},
        {calculate: `datum.${continuousAxisChannelDef2.field}`, as: `upper_` + continuousFieldName}
      ];
    } else if (inputType === 'aggregated-error') {
      postAggregateCalculates = [
        {
          calculate: `datum.${continuousFieldName} + datum.${continuousAxisChannelDefError.field}`,
          as: `upper_` + continuousFieldName
        }
      ];

      if (continuousAxisChannelDefError2) {
        postAggregateCalculates.push({
          calculate: `datum.${continuousFieldName} + datum.${continuousAxisChannelDefError2.field}`,
          as: `lower_` + continuousFieldName
        });
      } else {
        postAggregateCalculates.push({
          calculate: `datum.${continuousFieldName} - datum.${continuousAxisChannelDefError.field}`,
          as: `lower_` + continuousFieldName
        });
      }
    }
  }
  return {postAggregateCalculates, errorBarSpecificAggregate};
}
