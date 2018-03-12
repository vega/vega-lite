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
    var isGeoPointOrLineMark = encoding && channel_1.GEOPOSITION_CHANNELS.some(function (channel) { return fielddef_1.isFieldDef(encoding[channel]); });
    if (isGeoShapeMark || isGeoPointOrLineMark) {
        var data_2 = [];
        [[channel_1.LONGITUDE, channel_1.LATITUDE], [channel_1.LONGITUDE2, channel_1.LATITUDE2]].forEach(function (posssiblePair) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5Q0FBc0c7QUFFdEcsbUNBQWdDO0FBQ2hDLDJDQUEwQztBQUMxQyxtQ0FBb0M7QUFDcEMsK0NBQW1FO0FBQ25FLG1DQUFtQztBQUNuQyxtQ0FBdUQ7QUFFdkQsa0NBQTRDO0FBRTVDLHlDQUFnRDtBQUVoRCx5QkFBZ0MsS0FBWTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1RUFBdUU7UUFDdkUsa0VBQWtFO1FBQ2xFLDZEQUE2RDtRQUM3RCwrQkFBK0I7UUFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNILENBQUM7QUFWRCwwQ0FVQztBQUVELDZCQUE2QixLQUFnQjtJQUNwQyxJQUFBLCtDQUFtQixFQUFFLHVCQUFPLEVBQUUscUJBQU0sRUFBRSx5QkFBUSxDQUFVO0lBRS9ELElBQU0sY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQztJQUM1RCxJQUFNLG9CQUFvQixHQUFHLFFBQVEsSUFBSSw4QkFBb0IsQ0FBQyxJQUFJLENBQ2hFLFVBQUMsT0FBTyxJQUFLLE9BQUEscUJBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBN0IsQ0FBNkIsQ0FDM0MsQ0FBQztJQUVGLEVBQUUsQ0FBQyxDQUFDLGNBQWMsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFB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O1lBQzNDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxpQkFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0dFT1BPU0lUSU9OX0NIQU5ORUxTLCBMQVRJVFVERSwgTEFUSVRVREUyLCBMT05HSVRVREUsIExPTkdJVFVERTIsIFNIQVBFfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7aXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1Byb2plY3Rpb24sIFBST0pFQ1RJT05fUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vcHJvamVjdGlvbic7XG5pbXBvcnQge0dFT0pTT059IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtkdXBsaWNhdGUsIGV2ZXJ5LCBzdHJpbmdpZnl9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NpZ25hbFJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7UHJvamVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VQcm9qZWN0aW9uKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnByb2plY3Rpb24gPSBwYXJzZVVuaXRQcm9qZWN0aW9uKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBiZWNhdXNlIHBhcnNlIGhhcHBlbnMgZnJvbSBsZWF2ZXMgdXAgKHVuaXQgc3BlY3MgYmVmb3JlIGxheWVyIHNwZWMpLFxuICAgIC8vIHdlIGNhbiBiZSBzdXJlIHRoYXQgdGhlIGFib3ZlIGlmIHN0YXRlbWVudCBoYXMgYWxyZWFkeSBvY2N1cnJlZFxuICAgIC8vIGFuZCB0aGVyZWZvcmUgd2UgaGF2ZSBhY2Nlc3MgdG8gY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb25cbiAgICAvLyBmb3IgZWFjaCBvZiBtb2RlbCdzIGNoaWxkcmVuXG4gICAgbW9kZWwuY29tcG9uZW50LnByb2plY3Rpb24gPSBwYXJzZU5vblVuaXRQcm9qZWN0aW9ucyhtb2RlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0UHJvamVjdGlvbihtb2RlbDogVW5pdE1vZGVsKTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGNvbnN0IHtzcGVjaWZpZWRQcm9qZWN0aW9uLCBtYXJrRGVmLCBjb25maWcsIGVuY29kaW5nfSA9IG1vZGVsO1xuXG4gIGNvbnN0IGlzR2VvU2hhcGVNYXJrID0gbWFya0RlZiAmJiBtYXJrRGVmLnR5cGUgPT09IEdFT1NIQVBFO1xuICBjb25zdCBpc0dlb1BvaW50T3JMaW5lTWFyayA9IGVuY29kaW5nICYmIEdFT1BPU0lUSU9OX0NIQU5ORUxTLnNvbWUoXG4gICAgKGNoYW5uZWwpID0+IGlzRmllbGREZWYoZW5jb2RpbmdbY2hhbm5lbF0pXG4gICk7XG5cbiAgaWYgKGlzR2VvU2hhcGVNYXJrIHx8IGlzR2VvUG9pbnRPckxpbmVNYXJrKSB7XG4gICAgY29uc3QgZGF0YTogKFZnU2lnbmFsUmVmIHwgc3RyaW5nKVtdID0gW107XG5cbiAgICBbW0xPTkdJVFVERSwgTEFUSVRVREVdLCBbTE9OR0lUVURFMiwgTEFUSVRVREUyXV0uZm9yRWFjaCgocG9zc3NpYmxlUGFpcikgPT4ge1xuICAgICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZChwb3Nzc2libGVQYWlyWzBdKSB8fCBtb2RlbC5jaGFubmVsSGFzRmllbGQocG9zc3NpYmxlUGFpclsxXSkpIHtcbiAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICBzaWduYWw6IG1vZGVsLmdldE5hbWUoYGdlb2pzb25fJHtkYXRhLmxlbmd0aH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoU0hBUEUpICYmIG1vZGVsLmZpZWxkRGVmKFNIQVBFKS50eXBlID09PSBHRU9KU09OKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBzaWduYWw6IG1vZGVsLmdldE5hbWUoYGdlb2pzb25fJHtkYXRhLmxlbmd0aH1gKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBtYWluIHNvdXJjZSBpcyBnZW9qc29uLCBzbyB3ZSBjYW4ganVzdCB1c2UgdGhhdFxuICAgICAgZGF0YS5wdXNoKG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9qZWN0aW9uQ29tcG9uZW50KG1vZGVsLnByb2plY3Rpb25OYW1lKHRydWUpLCB7XG4gICAgICAuLi4oY29uZmlnLnByb2plY3Rpb24gfHwge30pLFxuICAgICAgLi4uKHNwZWNpZmllZFByb2plY3Rpb24gfHwge30pLFxuICAgIH0sIFttb2RlbC5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLCBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKV0sIGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5mdW5jdGlvbiBtZXJnZUlmTm9Db25mbGljdChmaXJzdDogUHJvamVjdGlvbkNvbXBvbmVudCwgc2Vjb25kOiBQcm9qZWN0aW9uQ29tcG9uZW50KTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGNvbnN0IGFsbFByb3BlcnRpZXNTaGFyZWQgPSBldmVyeShQUk9KRUNUSU9OX1BST1BFUlRJRVMsIChwcm9wKSA9PiB7XG4gICAgLy8gbmVpdGhlciBoYXMgdGhlIHBvcGVydHlcbiAgICBpZiAoIWZpcnN0LmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICAhc2Vjb25kLmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gYm90aCBoYXZlIHByb3BlcnR5IGFuZCBhbiBlcXVhbCB2YWx1ZSBmb3IgcHJvcGVydHlcbiAgICBpZiAoZmlyc3QuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgIHNlY29uZC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgLy8gc29tZSBwcm9wZXJ0aWVzIG1pZ2h0IGJlIHNpZ25hbHMgb3Igb2JqZWN0cyBhbmQgcmVxdWlyZSBoYXNoaW5nIGZvciBjb21wYXJpc29uXG4gICAgICBzdHJpbmdpZnkoZmlyc3QuZ2V0KHByb3ApKSA9PT0gc3RyaW5naWZ5KHNlY29uZC5nZXQocHJvcCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBjb25zdCBzaXplID0gc3RyaW5naWZ5KGZpcnN0LnNpemUpID09PSBzdHJpbmdpZnkoc2Vjb25kLnNpemUpO1xuICBpZiAoc2l6ZSkge1xuICAgIGlmIChhbGxQcm9wZXJ0aWVzU2hhcmVkKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfSBlbHNlIGlmIChzdHJpbmdpZnkoZmlyc3QuZXhwbGljaXQpID09PSBzdHJpbmdpZnkoe30pKSB7XG4gICAgICByZXR1cm4gc2Vjb25kO1xuICAgIH0gZWxzZSBpZiAoc3RyaW5naWZ5KHNlY29uZC5leHBsaWNpdCkgPT09IHN0cmluZ2lmeSh7fSkpIHtcbiAgICAgIHJldHVybiBmaXJzdDtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBhbGwgcHJvcGVydGllcyBkb24ndCBtYXRjaCwgbGV0IGVhY2ggdW5pdCBzcGVjIGhhdmUgaXRzIG93biBwcm9qZWN0aW9uXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRQcm9qZWN0aW9ucyhtb2RlbDogTW9kZWwpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgaWYgKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgbm9uVW5pdFByb2plY3Rpb246IFByb2plY3Rpb25Db21wb25lbnQ7XG4gIGNvbnN0IG1lcmdhYmxlID0gZXZlcnkobW9kZWwuY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgIHBhcnNlUHJvamVjdGlvbihjaGlsZCk7XG4gICAgY29uc3QgcHJvamVjdGlvbiA9IGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uO1xuICAgIGlmICghcHJvamVjdGlvbikge1xuICAgICAgLy8gY2hpbGQgbGF5ZXIgZG9lcyBub3QgdXNlIGEgcHJvamVjdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICghbm9uVW5pdFByb2plY3Rpb24pIHtcbiAgICAgIC8vIGNhY2hlZCAncHJvamVjdGlvbicgaXMgbnVsbCwgY2FjaGUgdGhpcyBvbmVcbiAgICAgIG5vblVuaXRQcm9qZWN0aW9uID0gcHJvamVjdGlvbjtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtZXJnZSA9IG1lcmdlSWZOb0NvbmZsaWN0KG5vblVuaXRQcm9qZWN0aW9uLCBwcm9qZWN0aW9uKTtcbiAgICAgIGlmIChtZXJnZSkge1xuICAgICAgICBub25Vbml0UHJvamVjdGlvbiA9IG1lcmdlO1xuICAgICAgfVxuICAgICAgcmV0dXJuICEhbWVyZ2U7XG4gICAgfVxuICB9KTtcblxuICAvLyBpdCBjYWNoZWQgb25lIGFuZCBhbGwgb3RoZXIgY2hpbGRyZW4gc2hhcmUgdGhlIHNhbWUgcHJvamVjdGlvbixcbiAgaWYgKG5vblVuaXRQcm9qZWN0aW9uICYmIG1lcmdhYmxlKSB7XG4gICAgLy8gc28gd2UgY2FuIGVsZXZhdGUgaXQgdG8gdGhlIGxheWVyIGxldmVsXG4gICAgY29uc3QgbmFtZSA9IG1vZGVsLnByb2plY3Rpb25OYW1lKHRydWUpO1xuICAgIGNvbnN0IG1vZGVsUHJvamVjdGlvbiA9IG5ldyBQcm9qZWN0aW9uQ29tcG9uZW50KFxuICAgICAgbmFtZSxcbiAgICAgIG5vblVuaXRQcm9qZWN0aW9uLnNwZWNpZmllZFByb2plY3Rpb24sXG4gICAgICBub25Vbml0UHJvamVjdGlvbi5zaXplLFxuICAgICAgZHVwbGljYXRlKG5vblVuaXRQcm9qZWN0aW9uLmRhdGEpXG4gICAgKTtcblxuICAgIC8vIHJlbmFtZSBhbmQgYXNzaWduIGFsbCBvdGhlcnMgYXMgbWVyZ2VkXG4gICAgbW9kZWwuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbikge1xuICAgICAgICBtb2RlbFByb2plY3Rpb24uZGF0YSA9IG1vZGVsUHJvamVjdGlvbi5kYXRhLmNvbmNhdChjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhKTtcbiAgICAgICAgY2hpbGQucmVuYW1lUHJvamVjdGlvbihjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5nZXQoJ25hbWUnKSwgbmFtZSk7XG4gICAgICAgIGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uLm1lcmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbW9kZWxQcm9qZWN0aW9uO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==