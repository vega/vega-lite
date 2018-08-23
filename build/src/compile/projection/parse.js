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
        if (!first.explicit.hasOwnProperty(prop) && !second.explicit.hasOwnProperty(prop)) {
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
//# sourceMappingURL=parse.js.map