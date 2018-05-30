import {FlattenTransform as VgFlattenTransform} from 'vega-typings';
import {FlattenTransform} from '../../transform';
import {duplicate} from '../../util';
import {DataFlowNode} from './dataflow';

/**
 * A class for flatten transform nodes
 */
export class FlattenTransformNode extends DataFlowNode {
  public clone() {
    return new FlattenTransformNode(this.parent, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: FlattenTransform) {
    super(parent);
    const {flatten, as=[]} = this.transform;
    this.transform.as = flatten.map((f,i) => as[i] || f);
  }

  public producedFields() {
    return this.transform.flatten.reduce((out, field, i) => {
      out[this.transform.as[i]] = true;
      return out;
    }, {});
  }

  public assemble(): VgFlattenTransform {
    const {flatten: fields, as} = this.transform;

    const result: VgFlattenTransform = {
      type: 'flatten',
      fields,
      as
    };
    return result;
  }
}
