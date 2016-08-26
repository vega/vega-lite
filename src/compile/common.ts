import {BAR, POINT, CIRCLE, SQUARE} from '../mark';
import {AggregateOp} from '../aggregate';
import {COLOR, OPACITY} from '../channel';
import {Config} from '../config';
import {FieldDef, field, OrderChannelDef} from '../fielddef';
import {SortOrder} from '../sort';
import {TimeUnit} from '../timeunit';
import {QUANTITATIVE, ORDINAL} from '../type';
import {contains, union} from '../util';

import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {template as timeUnitTemplate} from '../timeunit';
import {UnitModel} from './unit';
import {Spec, isUnitSpec, isFacetSpec, isLayerSpec} from '../spec';


export function buildModel(spec: Spec, parent: Model, parentGivenName: string): Model {
  if (isFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName);
  }

  if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName);
  }

  if (isUnitSpec(spec)) {
    return new UnitModel(spec, parent, parentGivenName);
  }

  console.error('Invalid spec.');
  return null;
}

// TODO: figure if we really need opacity in both
export const STROKE_CONFIG = ['stroke', 'strokeWidth',
  'strokeDash', 'strokeDashOffset', 'strokeOpacity', 'opacity'];

export const FILL_CONFIG = ['fill', 'fillOpacity',
  'opacity'];

export const FILL_STROKE_CONFIG = union(STROKE_CONFIG, FILL_CONFIG);

export function applyColorAndOpacity(p, model: UnitModel) {
  const filled = model.config().mark.filled;
  const colorFieldDef = model.encoding().color;
  const opacityFieldDef = model.encoding().opacity;

  // Apply fill stroke config first so that color field / value can override
  // fill / stroke
  if (filled) {
    applyMarkConfig(p, model, FILL_CONFIG);
  } else {
    applyMarkConfig(p, model, STROKE_CONFIG);
  }

  let colorValue;
  let opacityValue;
  if (model.has(COLOR)) {
    colorValue = {
      scale: model.scaleName(COLOR),
      field: model.field(COLOR, colorFieldDef.type === ORDINAL ? {prefix: 'rank'} : {})
    };
  } else if (colorFieldDef && colorFieldDef.value) {
    colorValue = { value: colorFieldDef.value };
  }

  if (model.has(OPACITY)) {
    opacityValue = {
      scale: model.scaleName(OPACITY),
      field: model.field(OPACITY, opacityFieldDef.type === ORDINAL ? {prefix: 'rank'} : {})
    };
  } else if (opacityFieldDef && opacityFieldDef.value) {
    opacityValue = { value: opacityFieldDef.value };
  }

  if (colorValue !== undefined) {
    if (filled) {
      p.fill = colorValue;
    } else {
      p.stroke = colorValue;
    }
  } else {
    // apply color config if there is no fill / stroke config
    p[filled ? 'fill' : 'stroke'] = p[filled ? 'fill' : 'stroke'] ||
      {value: model.config().mark.color};
  }

  // If there is no fill, always fill symbols
  // with transparent fills https://github.com/vega/vega-lite/issues/1316
  if (!p.fill && contains([BAR, POINT, CIRCLE, SQUARE], model.mark())) {
    p.fill = {value: 'transparent'};
  }

  if (opacityValue !== undefined) {
    p.opacity = opacityValue;
  }
}

export function applyConfig(properties, config, propsList: string[]) {
  propsList.forEach(function(property) {
    const value = config[property];
    if (value !== undefined) {
      properties[property] = { value: value };
    }
  });
  return properties;
}

export function applyMarkConfig(marksProperties, model: UnitModel, propsList: string[]) {
  return applyConfig(marksProperties, model.config().mark, propsList);
}

/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef: FieldDef, format: string, config: Config) {
  if (fieldDef.type === QUANTITATIVE && !fieldDef.bin) {
    // add number format for quantitative type only

    if (format) {
      return format;
    } else if (fieldDef.aggregate === AggregateOp.COUNT) {
      // FIXME: need a more holistic way to deal with this.
      return 'd';
    }
    // TODO: need to make this work correctly for numeric ordinal / nominal type
    return config.numberFormat;
  }
  return undefined;
}

/** Return field reference with potential "-" prefix for descending sort */
export function sortField(orderChannelDef: OrderChannelDef) {
  return (orderChannelDef.sort === SortOrder.DESCENDING ? '-' : '') +
    field(orderChannelDef, {binSuffix: 'mid'});
}

/**
 * Returns the time template used for axis/legend labels or text mark for a temporal field
 */
export function timeTemplate(templateField: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, config: Config): string {
  if (!timeUnit || format) {
    // If there is not time unit, or if user explicitly specify format for axis/legend/text.
    const _format = format || config.timeFormat; // only use config.timeFormat if there is no timeUnit.
    return '{{' + templateField + ' | time:\'' + _format + '\'}}';
  } else {
    return timeUnitTemplate(timeUnit, templateField, shortTimeLabels);
  }
}
