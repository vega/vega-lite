import { keys } from './util';
export const CONDITIONAL_AXIS_PROP_INDEX = {
    labelAlign: {
        part: 'labels',
        vgProp: 'align'
    },
    labelBaseline: {
        part: 'labels',
        vgProp: 'baseline'
    },
    labelColor: {
        part: 'labels',
        vgProp: 'fill'
    },
    labelFont: {
        part: 'labels',
        vgProp: 'font'
    },
    labelFontSize: {
        part: 'labels',
        vgProp: 'fontSize'
    },
    labelFontStyle: {
        part: 'labels',
        vgProp: 'fontStyle'
    },
    labelFontWeight: {
        part: 'labels',
        vgProp: 'fontWeight'
    },
    labelOpacity: {
        part: 'labels',
        vgProp: 'opacity'
    },
    labelOffset: null,
    labelPadding: null,
    gridColor: {
        part: 'grid',
        vgProp: 'stroke'
    },
    gridDash: {
        part: 'grid',
        vgProp: 'strokeDash'
    },
    gridDashOffset: {
        part: 'grid',
        vgProp: 'strokeDashOffset'
    },
    gridOpacity: {
        part: 'grid',
        vgProp: 'opacity'
    },
    gridWidth: {
        part: 'grid',
        vgProp: 'strokeWidth'
    },
    tickColor: {
        part: 'ticks',
        vgProp: 'stroke'
    },
    tickDash: {
        part: 'ticks',
        vgProp: 'strokeDash'
    },
    tickDashOffset: {
        part: 'ticks',
        vgProp: 'strokeDashOffset'
    },
    tickOpacity: {
        part: 'ticks',
        vgProp: 'opacity'
    },
    tickSize: null,
    tickWidth: {
        part: 'ticks',
        vgProp: 'strokeWidth'
    }
};
export function isConditionalAxisValue(v) {
    return v?.condition;
}
export const AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
/**
 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
 */
export const AXIS_PROPERTY_TYPE = {
    grid: 'grid',
    gridCap: 'grid',
    gridColor: 'grid',
    gridDash: 'grid',
    gridDashOffset: 'grid',
    gridOpacity: 'grid',
    gridScale: 'grid',
    gridWidth: 'grid',
    orient: 'main',
    bandPosition: 'both',
    aria: 'main',
    description: 'main',
    domain: 'main',
    domainCap: 'main',
    domainColor: 'main',
    domainDash: 'main',
    domainDashOffset: 'main',
    domainOpacity: 'main',
    domainWidth: 'main',
    format: 'main',
    formatType: 'main',
    labelAlign: 'main',
    labelAngle: 'main',
    labelBaseline: 'main',
    labelBound: 'main',
    labelColor: 'main',
    labelFlush: 'main',
    labelFlushOffset: 'main',
    labelFont: 'main',
    labelFontSize: 'main',
    labelFontStyle: 'main',
    labelFontWeight: 'main',
    labelLimit: 'main',
    labelLineHeight: 'main',
    labelOffset: 'main',
    labelOpacity: 'main',
    labelOverlap: 'main',
    labelPadding: 'main',
    labels: 'main',
    labelSeparation: 'main',
    maxExtent: 'main',
    minExtent: 'main',
    offset: 'both',
    position: 'main',
    tickCap: 'main',
    tickColor: 'main',
    tickDash: 'main',
    tickDashOffset: 'main',
    tickMinStep: 'both',
    tickOffset: 'both',
    tickOpacity: 'main',
    tickRound: 'both',
    ticks: 'main',
    tickSize: 'main',
    tickWidth: 'both',
    title: 'main',
    titleAlign: 'main',
    titleAnchor: 'main',
    titleAngle: 'main',
    titleBaseline: 'main',
    titleColor: 'main',
    titleFont: 'main',
    titleFontSize: 'main',
    titleFontStyle: 'main',
    titleFontWeight: 'main',
    titleLimit: 'main',
    titleLineHeight: 'main',
    titleOpacity: 'main',
    titlePadding: 'main',
    titleX: 'main',
    titleY: 'main',
    encode: 'both',
    scale: 'both',
    tickBand: 'both',
    tickCount: 'both',
    tickExtra: 'both',
    translate: 'both',
    values: 'both',
    zindex: 'both' // this is actually set afterward, so it doesn't matter
};
export const COMMON_AXIS_PROPERTIES_INDEX = {
    orient: 1,
    aria: 1,
    bandPosition: 1,
    description: 1,
    domain: 1,
    domainCap: 1,
    domainColor: 1,
    domainDash: 1,
    domainDashOffset: 1,
    domainOpacity: 1,
    domainWidth: 1,
    format: 1,
    formatType: 1,
    grid: 1,
    gridCap: 1,
    gridColor: 1,
    gridDash: 1,
    gridDashOffset: 1,
    gridOpacity: 1,
    gridWidth: 1,
    labelAlign: 1,
    labelAngle: 1,
    labelBaseline: 1,
    labelBound: 1,
    labelColor: 1,
    labelFlush: 1,
    labelFlushOffset: 1,
    labelFont: 1,
    labelFontSize: 1,
    labelFontStyle: 1,
    labelFontWeight: 1,
    labelLimit: 1,
    labelLineHeight: 1,
    labelOffset: 1,
    labelOpacity: 1,
    labelOverlap: 1,
    labelPadding: 1,
    labels: 1,
    labelSeparation: 1,
    maxExtent: 1,
    minExtent: 1,
    offset: 1,
    position: 1,
    tickBand: 1,
    tickCap: 1,
    tickColor: 1,
    tickCount: 1,
    tickDash: 1,
    tickDashOffset: 1,
    tickExtra: 1,
    tickMinStep: 1,
    tickOffset: 1,
    tickOpacity: 1,
    tickRound: 1,
    ticks: 1,
    tickSize: 1,
    tickWidth: 1,
    title: 1,
    titleAlign: 1,
    titleAnchor: 1,
    titleAngle: 1,
    titleBaseline: 1,
    titleColor: 1,
    titleFont: 1,
    titleFontSize: 1,
    titleFontStyle: 1,
    titleFontWeight: 1,
    titleLimit: 1,
    titleLineHeight: 1,
    titleOpacity: 1,
    titlePadding: 1,
    titleX: 1,
    titleY: 1,
    translate: 1,
    values: 1,
    zindex: 1
};
const AXIS_PROPERTIES_INDEX = {
    ...COMMON_AXIS_PROPERTIES_INDEX,
    style: 1,
    labelExpr: 1,
    encoding: 1
};
export function isAxisProperty(prop) {
    return !!AXIS_PROPERTIES_INDEX[prop];
}
// Export for dependent projects
export const AXIS_PROPERTIES = keys(AXIS_PROPERTIES_INDEX);
const AXIS_CONFIGS_INDEX = {
    axis: 1,
    axisBand: 1,
    axisBottom: 1,
    axisDiscrete: 1,
    axisLeft: 1,
    axisPoint: 1,
    axisQuantitative: 1,
    axisRight: 1,
    axisTemporal: 1,
    axisTop: 1,
    axisX: 1,
    axisXBand: 1,
    axisXDiscrete: 1,
    axisXPoint: 1,
    axisXQuantitative: 1,
    axisXTemporal: 1,
    axisY: 1,
    axisYBand: 1,
    axisYDiscrete: 1,
    axisYPoint: 1,
    axisYQuantitative: 1,
    axisYTemporal: 1
};
export const AXIS_CONFIGS = keys(AXIS_CONFIGS_INDEX);
//# sourceMappingURL=axis.js.map