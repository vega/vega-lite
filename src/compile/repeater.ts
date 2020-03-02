import {hasOwnProperty, isArray} from 'vega-util';
import {
  ChannelDef,
  Field,
  FieldDef,
  hasConditionalFieldDef,
  isConditionalDef,
  isFieldDef,
  isRepeatRef,
  isSortableFieldDef,
  ScaleFieldDef,
  ValueDef,
  FieldName
} from '../channeldef';
import {Encoding} from '../encoding';
import * as log from '../log';
import {isSortField} from '../sort';
import {FacetFieldDef, FacetMapping, isFacetMapping} from '../spec/facet';

export interface RepeaterValue {
  row?: string;
  column?: string;

  repeat?: string;
}

export function replaceRepeaterInFacet(
  facet: FacetFieldDef<Field> | FacetMapping<Field>,
  repeater: RepeaterValue
): FacetFieldDef<FieldName> | FacetMapping<FieldName> {
  if (!repeater) {
    return facet as FacetFieldDef<FieldName>;
  }

  if (isFacetMapping(facet)) {
    return replaceRepeater(facet, repeater) as FacetMapping<FieldName>;
  }
  return replaceRepeaterInFieldDef(facet, repeater) as FacetFieldDef<FieldName>;
}

export function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<FieldName> {
  if (!repeater) {
    return encoding as Encoding<FieldName>;
  }

  return replaceRepeater(encoding, repeater) as Encoding<FieldName>;
}

/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeat<T extends {field?: Field}>(o: T, repeater: RepeaterValue): T {
  if (isRepeatRef(o.field)) {
    if (o.field.repeat in repeater) {
      return {...o, field: repeater[o.field.repeat]};
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
function replaceRepeaterInFieldDef(fieldDef: FieldDef<Field>, repeater: RepeaterValue): FieldDef<FieldName> {
  fieldDef = replaceRepeat(fieldDef, repeater);

  if (fieldDef === undefined) {
    // the field def should be ignored
    return undefined;
  } else if (fieldDef === null) {
    return null;
  }

  if (isSortableFieldDef(fieldDef) && isSortField(fieldDef.sort)) {
    const sort = replaceRepeat(fieldDef.sort, repeater);
    fieldDef = {
      ...fieldDef,
      ...(sort ? {sort} : {})
    };
  }

  return fieldDef as ScaleFieldDef<FieldName>;
}

function replaceRepeaterInChannelDef(channelDef: ChannelDef<FieldDef<Field>>, repeater: RepeaterValue): ChannelDef {
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
        } as ChannelDef;
      } else {
        const {condition, ...channelDefWithoutCondition} = channelDef;
        return channelDefWithoutCondition as ChannelDef;
      }
    }
    return channelDef as ValueDef;
  }
  return undefined;
}

type EncodingOrFacet<F extends Field> = Encoding<F> | FacetMapping<F>;

function replaceRepeater(mapping: EncodingOrFacet<Field>, repeater: RepeaterValue): EncodingOrFacet<FieldName> {
  const out: EncodingOrFacet<FieldName> = {};
  for (const channel in mapping) {
    if (hasOwnProperty(mapping, channel)) {
      const channelDef: ChannelDef<FieldDef<Field>> | ChannelDef<FieldDef<Field>>[] = mapping[channel];

      if (isArray(channelDef)) {
        // array cannot have condition
        out[channel] = channelDef.map(cd => replaceRepeaterInChannelDef(cd, repeater)).filter(cd => cd);
      } else {
        const cd = replaceRepeaterInChannelDef(channelDef, repeater);
        if (cd !== undefined) {
          out[channel] = cd;
        }
      }
    }
  }
  return out;
}
