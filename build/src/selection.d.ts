import { SingleDefChannel } from './channel';
import { VgBinding } from './vega.schema';
export declare const SELECTION_ID = "_vgsid_";
export declare type SelectionType = 'single' | 'multi' | 'interval';
export declare type SelectionResolution = 'global' | 'union' | 'intersect';
export interface BaseSelectionDef {
    /**
     * A Vega event stream (object or selector) that triggers the selection.
     */
    on?: any;
    /**
     * With layered and multi-view displays, a strategy that determines how
     * selections' data queries are resolved when applied in a filter transform,
     * conditional encoding rule, or scale domain. One of: "global", "union",
     * "intersect", "union_others", or "intersect_others".
     *
     * __global__: Only one instance of the selection exists across all
     * views. When a user interacts within a new view, any previous selections
     * are overridden.
     *
     * __union__: Each view contains its own selection, and a data value is
     * considered to be selected if it falls within _any_ of these selection
     * instances.
     *
     * __intersect__: Each view contains its own selection, and a data value is
     * considered to be selected if it falls within _all_ of these selection
     * instances.
     *
     */
    resolve?: SelectionResolution;
    /**
     * An array of encoding channels. The corresponding data field values
     * must match for a data tuple to fall within the selection.
     */
    encodings?: SingleDefChannel[];
    /**
     * An array of field names whose values must match for a data tuple to
     * fall within the selection.
     */
    fields?: string[];
}
export interface SingleSelectionConfig extends BaseSelectionDef {
    /**
     * Establish a two-way binding between a single selection and input elements
     * (also known as dynamic query widgets). A binding takes the form of
     * Vega's [input element binding definition](https://vega.github.io/vega/docs/signals/#bind)
     * or can be a mapping between projected field/encodings and binding definitions.
     */
    bind?: VgBinding | {
        [key: string]: VgBinding;
    };
    /**
     * When true, an invisible voronoi diagram is computed to accelerate discrete
     * selection. The data value _nearest_ the mouse cursor is added to the selection.
     */
    nearest?: boolean;
}
export interface MultiSelectionConfig extends BaseSelectionDef {
    /**
     * Controls whether data values should be toggled or only ever inserted into
     * multi selections. Can be `true`, `false` (for insertion only), or a
     * [Vega expression](https://vega.github.io/vega/docs/expressions/).
     *
     * __Default value:__ `true`, which corresponds to `event.shiftKey` (i.e.,
     * data values are toggled when a user interacts with the shift-key pressed).
     */
    toggle?: string | boolean;
    /**
     * When true, an invisible voronoi diagram is computed to accelerate discrete
     * selection. The data value _nearest_ the mouse cursor is added to the selection.
     */
    nearest?: boolean;
}
export interface BrushConfig {
    /**
     * The fill color of the interval mark.
     *
     * __Default value:__ `#333333`
     *
     */
    fill?: string;
    /**
     * The fill opacity of the interval mark (a value between 0 and 1).
     *
     * __Default value:__ `0.125`
     */
    fillOpacity?: number;
    /**
     * The stroke color of the interval mark.
     *
     * __Default value:__ `#ffffff`
     */
    stroke?: string;
    /**
     * The stroke opacity of the interval mark (a value between 0 and 1).
     */
    strokeOpacity?: number;
    /**
     * The stroke width of the interval mark.
     */
    strokeWidth?: number;
    /**
     * An array of alternating stroke and space lengths,
     * for creating dashed or dotted lines.
     */
    strokeDash?: number[];
    /**
     * The offset (in pixels) with which to begin drawing the stroke dash array.
     */
    strokeDashOffset?: number;
}
export interface IntervalSelectionConfig extends BaseSelectionDef {
    /**
     * When truthy, allows a user to interactively move an interval selection
     * back-and-forth. Can be `true`, `false` (to disable panning), or a
     * [Vega event stream definition](https://vega.github.io/vega/docs/event-streams/)
     * which must include a start and end event to trigger continuous panning.
     *
     * __Default value:__ `true`, which corresponds to
     * `[mousedown, window:mouseup] > window:mousemove!` which corresponds to
     * clicks and dragging within an interval selection to reposition it.
     */
    translate?: string | boolean;
    /**
     * When truthy, allows a user to interactively resize an interval selection.
     * Can be `true`, `false` (to disable zooming), or a [Vega event stream
     * definition](https://vega.github.io/vega/docs/event-streams/). Currently,
     * only `wheel` events are supported.
     *
     *
     * __Default value:__ `true`, which corresponds to `wheel!`.
     */
    zoom?: string | boolean;
    /**
     * Establishes a two-way binding between the interval selection and the scales
     * used within the same view. This allows a user to interactively pan and
     * zoom the view.
     */
    bind?: 'scales';
    /**
     * Each (unbound) interval selection also adds a rectangle mark to depict the
     * extents of the interval. The `mark` property can be used to customize the
     * appearance of the mark.
     */
    mark?: BrushConfig;
}
export interface SingleSelection extends SingleSelectionConfig {
    type: 'single';
}
export interface MultiSelection extends MultiSelectionConfig {
    type: 'multi';
}
export interface IntervalSelection extends IntervalSelectionConfig {
    type: 'interval';
}
export declare type SelectionDef = SingleSelection | MultiSelection | IntervalSelection;
export interface SelectionConfig {
    single: SingleSelectionConfig;
    multi: MultiSelectionConfig;
    interval: IntervalSelectionConfig;
}
export declare const defaultConfig: SelectionConfig;
