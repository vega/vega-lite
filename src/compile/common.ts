import {COLOR, OPACITY} from '../channel';
import {Config} from '../config';
import {containsLatLong} from '../encoding';
import {FieldDef, field, OrderChannelDef} from '../fielddef';
import {SortOrder} from '../sort';
import {TimeUnit} from '../timeunit';
import {QUANTITATIVE, ORDINAL} from '../type';
import {union, extend} from '../util';
import {PATH as PATHMARK} from '../mark';
import {GEOJSON, LATITUDE, LONGITUDE} from '../type';

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
      field: model.field(COLOR, colorFieldDef.type === ORDINAL ? {prefn: 'rank_'} : {})
    };
    if (model.scale(COLOR)) {
      colorValue.scale = model.scaleName(COLOR);
    }
  } else if (colorFieldDef && colorFieldDef.value) {
    colorValue = { value: colorFieldDef.value };
  }

  if (model.has(OPACITY)) {
    opacityValue = {
      field: model.field(OPACITY, opacityFieldDef.type === ORDINAL ? {prefn: 'rank_'} : {})
    };
    if (model.scale(OPACITY)) {
      opacityValue.scale = model.scaleName(OPACITY);
    }
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
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef: FieldDef, format: string, config: Config) {
  if (fieldDef.type === QUANTITATIVE && !fieldDef.bin) {
    // add number format for quantitative type only
    // TODO: need to make this work correctly for numeric ordinal / nominal type
    return format || config.numberFormat;
  }
  return undefined;
}

/** Return field reference with potential "-" prefix for descending sort */
export function sortField(orderChannelDef: OrderChannelDef) {
  return (orderChannelDef.sort === SortOrder.DESCENDING ? '-' : '') +
    field(orderChannelDef, {binSuffix: '_mid'});
}

/**
 * Returns the time template used for axis/legend labels or text mark for a temporal field
 */
export function timeTemplate(templateField: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, config: Config): string {
  if (!timeUnit || format) {
    return '{{' + templateField + ' | time:\'' + (format || config.timeFormat) + '\'}}';
  } else {
    return timeUnitTemplate(timeUnit, templateField, shortTimeLabels);
  }
}

export function hasGeoTransform(model: UnitModel): boolean {
  const pathFieldDef = model.encoding().path;
  if (model.mark() === PATHMARK) {
    if (pathFieldDef && !(pathFieldDef instanceof Array) && pathFieldDef.type === GEOJSON) {
      // Geopath transform.
      return true;
    }
  }
  // For geo transform, we only plot latitude/longitude against
  // x/y because it would not make sense for other measures like color.
  return containsLatLong(model.encoding());
}

export function geoTransform(model: UnitModel) {
  let projection = model.projection();
  let transform: any;

  if (model.mark() === PATHMARK) {
    // return geoPath transform
    const pathFieldDef: FieldDef = model.encoding().path;
    transform = { type: 'geopath', field: pathFieldDef.field };
  } else {
    transform = { type: 'geo' };
    const xFieldDef = model.encoding().x;
    const yFieldDef = model.encoding().y;
    if (xFieldDef && xFieldDef.type === LATITUDE) {
      transform.lat = xFieldDef.field;
    }
    if (xFieldDef && xFieldDef.type === LONGITUDE) {
      transform.lon = xFieldDef.field;
    }
    if (yFieldDef && yFieldDef.type === LATITUDE) {
      transform.lat = yFieldDef.field;
    }
    if (yFieldDef && yFieldDef.type === LONGITUDE) {
      transform.lon = yFieldDef.field;
    }
  }
  transform = extend(transform, { projection : model.projection().type});

  // Set all the projection properties if specified.
  if (projection !== undefined) {
    ['translate', 'scale', 'center', 'rotate', 'precision', 'clipAngle']
        .forEach((prop) => {
          if (projection[prop] !== undefined) {
            transform[prop] = projection[prop];
          }
        });
  }
  return transform;
}
