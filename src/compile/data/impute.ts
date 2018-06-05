import {ImputeTransform} from '../../transform';
import {duplicate} from '../../util';
import {VgImputeTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class ImputeTransformNode extends DataFlowNode {
  public clone() {
    return new ImputeTransformNode(this.parent, duplicate(this.transform));
  }

  public producedFields() {
    // typescript detects true as boolean type
    return {[this.transform.impute]: true as true} ;
  }

  constructor(parent: DataFlowNode, private transform: ImputeTransform) {
    super(parent);
  }

  public assemble(): VgImputeTransform {
    const {impute, key, keyvals, method, groupby, value} = this.transform;
    return {
      type: 'impute',
      field: impute,
      key,
      ...(keyvals? {keyvals}: {}),
      ...(method? {method}: {}),
      ...(groupby? {groupby}: {}),
      ...(value? {value}: {})
    };
  }
}
