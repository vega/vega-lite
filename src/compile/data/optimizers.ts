import {fieldIntersection, keys} from '../../util';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {BottomUpOptimizer, TopDownOptimizer} from './optimizer';
import {SourceNode} from './source';
import {TimeUnitNode} from './timeunit';

export interface OptimizerFlags {
  /**
   * If true, iteration continues
   */
  continueFlag: boolean;
  /**
   * If true, the tree has been mutated by the function
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
export class MoveParseUp extends BottomUpOptimizer {
  public optimize(node: DataFlowNode): OptimizerFlags {
    const parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof ParseNode) {
      if (parent instanceof SourceNode) {
        return this.flags;
      }

      if (parent.numChildren() > 1) {
        // don't move parse further up but continue with parent.
        this.setContinue();
        return this.flags;
      }

      if (parent instanceof ParseNode) {
        this.setMutated();
        parent.merge(node);
      } else {
        // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
        if (fieldIntersection(parent.producedFields(), node.dependentFields())) {
          this.setContinue();
          return this.flags;
        }
        this.setMutated();
        node.swapWithParent();
      }
    }
    this.setContinue();
    return this.flags;
  }
}

/**
 * Merge identical nodes at forks by comparing hashes.
 *
 * Does not need to iterate from leaves so we implement this with recursion as it's a bit simpler.
 */
export class MergeIdenticalNodes extends TopDownOptimizer {
  public mergeNodes(parent: DataFlowNode, nodes: DataFlowNode[]) {
    const mergedNode = nodes.shift();
    for (const node of nodes) {
      parent.removeChild(node);
      node.parent = mergedNode;
      node.remove();
    }
  }

  public optimize(node: DataFlowNode): boolean {
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
        this.setMutated();
        this.mergeNodes(node, buckets[k]);
      }
    }
    for (const child of node.children) {
      this.optimize(child);
    }
    return this.mutatedFlag;
  }
}

/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export class RemoveUnusedSubtrees extends BottomUpOptimizer {
  public optimize(node: DataFlowNode): OptimizerFlags {
    if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
      // no need to continue with parent because it is output node or will have children (there was a fork)
      return this.flags;
    } else {
      this.setMutated();
      node.remove();
    }
    return this.flags;
  }
}

/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */

export class RemoveDuplicateTimeUnits extends BottomUpOptimizer {
  private fields = {};
  public optimize(node: DataFlowNode): OptimizerFlags {
    this.setContinue();
    if (node instanceof TimeUnitNode) {
      const pfields = node.producedFields();
      const dupe = keys(pfields).every(k => !!this.fields[k]);

      if (dupe) {
        this.setMutated();
        node.remove();
      } else {
        this.fields = {...this.fields, ...pfields};
      }
    }
    return this.flags;
  }
}
