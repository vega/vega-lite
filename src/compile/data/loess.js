import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';
/**
 * A class for loess transform nodes
 */
export class LoessTransformNode extends DataFlowNode {
  transform;
  clone() {
    return new LoessTransformNode(null, duplicate(this.transform));
  }
  constructor(parent, transform) {
    super(parent);
    this.transform = transform;
    this.transform = duplicate(transform); // duplicate to prevent side effects
    const specifiedAs = this.transform.as ?? [undefined, undefined];
    this.transform.as = [specifiedAs[0] ?? transform.on, specifiedAs[1] ?? transform.loess];
  }
  dependentFields() {
    return new Set([this.transform.loess, this.transform.on, ...(this.transform.groupby ?? [])]);
  }
  producedFields() {
    return new Set(this.transform.as);
  }
  hash() {
    return `LoessTransform ${hash(this.transform)}`;
  }
  assemble() {
    const {loess, on, ...rest} = this.transform;
    const result = {
      type: 'loess',
      x: on,
      y: loess,
      ...rest,
    };
    return result;
  }
}
//# sourceMappingURL=loess.js.map
