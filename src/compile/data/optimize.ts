import * as log from '../../log';
import {Model} from '../model';
import {DataFlowNode} from './dataflow';
import {checkLinks} from './debug';
import {DataComponent} from './index';
import {BottomUpOptimizer, TopDownOptimizer} from './optimizer';
import * as optimizers from './optimizers';

export const FACET_SCALE_PREFIX = 'scale_';
export const MAX_OPTIMIZATION_RUNS = 5;

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

export function isTrue(x: boolean) {
  return x;
}

/**
 * Run the specified optimizer on the provided nodes.
 *
 * @param optimizer The optimizer instance to run.
 * @param nodes A set of nodes to optimize.
 * @param flag Flag that will be or'ed with return valued from optimization calls to the nodes.
 */
function runOptimizer(optimizer: BottomUpOptimizer | TopDownOptimizer, nodes: DataFlowNode[], flag: boolean) {
  const flags = nodes.map(node => {
    if (optimizer instanceof BottomUpOptimizer) {
      const runFlags = optimizer.optimizeNextFromLeaves(node);
      optimizer.reset();
      return runFlags;
    } else {
      return optimizer.run(node);
    }
  });
  return flags.some(isTrue) || flag;
}

function optimizationDataflowHelper(dataComponent: DataComponent, model: Model) {
  let roots = dataComponent.sources;
  let mutatedFlag = false;

  // mutatedFlag should always be on the right side otherwise short circuit logic might cause the mutating method to not execute
  mutatedFlag = runOptimizer(new optimizers.RemoveUnnecessaryNodes(), roots, mutatedFlag);

  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag = runOptimizer(new optimizers.RemoveUnusedSubtrees(), getLeaves(roots), mutatedFlag);

  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag = runOptimizer(new optimizers.MoveParseUp(), getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(new optimizers.MergeBins(model), getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(new optimizers.RemoveDuplicateTimeUnits(), getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(new optimizers.MergeParse(), getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(new optimizers.MergeAggregateNodes(), getLeaves(roots), mutatedFlag);

  mutatedFlag = runOptimizer(new optimizers.MergeIdenticalNodes(), roots, mutatedFlag);

  dataComponent.sources = roots;

  return mutatedFlag;
}

/**
 * Optimizes the dataflow of the passed in data component.
 */
export function optimizeDataflow(data: DataComponent, model: Model) {
  // check before optimizations
  checkLinks(data.sources);

  let firstPassCounter = 0;
  let secondPassCounter = 0;

  for (let i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
    if (!optimizationDataflowHelper(data, model)) {
      break;
    }
    firstPassCounter++;
  }

  // move facets down and make a copy of the subtree so that we can have scales at the top level
  data.sources.map(optimizers.moveFacetDown);

  for (let i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
    if (!optimizationDataflowHelper(data, model)) {
      break;
    }
    secondPassCounter++;
  }

  // check after optimizations
  checkLinks(data.sources);

  if (Math.max(firstPassCounter, secondPassCounter) === MAX_OPTIMIZATION_RUNS) {
    log.warn(`Maximum optimization runs(${MAX_OPTIMIZATION_RUNS}) reached.`);
  }
}
