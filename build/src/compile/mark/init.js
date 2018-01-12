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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsMkNBQXFEO0FBQ3JELDJDQUFrRTtBQUNsRSwrQkFBaUM7QUFDakMsbUNBQW9IO0FBQ3BILG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsb0NBQXdDO0FBSXhDLDBCQUFpQyxJQUFvQixFQUFFLFFBQTBCLEVBQUUsTUFBYztJQUMvRixJQUFNLE9BQU8sR0FBWSxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXBFLDZGQUE2RjtJQUM3RixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLHNCQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNqRSxFQUFFLENBQUMsQ0FBQyxlQUFlLEtBQUssU0FBUyxJQUFJLGVBQWUsS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN4RSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCx5REFBeUQ7SUFDekQsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLHNCQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE9B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QUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDbkIsQ0FBQztJQUNMLENBQUM7SUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtFbmNvZGluZywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7RmllbGREZWYsIGlzQ29udGludW91cywgaXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0FSRUEsIEJBUiwgQ0lSQ0xFLCBpc01hcmtEZWYsIExJTkUsIE1hcmssIE1hcmtEZWYsIFBPSU5ULCBSRUNULCBSVUxFLCBTUVVBUkUsIFRFWFQsIFRJQ0t9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtURU1QT1JBTH0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7T3JpZW50fSBmcm9tICcuLy4uLy4uL3ZlZ2Euc2NoZW1hJztcblxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTWFya0RlZihtYXJrOiBNYXJrIHwgTWFya0RlZiwgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IG1hcmtEZWY6IE1hcmtEZWYgPSBpc01hcmtEZWYobWFyaykgPyB7Li4ubWFya30gOiB7dHlwZTogbWFya307XG5cbiAgLy8gc2V0IG9yaWVudCwgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gYnkgcnVsZXMgYXMgc29tZXRpbWVzIHRoZSBzcGVjaWZpZWQgb3JpZW50IGlzIGludmFsaWQuXG4gIGNvbnN0IHNwZWNpZmllZE9yaWVudCA9IG1hcmtEZWYub3JpZW50IHx8IGdldE1hcmtDb25maWcoJ29yaWVudCcsIG1hcmtEZWYsIGNvbmZpZyk7XG4gIG1hcmtEZWYub3JpZW50ID0gb3JpZW50KG1hcmtEZWYudHlwZSwgZW5jb2RpbmcsIHNwZWNpZmllZE9yaWVudCk7XG4gIGlmIChzcGVjaWZpZWRPcmllbnQgIT09IHVuZGVmaW5lZCAmJiBzcGVjaWZpZWRPcmllbnQgIT09IG1hcmtEZWYub3JpZW50KSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uub3JpZW50T3ZlcnJpZGRlbihtYXJrRGVmLm9yaWVudCxzcGVjaWZpZWRPcmllbnQpKTtcbiAgfVxuXG4gIC8vIHNldCBvcGFjaXR5IGFuZCBmaWxsZWQgaWYgbm90IHNwZWNpZmllZCBpbiBtYXJrIGNvbmZpZ1xuICBjb25zdCBzcGVjaWZpZWRPcGFjaXR5ID0gbWFya0RlZi5vcGFjaXR5IHx8IGdldE1hcmtDb25maWcoJ29wYWNpdHknLCBtYXJrRGVmLCBjb25maWcpO1xuICBpZiAoc3BlY2lmaWVkT3BhY2l0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFya0RlZi5vcGFjaXR5ID0gZGVmYXVsdE9wYWNpdHkobWFya0RlZi50eXBlLCBlbmNvZGluZyk7XG4gIH1cblxuICBjb25zdCBzcGVjaWZpZWRGaWxsZWQgPSBtYXJrRGVmLmZpbGxlZDtcbiAgaWYgKHNwZWNpZmllZEZpbGxlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFya0RlZi5maWxsZWQgPSBmaWxsZWQobWFya0RlZiwgY29uZmlnKTtcbiAgfVxuICByZXR1cm4gbWFya0RlZjtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdE9wYWNpdHkobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pIHtcbiAgaWYgKGNvbnRhaW5zKFtQT0lOVCwgVElDSywgQ0lSQ0xFLCBTUVVBUkVdLCBtYXJrKSkge1xuICAgIC8vIHBvaW50LWJhc2VkIG1hcmtzXG4gICAgaWYgKCFpc0FnZ3JlZ2F0ZShlbmNvZGluZykpIHtcbiAgICAgIHJldHVybiAwLjc7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZpbGxlZChtYXJrRGVmOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmaWxsZWRDb25maWcgPSBnZXRNYXJrQ29uZmlnKCdmaWxsZWQnLCBtYXJrRGVmLCBjb25maWcpO1xuICBjb25zdCBtYXJrID0gbWFya0RlZi50eXBlO1xuICByZXR1cm4gZmlsbGVkQ29uZmlnICE9PSB1bmRlZmluZWQgPyBmaWxsZWRDb25maWcgOiBtYXJrICE9PSBQT0lOVCAmJiBtYXJrICE9PSBMSU5FICYmIG1hcmsgIT09IFJVTEU7XG59XG5cbmZ1bmN0aW9uIG9yaWVudChtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgc3BlY2lmaWVkT3JpZW50OiBPcmllbnQpOiBPcmllbnQge1xuICBzd2l0Y2ggKG1hcmspIHtcbiAgICBjYXNlIFBPSU5UOlxuICAgIGNhc2UgQ0lSQ0xFOlxuICAgIGNhc2UgU1FVQVJFOlxuICAgIGNhc2UgVEVYVDpcbiAgICBjYXNlIFJFQ1Q6XG4gICAgICAvLyBvcmllbnQgaXMgbWVhbmluZ2xlc3MgZm9yIHRoZXNlIG1hcmtzLlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHlJc1JhbmdlID0gZW5jb2RpbmcueTI7XG4gIGNvbnN0IHhJc1JhbmdlID0gZW5jb2RpbmcueDI7XG5cbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSBSVUxFOlxuICAgIGNhc2UgQkFSOlxuICAgIGNhc2UgQVJFQTpcbiAgICAgIC8vIElmIHRoZXJlIGFyZSByYW5nZSBmb3IgYm90aCB4IGFuZCB5LCB5ICh2ZXJ0aWNhbCkgaGFzIGhpZ2hlciBwcmVjZWRlbmNlLlxuICAgICAgaWYgKHlJc1JhbmdlKSB7XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmICh4SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChtYXJrID09PSBSVUxFKSB7XG4gICAgICAgIGlmIChlbmNvZGluZy54ICYmICFlbmNvZGluZy55KSB7XG4gICAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueSAmJiAhZW5jb2RpbmcueCkge1xuICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogdHNsaW50OmRpc2FibGUgKi9cbiAgICBjYXNlIExJTkU6IC8vIGludGVudGlvbmFsIGZhbGwgdGhyb3VnaFxuICAgIGNhc2UgVElDSzogLy8gVGljayBpcyBvcHBvc2l0ZSB0byBiYXIsIGxpbmUsIGFyZWEgYW5kIG5ldmVyIGhhdmUgcmFuZ2VkIG1hcmsuXG5cbiAgICAgIC8qIHRzbGludDplbmFibGUgKi9cbiAgICAgIGNvbnN0IHhJc0NvbnRpbnVvdXMgPSBpc0ZpZWxkRGVmKGVuY29kaW5nLngpICYmIGlzQ29udGludW91cyhlbmNvZGluZy54KTtcbiAgICAgIGNvbnN0IHlJc0NvbnRpbnVvdXMgPSBpc0ZpZWxkRGVmKGVuY29kaW5nLnkpICYmIGlzQ29udGludW91cyhlbmNvZGluZy55KTtcbiAgICAgIGlmICh4SXNDb250aW51b3VzICYmICF5SXNDb250aW51b3VzKSB7XG4gICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmICgheElzQ29udGludW91cyAmJiB5SXNDb250aW51b3VzKSB7XG4gICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmICh4SXNDb250aW51b3VzICYmIHlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgY29uc3QgeERlZiA9IGVuY29kaW5nLnggYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gd2UgY2FuIGNhc3QgaGVyZSBzaW5jZSB0aGV5IGFyZSBzdXJlbHkgZmllbGREZWZcbiAgICAgICAgY29uc3QgeURlZiA9IGVuY29kaW5nLnkgYXMgRmllbGREZWY8c3RyaW5nPjtcblxuICAgICAgICBjb25zdCB4SXNUZW1wb3JhbCA9IHhEZWYudHlwZSA9PT0gVEVNUE9SQUw7XG4gICAgICAgIGNvbnN0IHlJc1RlbXBvcmFsID0geURlZi50eXBlID09PSBURU1QT1JBTDtcblxuICAgICAgICAvLyB0ZW1wb3JhbCB3aXRob3V0IHRpbWVVbml0IGlzIGNvbnNpZGVyZWQgY29udGludW91cywgYnV0IGJldHRlciBzZXJ2ZXMgYXMgZGltZW5zaW9uXG4gICAgICAgIGlmICh4SXNUZW1wb3JhbCAmJiAheUlzVGVtcG9yYWwpIHtcbiAgICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgICAgfSBlbHNlIGlmICgheElzVGVtcG9yYWwgJiYgeUlzVGVtcG9yYWwpIHtcbiAgICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgheERlZi5hZ2dyZWdhdGUgJiYgeURlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgICAgfSBlbHNlIGlmICh4RGVmLmFnZ3JlZ2F0ZSAmJiAheURlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzcGVjaWZpZWRPcmllbnQpIHtcbiAgICAgICAgICAvLyBXaGVuIGFtYmlndW91cywgdXNlIHVzZXIgc3BlY2lmaWVkIG9uZS5cbiAgICAgICAgICByZXR1cm4gc3BlY2lmaWVkT3JpZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEobWFyayA9PT0gTElORSAmJiBlbmNvZGluZy5vcmRlcikpIHtcbiAgICAgICAgICAvLyBFeGNlcHQgZm9yIGNvbm5lY3RlZCBzY2F0dGVycGxvdCwgd2Ugc2hvdWxkIGxvZyB3YXJuaW5nIGZvciB1bmNsZWFyIG9yaWVudGF0aW9uIG9mIFF4USBwbG90cy5cbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS51bmNsZWFyT3JpZW50Q29udGludW91cyhtYXJrKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3IgRGlzY3JldGUgeCBEaXNjcmV0ZSBjYXNlLCByZXR1cm4gdW5kZWZpbmVkLlxuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS51bmNsZWFyT3JpZW50RGlzY3JldGVPckVtcHR5KG1hcmspKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gJ3ZlcnRpY2FsJztcbn1cblxuIl19