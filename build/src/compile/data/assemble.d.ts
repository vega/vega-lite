import { InlineDataset } from '../../data';
import { Dict } from '../../util';
import { VgData } from '../../vega.schema';
import { DataComponent } from './';
import { FacetNode } from './facet';
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
export declare function assembleRootData(dataComponent: DataComponent, datasets: Dict<InlineDataset>): VgData[];
