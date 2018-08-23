import {Channel} from '../channel';
import {Config} from '../config';
import {Data} from '../data';
import {Encoding, extractTransformsFromEncoding} from '../encoding';
import {Field, isContinuous, isFieldDef, PositionFieldDef} from '../fielddef';
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

function errorBarOrientAndRange(
  spec: GenericUnitSpec<Encoding<Field>, ErrorBar | ErrorBand | ErrorBarDef | ErrorBandDef>,
  compositeMark: ErrorBar | ErrorBand
): {
  orient: Orient;
  isRangedErrorBar: boolean;
} {
  const {encoding} = spec;
  if (isFieldDef(encoding.x2) && isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // having x and x2
    if (isFieldDef(encoding.y2) && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // having both x, x2 and y, y2
      throw new Error('Cannot have both x2 and y2 with both are quantiative');
    } else {
      // having x, x2 but not y, y2
      return {orient: 'horizontal', isRangedErrorBar: true};
    }
  } else if (isFieldDef(encoding.y2) && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
    // having y, y2 but not x, x2
    return {orient: 'vertical', isRangedErrorBar: true};
  }

  return {
    orient: compositeMarkOrient(spec, compositeMark),
    isRangedErrorBar: false
  };
}

export const errorBarSupportedChannels: Channel[] = ['x', 'y', 'x2', 'y2', 'color', 'detail', 'opacity'];

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

  const {orient, isRangedErrorBar} = errorBarOrientAndRange(spec, compositeMark);
  const {continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxis} = compositeMarkContinuousAxis(
    spec,
    orient,
    compositeMark
  );
  const {errorBarSpecificAggregate, postAggregateCalculates} = errorBarAggregationAndCalculation(
    markDef,
    continuousAxisChannelDef,
    continuousAxisChannelDef2,
    isRangedErrorBar,
    compositeMark,
    config
  );

  const {
    [continuousAxis]: oldContinuousAxisChannelDef,
    [continuousAxis + '2']: oldContinuousAxisChannelDef2,
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
  const groupby: string[] = isRangedErrorBar ? [] : oldGroupBy;

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
  isRangedErrorBar: boolean,
  compositeMark: M,
  config: Config
): {
  postAggregateCalculates: CalculateTransform[];
  errorBarSpecificAggregate: AggregatedFieldDef[];
} {
  let errorBarSpecificAggregate: AggregatedFieldDef[] = [];
  let postAggregateCalculates: CalculateTransform[] = [];
  const continuousFieldName: string = continuousAxisChannelDef.field;

  if (isRangedErrorBar) {
    if (markDef.center || markDef.extent) {
      log.warn(log.message.errorBarCenterAndExtentAreNotNeeded(markDef.center, markDef.extent));
    }

    postAggregateCalculates = [
      {
        calculate: `datum.${continuousFieldName}`,
        as: `lower_` + continuousFieldName
      },
      {
        calculate: `datum.${continuousAxisChannelDef2.field}`,
        as: `upper_` + continuousFieldName
      }
    ];
  } else {
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
        {
          op: extent,
          field: continuousFieldName,
          as: 'extent_' + continuousFieldName
        },
        {
          op: center,
          field: continuousFieldName,
          as: 'center_' + continuousFieldName
        }
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
        {
          op: extent === 'ci' ? 'ci0' : 'q1',
          field: continuousFieldName,
          as: 'lower_' + continuousFieldName
        },
        {
          op: extent === 'ci' ? 'ci1' : 'q3',
          field: continuousFieldName,
          as: 'upper_' + continuousFieldName
        }
      ];
    }
  }
  return {postAggregateCalculates, errorBarSpecificAggregate};
}
