import {AggregateOp} from '../../aggregate';
import {isScaleChannel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import * as log from '../../log';
import {SummarizeTransform} from '../../transform';
import {NOMINAL, ORDINAL} from '../../type';
import {Dict, differ, duplicate, extend, keys, StringSet} from '../../util';
import {VgAggregateTransform} from '../../vega.schema';
import {UnitModel} from './../unit';
import {DataFlowNode} from './dataflow';


function addDimension(dims: {[field: string]: boolean}, fieldDef: FieldDef<string>) {
  if (fieldDef.bin) {
    dims[field(fieldDef, {})] = true;
    dims[field(fieldDef, {binSuffix: 'end'})] = true;

    // We need the range only when the user explicitly forces a binned field to be ordinal (range used in axis and legend labels).
    // We could check whether the axis or legend exists but that seems overkill. In axes and legends, we check hasDiscreteDomain(scaleType).
    if (fieldDef.type === ORDINAL || fieldDef.type === NOMINAL) {
      dims[field(fieldDef, {binSuffix: 'range'})] = true;
    }
  } else {
    dims[field(fieldDef)] = true;
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
    return new AggregateNode(extend({}, this.dimensions), duplicate(this.measures));
  }

  /**
   * @param dimensions string set for dimensions
   * @param measures dictionary mapping field name => dict of aggregation functions and names to use
   */
  constructor(private dimensions: StringSet, private measures: Dict<Dict<string>>) {
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
          meas['*']['count'] = field(fieldDef, {aggregate: 'count'});
        } else {
          meas[fieldDef.field] = meas[fieldDef.field] || {};
          meas[fieldDef.field][fieldDef.aggregate] = field(fieldDef);

          // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
          if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
            meas[fieldDef.field]['min'] = field(fieldDef, {aggregate: 'min'});
            meas[fieldDef.field]['max'] = field(fieldDef, {aggregate: 'max'});
          }
        }
      } else {
        addDimension(dims, fieldDef);
      }
    });

    if ((keys(dims).length + keys(meas).length) === 0) {
      return null;
    }

    return new AggregateNode(dims, meas);
  }

  public static makeFromTransform(t: SummarizeTransform): AggregateNode {
    const dims = {};
    const meas = {};
    for(const s of t.summarize) {
      if (s.aggregate) {
        if (s.aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          meas['*']['count'] = s.as || field(s);
        } else {
          meas[s.field] = meas[s.field] || {};
          meas[s.field][s.aggregate] = s.as || field(s);
        }
      }
    }

    for(const s of t.groupby) {
      dims[s] = true;
    }

    if ((keys(dims).length + keys(meas).length)  === 0) {
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
    const ops: AggregateOp[] = [];
    const fields: string[] = [];
    const as: string[] = [];
    keys(this.measures).forEach(field => {
      keys(this.measures[field]).forEach((op: AggregateOp) => {
        as.push(this.measures[field][op]);
        ops.push(op);
        fields.push(field);
      });
    });

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
