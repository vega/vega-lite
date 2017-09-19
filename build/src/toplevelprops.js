"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("util");
var log = require("./log");
function normalizeAutoSize(autosize, isUnitOrLayer) {
    if (!autosize) {
        return {
            type: 'pad'
        };
    }
    var autoSizeParams = tslib_1.__assign({ type: 'pad' }, (util_1.isString(autosize) ? { type: autosize } : autosize));
    if (autoSizeParams.type === 'fit') {
        if (!isUnitOrLayer) {
            log.warn(log.message.FIT_NON_SINGLE);
            autoSizeParams.type = 'pad';
        }
    }
    return autoSizeParams;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wbGV2ZWxwcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b3BsZXZlbHByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE4QjtBQUM5QiwyQkFBNkI7QUEwRDdCLDJCQUFrQyxRQUF1QyxFQUFFLGFBQXNCO0lBQy9GLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNkLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQztJQUNKLENBQUM7SUFDRCxJQUFNLGNBQWMsc0JBQ2xCLElBQUksRUFBRSxLQUFLLElBQ1IsQ0FBQyxlQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLEdBQUcsUUFBUSxDQUFDLENBQ3RELENBQUM7SUFFRixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNyQyxjQUFjLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDeEIsQ0FBQztBQW5CRCw4Q0FtQkM7QUFFRCxJQUFNLG9CQUFvQixHQUFpQztJQUN6RCxZQUFZLEVBQUUsU0FBUztJQUN2QixtSEFBbUg7Q0FDcEgsQ0FBQztBQUVGLG1DQUF3RSxDQUFJO0lBQzFFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQVBELDhEQU9DIn0=