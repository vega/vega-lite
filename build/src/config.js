"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    axis: {},
    axisX: {},
    axisY: {},
    axisLeft: {},
    axisRight: {},
    axisTop: {},
    axisBottom: {},
    axisBand: {},
    legend: legend_1.defaultLegendConfig,
    facet: exports.defaultFacetConfig,
    selection: selection_1.defaultConfig
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUEyRDtBQUUzRCw2QkFBK0I7QUFDL0IsaUNBQXdEO0FBQ3hELHlDQUFxRjtBQW9DeEUsUUFBQSxpQkFBaUIsR0FBZTtJQUMzQyxLQUFLLEVBQUUsR0FBRztJQUNWLE1BQU0sRUFBRSxHQUFHO0lBQ1gsSUFBSSxFQUFFLGFBQWE7Q0FDcEIsQ0FBQztBQUVXLFFBQUEsc0JBQXNCLEdBQWU7SUFDaEQsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUM7QUFtQkYsSUFBTSxzQkFBc0IsR0FBb0I7SUFDOUMsS0FBSyxFQUFFLFNBQVM7SUFDaEIsT0FBTyxFQUFFLEdBQUc7SUFDWixNQUFNLEVBQUUsQ0FBQztDQUNWLENBQUM7QUFFVyxRQUFBLGtCQUFrQixHQUFnQjtJQUM3QyxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxzQkFBc0I7SUFDNUIsSUFBSSxFQUFFLDhCQUFzQjtDQUM3QixDQUFDO0FBMEJXLFFBQUEsb0JBQW9CLEdBQWtCO0lBQ2pELElBQUksRUFBRSxLQUFLO0lBQ1gsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztJQUMxQixTQUFTLEVBQUUsRUFBRTtDQUNkLENBQUM7QUEySlcsUUFBQSxhQUFhLEdBQVc7SUFDbkMsT0FBTyxFQUFFLENBQUM7SUFDVixZQUFZLEVBQUUsR0FBRztJQUNqQixVQUFVLEVBQUUsV0FBVztJQUN2QixVQUFVLEVBQUUsbUJBQW1CO0lBRS9CLElBQUksRUFBRSx5QkFBaUI7SUFFdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDNUIsSUFBSSxFQUFFLEVBQUU7SUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtJQUMxQixNQUFNLEVBQUUsRUFBRTtJQUNWLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO0lBQ1IsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUU1QixPQUFPLEVBQUUsNEJBQW9CO0lBQzdCLEtBQUssRUFBRSwwQkFBa0I7SUFDekIsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtJQUNULEtBQUssRUFBRSxFQUFFO0lBQ1QsUUFBUSxFQUFFLEVBQUU7SUFDWixTQUFTLEVBQUUsRUFBRTtJQUNiLE9BQU8sRUFBRSxFQUFFO0lBQ1gsVUFBVSxFQUFFLEVBQUU7SUFDZCxRQUFRLEVBQUUsRUFBRTtJQUNaLE1BQU0sRUFBRSw0QkFBbUI7SUFFM0IsS0FBSyxFQUFFLDBCQUFrQjtJQUV6QixTQUFTLEVBQUUseUJBQXNCO0NBQ2xDLENBQUMifQ==