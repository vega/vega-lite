import {isArray} from 'vega-util';
import {Encoding} from '../encoding';
import {Facet} from '../facet';
import {Field, FieldDef, isRepeatRef} from '../fielddef';
import * as log from '../log';

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
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef: FieldDef<Field>, repeater: RepeaterValue): FieldDef<string> | null {
  const field = fieldDef.field;
  if (isRepeatRef(field)) {
    if (field.repeat in repeater) {
      return {
        ...fieldDef,
        field: repeater[field.repeat]
      };
    } else {
      log.warn(log.message.noSuchRepeatedValue(field.repeat));
      return null;
    }
  } else {
    // field is not a repeat ref so we can just return the field def
    return fieldDef as FieldDef<string>;
  }
}

type EncodingOrFacet<F> = Encoding<F> | Facet<F>;

function replaceRepeater(mapping: EncodingOrFacet<Field>, repeater: RepeaterValue): EncodingOrFacet<string> {
  const out: EncodingOrFacet<string> = {};
  for (const channel in mapping) {
    if (mapping.hasOwnProperty(channel)) {
      const fieldDef: FieldDef<Field> | FieldDef<Field>[] = mapping[channel];

      if (isArray(fieldDef)) {
        out[channel] = fieldDef.map(fd => replaceRepeaterInFieldDef(fd, repeater))
          .filter((fd: FieldDef<string> | null) => fd !== null);
      } else {
        const fd = replaceRepeaterInFieldDef(fieldDef, repeater);
        if (fd !== null) {
          out[channel] = fd;
        }
      }
    }
  }
  return out;
}
