import {PivotTransform} from '../../transform';
import {duplicate, hash, unique} from '../../util';
import {VgPivotTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

/**
 * A class for pivot transform nodes
 */
export class PivotTransformNode extends DataFlowNode {
  public clone() {
    return new PivotTransformNode(null, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: PivotTransform) {
    super(parent);
  }

  public addDimensions(fields: string[]) {
    this.transform.groupby = unique((this.transform.groupby || []).concat(fields), d => d);
  }

  public dependentFields() {
    return new Set([this.transform.pivot, this.transform.value, ...(this.transform.groupby || [])]);
  }

  public hash() {
    return `PivotTransform ${hash(this.transform)}`;
  }

  public assemble(): VgPivotTransform {
    const {pivot, value, groupby, limit, op} = this.transform;
    return {
      type: 'pivot',
      field: pivot,
      value,
      ...(limit !== undefined ? {limit} : {}),
      ...(op !== undefined ? {op} : {}),
      ...(groupby !== undefined ? {groupby} : {})
    };
  }
}
