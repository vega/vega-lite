import {ExtentTransform as VgExtentTransform} from 'vega';
import {ExtentTransform} from '../../transform';
import {duplicate, hash} from '../../util';
import {DataFlowNode} from './dataflow';

/**
 * A class for flatten transform nodes
 */
export class ExtentTransformNode extends DataFlowNode {
  public clone() {
    return new ExtentTransformNode(null, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private transform: ExtentTransform
  ) {
    super(parent);
    this.transform = duplicate(transform);
  }

  public dependentFields() {
    return new Set([this.transform.extent]);
  }

  public producedFields() {
    return new Set([]);
  }

  public hash() {
    return `ExtentTransform ${hash(this.transform)}`;
  }

  public assemble(): VgExtentTransform {
    const {extent, param} = this.transform;
    const result: VgExtentTransform = {
      type: 'extent',
      field: extent,
      signal: param
    };
    return result;
  }
}
