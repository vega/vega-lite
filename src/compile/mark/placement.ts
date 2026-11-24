import type {LabelTransform, SignalRef} from 'vega';
import {array, isArray, isObject, isString} from 'vega-util';
import * as log from '../../log/index.js';
import {isPlacementMarkSelector, isTextPlacementEnabled, TextPlacement} from '../../placement.js';
import {unique} from '../../util.js';
import {getMarkConfig} from '../common.js';
import {isLayerModel, isUnitModel, Model} from '../model.js';
import type {UnitModel} from '../unit.js';

const PLACEMENT_BASE_SUFFIX = 'placement_base';

// The label transform positions each label and writes these, so values from the spec would be overwritten.
const IGNORED_MARK_PROPERTIES = ['align', 'baseline', 'angle', 'radius', 'theta'] as const;
const IGNORED_ENCODE_CHANNELS = ['x', 'y', 'xc', 'yc', 'x2', 'y2', 'align', 'baseline', 'angle', 'radius', 'theta'];

export interface PlacementMarks {
  base: any;
  placed: any;
  placement: TextPlacement;
}

/**
 * The placement of a text unit: its own `placement` merged over `config.text.placement`.
 * Config only supplies defaults, so placement stays off unless the mark sets it.
 */
export function getTextPlacement(model: UnitModel): TextPlacement | undefined {
  const {markDef, config} = model;
  if (!isTextPlacementEnabled(markDef.placement)) {
    return undefined;
  }
  if (model.mark !== 'text') {
    log.warn(log.message.placementOnlyForText(model.mark));
    return undefined;
  }
  const configPlacement = config.text?.placement;
  return {
    ...(isObject(configPlacement) ? configPlacement : {}),
    ...(isObject(markDef.placement) ? markDef.placement : {}),
  };
}

/**
 * Replaces the compiled text mark of a unit with `placement` by two marks: a hidden base at each data point,
 * and the visible labels, which read the base items and run the Vega label transform.
 * `avoidMarks` is filled in later by `assemblePlacementAvoidMarks`, once every layer of the view is assembled.
 */
export function assembleTextPlacementMarks(model: UnitModel, marks: any[]): any[] {
  const placement = getTextPlacement(model);
  if (!placement) {
    return marks;
  }
  const markName = model.getName('marks');
  const index = marks.findIndex((m) => m.name === markName);
  if (index < 0) {
    return marks;
  }
  const mark = marks[index];
  const update = mark.encode?.update ?? {};

  for (const prop of IGNORED_MARK_PROPERTIES) {
    if (model.markDef[prop] !== undefined || (model.encoding as any)[prop] !== undefined) {
      log.warn(log.message.placementIgnoresProperty(prop));
    }
  }

  const dx = update.dx ?? valueRef(getMarkConfig('dx', model.markDef, model.config));
  const dy = update.dy ?? valueRef(getMarkConfig('dy', model.markDef, model.config));

  const base = {
    name: model.getName(PLACEMENT_BASE_SUFFIX),
    type: 'symbol',
    interactive: false,
    aria: false,
    ...(mark.key ? {key: mark.key} : {}),
    ...(mark.sort ? {sort: mark.sort} : {}),
    from: mark.from,
    encode: {
      update: {
        x: withOffset(update.x ?? update.xc, dx),
        y: withOffset(update.y ?? update.yc, dy),
        size: {value: 0},
        opacity: {value: 0},
      },
    },
  };

  const placedUpdate: Record<string, any> = {};
  for (const [channel, ref] of Object.entries(update)) {
    if (!IGNORED_ENCODE_CHANNELS.includes(channel) && channel !== 'dx' && channel !== 'dy') {
      placedUpdate[channel] = rebaseOntoItemDatum(ref);
    }
  }
  // The transform hides labels that fit nowhere by setting `opacity`, but it does not re-run when only the encoding
  // changes (for example, on a selection). So an `opacity` rule would bring hidden labels back.
  if (placedUpdate.opacity) {
    if (placedUpdate.fillOpacity) {
      log.warn(log.message.placementDropsOpacity());
    } else {
      placedUpdate.fillOpacity = placedUpdate.opacity;
    }
    delete placedUpdate.opacity;
  }
  // Applying dx/dy after placement would draw labels away from where the transform checked them.
  placedUpdate.dx = {value: 0};
  placedUpdate.dy = {value: 0};

  const {key: _key, sort: _sort, from: _from, encode: _encode, ...markProps} = mark;
  const placed = {
    ...markProps,
    type: 'text',
    from: {data: base.name},
    encode: {update: placedUpdate},
    transform: [makeLabelTransform(model, placement)],
  };

  model.placementMarks = {base, placed, placement};
  return [...marks.slice(0, index), base, placed, ...marks.slice(index + 1)];
}

