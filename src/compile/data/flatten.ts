import {FlattenTransform} from '../../transform';
import {duplicate} from '../../util';
// TODO Use vega-typings
import {VgFlattenTransform} from '../../vega.schema';
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
  }

  public producedFields() {
    const out = {};
    this.transform.flatten.forEach(field => {
      out[this.getDefaultName(field)] = true;
    });
    return out;
  }

  private getDefaultName(field: string): string {
    const index = this.transform.flatten.indexOf(field);
    // Returns the "as" entry corresponding to field if it exists else returns field
    return (this.transform.as === undefined || this.transform.as[index] === undefined) ? field : this.transform.as[index];
  }

  public assemble(): VgFlattenTransform {
    const fields: string[] = [];
    const as = [];
    for (const field of this.transform.flatten) {
      fields.push(field === undefined ? null : field);
      as.push(this.getDefaultName(field));
    }

    const result: VgFlattenTransform = {
      type: 'flatten',
      fields,
      as
    };
    return result;
  }
}
