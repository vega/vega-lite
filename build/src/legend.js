import { flagKeys } from './util';
export const defaultLegendConfig = {
    gradientHorizontalMaxLength: 200,
    gradientHorizontalMinLength: 100,
    gradientVerticalMaxLength: 200,
    gradientVerticalMinLength: 64 // This is the Vega's minimum.
};
const COMMON_LEGEND_PROPERTY_INDEX = {
    clipHeight: 1,
    columnPadding: 1,
    columns: 1,
    cornerRadius: 1,
    direction: 1,
    fillColor: 1,
    format: 1,
    gradientLength: 1,
    gradientOpacity: 1,
    gradientStrokeColor: 1,
    gradientStrokeWidth: 1,
    gradientThickness: 1,
    gridAlign: 1,
    labelAlign: 1,
    labelBaseline: 1,
    labelColor: 1,
    labelFont: 1,
    labelFontSize: 1,
    labelFontWeight: 1,
    labelLimit: 1,
    labelOffset: 1,
    labelOpacity: 1,
    labelOverlap: 1,
    labelPadding: 1,
    offset: 1,
    orient: 1,
    padding: 1,
    rowPadding: 1,
    strokeColor: 1,
    strokeWidth: 1,
    symbolFillColor: 1,
    symbolOffset: 1,
    symbolOpacity: 1,
    symbolSize: 1,
    symbolStrokeColor: 1,
    symbolStrokeWidth: 1,
    symbolType: 1,
    tickCount: 1,
    title: 1,
    titleAlign: 1,
    titleBaseline: 1,
    titleColor: 1,
    titleFont: 1,
    titleFontSize: 1,
    titleFontWeight: 1,
    titleLimit: 1,
    titleOpacity: 1,
    titlePadding: 1,
    type: 1,
    values: 1,
    zindex: 1
};
const VG_LEGEND_PROPERTY_INDEX = Object.assign({}, COMMON_LEGEND_PROPERTY_INDEX, { 
    // channel scales
    opacity: 1, shape: 1, stroke: 1, fill: 1, size: 1, 
    // encode
    encode: 1 });
export const LEGEND_PROPERTIES = flagKeys(COMMON_LEGEND_PROPERTY_INDEX);
export const VG_LEGEND_PROPERTIES = flagKeys(VG_LEGEND_PROPERTY_INDEX);
//# sourceMappingURL=legend.js.map