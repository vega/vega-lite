import {array, isObject} from 'vega-util';
import {isLogicalAnd, isLogicalNot, isLogicalOr, LogicalAnd} from '../../logical.js';
import {
  FieldPredicate,
  isFieldGTEPredicate,
  isFieldGTPredicate,
  isFieldLTEPredicate,
  isFieldLTPredicate,
  isFieldOneOfPredicate,
  isFieldRangePredicate,
  isFieldValidPredicate,
} from '../../predicate.js';
import {
  GeoPositionChannel,
  getPositionChannelFromLatLong,
  isGeoPositionChannel,
  isScaleChannel,
  isSingleDefUnitChannel,
  SINGLE_DEF_UNIT_CHANNELS,
  SingleDefUnitChannel,
  TIME,
} from '../../channel.js';
import {vgField} from '../../channeldef.js';
import * as log from '../../log/index.js';
import {hasContinuousDomain} from '../../scale.js';
import {
  PointSelectionConfig,
  SelectionInitIntervalMapping,
  SelectionInitMapping,
  SELECTION_ID,
} from '../../selection.js';
import {Dict, hash, keys, varName, isEmpty} from '../../util.js';
import {TimeUnitComponent, TimeUnitNode} from '../data/timeunit.js';
import {SelectionCompiler} from './index.js';
import {UnitModel} from '../unit.js';
import {assembleProjection} from './assemble.js';
import {isBinnedTimeUnit} from '../../timeunit.js';
export const TUPLE_FIELDS = '_tuple_fields';

/**
 * Whether the selection tuples hold enumerated, ranged, or compared values for a field.
 */
export type TupleStoreType =
  // enumerated
  | 'E'
  // ranged, exclusive, left-right inclusive
  | 'R'
  // ranged, left-inclusive, right-exclusive
  | 'R-RE'
  // comparisons against a single value, used by selections with a predicate
  | 'E-LT'
  | 'E-LTE'
  | 'E-GT'
  | 'E-GTE'
  | 'E-VALID'
  | 'E-ONE';

/**
 * The tuple store type that tests a given field predicate. Each store type
 * matches a comparison `vlSelectionTest` already understands, so the selection
 * store evaluates the predicate itself and no filter expression has to encode
 * it. Evaluating comparisons in the store is what allows a selection to hold a
 * range or a threshold instead of the single value it captured.
 */
export function predicateTupleType(predicate: FieldPredicate): TupleStoreType {
  if (isFieldLTPredicate(predicate)) return 'E-LT';
  if (isFieldLTEPredicate(predicate)) return 'E-LTE';
  if (isFieldGTPredicate(predicate)) return 'E-GT';
  if (isFieldGTEPredicate(predicate)) return 'E-GTE';
  if (isFieldRangePredicate(predicate)) return 'R';
  if (isFieldOneOfPredicate(predicate)) return 'E-ONE';
  if (isFieldValidPredicate(predicate)) return 'E-VALID';
  return 'E';
}

/**
 * Flattens a selection predicate into the list of field predicates it tests.
 * A predicate may be a single field predicate or a flat `and` of them. The
 * store tests a tuple's fields conjunctively, which leaves `or` and `not` with
 * no representation.
 */
export function selectionPredicates(
  predicate: FieldPredicate | LogicalAnd<FieldPredicate>,
): FieldPredicate[] | undefined {
  if (isLogicalAnd(predicate)) {
    const leaves = predicate.and;
    if (leaves.some((p) => !isObject(p) || isLogicalAnd(p) || isLogicalOr(p) || isLogicalNot(p))) {
      return undefined;
    }
    return leaves as FieldPredicate[];
  }
  if (isLogicalOr(predicate) || isLogicalNot(predicate)) {
    return undefined;
  }
  return [predicate as FieldPredicate];
}

/**
 * Rewrites predicate leaves into the forms the selection store can test, or
 * returns undefined for a predicate the store cannot express.
 *
 * A one-sided range becomes the equivalent single comparison, because the
 * store's range test coerces a null bound to zero. A range with neither bound
 * is dropped. Lower bounds (`gt`, `gte`) move ahead of upper bounds
 * (`lt`, `lte`), so a windowed predicate resolves to an ascending
 * `[low, high]` extent when the selection is bound to scales.
 */
