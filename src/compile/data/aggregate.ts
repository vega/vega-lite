import {forEach, isAggregate} from '../../encoding';
import {field, FieldDef} from '../../fielddef';
import * as log from '../../log';
import {Dict, differ, extend, keys, StringSet} from '../../util';
import {VgAggregateTransform} from '../../vega.schema';
import {Model} from './../model';

import {DataFlowNode, DependentNode, NewFieldNode} from './dataflow';

function addDimension(dims: {[field: string]: boolean}, fieldDef: FieldDef) {
  if (fieldDef.bin) {
    dims[field(fieldDef, {binSuffix: 'start'})] = true;
    dims[field(fieldDef, {binSuffix: 'end'})] = true;

    // const scale = model.scale(channel);
    // if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL) {
    // also produce bin_range if the binned field use ordinal scale
    dims[field(fieldDef, {binSuffix: 'range'})] = true;
    // }
  } else {
    dims[field(fieldDef)] = true;
  }
  return dims;
}

function mergeMeasures(parentMeasures: Dict<Dict<boolean>>, childMeasures: Dict<Dict<boolean>>) {
  for (const field in childMeasures) {
    if (childMeasures.hasOwnProperty(field)) {
      // when we merge a measure, we either have to add an aggregation operator or even a new field
      const ops = childMeasures[field];
      for (const op in ops) {
        if (ops.hasOwnProperty(op)) {
          if (field in parentMeasures) {
            // add operator to existing measure field
            parentMeasures[field][op] = true;
          } else {
            parentMeasures[field] = {op: true};
          }
        }
      }
    }
  }
}

export class AggregateNode extends DataFlowNode implements NewFieldNode, DependentNode {
  /** string set for dimensions */
  private dimensions: StringSet;

  /** dictionary mapping field name => dict set of aggregation functions */
  private measures: Dict<StringSet>;

  constructor(model: Model) {
    super();

    let isAggregate = false;
    model.forEachFieldDef(fd => {
      if (fd.aggregate) {
        isAggregate = true;
      }
    });

    const meas = this.measures = {};
    const dims = this.dimensions = {};

    if (!isAggregate) {
      // no need to create this node if the model has no aggregation
      return;
    }

    model.forEachFieldDef((fieldDef, channel) => {
      if (fieldDef.aggregate) {
        if (fieldDef.aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          /* tslint:disable:no-string-literal */
          meas['*']['count'] = true;
          /* tslint:enable:no-string-literal */
        } else {
          meas[fieldDef.field] = meas[fieldDef.field] || {};
          meas[fieldDef.field][fieldDef.aggregate] = true;

          // add min/max so we can use their union as unaggregated domain
          const scale = model.scale(channel);
          if (scale && scale.domain === 'unaggregated') {
            meas[fieldDef.field]['min'] = true;
            meas[fieldDef.field]['max'] = true;
          }
        }
      } else {
        addDimension(dims, fieldDef);
      }
    });
  }

  public hasAggregation() {
    return (Object.keys(this.dimensions).length + Object.keys(this.measures).length) > 0;
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
    const ops: string[] = [];
    const fields: string[] = [];
    keys(this.measures).forEach(field => {
      keys(this.measures[field]).forEach(op => {
        ops.push(op);
        fields.push(field);
      });
    });

    return {
      type: 'aggregate',
      groupby: keys(this.dimensions),
      ops,
      fields
    };
  }
}
