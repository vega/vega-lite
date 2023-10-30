/**
 * Utility for generating row / column headers
 */
import { Axis as VgAxis, SignalRef, Text } from 'vega';
import { FacetFieldDef } from '../../spec/facet';
export type HeaderChannel = 'row' | 'column';
export declare const HEADER_CHANNELS: HeaderChannel[];
export type HeaderType = 'header' | 'footer';
export declare const HEADER_TYPES: HeaderType[];
export interface LayoutHeaderComponentIndex {
    row?: LayoutHeaderComponent;
    column?: LayoutHeaderComponent;
    facet?: LayoutHeaderComponent;
}
/**
 * A component that represents all header, footers and title of a Vega group with layout directive.
 */
export interface LayoutHeaderComponent {
    title?: Text | SignalRef;
    facetFieldDef?: FacetFieldDef<string, SignalRef>;
    /**
     * An array of header components for headers.
     * For facet, there should be only one header component, which is data-driven.
     * For concat, there can be multiple header components that explicitly list different axes.
     */
    header?: HeaderComponent[];
    /**
     * An array of header components for footers.
     * For facet, there should be only one header component, which is data-driven.
     * For concat, there can be multiple header components that explicitly list different axes.
     */
    footer?: HeaderComponent[];
}
/**
 * A component that represents one group of row/column-header/footer.
 */
export interface HeaderComponent {
    labels: boolean;
    sizeSignal: {
        signal: string;
    };
    axes: VgAxis[];
}
//# sourceMappingURL=component.d.ts.map