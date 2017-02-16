import {FacetFieldDef} from './fielddef';

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
