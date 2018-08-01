import {LogicalOperand} from '../../logical';
import {expression, Predicate} from '../../predicate';
import {duplicate, hash, StringSet} from '../../util';
import {VgFilterTransform} from '../../vega.schema';
import {Model} from '../model';
import {DataFlowNode, TransformNode} from './dataflow';
import {getDependentFields} from './expressions';

export class FilterNode extends TransformNode {
  private expr: string;
  private _dependentFields: StringSet;
  public clone() {
    return new FilterNode(null, this.model, duplicate(this.filter));
  }

  constructor(parent: DataFlowNode, private readonly model: Model, private filter: LogicalOperand<Predicate>) {
    super(parent);
    this.expr = expression(this.model, this.filter, this);

    this._dependentFields = getDependentFields(this.expr);
  }

  public dependentFields() {
    return this._dependentFields;
  }

  public assemble(): VgFilterTransform {
    return {
      type: 'filter',
      expr: this.expr
    };
  }

  public hash() {
    return `Filter ${hash(this.filter)}`;
  }
}
