import {isBoolean, isObject} from 'vega-util';

import {isAggregateOp} from '../aggregate';
import {Channel} from '../channel';
import {Encoding, forEach, reduce} from '../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef, vgField} from '../fielddef';
import {ColorMixins, GenericMarkDef, isMarkDef, MarkConfig, VL_ONLY_MARK_CONFIG_PROPERTIES} from '../mark';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec';
import {AggregatedFieldDef, BinTransform, CalculateTransform, TimeUnitTransform} from '../transform';
import {Orient} from '../vega.schema';
import * as log from './../log';
import {CompositeMark, CompositeMarkDef} from './index';

export type PartsMixins<P extends string> = {
  [part in P]?: boolean | MarkConfig
};

export type GenericCompositeMarkDef<T> = GenericMarkDef<T> & ColorMixins & {
  /**
   * Opacity of the marks.
   */
  opacity?: number;
};

export function partLayerMixins<P extends PartsMixins<any>>(
  markDef: GenericCompositeMarkDef<any> & P, part: keyof P, compositeMarkConfig: P,
  partBaseSpec: NormalizedUnitSpec
): NormalizedUnitSpec[] {
  const {color, opacity} = markDef;

  const mark = markDef.type;

  if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
    return [{
      ...partBaseSpec,
      mark: {
        ...compositeMarkConfig[part] as MarkConfig,
        ...(color ? {color} : {}),
        ...(opacity ? {opacity} : {}),
        ...(isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : {type: partBaseSpec.mark}),
        style: `${mark}-${part}`,
        ...(isBoolean(markDef[part]) ? {} : markDef[part] as MarkConfig)
      }
    }];
  }
  return [];
}

export function compositeMarkCombineParams(
    encoding: Encoding<string>,
    continuousAxis: 'x' | 'y',
    aggregate: AggregatedFieldDef[],
    postAggregateCalculates: CalculateTransform[],
    continuousAxisChannelDef: PositionFieldDef<string>
) {
  const groupby: string[] = [];
  const bins: BinTransform[] = [];
  const timeUnits: TimeUnitTransform[] = [];

  const encodingWithoutContinuousAxis: Encoding<string> = {};
  forEach(encoding, (channelDef, channel) => {
    if (channel === continuousAxis) {
      // Skip continuous axis as we already handle it separately
      return;
    }
    if (isFieldDef(channelDef)) {
      if (channelDef.aggregate && isAggregateOp(channelDef.aggregate)) {
        aggregate.push({
          op: channelDef.aggregate,
          field: channelDef.field,
          as: vgField(channelDef)
        });
      } else if (channelDef.aggregate === undefined) {
        const transformedField = vgField(channelDef);

        // Add bin or timeUnit transform if applicable
        const bin = channelDef.bin;
        if (bin) {
          const {field} = channelDef;
          bins.push({bin, field, as: transformedField});
        } else if (channelDef.timeUnit) {
          const {timeUnit, field} = channelDef;
          timeUnits.push({timeUnit, field, as: transformedField});
        }

        groupby.push(transformedField);
      }
      // now the field should refer to post-transformed field instead
      encodingWithoutContinuousAxis[channel] = {
        field: vgField(channelDef),
        type: channelDef.type
      };
    } else {
      // For value def, just copy
      encodingWithoutContinuousAxis[channel] = encoding[channel];
    }
  });

  return {
    transform: [
      ...bins,
      ...timeUnits,
      {aggregate, groupby},
      ...postAggregateCalculates
    ],
    groupby,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis
  };
}

export function compositeMarkContinousAxis<M extends CompositeMark>(
  spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>,
  orient: Orient,
  compositeMark: M
) {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  let continuousAxisChannelDef: PositionFieldDef<string>;
  let continuousAxis: 'x' | 'y';

  if (orient === 'vertical') {
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y as FieldDef<string>; // Safe to cast because if y is not continuous fielddef, the orient would not be vertical.
  } else {
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x as FieldDef<string>; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
  }

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== compositeMark) {
      log.warn(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    continuousAxisChannelDef,
    continuousAxis
  };
}

export function compositeMarkOrient<M extends CompositeMark>(
  spec: GenericUnitSpec<Encoding<Field>,
  CompositeMark | CompositeMarkDef>,
  compositeMark: M
): Orient {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // x is continuous
    if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // both x and y are continuous
      if (encoding.x.aggregate === undefined && encoding.y.aggregate === compositeMark) {
        return 'vertical';
      } else if (encoding.y.aggregate === undefined && encoding.x.aggregate === compositeMark) {
        return 'horizontal';
      } else if (encoding.x.aggregate === compositeMark && encoding.y.aggregate === compositeMark) {
        throw new Error('Both x and y cannot have aggregate');
      } else {
        if (isMarkDef(mark) && mark.orient) {
          return mark.orient;
        }

        // default orientation = vertical
        return 'vertical';
      }
    }

    // x is continuous but y is not
    return 'horizontal';
  } else if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
    // y is continuous but x is not
    return 'vertical';
  } else {
    // Neither x nor y is continuous.
    throw new Error('Need a valid continuous axis for ' + compositeMark);
  }
}

const supportedChannels: Channel[] = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function filterUnsupportedChannels<M extends CompositeMark, MD extends GenericCompositeMarkDef<M>>(
  spec: GenericUnitSpec<Encoding<string>, M | MD>,
  compositeMark: M
): GenericUnitSpec<Encoding<string>, M | MD> {
  return {
    ...spec,
    encoding: reduce(spec.encoding, (newEncoding, fieldDef, channel) => {
      if (supportedChannels.indexOf(channel) > -1) {
        newEncoding[channel] = fieldDef;
      } else {
        log.warn(log.message.incompatibleChannel(channel, compositeMark));
      }
      return newEncoding;
    }, {}),
  };
}
