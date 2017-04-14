import { Channel } from './channel';
import { Encoding } from './encoding';
import { FieldDef } from './fielddef';
import { Mark, MarkDef } from './mark';
export declare type StackOffset = 'zero' | 'center' | 'normalize' | 'none';
export interface StackProperties {
    /** Dimension axis of the stack. */
    groupbyChannel: 'x' | 'y';
    /** Measure axis of the stack. */
    fieldChannel: 'x' | 'y';
    /** Stack-by fields e.g., color, detail */
    stackBy: {
        fieldDef: FieldDef;
        channel: Channel;
    }[];
    /**
     * Modes for stacking marks:
     * - `zero`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](mark.html#stacked-bar-chart) and [area](mark.html#stacked-area-chart) chart).
     * - `normalize` - stacking with normalized domain (for creating normalized stacked [bar](mark.html#normalized-stacked-bar-chart) and [area](mark.html#normalized-stacked-area-chart) chart). <br/>
     * -`center` - stacking with center baseline (for [streamgraph](mark.html#streamgraph)).
     * - `none` - No-stacking. This will produce layered [bar](mark.html#layered-bar-chart) and area chart.
     *
     * __Default value:__ `zero` for plots with all of the following conditions: (1) `bar` or `area` marks (2) `color`, `opacity`, `size`, or `detail` channel mapped to a group-by field (3) One ordinal or nominal axis, and (4) one quantitative axis with linear scale and summative aggregation function (e.g., `sum`, `count`).
     */
    offset: StackOffset;
}
export declare const STACKABLE_MARKS: ("area" | "circle" | "line" | "text" | "point" | "square" | "bar" | "tick" | "rule")[];
export declare const STACK_BY_DEFAULT_MARKS: ("area" | "bar")[];
export declare function stack(m: Mark | MarkDef, encoding: Encoding, stackConfig: StackOffset): StackProperties;
