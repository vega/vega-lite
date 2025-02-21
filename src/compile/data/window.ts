import {AggregateOp, WindowTransform as VgWindowTransform} from 'vega';
import {isAggregateOp} from '../../aggregate.js';
import {vgField} from '../../channeldef.js';
import {SortOrder} from '../../sort.js';
import {WindowFieldDef, WindowOnlyOp, WindowTransform} from '../../transform.js';
import {duplicate, hash} from '../../util.js';
import {VgComparator, VgJoinAggregateTransform} from '../../vega.schema.js';
import {unique} from '../../util.js';
import {DataFlowNode} from './dataflow.js';

/**
 * A class for the window transform nodes
 */
export class WindowTransformNode extends DataFlowNode {
  public clone() {
    return new WindowTransformNode(null, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private readonly transform: WindowTransform,
  ) {
    super(parent);
  }

  public addDimensions(fields: string[]) {
    this.transform.groupby = unique(this.transform.groupby.concat(fields), (d) => d);
  }

  public dependentFields() {
    const out = new Set<string>();

    (this.transform.groupby ?? []).forEach(out.add, out);
    (this.transform.sort ?? []).forEach((m) => out.add(m.field));

    this.transform.window
      .map((w) => w.field)
      .filter((f) => f !== undefined)
      .forEach(out.add, out);

    return out;
  }

  public producedFields() {
    return new Set(this.transform.window.map(this.getDefaultName));
  }

  private getDefaultName(windowFieldDef: WindowFieldDef): string {
    return windowFieldDef.as ?? vgField(windowFieldDef);
  }

  public hash() {
    return `WindowTransform ${hash(this.transform)}`;
  }

  public assemble(): VgWindowTransform | VgJoinAggregateTransform {
    const fields: string[] = [];
    const ops: (AggregateOp | WindowOnlyOp)[] = [];
    const as: string[] = [];
    const params = [];

    for (const window of this.transform.window) {
      ops.push(window.op);
      as.push(this.getDefaultName(window));
      params.push(window.param === undefined ? null : window.param);
      fields.push(window.field === undefined ? null : window.field);
    }

    const frame = this.transform.frame;
    const groupby = this.transform.groupby;

    if (frame && frame[0] === null && frame[1] === null && ops.every((o) => isAggregateOp(o))) {
      // when the window does not rely on any particular window ops or frame, switch to a simpler and more efficient joinaggregate
      return {
        type: 'joinaggregate',
        as,
        ops: ops as AggregateOp[],
        fields,
        ...(groupby !== undefined ? {groupby} : {}),
      } as VgJoinAggregateTransform;
    }

    const sortFields: string[] = [];
    const sortOrder: SortOrder[] = [];
    if (this.transform.sort !== undefined) {
      for (const sortField of this.transform.sort) {
        sortFields.push(sortField.field);
        sortOrder.push(sortField.order ?? 'ascending');
      }
    }
    const sort: VgComparator = {
      field: sortFields,
      order: sortOrder,
    };
    const ignorePeers = this.transform.ignorePeers;

    return {
      type: 'window',
      params,
      as,
      ops,
      fields,
      sort,
      ...(ignorePeers !== undefined ? {ignorePeers} : {}),
      ...(groupby !== undefined ? {groupby} : {}),
      ...(frame !== undefined ? {frame} : {}),
    } as VgWindowTransform;
  }
}
