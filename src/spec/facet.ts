import {ChannelDef, Field, FieldDef, RepeatRef, SortableFieldDef} from '../fielddef';
import {Header} from '../header';
import {Resolve} from '../resolve';
import {BaseSpec} from './base';
import {FacetMapping} from './facet';
import {GenericLayerSpec, NormalizedLayerSpec} from './layer';
import {GenericCompositionLayout} from './toplevel';
import {GenericUnitSpec, NormalizedUnitSpec} from './unit';

export interface FacetFieldDef<F extends Field> extends SortableFieldDef<F> {
  /**
   * An object defining properties of a facet's header.
   */
  header?: Header;
}

export interface FacetMapping<F extends Field> {
  /**
   * Vertical facets for trellis plots.
   */
  row?: FacetFieldDef<F>;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetFieldDef<F>;
}

export function isFacetFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is FacetFieldDef<F> {
  return !!channelDef && !!channelDef['header'];
}

/**
 * Base interface for a facet specification.
 */
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    GenericCompositionLayout {
  /**
   * An object that describes mappings between `row` and `column` channels and their field definitions.
   */
  facet: FacetMapping<string | RepeatRef>;

  /**
   * A specification of the view that gets faceted.
   */
  spec: L | U;
  // TODO: replace this with GenericSpec<U> once we support all cases;

  /**
   * Scale, axis, and legend resolutions for facets.
   */
  resolve?: Resolve;
}

/**
 * A facet specification without any shortcut / expansion syntax
 */
export type NormalizedFacetSpec = GenericFacetSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export function isFacetSpec(spec: BaseSpec): spec is GenericFacetSpec<any, any> {
  return spec['facet'] !== undefined;
}
