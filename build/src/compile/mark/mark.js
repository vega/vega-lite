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
var vega_util_1 = require("vega-util");
var data_1 = require("../../data");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
var area_1 = require("./area");
var bar_1 = require("./bar");
var geoshape_1 = require("./geoshape");
var line_1 = require("./line");
var point_1 = require("./point");
var rect_1 = require("./rect");
var rule_1 = require("./rule");
var text_1 = require("./text");
var tick_1 = require("./tick");
var markCompiler = {
    area: area_1.area,
    bar: bar_1.bar,
    line: line_1.line,
    point: point_1.point,
    text: text_1.text,
    tick: tick_1.tick,
    rect: rect_1.rect,
    rule: rule_1.rule,
    circle: point_1.circle,
    square: point_1.square,
    geoshape: geoshape_1.geoshape
};
function parseMarkGroup(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA], model.mark())) {
        return parsePathMark(model);
    }
    else {
        return getMarkGroups(model);
    }
}
exports.parseMarkGroup = parseMarkGroup;
var FACETED_PATH_PREFIX = 'faceted_path_';
function parsePathMark(model) {
    var details = pathGroupingFields(model.encoding);
    var pathMarks = getMarkGroups(model, {
        // If has subfacet for line/area group, need to use faceted data from below.
        fromPrefix: (details.length > 0 ? FACETED_PATH_PREFIX : '')
    });
    if (details.length > 0) {
        // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
        return [{
                name: model.getName('pathgroup'),
                type: 'group',
                from: {
                    facet: {
                        name: FACETED_PATH_PREFIX + model.requestDataName(data_1.MAIN),
                        data: model.requestDataName(data_1.MAIN),
                        groupby: details,
                    }
                },
                encode: {
                    update: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } }
                    }
                },
                marks: pathMarks
            }];
    }
    else {
        return pathMarks;
    }
}
function getSort(model) {
    if (model.channelHasField('order') && !model.stack) {
        // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
        return common_1.sortParams(model.encoding.order, { expr: 'datum' });
    }
    else if (util_1.contains(['line', 'area'], model.mark())) {
        // For both line and area, we sort values based on dimension by default
        var dimensionChannel = model.markDef.orient === 'horizontal' ? 'y' : 'x';
        var s = model.sort(dimensionChannel);
        var sortField = sort_1.isSortField(s) ?
            fielddef_1.vgField({
                // FIXME: this op might not already exist?
                // FIXME: what if dimensionChannel (x or y) contains custom domain?
                aggregate: encoding_1.isAggregate(model.encoding) ? s.op : undefined,
                field: s.field
            }, { expr: 'datum' }) :
            model.vgField(dimensionChannel, {
                // For stack with imputation, we only have bin_mid
                binSuffix: model.stack && model.stack.impute ? 'mid' : undefined,
                expr: 'datum'
            });
        return sortField ?
            {
                field: sortField,
                order: 'descending'
            } :
            undefined;
    }
    return undefined;
}
exports.getSort = getSort;
function getMarkGroups(model, opt) {
    if (opt === void 0) { opt = { fromPrefix: '' }; }
    var mark = model.mark();
    var clip = model.markDef.clip !== undefined ?
        !!model.markDef.clip : scaleClip(model);
    var style = common_1.getStyles(model.markDef);
    var key = model.encoding.key;
    var sort = getSort(model);
    var postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;
    return [__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), (key ? { key: { field: key.field } } : {}), (sort ? { sort: sort } : {}), { from: { data: opt.fromPrefix + model.requestDataName(data_1.MAIN) }, encode: {
                update: markCompiler[mark].encodeEntry(model)
            } }, (postEncodingTransform ? {
            transform: postEncodingTransform
        } : {}))];
}
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
function pathGroupingFields(encoding) {
    return util_1.keys(encoding).reduce(function (details, channel) {
        switch (channel) {
            // x, y, x2, y2, lat, long, lat1, long2, order, tooltip, href, cursor should not cause lines to group
            case 'x':
            case 'y':
            case 'order':
            case 'tooltip':
            case 'href':
            case 'x2':
            case 'y2':
            case 'latitude':
            case 'longitude':
            case 'latitude2':
            case 'longitude2':
            // TODO: case 'cursor':
            // text, shape, shouldn't be a part of line/area
            case 'text':
            case 'shape':
                return details;
            case 'detail':
            case 'key':
                var channelDef = encoding[channel];
                if (channelDef) {
                    (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                        if (!fieldDef.aggregate) {
                            details.push(fielddef_1.vgField(fieldDef, {}));
                        }
                    });
                }
                return details;
            case 'color':
            case 'fill':
            case 'stroke':
            case 'size':
            case 'opacity':
                // TODO strokeDashOffset:
                var fieldDef = fielddef_1.getFieldDef(encoding[channel]);
                if (fieldDef && !fieldDef.aggregate) {
                    details.push(fielddef_1.vgField(fieldDef, {}));
                }
                return details;
            default:
                throw new Error("Bug: Channel " + channel + " unimplemented for line mark");
        }
    }, []);
}
exports.pathGroupingFields = pathGroupingFields;
/**
 * If scales are bound to interval selections, we want to automatically clip
 * marks to account for panning/zooming interactions. We identify bound scales
 * by the domainRaw property, which gets added during scale parsing.
 */
