import {COLOR, OPACITY, Channel} from '../channel';
import {FieldDef, field, OrderChannelDef} from '../fielddef';
import {SortOrder} from '../sort';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../type';
import {contains, union} from '../util';

import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {format as timeUnitTemplate} from '../timeunit';
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
  const colorFieldDef = model.fieldDef(COLOR);
  const opacityFieldDef = model.fieldDef(OPACITY);

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
      field: model.field(COLOR, colorFieldDef.type === ORDINAL ? {prefn: 'rank_'} : {})
    };
  } else if (colorFieldDef && colorFieldDef.value) {
    colorValue = { value: colorFieldDef.value };
  }

  if (model.has(OPACITY)) {
    opacityValue = {
      scale: model.scaleName(OPACITY),
      field: model.field(OPACITY, opacityFieldDef.type === ORDINAL ? {prefn: 'rank_'} : {})
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
 * Builds an object with format and formatType properties.
 *
 * @param format explicitly specified format
 */
export function formatMixins(model: Model, fieldDef: FieldDef, format: string, shortTimeLabels: boolean) {
  if(!contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
    return {};
  }

  let def: any = {};

  // no need to set format type for temporal since we use templates anyway

  if (format !== undefined) {
    def.format = format;
  } else {
    switch (fieldDef.type) {
      case QUANTITATIVE:
        def.format = model.config().numberFormat;
        break;
    }
  }
  return def;
}

/** Return field reference with potential "-" prefix for descending sort */
export function sortField(orderChannelDef: OrderChannelDef) {
  return (orderChannelDef.sort === SortOrder.DESCENDING ? '-' : '') +
    field(orderChannelDef, {binSuffix: '_mid'});
}

/**
 * Returns the time format used for axis labels for a time unit.
 */
export function timeFormatTemplate(model: Model, channel: Channel, shortTimeLabels: boolean, field = 'datum.data'): string {
  const fieldDef = model.fieldDef(channel);
  if (!fieldDef.timeUnit) {
    return '{{' + field + ' | time:\'' + model.config().timeFormat + '\'}}';
  } else {
    return timeUnitTemplate(fieldDef.timeUnit, shortTimeLabels, field);
  }
}
