"use strict";
var axis_1 = require("./axis");
var legend_1 = require("./legend");
var mark = require("./mark");
var scale_1 = require("./scale");
exports.defaultCellConfig = {
    width: 200,
    height: 200
};
exports.defaultFacetCellConfig = {
    stroke: '#ccc',
    strokeWidth: 1
};
var defaultFacetGridConfig = {
    color: '#000000',
    opacity: 0.4,
    offset: 0
};
exports.defaultFacetConfig = {
    axis: axis_1.defaultFacetAxisConfig,
    grid: defaultFacetGridConfig,
    cell: exports.defaultFacetCellConfig
};
exports.defaultOverlayConfig = {
    line: false,
    pointStyle: { filled: true },
    lineStyle: {}
};
exports.defaultConfig = {
    padding: 5,
    numberFormat: 's',
    timeFormat: '%b %d, %Y',
    countTitle: 'Number of Records',
    cell: exports.defaultCellConfig,
    mark: mark.defaultMarkConfig,
    area: mark.defaultAreaConfig,
    bar: mark.defaultBarConfig,
    circle: mark.defaultCircleConfig,
    line: mark.defaultLineConfig,
    point: mark.defaultPointConfig,
    rect: mark.defaultRectConfig,
    rule: mark.defaultRuleConfig,
    square: mark.defaultSquareConfig,
    text: mark.defaultTextConfig,
    label: mark.defaultLabelConfig,
    tick: mark.defaultTickConfig,
    overlay: exports.defaultOverlayConfig,
    scale: scale_1.defaultScaleConfig,
    axis: axis_1.defaultAxisConfig,
    legend: legend_1.defaultLegendConfig,
    facet: exports.defaultFacetConfig,
};
//# sourceMappingURL=config.js.map