import {FoldTransform as VgFoldTransform} from 'vega-typings';
import {FoldTransform} from '../../transform';
import {duplicate} from '../../util';
import {DataFlowNode} from './dataflow';

/**
 * A class for flatten transform nodes
 */
export class FoldTransformNode extends DataFlowNode {

  public clone() {
    return new FoldTransformNode(this.parent, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: FoldTransform) {
    super(parent);
    const specifiedAs = this.transform.as || [undefined, undefined];
    this.transform.as = [specifiedAs[0] || 'key', specifiedAs[1] || 'value'];
  }

  public producedFields() {
    return this.transform.as.reduce((result,item) => {
      result[item] = true;
      return result;
    }, {});
  }

  private getNames(): [string, string] | undefined {
    const as = this.transform.as;
    if (as && as.length > 1) {
      return [as[0], as[1]];
    } else if (as && as[0]) {
      return [as[0], 'value'];
    } else {
      return undefined;
    }
  }

  public assemble(): VgFoldTransform {
    const {fold, as} = this.transform;
    const result: VgFoldTransform = {
      type: 'fold',
      fields: fold,
      as
    };
    return result;
  }
}
