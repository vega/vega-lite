import { Channel } from '../channel';
import { Config, CellConfig } from '../config';
import { FieldDef, OrderFieldDef } from '../fielddef';
import { MarkConfig, TextConfig } from '../mark';
import { TimeUnit } from '../timeunit';
import { Model } from './model';
import { UnitModel } from './unit';
import { Spec } from '../spec';
import { VgEncodeEntry, VgSort } from '../vega.schema';
export declare function buildModel(spec: Spec, parent: Model, parentGivenName: string): Model;
export declare function applyConfig(e: VgEncodeEntry, config: CellConfig | MarkConfig | TextConfig, propsList: string[]): any;
export declare function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: string[]): any;
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export declare function numberFormat(fieldDef: FieldDef, format: string, config: Config, channel: Channel): string;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export declare function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, config: Config): string;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export declare function sortParams(orderDef: OrderFieldDef | OrderFieldDef[]): VgSort;
