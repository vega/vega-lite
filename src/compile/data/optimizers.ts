import {fieldIntersection, keys} from '../../util';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {isTrue} from './optimize';
import {SourceNode} from './source';
import {TimeUnitNode} from './timeunit';

export interface OptimizerFlags {
  /**
   * If true iteration continues
   */
  continueFlag: boolean;
  /**
   * If true the tree has been mutated by the function
   */
  mutatedFlag: boolean;
}

/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
export function iterateFromLeaves(f: (node: DataFlowNode) => OptimizerFlags) {
  function optimizeNextFromLeaves(node: DataFlowNode): boolean {
    if (node instanceof SourceNode) {
      return false;
    }

    const next = node.parent;
    const {continueFlag, mutatedFlag} = f(node);
    let childFlag = false;
    if (continueFlag) {
      childFlag = optimizeNextFromLeaves(next);
    }
    return mutatedFlag || childFlag;
  }

  return optimizeNextFromLeaves;
}

/**
 * Move parse nodes up to forks.
 */
export function moveParseUp(node: DataFlowNode): OptimizerFlags {
  const parent = node.parent;
  let mutated = false;
  // move parse up by merging or swapping
  if (node instanceof ParseNode) {
    if (parent instanceof SourceNode) {
      return {continueFlag: false, mutatedFlag: mutated};
    }

    if (parent.numChildren() > 1) {
      // don't move parse further up but continue with parent.
      return {continueFlag: true, mutatedFlag: mutated};
    }

    if (parent instanceof ParseNode) {
      mutated = true;
      parent.merge(node);
    } else {
      // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
      if (fieldIntersection(parent.producedFields(), node.dependentFields())) {
        return {continueFlag: true, mutatedFlag: mutated};
      }
      mutated = true;
      node.swapWithParent();
    }
  }
  return {continueFlag: true, mutatedFlag: mutated};
}

export function mergeNodes(parent: DataFlowNode, nodes: DataFlowNode[]) {
  const mergedTransform = nodes.shift();
  for (const node of nodes) {
    parent.removeChild(node);
    node.parent = mergedTransform;
    node.remove();
  }
}

/**
 * Merge identical nodes at forks by comparing hashes.
 *
 * Does not need to iterate from leaves so we implement this with recursion as it's a bit simpler.
 */
export function mergeIdenticalNodes(node: DataFlowNode): boolean {
  let mutated = false;

  const hashes = node.children.map(x => x.hash());
  const buckets: {hash?: DataFlowNode[]} = {};

  for (let i = 0; i < hashes.length; i++) {
    if (buckets[hashes[i]] === undefined) {
      buckets[hashes[i]] = [node.children[i]];
    } else {
      buckets[hashes[i]].push(node.children[i]);
    }
  }

  for (const k of keys(buckets)) {
    if (buckets[k].length > 1) {
      mutated = true;
      mergeNodes(node, buckets[k]);
    }
  }

  return node.children.map(mergeIdenticalNodes).some(isTrue) || mutated;
}

/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export function removeUnusedSubtrees(node: DataFlowNode): OptimizerFlags {
  // @ts-ignore
  let mutated = false;
  if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
    // no need to continue with parent because it is output node or will have children (there was a fork)
    return {continueFlag: false, mutatedFlag: mutated};
  } else {
    mutated = true;
    node.remove();
  }
  return {continueFlag: true, mutatedFlag: mutated};
}

/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export function removeDuplicateTimeUnits(leaf: DataFlowNode) {
  let fields = {};
  return iterateFromLeaves((node: DataFlowNode) => {
    let mutated = false;
    if (node instanceof TimeUnitNode) {
      const pfields = node.producedFields();
      const dupe = keys(pfields).every(k => !!fields[k]);

      if (dupe) {
        mutated = true;
        node.remove();
      } else {
        fields = {...fields, ...pfields};
      }
    }

    return {continueFlag: true, mutatedFlag: mutated};
  })(leaf);
}
