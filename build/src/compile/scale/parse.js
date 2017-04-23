"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach(function (property) {
        scaleComponent[property] = scale[property];
    });
    if (sort && (sort_1.isSortField(sort) ? sort.order : sort) === 'descending') {
        scaleComponent.reverse = true;
    }
    return scaleComponent;
}
exports.parseScale = parseScale;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLG1DQUF1QztBQU12QyxtQ0FBcUM7QUFDckMsaUNBQW1DO0FBRW5DOztHQUVHO0FBQ0gsNkJBQTRDLEtBQWdCO0lBQzFELCtDQUErQztJQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFTLG9CQUFtQyxFQUFFLE9BQWdCO1FBQzNGLElBQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQixvQkFBb0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxlQUFlLENBQUM7UUFDbEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQUM5QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBVEQsc0NBU0M7QUFFWSxRQUFBLDJDQUEyQyxHQUFvQjtJQUMxRSxPQUFPO0lBQ1Asc0JBQXNCO0lBQ3RCLE9BQU8sRUFBRSxNQUFNO0lBQ2YsZUFBZTtJQUNmLFVBQVUsRUFBRSxhQUFhLEVBQUUsTUFBTTtJQUNqQyxVQUFVO0lBQ1YsU0FBUyxFQUFFLGNBQWMsRUFBRSxjQUFjO0NBQzFDLENBQUM7QUFFRjs7R0FFRztBQUNILG9CQUEyQixLQUFnQixFQUFFLE9BQWdCO0lBQzNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFakMsSUFBTSxjQUFjLEdBQVk7UUFDOUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUM7UUFDekMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLE1BQU0sRUFBRSxvQkFBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7UUFDbkMsS0FBSyxFQUFFLGtCQUFVLENBQUMsS0FBSyxDQUFDO0tBQ3pCLENBQUM7SUFFRixtREFBMkMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO1FBQzNELGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNyRSxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FBdkJELGdDQXVCQyJ9