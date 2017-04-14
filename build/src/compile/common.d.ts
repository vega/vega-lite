import { Channel } from '../channel';
import { CellConfig, Config } from '../config';
import { FieldDef, OrderFieldDef } from '../fielddef';
import { Mark, MarkConfig, TextConfig } from '../mark';
import { TimeUnit } from '../timeunit';
import { Spec } from '../spec';
import { VgEncodeEntry, VgSort } from '../vega.schema';
import { Model } from './model';
import { UnitModel } from './unit';
export declare function buildModel(spec: Spec, parent: Model, parentGivenName: string, config: Config): Model;
export declare function applyConfig(e: VgEncodeEntry, config: CellConfig | MarkConfig | TextConfig, propsList: string[]): any;
export declare function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig)[]): any;
/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export declare function getMarkConfig<P extends keyof MarkConfig>(prop: P, mark: Mark, config: Config): MarkConfig[P];
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export declare function numberFormat(fieldDef: FieldDef, format: string, config: Config, channel: Channel): string;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export declare function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, timeFormatConfig: string): string;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export declare function sortParams(orderDef: OrderFieldDef | OrderFieldDef[]): VgSort;
