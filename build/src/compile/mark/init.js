"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function normalizeMarkDef(mark, encoding, config) {
    var markDef = mark_1.isMarkDef(mark) ? tslib_1.__assign({}, mark) : { type: mark };
    // set orient, which can be overridden by rules as sometimes the specified orient is invalid.
    var specifiedOrient = markDef.orient || common_1.getMarkConfig('orient', markDef, config);
    markDef.orient = orient(markDef.type, encoding, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    // set opacity and filled if not specified in mark config
    var specifiedOpacity = markDef.opacity !== undefined ? markDef.opacity : common_1.getMarkConfig('opacity', markDef, config);
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
        case mark_1.TICK: // Tick is opposite to bar, line, area and never have ranged mark.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQ0FBcUQ7QUFDckQsMkNBQWtFO0FBQ2xFLCtCQUFpQztBQUNqQyxtQ0FBb0g7QUFDcEgsbUNBQW9DO0FBQ3BDLG1DQUFvQztBQUNwQyxvQ0FBd0M7QUFJeEMsMEJBQWlDLElBQW9CLEVBQUUsUUFBMEIsRUFBRSxNQUFjO0lBQy9GLElBQU0sT0FBTyxHQUFZLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxzQkFBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXBFLDZGQUE2RjtJQUM3RixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLHNCQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNqRSxJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDdkUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztLQUN4RTtJQUVELHlEQUF5RDtJQUN6RCxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxzQkFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckgsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7UUFDbEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMxRDtJQUVELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdkMsSUFBSSxlQUFlLEtBQUssU0FBUyxFQUFFO1FBQ2pDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMxQztJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFyQkQsNENBcUJDO0FBRUQsd0JBQXdCLElBQVUsRUFBRSxRQUEwQjtJQUM1RCxJQUFJLGVBQVEsQ0FBQyxDQUFDLFlBQUssRUFBRSxXQUFJLEVBQUUsYUFBTSxFQUFFLGFBQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ2pELG9CQUFvQjtRQUNwQixJQUFJLENBQUMsc0JBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMxQixPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsZ0JBQWdCLE9BQWdCLEVBQUUsTUFBYztJQUM5QyxJQUFNLFlBQVksR0FBRyxzQkFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUQsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMxQixPQUFPLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQUssSUFBSSxJQUFJLEtBQUssV0FBSSxJQUFJLElBQUksS0FBSyxXQUFJLENBQUM7QUFDdEcsQ0FBQztBQUVELGdCQUFnQixJQUFVLEVBQUUsUUFBMEIsRUFBRSxlQUF1QjtJQUM3RSxRQUFRLElBQUksRUFBRTtRQUNaLEtBQUssWUFBSyxDQUFDO1FBQ1gsS0FBSyxhQUFNLENBQUM7UUFDWixLQUFLLGFBQU0sQ0FBQztRQUNaLEtBQUssV0FBSSxDQUFDO1FBQ1YsS0FBSyxXQUFJO1lBQ1AseUNBQXlDO1lBQ3pDLE9BQU8sU0FBUyxDQUFDO0tBQ3BCO0lBRUQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztJQUM3QixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0lBRTdCLFFBQVEsSUFBSSxFQUFFO1FBQ1osS0FBSyxXQUFJO1lBQ1AseUNBQXlDO1lBQ3pDLElBQUksUUFBUSxJQUFJLFFBQVEsRUFBRTtnQkFDeEIsT0FBTyxTQUFTLENBQUM7YUFDbEI7UUFDRCxvQkFBb0I7UUFDcEIsMkJBQTJCO1FBQzdCLEtBQUssVUFBRyxDQUFDO1FBQ1QsS0FBSyxXQUFJO1lBQ1AsMkVBQTJFO1lBQzNFLElBQUksUUFBUSxFQUFFO2dCQUNaLE9BQU8sVUFBVSxDQUFDO2FBQ25CO2lCQUFNLElBQUksUUFBUSxFQUFFO2dCQUNuQixPQUFPLFlBQVksQ0FBQzthQUNyQjtpQkFBTSxJQUFJLElBQUksS0FBSyxXQUFJLEVBQUU7Z0JBQ3hCLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7b0JBQzdCLE9BQU8sVUFBVSxDQUFDO2lCQUNuQjtxQkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO29CQUNwQyxPQUFPLFlBQVksQ0FBQztpQkFDckI7YUFDRjtRQUdILEtBQUssV0FBSSxDQUFDLENBQUMsMkJBQTJCO1FBQ3RDLEtBQUssV0FBSSxFQUFFLGtFQUFrRTtZQUUzRSxtQkFBbUI7WUFDbkIsSUFBTSxhQUFhLEdBQUcscUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksdUJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsSUFBTSxhQUFhLEdBQUcscUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksdUJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsSUFBSSxhQUFhLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ25DLE9BQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7YUFDcEQ7aUJBQU0sSUFBSSxDQUFDLGFBQWEsSUFBSSxhQUFhLEVBQUU7Z0JBQzFDLE9BQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7YUFDcEQ7aUJBQU0sSUFBSSxhQUFhLElBQUksYUFBYSxFQUFFO2dCQUN6QyxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBcUIsQ0FBQyxDQUFDLGtEQUFrRDtnQkFDL0YsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQXFCLENBQUM7Z0JBRTVDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBUSxDQUFDO2dCQUMzQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQztnQkFFM0MscUZBQXFGO2dCQUNyRixJQUFJLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDL0IsT0FBTyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztpQkFDcEQ7cUJBQU0sSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLEVBQUU7b0JBQ3RDLE9BQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7aUJBQ3BEO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ3JDLE9BQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7aUJBQ3BEO3FCQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQzVDLE9BQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7aUJBQ3BEO2dCQUVELElBQUksZUFBZSxFQUFFO29CQUNuQiwwQ0FBMEM7b0JBQzFDLE9BQU8sZUFBZSxDQUFDO2lCQUN4QjtnQkFFRCxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssV0FBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDdEMsZ0dBQWdHO29CQUNoRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDckQ7Z0JBQ0QsT0FBTyxVQUFVLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0wsa0RBQWtEO2dCQUNsRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekQsT0FBTyxTQUFTLENBQUM7YUFDbEI7S0FDSjtJQUNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtFbmNvZGluZywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7RmllbGREZWYsIGlzQ29udGludW91cywgaXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0FSRUEsIEJBUiwgQ0lSQ0xFLCBpc01hcmtEZWYsIExJTkUsIE1hcmssIE1hcmtEZWYsIFBPSU5ULCBSRUNULCBSVUxFLCBTUVVBUkUsIFRFWFQsIFRJQ0t9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtURU1QT1JBTH0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7T3JpZW50fSBmcm9tICcuLy4uLy4uL3ZlZ2Euc2NoZW1hJztcblxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTWFya0RlZihtYXJrOiBNYXJrIHwgTWFya0RlZiwgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IG1hcmtEZWY6IE1hcmtEZWYgPSBpc01hcmtEZWYobWFyaykgPyB7Li4ubWFya30gOiB7dHlwZTogbWFya307XG5cbiAgLy8gc2V0IG9yaWVudCwgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gYnkgcnVsZXMgYXMgc29tZXRpbWVzIHRoZSBzcGVjaWZpZWQgb3JpZW50IGlzIGludmFsaWQuXG4gIGNvbnN0IHNwZWNpZmllZE9yaWVudCA9IG1hcmtEZWYub3JpZW50IHx8IGdldE1hcmtDb25maWcoJ29yaWVudCcsIG1hcmtEZWYsIGNvbmZpZyk7XG4gIG1hcmtEZWYub3JpZW50ID0gb3JpZW50KG1hcmtEZWYudHlwZSwgZW5jb2RpbmcsIHNwZWNpZmllZE9yaWVudCk7XG4gIGlmIChzcGVjaWZpZWRPcmllbnQgIT09IHVuZGVmaW5lZCAmJiBzcGVjaWZpZWRPcmllbnQgIT09IG1hcmtEZWYub3JpZW50KSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uub3JpZW50T3ZlcnJpZGRlbihtYXJrRGVmLm9yaWVudCxzcGVjaWZpZWRPcmllbnQpKTtcbiAgfVxuXG4gIC8vIHNldCBvcGFjaXR5IGFuZCBmaWxsZWQgaWYgbm90IHNwZWNpZmllZCBpbiBtYXJrIGNvbmZpZ1xuICBjb25zdCBzcGVjaWZpZWRPcGFjaXR5ID0gbWFya0RlZi5vcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBtYXJrRGVmLm9wYWNpdHkgOiBnZXRNYXJrQ29uZmlnKCdvcGFjaXR5JywgbWFya0RlZiwgY29uZmlnKTtcbiAgaWYgKHNwZWNpZmllZE9wYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYub3BhY2l0eSA9IGRlZmF1bHRPcGFjaXR5KG1hcmtEZWYudHlwZSwgZW5jb2RpbmcpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2lmaWVkRmlsbGVkID0gbWFya0RlZi5maWxsZWQ7XG4gIGlmIChzcGVjaWZpZWRGaWxsZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYuZmlsbGVkID0gZmlsbGVkKG1hcmtEZWYsIGNvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIG1hcmtEZWY7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRPcGFjaXR5KG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KSB7XG4gIGlmIChjb250YWlucyhbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSwgbWFyaykpIHtcbiAgICAvLyBwb2ludC1iYXNlZCBtYXJrc1xuICAgIGlmICghaXNBZ2dyZWdhdGUoZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gMC43O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmaWxsZWQobWFya0RlZjogTWFya0RlZiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZmlsbGVkQ29uZmlnID0gZ2V0TWFya0NvbmZpZygnZmlsbGVkJywgbWFya0RlZiwgY29uZmlnKTtcbiAgY29uc3QgbWFyayA9IG1hcmtEZWYudHlwZTtcbiAgcmV0dXJuIGZpbGxlZENvbmZpZyAhPT0gdW5kZWZpbmVkID8gZmlsbGVkQ29uZmlnIDogbWFyayAhPT0gUE9JTlQgJiYgbWFyayAhPT0gTElORSAmJiBtYXJrICE9PSBSVUxFO1xufVxuXG5mdW5jdGlvbiBvcmllbnQobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIHNwZWNpZmllZE9yaWVudDogT3JpZW50KTogT3JpZW50IHtcbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSBQT0lOVDpcbiAgICBjYXNlIENJUkNMRTpcbiAgICBjYXNlIFNRVUFSRTpcbiAgICBjYXNlIFRFWFQ6XG4gICAgY2FzZSBSRUNUOlxuICAgICAgLy8gb3JpZW50IGlzIG1lYW5pbmdsZXNzIGZvciB0aGVzZSBtYXJrcy5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB5SXNSYW5nZSA9IGVuY29kaW5nLnkyO1xuICBjb25zdCB4SXNSYW5nZSA9IGVuY29kaW5nLngyO1xuXG4gIHN3aXRjaCAobWFyaykge1xuICAgIGNhc2UgUlVMRTpcbiAgICAgIC8vIHJldHVybiB1bmRlZmluZWQgZm9yIGxpbmUgc2VnbWVudCBydWxlXG4gICAgICBpZiAoeElzUmFuZ2UgJiYgeUlzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8qIHRzbGludDpkaXNhYmxlICovXG4gICAgICAvLyBpbnRlbnRpb25hbCBmYWxsIHRocm91Z2hcbiAgICBjYXNlIEJBUjpcbiAgICBjYXNlIEFSRUE6XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgcmFuZ2UgZm9yIGJvdGggeCBhbmQgeSwgeSAodmVydGljYWwpIGhhcyBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgICAgIGlmICh5SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAobWFyayA9PT0gUlVMRSkge1xuICAgICAgICBpZiAoZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xuICAgICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkgJiYgIWVuY29kaW5nLngpIHtcbiAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgIGNhc2UgTElORTogLy8gaW50ZW50aW9uYWwgZmFsbCB0aHJvdWdoXG4gICAgY2FzZSBUSUNLOiAvLyBUaWNrIGlzIG9wcG9zaXRlIHRvIGJhciwgbGluZSwgYXJlYSBhbmQgbmV2ZXIgaGF2ZSByYW5nZWQgbWFyay5cblxuICAgICAgLyogdHNsaW50OmVuYWJsZSAqL1xuICAgICAgY29uc3QgeElzQ29udGludW91cyA9IGlzRmllbGREZWYoZW5jb2RpbmcueCkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLngpO1xuICAgICAgY29uc3QgeUlzQ29udGludW91cyA9IGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpO1xuICAgICAgaWYgKHhJc0NvbnRpbnVvdXMgJiYgIXlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKCF4SXNDb250aW51b3VzICYmIHlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICB9IGVsc2UgaWYgKHhJc0NvbnRpbnVvdXMgJiYgeUlzQ29udGludW91cykge1xuICAgICAgICBjb25zdCB4RGVmID0gZW5jb2RpbmcueCBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyB3ZSBjYW4gY2FzdCBoZXJlIHNpbmNlIHRoZXkgYXJlIHN1cmVseSBmaWVsZERlZlxuICAgICAgICBjb25zdCB5RGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+O1xuXG4gICAgICAgIGNvbnN0IHhJc1RlbXBvcmFsID0geERlZi50eXBlID09PSBURU1QT1JBTDtcbiAgICAgICAgY29uc3QgeUlzVGVtcG9yYWwgPSB5RGVmLnR5cGUgPT09IFRFTVBPUkFMO1xuXG4gICAgICAgIC8vIHRlbXBvcmFsIHdpdGhvdXQgdGltZVVuaXQgaXMgY29uc2lkZXJlZCBjb250aW51b3VzLCBidXQgYmV0dGVyIHNlcnZlcyBhcyBkaW1lbnNpb25cbiAgICAgICAgaWYgKHhJc1RlbXBvcmFsICYmICF5SXNUZW1wb3JhbCkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB9IGVsc2UgaWYgKCF4SXNUZW1wb3JhbCAmJiB5SXNUZW1wb3JhbCkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF4RGVmLmFnZ3JlZ2F0ZSAmJiB5RGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB9IGVsc2UgaWYgKHhEZWYuYWdncmVnYXRlICYmICF5RGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwZWNpZmllZE9yaWVudCkge1xuICAgICAgICAgIC8vIFdoZW4gYW1iaWd1b3VzLCB1c2UgdXNlciBzcGVjaWZpZWQgb25lLlxuICAgICAgICAgIHJldHVybiBzcGVjaWZpZWRPcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShtYXJrID09PSBMSU5FICYmIGVuY29kaW5nLm9yZGVyKSkge1xuICAgICAgICAgIC8vIEV4Y2VwdCBmb3IgY29ubmVjdGVkIHNjYXR0ZXJwbG90LCB3ZSBzaG91bGQgbG9nIHdhcm5pbmcgZm9yIHVuY2xlYXIgb3JpZW50YXRpb24gb2YgUXhRIHBsb3RzLlxuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnRDb250aW51b3VzKG1hcmspKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBEaXNjcmV0ZSB4IERpc2NyZXRlIGNhc2UsIHJldHVybiB1bmRlZmluZWQuXG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnREaXNjcmV0ZU9yRW1wdHkobWFyaykpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICB9XG4gIHJldHVybiAndmVydGljYWwnO1xufVxuXG4iXX0=