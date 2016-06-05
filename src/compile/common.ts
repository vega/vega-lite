import {COLUMN, ROW, X, Y, SIZE, COLOR, OPACITY, SHAPE, TEXT, LABEL, Channel} from '../channel';
import {containsLatLong} from '../encoding';
import {FieldDef, field, OrderChannelDef} from '../fielddef';
import {SortOrder} from '../sort';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../type';
import {contains, union, extend} from '../util';
import {Mark, PATH} from '../Mark';
import {PATH as PATHMARK} from '../mark';
import {GEOJSON, LATITUDE, LONGITUDE} from '../type';

import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {format as timeFormatExpr} from '../timeunit';
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
export function formatMixins(model: Model, channel: Channel, format: string) {
  const fieldDef = model.fieldDef(channel);

  if(!contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
    return {};
  }

  let def: any = {};

  if (fieldDef.type === TEMPORAL) {
    def.formatType = 'time';
  }

  if (format !== undefined) {
    def.format = format;
  } else {
    switch (fieldDef.type) {
      case QUANTITATIVE:
        def.format = model.config().numberFormat;
        break;
      case TEMPORAL:
        def.format = timeFormat(model, channel) || model.config().timeFormat;
        break;
    }
  }

  if (channel === TEXT) {
    // text does not support format and formatType
    // https://github.com/vega/vega/issues/505

    const filter = (def.formatType || 'number') + (def.format ? ':\'' + def.format + '\'' : '');
    return {
      text: {
        template: '{{' + model.field(channel, { datum: true }) + ' | ' + filter + '}}'
      }
    };
  }

  return def;
}

function isAbbreviated(model: Model, channel: Channel, fieldDef: FieldDef) {
  switch (channel) {
    case ROW:
    case COLUMN:
    case X:
    case Y:
      return model.axis(channel).shortTimeLabels;
    case COLOR:
    case OPACITY:
    case SHAPE:
    case SIZE:
      return model.legend(channel).shortTimeLabels;
    case TEXT:
      return model.config().mark.shortTimeLabels;
    case LABEL:
      // TODO(#897): implement when we have label
  }
  return false;
}



/** Return field reference with potential "-" prefix for descending sort */
export function sortField(orderChannelDef: OrderChannelDef) {
  return (orderChannelDef.sort === SortOrder.DESCENDING ? '-' : '') + field(orderChannelDef);
}

/**
 * Returns the time format used for axis labels for a time unit.
 */
export function timeFormat(model: Model, channel: Channel): string {
  const fieldDef = model.fieldDef(channel);
  return timeFormatExpr(fieldDef.timeUnit, isAbbreviated(model, channel, fieldDef));
}

export function hasGeoTransform(model: UnitModel): boolean {
  const geoPathFieldDef = model.encoding().geopath;
  if (model.mark() === PATHMARK) {
    if (geoPathFieldDef && geoPathFieldDef.type === GEOJSON) {
      // If the mark is path and geopath encoding is defined with geojson type,
      // it means the user wants to have geopath transform.
      return true;
    }
  }
  // For geo transform, we only plot latitude/longitude against
  // x/y because it would not make sense for other measures like color.
  return containsLatLong(model.encoding);
}

export function geoTransform(model: UnitModel) {
  const translate = model.projection().translate;
  const scale     = model.projection().scale;
  const center    = model.projection().center;
  const rotate    = model.projection().rotate;
  const precision = model.projection().precision;
  const clipAngle = model.projection().clipAngle;
  let spec = {};
  if (model.mark() === PATHMARK) {
    // return geoPath transform
    const geoPathFieldDef = model.encoding().geopath;
    spec = { type: 'geopath', field: geoPathFieldDef.field };
  } else {
    spec = { type: 'geo' };
    const xFieldDef = model.encoding().x;
    const yFieldDef = model.encoding().y;
    spec = extend(spec,
        xFieldDef.type === LATITUDE ? { lat : xFieldDef.field }
            : xFieldDef.type === LONGITUDE ? { lon : xFieldDef.field }
            : {});
    spec = extend(spec,
    yFieldDef.type === LATITUDE ? { lat : yFieldDef.field }
        : yFieldDef.type === LONGITUDE ? { lon : yFieldDef.field }
        : {});
  }
    spec = extend(spec, { projection : model.projection().type});
    spec = extend(spec, translate !== undefined ? { translate : translate} : {});
    spec = extend(spec, scale !== undefined ? { scale : scale } : {});
    spec = extend(spec, center !== undefined ? { center : center } : {});
    spec = extend(spec, rotate !== undefined ? { rotate : rotate } : {});
    spec = extend(spec, precision !== undefined ? { precision : precision } : {});
    spec = extend(spec, clipAngle !== undefined ? { clipAngle : clipAngle } : {});
    return spec;
}
