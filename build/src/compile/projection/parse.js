import * as tslib_1 from "tslib";
import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, SHAPE } from '../../channel';
import { MAIN } from '../../data';
import { PROJECTION_PROPERTIES } from '../../projection';
import { GEOJSON } from '../../type';
import { duplicate, every, stringify } from '../../util';
import { isUnitModel } from '../model';
import { ProjectionComponent } from './component';
export function parseProjection(model) {
    if (isUnitModel(model)) {
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
function parseUnitProjection(model) {
    var specifiedProjection = model.specifiedProjection, config = model.config, hasProjection = model.hasProjection;
    if (hasProjection) {
        var data_1 = [];
        [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach(function (posssiblePair) {
            if (model.channelHasField(posssiblePair[0]) || model.channelHasField(posssiblePair[1])) {
                data_1.push({
                    signal: model.getName("geojson_" + data_1.length)
                });
            }
        });
        if (model.channelHasField(SHAPE) && model.fieldDef(SHAPE).type === GEOJSON) {
            data_1.push({
                signal: model.getName("geojson_" + data_1.length)
            });
        }
        if (data_1.length === 0) {
            // main source is geojson, so we can just use that
            data_1.push(model.requestDataName(MAIN));
        }
        return new ProjectionComponent(model.projectionName(true), tslib_1.__assign({}, (config.projection || {}), (specifiedProjection || {})), [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')], data_1);
    }
    return undefined;
}
function mergeIfNoConflict(first, second) {
    var allPropertiesShared = every(PROJECTION_PROPERTIES, function (prop) {
        // neither has the poperty
        if (!first.explicit.hasOwnProperty(prop) &&
            !second.explicit.hasOwnProperty(prop)) {
            return true;
        }
        // both have property and an equal value for property
        if (first.explicit.hasOwnProperty(prop) &&
            second.explicit.hasOwnProperty(prop) &&
            // some properties might be signals or objects and require hashing for comparison
            stringify(first.get(prop)) === stringify(second.get(prop))) {
            return true;
        }
        return false;
    });
    var size = stringify(first.size) === stringify(second.size);
    if (size) {
        if (allPropertiesShared) {
            return first;
        }
        else if (stringify(first.explicit) === stringify({})) {
            return second;
        }
        else if (stringify(second.explicit) === stringify({})) {
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
    var mergable = every(model.children, function (child) {
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
        var modelProjection_1 = new ProjectionComponent(name_1, nonUnitProjection.specifiedProjection, nonUnitProjection.size, duplicate(nonUnitProjection.data));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNoRixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXZELE9BQU8sRUFBQyxXQUFXLEVBQVEsTUFBTSxVQUFVLENBQUM7QUFFNUMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRWhELE1BQU0sMEJBQTBCLEtBQVk7SUFDMUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekQ7U0FBTTtRQUNMLHVFQUF1RTtRQUN2RSxrRUFBa0U7UUFDbEUsNkRBQTZEO1FBQzdELCtCQUErQjtRQUMvQixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3RDtBQUNILENBQUM7QUFFRCw2QkFBNkIsS0FBZ0I7SUFDcEMsSUFBQSwrQ0FBbUIsRUFBRSxxQkFBTSxFQUFFLG1DQUFhLENBQVU7SUFFM0QsSUFBSSxhQUFhLEVBQUU7UUFDakIsSUFBTSxNQUFJLEdBQTZCLEVBQUUsQ0FBQztRQUUxQyxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFF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QUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMzQixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO2dCQUM5QixpQkFBZSxDQUFDLElBQUksR0FBRyxpQkFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBSSxDQUFDLENBQUM7Z0JBQ3JFLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7YUFDMUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8saUJBQWUsQ0FBQztLQUN4QjtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xBVElUVURFLCBMQVRJVFVERTIsIExPTkdJVFVERSwgTE9OR0lUVURFMiwgU0hBUEV9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7UFJPSkVDVElPTl9QUk9QRVJUSUVTfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7R0VPSlNPTn0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2R1cGxpY2F0ZSwgZXZlcnksIHN0cmluZ2lmeX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtQcm9qZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVByb2plY3Rpb24obW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbiA9IHBhcnNlVW5pdFByb2plY3Rpb24obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIC8vIGJlY2F1c2UgcGFyc2UgaGFwcGVucyBmcm9tIGxlYXZlcyB1cCAodW5pdCBzcGVjcyBiZWZvcmUgbGF5ZXIgc3BlYyksXG4gICAgLy8gd2UgY2FuIGJlIHN1cmUgdGhhdCB0aGUgYWJvdmUgaWYgc3RhdGVtZW50IGhhcyBhbHJlYWR5IG9jY3VycmVkXG4gICAgLy8gYW5kIHRoZXJlZm9yZSB3ZSBoYXZlIGFjY2VzcyB0byBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvblxuICAgIC8vIGZvciBlYWNoIG9mIG1vZGVsJ3MgY2hpbGRyZW5cbiAgICBtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbiA9IHBhcnNlTm9uVW5pdFByb2plY3Rpb25zKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRQcm9qZWN0aW9uKG1vZGVsOiBVbml0TW9kZWwpOiBQcm9qZWN0aW9uQ29tcG9uZW50IHtcbiAgY29uc3Qge3NwZWNpZmllZFByb2plY3Rpb24sIGNvbmZpZywgaGFzUHJvamVjdGlvbn0gPSBtb2RlbDtcblxuICBpZiAoaGFzUHJvamVjdGlvbikge1xuICAgIGNvbnN0IGRhdGE6IChWZ1NpZ25hbFJlZiB8IHN0cmluZylbXSA9IFtdO1xuXG4gICAgW1tMT05HSVRVREUsIExBVElUVURFXSwgW0xPTkdJVFVERTIsIExBVElUVURFMl1dLmZvckVhY2goKHBvc3NzaWJsZVBhaXIpID0+IHtcbiAgICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQocG9zc3NpYmxlUGFpclswXSkgfHwgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKHBvc3NzaWJsZVBhaXJbMV0pKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGBnZW9qc29uXyR7ZGF0YS5sZW5ndGh9YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKFNIQVBFKSAmJiBtb2RlbC5maWVsZERlZihTSEFQRSkudHlwZSA9PT0gR0VPSlNPTikge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGBnZW9qc29uXyR7ZGF0YS5sZW5ndGh9YClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbWFpbiBzb3VyY2UgaXMgZ2VvanNvbiwgc28gd2UgY2FuIGp1c3QgdXNlIHRoYXRcbiAgICAgIGRhdGEucHVzaChtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvamVjdGlvbkNvbXBvbmVudChtb2RlbC5wcm9qZWN0aW9uTmFtZSh0cnVlKSwge1xuICAgICAgLi4uKGNvbmZpZy5wcm9qZWN0aW9uIHx8IHt9KSxcbiAgICAgIC4uLihzcGVjaWZpZWRQcm9qZWN0aW9uIHx8IHt9KSxcbiAgICB9LCBbbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKSwgbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JyldLCBkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuZnVuY3Rpb24gbWVyZ2VJZk5vQ29uZmxpY3QoZmlyc3Q6IFByb2plY3Rpb25Db21wb25lbnQsIHNlY29uZDogUHJvamVjdGlvbkNvbXBvbmVudCk6IFByb2plY3Rpb25Db21wb25lbnQge1xuICBjb25zdCBhbGxQcm9wZXJ0aWVzU2hhcmVkID0gZXZlcnkoUFJPSkVDVElPTl9QUk9QRVJUSUVTLCAocHJvcCkgPT4ge1xuICAgIC8vIG5laXRoZXIgaGFzIHRoZSBwb3BlcnR5XG4gICAgaWYgKCFmaXJzdC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgIXNlY29uZC5leHBsaWNpdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIGJvdGggaGF2ZSBwcm9wZXJ0eSBhbmQgYW4gZXF1YWwgdmFsdWUgZm9yIHByb3BlcnR5XG4gICAgaWYgKGZpcnN0LmV4cGxpY2l0Lmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICBzZWNvbmQuZXhwbGljaXQuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgIC8vIHNvbWUgcHJvcGVydGllcyBtaWdodCBiZSBzaWduYWxzIG9yIG9iamVjdHMgYW5kIHJlcXVpcmUgaGFzaGluZyBmb3IgY29tcGFyaXNvblxuICAgICAgc3RyaW5naWZ5KGZpcnN0LmdldChwcm9wKSkgPT09IHN0cmluZ2lmeShzZWNvbmQuZ2V0KHByb3ApKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgY29uc3Qgc2l6ZSA9IHN0cmluZ2lmeShmaXJzdC5zaXplKSA9PT0gc3RyaW5naWZ5KHNlY29uZC5zaXplKTtcbiAgaWYgKHNpemUpIHtcbiAgICBpZiAoYWxsUHJvcGVydGllc1NoYXJlZCkge1xuICAgICAgcmV0dXJuIGZpcnN0O1xuICAgIH0gZWxzZSBpZiAoc3RyaW5naWZ5KGZpcnN0LmV4cGxpY2l0KSA9PT0gc3RyaW5naWZ5KHt9KSkge1xuICAgICAgcmV0dXJuIHNlY29uZDtcbiAgICB9IGVsc2UgaWYgKHN0cmluZ2lmeShzZWNvbmQuZXhwbGljaXQpID09PSBzdHJpbmdpZnkoe30pKSB7XG4gICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgYWxsIHByb3BlcnRpZXMgZG9uJ3QgbWF0Y2gsIGxldCBlYWNoIHVuaXQgc3BlYyBoYXZlIGl0cyBvd24gcHJvamVjdGlvblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0UHJvamVjdGlvbnMobW9kZWw6IE1vZGVsKTogUHJvamVjdGlvbkNvbXBvbmVudCB7XG4gIGlmIChtb2RlbC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IG5vblVuaXRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uQ29tcG9uZW50O1xuICBjb25zdCBtZXJnYWJsZSA9IGV2ZXJ5KG1vZGVsLmNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICBwYXJzZVByb2plY3Rpb24oY2hpbGQpO1xuICAgIGNvbnN0IHByb2plY3Rpb24gPSBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbjtcbiAgICBpZiAoIXByb2plY3Rpb24pIHtcbiAgICAgIC8vIGNoaWxkIGxheWVyIGRvZXMgbm90IHVzZSBhIHByb2plY3Rpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIW5vblVuaXRQcm9qZWN0aW9uKSB7XG4gICAgICAvLyBjYWNoZWQgJ3Byb2plY3Rpb24nIGlzIG51bGwsIGNhY2hlIHRoaXMgb25lXG4gICAgICBub25Vbml0UHJvamVjdGlvbiA9IHByb2plY3Rpb247XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWVyZ2UgPSBtZXJnZUlmTm9Db25mbGljdChub25Vbml0UHJvamVjdGlvbiwgcHJvamVjdGlvbik7XG4gICAgICBpZiAobWVyZ2UpIHtcbiAgICAgICAgbm9uVW5pdFByb2plY3Rpb24gPSBtZXJnZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhIW1lcmdlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gaXQgY2FjaGVkIG9uZSBhbmQgYWxsIG90aGVyIGNoaWxkcmVuIHNoYXJlIHRoZSBzYW1lIHByb2plY3Rpb24sXG4gIGlmIChub25Vbml0UHJvamVjdGlvbiAmJiBtZXJnYWJsZSkge1xuICAgIC8vIHNvIHdlIGNhbiBlbGV2YXRlIGl0IHRvIHRoZSBsYXllciBsZXZlbFxuICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5wcm9qZWN0aW9uTmFtZSh0cnVlKTtcbiAgICBjb25zdCBtb2RlbFByb2plY3Rpb24gPSBuZXcgUHJvamVjdGlvbkNvbXBvbmVudChcbiAgICAgIG5hbWUsXG4gICAgICBub25Vbml0UHJvamVjdGlvbi5zcGVjaWZpZWRQcm9qZWN0aW9uLFxuICAgICAgbm9uVW5pdFByb2plY3Rpb24uc2l6ZSxcbiAgICAgIGR1cGxpY2F0ZShub25Vbml0UHJvamVjdGlvbi5kYXRhKVxuICAgICk7XG5cbiAgICAvLyByZW5hbWUgYW5kIGFzc2lnbiBhbGwgb3RoZXJzIGFzIG1lcmdlZFxuICAgIG1vZGVsLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24pIHtcbiAgICAgICAgbW9kZWxQcm9qZWN0aW9uLmRhdGEgPSBtb2RlbFByb2plY3Rpb24uZGF0YS5jb25jYXQoY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24uZGF0YSk7XG4gICAgICAgIGNoaWxkLnJlbmFtZVByb2plY3Rpb24oY2hpbGQuY29tcG9uZW50LnByb2plY3Rpb24uZ2V0KCduYW1lJyksIG5hbWUpO1xuICAgICAgICBjaGlsZC5jb21wb25lbnQucHJvamVjdGlvbi5tZXJnZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1vZGVsUHJvamVjdGlvbjtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=