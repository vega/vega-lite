import {AggregateOp} from 'vega';
import {vgField} from '../../fielddef';
import {WindowFieldDef, WindowOnlyOp, WindowTransform} from '../../transform';
import {duplicate, hash} from '../../util';
import {VgComparator, VgComparatorOrder, VgWindowTransform} from '../../vega.schema';
import {unique} from './../../util';
import {DataFlowNode} from './dataflow';

/**
 * A class for the window transform nodes
 */
export class WindowTransformNode extends DataFlowNode {
  public clone() {
    return new WindowTransformNode(null, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private readonly transform: WindowTransform) {
    super(parent);
  }

  public addDimensions(fields: string[]) {
    this.transform.groupby = unique(this.transform.groupby.concat(fields), d => d);
  }

  public dependentFields() {
    const out = new Set<string>();

    this.transform.groupby.forEach(f => out.add(f));
    this.transform.sort.forEach(m => out.add(m.field));
    this.transform.window
      .map(w => w.field)
      .filter(f => f !== undefined)
      .forEach(f => out.add(f));

    return out;
  }

  public producedFields() {
    return new Set(this.transform.window.map(this.getDefaultName));
  }

  private getDefaultName(windowFieldDef: WindowFieldDef): string {
    return windowFieldDef.as || vgField(windowFieldDef);
  }

  public hash() {
    return `WindowTransform ${hash(this.transform)}`;
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
        sortOrder.push(sortField.order || 'ascending');
      }
    }
    const sort: VgComparator = {
      field: sortFields,
      order: sortOrder
    };
    const ignorePeers = this.transform.ignorePeers;

    const result: VgWindowTransform = {
      type: 'window',
      params,
      as,
      ops,
      fields,
      sort
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
