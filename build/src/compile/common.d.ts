import { CellConfig, Config } from '../config';
import { FieldDef, FieldRefOption, OrderFieldDef } from '../fielddef';
import { MarkConfig, MarkDef, TextConfig } from '../mark';
import { TimeUnit } from '../timeunit';
import { VgEncodeEntry, VgSort } from '../vega.schema';
import { Explicit } from './split';
import { UnitModel } from './unit';
export declare function applyConfig(e: VgEncodeEntry, config: CellConfig | MarkConfig | TextConfig, propsList: string[]): VgEncodeEntry;
export declare function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig)[]): VgEncodeEntry;
export declare function getStyles(mark: MarkDef): string[];
/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export declare function getMarkConfig<P extends keyof MarkConfig>(prop: P, mark: MarkDef, config: Config): MarkConfig[P];
export declare function formatSignalRef(fieldDef: FieldDef<string>, specifiedFormat: string, expr: 'datum' | 'parent', config: Config, useBinRange?: boolean): {
    signal: string;
};
export declare function getSpecifiedOrDefaultValue<T>(specifiedValue: T, defaultValue: T | {
    signal: string;
}): T | {
    signal: string;
};
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export declare function numberFormat(fieldDef: FieldDef<string>, specifiedFormat: string, config: Config): string;
export declare function numberFormatExpr(field: string, specifiedFormat: string, config: Config): string;
export declare function binFormatExpression(startField: string, endField: string, format: string, config: Config): string;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export declare function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, timeFormatConfig: string, isUTCScale: boolean): string;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export declare function sortParams(orderDef: OrderFieldDef<string> | OrderFieldDef<string>[], fieldRefOption?: FieldRefOption): VgSort;
export declare function titleMerger(v1: Explicit<string>, v2: Explicit<string>): {
    explicit: boolean;
    value: string;
};
