"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
var domain_1 = require("./domain");
function assembleScales(model) {
    if (model_1.isLayerModel(model) || model_1.isConcatModel(model) || model_1.isRepeatModel(model)) {
        // For concat / layer / repeat, include scales of children too
        return model.children.reduce(function (scales, child) {
            return scales.concat(assembleScales(child));
        }, assembleScalesForModel(model));
    }
    else {
        // For facet, child scales would not be included in the parent's scope.
        // For unit, there is no child.
        return assembleScalesForModel(model);
    }
}
exports.assembleScales = assembleScales;
function assembleScalesForModel(model) {
    return util_1.keys(model.component.scales).reduce(function (scales, channel) {
        var scaleComponent = model.component.scales[channel];
        if (scaleComponent.merged) {
            // Skipped merged scales
            return scales;
        }
        var scale = scaleComponent.combine();
        // need to separate const and non const object destruction
        var domainRaw = scale.domainRaw, range = scale.range;
        var name = scale.name, type = scale.type, _d = scale.domainRaw, _r = scale.range, otherScaleProps = tslib_1.__rest(scale, ["name", "type", "domainRaw", "range"]);
        range = assembleScaleRange(range, name, model, channel);
        // As scale parsing occurs before selection parsing, a temporary signal
        // is used for domainRaw. Here, we detect if this temporary signal
        // is set, and replace it with the correct domainRaw signal.
        // For more information, see isRawSelectionDomain in selection.ts.
        if (domainRaw && selection_1.isRawSelectionDomain(domainRaw)) {
            domainRaw = selection_1.selectionScaleDomain(model, domainRaw);
        }
        var domains = scaleComponent.domains.map(function (domain) {
            // Correct references to data as the original domain's data was determined
            // in parseScale, which happens before parseData. Thus the original data
            // reference can be incorrect.
            if (vega_schema_1.isDataRefDomain(domain)) {
                domain.data = model.lookupDataSource(domain.data);
            }
            return domain;
        });
        // domains is an array that has to be merged into a single vega domain
        var domain = domain_1.mergeDomains(domains);
        scales.push(tslib_1.__assign({ name: name,
            type: type, domain: domain }, (domainRaw ? { domainRaw: domainRaw } : {}), { range: range }, otherScaleProps));
        return scales;
    }, []);
}
exports.assembleScalesForModel = assembleScalesForModel;
function assembleScaleRange(scaleRange, scaleName, model, channel) {
    // add signals to x/y range
    if (channel === 'x' || channel === 'y') {
        if (vega_schema_1.isVgRangeStep(scaleRange)) {
            // For x/y range step, use a signal created in layout assemble instead of a constant range step.
            return {
                step: { signal: scaleName + '_step' }
            };
        }
        else if (vega_util_1.isArray(scaleRange) && scaleRange.length === 2) {
            var r0 = scaleRange[0];
            var r1 = scaleRange[1];
            if (r0 === 0 && vega_schema_1.isVgSignalRef(r1)) {
                // Replace width signal just in case it is renamed.
                return [0, { signal: model.getSizeName(r1.signal) }];
            }
            else if (vega_schema_1.isVgSignalRef(r0) && r1 === 0) {
                // Replace height signal just in case it is renamed.
                return [{ signal: model.getSizeName(r0.signal) }, 0];
            }
        }
    }
    return scaleRange;
}
exports.assembleScaleRange = assembleScaleRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFFbEMsbUNBQWdDO0FBQ2hDLGlEQUFrRztBQUNsRyxrQ0FBMkU7QUFDM0Usb0RBQWtGO0FBQ2xGLG1DQUFzQztBQUV0Qyx3QkFBK0IsS0FBWTtJQUN6QyxFQUFFLENBQUMsQ0FBQyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLElBQUkscUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsOERBQThEO1FBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHVFQUF1RTtRQUN2RSwrQkFBK0I7UUFDL0IsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7QUFDSCxDQUFDO0FBWEQsd0NBV0M7QUFFRCxnQ0FBdUMsS0FBWTtJQUMvQyxNQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBaUIsRUFBRSxPQUFxQjtRQUNsRixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQix3QkFBd0I7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