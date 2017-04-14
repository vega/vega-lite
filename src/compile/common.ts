import * as log from '../log';

import {Channel, TEXT} from '../channel';
import {CellConfig, Config} from '../config';
import {field, FieldDef, OrderFieldDef} from '../fielddef';
import {Mark, MarkConfig, TextConfig} from '../mark';
import {TimeUnit} from '../timeunit';
import {QUANTITATIVE} from '../type';
import {isArray} from '../util';

import {isFacetSpec, isLayerSpec, isUnitSpec, Spec} from '../spec';
import {formatExpression} from '../timeunit';
import {VgEncodeEntry, VgSort} from '../vega.schema';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {UnitModel} from './unit';

export function buildModel(spec: Spec, parent: Model, parentGivenName: string, config: Config): Model {
  if (isFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName, config);
  }

  if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName, config);
  }

  if (isUnitSpec(spec)) {
    return new UnitModel(spec, parent, parentGivenName, config);
  }

  throw new Error(log.message.INVALID_SPEC);
}

export function applyConfig(e: VgEncodeEntry,
    config: CellConfig | MarkConfig | TextConfig, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList: string[]) {
  propsList.forEach((property) => {
    const value = config[property];
    if (value !== undefined) {
      e[property] = {value: value};
    }
  });
  return e;
}

export function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig)[]) {
  propsList.forEach((property) => {
    const value = getMarkConfig(property, model.mark(), model.config);
    if (value !== undefined) {
      e[property] = {value: value};
    }
  });
  return e;
}

/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export function getMarkConfig<P extends keyof MarkConfig>(prop: P, mark: Mark, config: Config): MarkConfig[P] {
  const markSpecificConfig = config[mark];
  if (markSpecificConfig[prop] !== undefined) {
    return markSpecificConfig[prop];
  }
  return config.mark[prop];
}

/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef: FieldDef, format: string, config: Config, channel: Channel) {
  if (fieldDef.type === QUANTITATIVE) {
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
export function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, timeFormatConfig: string): string {
  if (!timeUnit || format) {
    // If there is not time unit, or if user explicitly specify format for axis/legend/text.
    const _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
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
