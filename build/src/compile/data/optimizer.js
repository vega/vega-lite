var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Optimizer_modified;
import { GraticuleNode } from './graticule';
import { SequenceNode } from './sequence';
import { SourceNode } from './source';
/**
 * Whether this dataflow node is the source of the dataflow that produces data i.e. a source or a generator.
 */
export function isDataSourceNode(node) {
    return node instanceof SourceNode || node instanceof GraticuleNode || node instanceof SequenceNode;
}
/**
 * Abstract base class for Dataflow optimizers.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
export class Optimizer {
    constructor() {
        _Optimizer_modified.set(this, void 0);
        __classPrivateFieldSet(this, _Optimizer_modified, false, "f");
    }
    // Once true, #modified is never set to false
    setModified() {
        __classPrivateFieldSet(this, _Optimizer_modified, true, "f");
    }
    get modifiedFlag() {
        return __classPrivateFieldGet(this, _Optimizer_modified, "f");
    }
}
_Optimizer_modified = new WeakMap();
/**
 * Starts from a node and runs the optimization function (the "run" method) upwards to the root,
 * depending on the continue and modified flag values returned by the optimization function.
 */
export class BottomUpOptimizer extends Optimizer {
    /**
     * Compute a map of node depths that we can use to determine a topological sort order.
     */
    getNodeDepths(node, depth, depths) {
        depths.set(node, depth);
        for (const child of node.children) {
            this.getNodeDepths(child, depth + 1, depths);
        }
        return depths;
    }
    /**
     * Run the optimizer on all nodes starting from the leaves.
     */
    optimize(node) {
        const depths = this.getNodeDepths(node, 0, new Map());
        const topologicalSort = [...depths.entries()].sort((a, b) => b[1] - a[1]);
        for (const tuple of topologicalSort) {
            this.run(tuple[0]);
        }
        return this.modifiedFlag;
    }
}
/**
 * The optimizer function (the "run" method), is invoked on the given node and then continues recursively.
 */
export class TopDownOptimizer extends Optimizer {
    /**
     * Run the optimizer depth first on all nodes starting from the roots.
     */
    optimize(node) {
        this.run(node);
        for (const child of node.children) {
            this.optimize(child);
        }
        return this.modifiedFlag;
    }
}
//# sourceMappingURL=optimizer.js.map