"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var selection_1 = require("../selection/selection");
function assembleScale(model) {
    return util_1.keys(model.component.scales).reduce(function (scales, channel) {
        var scaleComponent = model.component.scales[channel];
        if (scaleComponent.merged) {
            // Skipped merged scales
            return scales;
        }
        // We need to cast here as combine returns Partial<VgScale> by default.
        var scale = scaleComponent.combine(['name', 'type', 'domain', 'domainRaw', 'range']);
        scale.range = assembleScaleRange(scale.range, scale.name, model, channel);
        var domainRaw = scaleComponent.get('domainRaw');
        // As scale parsing occurs before selection parsing, a temporary signal
        // is used for domainRaw. Here, we detect if this temporary signal
        // is set, and replace it with the correct domainRaw signal.
        // For more information, see isRawSelectionDomain in selection.ts.
        if (domainRaw && selection_1.isRawSelectionDomain(domainRaw)) {
            scale.domainRaw = selection_1.selectionScaleDomain(model, domainRaw);
        }
        // Correct references to data as the original domain's data was determined
        // in parseScale, which happens before parseData. Thus the original data
        // reference can be incorrect.
        var domain = scaleComponent.get('domain');
        if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
            scales.push(scale);
        }
        else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
            domain.fields = domain.fields.map(function (f) {
                return tslib_1.__assign({}, f, { data: model.lookupDataSource(f.data) });
            });
            scales.push(scale);
        }
        else if (vega_schema_1.isSignalRefDomain(domain) || vega_util_1.isArray(domain)) {
            scales.push(scale);
        }
        else {
            throw new Error('invalid scale domain');
        }
        return scales;
    }, []);
}
exports.assembleScale = assembleScale;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFJbEMsbUNBQTZDO0FBQzdDLGlEQUErSztBQUUvSyxvREFBa0Y7QUFHbEYsdUJBQThCLEtBQVk7SUFDdEMsTUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQWlCLEVBQUUsT0FBZ0I7UUFDN0UsSUFBTSxjQUFjLEdBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVELHVFQUF1RTtRQUN2RSxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFZLENBQUM7UUFDbEcsS0FBSyxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTFFLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEQsdUVBQXVFO1FBQ3ZFLGtFQUFrRTtRQUNsRSw0REFBNEQ7UUFDNUQsa0VBQWtFO1FBQ2xFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxnQ0FBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRyxnQ0FBb0IsQ0FBQyxLQUFL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