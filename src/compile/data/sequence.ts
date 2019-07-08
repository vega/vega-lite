import {SequenceParams} from '../../data';
import {VgSequenceTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class SequenceNode extends DataFlowNode {
  public clone() {
    return new SequenceNode(null, this.params);
  }

  constructor(parent: DataFlowNode, private params: SequenceParams) {
    super(parent);
  }

  public producedFields() {
    return new Set([this.params.as || 'data']);
  }

  public assemble(): VgSequenceTransform {
    return {
      type: 'sequence',
      ...this.params
    };
  }
}
