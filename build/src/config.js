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
exports.defaultFacetConfig = {
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
    box: { size: 14 },
    boxWhisker: {},
    boxMid: {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLG1DQUEyRDtBQUUzRCw2QkFBK0I7QUFDL0IsaUNBQXdEO0FBQ3hELHlDQUFxRjtBQUdyRiwrQkFBNEM7QUFtRi9CLFFBQUEsaUJBQWlCLEdBQWU7SUFDM0MsS0FBSyxFQUFFLEdBQUc7SUFDVixNQUFNLEVBQUUsR0FBRztJQUNYLElBQUksRUFBRSxhQUFhO0NBQ3BCLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFlO0lBQ2hELE1BQU0sRUFBRSxNQUFNO0lBQ2QsV0FBVyxFQUFFLENBQUM7Q0FDZixDQUFDO0FBUVcsUUFBQSxrQkFBa0IsR0FBZ0I7SUFDN0MsSUFBSSxFQUFFLDhCQUFzQjtDQUM3QixDQUFDO0FBa0JXLFFBQUEsb0JBQW9CLEdBQWtCO0lBQ2pELElBQUksRUFBRSxLQUFLO0NBQ1osQ0FBQztBQWlLVyxRQUFBLGFBQWEsR0FBVztJQUNuQyxPQUFPLEVBQUUsQ0FBQztJQUNWLFlBQVksRUFBRSxHQUFHO0lBQ2pCLFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFVBQVUsRUFBRSxtQkFBbUI7SUFFL0IsSUFBSSxFQUFFLHlCQUFpQjtJQUV2QixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUM1QixJQUFJLEVBQUUsRUFBRTtJQUNSLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO0lBQzFCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtJQUNULElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBRTVCLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUM7SUFDZixVQUFVLEVBQUUsRUFBRTtJQUNkLE1BQU0sRUFBRSxFQUFFO0lBRVYsT0FBTyxFQUFFLDRCQUFvQjtJQUM3QixLQUFLLEVBQUUsMEJBQWtCO0lBQ3pCLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxLQUFLLEVBQUUsRUFBRTtJQUNULFFBQVEsRUFBRSxFQUFFO0lBQ1osU0FBUyxFQUFFLEVBQUU7SUFDYixPQUFPLEVBQUUsRUFBRTtJQUNYLFVBQVUsRUFBRSxFQUFFO0lBQ2QsUUFBUSxFQUFFLEVBQUU7SUFDWixNQUFNLEVBQUUsNEJBQW1CO0lBRTNCLEtBQUssRUFBRSwwQkFBa0I7SUFFekIsU0FBUyxFQUFFLHlCQUFzQjtDQUNsQyxDQUFDO0FBRUYsb0JBQTJCLE1BQWM7SUFDdkMsTUFBTSxDQUFDLGdCQUFTLENBQUMsZ0JBQVMsQ0FBQyxxQkFBYSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUZELGdDQUVDIn0=