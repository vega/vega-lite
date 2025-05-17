import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';
/**
 * A class for density transform nodes
 */
export class DensityTransformNode extends DataFlowNode {
  transform;
  clone() {
    return new DensityTransformNode(null, duplicate(this.transform));
  }
  constructor(parent, transform) {
    super(parent);
    this.transform = transform;
    this.transform = duplicate(transform); // duplicate to prevent side effects
    const specifiedAs = this.transform.as ?? [undefined, undefined];
    this.transform.as = [specifiedAs[0] ?? 'value', specifiedAs[1] ?? 'density'];
    const resolve = this.transform.resolve ?? 'shared';
    this.transform.resolve = resolve;
  }
  dependentFields() {
    return new Set([this.transform.density, ...(this.transform.groupby ?? [])]);
  }
  producedFields() {
    return new Set(this.transform.as);
  }
  hash() {
    return `DensityTransform ${hash(this.transform)}`;
  }
  assemble() {
    const {density, ...rest} = this.transform;
    const result = {
      type: 'kde',
      field: density,
      ...rest,
    };
    result.resolve = this.transform.resolve;
    return result;
  }
}
//# sourceMappingURL=density.js.map
