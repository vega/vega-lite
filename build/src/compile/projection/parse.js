"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var data_1 = require("../../data");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var projection_1 = require("../../projection");
var type_1 = require("../../type");
var util_1 = require("../../util");
var model_1 = require("../model");
var component_1 = require("./component");
function parseProjection(model) {
    if (model_1.isUnitModel(model)) {
        model.component.projection = parseUnitProjection(model);
    }
    else {
        // because parse happens from leaves up (unit specs before layer spec),
        // we can be sure that the above if statement has already occurred
        // and therefore we have access to child.component.projection
        // for each of model's children
        model.component.projection = parseNonUnitProjections(model);
    }
}
exports.parseProjection = parseProjection;
function parseUnitProjection(model) {
    var specifiedProjection = model.specifiedProjection, markDef = model.markDef, config = model.config, encoding = model.encoding;
    var isGeoShapeMark = markDef && markDef.type === mark_1.GEOSHAPE;
    var isGeoPointOrLineMark = encoding && [channel_1.X, channel_1.Y, channel_1.X2, channel_1.Y2].some(function (channel) {
        var def = encoding[channel];
        return fielddef_1.isFieldDef(def) && util_1.contains([type_1.LATITUDE, type_1.LONGITUDE], def.type);
    });
    if (isGeoShapeMark || isGeoPointOrLineMark) {
        var data_2 = [];
        [[channel_1.X, channel_1.Y], [channel_1.X2, channel_1.Y2]].forEach(function (posssiblePair) {
            if (model.channelHasField(posssiblePair[0]) || model.channelHasField(posssiblePair[1])) {
                data_2.push({
                    signal: model.getName("geojson_" + data_2.length)
                });
            }
        });
        if (model.channelHasField(channel_1.SHAPE) && model.fieldDef(channel_1.SHAPE).type === type_1.GEOJSON) {
            data_2.push({
                signal: model.getName("geojson_" + data_2.length)
            });
        }
        if (data_2.length === 0) {
            // main source is geojson, so we can just use that
            data_2.push(model.requestDataName(data_1.MAIN));
        }
        return new component_1.ProjectionComponent(model.projectionName(true), __assign({}, (config.projection || {}), (specifiedProjection || {})), [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')], data_2);
    }
    return undefined;
}
function mergeIfNoConflict(first, second) {
    var allPropertiesShared = util_1.every(projection_1.PROJECTION_PROPERTIES, function (prop) {
        // neither has the poperty
        if (!first.explicit.hasOwnProperty(prop) &&
            !second.explicit.hasOwnProperty(prop)) {
            return true;
        }
        // both have property and an equal value for property
        if (first.explicit.hasOwnProperty(prop) &&
            second.explicit.hasOwnProperty(prop) &&
            // some properties might be signals or objects and require hashing for comparison
            util_1.stringify(first.get(prop)) === util_1.stringify(second.get(prop))) {
            return true;
        }
        return false;
    });
    var size = util_1.stringify(first.size) === util_1.stringify(second.size);
    if (size) {
        if (allPropertiesShared) {
            return first;
        }
        else if (util_1.stringify(first.explicit) === util_1.stringify({})) {
            return second;
        }
        else if (util_1.stringify(second.explicit) === util_1.stringify({})) {
            return first;
        }
    }
    // if all properties don't match, let each unit spec have its own projection
    return null;
}
function parseNonUnitProjections(model) {
    if (model.children.length === 0) {
        return undefined;
    }
    var nonUnitProjection;
    var mergable = util_1.every(model.children, function (child) {
        parseProjection(child);
        var projection = child.component.projection;
        if (!projection) {
            // child layer does not use a projection
            return true;
        }
        else if (!nonUnitProjection) {
            // cached 'projection' is null, cache this one
            nonUnitProjection = projection;
            return true;
        }
        else {
            var merge = mergeIfNoConflict(nonUnitProjection, projection);
            if (merge) {
                nonUnitProjection = merge;
            }
            return !!merge;
        }
    });
    // it cached one and all other children share the same projection,
    if (nonUnitProjection && mergable) {
        // so we can elevate it to the layer level
        var name_1 = model.projectionName(true);
        var modelProjection_1 = new component_1.ProjectionComponent(name_1, nonUnitProjection.specifiedProjection, nonUnitProjection.size, util_1.duplicate(nonUnitProjection.data));
        // rename and assign all others as merged
        model.children.forEach(function (child) {
            if (child.component.projection) {
                modelProjection_1.data = modelProjection_1.data.concat(child.component.projection.data);
                child.renameProjection(child.component.projection.get('name'), name_1);
                child.component.projection.merged = true;
            }
        });
        return modelProjection_1;
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5Q0FBa0Q7QUFFbEQsbUNBQWdDO0FBQ2hDLDJDQUEwQztBQUMxQyxtQ0FBb0M7QUFDcEMsK0NBQW1FO0FBQ25FLG1DQUF3RDtBQUN4RCxtQ0FBaUU7QUFFakUsa0NBQTRDO0FBRTVDLHlDQUFnRDtBQUVoRCx5QkFBZ0MsS0FBWTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1RUFBdUU7UUFDdkUsa0VBQWtFO1FBQ2xFLDZEQUE2RDtRQUM3RCwrQkFBK0I7UUFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNILENBQUM7QUFWRCwwQ0FVQztBQUVELDZCQUE2QixLQUFnQjtJQUNwQyxJQUFBLCtDQUFtQixFQUFFLHVCQUFPLEVBQUUscUJBQU0sRUFBRSx5QkFBUSxDQUFVO0lBRS9ELElBQU0sY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQztJQUM1RCxJQUFNLG9CQUFvQixHQUFHLFFBQVEsSUFBSSxDQUFDLFdBQUMsRUFBRSxXQUFDLEVBQUUsWUFBRSxFQUFFLFlBQUUsQ0FBQyxDQUFDLElBQUksQ0FDMUQsVUFBQyxPQUFPO1FBQ04sSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQVEs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LGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFJLENBQUMsQ0FBQztnQkFDckUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsaUJBQWUsQ0FBQztJQUN6QixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTSEFQRSwgWCwgWDIsIFksIFkyfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7aXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1Byb2plY3Rpb24sIFBST0pFQ1RJT05fUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vcHJvamVjdGlvbic7XG5pbXBvcnQge0dFT0pTT04sIExBVElUVURFLCBMT05HSVRVREV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWlucywgZHVwbGljYXRlLCBldmVyeSwgc3RyaW5naWZ5fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1Byb2plY3Rpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUHJvamVjdGlvbihtb2RlbDogTW9kZWwpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uID0gcGFyc2VVbml0UHJvamVjdGlvbihtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYmVjYXVzZSBwYXJzZSBoYXBwZW5zIGZyb20gbGVhdmVzIHVwICh1bml0IHNwZWNzIGJlZm9yZSBsYXllciBzcGVjKSxcbiAgICAvLyB3ZSBjYW4gYmUgc3VyZSB0aGF0IHRoZSBhYm92ZSBpZiBzdGF0ZW1lbnQgaGFzIGFscmVhZHkgb2NjdXJyZWRcbiAgICAvLyBhbmQgdGhlcmVmb3JlIHdlIGhhdmUgYWNjZXNzIHRvIGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uXG4gICAgLy8gZm9yIGVhY2ggb2YgbW9kZWwncyBjaGlsZHJlblxuICAgIG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uID0gcGFyc2VOb25Vbml0UHJvamVjdGlvbnMobW9kZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdFByb2plY3Rpb24obW9kZWw6IFVuaXRNb2RlbCk6IFByb2plY3Rpb25Db21wb25lbnQge1xuICBjb25zdCB7c3BlY2lmaWVkUHJvamVjdGlvbiwgbWFya0RlZiwgY29uZmlnLCBlbmNvZGluZ30gPSBtb2RlbDtcblxuICBjb25zdCBpc0dlb1NoYXBlTWFyayA9IG1hcmtEZWYgJiYgbWFya0RlZi50eXBlID09PSBHRU9TSEFQRTtcbiAgY29uc3QgaXNHZW9Qb2ludE9yTGluZU1hcmsgPSBlbmNvZGluZyAmJiBbWCwgWSwgWDIsIFkyXS5zb21lKFxuICAgIChjaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBkZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgIHJldHVybiBpc0ZpZWxkRGVmKGRlZikgJiYgY29udGFpbnMoW0xBVElUVURFLCBMT05HSVRVREVdLCBkZWYudHlwZSk7XG4gIH0pO1xuXG4gIGlmIChpc0dlb1NoYXBlTWFyayB8fCBpc0dlb1BvaW50T3JMaW5lTWFyaykge1xuICAgIGNvbnN0IGRhdGE6IChWZ1NpZ25hbFJlZiB8IHN0cmluZylbXSA9IFtdO1xuXG4gICAgW1tYLCBZXSwgW1gyLCBZMl1dLmZvckVhY2goKHBvc3NzaWJsZVBhaXIpID0+IHtcbiAgICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQocG9zc3NpYmxlUGFpclswXSkgfHwgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKHBvc3NzaWJsZVBhaXJbMV0pKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGBnZW9qc29uXyR7ZGF0YS5sZW5ndGh9YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKFNIQVBFKSAmJiBtb2RlbC5maWVsZERlZihTSEFQRSkudHlwZSA9PT0gR0VPSlNPTikge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGBnZW9qc29uXyR7ZGF0YS5sZW5ndGh9YClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbWFpbiBzb3VyY2UgaXMgZ2VvanNvbiwgc28gd2UgY2FuIGp1c3QgdXNlIHRoYXRcbiAgICAgIGRhdGEucHVzaChtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvamVjdGlvbkNvbXBvbmVudChtb2RlbC5wcm9qZWN0aW9uTmFtZSh0cnVlKSwge1xuICAgICAgLi4uKGNvbmZpZy5wcm9qZWN0aW9uIHx8IHt9KSxcbiAgICAgIC4uLihzcGVjaWZpZWRQcm9qZWN0aW9uIHx8IHt9KSxcbiAgICB9LCBbbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKSwgbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JyldLCBkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuZnVuY3Rpb24gbWVyZ2VJZk5vQ29uZmxpY3QoZmlyc3Q6IFByb2plY3Rpb25Db21wb25lbnQsIHNlY29uZDogUHJvamVjdGlvbkNvbXBvbmVudCk6IFByb2plY3Rpb25Db21wb25lbnQge1xuICBjb25zdCBhbGxQcm9wZXJ0aWVzU2hhcmVkID0gZXZlcnkoUFJPSkVDVElPTl9QUk9QRVJUSUVTLCAocHJvcCkgPT4ge1xuICAgIC8vIG5laXRoZXIgaGFzIHRoZSBwb3BlcnR5XG4gICAgaWYgKCFmaXJzdC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgIXNlY29uZC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIGJvdGggaGF2ZSBwcm9wZXJ0eSBhbmQgYW4gZXF1YWwgdmFsdWUgZm9yIHByb3BlcnR5XG4gICAgaWYgKGZpcnN0LmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICBzZWNvbmQuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgIC8vIHNvbWUgcHJvcGVydGllcyBtaWdodCBiZSBzaWduYWxzIG9yIG9iamVjdHMgYW5kIHJlcXVpcmUgaGFzaGluZyBmb3IgY29tcGFyaXNvblxuICAgICAgc3RyaW5naWZ5KGZpcnN0LmdldChwcm9wKSkgPT09IHN0cmluZ2lmeShzZWNvbmQuZ2V0KHByb3ApKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgY29uc3Qgc2l6ZSA9IHN0cmluZ2lmeShmaXJzdC5zaXplKSA9PT0gc3RyaW5naWZ5KHNlY29uZC5zaXplKTtcbiAgaWYgKHNpemUpIHtcbiAgICBpZiAoYWxsUHJvcGVydGllc1NoYXJlZCkge1xuICAgICAgcmV0dXJuIGZpcnN0O1xuICAgIH0gZWxzZSBpZiAoc3RyaW5naWZ5KGZpcnN0LmV4cGxpY2l0KSA9PT0gc3RyaW5naWZ5KHt9KSkge1xuICAgICAgcmV0dXJuIHNlY29uZDtcbiAgICB9IGVsc2UgaWYgKHN0cmluZ2lmeShzZWNvbmQuZXhwbGljaXQpID09PSBzdHJpbmdpZnkoe30pKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgYWxsIHByb3BlcnRpZXMgZG9uJ3QgbWF0Y2gsIGxldCBlYWNoIHVuaXQgc3BlYyBoYXZlIGl0cyBvd24gcHJvamVjdGlvblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0UHJvamVjdGlvbnMobW9kZWw6IE1vZGVsKTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGlmIChtb2RlbC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IG5vblVuaXRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uQ29tcG9uZW50O1xuICBjb25zdCBtZXJnYWJsZSA9IGV2ZXJ5KG1vZGVsLmNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICBwYXJzZVByb2plY3Rpb24oY2hpbGQpO1xuICAgIGNvbnN0IHByb2plY3Rpb24gPSBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbjtcbiAgICBpZiAoIXByb2plY3Rpb24pIHtcbiAgICAgIC8vIGNoaWxkIGxheWVyIGRvZXMgbm90IHVzZSBhIHByb2plY3Rpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIW5vblVuaXRQcm9qZWN0aW9uKSB7XG4gICAgICAvLyBjYWNoZWQgJ3Byb2plY3Rpb24nIGlzIG51bGwsIGNhY2hlIHRoaXMgb25lXG4gICAgICBub25Vbml0UHJvamVjdGlvbiA9IHByb2plY3Rpb247XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWVyZ2UgPSBtZXJnZUlmTm9Db25mbGljdChub25Vbml0UHJvamVjdGlvbiwgcHJvamVjdGlvbik7XG4gICAgICBpZiAobWVyZ2UpIHtcbiAgICAgICAgbm9uVW5pdFByb2plY3Rpb24gPSBtZXJnZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhIW1lcmdlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gaXQgY2FjaGVkIG9uZSBhbmQgYWxsIG90aGVyIGNoaWxkcmVuIHNoYXJlIHRoZSBzYW1lIHByb2plY3Rpb24sXG4gIGlmIChub25Vbml0UHJvamVjdGlvbiAmJiBtZXJnYWJsZSkge1xuICAgIC8vIHNvIHdlIGNhbiBlbGV2YXRlIGl0IHRvIHRoZSBsYXllciBsZXZlbFxuICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5wcm9qZWN0aW9uTmFtZSh0cnVlKTtcbiAgICBjb25zdCBtb2RlbFByb2plY3Rpb24gPSBuZXcgUHJvamVjdGlvbkNvbXBvbmVudChcbiAgICAgIG5hbWUsXG4gICAgICBub25Vbml0UHJvamVjdGlvbi5zcGVjaWZpZWRQcm9qZWN0aW9uLFxuICAgICAgbm9uVW5pdFByb2plY3Rpb24uc2l6ZSxcbiAgICAgIGR1cGxpY2F0ZShub25Vbml0UHJvamVjdGlvbi5kYXRhKVxuICAgICk7XG5cbiAgICAvLyByZW5hbWUgYW5kIGFzc2lnbiBhbGwgb3RoZXJzIGFzIG1lcmdlZFxuICAgIG1vZGVsLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24pIHtcbiAgICAgICAgbW9kZWxQcm9qZWN0aW9uLmRhdGEgPSBtb2RlbFByb2plY3Rpb24uZGF0YS5jb25jYXQoY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24uZGF0YSk7XG4gICAgICAgIGNoaWxkLnJlbmFtZVByb2plY3Rpb24oY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24uZ2V0KCduYW1lJyksIG5hbWUpO1xuICAgICAgICBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5tZXJnZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1vZGVsUHJvamVjdGlvbjtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=