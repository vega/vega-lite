import {DataFlowNode} from './dataflow';
import {OptimizerFlags} from './optimizers';
import {SourceNode} from './source';
import {GraticuleNode} from './graticule';
import {SequenceNode} from './sequence';

/**
 * Whether this dataflow node is the source of the dataflow that produces data i.e. a source or a generator.
 */
export function isDataSourceNode(node: DataFlowNode) {
  return node instanceof SourceNode || node instanceof GraticuleNode || node instanceof SequenceNode;
}

/**
 * Abstract base class for BottomUpOptimizer and TopDownOptimizer.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
abstract class OptimizerBase {
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
}

/**
 * Starts from a node and runs the optimization function (the "run" method) upwards to the root,
 * depending on the continue and modified flag values returned by the optimization function.
 */
export abstract class BottomUpOptimizer extends OptimizerBase {
  #continue: boolean;

  constructor() {
    super();
    this.#continue = false;
  }

  public setContinue() {
    this.#continue = true;
  }

  get continueFlag() {
    return this.#continue;
  }

  get flags(): OptimizerFlags {
    return {continue: this.continueFlag, modified: this.modifiedFlag};
  }

  set flags(flags: OptimizerFlags) {
    if (flags.continue) {
      this.setContinue();
    }
    if (flags.modified) {
      this.setModified();
    }
  }

  /**
   * Run the optimizer at the node.
   */
  public abstract run(node: DataFlowNode): OptimizerFlags;

  /**
   * Reset the state of the optimizer after it has completed a run from the bottom of the tree to the top.
   */
  public reset(): void {
    // do nothing
  }

  /**
   * Run the optimizer on all nodes starting from the leaves.
   */
  public optimizeFromLeaves(node: DataFlowNode): boolean {
    if (isDataSourceNode(node)) {
      return false;
    }

    const next = node.parent;
    const flags = this.run(node);

    if (flags.continue) {
      this.optimizeFromLeaves(next);
    }
    return this.modifiedFlag;
  }
}

/**
 * The optimizer function (the "run" method), is invoked on the given node and then continues recursively.
 */
export abstract class TopDownOptimizer extends OptimizerBase {
  /**
   * Run the optimizer depth first on all nodes starting from the roots.
   */
  public optimizeFromRoot(node: DataFlowNode): boolean {
    this.run(node);

    for (const child of node.children) {
      this.optimizeFromRoot(child);
    }
    return this.modifiedFlag;
  }

  /**
   * Run the optimizer at the node.
   */
  public abstract run(node: DataFlowNode): void;
}
