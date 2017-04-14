"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legend_1 = require("./legend");
var mark = require("./mark");
var scale_1 = require("./scale");
var selection_1 = require("./selection");
var util_1 = require("./util");
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
    line: false
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
    selection: selection_1.defaultConfig,
};
function initConfig(config) {
    return util_1.mergeDeep(util_1.duplicate(exports.defaultConfig), config);
}
exports.initConfig = initConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUEyRDtBQUUzRCw2QkFBK0I7QUFDL0IsaUNBQXdEO0FBQ3hELHlDQUFxRjtBQUdyRiwrQkFBNEM7QUFtRi9CLFFBQUEsaUJBQWlCLEdBQWU7SUFDM0MsS0FBSyxFQUFFLEdBQUc7SUFDVixNQUFNLEVBQUUsR0FBRztJQUNYLElBQUksRUFBRSxhQUFhO0NBQ3BCLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFlO0lBQ2hELE1BQU0sRUFBRSxNQUFNO0lBQ2QsV0FBVyxFQUFFLENBQUM7Q0FDZixDQUFDO0FBNkJGLElBQU0sc0JBQXNCLEdBQW9CO0lBQzlDLEtBQUssRUFBRSxTQUFTO0lBQ2hCLE9BQU8sRUFBRSxHQUFHO0lBQ1osTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBZ0I7SUFDN0MsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsc0JBQXNCO0lBQzVCLElBQUksRUFBRSw4QkFBc0I7Q0FDN0IsQ0FBQztBQWtCVyxRQUFBLG9CQUFvQixHQUFrQjtJQUNqRCxJQUFJLEVBQUUsS0FBSztDQUNaLENBQUM7QUEwSlcsUUFBQSxhQUFhLEdBQVc7SUFDbkMsT0FBTyxFQUFFLENBQUM7SUFDVixZQUFZLEVBQUUsR0FBRztJQUNqQixVQUFVLEVBQUUsV0FBVztJQUN2QixVQUFVLEVBQUUsbUJBQW1CO0lBRS9CLElBQUksRUFBRSx5QkFBaUI7SUFFdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDNUIsSUFBSSxFQUFFLEVBQUU7SUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtJQUMxQixNQUFNLEVBQUUsRUFBRTtJQUNWLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO0lBQ1IsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUU1QixPQUFPLEVBQUUsNEJBQW9CO0lBQzdCLEtBQUssRUFBRSwwQkFBa0I7SUFDekIsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtJQUNULEtBQUssRUFBRSxFQUFFO0lBQ1QsUUFBUSxFQUFFLEVBQUU7SUFDWixTQUFTLEVBQUUsRUFBRTtJQUNiLE9BQU8sRUFBRSxFQUFFO0lBQ1gsVUFBVSxFQUFFLEVBQUU7SUFDZCxRQUFRLEVBQUUsRUFBRTtJQUNaLE1BQU0sRUFBRSw0QkFBbUI7SUFFM0IsS0FBSyxFQUFFLDBCQUFrQjtJQUV6QixTQUFTLEVBQUUseUJBQXNCO0NBQ2xDLENBQUM7QUFFRixvQkFBMkIsTUFBYztJQUN2QyxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxnQkFBUyxDQUFDLHFCQUFhLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRkQsZ0NBRUMifQ==