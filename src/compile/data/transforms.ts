import {isArray} from 'vega-util';
import {expression, Filter} from '../../filter';
import * as log from '../../log';
import {CalculateTransform, FilterTransform, isCalculate, isFilter, isLookup, LookupTransform} from '../../transform';
import {duplicate} from '../../util';
import {VgFilterTransform, VgFormulaTransform, VgLookupTransform} from '../../vega.schema';
import {Model} from '../model';
import {DataFlowNode} from './dataflow';
import {SourceNode} from './source';

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

export class LookupNode extends DataFlowNode {
  private readonly secondaryDataName: string;

  constructor(private transform: LookupTransform, public secondary: SourceNode) {
    super();
  }

  public assemble(): VgLookupTransform {
    // TODO: this.transform.from.fields isn't used
    const DEFAULT_AS = '_lookup';
    // it'll be used either in a subsequent transform to isolate those variables and merge them in
    // or via some object name properties trickery
    return {
      type: 'lookup',
      from: this.secondary.dataName,
      key: this.transform.from.key,
      fields: [this.transform.lookup],
      as: this.transform.as
        ? ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as])
        : [DEFAULT_AS],
      ...(this.transform.default ? {default: this.transform.default} : {})
    };
  }
}


/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(model: Model, lookups: SourceNode[]) {
  let first: DataFlowNode;
  let last: DataFlowNode;
  let node: DataFlowNode;
  let previous: DataFlowNode;

  let l = 0;
  model.transforms.forEach((t, i) => {
    if (isLookup(t)) {
      node = new LookupNode(t, lookups[l]);
      l++;
    } else if (isCalculate(t)) {
      node = new CalculateNode(t);
    } else if (isFilter(t)) {
      node = new FilterNode(model, t.filter);
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
