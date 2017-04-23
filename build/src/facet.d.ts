import { FieldDef } from './fielddef';
export declare type FacetFieldDef<F> = FieldDef<F>;
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
