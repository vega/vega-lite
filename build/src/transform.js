"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter_1 = require("./filter");
var logical_1 = require("./logical");
function isFilter(t) {
    return t['filter'] !== undefined;
}
exports.isFilter = isFilter;
function isLookup(t) {
    return t['lookup'] !== undefined;
}
exports.isLookup = isLookup;
function isCalculate(t) {
    return t['calculate'] !== undefined;
}
exports.isCalculate = isCalculate;
function isBin(t) {
    return !!t['bin'];
}
exports.isBin = isBin;
function isTimeUnit(t) {
    return t['timeUnit'] !== undefined;
}
exports.isTimeUnit = isTimeUnit;
function isSummarize(t) {
    return t['summarize'] !== undefined;
}
exports.isSummarize = isSummarize;
function normalizeTransform(transform) {
    return transform.map(function (t) {
        if (isFilter(t)) {
            return {
                filter: logical_1.normalizeLogicalOperand(t.filter, filter_1.normalizeFilter)
            };
        }
        return t;
    });
}
exports.normalizeTransform = normalizeTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG1DQUFpRDtBQUNqRCxxQ0FBa0U7QUFXbEUsa0JBQXlCLENBQVk7SUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDbkMsQ0FBQztBQUZELDRCQUVDO0FBbUhELGtCQUF5QixDQUFZO0lBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ25DLENBQUM7QUFGRCw0QkFFQztBQUVELHFCQUE0QixDQUFZO0lBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3RDLENBQUM7QUFGRCxrQ0FFQztBQUVELGVBQXNCLENBQVk7SUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUZELHNCQUVDO0FBRUQsb0JBQTJCLENBQVk7SUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGdDQUVDO0FBRUQscUJBQTRCLENBQVk7SUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdEMsQ0FBQztBQUZELGtDQUVDO0FBSUQsNEJBQW1DLFNBQXNCO0lBQ3ZELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztRQUNwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQztnQkFDTCxNQUFNLEVBQUUsaUNBQXVCLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSx3QkFBZSxDQUFDO2FBQzNELENBQUM7UUFDSixDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVRELGdEQVNDIn0=