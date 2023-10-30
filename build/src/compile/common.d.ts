import { ExprRef, SignalRef, Text } from 'vega';
import { AxisConfig, ConditionalAxisProperty } from '../axis';
import { ConditionalPredicate, DatumDef, FieldDef, FieldDefBase, FieldRefOption, OrderFieldDef, Value, ValueDef } from '../channeldef';
import { Config, StyleConfigIndex } from '../config';
import { Mark, MarkConfig, MarkDef } from '../mark';
import { SortFields } from '../sort';
import { VgEncodeChannel, VgEncodeEntry, VgValueRef } from '../vega.schema';
import { AxisComponentProps } from './axis/component';
import { Explicit } from './split';
import { UnitModel } from './unit';
export declare const BIN_RANGE_DELIMITER = " \u2013 ";
export declare function signalOrValueRefWithCondition<V extends Value | number[]>(val: ConditionalAxisProperty<V, SignalRef | ExprRef>): ConditionalAxisProperty<V, SignalRef>;
export declare function signalRefOrValue<T>(value: T | SignalRef | ExprRef): T | SignalRef;
export declare function conditionalSignalRefOrValue<T extends FieldDef<any> | DatumDef | ValueDef<any>>(value: ConditionalPredicate<T | ExprRef | SignalRef>): ConditionalPredicate<T | SignalRef>;
export declare function signalOrValueRef<T>(value: T | SignalRef | ExprRef): {
    value: T;
} | SignalRef;
export declare function exprFromSignalRefOrValue<T extends SignalRef>(ref: Value<T> | SignalRef): string;
export declare function exprFromValueRefOrSignalRef(ref: VgValueRef | SignalRef): string;
export declare function signalOrStringValue(v: SignalRef | any): string;
export declare function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig<any>)[]): Partial<Record<VgEncodeChannel, VgValueRef | (VgValueRef & {
    test?: string;
})[]>>;
export declare function getStyles(mark: MarkDef): string[];
export declare function getMarkPropOrConfig<P extends keyof MarkDef, ES extends ExprRef | SignalRef>(channel: P, mark: MarkDef<Mark, ES>, config: Config<SignalRef>, opt?: {
    vgChannel?: VgEncodeChannel;
    ignoreVgConfig?: boolean;
}): MarkDef<Mark, ES>[P];
/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export declare function getMarkConfig<P extends keyof MarkDef, ES extends ExprRef | SignalRef>(channel: P, mark: MarkDef<Mark, ES>, config: Config<SignalRef>, { vgChannel }?: {
    vgChannel?: VgEncodeChannel;
}): MarkDef<Mark, ES>[P];
export declare function getMarkStyleConfig<P extends keyof MarkDef, ES extends ExprRef | SignalRef>(prop: P, mark: MarkDef<Mark, ES>, styleConfigIndex: StyleConfigIndex<SignalRef>): any;
export declare function getStyleConfig<P extends keyof MarkDef | keyof AxisConfig<SignalRef>>(p: P, styles: string | string[], styleConfigIndex: StyleConfigIndex<SignalRef>): any;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export declare function sortParams(orderDef: OrderFieldDef<string> | OrderFieldDef<string>[], fieldRefOption?: FieldRefOption): SortFields;
export type AxisTitleComponent = AxisComponentProps['title'];
export declare function mergeTitleFieldDefs(f1: readonly FieldDefBase<string>[], f2: readonly FieldDefBase<string>[]): FieldDefBase<string, import("../bin").Bin>[];
export declare function mergeTitle(title1: Text | SignalRef, title2: Text | SignalRef): SignalRef | Text;
export declare function mergeTitleComponent(v1: Explicit<AxisTitleComponent>, v2: Explicit<AxisTitleComponent>): {
    explicit: boolean;
    value: SignalRef | Text;
} | {
    explicit: boolean;
    value: FieldDefBase<string, import("../bin").Bin>[];
};
//# sourceMappingURL=common.d.ts.map