export function normalizePredicates(predicates: FieldPredicate[]): FieldPredicate[] {
  const normalized: FieldPredicate[] = [];

  for (const p of predicates) {
    if (isFieldRangePredicate(p) && Array.isArray(p.range)) {
      const [lo, hi] = p.range;
      if (lo != null && hi != null) {
        normalized.push(p);
      } else if (lo != null) {
        normalized.push({field: p.field, ...(p.timeUnit ? {timeUnit: p.timeUnit} : {}), gte: lo} as FieldPredicate);
      } else if (hi != null) {
        normalized.push({field: p.field, ...(p.timeUnit ? {timeUnit: p.timeUnit} : {}), lte: hi} as FieldPredicate);
      }
      // a range with neither bound constrains nothing and is dropped
    } else {
      normalized.push(p);
    }
  }

  const isLower = (p: FieldPredicate) => isFieldGTPredicate(p) || isFieldGTEPredicate(p);
  return [...normalized.filter(isLower), ...normalized.filter((p) => !isLower(p))];
}

export interface SelectionProjection {
  type: TupleStoreType;
  field: string;
  index: number;
  channel?: SingleDefUnitChannel;
  geoChannel?: GeoPositionChannel;
  signals?: {data?: string; visual?: string};
  hasLegend?: boolean;
}

export class SelectionProjectionComponent {
  public hasChannel: Partial<Record<SingleDefUnitChannel, SelectionProjection>>;
  public hasField: Record<string, SelectionProjection>;
  public hasSelectionId: boolean;
  public timeUnit?: TimeUnitNode;
  public items: SelectionProjection[];

  constructor(...items: SelectionProjection[]) {
    this.items = items;
    this.hasChannel = {};
    this.hasField = {};
    this.hasSelectionId = false;
  }
}

/**
 * Whether any value a predicate compares against reads from `datum`.
 */
export function predicateReferencesDatum(predicate: FieldPredicate): boolean {
  return Object.entries(predicate).some(([key, value]) => {
    if (key === 'field' || key === 'timeUnit') return false;
    return /\bdatum\b/.test(JSON.stringify(value ?? null));
  });
}

/**
 * The scale channel a field is encoded on, if any. This lookup passes over the
 * time channel. An animated selection's predicate compares against the
 * animation's own field, so matching that field on the time channel would bind
 * the selection to its own clock instead of to the view that draws the field.
 */
function channelForField(model: UnitModel, field: string): SingleDefUnitChannel | undefined {
  for (const channel of SINGLE_DEF_UNIT_CHANNELS) {
    if (channel === TIME || !isScaleChannel(channel)) continue;
    if (model.fieldDef(channel)?.field === field) {
      return channel;
    }
  }
  return undefined;
}

