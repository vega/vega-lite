import {hasOwnProperty, isArray} from 'vega-util';
import {
  ChannelDef,
  DatumDef,
  Field,
  FieldDef,
  FieldName,
  hasConditionalFieldOrDatumDef,
  isConditionalDef,
  isFieldDef,
  isFieldOrDatumDef,
  isRepeatRef,
  isSortableFieldDef,
  ScaleFieldDef,
  ValueDef
} from '../channeldef';
import {Encoding} from '../encoding';
import * as log from '../log';
import {isSortField} from '../sort';
import {FacetFieldDef, FacetMapping, isFacetMapping} from '../spec/facet';

export interface RepeaterValue {
  row?: string;
  column?: string;

  repeat?: string;

  layer?: string;
}

export function replaceRepeaterInFacet(
  facet: FacetFieldDef<Field> | FacetMapping<Field>,
  repeater: RepeaterValue
): FacetFieldDef<FieldName> | FacetMapping<FieldName> {
  if (!repeater) {
    return facet as FacetFieldDef<FieldName>;
  }

  if (isFacetMapping(facet)) {
    return replaceRepeaterInMapping(facet, repeater) as FacetMapping<FieldName>;
  }
  return replaceRepeaterInFieldDef(facet, repeater) as FacetFieldDef<FieldName>;
}

export function replaceRepeaterInEncoding<E extends Encoding<Field>>(
  encoding: E,
  repeater: RepeaterValue
): Encoding<FieldName> {
  if (!repeater) {
    return encoding as Encoding<FieldName>;
  }

  return replaceRepeaterInMapping(encoding, repeater) as Encoding<FieldName>;
}

/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeatInProp<T>(prop: keyof T, o: T, repeater: RepeaterValue): T {
  const val = o[prop];
  if (isRepeatRef(val)) {
    if (val.repeat in repeater) {
      return {...o, [prop]: repeater[val.repeat]};
    } else {
      log.warn(log.message.noSuchRepeatedValue(val.repeat));
      return undefined;
    }
  }
  return o;
}

/**
 * Replace repeater values in a field def with the concrete field name.
 */

function replaceRepeaterInFieldDef(fieldDef: FieldDef<Field>, repeater: RepeaterValue) {
  fieldDef = replaceRepeatInProp('field', fieldDef, repeater);

  if (fieldDef === undefined) {
    // the field def should be ignored
    return undefined;
  } else if (fieldDef === null) {
    return null;
  }

  if (isSortableFieldDef(fieldDef) && isSortField(fieldDef.sort)) {
    const sort = replaceRepeatInProp('field', fieldDef.sort, repeater);
    fieldDef = {
      ...fieldDef,
      ...(sort ? {sort} : {})
    };
  }

  return fieldDef as ScaleFieldDef<FieldName>;
}

function replaceRepeaterInFieldOrDatumDef(def: FieldDef<Field> | DatumDef<Field>, repeater: RepeaterValue) {
  if (isFieldDef(def)) {
    return replaceRepeaterInFieldDef(def, repeater);
  } else {
    const datumDef = replaceRepeatInProp('datum', def, repeater);
    if (datumDef !== def && !datumDef.type) {
      datumDef.type = 'nominal';
    }
    return datumDef;
  }
}

function replaceRepeaterInChannelDef(channelDef: ChannelDef<Field>, repeater: RepeaterValue) {
  if (isFieldOrDatumDef(channelDef)) {
    const fd = replaceRepeaterInFieldOrDatumDef(channelDef, repeater);
    if (fd) {
      return fd;
    } else if (isConditionalDef<ChannelDef<Field>>(channelDef)) {
      return {condition: channelDef.condition};
    }
  } else {
    if (hasConditionalFieldOrDatumDef(channelDef)) {
      const fd = replaceRepeaterInFieldOrDatumDef(channelDef.condition, repeater);
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

function replaceRepeaterInMapping(
  mapping: EncodingOrFacet<Field>,
  repeater: RepeaterValue
): EncodingOrFacet<FieldName> {
  const out: EncodingOrFacet<FieldName> = {};
  for (const channel in mapping) {
    if (hasOwnProperty(mapping, channel)) {
      const channelDef: ChannelDef<Field> | ChannelDef<Field>[] = mapping[channel];

      if (isArray(channelDef)) {
        // array cannot have condition
        out[channel] = (channelDef as ChannelDef<Field>[]) // somehow we need to cast it here
          .map(cd => replaceRepeaterInChannelDef(cd, repeater))
          .filter(cd => cd);
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
