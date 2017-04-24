"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var domain_1 = require("./domain");
var range_1 = require("./range");
/**
 * Parse scales for all channels of a model.
 */
function parseScaleComponent(model) {
    // TODO: should model.channels() inlcude X2/Y2?
    return model.channels().reduce(function (scaleComponentsIndex, channel) {
        var scaleComponents = parseScale(model, channel);
        if (scaleComponents) {
            scaleComponentsIndex[channel] = scaleComponents;
        }
        return scaleComponentsIndex;
    }, {});
}
exports.default = parseScaleComponent;
exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = [
    'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'interpolate', 'zero',
    // ordinal
    'padding', 'paddingInner', 'paddingOuter',
];
/**
 * Parse scales for a single channel of a model.
 */
function parseScale(model, channel) {
    if (!model.scale(channel)) {
        return null;
    }
    var scale = model.scale(channel);
    var sort = model.sort(channel);
    var scaleComponent = {
        name: model.scaleName(channel + '', true),
        type: scale.type,
        domain: domain_1.parseDomain(model, channel),
        range: range_1.parseRange(scale)
    };
    if (scale_1.isSelectionDomain(scale.domain)) {
        scaleComponent.domainRaw = scale.domain;
    }
    exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach(function (property) {
        scaleComponent[property] = scale[property];
    });
    if (sort && (sort_1.isSortField(sort) ? sort.order : sort) === 'descending') {
        scaleComponent.reverse = true;
    }
    return scaleComponent;
}
exports.parseScale = parseScale;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFxRDtBQUNyRCxtQ0FBdUM7QUFNdkMsbUNBQXFDO0FBQ3JDLGlDQUFtQztBQUVuQzs7R0FFRztBQUNILDZCQUE0QyxLQUFnQjtJQUMxRCwrQ0FBK0M7SUFDL0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBUyxvQkFBbUMsRUFBRSxPQUFnQjtRQUMzRixJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsb0JBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUcsZUFBZSxDQUFDO1FBQ2xELENBQUM7UUFDRCxNQUFNLENBQUMsb0JBQW9CLENBQUM7SUFDOUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQVRELHNDQVNDO0FBRVksUUFBQSwyQ0FBMkMsR0FBb0I7SUFDMUUsT0FBTztJQUNQLHNCQUFzQjtJQUN0QixPQUFPLEVBQUUsTUFBTTtJQUNmLGVBQWU7SUFDZixVQUFVLEVBQUUsYUFBYSxFQUFFLE1BQU07SUFDakMsVUFBVTtJQUNWLFNBQVMsRUFBRSxjQUFjLEVBQUUsY0FBYztDQUMxQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxvQkFBMkIsS0FBZ0IsRUFBRSxPQUFnQjtJQUMzRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWpDLElBQU0sY0FBYyxHQUFZO1FBQzlCLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDO1FBQ3pDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtRQUNoQixNQUFNLEVBQUUsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO1FBQ25DLEtBQUssRUFBRSxrQkFBVSxDQUFDLEtBQUssQ0FBQztLQUN6QixDQUFDO0lBRUYsRUFBRSxDQUFDLENBQUMseUJBQWlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxjQUFjLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDMUMsQ0FBQztJQUVELG1EQUEyQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7UUFDM0QsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLGNBQWMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUEzQkQsZ0NBMkJDIn0=