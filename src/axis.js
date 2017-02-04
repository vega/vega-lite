"use strict";
// TODO: add comment for properties that we rely on Vega's default to produce
// more concise Vega output.
exports.defaultAxisConfig = {
    labelMaxLength: 25,
};
exports.defaultFacetAxisConfig = {
    axisWidth: 0,
    // TODO: remove these
    domain: false,
    grid: false,
    ticks: false
};
exports.AXIS_PROPERTIES = [
    // a) properties with special rules (so it has axis[property] methods) -- call rule functions
    'domain', 'format', 'labels', 'grid', 'orient', 'ticks', 'tickSize', 'tickCount', 'title', 'values', 'zindex',
    // b) properties without rules, only produce default values in the schema, or explicit value if specified
    'labelPadding', 'maxExtent', 'minExtent', 'offset', 'position', 'subdivide', 'tickPadding', 'tickSize', 'tickSizeEnd',
    'tickSizeMajor', 'tickSizeMinor', 'titleOffset', 'titlePadding'
];
//# sourceMappingURL=axis.js.map