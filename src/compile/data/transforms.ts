import {isArray} from 'vega-util';
import {expression, Filter} from '../../filter';
import * as log from '../../log';
import {CalculateTransform, FilterTransform, isBin, isCalculate, isFilter, isSummarize, isTimeUnit} from '../../transform';
import {duplicate} from '../../util';
import {VgFilterTransform, VgFormulaTransform} from '../../vega.schema';
import {Model, ModelWithField} from '../model';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode} from './dataflow';
import {TimeUnitNode} from './timeunit';

export class FilterNode extends DataFlowNode {
  public clone() {
    return new FilterNode(this.model, duplicate(this.filter));
  }

  constructor(private readonly model: Model, private filter: Filter) {
    super();
  }

  public assemble(): VgFilterTransform {
    return {
      type: 'filter',
      expr: expression(this.model, this.filter)
    };
  }
}

/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export class CalculateNode extends DataFlowNode {
  public clone() {
    return new CalculateNode(duplicate(this.transform));
  }

  constructor(private transform: CalculateTransform) {
    super();
  }

  public producedFields() {
    const out = {};
    out[this.transform.as] = true;
    return out;
  }

  public assemble(): VgFormulaTransform {
    return {
      type: 'formula',
      expr: this.transform.calculate,
      as: this.transform.as
    };
  }
}

/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(model: Model) {
  let first: DataFlowNode;
  let last: DataFlowNode;
  let node: DataFlowNode;
  let previous: DataFlowNode;

  model.transforms.forEach((t, i) => {
    if (isCalculate(t)) {
      node = new CalculateNode(t);
    } else if (isFilter(t)) {
      node = new FilterNode(model, t.filter);
    } else if (isBin(t)) {
      node = BinNode.makeBinFromTransform(model, t);
    } else if (isTimeUnit(t)) {
      node = TimeUnitNode.makeFromTransfrom(model, t);
    } else if (isSummarize(t)) {
      node = AggregateNode.makeFromTransform(model, t);
    } else {
      log.warn(log.message.invalidTransformIgnored(t));
      return;
    }

    if (i === 0) {
      first = node;
    } else {
      node.parent = previous;
    }
    previous = node;
  });

  last = node;

  return {first, last};
}
