import type {FlattenTransform as VgFlattenTransform} from 'vega';
import {FlattenTransform} from '../../transform.js';
import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';

/**
 * A class for flatten transform nodes
 */
export class FlattenTransformNode extends DataFlowNode {
  public clone() {
    return new FlattenTransformNode(this.parent, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private transform: FlattenTransform,
  ) {
    super(parent);
    this.transform = duplicate(transform); // duplicate to prevent side effects
    const {flatten, as = []} = this.transform;
    this.transform.as = flatten.map((f, i) => as[i] ?? f);
  }

  public dependentFields() {
    return new Set(this.transform.flatten);
  }

  public producedFields() {
    return new Set(this.transform.as);
  }

  public hash() {
    return `FlattenTransform ${hash(this.transform)}`;
  }

  public assemble(): VgFlattenTransform {
    const {flatten: fields, as} = this.transform;

    const result: VgFlattenTransform = {
      type: 'flatten',
      fields,
      as,
    };
    return result;
  }
}
