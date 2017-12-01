import { FieldDef } from './fielddef';
import { Guide } from './guide';
import { SortOrder } from './sort';
/**
 * Headers of row / column channels for faceted plots.
 */
export interface Header extends Guide {
    /**
     * The rotation angle of the header labels.
     *
     * __Default value:__ `0`.
     *
     * @minimum -360
     * @maximum 360
     */
    labelAngle?: number;
}
export interface FacetFieldDef<F> extends FieldDef<F> {
    /**
     * An object defining properties of a facet's header.
     */
    header?: Header;
    /**
     * Sort order for a facet field.
     * This can be `"ascending"`, `"descending"`.
     */
    sort?: SortOrder;
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
