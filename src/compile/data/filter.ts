import {LogicalOperand} from '../../logical';
import {expression, Predicate} from '../../predicate';
import {duplicate} from '../../util';
import {VgFilterTransform} from '../../vega.schema';
import {Model} from '../model';
import {DataFlowNode} from './dataflow';

export class FilterNode extends DataFlowNode {
  private expr: string;
  public clone() {
    return new FilterNode(null, this.model, duplicate(this.filter));
  }

  constructor(parent: DataFlowNode, private readonly model: Model, private filter: LogicalOperand<Predicate>) {
    super(parent);
    this.expr = expression(this.model, this.filter, this);
  }

  public assemble(): VgFilterTransform {
    return {
      type: 'filter',
      expr: this.expr
    };
  }
}
