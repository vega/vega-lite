"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
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
    return scaleComponent;
}
exports.parseScale = parseScale;
/**
 * Move scale from child up.
 */
function moveSharedScaleUp(model, scaleComponent, child, channel) {
    // TODO: Check whether the scales are actually compatible and merge them, e.g. they shoud use the same sort or throw error
    var childScale = child.component.scales[channel];
    var modelScale = scaleComponent[channel];
    if (modelScale) {
        modelScale.domain = domain_1.unionDomains(modelScale.domain, childScale.domain);
    }
    else {
        modelScale = scaleComponent[channel] = childScale;
    }
    // rename child scale to parent scales
    var scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
    var newName = model.scaleName(scaleNameWithoutPrefix, true);
    child.renameScale(childScale.name, newName);
    childScale.name = newName;
    // remove merged scales from children
    delete child.component.scales[channel];
    return modelScale;
}
exports.moveSharedScaleUp = moveSharedScaleUp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFxRDtBQVNyRCxtQ0FBbUQ7QUFDbkQsaUNBQW1DO0FBRW5DOztHQUVHO0FBQ0gsNkJBQTRDLEtBQWdCO0lBQzFELCtDQUErQztJQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFTLG9CQUF5QyxFQUFFLE9BQWdCO1FBQ2pHLElBQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQixvQkFBb0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxlQUFlLENBQUM7UUFDbEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQUM5QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBVEQsc0NBU0M7QUFFWSxRQUFBLDJDQUEyQyxHQUFvQjtJQUMxRSxPQUFPO0lBQ1Asc0JBQXNCO0lBQ3RCLE9BQU8sRUFBRSxNQUFNO0lBQ2YsZUFBZTtJQUNmLFVBQVUsRUFBRSxhQUFhLEVBQUUsTUFBTTtJQUNqQyxVQUFVO0lBQ1YsU0FBUyxFQUFFLGNBQWMsRUFBRSxjQUFjO0NBQzFDLENBQUM7QUFFRjs7R0FFRztBQUNILG9CQUEyQixLQUFnQixFQUFFLE9BQWdCO0lBQzNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFakMsSUFBTSxjQUFjLEdBQVk7UUFDOUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUM7UUFDekMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLE1BQU0sRUFBRSxvQkFBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7UUFDbkMsS0FBSyxFQUFFLGtCQUFVLENBQUMsS0FBSyxDQUFDO0tBQ3pCLENBQUM7SUFFRixFQUFFLENBQUMsQ0FBQyx5QkFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLGNBQWMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBRUQsbURBQTJDLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtRQUMzRCxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FBeEJELGdDQXdCQztBQUVEOztHQUVHO0FBQ0gsMkJBQWtDLEtBQVksRUFBRSxjQUFvQyxFQUFFLEtBQVksRUFBRSxPQUFnQjtJQUNsSCwwSEFBMEg7SUFFMUgsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkQsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZixVQUFVLENBQUMsTUFBTSxHQUFHLHFCQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sVUFBVSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDcEQsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxJQUFNLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEYsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsVUFBVSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFFMUIscUNBQXFDO0lBQ3JDLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFdkMsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBdEJELDhDQXNCQyJ9