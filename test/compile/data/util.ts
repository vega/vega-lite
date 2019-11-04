import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {uniqueId} from '../../../src/util';

/**
 * A dataflow node class that implements required functions.
 */
export class PlaceholderDataFlowNode extends DataFlowNode {
  public dependentFields() {
    return new Set<string>();
  }

  public producedFields() {
    return new Set<string>();
  }

  public hash(): string | number {
    if (this._hash === undefined) {
      this._hash = uniqueId();
    }
    return this._hash;
  }
}
