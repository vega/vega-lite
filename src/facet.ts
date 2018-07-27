import {ChannelDef, SortableFieldDef} from './fielddef';
import {Header} from './header';

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

export function isFacetFieldDef<F>(channelDef: ChannelDef<F>): channelDef is FacetFieldDef<F> {
  return !!channelDef && !!channelDef['header'];
}
