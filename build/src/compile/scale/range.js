"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var log = require("../../log");
var scale_1 = require("../../scale");
var scale_2 = require("../../scale");
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var model_1 = require("../model");
var split_1 = require("../split");
var properties_1 = require("./properties");
exports.RANGE_PROPERTIES = ['range', 'rangeStep', 'scheme'];
function parseScaleRange(model) {
    if (model_1.isUnitModel(model)) {
        parseUnitScaleRange(model);
    }
    else {
        properties_1.parseNonUnitScaleProperty(model, 'range');
    }
}
exports.parseScaleRange = parseScaleRange;
function parseUnitScaleRange(model) {
    var localScaleComponents = model.component.scales;
    // use SCALE_CHANNELS instead of scales[channel] to ensure that x, y come first!
    channel_1.SCALE_CHANNELS.forEach(function (channel) {
        var localScaleCmpt = localScaleComponents[channel];
        if (!localScaleCmpt) {
            return;
        }
        var mergedScaleCmpt = model.getScaleComponent(channel);
        var specifiedScale = model.specifiedScales[channel];
        var fieldDef = model.fieldDef(channel);
        // Read if there is a specified width/height
        var sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
        var sizeSpecified = sizeType ? !!model.component.layoutSize.get(sizeType) : undefined;
        var scaleType = mergedScaleCmpt.get('type');
        // if autosize is fit, size cannot be data driven
        var rangeStep = util.contains(['point', 'band'], scaleType) || !!specifiedScale.rangeStep;
        if (sizeType && model.fit && !sizeSpecified && rangeStep) {
            log.warn(log.message.CANNOT_FIX_RANGE_STEP_WITH_FIT);
            sizeSpecified = true;
        }
        var xyRangeSteps = getXYRangeStep(model);
        var rangeWithExplicit = parseRangeForChannel(channel, scaleType, fieldDef.type, specifiedScale, model.config, localScaleCmpt.get('zero'), model.mark, sizeSpecified, model.getName(sizeType), xyRangeSteps);
        localScaleCmpt.setWithExplicit('range', rangeWithExplicit);
    });
}
function getXYRangeStep(model) {
    var xyRangeSteps = [];
    var xScale = model.getScaleComponent('x');
    var xRange = xScale && xScale.get('range');
    if (xRange && vega_schema_1.isVgRangeStep(xRange) && vega_util_1.isNumber(xRange.step)) {
        xyRangeSteps.push(xRange.step);
    }
    var yScale = model.getScaleComponent('y');
    var yRange = yScale && yScale.get('range');
    if (yRange && vega_schema_1.isVgRangeStep(yRange) && vega_util_1.isNumber(yRange.step)) {
        xyRangeSteps.push(yRange.step);
    }
    return xyRangeSteps;
}
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
function parseRangeForChannel(channel, scaleType, type, specifiedScale, config, zero, mark, sizeSpecified, sizeSignal, xyRangeSteps) {
    var noRangeStep = sizeSpecified || specifiedScale.rangeStep === null;
    // Check if any of the range properties is specified.
    // If so, check if it is compatible and make sure that we only output one of the properties
    for (var _i = 0, RANGE_PROPERTIES_1 = exports.RANGE_PROPERTIES; _i < RANGE_PROPERTIES_1.length; _i++) {
        var property = RANGE_PROPERTIES_1[_i];
        if (specifiedScale[property] !== undefined) {
            var supportedByScaleType = scale_1.scaleTypeSupportProperty(scaleType, property);
            var channelIncompatability = scale_1.channelScalePropertyIncompatability(channel, property);
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
            }
            else if (channelIncompatability) { // channel
                log.warn(channelIncompatability);
            }
            else {
                switch (property) {
                    case 'range':
                        return split_1.makeExplicit(specifiedScale[property]);
                    case 'scheme':
                        return split_1.makeExplicit(parseScheme(specifiedScale[property]));
                    case 'rangeStep':
                        var rangeStep = specifiedScale[property];
                        if (rangeStep !== null) {
                            if (!sizeSpecified) {
                                return split_1.makeExplicit({ step: rangeStep });
                            }
                            else {
                                // If top-level size is specified, we ignore specified rangeStep.
                                log.warn(log.message.rangeStepDropped(channel));
                            }
                        }
                }
            }
        }
    }
    return split_1.makeImplicit(defaultRange(channel, scaleType, type, config, zero, mark, sizeSignal, xyRangeSteps, noRangeStep));
}
exports.parseRangeForChannel = parseRangeForChannel;
function parseScheme(scheme) {
    if (scale_1.isExtendedScheme(scheme)) {
        var r = { scheme: scheme.name };
        if (scheme.count) {
            r.count = scheme.count;
        }
        if (scheme.extent) {
            r.extent = scheme.extent;
        }
        return r;
    }
    return { scheme: scheme };
}
function defaultRange(channel, scaleType, type, config, zero, mark, sizeSignal, xyRangeSteps, noRangeStep) {
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
            if (util.contains(['point', 'band'], scaleType) && !noRangeStep) {
                if (channel === channel_1.X && mark === 'text') {
                    if (config.scale.textXRangeStep) {
                        return { step: config.scale.textXRangeStep };
                    }
                }
                else {
                    if (config.scale.rangeStep) {
                        return { step: config.scale.rangeStep };
                    }
                }
            }
            // If range step is null, use zero to width or height.
            // Note that these range signals are temporary
            // as they can be merged and renamed.
            // (We do not have the right size signal here since parseLayoutSize() happens after parseScale().)
            // We will later replace these temporary names with
            // the final name in assembleScaleRange()
            if (channel === channel_1.Y && scale_2.hasContinuousDomain(scaleType)) {
                // For y continuous scale, we have to start from the height as the bottom part has the max value.
                return [{ signal: sizeSignal }, 0];
            }
            else {
                return [0, { signal: sizeSignal }];
            }
        case channel_1.SIZE:
            // TODO: support custom rangeMin, rangeMax
            var rangeMin = sizeRangeMin(mark, zero, config);
            var rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
            return [rangeMin, rangeMax];
        case channel_1.SHAPE:
            return 'symbol';
        case channel_1.COLOR:
        case channel_1.FILL:
        case channel_1.STROKE:
            if (scaleType === 'ordinal') {
                // Only nominal data uses ordinal scale by default
                return type === 'nominal' ? 'category' : 'ordinal';
            }
            return mark === 'rect' || mark === 'geoshape' ? 'heatmap' : 'ramp';
        case channel_1.OPACITY:
            // TODO: support custom rangeMin, rangeMax
            return [config.scale.minOpacity, config.scale.maxOpacity];
    }
    /* istanbul ignore next: should never reach here */
    throw new Error("Scale range undefined for channel " + channel);
}
exports.defaultRange = defaultRange;
function sizeRangeMin(mark, zero, config) {
    if (zero) {
        return 0;
    }
    switch (mark) {
        case 'bar':
        case 'tick':
            return config.scale.minBandSize;
        case 'line':
        case 'trail':
        case 'rule':
            return config.scale.minStrokeWidth;
        case 'text':
            return config.scale.minFontSize;
        case 'point':
        case 'square':
        case 'circle':
            return config.scale.minSize;
    }
    /* istanbul ignore next: should never reach here */
    // sizeRangeMin not implemented for the mark
    throw new Error(log.message.incompatibleChannel('size', mark));
}
function sizeRangeMax(mark, xyRangeSteps, config) {
    var scaleConfig = config.scale;
    // TODO(#1168): make max size scale based on rangeStep / overall plot size
    switch (mark) {
        case 'bar':
        case 'tick':
            if (config.scale.maxBandSize !== undefined) {
                return config.scale.maxBandSize;
            }
            return minXYRangeStep(xyRangeSteps, config.scale) - 1;
        case 'line':
        case 'trail':
        case 'rule':
            return config.scale.maxStrokeWidth;
        case 'text':
            return config.scale.maxFontSize;
        case 'point':
        case 'square':
        case 'circle':
            if (config.scale.maxSize) {
                return config.scale.maxSize;
            }
            // FIXME this case totally should be refactored
            var pointStep = minXYRangeStep(xyRangeSteps, scaleConfig);
            return (pointStep - 2) * (pointStep - 2);
    }
    /* istanbul ignore next: should never reach here */
    // sizeRangeMax not implemented for the mark
    throw new Error(log.message.incompatibleChannel('size', mark));
}
/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function minXYRangeStep(xyRangeSteps, scaleConfig) {
    if (xyRangeSteps.length > 0) {
        return Math.min.apply(null, xyRangeSteps);
    }
    if (scaleConfig.rangeStep) {
        return scaleConfig.rangeStep;
    }
    return 21; // FIXME: re-evaluate the default value here.
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9yYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFtQztBQUVuQyx5Q0FBcUg7QUFFckgsK0JBQWlDO0FBRWpDLHFDQVNxQjtBQUNyQixxQ0FBZ0Q7QUFFaEQsaUNBQW1DO0FBQ25DLGlEQUFtRTtBQUNuRSxrQ0FBNEM7QUFDNUMsa0NBQThEO0FBRzlELDJDQUF1RDtBQUsxQyxRQUFBLGdCQUFnQixHQUFvQixDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFHbEYseUJBQWdDLEtBQVk7SUFDMUMsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzVCO1NBQU07UUFDTCxzQ0FBeUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDM0M7QUFDSCxDQUFDO0FBTkQsMENBTUM7QUFFRCw2QkFBNkIsS0FBZ0I7SUFDM0MsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsZ0ZBQWdGO0lBQ2hGLHdCQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDM0MsSUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFDRCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFHekQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpDLDRDQUE0QztRQUM1QyxJQUFNLFFBQVEsR0FB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Q0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztLQUMzQztJQUNELElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRTtRQUN6QixPQUFPLFdBQVcsQ0FBQyxTQUFTLENBQUM7S0FDOUI7SUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLDZDQUE2QztBQUMxRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlcn0gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHtDaGFubmVsLCBDT0xPUiwgRklMTCwgT1BBQ0lUWSwgU0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbCwgU0hBUEUsIFNJWkUsIFNUUk9LRSwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7XG4gIGNoYW5uZWxTY2FsZVByb3BlcnR5SW5jb21wYXRhYmlsaXR5LFxuICBpc0V4dGVuZGVkU2NoZW1lLFxuICBSYW5nZSxcbiAgU2NhbGUsXG4gIFNjYWxlQ29uZmlnLFxuICBTY2FsZVR5cGUsXG4gIHNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eSxcbiAgU2NoZW1lLFxufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2hhc0NvbnRpbnVvdXNEb21haW59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBWZ1JhbmdlLCBWZ1NjaGVtZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RXhwbGljaXQsIG1ha2VFeHBsaWNpdCwgbWFrZUltcGxpY2l0fSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VOb25Vbml0U2NhbGVQcm9wZXJ0eX0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcblxuXG5leHBvcnQgdHlwZSBSYW5nZU1peGlucyA9IHtyYW5nZTogUmFuZ2V9IHwge3JhbmdlU3RlcDogbnVtYmVyfSB8IHtzY2hlbWU6IFNjaGVtZX07XG5cbmV4cG9ydCBjb25zdCBSQU5HRV9QUk9QRVJUSUVTOiAoa2V5b2YgU2NhbGUpW10gPSBbJ3JhbmdlJywgJ3JhbmdlU3RlcCcsICdzY2hlbWUnXTtcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZVJhbmdlKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVSYW5nZShtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VOb25Vbml0U2NhbGVQcm9wZXJ0eShtb2RlbCwgJ3JhbmdlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVSYW5nZShtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICAvLyB1c2UgU0NBTEVfQ0hBTk5FTFMgaW5zdGVhZCBvZiBzY2FsZXNbY2hhbm5lbF0gdG8gZW5zdXJlIHRoYXQgeCwgeSBjb21lIGZpcnN0IVxuICBTQ0FMRV9DSEFOTkVMUy5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBjb25zdCBsb2NhbFNjYWxlQ21wdCA9IGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdO1xuICAgIGlmICghbG9jYWxTY2FsZUNtcHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkU2NhbGVDbXB0ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG5cblxuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgICAvLyBSZWFkIGlmIHRoZXJlIGlzIGEgc3BlY2lmaWVkIHdpZHRoL2hlaWdodFxuICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6IGNoYW5uZWwgPT09ICd5JyA/ICdoZWlnaHQnIDogdW5kZWZpbmVkO1xuICAgIGxldCBzaXplU3BlY2lmaWVkID0gc2l6ZVR5cGUgPyAhIW1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSkgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBzY2FsZVR5cGUgPSBtZXJnZWRTY2FsZUNtcHQuZ2V0KCd0eXBlJyk7XG5cbiAgICAvLyBpZiBhdXRvc2l6ZSBpcyBmaXQsIHNpemUgY2Fubm90IGJlIGRhdGEgZHJpdmVuXG4gICAgY29uc3QgcmFuZ2VTdGVwID0gdXRpbC5jb250YWlucyhbJ3BvaW50JywgJ2JhbmQnXSwgc2NhbGVUeXBlKSB8fCAhIXNwZWNpZmllZFNjYWxlLnJhbmdlU3RlcDtcbiAgICBpZiAoc2l6ZVR5cGUgJiYgbW9kZWwuZml0ICYmICFzaXplU3BlY2lmaWVkICYmIHJhbmdlU3RlcCkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuQ0FOTk9UX0ZJWF9SQU5HRV9TVEVQX1dJVEhfRklUKTtcbiAgICAgIHNpemVTcGVjaWZpZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHh5UmFuZ2VTdGVwcyA9IGdldFhZUmFuZ2VTdGVwKG1vZGVsKTtcblxuICAgIGNvbnN0IHJhbmdlV2l0aEV4cGxpY2l0ID0gcGFyc2VSYW5nZUZvckNoYW5uZWwoXG4gICAgICBjaGFubmVsLCBzY2FsZVR5cGUsIGZpZWxkRGVmLnR5cGUsIHNwZWNpZmllZFNjYWxlLCBtb2RlbC5jb25maWcsXG4gICAgICBsb2NhbFNjYWxlQ21wdC5nZXQoJ3plcm8nKSwgbW9kZWwubWFyaywgc2l6ZVNwZWNpZmllZCwgbW9kZWwuZ2V0TmFtZShzaXplVHlwZSksIHh5UmFuZ2VTdGVwc1xuICAgICk7XG5cbiAgICBsb2NhbFNjYWxlQ21wdC5zZXRXaXRoRXhwbGljaXQoJ3JhbmdlJywgcmFuZ2VXaXRoRXhwbGljaXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0WFlSYW5nZVN0ZXAobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCB4eVJhbmdlU3RlcHM6IG51bWJlcltdID0gW107XG5cbiAgY29uc3QgeFNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgY29uc3QgeFJhbmdlID0geFNjYWxlICYmIHhTY2FsZS5nZXQoJ3JhbmdlJyk7XG4gIGlmICh4UmFuZ2UgJiYgaXNWZ1JhbmdlU3RlcCh4UmFuZ2UpICYmIGlzTnVtYmVyKHhSYW5nZS5zdGVwKSkge1xuICAgIHh5UmFuZ2VTdGVwcy5wdXNoKHhSYW5nZS5zdGVwKTtcbiAgfVxuXG4gIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5Jyk7XG4gIGNvbnN0IHlSYW5nZSA9IHlTY2FsZSAmJiB5U2NhbGUuZ2V0KCdyYW5nZScpO1xuICBpZiAoeVJhbmdlICYmIGlzVmdSYW5nZVN0ZXAoeVJhbmdlKSAmJiBpc051bWJlcih5UmFuZ2Uuc3RlcCkpIHtcbiAgICB4eVJhbmdlU3RlcHMucHVzaCh5UmFuZ2Uuc3RlcCk7XG4gIH1cblxuICByZXR1cm4geHlSYW5nZVN0ZXBzO1xufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgdGhhdCBpbmNsdWRlcyBvbmUgb2YgdGhlIHJhbmdlIHByb3BlcnRpZXMgKHJhbmdlLCByYW5nZVN0ZXAsIHNjaGVtZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlRm9yQ2hhbm5lbChcbiAgICBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgdHlwZTogVHlwZSwgc3BlY2lmaWVkU2NhbGU6IFNjYWxlLCBjb25maWc6IENvbmZpZyxcbiAgICB6ZXJvOiBib29sZWFuLCBtYXJrOiBNYXJrLCBzaXplU3BlY2lmaWVkOiBib29sZWFuLCBzaXplU2lnbmFsOiBzdHJpbmcsIHh5UmFuZ2VTdGVwczogbnVtYmVyW11cbiAgKTogRXhwbGljaXQ8VmdSYW5nZT4ge1xuXG4gIGNvbnN0IG5vUmFuZ2VTdGVwID0gc2l6ZVNwZWNpZmllZCB8fCBzcGVjaWZpZWRTY2FsZS5yYW5nZVN0ZXAgPT09IG51bGw7XG5cbiAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSByYW5nZSBwcm9wZXJ0aWVzIGlzIHNwZWNpZmllZC5cbiAgLy8gSWYgc28sIGNoZWNrIGlmIGl0IGlzIGNvbXBhdGlibGUgYW5kIG1ha2Ugc3VyZSB0aGF0IHdlIG9ubHkgb3V0cHV0IG9uZSBvZiB0aGUgcHJvcGVydGllc1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIFJBTkdFX1BST1BFUlRJRVMpIHtcbiAgICBpZiAoc3BlY2lmaWVkU2NhbGVbcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHN1cHBvcnRlZEJ5U2NhbGVUeXBlID0gc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5KHNjYWxlVHlwZSwgcHJvcGVydHkpO1xuICAgICAgY29uc3QgY2hhbm5lbEluY29tcGF0YWJpbGl0eSA9IGNoYW5uZWxTY2FsZVByb3BlcnR5SW5jb21wYXRhYmlsaXR5KGNoYW5uZWwsIHByb3BlcnR5KTtcbiAgICAgIGlmICghc3VwcG9ydGVkQnlTY2FsZVR5cGUpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNjYWxlVHlwZSwgcHJvcGVydHksIGNoYW5uZWwpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbEluY29tcGF0YWJpbGl0eSkgeyAvLyBjaGFubmVsXG4gICAgICAgIGxvZy53YXJuKGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXhwbGljaXQoc3BlY2lmaWVkU2NhbGVbcHJvcGVydHldKTtcbiAgICAgICAgICBjYXNlICdzY2hlbWUnOlxuICAgICAgICAgICAgcmV0dXJuIG1ha2VFeHBsaWNpdChwYXJzZVNjaGVtZShzcGVjaWZpZWRTY2FsZVtwcm9wZXJ0eV0pKTtcbiAgICAgICAgICBjYXNlICdyYW5nZVN0ZXAnOlxuICAgICAgICAgICAgY29uc3QgcmFuZ2VTdGVwID0gc3BlY2lmaWVkU2NhbGVbcHJvcGVydHldO1xuICAgICAgICAgICAgaWYgKHJhbmdlU3RlcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoIXNpemVTcGVjaWZpZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUV4cGxpY2l0KHtzdGVwOiByYW5nZVN0ZXB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0b3AtbGV2ZWwgc2l6ZSBpcyBzcGVjaWZpZWQsIHdlIGlnbm9yZSBzcGVjaWZpZWQgcmFuZ2VTdGVwLlxuICAgICAgICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnJhbmdlU3RlcERyb3BwZWQoY2hhbm5lbCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1ha2VJbXBsaWNpdChcbiAgICBkZWZhdWx0UmFuZ2UoXG4gICAgICBjaGFubmVsLCBzY2FsZVR5cGUsIHR5cGUsIGNvbmZpZyxcbiAgICAgIHplcm8sIG1hcmssIHNpemVTaWduYWwsIHh5UmFuZ2VTdGVwcywgbm9SYW5nZVN0ZXBcbiAgICApXG4gICk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2NoZW1lKHNjaGVtZTogU2NoZW1lKSB7XG4gIGlmIChpc0V4dGVuZGVkU2NoZW1lKHNjaGVtZSkpIHtcbiAgICBjb25zdCByOiBWZ1NjaGVtZSA9IHtzY2hlbWU6IHNjaGVtZS5uYW1lfTtcbiAgICBpZiAoc2NoZW1lLmNvdW50KSB7XG4gICAgICByLmNvdW50ID0gc2NoZW1lLmNvdW50O1xuICAgIH1cbiAgICBpZiAoc2NoZW1lLmV4dGVudCkge1xuICAgICAgci5leHRlbnQgPSBzY2hlbWUuZXh0ZW50O1xuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfVxuICByZXR1cm4ge3NjaGVtZTogc2NoZW1lfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSYW5nZShcbiAgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHR5cGU6IFR5cGUsIGNvbmZpZzogQ29uZmlnLCB6ZXJvOiBib29sZWFuLCBtYXJrOiBNYXJrLFxuICBzaXplU2lnbmFsOiBzdHJpbmcsIHh5UmFuZ2VTdGVwczogbnVtYmVyW10sIG5vUmFuZ2VTdGVwOiBib29sZWFuXG4pOiBWZ1JhbmdlIHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOlxuICAgIGNhc2UgWTpcbiAgICAgIGlmICh1dGlsLmNvbnRhaW5zKFsncG9pbnQnLCAnYmFuZCddLCBzY2FsZVR5cGUpICYmICFub1JhbmdlU3RlcCkge1xuICAgICAgICBpZiAoY2hhbm5lbCA9PT0gWCAmJiBtYXJrID09PSAndGV4dCcpIHtcbiAgICAgICAgICBpZiAoY29uZmlnLnNjYWxlLnRleHRYUmFuZ2VTdGVwKSB7XG4gICAgICAgICAgICByZXR1cm4ge3N0ZXA6IGNvbmZpZy5zY2FsZS50ZXh0WFJhbmdlU3RlcH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjb25maWcuc2NhbGUucmFuZ2VTdGVwKSB7XG4gICAgICAgICAgICByZXR1cm4ge3N0ZXA6IGNvbmZpZy5zY2FsZS5yYW5nZVN0ZXB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiByYW5nZSBzdGVwIGlzIG51bGwsIHVzZSB6ZXJvIHRvIHdpZHRoIG9yIGhlaWdodC5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGVzZSByYW5nZSBzaWduYWxzIGFyZSB0ZW1wb3JhcnlcbiAgICAgIC8vIGFzIHRoZXkgY2FuIGJlIG1lcmdlZCBhbmQgcmVuYW1lZC5cbiAgICAgIC8vIChXZSBkbyBub3QgaGF2ZSB0aGUgcmlnaHQgc2l6ZSBzaWduYWwgaGVyZSBzaW5jZSBwYXJzZUxheW91dFNpemUoKSBoYXBwZW5zIGFmdGVyIHBhcnNlU2NhbGUoKS4pXG4gICAgICAvLyBXZSB3aWxsIGxhdGVyIHJlcGxhY2UgdGhlc2UgdGVtcG9yYXJ5IG5hbWVzIHdpdGhcbiAgICAgIC8vIHRoZSBmaW5hbCBuYW1lIGluIGFzc2VtYmxlU2NhbGVSYW5nZSgpXG5cbiAgICAgIGlmIChjaGFubmVsID09PSBZICYmIGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSkge1xuICAgICAgICAvLyBGb3IgeSBjb250aW51b3VzIHNjYWxlLCB3ZSBoYXZlIHRvIHN0YXJ0IGZyb20gdGhlIGhlaWdodCBhcyB0aGUgYm90dG9tIHBhcnQgaGFzIHRoZSBtYXggdmFsdWUuXG4gICAgICAgIHJldHVybiBbe3NpZ25hbDogc2l6ZVNpZ25hbH0sIDBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFswLCB7c2lnbmFsOiBzaXplU2lnbmFsfV07XG4gICAgICB9XG4gICAgY2FzZSBTSVpFOlxuICAgICAgLy8gVE9ETzogc3VwcG9ydCBjdXN0b20gcmFuZ2VNaW4sIHJhbmdlTWF4XG4gICAgICBjb25zdCByYW5nZU1pbiA9IHNpemVSYW5nZU1pbihtYXJrLCB6ZXJvLCBjb25maWcpO1xuICAgICAgY29uc3QgcmFuZ2VNYXggPSBzaXplUmFuZ2VNYXgobWFyaywgeHlSYW5nZVN0ZXBzLCBjb25maWcpO1xuICAgICAgcmV0dXJuIFtyYW5nZU1pbiwgcmFuZ2VNYXhdO1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgY2FzZSBDT0xPUjpcbiAgICBjYXNlIEZJTEw6XG4gICAgY2FzZSBTVFJPS0U6XG4gICAgICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgLy8gT25seSBub21pbmFsIGRhdGEgdXNlcyBvcmRpbmFsIHNjYWxlIGJ5IGRlZmF1bHRcbiAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdub21pbmFsJyA/ICdjYXRlZ29yeScgOiAnb3JkaW5hbCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFyayA9PT0gJ3JlY3QnIHx8IG1hcmsgPT09ICdnZW9zaGFwZScgPyAnaGVhdG1hcCcgOiAncmFtcCc7XG4gICAgY2FzZSBPUEFDSVRZOlxuICAgICAgLy8gVE9ETzogc3VwcG9ydCBjdXN0b20gcmFuZ2VNaW4sIHJhbmdlTWF4XG4gICAgICByZXR1cm4gW2NvbmZpZy5zY2FsZS5taW5PcGFjaXR5LCBjb25maWcuc2NhbGUubWF4T3BhY2l0eV07XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHNob3VsZCBuZXZlciByZWFjaCBoZXJlICovXG4gIHRocm93IG5ldyBFcnJvcihgU2NhbGUgcmFuZ2UgdW5kZWZpbmVkIGZvciBjaGFubmVsICR7Y2hhbm5lbH1gKTtcbn1cblxuZnVuY3Rpb24gc2l6ZVJhbmdlTWluKG1hcms6IE1hcmssIHplcm86IGJvb2xlYW4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGlmICh6ZXJvKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSAnYmFyJzpcbiAgICBjYXNlICd0aWNrJzpcbiAgICAgIHJldHVybiBjb25maWcuc2NhbGUubWluQmFuZFNpemU7XG4gICAgY2FzZSAnbGluZSc6XG4gICAgY2FzZSAndHJhaWwnOlxuICAgIGNhc2UgJ3J1bGUnOlxuICAgICAgcmV0dXJuIGNvbmZpZy5zY2FsZS5taW5TdHJva2VXaWR0aDtcbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIHJldHVybiBjb25maWcuc2NhbGUubWluRm9udFNpemU7XG4gICAgY2FzZSAncG9pbnQnOlxuICAgIGNhc2UgJ3NxdWFyZSc6XG4gICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgIHJldHVybiBjb25maWcuc2NhbGUubWluU2l6ZTtcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUgKi9cbiAgLy8gc2l6ZVJhbmdlTWluIG5vdCBpbXBsZW1lbnRlZCBmb3IgdGhlIG1hcmtcbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoJ3NpemUnLCBtYXJrKSk7XG59XG5cbmZ1bmN0aW9uIHNpemVSYW5nZU1heChtYXJrOiBNYXJrLCB4eVJhbmdlU3RlcHM6IG51bWJlcltdLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBzY2FsZUNvbmZpZyA9IGNvbmZpZy5zY2FsZTtcbiAgLy8gVE9ETygjMTE2OCk6IG1ha2UgbWF4IHNpemUgc2NhbGUgYmFzZWQgb24gcmFuZ2VTdGVwIC8gb3ZlcmFsbCBwbG90IHNpemVcbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSAnYmFyJzpcbiAgICBjYXNlICd0aWNrJzpcbiAgICAgIGlmIChjb25maWcuc2NhbGUubWF4QmFuZFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gY29uZmlnLnNjYWxlLm1heEJhbmRTaXplO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1pblhZUmFuZ2VTdGVwKHh5UmFuZ2VTdGVwcywgY29uZmlnLnNjYWxlKSAtIDE7XG4gICAgY2FzZSAnbGluZSc6XG4gICAgY2FzZSAndHJhaWwnOlxuICAgIGNhc2UgJ3J1bGUnOlxuICAgICAgcmV0dXJuIGNvbmZpZy5zY2FsZS5tYXhTdHJva2VXaWR0aDtcbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIHJldHVybiBjb25maWcuc2NhbGUubWF4Rm9udFNpemU7XG4gICAgY2FzZSAncG9pbnQnOlxuICAgIGNhc2UgJ3NxdWFyZSc6XG4gICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgIGlmIChjb25maWcuc2NhbGUubWF4U2l6ZSkge1xuICAgICAgICByZXR1cm4gY29uZmlnLnNjYWxlLm1heFNpemU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZJWE1FIHRoaXMgY2FzZSB0b3RhbGx5IHNob3VsZCBiZSByZWZhY3RvcmVkXG4gICAgICBjb25zdCBwb2ludFN0ZXAgPSBtaW5YWVJhbmdlU3RlcCh4eVJhbmdlU3RlcHMsIHNjYWxlQ29uZmlnKTtcbiAgICAgIHJldHVybiAocG9pbnRTdGVwIC0gMikgKiAocG9pbnRTdGVwIC0gMik7XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHNob3VsZCBuZXZlciByZWFjaCBoZXJlICovXG4gIC8vIHNpemVSYW5nZU1heCBub3QgaW1wbGVtZW50ZWQgZm9yIHRoZSBtYXJrXG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKCdzaXplJywgbWFyaykpO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJhbmdlIHN0ZXAgb2YgeCBvciB5IG9yIG1pbmltdW0gYmV0d2VlbiB0aGUgdHdvIGlmIGJvdGggYXJlIG9yZGluYWwgc2NhbGUuXG4gKi9cbmZ1bmN0aW9uIG1pblhZUmFuZ2VTdGVwKHh5UmFuZ2VTdGVwczogbnVtYmVyW10sIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZyk6IG51bWJlciB7XG4gIGlmICh4eVJhbmdlU3RlcHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShudWxsLCB4eVJhbmdlU3RlcHMpO1xuICB9XG4gIGlmIChzY2FsZUNvbmZpZy5yYW5nZVN0ZXApIHtcbiAgICByZXR1cm4gc2NhbGVDb25maWcucmFuZ2VTdGVwO1xuICB9XG4gIHJldHVybiAyMTsgLy8gRklYTUU6IHJlLWV2YWx1YXRlIHRoZSBkZWZhdWx0IHZhbHVlIGhlcmUuXG59XG4iXX0=