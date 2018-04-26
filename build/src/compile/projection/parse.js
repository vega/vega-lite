"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
        return new component_1.ProjectionComponent(model.projectionName(true), tslib_1.__assign({}, (config.projection || {}), (specifiedProjection || {})), [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')], data_2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUFzRztBQUN0RyxtQ0FBZ0M7QUFDaEMsMkNBQTBDO0FBQzFDLG1DQUFvQztBQUNwQywrQ0FBdUQ7QUFDdkQsbUNBQW1DO0FBQ25DLG1DQUF1RDtBQUV2RCxrQ0FBNEM7QUFFNUMseUNBQWdEO0FBRWhELHlCQUFnQyxLQUFZO0lBQzFDLElBQUksbUJBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6RDtTQUFNO1FBQ0wsdUVBQXVFO1FBQ3ZFLGtFQUFrRTtRQUNsRSw2REFBNkQ7UUFDN0QsK0JBQStCO1FBQy9CLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdEO0FBQ0gsQ0FBQztBQVZELDBDQVVDO0FBRUQsNkJBQTZCLEtBQWdCO0lBQ3BDLElBQUEsK0NBQW1CLEVBQUUsdUJBQU8sRUFBRSxxQkFBTSxFQUFFLHlCQUFRLENBQVU7SUFFL0QsSUFBTSxjQUFjLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssZUFBUSxDQUFDO0lBQzVELElBQU0sb0JBQW9CLEdBQUcsUUFBUSxJQUFJLDhCQUFvQixDQUFDLElBQUksQ0FDaEUsVUFBQyxPQUFPLElBQUssT0FBQSxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUE3QixDQUE2QixDQUMzQyxDQUFDO0lBRUYsSUFBSSxjQUFjLElBQUksb0JBQW9CLEVBQUU7UUFDMUMsSUFBTSxNQUFJLEdBQTZCLEVBQUUsQ0FBQztRQUUxQyxDQUFDLENBQUMsbUJBQVMsRUFBRSxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxv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QyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDM0IsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtnQkFDOUIsaUJBQWUsQ0FBQyxJQUFJLEdBQUcsaUJBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQUksQ0FBQyxDQUFDO2dCQUNyRSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQzFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGlCQUFlLENBQUM7S0FDeEI7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtHRU9QT1NJVElPTl9DSEFOTkVMUywgTEFUSVRVREUsIExBVElUVURFMiwgTE9OR0lUVURFLCBMT05HSVRVREUyLCBTSEFQRX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge01BSU59IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge0dFT1NIQVBFfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7UFJPSkVDVElPTl9QUk9QRVJUSUVTfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7R0VPSlNPTn0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2R1cGxpY2F0ZSwgZXZlcnksIHN0cmluZ2lmeX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtQcm9qZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVByb2plY3Rpb24obW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbiA9IHBhcnNlVW5pdFByb2plY3Rpb24obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIC8vIGJlY2F1c2UgcGFyc2UgaGFwcGVucyBmcm9tIGxlYXZlcyB1cCAodW5pdCBzcGVjcyBiZWZvcmUgbGF5ZXIgc3BlYyksXG4gICAgLy8gd2UgY2FuIGJlIHN1cmUgdGhhdCB0aGUgYWJvdmUgaWYgc3RhdGVtZW50IGhhcyBhbHJlYWR5IG9jY3VycmVkXG4gICAgLy8gYW5kIHRoZXJlZm9yZSB3ZSBoYXZlIGFjY2VzcyB0byBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvblxuICAgIC8vIGZvciBlYWNoIG9mIG1vZGVsJ3MgY2hpbGRyZW5cbiAgICBtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbiA9IHBhcnNlTm9uVW5pdFByb2plY3Rpb25zKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRQcm9qZWN0aW9uKG1vZGVsOiBVbml0TW9kZWwpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgY29uc3Qge3NwZWNpZmllZFByb2plY3Rpb24sIG1hcmtEZWYsIGNvbmZpZywgZW5jb2Rpbmd9ID0gbW9kZWw7XG5cbiAgY29uc3QgaXNHZW9TaGFwZU1hcmsgPSBtYXJrRGVmICYmIG1hcmtEZWYudHlwZSA9PT0gR0VPU0hBUEU7XG4gIGNvbnN0IGlzR2VvUG9pbnRPckxpbmVNYXJrID0gZW5jb2RpbmcgJiYgR0VPUE9TSVRJT05fQ0hBTk5FTFMuc29tZShcbiAgICAoY2hhbm5lbCkgPT4gaXNGaWVsZERlZihlbmNvZGluZ1tjaGFubmVsXSlcbiAgKTtcblxuICBpZiAoaXNHZW9TaGFwZU1hcmsgfHwgaXNHZW9Qb2ludE9yTGluZU1hcmspIHtcbiAgICBjb25zdCBkYXRhOiAoVmdTaWduYWxSZWYgfCBzdHJpbmcpW10gPSBbXTtcblxuICAgIFtbTE9OR0lUVURFLCBMQVRJVFVERV0sIFtMT05HSVRVREUyLCBMQVRJVFVERTJdXS5mb3JFYWNoKChwb3Nzc2libGVQYWlyKSA9PiB7XG4gICAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKHBvc3NzaWJsZVBhaXJbMF0pIHx8IG1vZGVsLmNoYW5uZWxIYXNGaWVsZChwb3Nzc2libGVQYWlyWzFdKSkge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIHNpZ25hbDogbW9kZWwuZ2V0TmFtZShgZ2VvanNvbl8ke2RhdGEubGVuZ3RofWApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZChTSEFQRSkgJiYgbW9kZWwuZmllbGREZWYoU0hBUEUpLnR5cGUgPT09IEdFT0pTT04pIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHNpZ25hbDogbW9kZWwuZ2V0TmFtZShgZ2VvanNvbl8ke2RhdGEubGVuZ3RofWApXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG1haW4gc291cmNlIGlzIGdlb2pzb24sIHNvIHdlIGNhbiBqdXN0IHVzZSB0aGF0XG4gICAgICBkYXRhLnB1c2gobW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb2plY3Rpb25Db21wb25lbnQobW9kZWwucHJvamVjdGlvbk5hbWUodHJ1ZSksIHtcbiAgICAgIC4uLihjb25maWcucHJvamVjdGlvbiB8fCB7fSksXG4gICAgICAuLi4oc3BlY2lmaWVkUHJvamVjdGlvbiB8fCB7fSksXG4gICAgfSwgW21vZGVsLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksIG1vZGVsLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpXSwgZGF0YSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmZ1bmN0aW9uIG1lcmdlSWZOb0NvbmZsaWN0KGZpcnN0OiBQcm9qZWN0aW9uQ29tcG9uZW50LCBzZWNvbmQ6IFByb2plY3Rpb25Db21wb25lbnQpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgY29uc3QgYWxsUHJvcGVydGllc1NoYXJlZCA9IGV2ZXJ5KFBST0pFQ1RJT05fUFJPUEVSVElFUywgKHByb3ApID0+IHtcbiAgICAvLyBuZWl0aGVyIGhhcyB0aGUgcG9wZXJ0eVxuICAgIGlmICghZmlyc3QuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgICFzZWNvbmQuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBib3RoIGhhdmUgcHJvcGVydHkgYW5kIGFuIGVxdWFsIHZhbHVlIGZvciBwcm9wZXJ0eVxuICAgIGlmIChmaXJzdC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgc2Vjb25kLmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICAvLyBzb21lIHByb3BlcnRpZXMgbWlnaHQgYmUgc2lnbmFscyBvciBvYmplY3RzIGFuZCByZXF1aXJlIGhhc2hpbmcgZm9yIGNvbXBhcmlzb25cbiAgICAgIHN0cmluZ2lmeShmaXJzdC5nZXQocHJvcCkpID09PSBzdHJpbmdpZnkoc2Vjb25kLmdldChwcm9wKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIGNvbnN0IHNpemUgPSBzdHJpbmdpZnkoZmlyc3Quc2l6ZSkgPT09IHN0cmluZ2lmeShzZWNvbmQuc2l6ZSk7XG4gIGlmIChzaXplKSB7XG4gICAgaWYgKGFsbFByb3BlcnRpZXNTaGFyZWQpIHtcbiAgICAgIHJldHVybiBmaXJzdDtcbiAgICB9IGVsc2UgaWYgKHN0cmluZ2lmeShmaXJzdC5leHBsaWNpdCkgPT09IHN0cmluZ2lmeSh7fSkpIHtcbiAgICAgIHJldHVybiBzZWNvbmQ7XG4gICAgfSBlbHNlIGlmIChzdHJpbmdpZnkoc2Vjb25kLmV4cGxpY2l0KSA9PT0gc3RyaW5naWZ5KHt9KSkge1xuICAgICAgcmV0dXJuIGZpcnN0O1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIGFsbCBwcm9wZXJ0aWVzIGRvbid0IG1hdGNoLCBsZXQgZWFjaCB1bml0IHNwZWMgaGF2ZSBpdHMgb3duIHByb2plY3Rpb25cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdFByb2plY3Rpb25zKG1vZGVsOiBNb2RlbCk6IFByb2plY3Rpb25Db21wb25lbnQge1xuICBpZiAobW9kZWwuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCBub25Vbml0UHJvamVjdGlvbjogUHJvamVjdGlvbkNvbXBvbmVudDtcbiAgY29uc3QgbWVyZ2FibGUgPSBldmVyeShtb2RlbC5jaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgcGFyc2VQcm9qZWN0aW9uKGNoaWxkKTtcbiAgICBjb25zdCBwcm9qZWN0aW9uID0gY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb247XG4gICAgaWYgKCFwcm9qZWN0aW9uKSB7XG4gICAgICAvLyBjaGlsZCBsYXllciBkb2VzIG5vdCB1c2UgYSBwcm9qZWN0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCFub25Vbml0UHJvamVjdGlvbikge1xuICAgICAgLy8gY2FjaGVkICdwcm9qZWN0aW9uJyBpcyBudWxsLCBjYWNoZSB0aGlzIG9uZVxuICAgICAgbm9uVW5pdFByb2plY3Rpb24gPSBwcm9qZWN0aW9uO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1lcmdlID0gbWVyZ2VJZk5vQ29uZmxpY3Qobm9uVW5pdFByb2plY3Rpb24sIHByb2plY3Rpb24pO1xuICAgICAgaWYgKG1lcmdlKSB7XG4gICAgICAgIG5vblVuaXRQcm9qZWN0aW9uID0gbWVyZ2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gISFtZXJnZTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGl0IGNhY2hlZCBvbmUgYW5kIGFsbCBvdGhlciBjaGlsZHJlbiBzaGFyZSB0aGUgc2FtZSBwcm9qZWN0aW9uLFxuICBpZiAobm9uVW5pdFByb2plY3Rpb24gJiYgbWVyZ2FibGUpIHtcbiAgICAvLyBzbyB3ZSBjYW4gZWxldmF0ZSBpdCB0byB0aGUgbGF5ZXIgbGV2ZWxcbiAgICBjb25zdCBuYW1lID0gbW9kZWwucHJvamVjdGlvbk5hbWUodHJ1ZSk7XG4gICAgY29uc3QgbW9kZWxQcm9qZWN0aW9uID0gbmV3IFByb2plY3Rpb25Db21wb25lbnQoXG4gICAgICBuYW1lLFxuICAgICAgbm9uVW5pdFByb2plY3Rpb24uc3BlY2lmaWVkUHJvamVjdGlvbixcbiAgICAgIG5vblVuaXRQcm9qZWN0aW9uLnNpemUsXG4gICAgICBkdXBsaWNhdGUobm9uVW5pdFByb2plY3Rpb24uZGF0YSlcbiAgICApO1xuXG4gICAgLy8gcmVuYW1lIGFuZCBhc3NpZ24gYWxsIG90aGVycyBhcyBtZXJnZWRcbiAgICBtb2RlbC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgaWYgKGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uKSB7XG4gICAgICAgIG1vZGVsUHJvamVjdGlvbi5kYXRhID0gbW9kZWxQcm9qZWN0aW9uLmRhdGEuY29uY2F0KGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uLmRhdGEpO1xuICAgICAgICBjaGlsZC5yZW5hbWVQcm9qZWN0aW9uKGNoaWxkLmNvbXBvbmVudC5wcm9qZWN0aW9uLmdldCgnbmFtZScpLCBuYW1lKTtcbiAgICAgICAgY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24ubWVyZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtb2RlbFByb2plY3Rpb247XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIl19