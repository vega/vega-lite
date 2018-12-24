import {Config} from '../config';
import * as vlEncoding from '../encoding';
import {forEach} from '../encoding';
import {Field, FieldDef} from '../fielddef';
import * as log from '../log';
import {isPrimitiveMark} from '../mark';
import {Repeat} from '../repeat';
import {Resolve} from '../resolve';
import {stack} from '../stack';
import {Dict, hash, vals} from '../util';
import {BaseSpec, DataMixins} from './base';
import {GenericFacetSpec, isFacetSpec, NormalizedFacetSpec} from './facet';
import {ExtendedLayerSpec, GenericLayerSpec, isLayerSpec, NormalizedLayerSpec} from './layer';
import {ConcatLayout, GenericCompositionLayout, TopLevel} from './toplevel';
import {FacetedCompositeUnitSpec, GenericUnitSpec, isUnitSpec, NormalizedUnitSpec} from './unit';

export {normalizeTopLevelSpec as normalize} from '../normalize';
export {BaseSpec, DataMixins, LayoutSizeMixins} from './base';
export {GenericFacetSpec, isFacetSpec, NormalizedFacetSpec} from './facet';
export {ExtendedLayerSpec, GenericLayerSpec, isLayerSpec, NormalizedLayerSpec} from './layer';
export {TopLevel} from './toplevel';
export {CompositeUnitSpec, FacetedCompositeUnitSpec, GenericUnitSpec, isUnitSpec, NormalizedUnitSpec} from './unit';

export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    GenericCompositionLayout {
  /**
   * An object that describes what fields should be repeated into views that are laid out as a `row` or `column`.
   */
  repeat: Repeat;

  spec: GenericSpec<U, L>;

  /**
   * Scale and legend resolutions for repeated charts.
   */
  resolve?: Resolve;
}

export type NormalizedRepeatSpec = GenericRepeatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    ConcatLayout {
  /**
   * A list of views that should be concatenated and put into a column.
   */
  vconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for vertically concatenated charts.
   */
  resolve?: Resolve;
}

export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    ConcatLayout {
  /**
   * A list of views that should be concatenated and put into a row.
   */
  hconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for horizontally concatenated charts.
   */
  resolve?: Resolve;
}

export type NormalizedConcatSpec =
  | GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>
  | GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type GenericSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> =
  | U
  | L
  | GenericFacetSpec<U, L>
  | GenericRepeatSpec<U, L>
  | GenericVConcatSpec<U, L>
  | GenericHConcatSpec<U, L>;

export type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type TopLevelFacetedUnitSpec = TopLevel<FacetedCompositeUnitSpec> & DataMixins;
export type TopLevelFacetSpec = TopLevel<GenericFacetSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> & DataMixins;

export type TopLevelSpec =
  | TopLevelFacetedUnitSpec
  | TopLevelFacetSpec
  | TopLevel<ExtendedLayerSpec>
  | TopLevel<GenericRepeatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericVConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericHConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>;

/* Custom type guards */

export function isRepeatSpec(spec: BaseSpec): spec is GenericRepeatSpec<any, any> {
  return spec['repeat'] !== undefined;
}

export function isConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> | GenericHConcatSpec<any, any> {
  return isVConcatSpec(spec) || isHConcatSpec(spec);
}

export function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> {
  return spec['vconcat'] !== undefined;
}

export function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any, any> {
  return spec['hconcat'] !== undefined;
}

// TODO: add vl.spec.validate & move stuff from vl.validate to here

/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict: any, defs: FieldDef<Field>[]): any {
  defs.forEach(fieldDef => {
    // Consider only pure fieldDef properties (ignoring scale, axis, legend)
    const pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce((f, key) => {
      if (fieldDef[key] !== undefined) {
        f[key] = fieldDef[key];
      }
      return f;
    }, {});
    const key = hash(pureFieldDef);
    dict[key] = dict[key] || fieldDef;
  });
  return dict;
}

/* Recursively get fieldDefs from a spec, returns a dictionary of fieldDefs */
function fieldDefIndex<T>(spec: GenericSpec<any, any>, dict: Dict<FieldDef<T>> = {}): Dict<FieldDef<T>> {
  // FIXME(https://github.com/vega/vega-lite/issues/2207): Support fieldDefIndex for repeat
  if (isLayerSpec(spec)) {
    spec.layer.forEach(layer => {
      if (isUnitSpec(layer)) {
        accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
      } else {
        fieldDefIndex(layer, dict);
      }
    });
  } else if (isFacetSpec(spec)) {
    accumulate(dict, vlEncoding.fieldDefs(spec.facet));
    fieldDefIndex(spec.spec, dict);
  } else if (isRepeatSpec(spec)) {
    fieldDefIndex(spec.spec, dict);
  } else if (isConcatSpec(spec)) {
    const childSpec = isVConcatSpec(spec) ? spec.vconcat : spec.hconcat;
    childSpec.forEach(child => fieldDefIndex(child, dict));
  } else {
    // Unit Spec
    accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
  }
  return dict;
}

/* Returns all non-duplicate fieldDefs in a spec in a flat array */
export function fieldDefs(spec: GenericSpec<any, any>): FieldDef<any>[] {
  return vals(fieldDefIndex(spec));
}

export function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean {
  config = config || spec.config;
  if (isPrimitiveMark(spec.mark)) {
    return stack(spec.mark, spec.encoding, config ? config.stack : undefined) !== null;
  }
  return false;
}

/**
 * Takes a spec and returns a list of fields used in encoding
 */
export function usedFields(spec: NormalizedSpec): string[] {
  if (isFacetSpec(spec) || isRepeatSpec(spec)) {
    return usedFieldsSingle(spec);
  }
  if (isLayerSpec(spec)) {
    return usedFieldsLayered(spec);
  }
  if (isUnitSpec(spec)) {
    return usedFieldsUnit(spec);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function usedFieldsUnit(spec: NormalizedUnitSpec): string[] {
  const fields: string[] = [];
  forEach(spec.encoding, (fieldDef, channel) => {
    fields.push(fieldDef.field);
  });
  return fields;
}

function usedFieldsLayered(spec: NormalizedLayerSpec): string[] {
  let fields: string[] = [];
  spec.layer.map(subspec => {
    fields = fields.concat(usedFields(subspec));
  });
  return fields;
}

function usedFieldsSingle(spec: NormalizedFacetSpec | NormalizedRepeatSpec): string[] {
  return usedFields(spec.spec);
}
