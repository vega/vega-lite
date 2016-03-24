import {COLUMN, ROW, X, Y, SIZE, COLOR, SHAPE, TEXT, LABEL, Channel} from '../channel';
import {FieldDef, field, OrderChannelDef} from '../fielddef';
import {SortOrder} from '../sort';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../type';
import {contains, union, isArray, array, extend, keys, isString} from '../util';

import {FacetModel} from './facet';
import {RepeatModel, RepeatValues} from './repeat';
import {LayerModel} from './layer';
import {Model} from './model';
import {format as timeFormatExpr} from './time';
import {UnitModel} from './unit';
import {Spec, isUnitSpec, isFacetSpec, isRepeatSpec, isLayerSpec} from '../spec';
import {Selection} from './selections';

export function buildModel(spec: Spec, parent: Model, parentGivenName: string, repeatValues: RepeatValues): Model {
  if (isFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName, repeatValues);
  }

  if (isRepeatSpec(spec)) {
    return new RepeatModel(spec, parent, parentGivenName, repeatValues);
  }

  if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName, repeatValues);
  }

  if (isUnitSpec(spec)) {
    return new UnitModel(spec, parent, parentGivenName, repeatValues);
  }

  console.error('Invalid spec.');
  return null;
}

export function compileSelectionPredicate(model: UnitModel, sel) {
  var recurse = compileSelectionPredicate.bind(null, model);
  if (isArray(sel)) sel = { or: sel };  // Default OR.
  return isString(sel) ? model.selection(sel).predicate :
    sel.or ? array(sel.or).map(recurse).join(' || ') :
      sel.and ? array(sel.and).map(recurse).join(' && ') : null;
}

export function compileIfThenElse(model: UnitModel, channel: Channel, output, cb) {
  const ruleDef = model.fieldDefs(channel);

  // RuleDef is just a regular FieldDef.
  if (!isArray(ruleDef)) return extend(output, cb(ruleDef));

  array(ruleDef).forEach(function(fieldDef) {
    var selection = fieldDef.if || fieldDef.elseif,
        predicate = selection && compileSelectionPredicate(model, selection);

    const property = cb(fieldDef);
    keys(property).forEach(function(k) {
      const o = isArray(output[k]) && output[k] || (output[k] = []);
      if (predicate) property[k].test = predicate;
      o.push(property[k]);
    });
  });
}

// TODO: figure if we really need opacity in both
export const STROKE_CONFIG = ['stroke', 'strokeWidth',
  'strokeDash', 'strokeDashOffset', 'strokeOpacity', 'opacity'];

export const FILL_CONFIG = ['fill', 'fillOpacity',
  'opacity'];

export const FILL_STROKE_CONFIG = union(STROKE_CONFIG, FILL_CONFIG);

export function applyColorAndOpacity(p, model: UnitModel) {
  const filled = model.config().mark.filled,
        property = filled ? 'fill' : 'stroke';

  // Apply fill stroke config first so that color field / value can override
  // fill / stroke
  if (filled) {
    applyMarkConfig(p, model, FILL_CONFIG);
  } else {
    applyMarkConfig(p, model, STROKE_CONFIG);
  }

  compileIfThenElse(model, COLOR, p, function(fieldDef) {
    let props = {};
    if (fieldDef.field) {
      props[property] = {
        scale: model.scaleName(COLOR),
        field: model.field(COLOR,
          fieldDef.type === ORDINAL ? {prefn: 'rank_'} : {}, fieldDef)
      };
    } else if (fieldDef.value) {
      props[property] = { value: fieldDef.value };
    } else {
      props[property] = p[property] || { value: model.config().mark.color };
    }
    return props;
  });
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