function makeLabelTransform(model: UnitModel, placement: TextPlacement): LabelTransform {
  const {anchor, offset, padding, sort} = placement;
  const width = model.getSizeSignalRef('width')?.signal ?? 'width';
  const height = model.getSizeSignalRef('height')?.signal ?? 'height';
  return {
    type: 'label',
    size: {signal: `[${width}, ${height}]`},
    avoidBaseMark: false,
    ...(anchor ? {anchor} : {}),
    ...(offset !== undefined ? {offset: [...array(offset)]} : {}),
    ...(padding !== undefined ? {padding} : {}),
    ...(sort ? {sort: {field: `datum.${sort.field}`, ...(sort.order ? {order: sort.order} : {})}} : {}),
  };
}

function valueRef(value: unknown) {
  if (value === undefined) {
    return undefined;
  }
  return isObject(value) && 'signal' in value ? value : {value};
}

function refToExpr(ref: any): string {
  if (isObject(ref) && 'signal' in ref) {
    return `(${(ref as SignalRef).signal})`;
  }
  return `${isObject(ref) ? (ref as any).value : ref}`;
}

/** Adds a `dx`/`dy` value ref to a position value ref, combining it with any existing `offset`. */
function withOffset(ref: any, delta: any): any {
  if (delta === undefined || ref === undefined) {
    return ref;
  }
  if (isArray(ref)) {
    return ref.map((r) => withOffset(r, delta));
  }
  const {offset} = ref;
  if (offset === undefined) {
    return {...ref, offset: delta};
  }
  return {...ref, offset: {signal: `${refToExpr(offset)} + ${refToExpr(delta)}`}};
}

/**
 * The placed mark reads the base mark's items, which keep the data row under `datum`.
 * So data field references move one level down: `datum.a` becomes `datum.datum.a`.
 */
function rebaseOntoItemDatum(ref: any): any {
  if (isArray(ref)) {
    return ref.map(rebaseOntoItemDatum);
  }
  if (!isObject(ref)) {
    return ref;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(ref)) {
    if (key === 'field' && isString(value)) {
      result[key] = `datum.${value}`;
    } else if ((key === 'signal' || key === 'test') && isString(value)) {
      result[key] = value.replace(/\bdatum\b/g, 'datum.datum');
    } else if (key === 'value' || key === 'scale') {
      result[key] = value;
    } else {
      result[key] = rebaseOntoItemDatum(value);
    }
  }
  return result;
}

interface UnitMarkInfo {
  unit: UnitModel;
  /** Names of the unit and every enclosing view up to the root view. */
  viewNames: string[];
}

function collectUnits(model: Model, viewNames: string[], out: UnitMarkInfo[]) {
  const names = [...viewNames, model.name];
  if (isUnitModel(model)) {
    out.push({unit: model, viewNames: names});
  } else if (isLayerModel(model)) {
    for (const child of model.children) {
      collectUnits(child, names, out);
    }
  }
}

/** The names other labels can avoid: the outermost named Vega marks of the unit. */
function avoidableMarkNames(unit: UnitModel): string[] {
  if (unit.placementMarks) {
    return [unit.placementMarks.placed.name];
  }
  const names = (unit.component.mark ?? []).map((m: any) => m.name).filter((n: string) => n);
  if (names.length === 0) {
    log.warn(log.message.placementAvoidUnnamedMark(unit.mark));
  }
  return names;
}

/**
 * For the root view of a layered (or single) view, resolves each placement layer's `avoid` selectors to compiled
 * mark names, and moves the placed labels after every other mark, because Vega resolves `avoidMarks` at parse time.
 * Placement layers always avoid labels of earlier placement layers, so earlier layers win.
 */
export function assemblePlacementAvoidMarks(root: Model, marks: any[]): any[] {
  const units: UnitMarkInfo[] = [];
  collectUnits(root, [], units);
  const placementUnits = units.filter(({unit}) => unit.placementMarks);
  if (placementUnits.length === 0) {
    return marks;
  }

  placementUnits.forEach(({unit}, placementIndex) => {
    const {placement, placed} = unit.placementMarks;
    const laterPlacementUnits = new Set(placementUnits.slice(placementIndex + 1).map((u) => u.unit));
    const candidates = units.filter(({unit: other}) => other !== unit && !laterPlacementUnits.has(other));

    const avoided = new Set<UnitModel>(
      placementUnits.slice(0, placementIndex).map((u) => u.unit), // earlier labels always win
    );
    for (const selector of placement.avoid ?? []) {
      for (const candidate of candidates) {
        const matches = isPlacementMarkSelector(selector)
          ? array(selector.mark).includes(candidate.unit.mark)
          : selector.views.some((name) => candidate.viewNames.includes(name));
        if (matches) {
          avoided.add(candidate.unit);
        }
      }
    }
    const avoidMarks = unique(
      units.filter(({unit: u}) => avoided.has(u)).flatMap(({unit: u}) => avoidableMarkNames(u)),
      (name) => name,
    );
    if (avoidMarks.length > 0) {
      placed.transform[0].avoidMarks = avoidMarks;
    }
  });

  const placedMarks = new Set(placementUnits.map(({unit}) => unit.placementMarks.placed));
  return [...marks.filter((m) => !placedMarks.has(m)), ...marks.filter((m) => placedMarks.has(m))];
}
