"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var model_1 = require("../model");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var component_1 = require("./component");
var domain_1 = require("./domain");
var properties_1 = require("./properties");
var range_1 = require("./range");
var type_1 = require("./type");
function parseScale(model) {
    parseScaleCore(model);
    domain_1.parseScaleDomain(model);
    for (var _i = 0, NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1 = scale_1.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES; _i < NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1.length; _i++) {
        var prop = NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1[_i];
        properties_1.parseScaleProperty(model, prop);
    }
    // range depends on zero
    range_1.parseScaleRange(model);
}
exports.parseScale = parseScale;
function parseScaleCore(model) {
    if (model_1.isUnitModel(model)) {
        model.component.scales = parseUnitScaleCore(model);
    }
    else {
        model.component.scales = parseNonUnitScaleCore(model);
    }
}
exports.parseScaleCore = parseScaleCore;
/**
 * Parse scales for all channels of a model.
 */
function parseUnitScaleCore(model) {
    var encoding = model.encoding, config = model.config;
    var mark = model.mark();
    return channel_1.SCALE_CHANNELS.reduce(function (scaleComponents, channel) {
        var fieldDef;
        var specifiedScale = {};
        var channelDef = encoding[channel];
        if (fielddef_1.isFieldDef(channelDef)) {
            fieldDef = channelDef;
            specifiedScale = channelDef.scale || {};
        }
        else if (fielddef_1.hasConditionalFieldDef(channelDef)) {
            fieldDef = channelDef.condition;
            specifiedScale = channelDef.condition['scale'] || {}; // We use ['scale'] since we know that channel here has scale for sure
        }
        else if (channel === 'x') {
            fieldDef = fielddef_1.getFieldDef(encoding.x2);
        }
        else if (channel === 'y') {
            fieldDef = fielddef_1.getFieldDef(encoding.y2);
        }
        if (fieldDef) {
            var specifiedScaleType = specifiedScale.type;
            var sType = type_1.scaleType(specifiedScale.type, channel, fieldDef, mark, config.scale);
            scaleComponents[channel] = new component_1.ScaleComponent(model.scaleName(channel + '', true), { value: sType, explicit: specifiedScaleType === sType });
        }
        return scaleComponents;
    }, {});
}
var scaleTypeTieBreaker = split_1.tieBreakByComparing(function (st1, st2) { return (scale_1.scaleTypePrecedence(st1) - scale_1.scaleTypePrecedence(st2)); });
function parseNonUnitScaleCore(model) {
    var scaleComponents = model.component.scales = {};
    var scaleTypeWithExplicitIndex = {};
    var resolve = model.component.resolve;
    var _loop_1 = function (child) {
        parseScaleCore(child);
        // Instead of always merging right away -- check if it is compatible to merge first!
        util_1.keys(child.component.scales).forEach(function (channel) {
            // if resolve is undefined, set default first
            resolve.scale[channel] = resolve.scale[channel] || resolve_1.defaultScaleResolve(channel, model);
            if (resolve.scale[channel] === 'shared') {
                var scaleType_1 = scaleTypeWithExplicitIndex[channel];
                var childScaleType = child.component.scales[channel].getWithExplicit('type');
                if (scaleType_1) {
                    if (scale_1.scaleCompatible(scaleType_1.value, childScaleType.value)) {
                        // merge scale component if type are compatible
                        scaleTypeWithExplicitIndex[channel] = split_1.mergeValuesWithExplicit(scaleType_1, childScaleType, 'type', 'scale', scaleTypeTieBreaker);
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
    util_1.keys(scaleTypeWithExplicitIndex).forEach(function (channel) {
        // Create new merged scale component
        var name = model.scaleName(channel, true);
        var typeWithExplicit = scaleTypeWithExplicitIndex[channel];
        scaleComponents[channel] = new component_1.ScaleComponent(name, typeWithExplicit);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUEyRDtBQUMzRCwyQ0FBeUY7QUFDekYscUNBTXFCO0FBQ3JCLG1DQUFnQztBQUVoQyxrQ0FBNEM7QUFDNUMsc0NBQStDO0FBQy9DLGtDQUFnRjtBQUVoRix5Q0FBZ0U7QUFDaEUsbUNBQTBDO0FBQzFDLDJDQUFnRDtBQUNoRCxpQ0FBd0M7QUFDeEMsK0JBQWlDO0FBRWpDLG9CQUEyQixLQUFZO0lBQ3JDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0Qix5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsQ0FBZSxVQUEyQyxFQUEzQyxnREFBQSxtREFBMkMsRUFBM0MseURBQTJDLEVBQTNDLElBQTJDO1FBQXpELElBQU0sSUFBSSxvREFBQTtRQUNiLCtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNqQztJQUNELHdCQUF3QjtJQUN4Qix1QkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFSRCxnQ0FRQztBQUVELHdCQUErQixLQUFZO0lBQ3pDLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7QUFDSCxDQUFDO0FBTkQsd0NBTUM7QUFFRDs7R0FFRztBQUNILDRCQUE0QixLQUFnQjtJQUNuQyxJQUFBLHlCQUFRLEVBQUUscUJBQU0sQ0FBVTtJQUNqQyxJ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