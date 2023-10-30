import { NonPositionChannel } from './channel';
import { FieldName, TypedFieldDef } from './channeldef';
import { Encoding } from './encoding';
import { Mark, MarkDef } from './mark';
declare const STACK_OFFSET_INDEX: {
    readonly zero: 1;
    readonly center: 1;
    readonly normalize: 1;
};
export type StackOffset = keyof typeof STACK_OFFSET_INDEX;
export declare function isStackOffset(s: string): s is StackOffset;
export interface StackProperties {
    /** Dimension axis of the stack. */
    groupbyChannels: ('x' | 'y' | 'theta' | 'radius' | 'xOffset' | 'yOffset')[];
    /** Field for groupbyChannel. */
    groupbyFields: Set<FieldName>;
    /** Measure axis of the stack. */
    fieldChannel: 'x' | 'y' | 'theta' | 'radius';
    /** Stack-by fields e.g., color, detail */
    stackBy: {
        fieldDef: TypedFieldDef<string>;
        channel: NonPositionChannel;
    }[];
    /**
     * See `stack` property of Position Field Def.
     */
    offset: StackOffset;
    /**
     * Whether this stack will produce impute transform
     */
    impute: boolean;
}
export declare const STACKABLE_MARKS: Set<"square" | "area" | "circle" | "image" | "line" | "rect" | "text" | "point" | "arc" | "rule" | "trail" | "geoshape" | "bar" | "tick">;
export declare const STACK_BY_DEFAULT_MARKS: Set<"square" | "area" | "circle" | "image" | "line" | "rect" | "text" | "point" | "arc" | "rule" | "trail" | "geoshape" | "bar" | "tick">;
export declare function stack(m: Mark | MarkDef, encoding: Encoding<string>): StackProperties;
export {};
//# sourceMappingURL=stack.d.ts.map