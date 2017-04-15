import {FieldDef} from './fielddef';

// TODO: add more facet properties
export type FacetFieldDef = FieldDef;

export interface Facet {

  /**
   * Vertical facets for trellis plots.
   */
  row?: FacetFieldDef;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetFieldDef;
}
