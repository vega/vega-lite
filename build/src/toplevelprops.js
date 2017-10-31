"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("util");
var log = require("./log");
function _normalizeAutoSize(autosize) {
    return util_1.isString(autosize) ? { type: autosize } : autosize || {};
}
function normalizeAutoSize(topLevelAutosize, configAutosize, isUnitOrLayer) {
    if (isUnitOrLayer === void 0) { isUnitOrLayer = true; }
    var autosize = tslib_1.__assign({ type: 'pad' }, _normalizeAutoSize(configAutosize), _normalizeAutoSize(topLevelAutosize));
    if (autosize.type === 'fit') {
        if (!isUnitOrLayer) {
            log.warn(log.message.FIT_NON_SINGLE);
            autosize.type = 'pad';
        }
    }
    return autosize;
}
exports.normalizeAutoSize = normalizeAutoSize;
var TOP_LEVEL_PROPERTIES = [
    'background', 'padding'
    // We do not include "autosize" here as it is supported by only unit and layer specs and thus need to be normalized
];
function extractTopLevelProperties(t) {
    return TOP_LEVEL_PROPERTIES.reduce(function (o, p) {
        if (t && t[p] !== undefined) {
            o[p] = t[p];
        }
        return o;
    }, {});
}
exports.extractTopLevelProperties = extractTopLevelProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wbGV2ZWxwcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b3BsZXZlbHByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE4QjtBQUM5QiwyQkFBNkI7QUEwRDdCLDRCQUE0QixRQUF1QztJQUNqRSxNQUFNLENBQUMsZUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUNoRSxDQUFDO0FBRUQsMkJBQWtDLGdCQUErQyxFQUFFLGNBQTZDLEVBQUUsYUFBNkI7SUFBN0IsOEJBQUEsRUFBQSxvQkFBNkI7SUFDN0osSUFBTSxRQUFRLHNCQUNaLElBQUksRUFBRSxLQUFLLElBQ1Isa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQ2xDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQ3hDLENBQUM7SUFFRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQWZELDhDQWVDO0FBRUQsSUFBTSxvQkFBb0IsR0FBaUM7SUFDekQsWUFBWSxFQUFFLFNBQVM7SUFDdkIsbUhBQW1IO0NBQ3BILENBQUM7QUFFRixtQ0FBd0UsQ0FBSTtJQUMxRSxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFQRCw4REFPQyJ9