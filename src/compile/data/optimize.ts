import {DataComponent} from '.';
import * as log from '../../log';
import {Model} from '../model';
import {DataFlowNode} from './dataflow';
import {BottomUpOptimizer, TopDownOptimizer} from './optimizer';
import * as optimizers from './optimizers';

export const FACET_SCALE_PREFIX = 'scale_';
export const MAX_OPTIMIZATION_RUNS = 5;

/**
 * Iterates over a dataflow graph and checks whether all links are consistent.
 */
export function checkLinks(nodes: readonly DataFlowNode[]): boolean {
  for (const node of nodes) {
    for (const child of node.children) {
      if (child.parent !== node) {
        // log.error('Dataflow graph is inconsistent.', node, child);
        return false;
      }
    }

    if (!checkLinks(node.children)) {
      return false;
    }
  }

  return true;
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
      for (const child of node.children) {
        append(child);
      }
    }
  }

  for (const child of roots) {
    append(child);
  }
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
function runOptimizer(optimizer: BottomUpOptimizer | TopDownOptimizer, nodes: DataFlowNode[]): boolean {
  const flags = nodes.map(node => {
    if (optimizer instanceof BottomUpOptimizer) {
      const runFlags = optimizer.optimizeNextFromLeaves(node);
      optimizer.reset();
      return runFlags;
    } else {
      return optimizer.run(node);
    }
  });
  return flags.some(isTrue);
}

function optimizationDataflowHelper(dataComponent: DataComponent, model: Model, firstPass: boolean) {
  let roots = dataComponent.sources;
  const mutatedFlags: Set<boolean> = new Set();

  mutatedFlags.add(runOptimizer(new optimizers.RemoveUnnecessaryOutputNodes(), roots));
  mutatedFlags.add(runOptimizer(new optimizers.RemoveUnnecessaryIdentifierNodes(model), roots));

  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlags.add(runOptimizer(new optimizers.RemoveUnusedSubtrees(), getLeaves(roots)));

  roots = roots.filter(r => r.numChildren() > 0);

  if (!firstPass) {
    // Only run these optimizations after the optimizer has moved down the facet node.
    // With this change, we can be more aggressive in the optimizations.
    mutatedFlags.add(runOptimizer(new optimizers.MoveParseUp(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeBins(model), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.RemoveDuplicateTimeUnits(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeParse(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeAggregates(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeTimeUnits(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeIdenticalNodes(), roots));
    mutatedFlags.add(runOptimizer(new optimizers.MergeOutputs(), getLeaves(roots)));
  }

  dataComponent.sources = roots;

  return mutatedFlags.has(true);
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
    if (!optimizationDataflowHelper(data, model, true)) {
      break;
    }
    firstPassCounter++;
  }

  // move facets down and make a copy of the subtree so that we can have scales at the top level
  data.sources.map(optimizers.moveFacetDown);

  for (let i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
    if (!optimizationDataflowHelper(data, model, false)) {
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
