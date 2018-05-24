import {AggregateOp} from 'vega';

import {Channel, isScaleChannel} from '../../channel';
import {FieldDef, vgField} from '../../fielddef';
import * as log from '../../log';
import {AggregateTransform} from '../../transform';
import {Dict, differ, duplicate, keys, StringSet} from '../../util';
import {VgAggregateTransform} from '../../vega.schema';
import {binRequiresRange} from '../common';
import {UnitModel} from './../unit';
import {DataFlowNode} from './dataflow';

function addDimension(dims: {[field: string]: boolean}, channel: Channel, fieldDef: FieldDef<string>) {
  if (fieldDef.bin) {
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

function mergeMeasures(parentMeasures: Dict<Dict<string>>, childMeasures: Dict<Dict<string>>) {
  for (const f in childMeasures) {
    if (childMeasures.hasOwnProperty(f)) {
      // when we merge a measure, we either have to add an aggregation operator or even a new field
      const ops = childMeasures[f];
      for (const op in ops) {
        if (ops.hasOwnProperty(op)) {
          if (f in parentMeasures) {
            // add operator to existing measure field
            parentMeasures[f][op] = ops[op];
          } else {
            parentMeasures[f] = {op: ops[op]};
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
  constructor(parent: DataFlowNode, private dimensions: StringSet, private measures: Dict<{[key in AggregateOp]?: string}>) {
    super(parent);
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
          meas['*']['count'] = vgField(fieldDef);
        } else {
          meas[field] = meas[field] || {};
          meas[field][aggregate] = vgField(fieldDef);

          // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
          if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
            meas[field]['min'] = vgField({field, aggregate: 'min'});
            meas[field]['max'] = vgField({field, aggregate: 'max'});
          }
        }
      } else {
        addDimension(dims, channel, fieldDef);
      }
    });

    if ((keys(dims).length + keys(meas).length) === 0) {
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
          meas['*']['count'] = as || vgField(s);
        } else {
          meas[field] = meas[field] || {};
          meas[field][op] = as || vgField(s);
        }
      }
    }

    for (const s of t.groupby || []) {
      dims[s] = true;
    }

    if ((keys(dims).length + keys(meas).length) === 0) {
      return null;
    }

    return new AggregateNode(parent, dims, meas);
  }

  public merge(other: AggregateNode) {
    if (!differ(this.dimensions, other.dimensions)) {
      mergeMeasures(this.measures, other.measures);
      other.remove();
    } else {
      log.debug('different dimensions, cannot merge');
    }
  }

  public addDimensions(fields: string[]) {
    fields.forEach(f => this.dimensions[f] = true);
  }

  public dependentFields() {
    const out = {};

    keys(this.dimensions).forEach(f => out[f] = true);
    keys(this.measures).forEach(m => out[m] = true);

    return out;
  }

  public producedFields() {
    const out = {};

    keys(this.measures).forEach(field => {
      keys(this.measures[field]).forEach(op => {
        out[`${op}_${field}`] = true;
      });
    });

    return out;
  }

  public assemble(): VgAggregateTransform {
    const ops: AggregateOp[] = [];
    const fields: string[] = [];
    const as: string[] = [];

    for (const field of keys(this.measures)) {
      for (const op of keys(this.measures[field])) {
        as.push(this.measures[field][op]);
        ops.push(op);
        fields.push(field);
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
