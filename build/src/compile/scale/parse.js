import { SCALE_CHANNELS, SHAPE, X, Y } from '../../channel';
import { getFieldDef, hasConditionalFieldDef, isFieldDef } from '../../fielddef';
import { GEOSHAPE } from '../../mark';
import { NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES, scaleCompatible, scaleTypePrecedence } from '../../scale';
import { GEOJSON } from '../../type';
import { keys } from '../../util';
import { isUnitModel } from '../model';
import { defaultScaleResolve } from '../resolve';
import { mergeValuesWithExplicit, tieBreakByComparing } from '../split';
import { ScaleComponent } from './component';
import { parseScaleDomain } from './domain';
import { parseScaleProperty } from './properties';
import { parseScaleRange } from './range';
import { scaleType } from './type';
export function parseScale(model) {
    parseScaleCore(model);
    parseScaleDomain(model);
    for (var _i = 0, NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1 = NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES; _i < NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1.length; _i++) {
        var prop = NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1[_i];
        parseScaleProperty(model, prop);
    }
    // range depends on zero
    parseScaleRange(model);
}
export function parseScaleCore(model) {
    if (isUnitModel(model)) {
        model.component.scales = parseUnitScaleCore(model);
    }
    else {
        model.component.scales = parseNonUnitScaleCore(model);
    }
}
/**
 * Parse scales for all channels of a model.
 */
function parseUnitScaleCore(model) {
    var encoding = model.encoding, config = model.config, mark = model.mark;
    return SCALE_CHANNELS.reduce(function (scaleComponents, channel) {
        var fieldDef;
        var specifiedScale;
        var channelDef = encoding[channel];
        // Don't generate scale for shape of geoshape
        if (isFieldDef(channelDef) && mark === GEOSHAPE && channel === SHAPE && channelDef.type === GEOJSON) {
            return scaleComponents;
        }
        if (isFieldDef(channelDef)) {
            fieldDef = channelDef;
            specifiedScale = channelDef.scale;
        }
        else if (hasConditionalFieldDef(channelDef)) {
            fieldDef = channelDef.condition;
            specifiedScale = channelDef.condition['scale']; // We use ['scale'] since we know that channel here has scale for sure
        }
        else if (channel === X) {
            fieldDef = getFieldDef(encoding.x2);
        }
        else if (channel === Y) {
            fieldDef = getFieldDef(encoding.y2);
        }
        if (fieldDef && specifiedScale !== null && specifiedScale !== false) {
            specifiedScale = specifiedScale || {};
            var sType = scaleType(specifiedScale, channel, fieldDef, mark, config.scale);
            scaleComponents[channel] = new ScaleComponent(model.scaleName(channel + '', true), {
                value: sType,
                explicit: specifiedScale.type === sType
            });
        }
        return scaleComponents;
    }, {});
}
var scaleTypeTieBreaker = tieBreakByComparing(function (st1, st2) { return scaleTypePrecedence(st1) - scaleTypePrecedence(st2); });
function parseNonUnitScaleCore(model) {
    var scaleComponents = (model.component.scales = {});
    var scaleTypeWithExplicitIndex = {};
    var resolve = model.component.resolve;
    var _loop_1 = function (child) {
        parseScaleCore(child);
        // Instead of always merging right away -- check if it is compatible to merge first!
        keys(child.component.scales).forEach(function (channel) {
            // if resolve is undefined, set default first
            resolve.scale[channel] = resolve.scale[channel] || defaultScaleResolve(channel, model);
            if (resolve.scale[channel] === 'shared') {
                var explicitScaleType = scaleTypeWithExplicitIndex[channel];
                var childScaleType = child.component.scales[channel].getWithExplicit('type');
                if (explicitScaleType) {
                    if (scaleCompatible(explicitScaleType.value, childScaleType.value)) {
                        // merge scale component if type are compatible
                        scaleTypeWithExplicitIndex[channel] = mergeValuesWithExplicit(explicitScaleType, childScaleType, 'type', 'scale', scaleTypeTieBreaker);
                    }
                    else {
                        // Otherwise, update conflicting channel to be independent
                        resolve.scale[channel] = 'independent';
                        // Remove from the index so they don't get merged
                        delete scaleTypeWithExplicitIndex[channel];
                    }
                }
                else {
                    scaleTypeWithExplicitIndex[channel] = childScaleType;
                }
            }
        });
    };
    // Parse each child scale and determine if a particular channel can be merged.
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        _loop_1(child);
    }
    // Merge each channel listed in the index
    keys(scaleTypeWithExplicitIndex).forEach(function (channel) {
        // Create new merged scale component
        var name = model.scaleName(channel, true);
        var typeWithExplicit = scaleTypeWithExplicitIndex[channel];
        scaleComponents[channel] = new ScaleComponent(name, typeWithExplicit);
        // rename each child and mark them as merged
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childScale = child.component.scales[channel];
            if (childScale) {
                child.renameScale(childScale.get('name'), name);
                childScale.merged = true;
            }
        }
    });
    return scaleComponents;
}
//# sourceMappingURL=parse.js.map