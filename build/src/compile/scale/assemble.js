"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var selection_1 = require("../selection/selection");
var domain_1 = require("./domain");
function assembleScaleForModelAndChildren(model) {
    return model.children.reduce(function (scales, child) {
        return scales.concat(child.assembleScales());
    }, assembleScalesForModel(model));
}
exports.assembleScaleForModelAndChildren = assembleScaleForModelAndChildren;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFJbEMsbUNBQTZDO0FBQzdDLGlEQUErSztBQUUvSyxvREFBa0Y7QUFDbEYsbUNBQXNDO0FBRXRDLDBDQUFpRCxLQUFZO0lBQzNELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLO1FBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFKRCw0RUFJQztBQUVELGdDQUF1QyxLQUFZO0lBQy9DLE1BQU0sQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFpQixFQUFFLE9BQXFCO1FBQ2xGLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFCLHdCQUF3QjtZQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdkMsMERBQTBEO1FBQ3JELElBQUEsMkJBQVMsRUFBRSxtQkFBSyxDQUFVO1FBQ3hCLElBQUEsaUJBQUksRUFBRSxpQkFBSSxFQUFFLG9CQUFhLEVBQUUsZ0JBQVMsRUFBRSwrRUFBa0IsQ0FBVTtRQUV6RSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxL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