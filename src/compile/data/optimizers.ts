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
 *
 * If the callback returns true, the recursion continues.
 */
export function iterateFromLeaves(f: (node: DataFlowNode) => boolean) {
  function optimizeNextFromLeaves(node: DataFlowNode) {
    if (node instanceof SourceNode) {
      return;
    }

    const next = node.parent;
    if (f(node)) {
      optimizeNextFromLeaves(next);
    }
  }

  return optimizeNextFromLeaves;
}

/**
 * Move parse nodes up to forks.
 */
export function moveParseUp(node: DataFlowNode) {
  const parent = node.parent;

  // move parse up by merging or swapping
  if (node instanceof ParseNode) {
    if (parent instanceof SourceNode) {
      return false;
    }

    if (parent.numChildren() > 1) {
      return true;
    }

    if (parent instanceof ParseNode) {
      parent.merge(node);
    } else {
      node.swapWithParent();
    }
  }

  return true;
}

/**
 * Repeatedly remove leaf nodes that are not output nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 */
export function removeUnusedSubtrees(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof OutputNode || node.numChildren() > 0) {
    // no need to continue with parent because it is output node or will have children (there was a fork)
    return false;
  } else {
    node.remove();
  }
  return true;
}
