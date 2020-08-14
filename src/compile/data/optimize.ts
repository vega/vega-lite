import {DataComponent} from '.';
import * as log from '../../log';
import {Model} from '../model';
import {DataFlowNode} from './dataflow';
import {Optimizer} from './optimizer';
import * as optimizers from './optimizers';
import {moveFacetDown} from './subtree';

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
 * Run the specified optimizer on the provided nodes.
 *
 * @param optimizer The optimizer instance to run.
 * @param nodes A set of nodes to optimize.
 */
function runOptimizer(optimizer: Optimizer, nodes: DataFlowNode[]): boolean {
  let modified = false;

  for (const node of nodes) {
    modified = optimizer.optimize(node) || modified;
  }

  return modified;
}

function optimizationDataflowHelper(dataComponent: DataComponent, model: Model, firstPass: boolean) {
  let roots = dataComponent.sources;
  let modified = false;

  modified = runOptimizer(new optimizers.RemoveUnnecessaryOutputNodes(), roots) || modified;
  modified = runOptimizer(new optimizers.RemoveUnnecessaryIdentifierNodes(model), roots) || modified;

  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);

  modified = runOptimizer(new optimizers.RemoveUnusedSubtrees(), roots) || modified;

  roots = roots.filter(r => r.numChildren() > 0);

  if (!firstPass) {
    // Only run these optimizations after the optimizer has moved down the facet node.
    // With this change, we can be more aggressive in the optimizations.
    modified = runOptimizer(new optimizers.MoveParseUp(), roots) || modified;
    modified = runOptimizer(new optimizers.MergeBins(model), roots) || modified;
    modified = runOptimizer(new optimizers.RemoveDuplicateTimeUnits(), roots) || modified;
    modified = runOptimizer(new optimizers.MergeParse(), roots) || modified;
    modified = runOptimizer(new optimizers.MergeAggregates(), roots) || modified;
    modified = runOptimizer(new optimizers.MergeTimeUnits(), roots) || modified;
    modified = runOptimizer(new optimizers.MergeIdenticalNodes(), roots) || modified;
    modified = runOptimizer(new optimizers.MergeOutputs(), roots) || modified;
  }

  dataComponent.sources = roots;

  return modified;
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
  data.sources.map(moveFacetDown);

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
