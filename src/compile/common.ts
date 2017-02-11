import * as log from '../log';

import {TEXT, Channel} from '../channel';
import {Config, CellConfig} from '../config';
import {FieldDef, OrderFieldDef, field} from '../fielddef';
import {MarkConfig, TextConfig} from '../mark';
import {TimeUnit} from '../timeunit';
import {QUANTITATIVE} from '../type';
import {isArray} from '../util';

import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {formatExpression} from '../timeunit';
import {UnitModel} from './unit';
import {Spec, isUnitSpec, isFacetSpec, isLayerSpec} from '../spec';
import {VgEncodeEntry, VgSort} from '../vega.schema';

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

  throw new Error(log.message.INVALID_SPEC);
}

export function applyConfig(e: VgEncodeEntry,
    config: CellConfig | MarkConfig | TextConfig, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList: string[]) {
  propsList.forEach(function(property) {
    const value = config[property];
    if (value !== undefined) {
      e[property] = {value: value};
    }
  });
  return e;
}

export function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: string[]) {
  return applyConfig(e, model.config.mark, propsList);
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
    } else if (fieldDef.aggregate === 'count' && channel === TEXT) {
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
export function sortParams(orderDef: OrderFieldDef | OrderFieldDef[]): VgSort {
  return (isArray(orderDef) ? orderDef : [orderDef]).reduce((s, orderChannelDef) => {
    s.field.push(field(orderChannelDef, {binSuffix: 'start'}));
    s.order.push(orderChannelDef.sort || 'ascending');
    return s;
  }, {field:[], order: []});
}
