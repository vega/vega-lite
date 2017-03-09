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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFxRDtBQUNyRCxtQ0FBMkQ7QUFFM0QsNkJBQStCO0FBQy9CLGlDQUF3RDtBQUl4RCx5Q0FBcUY7QUFpQ3hFLFFBQUEsaUJBQWlCLEdBQWU7SUFDM0MsS0FBSyxFQUFFLEdBQUc7SUFDVixNQUFNLEVBQUUsR0FBRztJQUNYLElBQUksRUFBRSxhQUFhO0NBQ3BCLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFlO0lBQ2hELE1BQU0sRUFBRSxNQUFNO0lBQ2QsV0FBVyxFQUFFLENBQUM7Q0FDZixDQUFDO0FBbUJGLElBQU0sc0JBQXNCLEdBQW9CO0lBQzlDLEtBQUssRUFBRSxTQUFTO0lBQ2hCLE9BQU8sRUFBRSxHQUFHO0lBQ1osTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBZ0I7SUFDN0MsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsc0JBQXNCO0lBQzVCLElBQUksRUFBRSw4QkFBc0I7Q0FDN0IsQ0FBQztBQTBCVyxRQUFBLG9CQUFvQixHQUFrQjtJQUNqRCxJQUFJLEVBQUUsS0FBSztJQUNYLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7SUFDMUIsU0FBUyxFQUFFLEVBQUU7Q0FDZCxDQUFDO0FBaUhXLFFBQUEsYUFBYSxHQUFXO0lBQ25DLE9BQU8sRUFBRSxDQUFDO0lBQ1YsWUFBWSxFQUFFLEdBQUc7SUFDakIsVUFBVSxFQUFFLFdBQVc7SUFDdkIsVUFBVSxFQUFFLG1CQUFtQjtJQUUvQixJQUFJLEVBQUUseUJBQWlCO0lBRXZCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBQzVCLElBQUksRUFBRSxFQUFFO0lBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7SUFDMUIsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0lBQ1QsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsRUFBRTtJQUNSLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFFNUIsT0FBTyxFQUFFLDRCQUFvQjtJQUM3QixLQUFLLEVBQUUsMEJBQWtCO0lBQ3pCLElBQUksRUFBRSx3QkFBaUI7SUFDdkIsTUFBTSxFQUFFLDRCQUFtQjtJQUUzQixLQUFLLEVBQUUsMEJBQWtCO0lBRXpCLFNBQVMsRUFBRSx5QkFBc0I7Q0FDbEMsQ0FBQyJ9