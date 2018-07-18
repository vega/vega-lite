import {hasIntersection, keys} from '../../util';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {CalculateNode} from './calculate';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {FilterNode} from './filter';
import {FlattenTransformNode} from './flatten';
import {FoldTransformNode} from './fold';
import {ParseNode} from './formatparse';
import {ImputeNode} from './impute';
import {LookupNode} from './lookup';
import {SampleTransformNode} from './sample';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
// import {WindowTransformNode} from './window';

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
      // don't move parse further up but continue with parent.
      return true;
    }

    if (parent instanceof ParseNode) {
      parent.merge(node);
    } else {
      // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
      if (hasIntersection(parent.producedFields(), node.dependentFields())) {
        return true;
      }

      node.swapWithParent();
    }
  }

  return true;
}
export type TransformNode =
  | FilterNode
  | CalculateNode
  | LookupNode
  | BinNode
  | TimeUnitNode
  | ImputeNode
  | AggregateNode
  // | WindowTransformNode // Fix
  | StackNode
  | FlattenTransformNode
  | FoldTransformNode
  | SampleTransformNode;

export function isTransformNode(x: DataFlowNode) {
  return (
    x instanceof FilterNode ||
    x instanceof CalculateNode ||
    x instanceof LookupNode ||
    x instanceof BinNode ||
    x instanceof TimeUnitNode ||
    x instanceof ImputeNode ||
    x instanceof AggregateNode ||
    // x instanceof WindowTransformNode || //  Causes error. Need to Fix
    x instanceof StackNode ||
    x instanceof FlattenTransformNode ||
    x instanceof FoldTransformNode ||
    x instanceof SampleTransformNode
  );
}

function mergeBucket(parent: DataFlowNode, nodes: DataFlowNode[]) {
  const mergedTransform = nodes.shift();
  nodes.forEach(x => {
    parent.removeChild(x);
    x.parent = mergedTransform;
    x.remove();
  });
}

/**
 * Merge Identical Transforms at forks.
 */
export function mergeIdenticalTransforms(node: DataFlowNode) {
  const transforms = node.children.filter((x): x is TransformNode => isTransformNode(x));
  const hashes = transforms.map(x => x.hash());
  const buckets = {};
  for (let i = 0; i < hashes.length; i++) {
    if (buckets[hashes[i]] === undefined) {
      buckets[hashes[i]] = [transforms[i]];
    } else {
      buckets[hashes[i]].push(transforms[i]);
    }
  }
  for (const k of keys(buckets)) {
    mergeBucket(node, buckets[k]);
  }
  node.children.forEach(mergeIdenticalTransforms);
}

/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export function removeUnusedSubtrees(node: DataFlowNode) {
  if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
    // no need to continue with parent because it is output node or will have children (there was a fork)
    return false;
  } else {
    node.remove();
  }
  return true;
}

/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export function removeDuplicateTimeUnits(leaf: DataFlowNode) {
  let fields = {};
  return iterateFromLeaves((node: DataFlowNode) => {
    if (node instanceof TimeUnitNode) {
      const pfields = node.producedFields();
      const dupe = keys(pfields).every(k => !!fields[k]);

      if (dupe) {
        node.remove();
      } else {
        fields = {...fields, ...pfields};
      }
    }

    return true;
  })(leaf);
}
