import {hasIntersection} from '../../util';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {NullFilterNode} from './nullfilter';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {CalculateNode, FilterNode} from './transforms';

/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 */
export function iterateFromLeaves(f: (node: DataFlowNode) => void) {
  function optimizeNextFromLeaves(node: DataFlowNode) {
    if (node instanceof SourceNode) {
      return;
    }

    const next = node.parent;
    f(node);
    optimizeNextFromLeaves(next);
  }

  return optimizeNextFromLeaves;
}
