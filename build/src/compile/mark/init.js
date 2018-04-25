import * as tslib_1 from "tslib";
import { isAggregate } from '../../encoding';
import { isContinuous, isFieldDef } from '../../fielddef';
import * as log from '../../log';
import { AREA, BAR, CIRCLE, isMarkDef, LINE, POINT, RECT, RULE, SQUARE, TEXT, TICK } from '../../mark';
import { TEMPORAL } from '../../type';
import { contains } from '../../util';
import { getMarkConfig } from '../common';
export function normalizeMarkDef(mark, encoding, config) {
    var markDef = isMarkDef(mark) ? tslib_1.__assign({}, mark) : { type: mark };
    // set orient, which can be overridden by rules as sometimes the specified orient is invalid.
    var specifiedOrient = markDef.orient || getMarkConfig('orient', markDef, config);
    markDef.orient = orient(markDef.type, encoding, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    // set opacity and filled if not specified in mark config
    var specifiedOpacity = markDef.opacity !== undefined ? markDef.opacity : getMarkConfig('opacity', markDef, config);
    if (specifiedOpacity === undefined) {
        markDef.opacity = defaultOpacity(markDef.type, encoding);
    }
    var specifiedFilled = markDef.filled;
    if (specifiedFilled === undefined) {
        markDef.filled = filled(markDef, config);
    }
    return markDef;
}
function defaultOpacity(mark, encoding) {
    if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
        // point-based marks
        if (!isAggregate(encoding)) {
            return 0.7;
        }
    }
    return undefined;
}
function filled(markDef, config) {
    var filledConfig = getMarkConfig('filled', markDef, config);
    var mark = markDef.type;
    return filledConfig !== undefined ? filledConfig : mark !== POINT && mark !== LINE && mark !== RULE;
}
function orient(mark, encoding, specifiedOrient) {
    switch (mark) {
        case POINT:
        case CIRCLE:
        case SQUARE:
        case TEXT:
        case RECT:
            // orient is meaningless for these marks.
            return undefined;
    }
    var yIsRange = encoding.y2;
    var xIsRange = encoding.x2;
    switch (mark) {
        case RULE:
            // return undefined for line segment rule
            if (xIsRange && yIsRange) {
                return undefined;
            }
        /* tslint:disable */
        // intentional fall through
        case BAR:
        case AREA:
            // If there are range for both x and y, y (vertical) has higher precedence.
            if (yIsRange) {
                return 'vertical';
            }
            else if (xIsRange) {
                return 'horizontal';
            }
            else if (mark === RULE) {
                if (encoding.x && !encoding.y) {
                    return 'vertical';
                }
                else if (encoding.y && !encoding.x) {
                    return 'horizontal';
                }
            }
        case LINE: // intentional fall through
        case TICK: // Tick is opposite to bar, line, area and never have ranged mark.
            /* tslint:enable */
            var xIsContinuous = isFieldDef(encoding.x) && isContinuous(encoding.x);
            var yIsContinuous = isFieldDef(encoding.y) && isContinuous(encoding.y);
            if (xIsContinuous && !yIsContinuous) {
                return mark !== 'tick' ? 'horizontal' : 'vertical';
            }
            else if (!xIsContinuous && yIsContinuous) {
                return mark !== 'tick' ? 'vertical' : 'horizontal';
            }
            else if (xIsContinuous && yIsContinuous) {
                var xDef = encoding.x; // we can cast here since they are surely fieldDef
                var yDef = encoding.y;
                var xIsTemporal = xDef.type === TEMPORAL;
                var yIsTemporal = yDef.type === TEMPORAL;
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
                if (!(mark === LINE && encoding.order)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFXLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JELE9BQU8sRUFBVyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQWlCLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBSXhDLE1BQU0sMkJBQTJCLElBQW9CLEVBQUUsUUFBMEIsRUFBRSxNQUFjO0lBQy9GLElBQU0sT0FBTyxHQUFZLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHNCQUFLLElBQUksRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFFcEUsNkZBQTZGO0lBQzdGLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkYsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDakUsSUFBSSxlQUFlLEtBQUssU0FBUyxJQUFJLGVBQWUsS0FBSyxPQUFPLENBQUMs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QUssTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztpQkFDcEQ7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDckMsT0FBTyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztpQkFDcEQ7cUJBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDNUMsT0FBTyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztpQkFDcEQ7Z0JBRUQsSUFBSSxlQUFlLEVBQUU7b0JBQ25CLDBDQUEwQztvQkFDMUMsT0FBTyxlQUFlLENBQUM7aUJBQ3hCO2dCQUVELElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN0QyxnR0FBZ0c7b0JBQ2hHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNyRDtnQkFDRCxPQUFPLFVBQVUsQ0FBQzthQUNuQjtpQkFBTTtnQkFDTCxrREFBa0Q7Z0JBQ2xELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPLFNBQVMsQ0FBQzthQUNsQjtLQUNKO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0VuY29kaW5nLCBpc0FnZ3JlZ2F0ZX0gZnJvbSAnLi4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QVJFQSwgQkFSLCBDSVJDTEUsIGlzTWFya0RlZiwgTElORSwgTWFyaywgTWFya0RlZiwgUE9JTlQsIFJFQ1QsIFJVTEUsIFNRVUFSRSwgVEVYVCwgVElDS30gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1RFTVBPUkFMfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtPcmllbnR9IGZyb20gJy4vLi4vLi4vdmVnYS5zY2hlbWEnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVNYXJrRGVmKG1hcms6IE1hcmsgfCBNYXJrRGVmLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgbWFya0RlZjogTWFya0RlZiA9IGlzTWFya0RlZihtYXJrKSA/IHsuLi5tYXJrfSA6IHt0eXBlOiBtYXJrfTtcblxuICAvLyBzZXQgb3JpZW50LCB3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiBieSBydWxlcyBhcyBzb21ldGltZXMgdGhlIHNwZWNpZmllZCBvcmllbnQgaXMgaW52YWxpZC5cbiAgY29uc3Qgc3BlY2lmaWVkT3JpZW50ID0gbWFya0RlZi5vcmllbnQgfHwgZ2V0TWFya0NvbmZpZygnb3JpZW50JywgbWFya0RlZiwgY29uZmlnKTtcbiAgbWFya0RlZi5vcmllbnQgPSBvcmllbnQobWFya0RlZi50eXBlLCBlbmNvZGluZywgc3BlY2lmaWVkT3JpZW50KTtcbiAgaWYgKHNwZWNpZmllZE9yaWVudCAhPT0gdW5kZWZpbmVkICYmIHNwZWNpZmllZE9yaWVudCAhPT0gbWFya0RlZi5vcmllbnQpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5vcmllbnRPdmVycmlkZGVuKG1hcmtEZWYub3JpZW50LHNwZWNpZmllZE9yaWVudCkpO1xuICB9XG5cbiAgLy8gc2V0IG9wYWNpdHkgYW5kIGZpbGxlZCBpZiBub3Qgc3BlY2lmaWVkIGluIG1hcmsgY29uZmlnXG4gIGNvbnN0IHNwZWNpZmllZE9wYWNpdHkgPSBtYXJrRGVmLm9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG1hcmtEZWYub3BhY2l0eSA6IGdldE1hcmtDb25maWcoJ29wYWNpdHknLCBtYXJrRGVmLCBjb25maWcpO1xuICBpZiAoc3BlY2lmaWVkT3BhY2l0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFya0RlZi5vcGFjaXR5ID0gZGVmYXVsdE9wYWNpdHkobWFya0RlZi50eXBlLCBlbmNvZGluZyk7XG4gIH1cblxuICBjb25zdCBzcGVjaWZpZWRGaWxsZWQgPSBtYXJrRGVmLmZpbGxlZDtcbiAgaWYgKHNwZWNpZmllZEZpbGxlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFya0RlZi5maWxsZWQgPSBmaWxsZWQobWFya0RlZiwgY29uZmlnKTtcbiAgfVxuICByZXR1cm4gbWFya0RlZjtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdE9wYWNpdHkobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pIHtcbiAgaWYgKGNvbnRhaW5zKFtQT0lOVCwgVElDSywgQ0lSQ0xFLCBTUVVBUkVdLCBtYXJrKSkge1xuICAgIC8vIHBvaW50LWJhc2VkIG1hcmtzXG4gICAgaWYgKCFpc0FnZ3JlZ2F0ZShlbmNvZGluZykpIHtcbiAgICAgIHJldHVybiAwLjc7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZpbGxlZChtYXJrRGVmOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmaWxsZWRDb25maWcgPSBnZXRNYXJrQ29uZmlnKCdmaWxsZWQnLCBtYXJrRGVmLCBjb25maWcpO1xuICBjb25zdCBtYXJrID0gbWFya0RlZi50eXBlO1xuICByZXR1cm4gZmlsbGVkQ29uZmlnICE9PSB1bmRlZmluZWQgPyBmaWxsZWRDb25maWcgOiBtYXJrICE9PSBQT0lOVCAmJiBtYXJrICE9PSBMSU5FICYmIG1hcmsgIT09IFJVTEU7XG59XG5cbmZ1bmN0aW9uIG9yaWVudChtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgc3BlY2lmaWVkT3JpZW50OiBPcmllbnQpOiBPcmllbnQge1xuICBzd2l0Y2ggKG1hcmspIHtcbiAgICBjYXNlIFBPSU5UOlxuICAgIGNhc2UgQ0lSQ0xFOlxuICAgIGNhc2UgU1FVQVJFOlxuICAgIGNhc2UgVEVYVDpcbiAgICBjYXNlIFJFQ1Q6XG4gICAgICAvLyBvcmllbnQgaXMgbWVhbmluZ2xlc3MgZm9yIHRoZXNlIG1hcmtzLlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHlJc1JhbmdlID0gZW5jb2RpbmcueTI7XG4gIGNvbnN0IHhJc1JhbmdlID0gZW5jb2RpbmcueDI7XG5cbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSBSVUxFOlxuICAgICAgLy8gcmV0dXJuIHVuZGVmaW5lZCBmb3IgbGluZSBzZWdtZW50IHJ1bGVcbiAgICAgIGlmICh4SXNSYW5nZSAmJiB5SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgLyogdHNsaW50OmRpc2FibGUgKi9cbiAgICAgIC8vIGludGVudGlvbmFsIGZhbGwgdGhyb3VnaFxuICAgIGNhc2UgQkFSOlxuICAgIGNhc2UgQVJFQTpcbiAgICAgIC8vIElmIHRoZXJlIGFyZSByYW5nZSBmb3IgYm90aCB4IGFuZCB5LCB5ICh2ZXJ0aWNhbCkgaGFzIGhpZ2hlciBwcmVjZWRlbmNlLlxuICAgICAgaWYgKHlJc1JhbmdlKSB7XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmICh4SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChtYXJrID09PSBSVUxFKSB7XG4gICAgICAgIGlmIChlbmNvZGluZy54ICYmICFlbmNvZGluZy55KSB7XG4gICAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueSAmJiAhZW5jb2RpbmcueCkge1xuICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgY2FzZSBMSU5FOiAvLyBpbnRlbnRpb25hbCBmYWxsIHRocm91Z2hcbiAgICBjYXNlIFRJQ0s6IC8vIFRpY2sgaXMgb3Bwb3NpdGUgdG8gYmFyLCBsaW5lLCBhcmVhIGFuZCBuZXZlciBoYXZlIHJhbmdlZCBtYXJrLlxuXG4gICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICBjb25zdCB4SXNDb250aW51b3VzID0gaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCk7XG4gICAgICBjb25zdCB5SXNDb250aW51b3VzID0gaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSk7XG4gICAgICBpZiAoeElzQ29udGludW91cyAmJiAheUlzQ29udGludW91cykge1xuICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoIXhJc0NvbnRpbnVvdXMgJiYgeUlzQ29udGludW91cykge1xuICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzQ29udGludW91cyAmJiB5SXNDb250aW51b3VzKSB7XG4gICAgICAgIGNvbnN0IHhEZWYgPSBlbmNvZGluZy54IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIHdlIGNhbiBjYXN0IGhlcmUgc2luY2UgdGhleSBhcmUgc3VyZWx5IGZpZWxkRGVmXG4gICAgICAgIGNvbnN0IHlEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47XG5cbiAgICAgICAgY29uc3QgeElzVGVtcG9yYWwgPSB4RGVmLnR5cGUgPT09IFRFTVBPUkFMO1xuICAgICAgICBjb25zdCB5SXNUZW1wb3JhbCA9IHlEZWYudHlwZSA9PT0gVEVNUE9SQUw7XG5cbiAgICAgICAgLy8gdGVtcG9yYWwgd2l0aG91dCB0aW1lVW5pdCBpcyBjb25zaWRlcmVkIGNvbnRpbnVvdXMsIGJ1dCBiZXR0ZXIgc2VydmVzIGFzIGRpbWVuc2lvblxuICAgICAgICBpZiAoeElzVGVtcG9yYWwgJiYgIXlJc1RlbXBvcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoIXhJc1RlbXBvcmFsICYmIHlJc1RlbXBvcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXhEZWYuYWdncmVnYXRlICYmIHlEZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoeERlZi5hZ2dyZWdhdGUgJiYgIXlEZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3BlY2lmaWVkT3JpZW50KSB7XG4gICAgICAgICAgLy8gV2hlbiBhbWJpZ3VvdXMsIHVzZSB1c2VyIHNwZWNpZmllZCBvbmUuXG4gICAgICAgICAgcmV0dXJuIHNwZWNpZmllZE9yaWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKG1hcmsgPT09IExJTkUgJiYgZW5jb2Rpbmcub3JkZXIpKSB7XG4gICAgICAgICAgLy8gRXhjZXB0IGZvciBjb25uZWN0ZWQgc2NhdHRlcnBsb3QsIHdlIHNob3VsZCBsb2cgd2FybmluZyBmb3IgdW5jbGVhciBvcmllbnRhdGlvbiBvZiBReFEgcGxvdHMuXG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudENvbnRpbnVvdXMobWFyaykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIERpc2NyZXRlIHggRGlzY3JldGUgY2FzZSwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudERpc2NyZXRlT3JFbXB0eShtYXJrKSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuICd2ZXJ0aWNhbCc7XG59XG5cbiJdfQ==