import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';
/**
 * A class for flatten transform nodes
 */
export class FlattenTransformNode extends DataFlowNode {
  transform;
  clone() {
    return new FlattenTransformNode(this.parent, duplicate(this.transform));
  }
  constructor(parent, transform) {
    super(parent);
    this.transform = transform;
    this.transform = duplicate(transform); // duplicate to prevent side effects
    const {flatten, as = []} = this.transform;
    this.transform.as = flatten.map((f, i) => as[i] ?? f);
  }
  dependentFields() {
    return new Set(this.transform.flatten);
  }
  producedFields() {
    return new Set(this.transform.as);
  }
  hash() {
    return `FlattenTransform ${hash(this.transform)}`;
  }
  assemble() {
    const {flatten: fields, as} = this.transform;
    const result = {
      type: 'flatten',
      fields,
      as,
    };
    return result;
  }
}
//# sourceMappingURL=flatten.js.map
