import {DataFlowNode} from './dataflow';
import {OptimizerFlags} from './optimizers';
import {SourceNode} from './source';

abstract class OptimizerBase {
  private _mutated: boolean;
  constructor() {
    this._mutated = false;
  }

  public setMutated() {
    this._mutated = true;
  }

  get mutatedFlag() {
    return this._mutated;
  }
}

export abstract class BottomUpOptimizer extends OptimizerBase {
  private _continue: boolean;

  constructor() {
    super();
    this._continue = false;
  }

  public setContinue() {
    this._continue = true;
  }

  get continueFlag() {
    return this._continue;
  }

  get flags(): OptimizerFlags {
    return {continueFlag: this.continueFlag, mutatedFlag: this.mutatedFlag};
  }

  set flags({continueFlag, mutatedFlag}: OptimizerFlags) {
    if (continueFlag) {
      this.setContinue();
    }
    if (mutatedFlag) {
      this.setMutated();
    }
  }

  public abstract optimize(node: DataFlowNode): OptimizerFlags;

  public optimizeNextFromLeaves(node: DataFlowNode): boolean {
    if (node instanceof SourceNode) {
      return false;
    }
    const next = node.parent;
    const {continueFlag} = this.optimize(node);
    if (continueFlag) {
      this.optimizeNextFromLeaves(next);
    }
    return this.mutatedFlag;
  }
}

export abstract class TopDownOptimizer extends OptimizerBase {
  public abstract run(node: DataFlowNode): boolean;
}
