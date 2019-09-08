import { keys } from './util';
export const CONDITIONAL_AXIS_PROP_INDEX = {
    labelAlign: {
        part: 'labels',
        vgProp: 'align'
    },
    labelBaseline: {
        part: 'labels',
        vgProp: 'align'
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
        vgProp: 'strokeDash'
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
        vgProp: 'strokeDash'
    },
    tickOpacity: {
        part: 'ticks',
        vgProp: 'opacity'
    },
    tickWidth: {
        part: 'ticks',
        vgProp: 'strokeWidth'
    }
};
export function isConditionalAxisValue(v) {
    return v['condition'];
}
export const AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
/**
 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
 * (Properties not listed are applicable for both)
 */
export const AXIS_PROPERTY_TYPE = {
    grid: 'grid',
    gridColor: 'grid',
    gridDash: 'grid',
    gridOpacity: 'grid',
    gridScale: 'grid',
    gridWidth: 'grid',
    orient: 'main',
    bandPosition: 'both',
    domain: 'main',
    domainColor: 'main',
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
    labelFontWeight: 'main',
    labelLimit: 'main',
    labelOpacity: 'main',
    labelOverlap: 'main',
    labelPadding: 'main',
    labels: 'main',
    maxExtent: 'main',
    minExtent: 'main',
    offset: 'main',
    position: 'main',
    tickColor: 'main',
    tickExtra: 'main',
    tickOffset: 'both',
    tickOpacity: 'main',
    tickRound: 'main',
    ticks: 'main',
    tickSize: 'main',
    title: 'main',
    titleAlign: 'main',
    titleAngle: 'main',
    titleBaseline: 'main',
    titleColor: 'main',
    titleFont: 'main',
    titleFontSize: 'main',
    titleFontWeight: 'main',
    titleLimit: 'main',
    titleOpacity: 'main',
    titlePadding: 'main',
    titleX: 'main',
    titleY: 'main',
    tickWidth: 'both',
    tickCount: 'both',
    values: 'both',
    scale: 'both',
    zindex: 'both' // this is actually set afterward, so it doesn't matter
};
export const COMMON_AXIS_PROPERTIES_INDEX = {
    orient: 1,
    bandPosition: 1,
    domain: 1,
    domainColor: 1,
    domainDash: 1,
    domainDashOffset: 1,
    domainOpacity: 1,
    domainWidth: 1,
    format: 1,
    formatType: 1,
    grid: 1,
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
    labelOpacity: 1,
    labelOverlap: 1,
    labelPadding: 1,
    labels: 1,
    labelSeparation: 1,
    maxExtent: 1,
    minExtent: 1,
    offset: 1,
    position: 1,
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
    titleOpacity: 1,
    titlePadding: 1,
    titleX: 1,
    titleY: 1,
    values: 1,
    zindex: 1
};
const AXIS_PROPERTIES_INDEX = Object.assign(Object.assign({}, COMMON_AXIS_PROPERTIES_INDEX), { labelExpr: 1, encoding: 1 });
export function isAxisProperty(prop) {
    return !!AXIS_PROPERTIES_INDEX[prop];
}
// Export for dependent projects
export const AXIS_PROPERTIES = keys(AXIS_PROPERTIES_INDEX);
//# sourceMappingURL=axis.js.map