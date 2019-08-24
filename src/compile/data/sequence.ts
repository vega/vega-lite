import {SequenceParams} from '../../data';
import {hash} from '../../util';
import {VgSequenceTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class SequenceNode extends DataFlowNode {
  public clone() {
    return new SequenceNode(null, this.params);
  }

  constructor(parent: DataFlowNode, private params: SequenceParams) {
    super(parent);
  }

  public dependentFields() {
    return new Set<string>();
  }

  public producedFields() {
    return new Set([this.params.as || 'data']);
  }

  public hash() {
    return `Hash ${hash(this.params)}`;
  }

  public assemble(): VgSequenceTransform {
    return {
      type: 'sequence',
      ...this.params
    };
  }
}
