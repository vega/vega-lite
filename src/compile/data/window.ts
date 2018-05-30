import {AggregateOp} from 'vega';
import {vgField} from '../../fielddef';
import {WindowFieldDef, WindowOnlyOp, WindowTransform} from '../../transform';
import {duplicate} from '../../util';
import {VgComparator, VgComparatorOrder, VgWindowTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

/**
 * A class for the window transform nodes
 */
export class WindowTransformNode extends DataFlowNode {
  public clone() {
      return new WindowTransformNode(this.parent, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: WindowTransform) {
    super(parent);
  }

  public producedFields() {
    const out = {};
    this.transform.window.forEach(windowFieldDef => {
      out[this.getDefaultName(windowFieldDef)] = true;
    });

    return out;
  }

  private getDefaultName(windowFieldDef: WindowFieldDef): string {
    return windowFieldDef.as || vgField(windowFieldDef);
  }

  public assemble(): VgWindowTransform {
    const fields: string[] = [];
    const ops: (AggregateOp | WindowOnlyOp)[] = [];
    const as = [];
    const params = [];
    for (const window of this.transform.window) {
      ops.push(window.op);
      as.push(this.getDefaultName(window));
      params.push(window.param === undefined ? null : window.param);
      fields.push(window.field === undefined ? null : window.field);
    }

    const frame = this.transform.frame;
    const groupby = this.transform.groupby;
    const sortFields: string[] = [];
    const sortOrder: VgComparatorOrder[] = [];
    if (this.transform.sort !== undefined) {
      for (const sortField of this.transform.sort) {
        sortFields.push(sortField.field);
        sortOrder.push(sortField.order === undefined ? null : sortField.order as VgComparatorOrder);
      }
    }
    const sort: VgComparator = {
      field: sortFields,
      order: sortOrder,
    };
    const ignorePeers = this.transform.ignorePeers;

    const result: VgWindowTransform = {
      type: 'window',
      params,
      as,
      ops,
      fields,
      sort,
    };

    if (ignorePeers !== undefined) {
      result.ignorePeers = ignorePeers;
    }

    if (groupby !== undefined) {
      result.groupby = groupby;
    }

    if (frame !== undefined) {
      result.frame = frame;
    }

    return result;
  }
}
