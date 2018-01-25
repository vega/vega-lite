/**
 * Utility for generating row / column headers
 */
import { FacetFieldDef } from '../../facet';
import { AxisOrient, VgAxis, VgMarkGroup } from '../../vega.schema';
import { Model } from '../model';
export declare type HeaderChannel = 'row' | 'column';
export declare const HEADER_CHANNELS: HeaderChannel[];
export declare type HeaderType = 'header' | 'footer';
export declare const HEADER_TYPES: HeaderType[];
/**
 * A component that represents all header, footers and title of a Vega group with layout directive.
 */
export interface LayoutHeaderComponent {
    title?: string;
    facetFieldDef?: FacetFieldDef<string>;
    /**
     * An array of header components for headers.
     * For facet, there should be only one header component, which is data-driven.
     * For repeat and concat, there can be multiple header components that explicitly list different axes.
     */
    header?: HeaderComponent[];
    /**
     * An array of header components for footers.
     * For facet, there should be only one header component, which is data-driven.
     * For repeat and concat, there can be multiple header components that explicitly list different axes.
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
export declare function getHeaderType(orient: AxisOrient): "header" | "footer";
export declare function getTitleGroup(model: Model, channel: HeaderChannel): {
    name: string;
    role: string;
    type: string;
    marks: {
        type: string;
        role: string;
        style: string;
    }[];
};
export declare function getHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[];
