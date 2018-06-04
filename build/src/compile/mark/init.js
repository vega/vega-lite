"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
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
        case mark_1.BAR:
            if (yIsRange || xIsRange) {
                // Ranged bar does not always have clear orientation, so we allow overriding
                if (specifiedOrient) {
                    return specifiedOrient;
                }
                // If y is range and x is non-range, non-bin Q, y is likely a prebinned field
                var xDef = encoding.x;
                if (!xIsRange && fielddef_1.isFieldDef(xDef) && xDef.type === type_1.QUANTITATIVE && !xDef.bin) {
                    return 'horizontal';
                }
                // If x is range and y is non-range, non-bin Q, x is likely a prebinned field
                var yDef = encoding.y;
                if (!yIsRange && fielddef_1.isFieldDef(yDef) && yDef.type === type_1.QUANTITATIVE && !yDef.bin) {
                    return 'vertical';
                }
            }
        /* tslint:disable */
        case mark_1.RULE: // intentionally fall through
            // return undefined for line segment rule and bar with both axis ranged
            if (xIsRange && yIsRange) {
                return undefined;
            }
        case mark_1.AREA: // intentionally fall through
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQ0FBcUQ7QUFDckQsMkNBQWtFO0FBQ2xFLHFEQUFpQztBQUNqQyxtQ0FBb0g7QUFDcEgsbUNBQWtEO0FBQ2xELG1DQUFvQztBQUNwQyxvQ0FBd0M7QUFJeEMsMEJBQWlDLElBQW9CLEVBQUUsUUFBMEIsRUFBRSxNQUFjO0lBQy9GLElBQU0sT0FBTyxHQUFZLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxzQkFBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXBFLDZGQUE2RjtJQUM3RixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLHNCQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNqRSxJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDdkUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztLQUN4RTtJQUVELHlEQUF5RDtJQUN6RCxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxzQkFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckgsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7UUFDbEMsT0FB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QUFPLFNBQVMsQ0FBQzthQUNsQjtLQUNKO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0VuY29kaW5nLCBpc0FnZ3JlZ2F0ZX0gZnJvbSAnLi4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QVJFQSwgQkFSLCBDSVJDTEUsIGlzTWFya0RlZiwgTElORSwgTWFyaywgTWFya0RlZiwgUE9JTlQsIFJFQ1QsIFJVTEUsIFNRVUFSRSwgVEVYVCwgVElDS30gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2dldE1hcmtDb25maWd9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge09yaWVudH0gZnJvbSAnLi8uLi8uLi92ZWdhLnNjaGVtYSc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU1hcmtEZWYobWFyazogTWFyayB8IE1hcmtEZWYsIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBtYXJrRGVmOiBNYXJrRGVmID0gaXNNYXJrRGVmKG1hcmspID8gey4uLm1hcmt9IDoge3R5cGU6IG1hcmt9O1xuXG4gIC8vIHNldCBvcmllbnQsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHJ1bGVzIGFzIHNvbWV0aW1lcyB0aGUgc3BlY2lmaWVkIG9yaWVudCBpcyBpbnZhbGlkLlxuICBjb25zdCBzcGVjaWZpZWRPcmllbnQgPSBtYXJrRGVmLm9yaWVudCB8fCBnZXRNYXJrQ29uZmlnKCdvcmllbnQnLCBtYXJrRGVmLCBjb25maWcpO1xuICBtYXJrRGVmLm9yaWVudCA9IG9yaWVudChtYXJrRGVmLnR5cGUsIGVuY29kaW5nLCBzcGVjaWZpZWRPcmllbnQpO1xuICBpZiAoc3BlY2lmaWVkT3JpZW50ICE9PSB1bmRlZmluZWQgJiYgc3BlY2lmaWVkT3JpZW50ICE9PSBtYXJrRGVmLm9yaWVudCkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLm9yaWVudE92ZXJyaWRkZW4obWFya0RlZi5vcmllbnQsc3BlY2lmaWVkT3JpZW50KSk7XG4gIH1cblxuICAvLyBzZXQgb3BhY2l0eSBhbmQgZmlsbGVkIGlmIG5vdCBzcGVjaWZpZWQgaW4gbWFyayBjb25maWdcbiAgY29uc3Qgc3BlY2lmaWVkT3BhY2l0eSA9IG1hcmtEZWYub3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gbWFya0RlZi5vcGFjaXR5IDogZ2V0TWFya0NvbmZpZygnb3BhY2l0eScsIG1hcmtEZWYsIGNvbmZpZyk7XG4gIGlmIChzcGVjaWZpZWRPcGFjaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICBtYXJrRGVmLm9wYWNpdHkgPSBkZWZhdWx0T3BhY2l0eShtYXJrRGVmLnR5cGUsIGVuY29kaW5nKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWNpZmllZEZpbGxlZCA9IG1hcmtEZWYuZmlsbGVkO1xuICBpZiAoc3BlY2lmaWVkRmlsbGVkID09PSB1bmRlZmluZWQpIHtcbiAgICBtYXJrRGVmLmZpbGxlZCA9IGZpbGxlZChtYXJrRGVmLCBjb25maWcpO1xuICB9XG4gIHJldHVybiBtYXJrRGVmO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0T3BhY2l0eShtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPikge1xuICBpZiAoY29udGFpbnMoW1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRV0sIG1hcmspKSB7XG4gICAgLy8gcG9pbnQtYmFzZWQgbWFya3NcbiAgICBpZiAoIWlzQWdncmVnYXRlKGVuY29kaW5nKSkge1xuICAgICAgcmV0dXJuIDAuNztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZmlsbGVkKG1hcmtEZWY6IE1hcmtEZWYsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZpbGxlZENvbmZpZyA9IGdldE1hcmtDb25maWcoJ2ZpbGxlZCcsIG1hcmtEZWYsIGNvbmZpZyk7XG4gIGNvbnN0IG1hcmsgPSBtYXJrRGVmLnR5cGU7XG4gIHJldHVybiBmaWxsZWRDb25maWcgIT09IHVuZGVmaW5lZCA/IGZpbGxlZENvbmZpZyA6IG1hcmsgIT09IFBPSU5UICYmIG1hcmsgIT09IExJTkUgJiYgbWFyayAhPT0gUlVMRTtcbn1cblxuZnVuY3Rpb24gb3JpZW50KG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+LCBzcGVjaWZpZWRPcmllbnQ6IE9yaWVudCk6IE9yaWVudCB7XG4gIHN3aXRjaCAobWFyaykge1xuICAgIGNhc2UgUE9JTlQ6XG4gICAgY2FzZSBDSVJDTEU6XG4gICAgY2FzZSBTUVVBUkU6XG4gICAgY2FzZSBURVhUOlxuICAgIGNhc2UgUkVDVDpcbiAgICAgIC8vIG9yaWVudCBpcyBtZWFuaW5nbGVzcyBmb3IgdGhlc2UgbWFya3MuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgeUlzUmFuZ2UgPSBlbmNvZGluZy55MjtcbiAgY29uc3QgeElzUmFuZ2UgPSBlbmNvZGluZy54MjtcblxuICBzd2l0Y2ggKG1hcmspIHtcbiAgICBjYXNlIEJBUjpcbiAgICAgIGlmICh5SXNSYW5nZSB8fCB4SXNSYW5nZSkge1xuICAgICAgICAvLyBSYW5nZWQgYmFyIGRvZXMgbm90IGFsd2F5cyBoYXZlIGNsZWFyIG9yaWVudGF0aW9uLCBzbyB3ZSBhbGxvdyBvdmVycmlkaW5nXG4gICAgICAgIGlmIChzcGVjaWZpZWRPcmllbnQpIHtcbiAgICAgICAgICByZXR1cm4gc3BlY2lmaWVkT3JpZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgeSBpcyByYW5nZSBhbmQgeCBpcyBub24tcmFuZ2UsIG5vbi1iaW4gUSwgeSBpcyBsaWtlbHkgYSBwcmViaW5uZWQgZmllbGRcbiAgICAgICAgY29uc3QgeERlZiA9IGVuY29kaW5nLng7XG4gICAgICAgIGlmICgheElzUmFuZ2UgJiYgaXNGaWVsZERlZih4RGVmKSAmJiB4RGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSAmJiAheERlZi5iaW4pIHtcbiAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgeCBpcyByYW5nZSBhbmQgeSBpcyBub24tcmFuZ2UsIG5vbi1iaW4gUSwgeCBpcyBsaWtlbHkgYSBwcmViaW5uZWQgZmllbGRcbiAgICAgICAgY29uc3QgeURlZiA9IGVuY29kaW5nLnk7XG4gICAgICAgIGlmICgheUlzUmFuZ2UgJiYgaXNGaWVsZERlZih5RGVmKSAmJiB5RGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSAmJiAheURlZi5iaW4pIHtcbiAgICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyogdHNsaW50OmRpc2FibGUgKi9cbiAgICBjYXNlIFJVTEU6IC8vIGludGVudGlvbmFsbHkgZmFsbCB0aHJvdWdoXG4gICAgICAvLyByZXR1cm4gdW5kZWZpbmVkIGZvciBsaW5lIHNlZ21lbnQgcnVsZSBhbmQgYmFyIHdpdGggYm90aCBheGlzIHJhbmdlZFxuICAgICAgaWYgKHhJc1JhbmdlICYmIHlJc1JhbmdlKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICBjYXNlIEFSRUE6IC8vIGludGVudGlvbmFsbHkgZmFsbCB0aHJvdWdoXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgcmFuZ2UgZm9yIGJvdGggeCBhbmQgeSwgeSAodmVydGljYWwpIGhhcyBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgICAgIGlmICh5SXNSYW5nZSkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoeElzUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAobWFyayA9PT0gUlVMRSkge1xuICAgICAgICBpZiAoZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xuICAgICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkgJiYgIWVuY29kaW5nLngpIHtcbiAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgIGNhc2UgTElORTogLy8gaW50ZW50aW9uYWwgZmFsbCB0aHJvdWdoXG4gICAgY2FzZSBUSUNLOiAvLyBUaWNrIGlzIG9wcG9zaXRlIHRvIGJhciwgbGluZSwgYXJlYSBhbmQgbmV2ZXIgaGF2ZSByYW5nZWQgbWFyay5cblxuICAgICAgLyogdHNsaW50OmVuYWJsZSAqL1xuICAgICAgY29uc3QgeElzQ29udGludW91cyA9IGlzRmllbGREZWYoZW5jb2RpbmcueCkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLngpO1xuICAgICAgY29uc3QgeUlzQ29udGludW91cyA9IGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpO1xuICAgICAgaWYgKHhJc0NvbnRpbnVvdXMgJiYgIXlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKCF4SXNDb250aW51b3VzICYmIHlJc0NvbnRpbnVvdXMpIHtcbiAgICAgICAgcmV0dXJuIG1hcmsgIT09ICd0aWNrJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICB9IGVsc2UgaWYgKHhJc0NvbnRpbnVvdXMgJiYgeUlzQ29udGludW91cykge1xuICAgICAgICBjb25zdCB4RGVmID0gZW5jb2RpbmcueCBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyB3ZSBjYW4gY2FzdCBoZXJlIHNpbmNlIHRoZXkgYXJlIHN1cmVseSBmaWVsZERlZlxuICAgICAgICBjb25zdCB5RGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+O1xuXG4gICAgICAgIGNvbnN0IHhJc1RlbXBvcmFsID0geERlZi50eXBlID09PSBURU1QT1JBTDtcbiAgICAgICAgY29uc3QgeUlzVGVtcG9yYWwgPSB5RGVmLnR5cGUgPT09IFRFTVBPUkFMO1xuXG4gICAgICAgIC8vIHRlbXBvcmFsIHdpdGhvdXQgdGltZVVuaXQgaXMgY29uc2lkZXJlZCBjb250aW51b3VzLCBidXQgYmV0dGVyIHNlcnZlcyBhcyBkaW1lbnNpb25cbiAgICAgICAgaWYgKHhJc1RlbXBvcmFsICYmICF5SXNUZW1wb3JhbCkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB9IGVsc2UgaWYgKCF4SXNUZW1wb3JhbCAmJiB5SXNUZW1wb3JhbCkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF4RGVmLmFnZ3JlZ2F0ZSAmJiB5RGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB9IGVsc2UgaWYgKHhEZWYuYWdncmVnYXRlICYmICF5RGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBtYXJrICE9PSAndGljaycgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwZWNpZmllZE9yaWVudCkge1xuICAgICAgICAgIC8vIFdoZW4gYW1iaWd1b3VzLCB1c2UgdXNlciBzcGVjaWZpZWQgb25lLlxuICAgICAgICAgIHJldHVybiBzcGVjaWZpZWRPcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShtYXJrID09PSBMSU5FICYmIGVuY29kaW5nLm9yZGVyKSkge1xuICAgICAgICAgIC8vIEV4Y2VwdCBmb3IgY29ubmVjdGVkIHNjYXR0ZXJwbG90LCB3ZSBzaG91bGQgbG9nIHdhcm5pbmcgZm9yIHVuY2xlYXIgb3JpZW50YXRpb24gb2YgUXhRIHBsb3RzLlxuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnRDb250aW51b3VzKG1hcmspKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBEaXNjcmV0ZSB4IERpc2NyZXRlIGNhc2UsIHJldHVybiB1bmRlZmluZWQuXG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnREaXNjcmV0ZU9yRW1wdHkobWFyaykpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICB9XG4gIHJldHVybiAndmVydGljYWwnO1xufVxuXG4iXX0=