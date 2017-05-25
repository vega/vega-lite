import {isArray, isString} from 'vega-util';
import {expression, Filter} from '../../filter';
import * as log from '../../log';
import {CalculateTransform, FilterTransform, isBin, isCalculate, isFilter, isLookup, isSummarize, isTimeUnit, LookupTransform} from '../../transform';
import {duplicate} from '../../util';
import {VgFilterTransform, VgFormulaTransform, VgLookupTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {Model} from '../model';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {SourceNode} from './source';
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

export class LookupNode extends DataFlowNode {
  constructor(public readonly transform: LookupTransform, public readonly secondary: string) {
    super();
  }

  public static make(model: Model, transform: LookupTransform, counter: number) {
    const sources = model.component.data.sources;
    const s = new SourceNode(transform.from.data);
    let fromSource = sources[s.hash()];
    if (!fromSource) {
      sources[s.hash()] = s;
      fromSource = s;
    }

    const fromOutputName = model.getName(`lookup_${counter}`);
    const fromOutputNode = new OutputNode(fromOutputName, 'lookup');
    fromOutputNode.parent = fromSource;

    model.component.data.outputNodes[fromOutputName] = fromOutputNode;

    return new LookupNode(transform, fromOutputNode.source);
  }

  public assemble(): VgLookupTransform {
    let foreign: Partial<VgLookupTransform>;

    if (this.transform.from.fields) {
      // lookup a few fields and add create a flat output
      foreign = {
        values: this.transform.from.fields,
        ... this.transform.as ? {as: ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as])} : {}
      };
    } else {
      // lookup full record and nest it
      let asName = this.transform.as;
      if (!isString(asName)) {
        log.warn(log.message.NO_FIELDS_NEEDS_AS);
        asName = '_lookup';
      }

      foreign = {
        as: [asName]
      };
    }

    return {
      type: 'lookup',
      from: this.secondary,
      key: this.transform.from.key,
      fields: [this.transform.lookup],
      ...foreign,
      ...(this.transform.default ? {default: this.transform.default} : {})
    };
  }
}

/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(model: Model) {
  let first: DataFlowNode;
  let node: DataFlowNode;
  let previous: DataFlowNode;

  model.transforms.forEach((t, i) => {
    if (!isLookup(t)) {
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

      if (!first) {
        first = node;
      } else {
        node.parent = previous;
      }
      previous = node;
    }
  });

  const last = node;

  return {first, last};
}
