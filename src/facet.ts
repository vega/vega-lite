import {FieldDef} from './fielddef';
import {Header} from './header';
import {EncodingSortField, SortOrder} from './sort';

export interface FacetFieldDef<F> extends FieldDef<F> {
  /**
   * An object defining properties of a facet's header.
   */
  header?: Header;

  /**
   * Sort order for a facet field.
   * This can be `"ascending"`, `"descending"`.
   */
  sort?: SortOrder | EncodingSortField<F>;
}

export interface FacetMapping<F> {

  /**
   * Vertical facets for trellis plots.
   */
  row?: FacetFieldDef<F>;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetFieldDef<F>;
}
