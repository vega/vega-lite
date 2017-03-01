"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axis_1 = require("./axis");
var legend_1 = require("./legend");
var mark = require("./mark");
var scale_1 = require("./scale");
var selection_1 = require("./selection");
exports.defaultCellConfig = {
    width: 200,
    height: 200,
    fill: 'transparent'
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
    axis: {},
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
    area: {},
    bar: mark.defaultBarConfig,
    circle: {},
    line: {},
    point: {},
    rect: {},
    rule: {},
    square: {},
    text: mark.defaultTextConfig,
    tick: mark.defaultTickConfig,
    overlay: exports.defaultOverlayConfig,
    scale: scale_1.defaultScaleConfig,
    axis: axis_1.defaultAxisConfig,
    legend: legend_1.defaultLegendConfig,
    facet: exports.defaultFacetConfig,
    selection: selection_1.defaultConfig
};
//# sourceMappingURL=config.js.map