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
        // we can be sure that the above if statement has already occured
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5Q0FBa0Q7QUFFbEQsbUNBQWdDO0FBQ2hDLDJDQUEwQztBQUMxQyxtQ0FBb0M7QUFDcEMsK0NBQW1FO0FBQ25FLG1DQUF3RDtBQUN4RCxtQ0FBaUU7QUFFakUsa0NBQTRDO0FBRTVDLHlDQUFnRDtBQUVoRCx5QkFBZ0MsS0FBWTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1RUFBdUU7UUFDdkUsaUVBQWlFO1FBQ2pFLDZEQUE2RDtRQUM3RCwrQkFBK0I7UUFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNILENBQUM7QUFWRCwwQ0FVQztBQUVELDZCQUE2QixLQUFnQjtJQUNwQyxJQUFBLCtDQUFtQixFQUFFLHVCQUFPLEVBQUUscUJBQU0sRUFBRSx5QkFBUSxDQUFVO0lBRS9ELElBQU0sY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQztJQUM1RCxJQUFNLG9CQUFvQixHQUFHLFFBQVEsSUFBSSxDQUFDLFdBQUMsRUFBRSxXQUFDLEVBQUUsWUFBRSxFQUFFLFlBQUUsQ0FBQyxDQUFDLElBQUksQ0FDMUQsVUFBQyxPQUFPO1FBQ04sSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQVEs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LGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFJLENBQUMsQ0FBQztnQkFDckUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsaUJBQWUsQ0FBQztJQUN6QixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTSEFQRSwgWCwgWDIsIFksIFkyfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7aXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1Byb2plY3Rpb24sIFBST0pFQ1RJT05fUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vcHJvamVjdGlvbic7XG5pbXBvcnQge0dFT0pTT04sIExBVElUVURFLCBMT05HSVRVREV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWlucywgZHVwbGljYXRlLCBldmVyeSwgc3RyaW5naWZ5fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1Byb2plY3Rpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUHJvamVjdGlvbihtb2RlbDogTW9kZWwpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uID0gcGFyc2VVbml0UHJvamVjdGlvbihtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYmVjYXVzZSBwYXJzZSBoYXBwZW5zIGZyb20gbGVhdmVzIHVwICh1bml0IHNwZWNzIGJlZm9yZSBsYXllciBzcGVjKSxcbiAgICAvLyB3ZSBjYW4gYmUgc3VyZSB0aGF0IHRoZSBhYm92ZSBpZiBzdGF0ZW1lbnQgaGFzIGFscmVhZHkgb2NjdXJlZFxuICAgIC8vIGFuZCB0aGVyZWZvcmUgd2UgaGF2ZSBhY2Nlc3MgdG8gY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb25cbiAgICAvLyBmb3IgZWFjaCBvZiBtb2RlbCdzIGNoaWxkcmVuXG4gICAgbW9kZWwuY29tcG9uZW50LnByb2plY3Rpb24gPSBwYXJzZU5vblVuaXRQcm9qZWN0aW9ucyhtb2RlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0UHJvamVjdGlvbihtb2RlbDogVW5pdE1vZGVsKTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGNvbnN0IHtzcGVjaWZpZWRQcm9qZWN0aW9uLCBtYXJrRGVmLCBjb25maWcsIGVuY29kaW5nfSA9IG1vZGVsO1xuXG4gIGNvbnN0IGlzR2VvU2hhcGVNYXJrID0gbWFya0RlZiAmJiBtYXJrRGVmLnR5cGUgPT09IEdFT1NIQVBFO1xuICBjb25zdCBpc0dlb1BvaW50T3JMaW5lTWFyayA9IGVuY29kaW5nICYmIFtYLCBZLCBYMiwgWTJdLnNvbWUoXG4gICAgKGNoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IGRlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgcmV0dXJuIGlzRmllbGREZWYoZGVmKSAmJiBjb250YWlucyhbTEFUSVRVREUsIExPTkdJVFVERV0sIGRlZi50eXBlKTtcbiAgfSk7XG5cbiAgaWYgKGlzR2VvU2hhcGVNYXJrIHx8IGlzR2VvUG9pbnRPckxpbmVNYXJrKSB7XG4gICAgY29uc3QgZGF0YTogKFZnU2lnbmFsUmVmIHwgc3RyaW5nKVtdID0gW107XG5cbiAgICBbW1gsIFldLCBbWDIsIFkyXV0uZm9yRWFjaCgocG9zc3NpYmxlUGFpcikgPT4ge1xuICAgICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZChwb3Nzc2libGVQYWlyWzBdKSB8fCBtb2RlbC5jaGFubmVsSGFzRmllbGQocG9zc3NpYmxlUGFpclsxXSkpIHtcbiAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICBzaWduYWw6IG1vZGVsLmdldE5hbWUoYGdlb2pzb25fJHtkYXRhLmxlbmd0aH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoU0hBUEUpICYmIG1vZGVsLmZpZWxkRGVmKFNIQVBFKS50eXBlID09PSBHRU9KU09OKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBzaWduYWw6IG1vZGVsLmdldE5hbWUoYGdlb2pzb25fJHtkYXRhLmxlbmd0aH1gKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBtYWluIHNvdXJjZSBpcyBnZW9qc29uLCBzbyB3ZSBjYW4ganVzdCB1c2UgdGhhdFxuICAgICAgZGF0YS5wdXNoKG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9qZWN0aW9uQ29tcG9uZW50KG1vZGVsLnByb2plY3Rpb25OYW1lKHRydWUpLCB7XG4gICAgICAuLi4oY29uZmlnLnByb2plY3Rpb24gfHwge30pLFxuICAgICAgLi4uKHNwZWNpZmllZFByb2plY3Rpb24gfHwge30pLFxuICAgIH0sIFttb2RlbC5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLCBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKV0sIGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5mdW5jdGlvbiBtZXJnZUlmTm9Db25mbGljdChmaXJzdDogUHJvamVjdGlvbkNvbXBvbmVudCwgc2Vjb25kOiBQcm9qZWN0aW9uQ29tcG9uZW50KTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGNvbnN0IGFsbFByb3BlcnRpZXNTaGFyZWQgPSBldmVyeShQUk9KRUNUSU9OX1BST1BFUlRJRVMsIChwcm9wKSA9PiB7XG4gICAgLy8gbmVpdGhlciBoYXMgdGhlIHBvcGVydHlcbiAgICBpZiAoIWZpcnN0LmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICAhc2Vjb25kLmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gYm90aCBoYXZlIHByb3BlcnR5IGFuZCBhbiBlcXVhbCB2YWx1ZSBmb3IgcHJvcGVydHlcbiAgICBpZiAoZmlyc3QuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgIHNlY29uZC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgLy8gc29tZSBwcm9wZXJ0aWVzIG1pZ2h0IGJlIHNpZ25hbHMgb3Igb2JqZWN0cyBhbmQgcmVxdWlyZSBoYXNoaW5nIGZvciBjb21wYXJpc29uXG4gICAgICBzdHJpbmdpZnkoZmlyc3QuZ2V0KHByb3ApKSA9PT0gc3RyaW5naWZ5KHNlY29uZC5nZXQocHJvcCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBjb25zdCBzaXplID0gc3RyaW5naWZ5KGZpcnN0LnNpemUpID09PSBzdHJpbmdpZnkoc2Vjb25kLnNpemUpO1xuICBpZiAoc2l6ZSkge1xuICAgIGlmIChhbGxQcm9wZXJ0aWVzU2hhcmVkKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfSBlbHNlIGlmIChzdHJpbmdpZnkoZmlyc3QuZXhwbGljaXQpID09PSBzdHJpbmdpZnkoe30pKSB7XG4gICAgICByZXR1cm4gc2Vjb25kO1xuICAgIH0gZWxzZSBpZiAoc3RyaW5naWZ5KHNlY29uZC5leHBsaWNpdCkgPT09IHN0cmluZ2lmeSh7fSkpIHtcbiAgICAgIHJldHVybiBmaXJzdDtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBhbGwgcHJvcGVydGllcyBkb24ndCBtYXRjaCwgbGV0IGVhY2ggdW5pdCBzcGVjIGhhdmUgaXRzIG93biBwcm9qZWN0aW9uXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRQcm9qZWN0aW9ucyhtb2RlbDogTW9kZWwpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgaWYgKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgbm9uVW5pdFByb2plY3Rpb246IFByb2plY3Rpb25Db21wb25lbnQ7XG4gIGNvbnN0IG1lcmdhYmxlID0gZXZlcnkobW9kZWwuY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgIHBhcnNlUHJvamVjdGlvbihjaGlsZCk7XG4gICAgY29uc3QgcHJvamVjdGlvbiA9IGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uO1xuICAgIGlmICghcHJvamVjdGlvbikge1xuICAgICAgLy8gY2hpbGQgbGF5ZXIgZG9lcyBub3QgdXNlIGEgcHJvamVjdGlvblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICghbm9uVW5pdFByb2plY3Rpb24pIHtcbiAgICAgIC8vIGNhY2hlZCAncHJvamVjdGlvbicgaXMgbnVsbCwgY2FjaGUgdGhpcyBvbmVcbiAgICAgIG5vblVuaXRQcm9qZWN0aW9uID0gcHJvamVjdGlvbjtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtZXJnZSA9IG1lcmdlSWZOb0NvbmZsaWN0KG5vblVuaXRQcm9qZWN0aW9uLCBwcm9qZWN0aW9uKTtcbiAgICAgIGlmIChtZXJnZSkge1xuICAgICAgICBub25Vbml0UHJvamVjdGlvbiA9IG1lcmdlO1xuICAgICAgfVxuICAgICAgcmV0dXJuICEhbWVyZ2U7XG4gICAgfVxuICB9KTtcblxuICAvLyBpdCBjYWNoZWQgb25lIGFuZCBhbGwgb3RoZXIgY2hpbGRyZW4gc2hhcmUgdGhlIHNhbWUgcHJvamVjdGlvbixcbiAgaWYgKG5vblVuaXRQcm9qZWN0aW9uICYmIG1lcmdhYmxlKSB7XG4gICAgLy8gc28gd2UgY2FuIGVsZXZhdGUgaXQgdG8gdGhlIGxheWVyIGxldmVsXG4gICAgY29uc3QgbmFtZSA9IG1vZGVsLnByb2plY3Rpb25OYW1lKHRydWUpO1xuICAgIGNvbnN0IG1vZGVsUHJvamVjdGlvbiA9IG5ldyBQcm9qZWN0aW9uQ29tcG9uZW50KFxuICAgICAgbmFtZSxcbiAgICAgIG5vblVuaXRQcm9qZWN0aW9uLnNwZWNpZmllZFByb2plY3Rpb24sXG4gICAgICBub25Vbml0UHJvamVjdGlvbi5zaXplLFxuICAgICAgZHVwbGljYXRlKG5vblVuaXRQcm9qZWN0aW9uLmRhdGEpXG4gICAgKTtcblxuICAgIC8vIHJlbmFtZSBhbmQgYXNzaWduIGFsbCBvdGhlcnMgYXMgbWVyZ2VkXG4gICAgbW9kZWwuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbikge1xuICAgICAgICBtb2RlbFByb2plY3Rpb24uZGF0YSA9IG1vZGVsUHJvamVjdGlvbi5kYXRhLmNvbmNhdChjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhKTtcbiAgICAgICAgY2hpbGQucmVuYW1lUHJvamVjdGlvbihjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5nZXQoJ25hbWUnKSwgbmFtZSk7XG4gICAgICAgIGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uLm1lcmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbW9kZWxQcm9qZWN0aW9uO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==