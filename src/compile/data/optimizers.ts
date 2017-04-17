import {hasIntersection} from '../../util';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
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
export function optimizeFromLeaves(f: (node: DataFlowNode) => void) {
  function optimizeNextFromLeaves(node: DataFlowNode) {
    if (node.parent instanceof SourceNode) {
      return;
    } else if (!node || !node.parent) {
      throw new Error('Bad state: a source node cannot have parents and roots have to be source nodes.');
    }

    const next = node.parent;
    f(node);
    optimizeNextFromLeaves(next);
  }

  return optimizeNextFromLeaves;
}

/**
 * Move parse nodes all the way up.
 * TODO: only move until there is a conflict.
 */
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

/**
 * Repeatedly remove leaf nodes that are not output nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 */
export function removeUnusedSubtrees(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof OutputNode || node.numChildren() > 0) {
    return;
  } else {
    node.remove();
    removeUnusedSubtrees(parent);
  }
}
