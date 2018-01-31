import {SELECTION_ID} from '../../selection';
import {StringSet} from '../../util';
import {VgIdentifierTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class IdentifierNode extends DataFlowNode {
  public clone() {
    return new IdentifierNode();
  }

  constructor() {
    super();
  }

  public producedFields(): StringSet {
    return {[SELECTION_ID]: true};
  }

  public assemble(): VgIdentifierTransform {
    return {type: 'identifier', as: SELECTION_ID};
  }
}
