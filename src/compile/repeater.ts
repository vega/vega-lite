import {Encoding} from '../encoding';
import {Facet} from '../facet';
import {Field, FieldDef, isConditionalDef, isFieldDef, isRepeatRef} from '../fielddef';
import {ChannelDef, ScaleFieldDef} from '../fielddef';
import * as log from '../log';
import {isSortField} from '../sort';
import {isArray} from '../util';

export type RepeaterValue = {
  row?: string,
  column?: string
};

export function replaceRepeaterInFacet(facet: Facet<Field>, repeater: RepeaterValue): Facet<string> {
  return replaceRepeater(facet, repeater) as Facet<string>;
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
      return {...o as any, field: repeater[o.field.repeat]};
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

type EncodingOrFacet<F> = Encoding<F> | Facet<F>;

function replaceRepeater(mapping: EncodingOrFacet<Field>, repeater: RepeaterValue): EncodingOrFacet<string> {
  const out: EncodingOrFacet<string> = {};
  for (const channel in mapping) {
    if (mapping.hasOwnProperty(channel)) {
      const channelDef: ChannelDef<Field> = mapping[channel];

      if (isArray<FieldDef<Field>>(channelDef)) {
        out[channel] = channelDef.map(fd => replaceRepeaterInFieldDef(fd, repeater))
          .filter(fd => fd);
      } else if (isConditionalDef(channelDef) && isFieldDef(channelDef.condition)) {
        const fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
        if (fd) {
          out[channel] = {
            ...channelDef,
            condition: fd
          };
        }
      } else if (isFieldDef(channelDef)) {
        const fd = replaceRepeaterInFieldDef(channelDef, repeater);
        if (fd) {
          out[channel] = fd;
        }
      } else {
        out[channel] = channelDef;
      }
    }
  }
  return out;
}
