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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLG1DQUF1QztBQU12QyxtQ0FBcUM7QUFDckMsaUNBQW1DO0FBRW5DOztHQUVHO0FBQ0gsNkJBQTRDLEtBQVk7SUFDdEQsK0NBQStDO0lBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVMsb0JBQW1DLEVBQUUsT0FBZ0I7UUFDM0YsSUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxHQUFHLGVBQWUsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzlCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFURCxzQ0FTQztBQUVZLFFBQUEsMkNBQTJDLEdBQW9CO0lBQzFFLE9BQU87SUFDUCxzQkFBc0I7SUFDdEIsT0FBTyxFQUFFLE1BQU07SUFDZixlQUFlO0lBQ2YsVUFBVSxFQUFFLGFBQWEsRUFBRSxNQUFNO0lBQ2pDLFVBQVU7SUFDVixTQUFTLEVBQUUsY0FBYyxFQUFFLGNBQWM7Q0FDMUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsb0JBQTJCLEtBQVksRUFBRSxPQUFnQjtJQUN2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWpDLElBQU0sY0FBYyxHQUFZO1FBQzlCLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDO1FBQ3pDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtRQUNoQixNQUFNLEVBQUUsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO1FBQ25DLEtBQUssRUFBRSxrQkFBVSxDQUFDLEtBQUssQ0FBQztLQUN6QixDQUFDO0lBRUYsbURBQTJDLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtRQUMzRCxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDckUsY0FBYyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDeEIsQ0FBQztBQXZCRCxnQ0F1QkMifQ==