import {isArray} from 'vega-util';
import {Encoding} from '../encoding';
import {FacetMapping} from '../facet';
import {Field, hasConditionalFieldDef, isConditionalDef, isFieldDef, isRepeatRef, ValueDef} from '../fielddef';
import {ChannelDef, ScaleFieldDef} from '../fielddef';
import * as log from '../log';
import {isSortField} from '../sort';

export interface RepeaterValue {
  row?: string;
  column?: string;
}

export function replaceRepeaterInFacet(facet: FacetMapping<Field>, repeater: RepeaterValue): FacetMapping<string> {
  return replaceRepeater(facet, repeater) as FacetMapping<string>;
}

export function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string> {
  return replaceRepeater(encoding, repeater) as Encoding<string>;
}

/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeat<T extends {field?: Field}>(o: T, repeater: RepeaterValue): T {
  if (isRepeatRef(o.field)) {
    if (o.field.repeat in repeater) {
      // any needed to calm down ts compiler
      return {...(o as any), field: repeater[o.field.repeat]};
    } else {
      log.warn(log.message.noSuchRepeatedValue(o.field.repeat));
      return undefined;
    }
  }
  return o;
}

/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef: ScaleFieldDef<Field>, repeater: RepeaterValue): ScaleFieldDef<string> {
  fieldDef = replaceRepeat(fieldDef, repeater);

  if (fieldDef === undefined) {
    // the field def should be ignored
    return undefined;
  }

  if (fieldDef.sort && isSortField(fieldDef.sort)) {
    const sort = replaceRepeat(fieldDef.sort, repeater);
    fieldDef = {
      ...fieldDef,
      ...(sort ? {sort} : {})
    };
  }

  return fieldDef as ScaleFieldDef<string>;
}

function replaceRepeaterInChannelDef(channelDef: ChannelDef<Field>, repeater: RepeaterValue): ChannelDef<string> {
  if (isFieldDef(channelDef)) {
    const fd = replaceRepeaterInFieldDef(channelDef, repeater);
    if (fd) {
      return fd;
    } else if (isConditionalDef(channelDef)) {
      return {condition: channelDef.condition};
    }
  } else {
    if (hasConditionalFieldDef(channelDef)) {
      const fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
      if (fd) {
        return {
          ...channelDef,
          condition: fd
        } as ChannelDef<string>;
      } else {
        const {condition, ...channelDefWithoutCondition} = channelDef;
        return channelDefWithoutCondition as ChannelDef<string>;
      }
    }
    return channelDef as ValueDef;
  }
  return undefined;
}

type EncodingOrFacet<F> = Encoding<F> | FacetMapping<F>;

function replaceRepeater(mapping: EncodingOrFacet<Field>, repeater: RepeaterValue): EncodingOrFacet<string> {
  const out: EncodingOrFacet<string> = {};
  for (const channel in mapping) {
    if (mapping.hasOwnProperty(channel)) {
      const channelDef: ChannelDef<Field> | ChannelDef<Field>[] = mapping[channel];

      if (isArray(channelDef)) {
        // array cannot have condition
        out[channel] = channelDef.map(cd => replaceRepeaterInChannelDef(cd, repeater)).filter(cd => cd);
      } else {
        const cd = replaceRepeaterInChannelDef(channelDef, repeater);
        if (cd) {
          out[channel] = cd;
        }
      }
    }
  }
  return out;
}
