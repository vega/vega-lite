import {AggregateOp} from 'vega';
import {isBinning} from '../../bin';
import {Channel, isScaleChannel} from '../../channel';
import {FieldDef, vgField} from '../../fielddef';
import * as log from '../../log';
import {AggregateTransform} from '../../transform';
import {Dict, duplicate, hash, isEqual, keys, replacePathInField, StringSet} from '../../util';
import {VgAggregateTransform} from '../../vega.schema';
import {binRequiresRange} from '../common';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

function addDimension(dims: {[field: string]: boolean}, channel: Channel, fieldDef: FieldDef<string>) {
  if (isBinning(fieldDef.bin)) {
    dims[vgField(fieldDef, {})] = true;
    dims[vgField(fieldDef, {binSuffix: 'end'})] = true;

    if (binRequiresRange(fieldDef, channel)) {
      dims[vgField(fieldDef, {binSuffix: 'range'})] = true;
    }
  } else {
    dims[vgField(fieldDef)] = true;
  }
  return dims;
}

function mergeMeasures(parentMeasures: Dict<Dict<StringSet>>, childMeasures: Dict<Dict<StringSet>>) {
  for (const field in childMeasures) {
    if (childMeasures.hasOwnProperty(field)) {
      // when we merge a measure, we either have to add an aggregation operator or even a new field
      const ops = childMeasures[field];
      for (const op in ops) {
        if (ops.hasOwnProperty(op)) {
          if (field in parentMeasures) {
            // add operator to existing measure field
            parentMeasures[field][op] = {...parentMeasures[field][op], ...ops[op]};
          } else {
            parentMeasures[field] = {[op]: ops[op]};
          }
        }
      }
    }
  }
}

export class AggregateNode extends DataFlowNode {
  public clone() {
    return new AggregateNode(null, {...this.dimensions}, duplicate(this.measures));
  }

  /**
   * @param dimensions string set for dimensions
   * @param measures dictionary mapping field name => dict of aggregation functions and names to use
   */
  constructor(
    parent: DataFlowNode,
    private dimensions: StringSet,
    private measures: Dict<{[key in AggregateOp]?: StringSet}>
  ) {
    super(parent);
  }

  get groupBy(): StringSet {
    return this.dimensions;
  }

  public static makeFromEncoding(parent: DataFlowNode, model: UnitModel): AggregateNode {
    let isAggregate = false;
    model.forEachFieldDef(fd => {
      if (fd.aggregate) {
        isAggregate = true;
      }
    });

    const meas = {};
    const dims = {};

    if (!isAggregate) {
      // no need to create this node if the model has no aggregation
      return null;
    }

    model.forEachFieldDef((fieldDef, channel) => {
      const {aggregate, field} = fieldDef;
      if (aggregate) {
        if (aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          meas['*']['count'] = {[vgField(fieldDef, {forAs: true})]: true};
        } else {
          meas[field] = meas[field] || {};
          meas[field][aggregate] = {[vgField(fieldDef, {forAs: true})]: true};

          // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
          if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
            meas[field]['min'] = {[vgField({field, aggregate: 'min'}, {forAs: true})]: true};
            meas[field]['max'] = {[vgField({field, aggregate: 'max'}, {forAs: true})]: true};
          }
        }
      } else {
        addDimension(dims, channel, fieldDef);
      }
    });

    if (keys(dims).length + keys(meas).length === 0) {
      return null;
    }

    return new AggregateNode(parent, dims, meas);
  }

  public static makeFromTransform(parent: DataFlowNode, t: AggregateTransform): AggregateNode {
    const dims = {};
    const meas = {};

    for (const s of t.aggregate) {
      const {op, field, as} = s;
      if (op) {
        if (op === 'count') {
          meas['*'] = meas['*'] || {};
          meas['*']['count'] = {[as]: true} || {[vgField(s, {forAs: true})]: true};
        } else {
          meas[field] = meas[field] || {};
          meas[field][op] = {[as]: true} || {[vgField(s, {forAs: true})]: true};
        }
      }
    }

    for (const s of t.groupby || []) {
      dims[s] = true;
    }

    if (keys(dims).length + keys(meas).length === 0) {
      return null;
    }

    return new AggregateNode(parent, dims, meas);
  }

  public merge(other: AggregateNode): boolean {
    if (isEqual(this.dimensions, other.dimensions)) {
      mergeMeasures(this.measures, other.measures);
      return true;
    } else {
      log.debug('different dimensions, cannot merge');
      return false;
    }
  }

  public addDimensions(fields: string[]) {
    fields.forEach(f => (this.dimensions[f] = true));
  }

  public dependentFields() {
    const out = {};

    keys(this.dimensions).forEach(f => (out[f] = true));
    keys(this.measures).forEach(m => (out[m] = true));

    return out;
  }

  public producedFields() {
    let out = {};

    for (const field of keys(this.measures)) {
      for (const op of keys(this.measures[field])) {
        if (keys(this.measures[field][op]).length === 0) {
          out[`${op}_${field}`] = true;
        } else {
          out = {...out, ...this.measures[field][op]};
        }
      }
    }

    return out;
  }

  public hash() {
    return `Aggregate ${hash({dimensions: this.dimensions, measures: this.measures})}`;
  }

  public assemble(): VgAggregateTransform {
    const ops: AggregateOp[] = [];
    const fields: string[] = [];
    const as: string[] = [];

    for (const field of keys(this.measures)) {
      for (const op of keys(this.measures[field])) {
        for (const alias of keys(this.measures[field][op])) {
          as.push(alias);
          ops.push(op);
          fields.push(replacePathInField(field));
        }
      }
    }

    const result: VgAggregateTransform = {
      type: 'aggregate',
      groupby: keys(this.dimensions),
      ops,
      fields,
      as
    };

    return result;
  }
}
