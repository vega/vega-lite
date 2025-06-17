import {SELECTION_ID} from '../../selection.js';
import {DataFlowNode} from './dataflow.js';
export class IdentifierNode extends DataFlowNode {
  clone() {
    return new IdentifierNode(null);
  }
  constructor(parent) {
    super(parent);
  }
  dependentFields() {
    return new Set();
  }
  producedFields() {
    return new Set([SELECTION_ID]);
  }
  hash() {
    return 'Identifier';
  }
  assemble() {
    return {type: 'identifier', as: SELECTION_ID};
  }
}
//# sourceMappingURL=identifier.js.map
