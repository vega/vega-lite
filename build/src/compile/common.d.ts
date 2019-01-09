import { Config, StyleConfigIndex, ViewConfig } from '../config';
import { FieldDefBase, FieldRefOption, OrderFieldDef, TypedFieldDef } from '../fielddef';
import { MarkConfig, MarkDef, TextConfig } from '../mark';
import { TimeUnit } from '../timeunit';
import { VgCompare, VgEncodeEntry } from '../vega.schema';
import { AxisComponentProps } from './axis/component';
import { Explicit } from './split';
import { UnitModel } from './unit';
export declare function applyConfig(e: VgEncodeEntry, config: ViewConfig | MarkConfig | TextConfig, // TODO(#1842): consolidate MarkConfig | TextConfig?
propsList: string[]): VgEncodeEntry;
export declare function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig)[]): VgEncodeEntry;
export declare function getStyles(mark: MarkDef): string[];
/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export declare function getMarkConfig<P extends keyof MarkConfig>(prop: P, mark: MarkDef, config: Config, { skipGeneralMarkConfig }?: {
    skipGeneralMarkConfig?: boolean;
}): MarkConfig[P];
export declare function getStyleConfig<P extends keyof MarkConfig>(prop: P, mark: MarkDef, styleConfigIndex: StyleConfigIndex): any;
export declare function formatSignalRef(fieldDef: TypedFieldDef<string>, specifiedFormat: string, expr: 'datum' | 'parent', config: Config): {
    signal: string;
};
/**
 * Returns number format for a fieldDef
 */
export declare function numberFormat(fieldDef: TypedFieldDef<string>, specifiedFormat: string, config: Config): string;
export declare function numberFormatExpr(field: string, specifiedFormat: string, config: Config): string;
export declare function binFormatExpression(startField: string, endField: string, format: string, config: Config): string;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export declare function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, rawTimeFormat: string, // should be provided only for actual text and headers, not axis/legend labels
isUTCScale: boolean, alwaysReturn?: boolean): string;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export declare function sortParams(orderDef: OrderFieldDef<string> | OrderFieldDef<string>[], fieldRefOption?: FieldRefOption): VgCompare;
export declare type AxisTitleComponent = AxisComponentProps['title'];
export declare function mergeTitleFieldDefs(f1: FieldDefBase<string>[], f2: FieldDefBase<string>[]): FieldDefBase<string>[];
export declare function mergeTitle(title1: string, title2: string): string;
export declare function mergeTitleComponent(v1: Explicit<AxisTitleComponent>, v2: Explicit<AxisTitleComponent>): {
    explicit: boolean;
    value: FieldDefBase<string>[];
} | {
    explicit: boolean;
    value: string;
};
