import {isAggregate} from '../../encoding';
import {field, FieldDef} from '../../fielddef';
import * as log from '../../log';
import {ORDINAL} from '../../type';
import {Dict, differ, duplicate, extend, keys, StringSet} from '../../util';
import {VgAggregateTransform} from '../../vega.schema';
import {UnitModel} from './../unit';

import {DataFlowNode} from './dataflow';

function addDimension(dims: {[field: string]: boolean}, fieldDef: FieldDef<string>) {
  if (fieldDef.bin) {
    dims[field(fieldDef, {binSuffix: 'start'})] = true;
    dims[field(fieldDef, {binSuffix: 'end'})] = true;

    // We need the range only when the user explicitly forces a binned field to be ordinal (range used in axis and legend labels).
    // We could check whether the axis or legend exists but that seems overkill. In axes and legends, we check hasDiscreteDomain(scaleType).
    if (fieldDef.type === ORDINAL) {
      dims[field(fieldDef, {binSuffix: 'range'})] = true;
    }
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

export class AggregateNode extends DataFlowNode {
  public clone() {
    return new AggregateNode(extend({}, this.dimensions), duplicate(this.measures));
  }

  /**
   * @param dimensions string set for dimensions
   * @param measures dictionary mapping field name => dict set of aggregation functions
   */
  constructor(private dimensions: StringSet, private measures: Dict<StringSet>) {
    super();
  }

  public static make(model: UnitModel): AggregateNode {
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

    if ((Object.keys(dims).length + Object.keys(meas).length) === 0) {
      return null;
    }

    return new AggregateNode(dims, meas);
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
