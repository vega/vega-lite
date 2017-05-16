import {forEach} from '../../encoding';
import {field, FieldDef} from '../../fielddef';
import * as log from '../../log';
import {ORDINAL} from '../../type';
import {Dict, differ, duplicate, extend, keys, StringSet} from '../../util';
import {VgAggregateTransform} from '../../vega.schema';
import {UnitModel} from './../unit';

import {Summarize, SummarizeTransform} from '../../transform';
import {Model} from '../model';
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
    return new AggregateNode(extend({}, this.dimensions), duplicate(this.measures), duplicate(this.as));
  }

  /**
   * @param dimensions string set for dimensions
   * @param measures dictionary mapping field name => dict set of aggregation functions
   */
  constructor(private dimensions: StringSet, private measures: Dict<StringSet>, private as: Dict<string>) {
    super();
  }

  public static makeFromEncoding(model: UnitModel): AggregateNode {
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

    return new AggregateNode(dims, meas, {});
  }

  public static makeFromTransform(model: Model, t: SummarizeTransform): AggregateNode {
    const dims = {};
    const meas = {};
    const as = {};
    for(const s of t.summarize) {
      if (s.aggregate) {
        if (s.aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          meas['*']['count'] = true;
          as['*'] = s.as;
        } else {
          meas[s.field] = meas[s.field] || {};
          meas[s.field][s.aggregate] = true;
          as[s.field] = as[s.field] || {};
          as[s.field][s.aggregate] = s.as;
        }
      }
    }

    for(const s of t.groupby) {
      dims[s] = true;
    }

    if ((Object.keys(dims).length + Object.keys(meas).length + Object.keys(as).length)  === 0) {
      return null;
    }

    return new AggregateNode(dims, meas, as);
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
    const as: string[] = [];
    keys(this.measures).forEach(field => {
      keys(this.measures[field]).forEach(op => {
        if (this.as && this.as[field] && this.as[field][op]) {
          as.push(this.as[field][op]);
        }
        ops.push(op);
        fields.push(field);
      });
    });

    let result: VgAggregateTransform = {
      type: 'aggregate',
      groupby: keys(this.dimensions),
      ops,
      fields
    };

    if (as.length !== 0) {
      result = {...result, as};
    }
    return result;
  }
}
