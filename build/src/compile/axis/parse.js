"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axis_1 = require("../../axis");
var encode = require("./encode");
var rules = require("./rules");
var util_1 = require("../../util");
var AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
function parseAxisComponent(model, axisChannels) {
    return axisChannels.reduce(function (axis, channel) {
        var vgAxes = [];
        if (model.axis(channel)) {
            var main = parseMainAxis(channel, model);
            if (main && isVisibleAxis(main)) {
                vgAxes.push(main);
            }
            var grid = parseGridAxis(channel, model);
            if (grid && isVisibleAxis(grid)) {
                vgAxes.push(grid);
            }
            if (vgAxes.length > 0) {
                axis[channel] = vgAxes;
            }
        }
        return axis;
    }, {});
}
exports.parseAxisComponent = parseAxisComponent;
function isFalseOrNull(v) {
    return v === false || v === null;
}
/**
 * Return if an axis is visible (shows at least one part of the axis).
 */
function isVisibleAxis(axis) {
    return util_1.some(AXIS_PARTS, function (part) { return hasAxisPart(axis, part); });
}
function hasAxisPart(axis, part) {
    // FIXME this method can be wrong if users use a Vega theme.
    // (Not sure how to correctly handle that yet.).
    if (part === 'grid' || part === 'title') {
        return !!axis[part];
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(axis[part]);
}
/**
 * Make an inner axis for showing grid for shared axis.
 */
function parseGridAxis(channel, model) {
    // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
    return parseAxis(channel, model, true);
}
exports.parseGridAxis = parseGridAxis;
function parseMainAxis(channel, model) {
    return parseAxis(channel, model, false);
}
exports.parseMainAxis = parseMainAxis;
function parseAxis(channel, model, isGridAxis) {
    var axis = model.axis(channel);
    var vgAxis = {
        scale: model.scaleName(channel)
    };
    // 1.2. Add properties
    axis_1.AXIS_PROPERTIES.forEach(function (property) {
        var value = getSpecifiedOrDefaultValue(property, axis, channel, model, isGridAxis);
        if (value !== undefined) {
            vgAxis[property] = value;
        }
    });
    // Special case for gridScale since gridScale is not a Vega-Lite Axis property.
    var gridScale = getSpecifiedOrDefaultValue('gridScale', axis, channel, model, isGridAxis);
    if (gridScale !== undefined) {
        vgAxis.gridScale = gridScale;
    }
    // 2) Add guide encode definition groups
    var encodeSpec = axis.encode || {};
    AXIS_PARTS.forEach(function (part) {
        if (!hasAxisPart(vgAxis, part)) {
            // No need to create encode for a disabled part.
            return;
        }
        // TODO(@yuhanlu): instead of calling encode[part], break this line based on part type
        // as different require different parameters.
        var value;
        if (part === 'labels') {
            value = encode.labels(model, channel, encodeSpec.labels || {}, vgAxis);
        }
        else {
            value = encodeSpec[part] || {};
        }
        if (value !== undefined && util_1.keys(value).length > 0) {
            vgAxis.encode = vgAxis.encode || {};
            vgAxis.encode[part] = { update: value };
        }
    });
    return vgAxis;
}
function getSpecifiedOrDefaultValue(property, specifiedAxis, channel, model, isGridAxis) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'labels':
            return isGridAxis ? false : specifiedAxis[property];
        case 'domain':
            return rules.domain(property, specifiedAxis, isGridAxis, channel);
        case 'ticks':
            return rules.ticks(property, specifiedAxis, isGridAxis, channel);
        case 'format':
            return rules.format(specifiedAxis, channel, fieldDef, model.config);
        case 'grid':
            return rules.grid(model, channel, isGridAxis); // FIXME: refactor this
        case 'gridScale':
            return rules.gridScale(model, channel, isGridAxis);
        case 'orient':
            return rules.orient(specifiedAxis, channel);
        case 'tickCount':
            return rules.tickCount(specifiedAxis, channel, fieldDef); // TODO: scaleType
        case 'title':
            return rules.title(specifiedAxis, fieldDef, model.config, isGridAxis);
        case 'values':
            return rules.values(specifiedAxis);
        case 'zindex':
            return rules.zindex(specifiedAxis, isGridAxis);
    }
    // Otherwise, return specified property.
    return specifiedAxis[property];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWlEO0FBSWpELGlDQUFtQztBQUNuQywrQkFBaUM7QUFFakMsbUNBQTRDO0FBSTVDLElBQU0sVUFBVSxHQUFlLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTlFLDRCQUFtQyxLQUFZLEVBQUUsWUFBdUI7SUFDdEUsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMvQyxJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3pCLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFwQkQsZ0RBb0JDO0FBRUQsdUJBQXVCLENBQWlCO0lBQ3RDLE1BQU0sQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUM7QUFDbkMsQ0FBQztBQUVEOztHQUVHO0FBQ0gsdUJBQXVCLElBQVk7SUFDakMsTUFBTSxDQUFDLFdBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxJQUFJLElBQUssT0FBQSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVELHFCQUFxQixJQUFZLEVBQUUsSUFBYztJQUMvQyw0REFBNEQ7SUFDNUQsZ0RBQWdEO0lBRWhELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUNELDJFQUEyRTtJQUMzRSxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVEOztHQUVHO0FBQ0gsdUJBQThCLE9BQWdCLEVBQUUsS0FBWTtJQUMxRCxrRkFBa0Y7SUFDbEYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFIRCxzQ0FHQztBQUVELHVCQUE4QixPQUFnQixFQUFFLEtBQVk7SUFDMUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFGRCxzQ0FFQztBQUVELG1CQUFtQixPQUFnQixFQUFFLEtBQVksRUFBRSxVQUFtQjtJQUNwRSxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWpDLElBQU0sTUFBTSxHQUFXO1FBQ3JCLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztLQUNoQyxDQUFDO0lBRUYsc0JBQXNCO0lBQ3RCLHNCQUFlLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtRQUN2QyxJQUFNLEtBQUssR0FBRywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckYsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUMzQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCwrRUFBK0U7SUFDL0UsSUFBTSxTQUFTLEdBQUcsMEJBQTBCLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFFRCx3Q0FBd0M7SUFFeEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDckMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7UUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixnREFBZ0Q7WUFDaEQsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUNELHNGQUFzRjtRQUN0Riw2Q0FBNkM7UUFDN0MsSUFBSSxLQUFLLENBQUM7UUFDVixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwQixLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLFdBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsb0NBQW9DLFFBQXNCLEVBQUUsYUFBbUIsRUFBRSxPQUFnQixFQUFFLEtBQVksRUFBRSxVQUFtQjtJQUNsSSxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDakIsS0FBSyxRQUFRO1lBQ1gsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BFLEtBQUssT0FBTztZQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RSxLQUFLLE1BQU07WUFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCO1FBQ3hFLEtBQUssV0FBVztZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckQsS0FBSyxRQUFRO1lBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLEtBQUssV0FBVztZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQkFBa0I7UUFDOUUsS0FBSyxPQUFPO1lBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JDLEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0Qsd0NBQXdDO0lBQ3hDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsQ0FBQyJ9