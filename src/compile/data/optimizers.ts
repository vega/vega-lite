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
    if (!node || !node.parent || node.parent instanceof SourceNode) {
      return;
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

export function bin(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof BinNode) {
    // we cannot move bin beyond a node that creates the field we need.
    if (parent instanceof BinNode) {
      // Don't merge for now because we don't have a good way of merging signals yet.
      return;
      // TODO: support merging bin node
      // parent.merge(node);
    } else if (isNewFieldNode(parent) && hasIntersection(parent.producedFields(), node.dependentFields())) {
      return;
    } else {
      node.swapWithParent();
    }
  }
}

export function timeUnit(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof TimeUnitNode) {
    if (node.parent instanceof TimeUnitNode) {

      // FIXME: Once we support timeUnit in the `transform` array, `as` can lead to conflicting key in the `timeUnitNode`s when we merge them.
      node.parent.merge(node);
    } else if (node.parent instanceof CalculateNode) {
      // we cannot move beyond a calculate node.
      return;
    } else if (isNewFieldNode(parent) && hasIntersection(parent.producedFields(), node.dependentFields())) {
      return;
    } else {
      node.swapWithParent();
    }
  }
}

export function aggregate(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof AggregateNode) {
    if (parent instanceof AggregateNode) {
      parent.merge(node);
    } else if (parent instanceof FacetNode) {
      node.addDimensions(parent.fields);
      node.swapWithParent();
    } else if (parent instanceof FilterNode || parent instanceof NullFilterNode) {
      return;
    } else if (isNewFieldNode(parent) && hasIntersection(parent.producedFields(), node.dependentFields())) {
      return;
    } else {
      node.swapWithParent();
    }
  }
}

export function stack(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof StackNode) {
    if (parent instanceof FacetNode) {
      node.addDimensions(parent.fields);
      node.swapWithParent();
    } else if (parent instanceof FilterNode || parent instanceof NullFilterNode) {
      return;
    } else if (isNewFieldNode(parent) && hasIntersection(parent.producedFields(), node.dependentFields())) {
      return;
    } else {
      node.swapWithParent();
    }
  }
}

export function nullfilter(node: DataFlowNode) {
  const parent = node.parent;

  if (node instanceof NullFilterNode) {
    if (parent instanceof CalculateNode || parent instanceof AggregateNode || parent instanceof StackNode || parent.numChildren() > 1) {
      return;
    } if (parent instanceof NullFilterNode) {
      // FIXME: currently we always merge without caring about conflicting
      parent.merge(node);
    } else {
      node.swapWithParent();
    }
  }
}

export function transforms(node: DataFlowNode) {
  const parent = node.parent;

  // make sure we preserve the order between filter and calculate nodes
  if (node instanceof FilterNode) {
    if (parent instanceof CalculateNode || parent instanceof AggregateNode || parent instanceof StackNode || parent.numChildren() > 1) {
      return;
    } else if (parent instanceof FilterNode) {
      parent.merge(node);
    } else {
      node.swapWithParent();
    }
  }

  if (node instanceof CalculateNode) {
    if (parent instanceof FilterNode || isNewFieldNode(parent)) {
      return;
    } else {
      node.swapWithParent();
    }
  }
}
