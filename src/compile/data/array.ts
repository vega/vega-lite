import {COLOR} from '../../channel.js';
import {FieldRefOption, getFieldOrDatumDef, isFieldDef, TypedFieldDef, vgField} from '../../channeldef.js';
import {internalField} from '../../util.js';
import {UnitModel} from '../unit.js';
import {CalculateNode} from './calculate.js';
import {DataFlowNode} from './dataflow.js';

/**
 * Field holding the sanitized raster grid handed to Vega's heatmap transform.
 */
export const ARRAY_GRID_FIELD = internalField('array_grid');

/**
 * Name of the derived field holding one end of a raster grid's real value range.
 */
export function arrayExtentField(
  fieldDef: TypedFieldDef<string>,
  extreme: 'min' | 'max',
  opt?: FieldRefOption,
): string {
  return vgField(fieldDef, {prefix: `array_${extreme}`, ...opt});
}

/**
 * The color field def of an `array` mark, if it has one.
 *
 * Its values are a whole raster (an array of per-pixel values) rather than a scalar, which is what
 * makes this mark's color handling special: the ordinary field-extent domain machinery cannot
 * derive a scale domain from it (aggregating an array yields `[Infinity, -Infinity]` and a scale
 * that throws at render time), and the heatmap transform's color expression can only use raw pixel
 * values if the scale's domain is in those same real units.
 *
 * Returns `null` for a different mark, or a color `datum`/`value` def, where neither applies.
 */
export function arrayColorFieldDef(model: UnitModel): TypedFieldDef<string> | null {
  if (model.mark !== 'array') {
    return null;
  }

  const fieldDef = getFieldOrDatumDef(model.encoding?.color);
  return fieldDef && isFieldDef(fieldDef) ? (fieldDef as TypedFieldDef<string>) : null;
}

/**
 * Prepare the data an `array` mark needs.
 *
 * 1. A sanitized grid object for the heatmap transform. Handing it the datum wholesale would let
 *    any same-named data field reach it, and it reads `x1`/`x2`/`y1`/`y2` off the grid for an
 *    undocumented pixel-crop feature - so a spec that (very reasonably) names its extent fields
 *    `x1`/`y1` would silently render a corrupted raster. Passing only width/height/values keeps
 *    those names free for the user.
 *
 * 2. The grid's real [min, max], derived with Vega's `extent` expression into two genuine per-datum
 *    scalar fields, so the color scale can take its domain from them like any other field-driven
 *    domain - which also means it honors shared vs. independent facet resolve for free. Deriving
 *    these at runtime rather than reading conventionally-named fields off the data keeps this
 *    working for data Vega-Lite never sees at compile time, such as a `url` source. The `isArray`
 *    guard keeps a scalar color field working too: `extent` expects an array, and min = max = the
 *    value itself is exactly the right per-datum contribution to the domain.
 */
export function parseArrayData(head: DataFlowNode, model: UnitModel): DataFlowNode {
  if (model.mark !== 'array') {
    return head;
  }

  head = new CalculateNode(head, {
    calculate: '{width: datum.width, height: datum.height, values: datum.values}',
    as: ARRAY_GRID_FIELD,
  });

  const fieldDef = arrayColorFieldDef(model);

  // An explicitly specified domain wins over any derived one, so there is nothing to compute.
  if (!fieldDef || model.scaleDomain(COLOR)) {
    return head;
  }

  const field = vgField(fieldDef, {expr: 'datum'});

  for (const [i, extreme] of (['min', 'max'] as const).entries()) {
    head = new CalculateNode(head, {
      calculate: `isArray(${field}) ? extent(${field})[${i}] : ${field}`,
      as: arrayExtentField(fieldDef, extreme, {forAs: true}),
    });
  }

  return head;
}
