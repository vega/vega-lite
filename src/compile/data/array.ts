import {COLOR} from '../../channel.js';
import {FieldRefOption, getFieldOrDatumDef, isFieldDef, TypedFieldDef, vgField} from '../../channeldef.js';
import {internalField} from '../../util.js';
import {UnitModel} from '../unit.js';
import {CalculateNode} from './calculate.js';
import {DataFlowNode} from './dataflow.js';

/** Grid object handed to the heatmap transform. */
export const ARRAY_GRID_FIELD = internalField('array_grid');

/** Field holding one end of a raster grid's value range. */
export function arrayExtentField(
  fieldDef: TypedFieldDef<string>,
  extreme: 'min' | 'max',
  opt?: FieldRefOption,
): string {
  return vgField(fieldDef, {prefix: `array_${extreme}`, ...opt});
}

/**
 * The color field def of an `array` mark, whose values are a whole raster rather than a scalar.
 * Returns `null` for any other mark, and for a color `datum` or `value` def.
 */
export function arrayColorFieldDef(model: UnitModel): TypedFieldDef<string> | null {
  if (model.mark !== 'array') {
    return null;
  }

  const fieldDef = getFieldOrDatumDef(model.encoding?.color);
  return fieldDef && isFieldDef(fieldDef) ? (fieldDef as TypedFieldDef<string>) : null;
}

export function parseArrayData(head: DataFlowNode, model: UnitModel): DataFlowNode {
  if (model.mark !== 'array') {
    return head;
  }

  // Give the heatmap transform a grid of just the fields it needs. It also reads x1/x2/y1/y2 off
  // the grid to crop the raster, so handing it the datum would let a spec that names its extent
  // fields x1/y1 crop itself by accident.
  head = new CalculateNode(head, {
    calculate: '{width: datum.width, height: datum.height, values: datum.values}',
    as: ARRAY_GRID_FIELD,
  });

  const fieldDef = arrayColorFieldDef(model);
  if (!fieldDef || model.scaleDomain(COLOR)) {
    return head;
  }

  // Derive the grid's value range into scalar fields for the color scale to take its domain from.
  // Computing it here rather than reading it off the data keeps this working for a url source.
  const field = vgField(fieldDef, {expr: 'datum'});

  for (const [i, extreme] of (['min', 'max'] as const).entries()) {
    head = new CalculateNode(head, {
      calculate: `extent(${field})[${i}]`,
      as: arrayExtentField(fieldDef, extreme, {forAs: true}),
    });
  }

  return head;
}
