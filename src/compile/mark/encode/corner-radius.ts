import type {SignalRef} from 'vega';
import {stringValue} from 'vega-util';
import type {Mark, MarkDef} from '../../../mark.js';
import {flatAccessWithDatum} from '../../../util.js';
import {VgEncodeEntry, VgValueRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';

type CornerRadius =
  'cornerRadiusTopLeft' | 'cornerRadiusTopRight' | 'cornerRadiusBottomLeft' | 'cornerRadiusBottomRight';
export type CornerRadiusEnd = NonNullable<MarkDef<Mark, SignalRef>['cornerRadiusEnd']>;

interface StackedBarCornerRadiusFields {
  minStart: string;
  maxStart: string;
  minEnd: string;
  maxEnd: string;
}

export function cornerRadiusEnd(model: UnitModel, encodeEntry: VgEncodeEntry): VgEncodeEntry {
  const {markDef, config, encoding} = model;
  const radius = getMarkPropOrConfig('cornerRadiusEnd', markDef, config);
  if (markDef.type !== 'bar' || radius === undefined || !markDef.orient) {
    return {};
  }

  // Check the original encoding because non-ranged bars also compile to x/x2 or y/y2 endpoints.
  const isRanged = markDef.orient === 'horizontal' ? encoding.x2 : encoding.y2;
  if (isRanged) {
    // Both ends of a ranged bar cap a value, so round every corner —
    // unless a mark-level cornerRadius beats a config-level cornerRadiusEnd.
    if (markDef.cornerRadiusEnd === undefined && markDef.cornerRadius !== undefined) {
      return {};
    }
    return {cornerRadius: signalOrValueRef(radius)};
  }

  // Compare rendered positions so negative values and reversed scales round the correct end.
  if (markDef.orient === 'horizontal') {
    const x = positionRefToExpr(encodeEntry.x);
    const x2 = positionRefToExpr(encodeEntry.x2);
    return x && x2 ? horizontalCornerRadius(model, radius, `${x} > ${x2}`, `${x} < ${x2}`) : {};
  } else {
    const y = positionRefToExpr(encodeEntry.y);
    const y2 = positionRefToExpr(encodeEntry.y2);
    // Vega's y coordinates increase downward, so the top end has the smaller position.
    return y && y2 ? verticalCornerRadius(model, radius, `${y} < ${y2}`, `${y} > ${y2}`) : {};
  }
}

export function cornerRadiusEndForStackedBar(
  model: UnitModel,
  radius: CornerRadiusEnd | undefined,
  scaleName: string,
  fields: StackedBarCornerRadiusFields,
): VgEncodeEntry {
  if (radius === undefined) {
    return {};
  }

  // Rounded stacks use generated min/max fields for the outer negative and positive boundaries.
  const minStart = scaledFieldExpr(scaleName, fields.minStart);
  const maxStart = scaledFieldExpr(scaleName, fields.maxStart);
  const minEnd = scaledFieldExpr(scaleName, fields.minEnd);
  const maxEnd = scaledFieldExpr(scaleName, fields.maxEnd);

  if (model.stack.fieldChannel === 'x') {
    return horizontalCornerRadius(model, radius, `${maxEnd} > ${maxStart}`, `${minEnd} < ${minStart}`);
  } else {
    return verticalCornerRadius(model, radius, `${maxEnd} < ${maxStart}`, `${minEnd} > ${minStart}`);
  }
}

function horizontalCornerRadius(
  model: UnitModel,
  radius: CornerRadiusEnd,
  rightEndTest: string,
  leftEndTest: string,
): VgEncodeEntry {
  return {
    ...conditionalCornerRadius(model, ['cornerRadiusTopRight', 'cornerRadiusBottomRight'], rightEndTest, radius),
    ...conditionalCornerRadius(model, ['cornerRadiusTopLeft', 'cornerRadiusBottomLeft'], leftEndTest, radius),
  };
}

function verticalCornerRadius(
  model: UnitModel,
  radius: CornerRadiusEnd,
  topEndTest: string,
  bottomEndTest: string,
): VgEncodeEntry {
  return {
    ...conditionalCornerRadius(model, ['cornerRadiusTopLeft', 'cornerRadiusTopRight'], topEndTest, radius),
    ...conditionalCornerRadius(model, ['cornerRadiusBottomLeft', 'cornerRadiusBottomRight'], bottomEndTest, radius),
  };
}

function conditionalCornerRadius(
  model: UnitModel,
  corners: CornerRadius[],
  test: string,
  radius: CornerRadiusEnd,
): VgEncodeEntry {
  const {markDef, config} = model;
  const valueRef = signalOrValueRef(radius);
  // Mark properties beat config properties, so a config-level cornerRadiusEnd
  // must not override corner radii from the mark definition.
  const specifiedEnd = markDef.cornerRadiusEnd !== undefined;
  return corners.reduce<VgEncodeEntry>((encode, corner) => {
    if (!specifiedEnd && (markDef[corner] !== undefined || markDef.cornerRadius !== undefined)) {
      return encode;
    }
    // At the non-value end, fall back to the corner's own radius so cornerRadiusEnd only overrides the value end.
    const fallback =
      getMarkPropOrConfig(corner, markDef, config) ?? getMarkPropOrConfig('cornerRadius', markDef, config) ?? 0;
    encode[corner] = [{test, ...valueRef}, signalOrValueRef(fallback)];
    return encode;
  }, {});
}

function positionRefToExpr(ref: VgEncodeEntry['x']): string | undefined {
  if (Array.isArray(ref)) {
    // Conditional position encodings keep their unconditional fallback last.
    ref = ref[ref.length - 1];
  }
  return ref ? valueRefToExpr(ref) : undefined;
}

function valueRefToExpr(ref: VgValueRef): string | undefined {
  let expr: string | undefined;

  if (ref.scale) {
    const scaledValue = scaledValueRefToExpr(ref);
    if (scaledValue === undefined) {
      return undefined;
    }
    expr = `scale(${stringValue(ref.scale)}, ${scaledValue})`;
  } else if (ref.signal) {
    expr = `(${ref.signal})`;
  } else if (ref.field !== undefined) {
    expr = fieldRefToExpr(ref.field);
  } else if (ref.value !== undefined) {
    expr = stringValue(ref.value);
  }

  if (expr === undefined) {
    return undefined;
  }

  if (ref.mult !== undefined) {
    expr = `${ref.mult} * (${expr})`;
  }

  if (ref.offset !== undefined) {
    const offset = typeof ref.offset === 'number' ? stringValue(ref.offset) : valueRefToExpr(ref.offset);
    if (offset) {
      expr = `${expr} + ${offset}`;
    }
  }

  return expr;
}

function scaledValueRefToExpr(ref: VgValueRef): string | undefined {
  if (ref.signal) {
    return ref.signal;
  } else if (ref.field !== undefined) {
    return fieldRefToExpr(ref.field);
  } else if (ref.value !== undefined) {
    return stringValue(ref.value);
  }
  return undefined;
}

function fieldRefToExpr(field: NonNullable<VgValueRef['field']>): string | undefined {
  if (typeof field === 'string') {
    return flatAccessWithDatum(field);
  } else if (field.datum) {
    return flatAccessWithDatum(field.datum, 'datum');
  } else if (field.parent) {
    return flatAccessWithDatum(field.parent, 'parent');
  }
  return undefined;
}

function scaledFieldExpr(scaleName: string, field: string): string {
  return `scale(${stringValue(scaleName)}, ${flatAccessWithDatum(field)})`;
}
