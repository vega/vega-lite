import {fieldIntersection, keys} from '../../util';
import {DataFlowNode, isTransformNode, OutputNode, TransformNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {SourceNode} from './source';
import {TimeUnitNode} from './timeunit';

/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
export function iterateFromLeaves(f: (node: DataFlowNode) => [boolean, boolean]) {
  function optimizeNextFromLeaves(node: DataFlowNode): boolean {
    if (node instanceof SourceNode) {
      return false;
    }

    const next = node.parent;
    const [continueFlag, mutatedFlag] = f(node);
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
export function moveParseUp(node: DataFlowNode): [boolean, boolean] {
  const parent = node.parent;
  let flag = false;
  // move parse up by merging or swapping
  if (node instanceof ParseNode) {
    if (parent instanceof SourceNode) {
      return [false, flag];
    }

    if (parent.numChildren() > 1) {
      // don't move parse further up but continue with parent.
      return [true, flag];
    }

    if (parent instanceof ParseNode) {
      flag = true;
      parent.merge(node);
    } else {
      // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
      if (fieldIntersection(parent.producedFields(), node.dependentFields())) {
        return [true, flag];
      }
      flag = true;
      node.swapWithParent();
    }
  }

  return [true, flag];
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
 * Merge Identical Transforms at forks by comparing hashes.
 */
export function mergeIdenticalTransforms(node: DataFlowNode): boolean {
  let flag = false;
  const transforms = node.children.filter((x): x is TransformNode => isTransformNode(x));
  const hashes = transforms.map(x => x.hash());
  const buckets: {hash?: DataFlowNode[]} = {};
  for (let i = 0; i < hashes.length; i++) {
    if (buckets[hashes[i]] === undefined) {
      buckets[hashes[i]] = [transforms[i]];
    } else {
      buckets[hashes[i]].push(transforms[i]);
    }
  }
  for (const k of keys(buckets)) {
    if (buckets[k].length > 1) {
      flag = true;
      mergeBucket(node, buckets[k]);
    }
  }
  return node.children.map(mergeIdenticalTransforms).some(x => x === true) || flag;
}

/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export function removeUnusedSubtrees(node: DataFlowNode): [boolean, boolean] {
  let flag = false;
  if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
    // no need to continue with parent because it is output node or will have children (there was a fork)
    return [false, false];
  } else {
    flag = true;
    node.remove();
  }
  return [true, flag];
}

/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export function removeDuplicateTimeUnits(leaf: DataFlowNode) {
  let fields = {};
  return iterateFromLeaves((node: DataFlowNode) => {
    let flag = false;
    if (node instanceof TimeUnitNode) {
      const pfields = node.producedFields();
      const dupe = keys(pfields).every(k => !!fields[k]);

      if (dupe) {
        flag = true;
        node.remove();
      } else {
        fields = {...fields, ...pfields};
      }
    }

    return [true, flag];
  })(leaf);
}
