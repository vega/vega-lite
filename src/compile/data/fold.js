import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';
/**
 * A class for flatten transform nodes
 */
export class FoldTransformNode extends DataFlowNode {
  transform;
  clone() {
    return new FoldTransformNode(null, duplicate(this.transform));
  }
  constructor(parent, transform) {
    super(parent);
    this.transform = transform;
    this.transform = duplicate(transform); // duplicate to prevent side effects
    const specifiedAs = this.transform.as ?? [undefined, undefined];
    this.transform.as = [specifiedAs[0] ?? 'key', specifiedAs[1] ?? 'value'];
  }
  dependentFields() {
    return new Set(this.transform.fold);
  }
  producedFields() {
    return new Set(this.transform.as);
  }
  hash() {
    return `FoldTransform ${hash(this.transform)}`;
  }
  assemble() {
    const {fold, as} = this.transform;
    const result = {
      type: 'fold',
      fields: fold,
      as,
    };
    return result;
  }
}
//# sourceMappingURL=fold.js.map