const project: SelectionCompiler = {
  defined: () => {
    return true; // This transform handles its own defaults, so always run parse.
  },

  parse: (model, selCmpt, selDef) => {
    const name = selCmpt.name;
    const proj = (selCmpt.project ??= new SelectionProjectionComponent());
    const parsed: Dict<SelectionProjection> = {};
    const timeUnits: Dict<TimeUnitComponent> = {};

    const signals = new Set<string>();
    const signalName = (p: SelectionProjection, range: 'data' | 'visual') => {
      const suffix = range === 'visual' ? p.channel : p.field;
      let sg = varName(`${name}_${suffix}`);
      for (let counter = 1; signals.has(sg); counter++) {
        sg = varName(`${name}_${suffix}_${counter}`);
      }
      signals.add(sg);
      return {[range]: sg};
    };

    const type = selCmpt.type;
    const cfg = model.config.selection[type];

    const init =
      selDef.value !== undefined
        ? (array(selDef.value as any) as SelectionInitMapping[] | SelectionInitIntervalMapping[])
        : null;

    /**
     * Aligns an initial value with the projection, positionally. A value may
     * give a channel, give a field, or be a scalar covering every projection.
     */
    const applyInit = () => {
      if (!init) return;
      selCmpt.init = (init as any).map((v: SelectionInitMapping | SelectionInitIntervalMapping) =>
        proj.items.map((p) =>
          isObject(v) ? (v[p.geoChannel || p.channel] !== undefined ? v[p.geoChannel || p.channel] : v[p.field]) : v,
        ),
      );
    };

    // A selection predicate replaces the field and encoding projection. Each of
    // its leaves contributes one tuple field holding a comparison. The
    // projections below deduplicate by field, but these leaves keep duplicates,
    // because a windowed predicate compares the same field twice with `gte` and
    // `lte`, and the store tests tuple fields positionally.
    const predicateDef = ((isObject(selDef.select) ? selDef.select : {}) as PointSelectionConfig).predicate;

    // Parsing copies the raw definition onto the component along with the rest
    // of the selection config. Replace it with the flattened leaves, or drop
    // it, so nothing downstream reads the unvalidated form.
    delete selCmpt.predicate;

    if (predicateDef) {
      const flattened = selectionPredicates(predicateDef);
      const predicates = flattened && normalizePredicates(flattened);

      if (type !== 'point') {
        // An interval selection derives its tuple from the brush extent, and the
        // rest of its compilation needs the channel projection built below. The
        // schema offers `predicate` on point selections and refuses it on
        // interval selections. A spec that reaches here evaded the schema, so
        // warn and keep the projection instead of compiling an unparseable
        // stream.
        log.warn(log.message.SELECTION_PREDICATE_REQUIRES_POINT);
      } else if (!predicates) {
        log.warn(log.message.SELECTION_PREDICATE_COMPOSITION_UNSUPPORTED);
      } else if (!predicates.length) {
        // an empty "and", or one whose only entry was an unbounded range
        log.warn(log.message.SELECTION_PREDICATE_EMPTY);
      } else if (predicates.some((p) => !p.field)) {
        log.warn(log.message.SELECTION_PREDICATE_REQUIRES_FIELD);
      } else if (predicates.some((p) => isFieldValidPredicate(p) && p.valid === false)) {
        // the store's E-VALID test always asks whether the value is valid;
        // it has no way to select the invalid values
        log.warn(log.message.SELECTION_PREDICATE_VALID_FALSE);
      } else {
        // With `nearest`, events are captured on an invisible voronoi overlay
        // whose data are scenegraph items, so `datum` there is the mark item
        // rather than the tuple it was drawn from. A predicate comparing against
        // `datum` would silently read undefined.
        if (selCmpt.nearest && predicates.some(predicateReferencesDatum)) {
          log.warn(log.message.SELECTION_PREDICATE_INCOMPATIBLE_WITH_NEAREST);
        }

        selCmpt.predicate = predicates;

        for (const predicate of predicates) {
          let field = predicate.field;

          // The comparison value applies the timeUnit, so the datum side has
          // to test the same derived field, exactly as the encodings path
          // projects onto `model.vgField` rather than the raw field. The
          // component re-derives the field for views that lack the time unit.
          if (predicate.timeUnit && !isBinnedTimeUnit(predicate.timeUnit)) {
            field = vgField({field: predicate.field, timeUnit: predicate.timeUnit} as any);
            const component = {timeUnit: predicate.timeUnit, as: field, field: predicate.field};
            timeUnits[hash(component)] = component;
          }

          const p: SelectionProjection = {
            field,
            type: predicateTupleType(predicate),
            index: proj.items.length,
          };

          // Record which channel, if any, encodes the compared field. A
          // predicate gives a field where scale binding needs a channel, so
          // the lookup supplies the missing channel.
          const channel = channelForField(model, predicate.field);
          if (channel) {
            p.channel = channel;
            proj.hasChannel[channel] ??= p;
          }

          p.signals = {...signalName(p, 'data')};
          proj.items.push(p);
          proj.hasField[p.field] ??= p;
        }

        // An initial value seeds the store with comparisons already in place,
        // so a predicate selection starts out holding tuples just as a
        // projected selection does.
        applyInit();

        if (!isEmpty(timeUnits)) {
          proj.timeUnit = new TimeUnitNode(null, timeUnits);
        }

        return;
      }
    }

    // If no explicit projection (either fields or encodings) is specified, set some defaults.
    // If an initial value is set, try to infer projections.
    let {fields, encodings} = (isObject(selDef.select) ? selDef.select : {}) as PointSelectionConfig;
    if (!fields && !encodings && init) {
      for (const initVal of init) {
        // initVal may be a scalar value to smoothen varParam -> pointSelection gradient.
        if (!isObject(initVal)) {
          continue;
        }

        for (const key of keys(initVal)) {
          if (isSingleDefUnitChannel(key)) {
            (encodings || (encodings = [])).push(key as SingleDefUnitChannel);
          } else {
            if (type === 'interval') {
              log.warn(log.message.INTERVAL_INITIALIZED_WITH_POS);
              encodings = cfg.encodings;
            } else {
              (fields ??= []).push(key);
            }
          }
        }
      }
    }

    // If no initial value is specified, use the default configuration.
    // We break this out as a separate if block (instead of an else condition)
    // to account for unprojected point selections that have scalar initial values
    if (!fields && !encodings) {
      encodings = cfg.encodings;
      if ('fields' in cfg) {
        fields = cfg.fields;
      }
    }

    for (const channel of encodings ?? []) {
      const fieldDef = model.fieldDef(channel);
      if (fieldDef) {
        let field = fieldDef.field;

        if (fieldDef.aggregate) {
          log.warn(log.message.cannotProjectAggregate(channel, fieldDef.aggregate));
          continue;
        } else if (!field) {
          log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
          continue;
        }

        if (fieldDef.timeUnit && !isBinnedTimeUnit(fieldDef.timeUnit)) {
          field = model.vgField(channel);
          // Construct TimeUnitComponents which will be combined into a
          // TimeUnitNode. This node may need to be inserted into the
          // dataflow if the selection is used across views that do not
          // have these time units defined.
          const component = {
            timeUnit: fieldDef.timeUnit,
            as: field,
            field: fieldDef.field,
          };

          timeUnits[hash(component)] = component;
        }

        // Prevent duplicate projections on the same field.
        // TODO: what if the same field is bound to multiple channels (e.g., SPLOM diag).
        if (!parsed[field]) {
          // Determine whether the tuple will store enumerated or ranged values.
          // Interval selections store ranges for continuous scales, and enumerations otherwise.
          // Single/multi selections store ranges for binned fields, and enumerations otherwise.
          const tplType: TupleStoreType =
            type === 'interval' &&
            isScaleChannel(channel) &&
            hasContinuousDomain(model.getScaleComponent(channel).get('type'))
              ? 'R'
              : fieldDef.bin
                ? 'R-RE'
                : 'E';

          const p: SelectionProjection = {field, channel, type: tplType, index: proj.items.length};
          p.signals = {...signalName(p, 'data'), ...signalName(p, 'visual')};
          proj.items.push((parsed[field] = p));
          proj.hasField[field] = parsed[field];
          proj.hasSelectionId = proj.hasSelectionId || field === SELECTION_ID;

          if (isGeoPositionChannel(channel)) {
            p.geoChannel = channel;
            p.channel = getPositionChannelFromLatLong(channel);
            proj.hasChannel[p.channel] = parsed[field];
          } else {
            proj.hasChannel[channel] = parsed[field];
          }
        }
      } else {
        log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
      }
    }

    for (const field of fields ?? []) {
      if (proj.hasField[field]) continue;
      const p: SelectionProjection = {type: 'E', field, index: proj.items.length};
      p.signals = {...signalName(p, 'data')};
      proj.items.push(p);
      proj.hasField[field] = p;
      proj.hasSelectionId = proj.hasSelectionId || field === SELECTION_ID;
    }

    // Selections can be initialized either with a full object that maps projections to values
    // or scalar values to smoothen the abstraction gradient from variable params to point selections.
    applyInit();

    if (!isEmpty(timeUnits)) {
      proj.timeUnit = new TimeUnitNode(null, timeUnits);
    }
  },

  signals: (model, selCmpt, allSignals) => {
    const name = selCmpt.name + TUPLE_FIELDS;
    const hasSignal = allSignals.filter((s) => s.name === name);
    return hasSignal.length > 0 || selCmpt.project.hasSelectionId
      ? allSignals
      : allSignals.concat({
          name,
          value: selCmpt.project.items.map(assembleProjection),
        });
  },
};

export default project;
