import {AggregateOp} from 'vega';
import {vgField} from '../../channeldef.js';
import {JoinAggregateTransform} from '../../transform.js';
import {duplicate, hash} from '../../util.js';
import {VgJoinAggregateTransform} from '../../vega.schema.js';
import {JoinAggregateFieldDef} from '../../transform.js';
import {unique} from '../../util.js';
import {DataFlowNode} from './dataflow.js';

/**
 * A class for the join aggregate transform nodes.
 */
export class JoinAggregateTransformNode extends DataFlowNode {
  public clone() {
    return new JoinAggregateTransformNode(null, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private readonly transform: JoinAggregateTransform,
  ) {
    super(parent);
  }

  public addDimensions(fields: string[]) {
    this.transform.groupby = unique(this.transform.groupby.concat(fields), (d) => d);
  }

  public dependentFields() {
    const out = new Set<string>();

    if (this.transform.groupby) {
      this.transform.groupby.forEach(out.add, out);
    }
    this.transform.joinaggregate
      .map((w) => w.field)
      .filter((f) => f !== undefined)
      .forEach(out.add, out);

    return out;
  }

  public producedFields() {
    return new Set(this.transform.joinaggregate.map(this.getDefaultName));
  }

  private getDefaultName(joinAggregateFieldDef: JoinAggregateFieldDef): string {
    return joinAggregateFieldDef.as ?? vgField(joinAggregateFieldDef);
  }

  public hash() {
    return `JoinAggregateTransform ${hash(this.transform)}`;
  }

  public assemble(): VgJoinAggregateTransform {
    const fields: string[] = [];
    const ops: AggregateOp[] = [];
    const as: string[] = [];
    for (const joinaggregate of this.transform.joinaggregate) {
      ops.push(joinaggregate.op);
      as.push(this.getDefaultName(joinaggregate));
      fields.push(joinaggregate.field === undefined ? null : joinaggregate.field);
    }

    const groupby = this.transform.groupby;

    return {
      type: 'joinaggregate',
      as,
      ops,
      fields,
      ...(groupby !== undefined ? {groupby} : {}),
    };
  }
}
