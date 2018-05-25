import {FoldTransform as VgFoldTransform} from 'vega-typings';
import {isString} from 'vega-util';
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
  }

  public producedFields() {
    const defaultNames = this.getDefaultName();

    if (defaultNames === undefined) {
      return {'key': true, 'value': true};
    } else {
      return defaultNames.reduce((result,item) => {
        result[item] = true;
        return result;
      }, {});
    }
  }

  private getDefaultName(): [string, string] | undefined {
    const as = this.transform.as;
    if (as && isString(as[0]) && isString(as[1])) {
      return [as[0], as[1]];
    } else {
      return undefined;
    }
  }

  public assemble(): VgFoldTransform {
    const fields: string[] = [];
    for (const field of this.transform.fold) {
      fields.push(field === undefined ? null : field);
    }

    const result: VgFoldTransform = {
      type: 'fold',
      fields,
      as: this.getDefaultName()
    };
    return result;
  }
}
