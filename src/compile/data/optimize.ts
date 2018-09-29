import {MAIN} from '../../data';
import * as log from '../../log';
import {flatten, keys, vals} from '../../util';
import {AggregateNode} from './aggregate';
import {DataFlowNode, OutputNode} from './dataflow';
import {checkLinks} from './debug';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {DataComponent} from './index';
import {BottomUpOptimizer, TopDownOptimizer} from './optimizer';
import {MergeIdenticalNodes} from './optimizers';
import * as optimizers from './optimizers';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {WindowTransformNode} from './window';

export const FACET_SCALE_PREFIX = 'scale_';
export const MAX_OPTIMIZATION_RUNS = 5;

/**
 * Clones the subtree and ignores output nodes except for the leaves, which are renamed.
 */
function cloneSubtree(facet: FacetNode) {
  function clone(node: DataFlowNode): DataFlowNode[] {
    if (!(node instanceof FacetNode)) {
      const copy = node.clone();

      if (copy instanceof OutputNode) {
        const newName = FACET_SCALE_PREFIX + copy.getSource();
        copy.setSource(newName);

        facet.model.component.data.outputNodes[newName] = copy;
      } else if (copy instanceof AggregateNode || copy instanceof StackNode || copy instanceof WindowTransformNode) {
        copy.addDimensions(facet.fields);
      }
      flatten(node.children.map(clone)).forEach((n: DataFlowNode) => (n.parent = copy));

      return [copy];
    }

    return flatten(node.children.map(clone));
  }
  return clone;
}

/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
function moveFacetDown(node: DataFlowNode) {
  if (node instanceof FacetNode) {
    if (node.numChildren() === 1 && !(node.children[0] instanceof OutputNode)) {
      // move down until we hit a fork or output node
      const child = node.children[0];

      if (child instanceof AggregateNode || child instanceof StackNode || child instanceof WindowTransformNode) {
        child.addDimensions(node.fields);
      }

      child.swapWithParent();
      moveFacetDown(node);
    } else {
      // move main to facet

      const facetMain = node.model.component.data.main;
      moveMainDownToFacet(facetMain);

      // replicate the subtree and place it before the facet's main node
      const cloner = cloneSubtree(node);
      const copy: DataFlowNode[] = flatten(node.children.map(cloner));
      for (const c of copy) {
        c.parent = facetMain;
      }
    }
  } else {
    node.children.map(moveFacetDown);
  }
}

function moveMainDownToFacet(node: DataFlowNode) {
  if (node instanceof OutputNode && node.type === MAIN) {
    if (node.numChildren() === 1) {
      const child = node.children[0];
      if (!(child instanceof FacetNode)) {
        child.swapWithParent();
        moveMainDownToFacet(node);
      }
    }
  }
}

/**
 * Remove nodes that are not required starting from a root.
 */
class RemoveUnnecessaryNodes extends TopDownOptimizer {
  public run(node: DataFlowNode): boolean {
    // remove output nodes that are not required
    if (node instanceof OutputNode && !node.isRequired()) {
      this.setMutated();
      node.remove();
    }
    for (const child of node.children) {
      this.run(child);
    }

    return this.mutatedFlag;
  }
}

/**
 * Return all leaf nodes.
 */
function getLeaves(roots: DataFlowNode[]) {
  const leaves: DataFlowNode[] = [];
  function append(node: DataFlowNode) {
    if (node.numChildren() === 0) {
      leaves.push(node);
    } else {
      node.children.forEach(append);
    }
  }

  roots.forEach(append);
  return leaves;
}

/**
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export class MergeParse extends BottomUpOptimizer {
  public run(node: DataFlowNode): optimizers.OptimizerFlags {
    const parent = node.parent;
    const parseChildren = parent.children.filter((x): x is ParseNode => x instanceof ParseNode);

    if (parseChildren.length > 1) {
      const commonParse = {};
      for (const parseNode of parseChildren) {
        const parse = parseNode.parse;
        for (const k of keys(parse)) {
          if (commonParse[k] === undefined) {
            commonParse[k] = parse[k];
          } else if (commonParse[k] !== parse[k]) {
            delete commonParse[k];
          }
        }
      }
      if (keys(commonParse).length !== 0) {
        this.setMutated();
        const mergedParseNode = new ParseNode(parent, commonParse);
        for (const parseNode of parseChildren) {
          for (const key of keys(commonParse)) {
            delete parseNode.parse[key];
          }
          parent.removeChild(parseNode);
          parseNode.parent = mergedParseNode;
          if (keys(parseNode.parse).length === 0) {
            parseNode.remove();
          }
        }
      }
    }
    this.setContinue();
    return this.flags;
  }
}

export function isTrue(x: boolean) {
  return x;
}

/**
 * Run the specified optimizer on the provided nodes.
 *
 * @param optimizer The optimizer to run.
 * @param nodes A set of nodes to optimize.
 * @param flag Flag that will be or'ed with return valued from optimization calls to the nodes.
 */
function runOptimizer(
  optimizer: typeof BottomUpOptimizer | typeof TopDownOptimizer,
  nodes: DataFlowNode[],
  flag: boolean
) {
  const flags = nodes.map(node => {
    const optimizerInstance = new optimizer();
    if (optimizerInstance instanceof BottomUpOptimizer) {
      return optimizerInstance.optimizeNextFromLeaves(node);
    } else {
      return optimizerInstance.run(node);
    }
  });
  return flags.some(isTrue) || flag;
}

function optimizationDataflowHelper(dataComponent: DataComponent) {
  let roots: SourceNode[] = dataComponent.sources;
  let mutatedFlag = false;

  // mutatedFlag should always be on the right side otherwise short circuit logic might cause the mutating method to not execute
  mutatedFlag = runOptimizer(RemoveUnnecessaryNodes, roots, mutatedFlag);
  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag = runOptimizer(optimizers.RemoveUnusedSubtrees, getLeaves(roots), mutatedFlag);

  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag = runOptimizer(optimizers.MoveParseUp, getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(optimizers.RemoveDuplicateTimeUnits, getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(MergeParse, getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(MergeIdenticalNodes, roots, mutatedFlag);

  dataComponent.sources = roots;

  return mutatedFlag;
}

/**
 * Optimizes the dataflow of the passed in data component.
 */
export function optimizeDataflow(data: DataComponent) {
  // check before optimizations
  checkLinks(vals(data.sources));
  let firstPassCounter = 0;
  let secondPassCounter = 0;

  for (let i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
    if (!optimizationDataflowHelper(data)) {
      break;
    }
    firstPassCounter++;
  }

  // move facets down and make a copy of the subtree so that we can have scales at the top level
  vals(data.sources).map(moveFacetDown);

  for (let i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
    if (!optimizationDataflowHelper(data)) {
      break;
    }
    secondPassCounter++;
  }

  // check after optimizations
  checkLinks(vals(data.sources));

  if (Math.max(firstPassCounter, secondPassCounter) === MAX_OPTIMIZATION_RUNS) {
    log.warn(`Maximum optimization runs(${MAX_OPTIMIZATION_RUNS}) reached.`);
  }
}
