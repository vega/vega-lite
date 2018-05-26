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
    this.transform.as = this.getNames();
  }

  public producedFields() {
    const names = this.getNames();

    if (names === undefined) {
      return {'key': true, 'value': true};
    } else {
      return names.reduce((result,item) => {
        result[item] = true;
        return result;
      }, {});
    }
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
