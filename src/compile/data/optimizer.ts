import {DataFlowNode} from './dataflow.js';
import {GraticuleNode} from './graticule.js';
import {SequenceNode} from './sequence.js';
import {SourceNode} from './source.js';

/**
 * Whether this dataflow node is the source of the dataflow that produces data i.e. a source or a generator.
 */
export function isDataSourceNode(node: DataFlowNode) {
  return node instanceof SourceNode || node instanceof GraticuleNode || node instanceof SequenceNode;
}

/**
 * Abstract base class for Dataflow optimizers.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
export abstract class Optimizer {
  #modified: boolean;

  constructor() {
    this.#modified = false;
  }

  // Once true, #modified is never set to false
  public setModified() {
    this.#modified = true;
  }

  get modifiedFlag() {
    return this.#modified;
  }

  /**
   * Run the optimization for the tree with the provided root.
   */
  public abstract optimize(root: DataFlowNode): boolean;
}

/**
 * Starts from a node and runs the optimization function (the "run" method) upwards to the root,
 * depending on the continue and modified flag values returned by the optimization function.
 */
export abstract class BottomUpOptimizer extends Optimizer {
  /**
   * Run the optimizer at the node. This method should not change the parent of the passed in node (it should only affect children).
   */
  public abstract run(node: DataFlowNode): void;

  /**
   * Compute a map of node depths that we can use to determine a topological sort order.
   */
  private getNodeDepths(
    node: DataFlowNode,
    depth: number,
    depths: Map<DataFlowNode, number>,
  ): Map<DataFlowNode, number> {
    depths.set(node, depth);

    for (const child of node.children) {
      this.getNodeDepths(child, depth + 1, depths);
    }

    return depths;
  }

  /**
   * Run the optimizer on all nodes starting from the leaves.
   */
  public optimize(node: DataFlowNode): boolean {
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
export abstract class TopDownOptimizer extends Optimizer {
  /**
   * Run the optimizer at the node.
   */
  public abstract run(node: DataFlowNode): void;

  /**
   * Run the optimizer depth first on all nodes starting from the roots.
   */
  public optimize(node: DataFlowNode): boolean {
    this.run(node);

    for (const child of node.children) {
      this.optimize(child);
    }

    return this.modifiedFlag;
  }
}
