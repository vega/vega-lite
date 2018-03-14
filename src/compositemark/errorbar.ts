import {isString} from 'vega-util';
import {Config} from '../config';
import {isMarkDef, Mark, MarkConfig} from '../mark';
import {AggregatedFieldDef, CalculateTransform} from '../transform';
import {Flag, keys} from '../util';
import {Encoding, extractTransformsFromEncoding} from './../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef, vgField} from './../fielddef';
import * as log from './../log';
import {GenericUnitSpec, NormalizedLayerSpec} from './../spec';
import {Orient} from './../vega.schema';
import {compositeMarkContinousAxis, compositeMarkOrient, filterUnsupportedChannels, GenericCompositeMarkDef, partLayerMixins} from './common';

export const ERRORBAR: 'errorbar' = 'errorbar';
export type ErrorBar = typeof ERRORBAR;

export type ErrorBarExtent = 'ci' | 'iqr' | 'stderr' | 'stdev';
export type ErrorBarCenter = 'mean' | 'median';

export type ErrorBarPart = 'bar' | 'line' | 'point' | 'ticks' | 'rule';

const ERRORBAR_PART_MARK: { [key: string]: Mark; }= {
  bar: 'bar',
  line: 'line',
  point: 'point',
  ticks: 'tick',
  rule: 'rule'
};

function getErrorBarPartMark(key: ErrorBarPart): Mark {
  return ERRORBAR_PART_MARK[key];
}

const ERRORBAR_PART_INDEX: Flag<ErrorBarPart> = {
  bar: 1,
  line: 1,
  point: 1,
  ticks: 1,
  rule: 1
};

export const ERRORBAR_PARTS = keys(ERRORBAR_PART_INDEX);

// TODO: Currently can't use `PartsMixins<ErrorBarPart>`
// as the schema generator will fail
export type ErrorBarPartsMixins = {
  [part in ErrorBarPart]?: boolean | MarkConfig
};

export interface ErrorBarConfig extends ErrorBarPartsMixins {
  /**
   * The center of the errorbar. Available options include:
   * - `"mean": the mean of the data points.
   * - `"median": the median of the data points.
   *
   * __Default value:__ `"mean"`.
   */
  center?: ErrorBarCenter;

  /**
   * The extent of the rule. Available options include:
   * - `"ci": Extend the rule to the confidence interval of the mean.
   * - `"stderr": The size of rule are set to the value of standard error, extending from the center.
   * - `"stdev": The size of rule are set to the value of standard deviation, extending from the center.
   * - `"iqr": Extend the rule to the q1 and q3.
   *
   * __Default value:__ `"stderr"`.
   */
  extent?: ErrorBarExtent;
}

export type ErrorBarDef = GenericCompositeMarkDef<ErrorBar> & ErrorBarConfig & {
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

export function normalizeErrorBar(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>, config: Config): NormalizedLayerSpec {
  spec = filterUnsupportedChannels(spec, ERRORBAR);

  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;
  const markDef: ErrorBarDef = isMarkDef(mark) ? mark : {type: mark};

  // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
  if (selection) {
    log.warn(log.message.selectionNotSupported('errorbar'));
  }

  const center: ErrorBarCenter = markDef.center || config.errorbar.center;
  const extent: ErrorBarExtent = markDef.extent || ((center === 'mean') ? 'stderr' : 'iqr');

  if ((center === 'median') !== (extent === 'iqr')) {
    log.warn(`${center} is not usually used with ${extent} for error bar.`);
  }

  const orient: Orient = compositeMarkOrient(spec, ERRORBAR);
  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = errorBarParams(spec, orient, center, extent);

  const {size: _s, ...encodingWithoutSizeAndContinuousAxis} = encodingWithoutContinuousAxis;

  const {scale, axis} = continuousAxisChannelDef;

  function errorBarPartSpec(partName: ErrorBarPart, startingPosition: string = center, endingPosition: string = undefined) {
    const title = (axis && axis.title !== undefined) ? axis.title :
      continuousAxisChannelDef.title !== undefined ? continuousAxisChannelDef.title :
      continuousAxisChannelDef.field;

    return partLayerMixins<ErrorBarPartsMixins>(
      markDef, partName, config.errorbar,
      {
        mark: getErrorBarPartMark(partName),
        encoding: {
          [continuousAxis]: {
            field: startingPosition + '_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type,
            title,
            ...(scale ? {scale} : {}),
            ...(axis ? {axis} : {})
          },
          ...(isString(endingPosition) ? {
            [continuousAxis + '2']: {
              field: endingPosition + '_' + continuousAxisChannelDef.field,
              type: continuousAxisChannelDef.type
            }
          } : {}),
          ...encodingWithoutSizeAndContinuousAxis
        }
      }
    );
  }

  return {
    ...outerSpec,
    transform,
    layer: [
      ...errorBarPartSpec('bar'),
      ...errorBarPartSpec('line'),
      ...errorBarPartSpec('ticks', 'lower_rule'),
      ...errorBarPartSpec('ticks', 'upper_rule'),
      ...errorBarPartSpec('rule', 'lower_rule', 'upper_rule'),
      ...errorBarPartSpec('point')
    ]
  };
}

function errorBarParams(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>, orient: Orient, center: ErrorBarCenter, extent: ErrorBarExtent) {
  const {continuousAxisChannelDef, continuousAxis} = compositeMarkContinousAxis(spec, orient, ERRORBAR);
  const continuousFieldName: string = continuousAxisChannelDef.field;
  let errorbarSpecificAggregate: AggregatedFieldDef[] = [];
  let postAggregateCalculates: CalculateTransform[] = [];

  if (extent === 'stderr' || extent === 'stdev') {
    errorbarSpecificAggregate = [{
      op: extent,
      field: continuousFieldName,
      as: 'extent_' + continuousFieldName
    }];

    postAggregateCalculates = [{
        calculate: `datum.${center}_${continuousFieldName} + datum.extent_${continuousFieldName}`,
        as: 'upper_rule_' + continuousFieldName
      },
      {
        calculate: `datum.${center}_${continuousFieldName} - datum.extent_${continuousFieldName}`,
        as: 'lower_rule_' + continuousFieldName
    }];
  } else {
    errorbarSpecificAggregate = [
      {
        op: (extent === 'ci') ? 'ci0' : 'q1',
        field: continuousFieldName,
        as: 'lower_rule_' + continuousFieldName
      },
      {
        op: (extent === 'ci') ? 'ci1' : 'q3',
        field: continuousFieldName,
        as: 'upper_rule_' + continuousFieldName
      }
    ];
  }

  errorbarSpecificAggregate.push({
    op: center,
    field: continuousFieldName,
    as: center + '_' + continuousFieldName
  });

  const {[continuousAxis]: oldContinuousAxisChannelDef, ...oldEncodingWithoutContinuousAxis} = spec.encoding;

  const {bins, timeUnits, aggregate, groupby, encoding: encodingWithoutContinuousAxis} = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis);

  return {
    transform: [
      ...bins,
      ...timeUnits,
      {
        aggregate: [...aggregate, ...errorbarSpecificAggregate],
        groupby
      },
      ...postAggregateCalculates
    ],
    groupby,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis
  };
}
