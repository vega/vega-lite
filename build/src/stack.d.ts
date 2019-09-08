import { NonPositionChannel } from './channel';
import { Field, TypedFieldDef } from './channeldef';
import { Encoding } from './encoding';
import { Mark, MarkDef } from './mark';
export declare type StackOffset = 'zero' | 'center' | 'normalize';
export declare function isStackOffset(s: string): s is StackOffset;
export interface StackProperties {
    /** Dimension axis of the stack. */
    groupbyChannel: 'x' | 'y';
    /** Measure axis of the stack. */
    fieldChannel: 'x' | 'y';
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
export declare const STACKABLE_MARKS: ("circle" | "square" | "area" | "line" | "rule" | "text" | "point" | "bar" | "tick")[];
export declare const STACK_BY_DEFAULT_MARKS: ("area" | "bar")[];
export declare function stack(m: Mark | MarkDef, encoding: Encoding<Field>, opt?: {
    disallowNonLinearStack?: boolean;
}): StackProperties;
//# sourceMappingURL=stack.d.ts.map