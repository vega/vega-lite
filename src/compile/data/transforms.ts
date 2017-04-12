import {isArray} from 'vega-util';
import {expression, Filter} from '../../filter';
import {CalculateTransform, FilterTransform, isCalculate, isFilter} from '../../transform';
import {VgFilterTransform, VgFormulaTransform} from '../../vega.schema';
import {Model} from '../model';
import {DataFlowNode, DependentNode, NewFieldNode} from './dataflow';

import * as log from '../../log';
import {transforms} from './optimizers';

export class FilterNode extends DataFlowNode {
  private filter: Filter | Filter[];

  constructor(transform: FilterTransform) {
    super();

    this.filter = transform.filter;
  }

  public merge(other: FilterNode) {
    this.filter = (isArray(this.filter) ? this.filter : [this.filter]).concat(
      isArray(other.filter) ? other.filter : [other.filter]);

    this.remove();
  }

  public assemble(): VgFilterTransform {
    return {
      type: 'filter',
      expr: expression(this.filter)
    };
  }
}

/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export class CalculateNode extends DataFlowNode implements NewFieldNode {

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
      node = new FilterNode(t);
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
