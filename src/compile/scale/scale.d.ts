import { VgScale } from '../../vega.schema';
/** Scale suffix for scale used to get drive binned legends. */
export declare const BIN_LEGEND_SUFFIX = "_bin_legend";
/** Scale suffix for scale for binned field's legend labels, which maps a binned field's quantitative values to range strings. */
export declare const BIN_LEGEND_LABEL_SUFFIX = "_bin_legend_label";
export declare type ScaleComponent = VgScale;
export declare type ScaleComponents = {
    main: ScaleComponent;
    binLegend?: ScaleComponent;
    binLegendLabel?: ScaleComponent;
};
