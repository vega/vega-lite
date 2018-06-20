import {isBoolean, isString} from 'vega-util';

import {CompositeMark, CompositeMarkDef} from '.';
import {Channel} from '../channel';
import {Encoding, reduce} from '../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef} from '../fielddef';
import {ColorMixins, GenericMarkDef, isMarkDef, Mark, MarkConfig, MarkDef} from '../mark';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec';
import {Orient} from '../vega.schema';
import * as log from './../log';

export type PartsMixins<P extends string> = Partial<Record<P, boolean | MarkConfig>>;

export type GenericCompositeMarkDef<T> = GenericMarkDef<T> & ColorMixins & {
  /**
   * Opacity of the marks.
   */
  opacity?: number;
};

export function makeCompositeAggregatePartFactory<P extends PartsMixins<any>>(
  compositeMarkDef: GenericCompositeMarkDef<any> & P,
  continuousAxis: 'x' | 'y',
  continuousAxisChannelDef: PositionFieldDef<string>,
  sharedEncoding: Encoding<string>,
  compositeMarkConfig: P
) {
  const {scale, axis} = continuousAxisChannelDef;

  return (partName: keyof P, mark: Mark | MarkDef, positionPrefix: string, endPositionPrefix: string = undefined, extraEncoding: Encoding<string> = {}) => {
    const title = (axis && axis.title !== undefined) ? undefined :
      continuousAxisChannelDef.title !== undefined ? continuousAxisChannelDef.title :
        continuousAxisChannelDef.field;

    return partLayerMixins<P>(
      compositeMarkDef, partName, compositeMarkConfig,
      {
        mark, // TODO better remove this method and just have mark as a parameter of the method
        encoding: {
          [continuousAxis]: {
            field: positionPrefix + '_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type,
            title,
            ...(scale ? {scale} : {}),
            ...(axis ? {axis} : {})
          },
          ...(isString(endPositionPrefix) ? {
            [continuousAxis + '2']: {
              field: endPositionPrefix + '_' + continuousAxisChannelDef.field,
              type: continuousAxisChannelDef.type
            }
          } : {}),
          ...sharedEncoding,
          ...extraEncoding
        }
      }
    );
  };
}

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

export function compositeMarkContinuousAxis<M extends CompositeMark>(
  spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>,
  orient: Orient,
  compositeMark: M
) {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  let continuousAxisChannelDef: PositionFieldDef<string>;
  let continuousAxisChannelDef2: PositionFieldDef<string>;
  let continuousAxis: 'x' | 'y';

  if (orient === 'vertical') {
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y as FieldDef<string>; // Safe to cast because if y is not continuous fielddef, the orient would not be vertical.
    continuousAxisChannelDef2 = encoding.y2 ? encoding.y2 as FieldDef<string> : undefined;
  } else {
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x as FieldDef<string>; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
    continuousAxisChannelDef2 = encoding.x2 ? encoding.x2 as FieldDef<string> : undefined;
  }

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== compositeMark) {
      log.warn(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark));
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  if (continuousAxisChannelDef2 && continuousAxisChannelDef2.aggregate) {
    const {aggregate, ...continuousAxisWithoutAggregate2} = continuousAxisChannelDef2;
    if (aggregate !== compositeMark) {
      log.warn(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark));
    }
    continuousAxisChannelDef2 = continuousAxisWithoutAggregate2;
  }

  return {
    continuousAxisChannelDef,
    continuousAxisChannelDef2,
    continuousAxis
  };
}

export function compositeMarkOrient<M extends CompositeMark>(
  spec: GenericUnitSpec<Encoding<Field>,
  CompositeMark | CompositeMarkDef>,
  compositeMark: M
): {
  orient: Orient,
  isDataAggregated: boolean
} {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  let isDataAggregated = true;

  if (isFieldDef(encoding.x2) && isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // having x and x2
    if (isFieldDef(encoding.y2) && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // having both x, x2 and y, y2
      throw new Error('Cannot have both x2 and y2 with both are quantiative');
    } else {
      // having x, x2 but not y, y2
      return {orient: 'horizontal', isDataAggregated};
    }
  } else if (isFieldDef(encoding.y2) && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
    // having y, y2 but not x, x2
    return {orient: 'vertical', isDataAggregated};
  }

  isDataAggregated = false;

  if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // x is continuous
    if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // both x and y are continuous
      if (encoding.x.aggregate === undefined && encoding.y.aggregate === compositeMark) {
        return {orient: 'vertical', isDataAggregated};
      } else if (encoding.y.aggregate === undefined && encoding.x.aggregate === compositeMark) {
        return {orient: 'horizontal', isDataAggregated};
      } else if (encoding.x.aggregate === compositeMark && encoding.y.aggregate === compositeMark) {
        throw new Error('Both x and y cannot have aggregate');
      } else {
        if (isMarkDef(mark) && mark.orient) {
          return {orient: mark.orient, isDataAggregated};
        }

        // default orientation = vertical
        return {orient: 'vertical', isDataAggregated};
      }
    }

    // x is continuous but y is not
    return {orient: 'horizontal', isDataAggregated};
  } else if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
    // y is continuous but x is not
    return {orient: 'vertical', isDataAggregated};
  } else {
    // Neither x nor y is continuous.
    throw new Error('Need a valid continuous axis for ' + compositeMark + 's');
  }
}

export function filterUnsupportedChannels<M extends CompositeMark, MD extends GenericCompositeMarkDef<M>>(
  spec: GenericUnitSpec<Encoding<string>, M | MD>,
  supportedChannels: Channel[],
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
