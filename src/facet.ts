import {SortableFieldDef} from './fielddef';
import {Guide} from './guide';


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

  // TODO: labelPadding
}

export interface FacetFieldDef<F> extends SortableFieldDef<F> {
  /**
   * An object defining properties of a facet's header.
   */
  header?: Header;
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
