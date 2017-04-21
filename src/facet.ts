import {FieldDef} from './fielddef';

// TODO: add more facet properties
export type FacetFieldDef<F> = FieldDef<F>;

export interface Facet<F> {

  /**
   * Vertical facets for trellis plots.
   */
  row?: FacetFieldDef<F>;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetFieldDef<F>;
}
