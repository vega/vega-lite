import {isBoolean, isString} from 'vega-util';
import {CompositeMark, CompositeMarkDef} from '.';
import {Encoding, fieldDefs} from '../encoding';
import {
  Field,
  FieldDefBase,
  FieldDefWithoutScale,
  isContinuous,
  isFieldDef,
  PositionFieldDef,
  SecondaryFieldDef,
  TextFieldDef
} from '../fielddef';
import * as log from '../log';
import {ColorMixins, GenericMarkDef, isMarkDef, Mark, MarkConfig, MarkDef} from '../mark';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec';
import {Orient} from '../vega.schema';

export type PartsMixins<P extends string> = Partial<Record<P, boolean | MarkConfig>>;

export type GenericCompositeMarkDef<T> = GenericMarkDef<T> &
  ColorMixins & {
    /**
     * The opacity (value between [0,1]) of the mark.
     */
    opacity?: number;

    /**
     * Whether a composite mark be clipped to the enclosing group’s width and height.
     */
    clip?: boolean;
  };

export interface CompositeMarkTooltipSummary {
  /**
   * The prefix of the field to be shown in tooltip
   */
  fieldPrefix: string;

  /**
   * The title prefix to show, corresponding to the field with field prefix `fieldPrefix`
   */
  titlePrefix: string;
}

export function getCompositeMarkTooltip(
  tooltipSummary: CompositeMarkTooltipSummary[],
  continuousAxisChannelDef: PositionFieldDef<string>,
  encodingWithoutContinuousAxis: Encoding<string>,
  withFieldName: boolean = true
): Encoding<string> {
  const fiveSummaryTooltip: TextFieldDef<string>[] = tooltipSummary.map(
    ({fieldPrefix, titlePrefix}): TextFieldDef<string> => ({
      field: fieldPrefix + continuousAxisChannelDef.field,
      type: continuousAxisChannelDef.type,
      title: titlePrefix + (withFieldName ? ' of ' + continuousAxisChannelDef.field : '')
    })
  );

  return {
    tooltip: [
      ...fiveSummaryTooltip,
      // need to cast because TextFieldDef support fewer types of bin
      ...(fieldDefs(encodingWithoutContinuousAxis) as TextFieldDef<string>[])
    ]
  };
}

export function makeCompositeAggregatePartFactory<P extends PartsMixins<any>>(
  compositeMarkDef: GenericCompositeMarkDef<any> & P,
  continuousAxis: 'x' | 'y',
  continuousAxisChannelDef: PositionFieldDef<string>,
  sharedEncoding: Encoding<string>,
  compositeMarkConfig: P
) {
  const {scale, axis} = continuousAxisChannelDef;

  return ({
    partName,
    mark,
    positionPrefix,
    endPositionPrefix = undefined,
    extraEncoding = {}
  }: {
    partName: keyof P;
    mark: Mark | MarkDef;
    positionPrefix: string;
    endPositionPrefix?: string;
    extraEncoding?: Encoding<string>;
  }) => {
    const title =
      axis && axis.title !== undefined
        ? undefined
        : continuousAxisChannelDef.title !== undefined
        ? continuousAxisChannelDef.title
        : continuousAxisChannelDef.field;

    return partLayerMixins<P>(compositeMarkDef, partName, compositeMarkConfig, {
      mark, // TODO better remove this method and just have mark as a parameter of the method
      encoding: {
        [continuousAxis]: {
          field: positionPrefix + '_' + continuousAxisChannelDef.field,
          type: continuousAxisChannelDef.type,
          ...(title ? {title} : {}),
          ...(scale ? {scale} : {}),
          ...(axis ? {axis} : {})
        },
        ...(isString(endPositionPrefix)
          ? {
              [continuousAxis + '2']: {
                field: endPositionPrefix + '_' + continuousAxisChannelDef.field,
                type: continuousAxisChannelDef.type
              }
            }
          : {}),
        ...sharedEncoding,
        ...extraEncoding
      }
    });
  };
}

export function partLayerMixins<P extends PartsMixins<any>>(
  markDef: GenericCompositeMarkDef<any> & P,
  part: keyof P,
  compositeMarkConfig: P,
  partBaseSpec: NormalizedUnitSpec
): NormalizedUnitSpec[] {
  const {clip, color, opacity} = markDef;

  const mark = markDef.type;

  if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
    return [
      {
        ...partBaseSpec,
        mark: {
          ...(compositeMarkConfig[part] as MarkConfig),
          ...(clip ? {clip} : {}),
          ...(color ? {color} : {}),
          ...(opacity ? {opacity} : {}),
          ...(isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : {type: partBaseSpec.mark}),
          style: `${mark}-${part}`,
          ...(isBoolean(markDef[part]) ? {} : (markDef[part] as MarkConfig))
        }
      }
    ];
  }
  return [];
}

export function compositeMarkContinuousAxis<M extends CompositeMark>(
  spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>,
  orient: Orient,
  compositeMark: M
) {
  const {encoding} = spec;
  const continuousAxis: 'x' | 'y' = orient === 'vertical' ? 'y' : 'x';

  const continuousAxisChannelDef = encoding[continuousAxis] as PositionFieldDef<string>; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
  const continuousAxisChannelDef2 = encoding[continuousAxis + '2'] as SecondaryFieldDef<string>;
  const continuousAxisChannelDefError = encoding[continuousAxis + 'Error'] as FieldDefWithoutScale<string>;
  const continuousAxisChannelDefError2 = encoding[continuousAxis + 'Error2'] as FieldDefWithoutScale<string>;

  return {
    continuousAxisChannelDef: filterAggregateFromChannelDef(continuousAxisChannelDef, compositeMark),
    continuousAxisChannelDef2: filterAggregateFromChannelDef(continuousAxisChannelDef2, compositeMark),
    continuousAxisChannelDefError: filterAggregateFromChannelDef(continuousAxisChannelDefError, compositeMark),
    continuousAxisChannelDefError2: filterAggregateFromChannelDef(continuousAxisChannelDefError2, compositeMark),
    continuousAxis
  };
}

function filterAggregateFromChannelDef<M extends CompositeMark, F extends FieldDefBase<string>>(
  continuousAxisChannelDef: F,
  compositeMark: M
): F {
  if (isFieldDef(continuousAxisChannelDef) && continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== compositeMark) {
      log.warn(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark));
    }
    return continuousAxisWithoutAggregate as F;
  } else {
    return continuousAxisChannelDef;
  }
}

export function compositeMarkOrient<M extends CompositeMark>(
  spec: GenericUnitSpec<Encoding<Field>, CompositeMark | CompositeMarkDef>,
  compositeMark: M
): Orient {
  const {mark, encoding} = spec;

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
    throw new Error('Need a valid continuous axis for ' + compositeMark + 's');
  }
}
