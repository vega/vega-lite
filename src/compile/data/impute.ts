import {ImputeSequence, ImputeTransform, isImputeSequence} from '../../transform';
import {duplicate} from '../../util';
import {VgImputeTransform, VgSignalRef} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class ImputeTransformNode extends DataFlowNode {
  public clone() {
    return new ImputeTransformNode(this.parent, duplicate(this.transform));
  }

  public producedFields() {
    // typescript detects true as boolean type
    return {[this.transform.impute]: true as true};
  }

  constructor(parent: DataFlowNode, private transform: ImputeTransform) {
    super(parent);

  }

  private processSequence(keyvals: ImputeSequence): VgSignalRef {
    const {start, stop, step=1} = keyvals;
    return {signal: `sequence(${start}, ${stop}, ${step})`};
  }

  public assemble(): VgImputeTransform {
    const {impute, key, keyvals, method, groupby, value} = this.transform;
    return {
      type: 'impute',
      field: impute,
      key,
      ...(keyvals ? {keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals}: {}),
      ...(method ? {method}: {}),
      ...(groupby ? {groupby}: {}),
      ...(value ? {value}: {})
    };
  }
}
