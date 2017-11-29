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
    var specifiedOrient = markDef.orient || common_1.getMarkConfig('orient', markDef, config);
    markDef.orient = orient(markDef.type, encoding, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    var specifiedFilled = markDef.filled;
    if (specifiedFilled === undefined) {
        markDef.filled = filled(markDef, config);
    }
    return markDef;
}
exports.normalizeMarkDef = normalizeMarkDef;
/**
 * Initialize encoding's value with some special default values
 */
function initEncoding(mark, encoding, stacked, config) {
    var opacityConfig = common_1.getMarkConfig('opacity', mark, config);
    if (!encoding.opacity && opacityConfig === undefined) {
        var opacity = defaultOpacity(mark.type, encoding, stacked);
        if (opacity !== undefined) {
            encoding.opacity = { value: opacity };
        }
    }
    return encoding;
}
exports.initEncoding = initEncoding;
function defaultOpacity(mark, encoding, stacked) {
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
        /* tslint:disable */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsMkNBQXFEO0FBQ3JELDJDQUFrRTtBQUNsRSwrQkFBaUM7QUFDakMsbUNBQW9IO0FBRXBILG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsb0NBQXdDO0FBSXhDLDBCQUFpQyxJQUFvQixFQUFFLFFBQTBCLEVBQUUsTUFBYztJQUMvRixJQUFNLE9BQU8sR0FBWSxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ3BFLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksc0JBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25GLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdkMsRUFBRSxDQUFDLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxNQUFNLENB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Q0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsZ0dBQWdHO29CQUNoRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3BCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixrREFBa0Q7Z0JBQ2xELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ25CLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RW5jb2RpbmcsIGlzQWdncmVnYXRlfSBmcm9tICcuLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBpc0NvbnRpbnVvdXMsIGlzRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBUkVBLCBCQVIsIENJUkNMRSwgaXNNYXJrRGVmLCBMSU5FLCBNYXJrLCBNYXJrRGVmLCBQT0lOVCwgUkVDVCwgUlVMRSwgU1FVQVJFLCBURVhULCBUSUNLfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7U3RhY2tQcm9wZXJ0aWVzfSBmcm9tICcuLi8uLi9zdGFjayc7XG5pbXBvcnQge1RFTVBPUkFMfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtPcmllbnR9IGZyb20gJy4vLi4vLi4vdmVnYS5zY2hlbWEnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVNYXJrRGVmKG1hcms6IE1hcmsgfCBNYXJrRGVmLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgbWFya0RlZjogTWFya0RlZiA9IGlzTWFya0RlZihtYXJrKSA/IHsuLi5tYXJrfSA6IHt0eXBlOiBtYXJrfTtcbiAgY29uc3Qgc3BlY2lmaWVkT3JpZW50ID0gbWFya0RlZi5vcmllbnQgfHwgZ2V0TWFya0NvbmZpZygnb3JpZW50JywgbWFya0RlZiwgY29uZmlnKTtcbiAgbWFya0RlZi5vcmllbnQgPSBvcmllbnQobWFya0RlZi50eXBlLCBlbmNvZGluZywgc3BlY2lmaWVkT3JpZW50KTtcbiAgaWYgKHNwZWNpZmllZE9yaWVudCAhPT0gdW5kZWZpbmVkICYmIHNwZWNpZmllZE9yaWVudCAhPT0gbWFya0RlZi5vcmllbnQpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5vcmllbnRPdmVycmlkZGVuKG1hcmtEZWYub3JpZW50LHNwZWNpZmllZE9yaWVudCkpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2lmaWVkRmlsbGVkID0gbWFya0RlZi5maWxsZWQ7XG4gIGlmIChzcGVjaWZpZWRGaWxsZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYuZmlsbGVkID0gZmlsbGVkKG1hcmtEZWYsIGNvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIG1hcmtEZWY7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBlbmNvZGluZydzIHZhbHVlIHdpdGggc29tZSBzcGVjaWFsIGRlZmF1bHQgdmFsdWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0RW5jb2RpbmcobWFyazogTWFya0RlZiwgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIHN0YWNrZWQ6IFN0YWNrUHJvcGVydGllcywgY29uZmlnOiBDb25maWcpOiBFbmNvZGluZzxzdHJpbmc+IHtcbiAgY29uc3Qgb3BhY2l0eUNvbmZpZyA9IGdldE1hcmtDb25maWcoJ29wYWNpdHknLCBtYXJrLCBjb25maWcpO1xuICBpZiAoIWVuY29kaW5nLm9wYWNpdHkgJiYgb3BhY2l0eUNvbmZpZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgb3BhY2l0eSA9IGRlZmF1bHRPcGFjaXR5KG1hcmsudHlwZSwgZW5jb2RpbmcsIHN0YWNrZWQpO1xuICAgIGlmIChvcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVuY29kaW5nLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbmNvZGluZztcbn1cblxuXG5mdW5jdGlvbiBkZWZhdWx0T3BhY2l0eShtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgc3RhY2tlZDogU3RhY2tQcm9wZXJ0aWVzKSB7XG4gIGlmIChjb250YWlucyhbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSwgbWFyaykpIHtcbiAgICAvLyBwb2ludC1iYXNlZCBtYXJrc1xuICAgIGlmICghaXNBZ2dyZWdhdGUoZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gMC43O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmaWxsZWQobWFya0RlZjogTWFya0RlZiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZmlsbGVkQ29uZmlnID0gZ2V0TWFya0NvbmZpZygnZmlsbGVkJywgbWFya0RlZiwgY29uZmlnKTtcbiAgY29uc3QgbWFyayA9IG1hcmtEZWYudHlwZTtcbiAgcmV0dXJuIGZpbGxlZENvbmZpZyAhPT0gdW5kZWZpbmVkID8gZmlsbGVkQ29uZmlnIDogbWFyayAhPT0gUE9JTlQgJiYgbWFyayAhPT0gTElORSAmJiBtYXJrICE9PSBSVUxFO1xufVxuXG5mdW5jdGlvbiBvcmllbnQobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIHNwZWNpZmllZE9yaWVudDogT3JpZW50KTogT3JpZW50IHtcbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSBQT0lOVDpcbiAgICBjYXNlIENJUkNMRTpcbiAgICBjYXNlIFNRVUFSRTpcbiAgICBjYXNlIFRFWFQ6XG4gICAgY2FzZSBSRUNUOlxuICAgICAgLy8gb3JpZW50IGlzIG1lYW5pbmdsZXNzIGZvciB0aGVzZSBtYXJrcy5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB5SXNSYW5nZSA9IGVuY29kaW5nLnkyO1xuICBjb25zdCB4SXNSYW5nZSA9IGVuY29kaW5nLngyO1xuXG4gIHN3aXRjaCAobWFyaykge1xuICAgIGNhc2UgUlVMRTpcbiAgICBjYXNlIEJBUjpcbiAgICBjYXNlIEFSRUE6XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgcmFuZ2UgZm9yIGJvdGggeCBhbmQgeSwgeSAodmVydGljYWwpIGhhcyBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgICAgIGlmICh5SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAobWFyayA9PT0gUlVMRSkge1xuICAgICAgICBpZiAoZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xuICAgICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkgJiYgIWVuY29kaW5nLngpIHtcbiAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIHRzbGludDpkaXNhYmxlICovXG4gICAgY2FzZSBMSU5FOiAvLyBpbnRlbnRpb25hbCBmYWxsIHRocm91Z2hcbiAgICBjYXNlIFRJQ0s6IC8vIFRpY2sgaXMgb3Bwb3NpdGUgdG8gYmFyLCBsaW5lLCBhcmVhIGFuZCBuZXZlciBoYXZlIHJhbmdlZCBtYXJrLlxuXG4gICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICBjb25zdCB4SXNDb250aW51b3VzID0gaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCk7XG4gICAgICBjb25zdCB5SXNDb250aW51b3VzID0gaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSk7XG4gICAgICBpZiAoeElzQ29udGludW91cyAmJiAheUlzQ29udGludW91cykge1xuICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoIXhJc0NvbnRpbnVvdXMgJiYgeUlzQ29udGludW91cykge1xuICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzQ29udGludW91cyAmJiB5SXNDb250aW51b3VzKSB7XG4gICAgICAgIGNvbnN0IHhEZWYgPSBlbmNvZGluZy54IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIHdlIGNhbiBjYXN0IGhlcmUgc2luY2UgdGhleSBhcmUgc3VyZWx5IGZpZWxkRGVmXG4gICAgICAgIGNvbnN0IHlEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47XG5cbiAgICAgICAgY29uc3QgeElzVGVtcG9yYWwgPSB4RGVmLnR5cGUgPT09IFRFTVBPUkFMO1xuICAgICAgICBjb25zdCB5SXNUZW1wb3JhbCA9IHlEZWYudHlwZSA9PT0gVEVNUE9SQUw7XG5cbiAgICAgICAgLy8gdGVtcG9yYWwgd2l0aG91dCB0aW1lVW5pdCBpcyBjb25zaWRlcmVkIGNvbnRpbnVvdXMsIGJ1dCBiZXR0ZXIgc2VydmVzIGFzIGRpbWVuc2lvblxuICAgICAgICBpZiAoeElzVGVtcG9yYWwgJiYgIXlJc1RlbXBvcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoIXhJc1RlbXBvcmFsICYmIHlJc1RlbXBvcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXhEZWYuYWdncmVnYXRlICYmIHlEZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoeERlZi5hZ2dyZWdhdGUgJiYgIXlEZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3BlY2lmaWVkT3JpZW50KSB7XG4gICAgICAgICAgLy8gV2hlbiBhbWJpZ3VvdXMsIHVzZSB1c2VyIHNwZWNpZmllZCBvbmUuXG4gICAgICAgICAgcmV0dXJuIHNwZWNpZmllZE9yaWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKG1hcmsgPT09IExJTkUgJiYgZW5jb2Rpbmcub3JkZXIpKSB7XG4gICAgICAgICAgLy8gRXhjZXB0IGZvciBjb25uZWN0ZWQgc2NhdHRlcnBsb3QsIHdlIHNob3VsZCBsb2cgd2FybmluZyBmb3IgdW5jbGVhciBvcmllbnRhdGlvbiBvZiBReFEgcGxvdHMuXG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudENvbnRpbnVvdXMobWFyaykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIERpc2NyZXRlIHggRGlzY3JldGUgY2FzZSwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudERpc2NyZXRlT3JFbXB0eShtYXJrKSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuICd2ZXJ0aWNhbCc7XG59XG5cbiJdfQ==