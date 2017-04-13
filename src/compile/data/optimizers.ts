import {hasIntersection} from '../../util';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, isNewFieldNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {NullFilterNode} from './nullfilter';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {CalculateNode, FilterNode} from './transforms';

/**
 * Start optimization path at the leaves. Useful for merging up things.
 */
export function optimizeFromLeaves(f: (node: DataFlowNode) => void) {
  function optimizeNextFromLeaves(node: DataFlowNode) {
    if (node.parent instanceof SourceNode) {
      return;
    } else if (!node || !node.parent) {
      throw new Error('A source node cannot have parents and roots haev to be source nodes.');
    }

    const next = node.parent;
    f(node);
    optimizeNextFromLeaves(next);
  }

  return optimizeNextFromLeaves;
}


export function parse(node: DataFlowNode) {
  const parent = node.parent;

  // move parse up by merging or swapping
  if (node instanceof ParseNode) {
    if (parent instanceof ParseNode) {
      parent.merge(node);
    } else {
      node.swapWithParent();
    }
  }
}
