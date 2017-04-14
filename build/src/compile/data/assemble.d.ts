import { VgData } from '../../vega.schema';
import { FacetNode } from './facet';
import { SourceNode } from './source';
export declare const FACET_SCALE_PREFIX = "scale_";
/**
 * Assemble data sources that are derived from faceted data.
 */
export declare function assembleFacetData(root: FacetNode): VgData[];
/**
 * Create Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export declare function assembleData(roots: SourceNode[]): VgData[];
