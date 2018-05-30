import * as tslib_1 from "tslib";
import { isAggregate } from '../../encoding';
import { isContinuous, isFieldDef } from '../../fielddef';
import * as log from '../../log';
import { AREA, BAR, CIRCLE, isMarkDef, LINE, POINT, RECT, RULE, SQUARE, TEXT, TICK } from '../../mark';
import { QUANTITATIVE, TEMPORAL } from '../../type';
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
        case BAR:
            if (yIsRange || xIsRange) {
                // Ranged bar does not always have clear orientation, so we allow overriding
                if (specifiedOrient) {
                    return specifiedOrient;
                }
                // If y is range and x is non-range, non-bin Q, y is likely a prebinned field
                var xDef = encoding.x;
                if (!xIsRange && isFieldDef(xDef) && xDef.type === QUANTITATIVE && !xDef.bin) {
                    return 'horizontal';
                }
                // If x is range and y is non-range, non-bin Q, x is likely a prebinned field
                var yDef = encoding.y;
                if (!yIsRange && isFieldDef(yDef) && yDef.type === QUANTITATIVE && !yDef.bin) {
                    return 'vertical';
                }
            }
        /* tslint:disable */
        case RULE: // intentionally fall through
            // return undefined for line segment rule and bar with both axis ranged
            if (xIsRange && yIsRange) {
                return undefined;
            }
        case AREA: // intentionally fall through
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFXLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JELE9BQU8sRUFBVyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQWlCLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BILE9BQU8sRUFBQyxZQUFZLEVBQUUsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2xELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUl4QyxNQUFNLDJCQUEyQixJQUFvQixFQUFFLFFBQTBCLEVBQUUsTUFBYztJQUMvRixJQUFNLE9BQU8sR0FBWSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxzQkFBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXBFLDZGQUE2RjtJQUM3RixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLGFBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25GLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2pFLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLEtBQUss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SUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3RDLGdHQUFnRztvQkFDaEcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3JEO2dCQUNELE9BQU8sVUFBVSxDQUFDO2FBQ25CO2lCQUFNO2dCQUNMLGtEQUFrRDtnQkFDbEQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELE9BQU8sU0FBUyxDQUFDO2FBQ2xCO0tBQ0o7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RW5jb2RpbmcsIGlzQWdncmVnYXRlfSBmcm9tICcuLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBpc0NvbnRpbnVvdXMsIGlzRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBUkVBLCBCQVIsIENJUkNMRSwgaXNNYXJrRGVmLCBMSU5FLCBNYXJrLCBNYXJrRGVmLCBQT0lOVCwgUkVDVCwgUlVMRSwgU1FVQVJFLCBURVhULCBUSUNLfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7T3JpZW50fSBmcm9tICcuLy4uLy4uL3ZlZ2Euc2NoZW1hJztcblxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTWFya0RlZihtYXJrOiBNYXJrIHwgTWFya0RlZiwgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IG1hcmtEZWY6IE1hcmtEZWYgPSBpc01hcmtEZWYobWFyaykgPyB7Li4ubWFya30gOiB7dHlwZTogbWFya307XG5cbiAgLy8gc2V0IG9yaWVudCwgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gYnkgcnVsZXMgYXMgc29tZXRpbWVzIHRoZSBzcGVjaWZpZWQgb3JpZW50IGlzIGludmFsaWQuXG4gIGNvbnN0IHNwZWNpZmllZE9yaWVudCA9IG1hcmtEZWYub3JpZW50IHx8IGdldE1hcmtDb25maWcoJ29yaWVudCcsIG1hcmtEZWYsIGNvbmZpZyk7XG4gIG1hcmtEZWYub3JpZW50ID0gb3JpZW50KG1hcmtEZWYudHlwZSwgZW5jb2RpbmcsIHNwZWNpZmllZE9yaWVudCk7XG4gIGlmIChzcGVjaWZpZWRPcmllbnQgIT09IHVuZGVmaW5lZCAmJiBzcGVjaWZpZWRPcmllbnQgIT09IG1hcmtEZWYub3JpZW50KSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uub3JpZW50T3ZlcnJpZGRlbihtYXJrRGVmLm9yaWVudCxzcGVjaWZpZWRPcmllbnQpKTtcbiAgfVxuXG4gIC8vIHNldCBvcGFjaXR5IGFuZCBmaWxsZWQgaWYgbm90IHNwZWNpZmllZCBpbiBtYXJrIGNvbmZpZ1xuICBjb25zdCBzcGVjaWZpZWRPcGFjaXR5ID0gbWFya0RlZi5vcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBtYXJrRGVmLm9wYWNpdHkgOiBnZXRNYXJrQ29uZmlnKCdvcGFjaXR5JywgbWFya0RlZiwgY29uZmlnKTtcbiAgaWYgKHNwZWNpZmllZE9wYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYub3BhY2l0eSA9IGRlZmF1bHRPcGFjaXR5KG1hcmtEZWYudHlwZSwgZW5jb2RpbmcpO1xuICB9XG5cbiAgY29uc3Qgc3BlY2lmaWVkRmlsbGVkID0gbWFya0RlZi5maWxsZWQ7XG4gIGlmIChzcGVjaWZpZWRGaWxsZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIG1hcmtEZWYuZmlsbGVkID0gZmlsbGVkKG1hcmtEZWYsIGNvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIG1hcmtEZWY7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRPcGFjaXR5KG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KSB7XG4gIGlmIChjb250YWlucyhbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSwgbWFyaykpIHtcbiAgICAvLyBwb2ludC1iYXNlZCBtYXJrc1xuICAgIGlmICghaXNBZ2dyZWdhdGUoZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gMC43O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmaWxsZWQobWFya0RlZjogTWFya0RlZiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZmlsbGVkQ29uZmlnID0gZ2V0TWFya0NvbmZpZygnZmlsbGVkJywgbWFya0RlZiwgY29uZmlnKTtcbiAgY29uc3QgbWFyayA9IG1hcmtEZWYudHlwZTtcbiAgcmV0dXJuIGZpbGxlZENvbmZpZyAhPT0gdW5kZWZpbmVkID8gZmlsbGVkQ29uZmlnIDogbWFyayAhPT0gUE9JTlQgJiYgbWFyayAhPT0gTElORSAmJiBtYXJrICE9PSBSVUxFO1xufVxuXG5mdW5jdGlvbiBvcmllbnQobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4sIHNwZWNpZmllZE9yaWVudDogT3JpZW50KTogT3JpZW50IHtcbiAgc3dpdGNoIChtYXJrKSB7XG4gICAgY2FzZSBQT0lOVDpcbiAgICBjYXNlIENJUkNMRTpcbiAgICBjYXNlIFNRVUFSRTpcbiAgICBjYXNlIFRFWFQ6XG4gICAgY2FzZSBSRUNUOlxuICAgICAgLy8gb3JpZW50IGlzIG1lYW5pbmdsZXNzIGZvciB0aGVzZSBtYXJrcy5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB5SXNSYW5nZSA9IGVuY29kaW5nLnkyO1xuICBjb25zdCB4SXNSYW5nZSA9IGVuY29kaW5nLngyO1xuXG4gIHN3aXRjaCAobWFyaykge1xuICAgIGNhc2UgQkFSOlxuICAgICAgaWYgKHlJc1JhbmdlIHx8IHhJc1JhbmdlKSB7XG4gICAgICAgIC8vIFJhbmdlZCBiYXIgZG9lcyBub3QgYWx3YXlzIGhhdmUgY2xlYXIgb3JpZW50YXRpb24sIHNvIHdlIGFsbG93IG92ZXJyaWRpbmdcbiAgICAgICAgaWYgKHNwZWNpZmllZE9yaWVudCkge1xuICAgICAgICAgIHJldHVybiBzcGVjaWZpZWRPcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB5IGlzIHJhbmdlIGFuZCB4IGlzIG5vbi1yYW5nZSwgbm9uLWJpbiBRLCB5IGlzIGxpa2VseSBhIHByZWJpbm5lZCBmaWVsZFxuICAgICAgICBjb25zdCB4RGVmID0gZW5jb2RpbmcueDtcbiAgICAgICAgaWYgKCF4SXNSYW5nZSAmJiBpc0ZpZWxkRGVmKHhEZWYpICYmIHhEZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFICYmICF4RGVmLmJpbikge1xuICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB4IGlzIHJhbmdlIGFuZCB5IGlzIG5vbi1yYW5nZSwgbm9uLWJpbiBRLCB4IGlzIGxpa2VseSBhIHByZWJpbm5lZCBmaWVsZFxuICAgICAgICBjb25zdCB5RGVmID0gZW5jb2RpbmcueTtcbiAgICAgICAgaWYgKCF5SXNSYW5nZSAmJiBpc0ZpZWxkRGVmKHlEZWYpICYmIHlEZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFICYmICF5RGVmLmJpbikge1xuICAgICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuICAgIGNhc2UgUlVMRTogLy8gaW50ZW50aW9uYWxseSBmYWxsIHRocm91Z2hcbiAgICAgIC8vIHJldHVybiB1bmRlZmluZWQgZm9yIGxpbmUgc2VnbWVudCBydWxlIGFuZCBiYXIgd2l0aCBib3RoIGF4aXMgcmFuZ2VkXG4gICAgICBpZiAoeElzUmFuZ2UgJiYgeUlzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIGNhc2UgQVJFQTogLy8gaW50ZW50aW9uYWxseSBmYWxsIHRocm91Z2hcbiAgICAgIC8vIElmIHRoZXJlIGFyZSByYW5nZSBmb3IgYm90aCB4IGFuZCB5LCB5ICh2ZXJ0aWNhbCkgaGFzIGhpZ2hlciBwcmVjZWRlbmNlLlxuICAgICAgaWYgKHlJc1JhbmdlKSB7XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmICh4SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChtYXJrID09PSBSVUxFKSB7XG4gICAgICAgIGlmIChlbmNvZGluZy54ICYmICFlbmNvZGluZy55KSB7XG4gICAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueSAmJiAhZW5jb2RpbmcueCkge1xuICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgY2FzZSBMSU5FOiAvLyBpbnRlbnRpb25hbCBmYWxsIHRocm91Z2hcbiAgICBjYXNlIFRJQ0s6IC8vIFRpY2sgaXMgb3Bwb3NpdGUgdG8gYmFyLCBsaW5lLCBhcmVhIGFuZCBuZXZlciBoYXZlIHJhbmdlZCBtYXJrLlxuXG4gICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICBjb25zdCB4SXNDb250aW51b3VzID0gaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCk7XG4gICAgICBjb25zdCB5SXNDb250aW51b3VzID0gaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSk7XG4gICAgICBpZiAoeElzQ29udGludW91cyAmJiAheUlzQ29udGludW91cykge1xuICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoIXhJc0NvbnRpbnVvdXMgJiYgeUlzQ29udGludW91cykge1xuICAgICAgICByZXR1cm4gbWFyayAhPT0gJ3RpY2snID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzQ29udGludW91cyAmJiB5SXNDb250aW51b3VzKSB7XG4gICAgICAgIGNvbnN0IHhEZWYgPSBlbmNvZGluZy54IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIHdlIGNhbiBjYXN0IGhlcmUgc2luY2UgdGhleSBhcmUgc3VyZWx5IGZpZWxkRGVmXG4gICAgICAgIGNvbnN0IHlEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47XG5cbiAgICAgICAgY29uc3QgeElzVGVtcG9yYWwgPSB4RGVmLnR5cGUgPT09IFRFTVBPUkFMO1xuICAgICAgICBjb25zdCB5SXNUZW1wb3JhbCA9IHlEZWYudHlwZSA9PT0gVEVNUE9SQUw7XG5cbiAgICAgICAgLy8gdGVtcG9yYWwgd2l0aG91dCB0aW1lVW5pdCBpcyBjb25zaWRlcmVkIGNvbnRpbnVvdXMsIGJ1dCBiZXR0ZXIgc2VydmVzIGFzIGRpbWVuc2lvblxuICAgICAgICBpZiAoeElzVGVtcG9yYWwgJiYgIXlJc1RlbXBvcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoIXhJc1RlbXBvcmFsICYmIHlJc1RlbXBvcmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXhEZWYuYWdncmVnYXRlICYmIHlEZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoeERlZi5hZ2dyZWdhdGUgJiYgIXlEZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3BlY2lmaWVkT3JpZW50KSB7XG4gICAgICAgICAgLy8gV2hlbiBhbWJpZ3VvdXMsIHVzZSB1c2VyIHNwZWNpZmllZCBvbmUuXG4gICAgICAgICAgcmV0dXJuIHNwZWNpZmllZE9yaWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKG1hcmsgPT09IExJTkUgJiYgZW5jb2Rpbmcub3JkZXIpKSB7XG4gICAgICAgICAgLy8gRXhjZXB0IGZvciBjb25uZWN0ZWQgc2NhdHRlcnBsb3QsIHdlIHNob3VsZCBsb2cgd2FybmluZyBmb3IgdW5jbGVhciBvcmllbnRhdGlvbiBvZiBReFEgcGxvdHMuXG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudENvbnRpbnVvdXMobWFyaykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIERpc2NyZXRlIHggRGlzY3JldGUgY2FzZSwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudERpc2NyZXRlT3JFbXB0eShtYXJrKSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuICd2ZXJ0aWNhbCc7XG59XG5cbiJdfQ==