import {isArray, isNumber, isString} from 'vega-util';
import {DateTime, isDateTime} from '../../datetime';
import {expression, Filter, isEqualFilter, isOneOfFilter, isRangeFilter} from '../../filter';
import * as log from '../../log';
import {LogicalOperand} from '../../logical';
import {SELECTION_ID} from '../../selection';
import {
  CalculateTransform,
  FilterTransform,
  isBin,
  isCalculate,
  isFilter,
  isLookup,
  isSummarize,
  isTimeUnit,
  LookupTransform,
} from '../../transform';
import {duplicate, keys, StringSet, toSet} from '../../util';
import {VgFilterTransform, VgFormulaTransform, VgIdentifierTransform, VgLookupTransform} from '../../vega.schema';
import {Model} from '../model';
import {ModelWithField} from '../model';
import {requiresSelectionId} from '../selection/selection';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {SourceNode} from './source';
import {TimeUnitNode} from './timeunit';


export class FilterNode extends DataFlowNode {
  private expr: string;
  public clone() {
    return new FilterNode(this.model, duplicate(this.filter));
  }

  constructor(private readonly model: Model, private filter: LogicalOperand<Filter>) {
    super();
    this.expr = expression(this.model, this.filter, this);
  }

  public assemble(): VgFilterTransform {
    return {
      type: 'filter',
      expr: this.expr
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
    const fromOutputNode = new OutputNode(fromOutputName, 'lookup', model.component.data.outputNodeRefCounts);
    fromOutputNode.parent = fromSource;

    model.component.data.outputNodes[fromOutputName] = fromOutputNode;

    return new LookupNode(transform, fromOutputNode.getSource());
  }

  public producedFields(): StringSet {
    return toSet(this.transform.from.fields || ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as]));
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

export class IdentifierNode extends DataFlowNode {
  public clone() {
    return new IdentifierNode();
  }

  constructor() {
    super();
  }

  public producedFields() {
    return {[SELECTION_ID]: true};
  }

  public assemble(): VgIdentifierTransform {
    return {type: 'identifier', as: SELECTION_ID};
  }
}

/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(model: Model) {
  let first: DataFlowNode = null;
  let node: DataFlowNode;
  let previous: DataFlowNode;
  let lookupCounter = 0;

  function insert(newNode: DataFlowNode) {
    if (!first) {
      // A parent may be inserted during node construction
      // (e.g., selection FilterNodes may add a TimeUnitNode).
      first = newNode.parent || newNode;
    } else if (newNode.parent) {
      previous.insertAsParentOf(newNode);
    } else {
      newNode.parent = previous;
    }

    previous = newNode;
  }

  model.transforms.forEach(t => {
    if (isCalculate(t)) {
      node = new CalculateNode(t);
    } else if (isFilter(t)) {
      // Automatically add a parse node for filters with filter objects
      const parse = {};
      const filter = t.filter;
      let val: string | number | boolean | DateTime = null;
      // For EqualFilter, just use the equal property.
      // For RangeFilter and OneOfFilter, all array members should have
      // the same type, so we only use the first one.
      if (isEqualFilter(filter)) {
        val = filter.equal;
      } else if (isRangeFilter(filter)) {
        val = filter.range[0];
      } else if (isOneOfFilter(filter)) {
        val = (filter.oneOf || filter['in'])[0];
      } // else -- for filter expression, we can't infer anything

      if (val) {
        if (isDateTime(val)) {
          parse[filter['field']] = 'date';
        } else if (isNumber(val)) {
          parse[filter['field']] = 'number';
        } else if (isString(val)) {
          parse[filter['field']] = 'string';
        }
      }

      if (keys(parse).length > 0) {
        const parseNode = new ParseNode(parse);
        insert(parseNode);
      }

      node = new FilterNode(model, t.filter);
    } else if (isBin(t)) {
      node = BinNode.makeFromTransform(model, t);
    } else if (isTimeUnit(t)) {
      node = TimeUnitNode.makeFromTransform(model, t);
    } else if (isSummarize(t)) {
      node = AggregateNode.makeFromTransform(model, t);

      if (requiresSelectionId(model)) {
        insert(node);
        node = new IdentifierNode();
      }
    } else if (isLookup(t)) {
      node = LookupNode.make(model, t, lookupCounter++);
    } else {
      log.warn(log.message.invalidTransformIgnored(t));
      return;
    }

    insert(node);
  });

  const last = node;

  return {first, last};
}
