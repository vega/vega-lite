"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function normalizeMarkDef(mark, encoding, config) {
    var markDef = mark_1.isMarkDef(mark) ? __assign({}, mark) : { type: mark };
    // set orient, which can be overridden by rules as sometimes the specified orient is invalid.
    var specifiedOrient = markDef.orient || common_1.getMarkConfig('orient', markDef, config);
    markDef.orient = orient(markDef.type, encoding, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    // set opacity and filled if not specified in mark config
    var specifiedOpacity = markDef.opacity || common_1.getMarkConfig('opacity', markDef, config);
    if (specifiedOpacity === undefined) {
        markDef.opacity = defaultOpacity(markDef.type, encoding);
    }
    var specifiedFilled = markDef.filled;
    if (specifiedFilled === undefined) {
        markDef.filled = filled(markDef, config);
    }
    return markDef;
}
exports.normalizeMarkDef = normalizeMarkDef;
function defaultOpacity(mark, encoding) {
    if (util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], mark)) {
        // point-based marks
        if (!encoding_1.isAggregate(encoding)) {
            return 0.7;
        }
    }
    return undefined;
}
function filled(markDef, config) {
    var filledConfig = common_1.getMarkConfig('filled', markDef, config);
    var mark = markDef.type;
    return filledConfig !== undefined ? filledConfig : mark !== mark_1.POINT && mark !== mark_1.LINE && mark !== mark_1.RULE;
}
function orient(mark, encoding, specifiedOrient) {
    switch (mark) {
        case mark_1.POINT:
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
        case mark_1.TEXT:
        case mark_1.RECT:
            // orient is meaningless for these marks.
            return undefined;
    }
    var yIsRange = encoding.y2;
    var xIsRange = encoding.x2;
    switch (mark) {
        case mark_1.RULE:
            // return undefined for line segment rule
            if (xIsRange && yIsRange) {
                return undefined;
            }
        /* tslint:disable */
        // intentional fall through
        case mark_1.BAR:
        case mark_1.AREA:
            // If there are range for both x and y, y (vertical) has higher precedence.
            if (yIsRange) {
                return 'vertical';
            }
            else if (xIsRange) {
                return 'horizontal';
            }
            else if (mark === mark_1.RULE) {
                if (encoding.x && !encoding.y) {
                    return 'vertical';
                }
                else if (encoding.y && !encoding.x) {
                    return 'horizontal';
                }
            }
        case mark_1.LINE: // intentional fall through
        case mark_1.TICK:// Tick is opposite to bar, line, area and never have ranged mark.
            /* tslint:enable */
            var xIsContinuous = fielddef_1.isFieldDef(encoding.x) && fielddef_1.isContinuous(encoding.x);
            var yIsContinuous = fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y);
            if (xIsContinuous && !yIsContinuous) {
                return mark !== 'tick' ? 'horizontal' : 'vertical';
            }
            else if (!xIsContinuous && yIsContinuous) {
                return mark !== 'tick' ? 'vertical' : 'horizontal';
            }
            else if (xIsContinuous && yIsContinuous) {
                var xDef = encoding.x; // we can cast here since they are surely fieldDef
                var yDef = encoding.y;
                var xIsTemporal = xDef.type === type_1.TEMPORAL;
                var yIsTemporal = yDef.type === type_1.TEMPORAL;
                // temporal without timeUnit is considered continuous, but better serves as dimension
                if (xIsTemporal && !yIsTemporal) {
                    return mark !== 'tick' ? 'vertical' : 'horizontal';
                }
                else if (!xIsTemporal && yIsTemporal) {
                    return mark !== 'tick' ? 'horizontal' : 'vertical';
                }
                if (!xDef.aggregate && yDef.aggregate) {
                    return mark !== 'tick' ? 'vertical' : 'horizontal';
                }
                else if (xDef.aggregate && !yDef.aggregate) {
                    return mark !== 'tick' ? 'horizontal' : 'vertical';
                }
                if (specifiedOrient) {
                    // When ambiguous, use user specified one.
                    return specifiedOrient;
                }
                if (!(mark === mark_1.LINE && encoding.order)) {
                    // Except for connected scatterplot, we should log warning for unclear orientation of QxQ plots.
                    log.warn(log.message.unclearOrientContinuous(mark));
                }
                return 'vertical';
            }
            else {
                // For Discrete x Discrete case, return undefined.
                log.warn(log.message.unclearOrientDiscreteOrEmpty(mark));
                return undefined;
            }
    }
    return 'vertical';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsMkNBQXFEO0FBQ3JELDJDQUFrRTtBQUNsRSwrQkFBaUM7QUFDakMsbUNBQW9IO0FBQ3BILG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsb0NBQXdDO0FBSXhDLDBCQUFpQyxJQUFvQixFQUFFLFFBQTBCLEVBQUUsTUFBYztJQUMvRixJQUFNLE9BQU8sR0FBWSxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXBFLDZGQUE2RjtJQUM3RixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLHNCQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNqRSxFQUFFLENBQUMsQ0FBQyxlQUFlLEtBQUssU0FBUyxJQUFJLGVBQWUsS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN4RSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCx5REFBeUQ7SUFDekQsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLHNCQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE9B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QUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3BCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixrREFBa0Q7Z0JBQ2xELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ25CLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RW5jb2RpbmcsIGlzQWdncmVnYXRlfSBmcm9tICcuLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBpc0NvbnRpbnVvdXMsIGlzRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBUkVBLCBCQVIsIENJUkNMRSwgaXNNYXJrRGVmLCBMSU5FLCBNYXJrLCBNYXJrRGVmLCBQT0lOVCwgUkVDVCwgUlVMRSwgU1FVQVJFLCBURVhULCBUSUNLfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7VEVNUE9SQUx9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2dldE1hcmtDb25maWd9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge09yaWVudH0gZnJvbSAnLi8uLi8uLi92ZWdhLnNjaGVtYSc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU1hcmtEZWYobWFyazogTWFyayB8IE1hcmtEZWYsIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBtYXJrRGVmOiBNYXJrRGVmID0gaXNNYXJrRGVmKG1hcmspID8gey4uLm1hcmt9IDoge3R5cGU6IG1hcmt9O1xuXG4gIC8vIHNldCBvcmllbnQsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHJ1bGVzIGFzIHNvbWV0aW1lcyB0aGUgc3BlY2lmaWVkIG9yaWVudCBpcyBpbnZhbGlkLlxuICBjb25zdCBzcGVjaWZpZWRPcmllbnQgPSBtYXJrRGVmLm9yaWVudCB8fCBnZXRNYXJrQ29uZmlnKCdvcmllbnQnLCBtYXJrRGVmLCBjb25maWcpO1xuICBtYXJrRGVmLm9yaWVudCA9IG9yaWVudChtYXJrRGVmLnR5cGUsIGVuY29kaW5nLCBzcGVjaWZpZWRPcmllbnQpO1xuICBpZiAoc3BlY2lmaWVkT3JpZW50ICE9PSB1bmRlZmluZWQgJiYgc3BlY2lmaWVkT3JpZW50ICE9PSBtYXJrRGVmLm9yaWVudCkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLm9yaWVudE92ZXJyaWRkZW4obWFya0RlZi5vcmllbnQsc3BlY2lmaWVkT3JpZW50KSk7XG4gIH1cblxuICAvLyBzZXQgb3BhY2l0eSBhbmQgZmlsbGVkIGlmIG5vdCBzcGVjaWZpZWQgaW4gbWFyayBjb25maWdcbiAgY29uc3Qgc3BlY2lmaWVkT3BhY2l0eSA9IG1hcmtEZWYub3BhY2l0eSB8fCBnZXRNYXJrQ29uZmlnKCdvcGFjaXR5JywgbWFya0RlZiwgY29uZmlnKTtcbiAgaWYgKHNwZWNpZmllZE9wYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYub3BhY2l0eSA9IGRlZmF1bHRPcGFjaXR5KG1hcmtEZWYudHlwZSwgZW5jb2RpbmcpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2lmaWVkRmlsbGVkID0gbWFya0RlZi5maWxsZWQ7XG4gIGlmIChzcGVjaWZpZWRGaWxsZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYuZmlsbGVkID0gZmlsbGVkKG1hcmtEZWYsIGNvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIG1hcmtEZWY7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRPcGFjaXR5KG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KSB7XG4gIGlmIChjb250YWlucyhbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSwgbWFyaykpIHtcbiAgICAvLyBwb2ludC1iYXNlZCBtYXJrc1xuICAgIGlmICghaXNBZ2dyZWdhdGUoZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gMC43O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmaWxsZWQobWFya0RlZjogTWFya0RlZiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZmlsbGVkQ29uZmlnID0gZ2V0TWFya0NvbmZpZygnZmlsbGVkJywgbWFya0RlZiwgY29uZmlnKTtcbiAgY29uc3QgbWFyayA9IG1hcmtEZWYudHlwZTtcbiAgcmV0dXJuIGZpbGxlZENvbmZpZyAhPT0gdW5kZWZpbmVkID8gZmlsbGVkQ29uZmlnIDogbWFyayAhPT0gUE9JTlQgJiYgbWFyayAhPT0gTElORSAmJiBtYXJrICE9PSBSVUxFO1xufVxuXG5mdW5jdGlvbiBvcmllbnQobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIHNwZWNpZmllZE9yaWVudDogT3JpZW50KTogT3JpZW50IHtcbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSBQT0lOVDpcbiAgICBjYXNlIENJUkNMRTpcbiAgICBjYXNlIFNRVUFSRTpcbiAgICBjYXNlIFRFWFQ6XG4gICAgY2FzZSBSRUNUOlxuICAgICAgLy8gb3JpZW50IGlzIG1lYW5pbmdsZXNzIGZvciB0aGVzZSBtYXJrcy5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB5SXNSYW5nZSA9IGVuY29kaW5nLnkyO1xuICBjb25zdCB4SXNSYW5nZSA9IGVuY29kaW5nLngyO1xuXG4gIHN3aXRjaCAobWFyaykge1xuICAgIGNhc2UgUlVMRTpcbiAgICAgIC8vIHJldHVybiB1bmRlZmluZWQgZm9yIGxpbmUgc2VnbWVudCBydWxlXG4gICAgICBpZiAoeElzUmFuZ2UgJiYgeUlzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8qIHRzbGludDpkaXNhYmxlICovXG4gICAgICAvLyBpbnRlbnRpb25hbCBmYWxsIHRocm91Z2hcbiAgICBjYXNlIEJBUjpcbiAgICBjYXNlIEFSRUE6XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgcmFuZ2UgZm9yIGJvdGggeCBhbmQgeSwgeSAodmVydGljYWwpIGhhcyBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgICAgIGlmICh5SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAobWFyayA9PT0gUlVMRSkge1xuICAgICAgICBpZiAoZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xuICAgICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkgJiYgIWVuY29kaW5nLngpIHtcbiAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgIGNhc2UgTElORTogLy8gaW50ZW50aW9uYWwgZmFsbCB0aHJvdWdoXG4gICAgY2FzZSBUSUNLOiAvLyBUaWNrIGlzIG9wcG9zaXRlIHRvIGJhciwgbGluZSwgYXJlYSBhbmQgbmV2ZXIgaGF2ZSByYW5nZWQgbWFyay5cblxuICAgICAgLyogdHNsaW50OmVuYWJsZSAqL1xuICAgICAgY29uc3QgeElzQ29udGludW91cyA9IGlzRmllbGREZWYoZW5jb2RpbmcueCkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLngpO1xuICAgICAgY29uc3QgeUlzQ29udGludW91cyA9IGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpO1xuICAgICAgaWYgKHhJc0NvbnRpbnVvdXMgJiYgIXlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKCF4SXNDb250aW51b3VzICYmIHlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICB9IGVsc2UgaWYgKHhJc0NvbnRpbnVvdXMgJiYgeUlzQ29udGludW91cykge1xuICAgICAgICBjb25zdCB4RGVmID0gZW5jb2RpbmcueCBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyB3ZSBjYW4gY2FzdCBoZXJlIHNpbmNlIHRoZXkgYXJlIHN1cmVseSBmaWVsZERlZlxuICAgICAgICBjb25zdCB5RGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+O1xuXG4gICAgICAgIGNvbnN0IHhJc1RlbXBvcmFsID0geERlZi50eXBlID09PSBURU1QT1JBTDtcbiAgICAgICAgY29uc3QgeUlzVGVtcG9yYWwgPSB5RGVmLnR5cGUgPT09IFRFTVBPUkFMO1xuXG4gICAgICAgIC8vIHRlbXBvcmFsIHdpdGhvdXQgdGltZVVuaXQgaXMgY29uc2lkZXJlZCBjb250aW51b3VzLCBidXQgYmV0dGVyIHNlcnZlcyBhcyBkaW1lbnNpb25cbiAgICAgICAgaWYgKHhJc1RlbXBvcmFsICYmICF5SXNUZW1wb3JhbCkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB9IGVsc2UgaWYgKCF4SXNUZW1wb3JhbCAmJiB5SXNUZW1wb3JhbCkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF4RGVmLmFnZ3JlZ2F0ZSAmJiB5RGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB9IGVsc2UgaWYgKHhEZWYuYWdncmVnYXRlICYmICF5RGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwZWNpZmllZE9yaWVudCkge1xuICAgICAgICAgIC8vIFdoZW4gYW1iaWd1b3VzLCB1c2UgdXNlciBzcGVjaWZpZWQgb25lLlxuICAgICAgICAgIHJldHVybiBzcGVjaWZpZWRPcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShtYXJrID09PSBMSU5FICYmIGVuY29kaW5nLm9yZGVyKSkge1xuICAgICAgICAgIC8vIEV4Y2VwdCBmb3IgY29ubmVjdGVkIHNjYXR0ZXJwbG90LCB3ZSBzaG91bGQgbG9nIHdhcm5pbmcgZm9yIHVuY2xlYXIgb3JpZW50YXRpb24gb2YgUXhRIHBsb3RzLlxuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnRDb250aW51b3VzKG1hcmspKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBEaXNjcmV0ZSB4IERpc2NyZXRlIGNhc2UsIHJldHVybiB1bmRlZmluZWQuXG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnREaXNjcmV0ZU9yRW1wdHkobWFyaykpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICB9XG4gIHJldHVybiAndmVydGljYWwnO1xufVxuXG4iXX0=