import { Dict } from '../../util';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { SourceNode } from './source';
export interface DataComponent {
    /**
     * A dictionary of sources indexed by a hash.
     */
    sources: Dict<SourceNode>;
    /**
     * Registry of output nodes.
     */
    outputNodes: Dict<OutputNode | FacetNode>;
    /**
     * The main output node.
     */
    main?: OutputNode;
    /**
     * For facets, we store the reference to the root node.
     */
    facetRoot?: FacetNode;
}
