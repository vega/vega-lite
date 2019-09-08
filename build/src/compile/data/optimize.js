import * as log from '../../log';
import { checkLinks } from './debug';
import { BottomUpOptimizer } from './optimizer';
import * as optimizers from './optimizers';
export const FACET_SCALE_PREFIX = 'scale_';
export const MAX_OPTIMIZATION_RUNS = 5;
/**
 * Return all leaf nodes.
 */
function getLeaves(roots) {
    const leaves = [];
    function append(node) {
        if (node.numChildren() === 0) {
            leaves.push(node);
        }
        else {
            node.children.forEach(append);
        }
    }
    roots.forEach(append);
    return leaves;
}
export function isTrue(x) {
    return x;
}
/**
 * Run the specified optimizer on the provided nodes.
 *
 * @param optimizer The optimizer instance to run.
 * @param nodes A set of nodes to optimize.
 * @param flag Flag that will be or'ed with return valued from optimization calls to the nodes.
 */
function runOptimizer(optimizer, nodes) {
    const flags = nodes.map(node => {
        if (optimizer instanceof BottomUpOptimizer) {
            const runFlags = optimizer.optimizeNextFromLeaves(node);
            optimizer.reset();
            return runFlags;
        }
        else {
            return optimizer.run(node);
        }
    });
    return flags.some(isTrue);
}
function optimizationDataflowHelper(dataComponent, model) {
    let roots = dataComponent.sources;
    const mutatedFlags = new Set();
    mutatedFlags.add(runOptimizer(new optimizers.RemoveUnnecessaryNodes(), roots));
    // remove source nodes that don't have any children because they also don't have output nodes
    roots = roots.filter(r => r.numChildren() > 0);
    mutatedFlags.add(runOptimizer(new optimizers.RemoveUnusedSubtrees(), getLeaves(roots)));
    roots = roots.filter(r => r.numChildren() > 0);
    mutatedFlags.add(runOptimizer(new optimizers.MoveParseUp(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeBins(model), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.RemoveDuplicateTimeUnits(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeParse(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeAggregates(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeTimeUnits(), getLeaves(roots)));
    mutatedFlags.add(runOptimizer(new optimizers.MergeIdenticalNodes(), roots));
    mutatedFlags.add(runOptimizer(new optimizers.MergeOutputs(), getLeaves(roots)));
    dataComponent.sources = roots;
    return mutatedFlags.has(true);
}
/**
 * Optimizes the dataflow of the passed in data component.
 */
export function optimizeDataflow(data, model) {
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
//# sourceMappingURL=optimize.js.map