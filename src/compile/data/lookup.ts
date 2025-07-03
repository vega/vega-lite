import {LookupTransform as VgLookupTransform} from 'vega';
import {array, isString} from 'vega-util';
import * as log from '../../log/index.js';
import {isLookupData, isLookupSelection, LookupTransform} from '../../transform.js';
import {duplicate, hash, varName} from '../../util.js';
import {Model} from '../model.js';
import {DataFlowNode, OutputNode} from './dataflow.js';
import {findSource} from './parse.js';
import {SourceNode} from './source.js';
import {DataSourceType} from '../../data.js';

export class LookupNode extends DataFlowNode {
  public clone() {
    return new LookupNode(null, duplicate(this.transform), this.secondary);
  }

  constructor(
    parent: DataFlowNode,
    public readonly transform: LookupTransform,
    public readonly secondary: string,
  ) {
    super(parent);
  }

  public static make(parent: DataFlowNode, model: Model, transform: LookupTransform, counter: number) {
    const sources = model.component.data.sources;
    const {from} = transform;
    let fromOutputNode = null;

    if (isLookupData(from)) {
      let fromSource = findSource(from.data, sources);

      if (!fromSource) {
        fromSource = new SourceNode(from.data);
        sources.push(fromSource);
      }

      const fromOutputName = model.getName(`lookup_${counter}`);
      fromOutputNode = new OutputNode(
        fromSource,
        fromOutputName,
        DataSourceType.Lookup,
        model.component.data.outputNodeRefCounts,
      );
      model.component.data.outputNodes[fromOutputName] = fromOutputNode;
    } else if (isLookupSelection(from)) {
      const selName = from.param;
      transform = {as: selName, ...transform};
      let selCmpt;

      try {
        selCmpt = model.getSelectionComponent(varName(selName), selName);
      } catch {
        throw new Error(log.message.cannotLookupVariableParameter(selName));
      }

      fromOutputNode = selCmpt.materialized;
      if (!fromOutputNode) {
        throw new Error(log.message.noSameUnitLookup(selName));
      }
    }

    return new LookupNode(parent, transform, fromOutputNode.getSource());
  }

  public dependentFields() {
    return new Set([this.transform.lookup]);
  }

  public producedFields() {
    return new Set(this.transform.as ? array(this.transform.as) : this.transform.from.fields);
  }

  public hash() {
    return `Lookup ${hash({transform: this.transform, secondary: this.secondary})}`;
  }

  public assemble(): VgLookupTransform {
    let foreign: Partial<VgLookupTransform>;

    if (this.transform.from.fields) {
      // lookup a few fields and add create a flat output
      foreign = {
        values: this.transform.from.fields,
        ...(this.transform.as ? {as: array(this.transform.as)} : {}),
      };
    } else {
      // lookup full record and nest it
      let asName = this.transform.as;
      if (!isString(asName)) {
        log.warn(log.message.NO_FIELDS_NEEDS_AS);
        asName = '_lookup';
      }

      foreign = {
        as: [asName],
      };
    }

    return {
      type: 'lookup',
      from: this.secondary,
      key: this.transform.from.key,
      fields: [this.transform.lookup],
      ...foreign,
      ...(this.transform.default ? {default: this.transform.default} : {}),
    };
  }
}
