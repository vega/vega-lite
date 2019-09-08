import { SourceNode } from './source';
import { GraticuleNode } from './graticule';
import { SequenceNode } from './sequence';
/**
 * Whether this dataflow node is the source of the dataflow that produces data i.e. a source or a generator.
 */
export function isDataSourceNode(node) {
    return node instanceof SourceNode || node instanceof GraticuleNode || node instanceof SequenceNode;
}
/**
 * Abstract base class for BottomUpOptimizer and TopDownOptimizer.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
class OptimizerBase {
    constructor() {
        this._mutated = false;
    }
    // Once true, _mutated is never set to false
    setMutated() {
        this._mutated = true;
    }
    get mutatedFlag() {
        return this._mutated;
    }
}
/**
 * Starts from a node and runs the optimization function(the "run" method) upwards to the root,
 * depending on the continueFlag and mutatedFlag values returned by the optimization function.
 */
export class BottomUpOptimizer extends OptimizerBase {
    constructor() {
        super();
        this._continue = false;
    }
    setContinue() {
        this._continue = true;
    }
    get continueFlag() {
        return this._continue;
    }
    get flags() {
        return { continueFlag: this.continueFlag, mutatedFlag: this.mutatedFlag };
    }
    set flags({ continueFlag, mutatedFlag }) {
        if (continueFlag) {
            this.setContinue();
        }
        if (mutatedFlag) {
            this.setMutated();
        }
    }
    /**
     * Reset the state of the optimizer after it has completed a run from the bottom of the tree to the top.
     */
    reset() {
        // do nothing
    }
    optimizeNextFromLeaves(node) {
        if (isDataSourceNode(node)) {
            return false;
        }
        const next = node.parent;
        const { continueFlag } = this.run(node);
        if (continueFlag) {
            this.optimizeNextFromLeaves(next);
        }
        return this.mutatedFlag;
    }
}
/**
 * The optimizer function( the "run" method), is invoked on the given node and then continues recursively.
 */
export class TopDownOptimizer extends OptimizerBase {
}
//# sourceMappingURL=optimizer.js.map