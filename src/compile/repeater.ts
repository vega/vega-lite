import {Encoding} from '../encoding';
import {Facet} from '../facet';
import {
  ConditionalFieldDef,
  ConditionalValueDef,
  Field,
  FieldDef,
  isConditionalDef,
  isFieldDef,
  isRepeatRef,
  LegendFieldDef,
} from '../fielddef';
import {ChannelDef} from '../fielddef';
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
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef: LegendFieldDef<Field>, repeater: RepeaterValue): LegendFieldDef<string> | null {
  const field = fieldDef.field;
  if (isRepeatRef(field)) {
    if (field.repeat in repeater) {
      fieldDef = {
        ...fieldDef,
        field: repeater[field.repeat]
      };
    } else {
      log.warn(log.message.noSuchRepeatedValue(field.repeat));
      // return null, meaning that the field def should be ignored
      return null;
    }
  }

  const sort = fieldDef.sort;
  if (sort && isSortField(sort) && isRepeatRef(sort.field)) {
    if (sort.field.repeat in repeater) {
      fieldDef = {
        ...fieldDef,
        sort: {
          ...sort,
          field: repeater[sort.field.repeat]
        }
      };
    } else {
      log.warn(log.message.noSuchRepeatedValue(sort.field.repeat));
      // remove sort as it uses unknown field
      const {sort: _s, ...newFieldDef} = fieldDef;
      fieldDef = newFieldDef;
    }
  }

  return fieldDef as LegendFieldDef<string>;
}

type EncodingOrFacet<F> = Encoding<F> | Facet<F>;

function replaceRepeater(mapping: EncodingOrFacet<Field>, repeater: RepeaterValue): EncodingOrFacet<string> {
  const out: EncodingOrFacet<string> = {};
  for (const channel in mapping) {
    if (mapping.hasOwnProperty(channel)) {
      const channelDef: ChannelDef<Field> = mapping[channel];

      if (isArray<FieldDef<Field>>(channelDef)) {
        out[channel] = channelDef.map(fd => replaceRepeaterInFieldDef(fd, repeater))
          .filter(fd => fd !== null);
      } else if (isConditionalDef(channelDef) && isFieldDef(channelDef.condition)) {
        const fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
        if (fd !== null) {
          out[channel] = {
            ...channelDef,
            condition: fd
          };
        }
      } else if (isFieldDef(channelDef)) {
        const fd = replaceRepeaterInFieldDef(channelDef, repeater);
        if (fd !== null) {
          out[channel] = fd;
        }
      } else {
        out[channel] = channelDef;
      }
    }
  }
  return out;
}
