import {AggregateOp, AggregateTransform as VgAggregateTransform} from 'vega';
import {isArgmaxDef, isArgminDef} from '../../aggregate.js';
import {
  Channel,
  getPositionChannelFromLatLong,
  getSecondaryRangeChannel,
  isGeoPositionChannel,
  isScaleChannel,
  isXorY,
} from '../../channel.js';
import {
  binRequiresRange,
  FieldDef,
  getBandPosition,
  hasBandEnd,
  isScaleFieldDef,
  isTypedFieldDef,
  vgField,
} from '../../channeldef.js';
import * as log from '../../log/index.js';
import {isFieldRange} from '../../scale.js';
import {AggregateTransform} from '../../transform.js';
import {Dict, duplicate, hash, keys, replacePathInField, setEqual} from '../../util.js';
import {isUnitModel, ModelWithField} from '../model.js';
import {UnitModel} from '../unit.js';
import {DataFlowNode} from './dataflow.js';
import {isRectBasedMark} from '../../mark.js';
import {OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX} from './timeunit.js';

type Measures = Dict<Partial<Record<AggregateOp, Set<string>>>>;

function addDimension(dims: Set<string>, channel: Channel, fieldDef: FieldDef<string>, model: ModelWithField) {
  const channelDef2 = isUnitModel(model) ? model.encoding[getSecondaryRangeChannel(channel)] : undefined;

  if (
    isTypedFieldDef(fieldDef) &&
    isUnitModel(model) &&
    hasBandEnd(fieldDef, channelDef2, model.markDef, model.config)
  ) {
    dims.add(vgField(fieldDef, {}));
    dims.add(vgField(fieldDef, {suffix: 'end'}));

    const {mark, markDef, config} = model;

    const bandPosition = getBandPosition({fieldDef, markDef, config});

    if (isRectBasedMark(mark) && bandPosition !== 0.5 && isXorY(channel)) {
      dims.add(vgField(fieldDef, {suffix: OFFSETTED_RECT_START_SUFFIX}));
      dims.add(vgField(fieldDef, {suffix: OFFSETTED_RECT_END_SUFFIX}));
    }

    if (fieldDef.bin && binRequiresRange(fieldDef, channel)) {
      dims.add(vgField(fieldDef, {binSuffix: 'range'}));
    }
  } else if (isGeoPositionChannel(channel)) {
    const posChannel = getPositionChannelFromLatLong(channel);
    dims.add(model.getName(posChannel));
  } else {
    dims.add(vgField(fieldDef));
  }
  if (isScaleFieldDef(fieldDef) && isFieldRange(fieldDef.scale?.range)) {
    dims.add(fieldDef.scale.range.field);
  }
  return dims;
}

function mergeMeasures(parentMeasures: Measures, childMeasures: Measures) {
  for (const field of keys(childMeasures)) {
    // when we merge a measure, we either have to add an aggregation operator or even a new field
    const ops = childMeasures[field];
    for (const op of keys(ops)) {
      if (field in parentMeasures) {
        // add operator to existing measure field
        parentMeasures[field][op] = new Set([...(parentMeasures[field][op] ?? []), ...ops[op]]);
      } else {
        parentMeasures[field] = {[op]: ops[op]};
      }
    }
  }
}

export class AggregateNode extends DataFlowNode {
  public clone() {
    return new AggregateNode(null, new Set(this.dimensions), duplicate(this.measures));
  }

  /**
   * @param dimensions string set for dimensions
   * @param measures dictionary mapping field name => dict of aggregation functions and names to use
   */
  constructor(
    parent: DataFlowNode,
    private dimensions: Set<string>,
    private measures: Measures,
  ) {
    super(parent);
  }

  get groupBy() {
    return this.dimensions;
  }

  public static makeFromEncoding(parent: DataFlowNode, model: UnitModel): AggregateNode {
    let isAggregate = false;
    model.forEachFieldDef((fd) => {
      if (fd.aggregate) {
        isAggregate = true;
      }
    });

    const meas: Measures = {};
    const dims = new Set<string>();

    if (!isAggregate) {
      // no need to create this node if the model has no aggregation
      return null;
    }

    model.forEachFieldDef((fieldDef, channel: Channel) => {
      const {aggregate, field} = fieldDef;
      if (aggregate) {
        if (aggregate === 'count') {
          meas['*'] ??= {};
          meas['*']['count'] = new Set([vgField(fieldDef, {forAs: true})]);
        } else {
          if (isArgminDef(aggregate) || isArgmaxDef(aggregate)) {
            const op = isArgminDef(aggregate) ? 'argmin' : 'argmax';
            const argField = (aggregate as any)[op];
            meas[argField] ??= {};
            meas[argField][op] = new Set([vgField({op, field: argField}, {forAs: true})]);
          } else {
            meas[field] ??= {};
            (meas[field] as any)[aggregate] = new Set([vgField(fieldDef, {forAs: true})]);
          }

          // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
          if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
            meas[field] ??= {};
            meas[field]['min'] = new Set([vgField({field, aggregate: 'min'}, {forAs: true})]);
            meas[field]['max'] = new Set([vgField({field, aggregate: 'max'}, {forAs: true})]);
          }
        }
      } else {
        addDimension(dims, channel, fieldDef, model);
      }
    });

    if (dims.size + keys(meas).length === 0) {
      return null;
    }

    return new AggregateNode(parent, dims, meas);
  }

  public static makeFromTransform(parent: DataFlowNode, t: AggregateTransform): AggregateNode {
    const dims = new Set<string>();
    const meas: Measures = {};

    for (const s of t.aggregate) {
      const {op, field, as} = s;
      if (op) {
        if (op === 'count') {
          meas['*'] ??= {};
          meas['*']['count'] = new Set([as ? as : vgField(s, {forAs: true})]);
        } else {
          meas[field] ??= {};
          meas[field][op] ??= new Set();
          meas[field][op].add(as ? as : vgField(s, {forAs: true}));
        }
      }
    }

    for (const s of t.groupby ?? []) {
      dims.add(s);
    }

    if (dims.size + keys(meas).length === 0) {
      return null;
    }

    return new AggregateNode(parent, dims, meas);
  }

  public merge(other: AggregateNode): boolean {
    if (setEqual(this.dimensions, other.dimensions)) {
      mergeMeasures(this.measures, other.measures);
      return true;
    }
    log.debug('different dimensions, cannot merge');
    return false;
  }

  public addDimensions(fields: readonly string[]) {
    fields.forEach(this.dimensions.add, this.dimensions);
  }

  public dependentFields() {
    return new Set([...this.dimensions, ...keys(this.measures)]);
  }

  public producedFields() {
    const out = new Set<string>();

    for (const field of keys(this.measures)) {
      for (const op of keys(this.measures[field])) {
        const m = this.measures[field][op];
        if (m.size === 0) {
          out.add(`${op}_${field}`);
        } else {
          m.forEach(out.add, out);
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
        for (const alias of this.measures[field][op]) {
          as.push(alias);
          ops.push(op);
          fields.push(field === '*' ? null : replacePathInField(field));
        }
      }
    }

    const result: VgAggregateTransform = {
      type: 'aggregate',
      groupby: [...this.dimensions].map(replacePathInField),
      ops,
      fields,
      as,
    };

    return result;
  }
}
