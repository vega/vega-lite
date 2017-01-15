import * as log from '../log';

import {BAR, POINT, CIRCLE, SQUARE} from '../mark';
import {AggregateOp} from '../aggregate';
import {COLOR, OPACITY, TEXT, Channel} from '../channel';
import {Config, CellConfig} from '../config';
import {FieldDef, OrderChannelDef, field} from '../fielddef';
import {MarkConfig, TextConfig} from '../mark';
import {TimeUnit} from '../timeunit';
import {QUANTITATIVE} from '../type';
import {contains, isArray, union} from '../util';

import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {formatExpression} from '../timeunit';
import {UnitModel} from './unit';
import {Spec, isUnitSpec, isSomeFacetSpec, isLayerSpec} from '../spec';
import {VgEncodeEntry, VgValueRef, VgSort} from '../vega.schema';

export function buildModel(spec: Spec, parent: Model, parentGivenName: string): Model {
  if (isSomeFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName);
  }

  if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName);
  }

  if (isUnitSpec(spec)) {
    return new UnitModel(spec, parent, parentGivenName);
  }

  throw new Error(log.message.INVALID_SPEC);
}

// TODO: figure if we really need opacity in both
export const STROKE_CONFIG = ['stroke', 'strokeWidth',
  'strokeDash', 'strokeDashOffset', 'strokeOpacity', 'opacity'];

export const FILL_CONFIG = ['fill', 'fillOpacity',
  'opacity'];

export const FILL_STROKE_CONFIG = union(STROKE_CONFIG, FILL_CONFIG);

export function applyColorAndOpacity(e: VgEncodeEntry, model: UnitModel) {
  const filled = model.config().mark.filled;
  const colorFieldDef = model.encoding().color;
  const opacityFieldDef = model.encoding().opacity;

  // Apply fill stroke config first so that color field / value can override
  // fill / stroke
  if (filled) {
    applyMarkConfig(e, model, FILL_CONFIG);
  } else {
    applyMarkConfig(e, model, STROKE_CONFIG);
  }

  let colorValue: VgValueRef;
  let opacityValue: VgValueRef;
  if (model.channelHasField(COLOR)) {
    colorValue = {
      scale: model.scaleName(COLOR),
      field: model.field(COLOR)
    };
  } else if (colorFieldDef && colorFieldDef.value) {
    colorValue = { value: colorFieldDef.value };
  }

  if (model.channelHasField(OPACITY)) {
    opacityValue = {
      scale: model.scaleName(OPACITY),
      field: model.field(OPACITY)
    };
  } else if (opacityFieldDef && opacityFieldDef.value) {
    opacityValue = { value: opacityFieldDef.value };
  }

  if (colorValue !== undefined) {
    if (filled) {
      e.fill = colorValue;
    } else {
      e.stroke = colorValue;
    }
  } else {
    // apply color config if there is no fill / stroke config
    e[filled ? 'fill' : 'stroke'] = e[filled ? 'fill' : 'stroke'] ||
      {value: model.config().mark.color};
  }

  // If there is no fill, always fill symbols
  // with transparent fills https://github.com/vega/vega-lite/issues/1316
  if (!e.fill && contains([BAR, POINT, CIRCLE, SQUARE], model.mark())) {
    e.fill = {value: 'transparent'};
  }

  if (opacityValue !== undefined) {
    e.opacity = opacityValue;
  }
}

export function applyConfig(e: VgEncodeEntry,
    config: CellConfig | MarkConfig | TextConfig, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList: string[]) {
  propsList.forEach(function(property) {
    const value = config[property];
    if (value !== undefined) {
      e[property] = { value: value };
    }
  });
  return e;
}

export function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: string[]) {
  return applyConfig(e, model.config().mark, propsList);
}

/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef: FieldDef, format: string, config: Config, channel: Channel) {
  if (fieldDef.type === QUANTITATIVE && !fieldDef.bin) {
    // add number format for quantitative type only

    if (format) {
      return format;
    } else if (fieldDef.aggregate === AggregateOp.COUNT && channel === TEXT) {
      // FIXME: need a more holistic way to deal with this.
      return 'd';
    }
    // TODO: need to make this work correctly for numeric ordinal / nominal type
    return config.numberFormat;
  }
  return undefined;
}

/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, config: Config): string {
  if (!timeUnit || format) {
    // If there is not time unit, or if user explicitly specify format for axis/legend/text.
    const _format = format || config.timeFormat; // only use config.timeFormat if there is no timeUnit.
    return `timeFormat(${field}, '${_format}')`;
  } else {
    return formatExpression(timeUnit, field, shortTimeLabels);
  }
}

/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(orderDef: OrderChannelDef | OrderChannelDef[]): VgSort {
  return (isArray(orderDef) ? orderDef : [orderDef]).reduce((s, orderChannelDef) => {
    s.field.push(field(orderChannelDef, {binSuffix: 'start'}));
    s.order.push(orderChannelDef.sort || 'ascending');
    return s;
  }, {field:[], order: []});
}
