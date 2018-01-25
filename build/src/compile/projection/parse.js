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
            util_1.hash(first.get(prop)) === util_1.hash(second.get(prop))) {
            return true;
        }
        return false;
    });
    var size = util_1.hash(first.size) === util_1.hash(second.size);
    if (size) {
        if (allPropertiesShared) {
            return first;
        }
        else if (util_1.hash(first.explicit) === util_1.hash({})) {
            return second;
        }
        else if (util_1.hash(second.explicit) === util_1.hash({})) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5Q0FBa0Q7QUFFbEQsbUNBQWdDO0FBQ2hDLDJDQUEwQztBQUMxQyxtQ0FBb0M7QUFDcEMsK0NBQW1FO0FBQ25FLG1DQUF3RDtBQUN4RCxtQ0FBNEQ7QUFFNUQsa0NBQTRDO0FBRTVDLHlDQUFnRDtBQUVoRCx5QkFBZ0MsS0FBWTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1RUFBdUU7UUFDdkUsaUVBQWlFO1FBQ2pFLDZEQUE2RDtRQUM3RCwrQkFBK0I7UUFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNILENBQUM7QUFWRCwwQ0FVQztBQUVELDZCQUE2QixLQUFnQjtJQUNwQyxJQUFBLCtDQUFtQixFQUFFLHVCQUFPLEVBQUUscUJBQU0sRUFBRSx5QkFBUSxDQUFVO0lBRS9ELElBQU0sY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQztJQUM1RCxJQUFNLG9CQUFvQixHQUFHLFFBQVEsSUFBSSxDQUFDLFdBQUMsRUFBRSxXQUFDLEVBQUUsWUFBRSxFQUFFLFlBQUUsQ0FBQyxDQUFDLElBQUksQ0FDMUQsVUFBQyxPQUFPO1FBQ04sSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQVEs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Q0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBSSxDQUFDLENBQUM7Z0JBQ3JFLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDM0MsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGlCQUFlLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U0hBUEUsIFgsIFgyLCBZLCBZMn0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7TUFJTn0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge2lzRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7R0VPU0hBUEV9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtQcm9qZWN0aW9uLCBQUk9KRUNUSU9OX1BST1BFUlRJRVN9IGZyb20gJy4uLy4uL3Byb2plY3Rpb24nO1xuaW1wb3J0IHtHRU9KU09OLCBMQVRJVFVERSwgTE9OR0lUVURFfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIGR1cGxpY2F0ZSwgZXZlcnksIGhhc2h9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NpZ25hbFJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7UHJvamVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VQcm9qZWN0aW9uKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnByb2plY3Rpb24gPSBwYXJzZVVuaXRQcm9qZWN0aW9uKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBiZWNhdXNlIHBhcnNlIGhhcHBlbnMgZnJvbSBsZWF2ZXMgdXAgKHVuaXQgc3BlY3MgYmVmb3JlIGxheWVyIHNwZWMpLFxuICAgIC8vIHdlIGNhbiBiZSBzdXJlIHRoYXQgdGhlIGFib3ZlIGlmIHN0YXRlbWVudCBoYXMgYWxyZWFkeSBvY2N1cmVkXG4gICAgLy8gYW5kIHRoZXJlZm9yZSB3ZSBoYXZlIGFjY2VzcyB0byBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvblxuICAgIC8vIGZvciBlYWNoIG9mIG1vZGVsJ3MgY2hpbGRyZW5cbiAgICBtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbiA9IHBhcnNlTm9uVW5pdFByb2plY3Rpb25zKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRQcm9qZWN0aW9uKG1vZGVsOiBVbml0TW9kZWwpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgY29uc3Qge3NwZWNpZmllZFByb2plY3Rpb24sIG1hcmtEZWYsIGNvbmZpZywgZW5jb2Rpbmd9ID0gbW9kZWw7XG5cbiAgY29uc3QgaXNHZW9TaGFwZU1hcmsgPSBtYXJrRGVmICYmIG1hcmtEZWYudHlwZSA9PT0gR0VPU0hBUEU7XG4gIGNvbnN0IGlzR2VvUG9pbnRPckxpbmVNYXJrID0gZW5jb2RpbmcgJiYgW1gsIFksIFgyLCBZMl0uc29tZShcbiAgICAoY2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICByZXR1cm4gaXNGaWVsZERlZihkZWYpICYmIGNvbnRhaW5zKFtMQVRJVFVERSwgTE9OR0lUVURFXSwgZGVmLnR5cGUpO1xuICB9KTtcblxuICBpZiAoaXNHZW9TaGFwZU1hcmsgfHwgaXNHZW9Qb2ludE9yTGluZU1hcmspIHtcbiAgICBjb25zdCBkYXRhOiAoVmdTaWduYWxSZWYgfCBzdHJpbmcpW10gPSBbXTtcblxuICAgIFtbWCwgWV0sIFtYMiwgWTJdXS5mb3JFYWNoKChwb3Nzc2libGVQYWlyKSA9PiB7XG4gICAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKHBvc3NzaWJsZVBhaXJbMF0pIHx8IG1vZGVsLmNoYW5uZWxIYXNGaWVsZChwb3Nzc2libGVQYWlyWzFdKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIHNpZ25hbDogbW9kZWwuZ2V0TmFtZShgZ2VvanNvbl8ke2RhdGEubGVuZ3RofWApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZChTSEFQRSkgJiYgbW9kZWwuZmllbGREZWYoU0hBUEUpLnR5cGUgPT09IEdFT0pTT04pIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHNpZ25hbDogbW9kZWwuZ2V0TmFtZShgZ2VvanNvbl8ke2RhdGEubGVuZ3RofWApXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG1haW4gc291cmNlIGlzIGdlb2pzb24sIHNvIHdlIGNhbiBqdXN0IHVzZSB0aGF0XG4gICAgICBkYXRhLnB1c2gobW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb2plY3Rpb25Db21wb25lbnQobW9kZWwucHJvamVjdGlvbk5hbWUodHJ1ZSksIHtcbiAgICAgIC4uLihjb25maWcucHJvamVjdGlvbiB8fCB7fSksXG4gICAgICAuLi4oc3BlY2lmaWVkUHJvamVjdGlvbiB8fCB7fSksXG4gICAgfSwgW21vZGVsLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksIG1vZGVsLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpXSwgZGF0YSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmZ1bmN0aW9uIG1lcmdlSWZOb0NvbmZsaWN0KGZpcnN0OiBQcm9qZWN0aW9uQ29tcG9uZW50LCBzZWNvbmQ6IFByb2plY3Rpb25Db21wb25lbnQpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgY29uc3QgYWxsUHJvcGVydGllc1NoYXJlZCA9IGV2ZXJ5KFBST0pFQ1RJT05fUFJPUEVSVElFUywgKHByb3ApID0+IHtcbiAgICAvLyBuZWl0aGVyIGhhcyB0aGUgcG9wZXJ0eVxuICAgIGlmICghZmlyc3QuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgICFzZWNvbmQuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBib3RoIGhhdmUgcHJvcGVydHkgYW5kIGFuIGVxdWFsIHZhbHVlIGZvciBwcm9wZXJ0eVxuICAgIGlmIChmaXJzdC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgc2Vjb25kLmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICAvLyBzb21lIHByb3BlcnRpZXMgbWlnaHQgYmUgc2lnbmFscyBvciBvYmplY3RzIGFuZCByZXF1aXJlIGhhc2hpbmcgZm9yIGNvbXBhcmlzb25cbiAgICAgIGhhc2goZmlyc3QuZ2V0KHByb3ApKSA9PT0gaGFzaChzZWNvbmQuZ2V0KHByb3ApKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgY29uc3Qgc2l6ZSA9IGhhc2goZmlyc3Quc2l6ZSkgPT09IGhhc2goc2Vjb25kLnNpemUpO1xuICBpZiAoc2l6ZSkge1xuICAgIGlmIChhbGxQcm9wZXJ0aWVzU2hhcmVkKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfSBlbHNlIGlmIChoYXNoKGZpcnN0LmV4cGxpY2l0KSA9PT0gaGFzaCh7fSkpIHtcbiAgICAgIHJldHVybiBzZWNvbmQ7XG4gICAgfSBlbHNlIGlmIChoYXNoKHNlY29uZC5leHBsaWNpdCkgPT09IGhhc2goe30pKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgYWxsIHByb3BlcnRpZXMgZG9uJ3QgbWF0Y2gsIGxldCBlYWNoIHVuaXQgc3BlYyBoYXZlIGl0cyBvd24gcHJvamVjdGlvblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0UHJvamVjdGlvbnMobW9kZWw6IE1vZGVsKTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGlmIChtb2RlbC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IG5vblVuaXRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uQ29tcG9uZW50O1xuICBjb25zdCBtZXJnYWJsZSA9IGV2ZXJ5KG1vZGVsLmNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICBwYXJzZVByb2plY3Rpb24oY2hpbGQpO1xuICAgIGNvbnN0IHByb2plY3Rpb24gPSBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbjtcbiAgICBpZiAoIXByb2plY3Rpb24pIHtcbiAgICAgIC8vIGNoaWxkIGxheWVyIGRvZXMgbm90IHVzZSBhIHByb2plY3Rpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIW5vblVuaXRQcm9qZWN0aW9uKSB7XG4gICAgICAvLyBjYWNoZWQgJ3Byb2plY3Rpb24nIGlzIG51bGwsIGNhY2hlIHRoaXMgb25lXG4gICAgICBub25Vbml0UHJvamVjdGlvbiA9IHByb2plY3Rpb247XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWVyZ2UgPSBtZXJnZUlmTm9Db25mbGljdChub25Vbml0UHJvamVjdGlvbiwgcHJvamVjdGlvbik7XG4gICAgICBpZiAobWVyZ2UpIHtcbiAgICAgICAgbm9uVW5pdFByb2plY3Rpb24gPSBtZXJnZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhIW1lcmdlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gaXQgY2FjaGVkIG9uZSBhbmQgYWxsIG90aGVyIGNoaWxkcmVuIHNoYXJlIHRoZSBzYW1lIHByb2plY3Rpb24sXG4gIGlmIChub25Vbml0UHJvamVjdGlvbiAmJiBtZXJnYWJsZSkge1xuICAgIC8vIHNvIHdlIGNhbiBlbGV2YXRlIGl0IHRvIHRoZSBsYXllciBsZXZlbFxuICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5wcm9qZWN0aW9uTmFtZSh0cnVlKTtcbiAgICBjb25zdCBtb2RlbFByb2plY3Rpb24gPSBuZXcgUHJvamVjdGlvbkNvbXBvbmVudChcbiAgICAgIG5hbWUsXG4gICAgICBub25Vbml0UHJvamVjdGlvbi5zcGVjaWZpZWRQcm9qZWN0aW9uLFxuICAgICAgbm9uVW5pdFByb2plY3Rpb24uc2l6ZSxcbiAgICAgIGR1cGxpY2F0ZShub25Vbml0UHJvamVjdGlvbi5kYXRhKVxuICAgICk7XG5cbiAgICAvLyByZW5hbWUgYW5kIGFzc2lnbiBhbGwgb3RoZXJzIGFzIG1lcmdlZFxuICAgIG1vZGVsLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24pIHtcbiAgICAgICAgbW9kZWxQcm9qZWN0aW9uLmRhdGEgPSBtb2RlbFByb2plY3Rpb24uZGF0YS5jb25jYXQoY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24uZGF0YSk7XG4gICAgICAgIGNoaWxkLnJlbmFtZVByb2plY3Rpb24oY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24uZ2V0KCduYW1lJyksIG5hbWUpO1xuICAgICAgICBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5tZXJnZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1vZGVsUHJvamVjdGlvbjtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=