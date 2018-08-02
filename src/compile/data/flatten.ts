import {FlattenTransform as VgFlattenTransform} from 'vega';
import {FlattenTransform} from '../../transform';
import {duplicate, hash} from '../../util';
import {DataFlowNode, TransformNode} from './dataflow';

/**
 * A class for flatten transform nodes
 */
export class FlattenTransformNode extends TransformNode {
  public clone() {
    return new FlattenTransformNode(this.parent, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: FlattenTransform) {
    super(parent);
    const {flatten, as = []} = this.transform;
    this.transform.as = flatten.map((f, i) => as[i] || f);
  }

  public producedFields() {
    return this.transform.flatten.reduce((out, field, i) => {
      out[this.transform.as[i]] = true;
      return out;
    }, {});
  }

  public hash() {
    return `FlattenTransform ${hash(this.transform)}`;
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