function scaleClip(model) {
    var xScale = model.getScaleComponent('x');
    var yScale = model.getScaleComponent('y');
    return (xScale && xScale.get('domainRaw')) ||
        (yScale && yScale.get('domainRaw')) ? true : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdUNBQWtDO0FBQ2xDLG1DQUFnQztBQUNoQywyQ0FBcUQ7QUFDckQsMkNBQW9EO0FBQ3BELG1DQUFzQztBQUN0QyxtQ0FBdUM7QUFDdkMsbUNBQTBDO0FBQzFDLG9DQUFnRDtBQUVoRCwrQkFBNEI7QUFDNUIsNkJBQTBCO0FBRTFCLHVDQUFvQztBQUNwQywrQkFBNEI7QUFDNUIsaUNBQThDO0FBQzlDLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUc1QixJQUFNLFlBQVksR0FBbUM7SUFDbkQsSUFBSSxFQUFFLFdBQUk7SUFDVixHQUFHLEVBQUUsU0FBRztJQUNSLElBQUksRUFBRSxXQUFJO0lBQ1YsS0FBSyxFQUFFLGFBQUs7SUFDWixJQUFJLEVBQUUsV0FBSTtJQUNWLElBQUksRUFBRSxXQUFJO0lBQ1YsSUFBSSxFQUFFLFdBQUk7SUFDVixJQUFJLEVBQUUsV0FBSTtJQUNWLE1BQU0sRUFBRSxjQUFNO0lBQ2QsTUFBTSxFQUFFLGNBQU07SUFDZCxRQUFRLEVBQUUsbUJBQVE7Q0FDbkIsQ0FBQztBQUdGLHdCQUErQixLQUFnQjtJQUM3QyxFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxXQUFJLEVBQUUsV0FBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0FBQ0gsQ0FBQztBQU5ELHdDQU1DO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7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QUFDO2dCQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDakI7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBZ0IsT0FBTyxpQ0FBOEIsQ0FBQyxDQUFDO1FBQzNFLENBQUM7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBakRELGdEQWlEQztBQUVEOzs7O0dBSUc7QUFDSCxtQkFBbUIsS0FBZ0I7SUFDakMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4QyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge01BSU59IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtFbmNvZGluZywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7Z2V0RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgTElORX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2lzU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRTdHlsZXMsIHNvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9iYXInO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2dlb3NoYXBlfSBmcm9tICcuL2dlb3NoYXBlJztcbmltcG9ydCB7bGluZX0gZnJvbSAnLi9saW5lJztcbmltcG9ydCB7Y2lyY2xlLCBwb2ludCwgc3F1YXJlfSBmcm9tICcuL3BvaW50JztcbmltcG9ydCB7cmVjdH0gZnJvbSAnLi9yZWN0JztcbmltcG9ydCB7cnVsZX0gZnJvbSAnLi9ydWxlJztcbmltcG9ydCB7dGV4dH0gZnJvbSAnLi90ZXh0JztcbmltcG9ydCB7dGlja30gZnJvbSAnLi90aWNrJztcblxuXG5jb25zdCBtYXJrQ29tcGlsZXI6IHtbdHlwZTogc3RyaW5nXTogTWFya0NvbXBpbGVyfSA9IHtcbiAgYXJlYTogYXJlYSxcbiAgYmFyOiBiYXIsXG4gIGxpbmU6IGxpbmUsXG4gIHBvaW50OiBwb2ludCxcbiAgdGV4dDogdGV4dCxcbiAgdGljazogdGljayxcbiAgcmVjdDogcmVjdCxcbiAgcnVsZTogcnVsZSxcbiAgY2lyY2xlOiBjaXJjbGUsXG4gIHNxdWFyZTogc3F1YXJlLFxuICBnZW9zaGFwZTogZ2Vvc2hhcGVcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWFya0dyb3VwKG1vZGVsOiBVbml0TW9kZWwpOiBhbnlbXSB7XG4gIGlmIChjb250YWlucyhbTElORSwgQVJFQV0sIG1vZGVsLm1hcmsoKSkpIHtcbiAgICByZXR1cm4gcGFyc2VQYXRoTWFyayhtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldE1hcmtHcm91cHMobW9kZWwpO1xuICB9XG59XG5cbmNvbnN0IEZBQ0VURURfUEFUSF9QUkVGSVggPSAnZmFjZXRlZF9wYXRoXyc7XG5cbmZ1bmN0aW9uIHBhcnNlUGF0aE1hcmsobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBkZXRhaWxzID0gcGF0aEdyb3VwaW5nRmllbGRzKG1vZGVsLmVuY29kaW5nKTtcblxuICBjb25zdCBwYXRoTWFya3MgPSBnZXRNYXJrR3JvdXBzKG1vZGVsLCB7XG4gICAgLy8gSWYgaGFzIHN1YmZhY2V0IGZvciBsaW5lL2FyZWEgZ3JvdXAsIG5lZWQgdG8gdXNlIGZhY2V0ZWQgZGF0YSBmcm9tIGJlbG93LlxuICAgIGZyb21QcmVmaXg6IChkZXRhaWxzLmxlbmd0aCA+IDAgPyBGQUNFVEVEX1BBVEhfUFJFRklYIDogJycpXG4gIH0pO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgLy8gVE9ETzogZm9yIG5vbi1zdGFja2VkIHBsb3QsIG1hcCBvcmRlciB0byB6aW5kZXguIChNYXliZSByZW5hbWUgb3JkZXIgZm9yIGxheWVyIHRvIHppbmRleD8pXG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ3BhdGhncm91cCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBGQUNFVEVEX1BBVEhfUFJFRklYICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBncm91cGJ5OiBkZXRhaWxzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcmtzOiBwYXRoTWFya3NcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGF0aE1hcmtzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0KG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgnb3JkZXInKSAmJiAhbW9kZWwuc3RhY2spIHtcbiAgICAvLyBTb3J0IGJ5IHRoZSBvcmRlciBmaWVsZCBpZiBpdCBpcyBzcGVjaWZpZWQgYW5kIHRoZSBmaWVsZCBpcyBub3Qgc3RhY2tlZC4gKEZvciBzdGFja2VkIGZpZWxkLCBvcmRlciBzcGVjaWZ5IHN0YWNrIG9yZGVyLilcbiAgICByZXR1cm4gc29ydFBhcmFtcyhtb2RlbC5lbmNvZGluZy5vcmRlciwge2V4cHI6ICdkYXR1bSd9KTtcbiAgfSBlbHNlIGlmIChjb250YWlucyhbJ2xpbmUnLCAnYXJlYSddLCBtb2RlbC5tYXJrKCkpKSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICBjb25zdCBkaW1lbnNpb25DaGFubmVsOiAneCcgfCAneScgPSBtb2RlbC5tYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IHMgPSBtb2RlbC5zb3J0KGRpbWVuc2lvbkNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnRGaWVsZCA9IGlzU29ydEZpZWxkKHMpID9cbiAgICAgIHZnRmllbGQoe1xuICAgICAgICAvLyBGSVhNRTogdGhpcyBvcCBtaWdodCBub3QgYWxyZWFkeSBleGlzdD9cbiAgICAgICAgLy8gRklYTUU6IHdoYXQgaWYgZGltZW5zaW9uQ2hhbm5lbCAoeCBvciB5KSBjb250YWlucyBjdXN0b20gZG9tYWluP1xuICAgICAgICBhZ2dyZWdhdGU6IGlzQWdncmVnYXRlKG1vZGVsLmVuY29kaW5nKSA/IHMub3AgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpZWxkOiBzLmZpZWxkXG4gICAgICB9LCB7ZXhwcjogJ2RhdHVtJ30pIDpcbiAgICAgIG1vZGVsLnZnRmllbGQoZGltZW5zaW9uQ2hhbm5lbCwge1xuICAgICAgICAvLyBGb3Igc3RhY2sgd2l0aCBpbXB1dGF0aW9uLCB3ZSBvbmx5IGhhdmUgYmluX21pZFxuICAgICAgICBiaW5TdWZmaXg6IG1vZGVsLnN0YWNrICYmIG1vZGVsLnN0YWNrLmltcHV0ZSA/ICdtaWQnIDogdW5kZWZpbmVkLFxuICAgICAgICBleHByOiAnZGF0dW0nXG4gICAgICB9KTtcblxuICAgIHJldHVybiBzb3J0RmllbGQgP1xuICAgICAge1xuICAgICAgICBmaWVsZDogc29ydEZpZWxkLFxuICAgICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgICB9IDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRNYXJrR3JvdXBzKG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge1xuICBmcm9tUHJlZml4OiBzdHJpbmdcbn0gPSB7ZnJvbVByZWZpeDogJyd9KSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG5cbiAgY29uc3QgY2xpcCA9IG1vZGVsLm1hcmtEZWYuY2xpcCAhPT0gdW5kZWZpbmVkID9cbiAgICAhIW1vZGVsLm1hcmtEZWYuY2xpcCA6IHNjYWxlQ2xpcChtb2RlbCk7XG4gIGNvbnN0IHN0eWxlID0gZ2V0U3R5bGVzKG1vZGVsLm1hcmtEZWYpO1xuICBjb25zdCBrZXkgPSBtb2RlbC5lbmNvZGluZy5rZXk7XG4gIGNvbnN0IHNvcnQgPSBnZXRTb3J0KG1vZGVsKTtcblxuICBjb25zdCBwb3N0RW5jb2RpbmdUcmFuc2Zvcm0gPSBtYXJrQ29tcGlsZXJbbWFya10ucG9zdEVuY29kaW5nVHJhbnNmb3JtID8gbWFya0NvbXBpbGVyW21hcmtdLnBvc3RFbmNvZGluZ1RyYW5zZm9ybShtb2RlbCkgOiBudWxsO1xuXG4gIHJldHVybiBbe1xuICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ21hcmtzJyksXG4gICAgdHlwZTogbWFya0NvbXBpbGVyW21hcmtdLnZnTWFyayxcbiAgICAuLi4oY2xpcCA/IHtjbGlwOiB0cnVlfSA6IHt9KSxcbiAgICAuLi4oc3R5bGUgPyB7c3R5bGV9IDoge30pLFxuICAgIC4uLihrZXkgPyB7a2V5OiB7ZmllbGQ6IGtleS5maWVsZH19IDoge30pLFxuICAgIC4uLihzb3J0ID8ge3NvcnR9IDoge30pLFxuICAgIGZyb206IHtkYXRhOiBvcHQuZnJvbVByZWZpeCArIG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKX0sXG4gICAgZW5jb2RlOiB7XG4gICAgICB1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5lbmNvZGVFbnRyeShtb2RlbClcbiAgICB9LFxuICAgIC4uLihwb3N0RW5jb2RpbmdUcmFuc2Zvcm0gPyB7XG4gICAgICB0cmFuc2Zvcm06IHBvc3RFbmNvZGluZ1RyYW5zZm9ybVxuICAgIH0gOiB7fSlcbiAgfV07XG5cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGxpc3Qgb2YgcGF0aCBncm91cGluZyBmaWVsZHNcbiAqIHRoYXQgdGhlIG1vZGVsJ3Mgc3BlYyBjb250YWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGhHcm91cGluZ0ZpZWxkcyhlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGtleXMoZW5jb2RpbmcpLnJlZHVjZSgoZGV0YWlscywgY2hhbm5lbCkgPT4ge1xuICAgIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgICAgLy8geCwgeSwgeDIsIHkyLCBsYXQsIGxvbmcsIGxhdDEsIGxvbmcyLCBvcmRlciwgdG9vbHRpcCwgaHJlZiwgY3Vyc29yIHNob3VsZCBub3QgY2F1c2UgbGluZXMgdG8gZ3JvdXBcbiAgICAgIGNhc2UgJ3gnOlxuICAgICAgY2FzZSAneSc6XG4gICAgICBjYXNlICdvcmRlcic6XG4gICAgICBjYXNlICd0b29sdGlwJzpcbiAgICAgIGNhc2UgJ2hyZWYnOlxuICAgICAgY2FzZSAneDInOlxuICAgICAgY2FzZSAneTInOlxuXG4gICAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgICAgY2FzZSAnbGF0aXR1ZGUyJzpcbiAgICAgIGNhc2UgJ2xvbmdpdHVkZTInOlxuICAgICAgLy8gVE9ETzogY2FzZSAnY3Vyc29yJzpcblxuICAgICAgLy8gdGV4dCwgc2hhcGUsIHNob3VsZG4ndCBiZSBhIHBhcnQgb2YgbGluZS9hcmVhXG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgICAgcmV0dXJuIGRldGFpbHM7XG5cbiAgICAgIGNhc2UgJ2RldGFpbCc6XG4gICAgICBjYXNlICdrZXknOlxuICAgICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICAgIGlmIChjaGFubmVsRGVmKSB7XG4gICAgICAgICAgKGlzQXJyYXkoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmIDogW2NoYW5uZWxEZWZdKS5mb3JFYWNoKChmaWVsZERlZikgPT4ge1xuICAgICAgICAgICAgaWYgKCFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICAgICAgZGV0YWlscy5wdXNoKHZnRmllbGQoZmllbGREZWYsIHt9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgICBjYXNlICdjb2xvcic6XG4gICAgICBjYXNlICdmaWxsJzpcbiAgICAgIGNhc2UgJ3N0cm9rZSc6XG4gICAgICBjYXNlICdzaXplJzpcbiAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgLy8gVE9ETyBzdHJva2VEYXNoT2Zmc2V0OlxuICAgICAgICBjb25zdCBmaWVsZERlZiA9IGdldEZpZWxkRGVmPHN0cmluZz4oZW5jb2RpbmdbY2hhbm5lbF0pO1xuICAgICAgICBpZiAoZmllbGREZWYgJiYgIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBCdWc6IENoYW5uZWwgJHtjaGFubmVsfSB1bmltcGxlbWVudGVkIGZvciBsaW5lIG1hcmtgKTtcbiAgICB9XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBJZiBzY2FsZXMgYXJlIGJvdW5kIHRvIGludGVydmFsIHNlbGVjdGlvbnMsIHdlIHdhbnQgdG8gYXV0b21hdGljYWxseSBjbGlwXG4gKiBtYXJrcyB0byBhY2NvdW50IGZvciBwYW5uaW5nL3pvb21pbmcgaW50ZXJhY3Rpb25zLiBXZSBpZGVudGlmeSBib3VuZCBzY2FsZXNcbiAqIGJ5IHRoZSBkb21haW5SYXcgcHJvcGVydHksIHdoaWNoIGdldHMgYWRkZWQgZHVyaW5nIHNjYWxlIHBhcnNpbmcuXG4gKi9cbmZ1bmN0aW9uIHNjYWxlQ2xpcChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5Jyk7XG4gIHJldHVybiAoeFNjYWxlICYmIHhTY2FsZS5nZXQoJ2RvbWFpblJhdycpKSB8fFxuICAgICh5U2NhbGUgJiYgeVNjYWxlLmdldCgnZG9tYWluUmF3JykpID8gdHJ1ZSA6IGZhbHNlO1xufVxuIl19