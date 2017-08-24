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
        else if (fielddef_1.isConditionalDef(channelDef) && fielddef_1.isFieldDef(channelDef.condition)) {
            fieldDef = channelDef.condition;
            specifiedScale = channelDef.condition.scale || {};
        }
        else if (channel === 'x') {
            fieldDef = fielddef_1.getFieldDef(encoding.x2);
        }
        else if (channel === 'y') {
            fieldDef = fielddef_1.getFieldDef(encoding.y2);
        }
        if (fieldDef) {
            var specifiedScaleType = specifiedScale.type;
            var sType = type_1.scaleType(specifiedScale.type, channel, fieldDef, mark, specifiedScale.rangeStep, config.scale);
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
                        resolve[channel].scale = 'independent';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUEyRDtBQUMzRCwyQ0FBbUY7QUFDbkYscUNBTXFCO0FBQ3JCLG1DQUFnQztBQUVoQyxrQ0FBNEM7QUFDNUMsc0NBQStDO0FBQy9DLGtDQUFnRjtBQUVoRix5Q0FBZ0U7QUFDaEUsbUNBQTBDO0FBQzFDLDJDQUFnRDtBQUNoRCxpQ0FBd0M7QUFDeEMsK0JBQWlDO0FBRWpDLG9CQUEyQixLQUFZO0lBQ3JDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0Qix5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsQ0FBZSxVQUEyQyxFQUEzQyxnREFBQSxtREFBMkMsRUFBM0MseURBQTJDLEVBQTNDLElBQTJDO1FBQXpELElBQU0sSUFBSSxvREFBQTtRQUNiLCtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNqQztJQUNELHdCQUF3QjtJQUN4Qix1QkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFSRCxnQ0FRQztBQUVELHdCQUErQixLQUFZO0lBQ3pDLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7QUFDSCxDQUFDO0FBTkQsd0NBTUM7QUFFRDs7R0FFRztBQUNILDRCQUE0QixLQUFnQjtJQUNuQyxJQUFBLHlCQUFRLEVBQUUscUJBQU0sQ0FBVTtJQUNqQyxJ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