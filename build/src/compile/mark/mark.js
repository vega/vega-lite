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
        return parseNonPathMark(model);
    }
}
exports.parseMarkGroup = parseMarkGroup;
var FACETED_PATH_PREFIX = 'faceted_path_';
function parsePathMark(model) {
    var mark = model.mark();
    var details = pathGroupingFields(model.encoding);
    var postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;
    var clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);
    var style = common_1.getStyles(model.markDef);
    var sort = getPathSort(model);
    var pathMarks = [
        __assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), (sort ? { sort: sort } : {}), { 
            // If has subfacet for line/area group, need to use faceted data from below.
            // FIXME: support sorting path order (in connected scatterplot)
            from: { data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + model.requestDataName(data_1.MAIN) }, encode: { update: markCompiler[mark].encodeEntry(model) } }, postEncodingTransform ? { transform: postEncodingTransform } : {})
    ];
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
function getPathSort(model) {
    if (model.mark() === 'line' && model.channelHasField('order')) {
        // For only line, sort by the order field if it is specified.
        return common_1.sortParams(model.encoding.order, { expr: 'datum' });
    }
    else {
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
}
exports.getPathSort = getPathSort;
function parseNonPathMark(model) {
    var mark = model.mark();
    var style = common_1.getStyles(model.markDef);
    var clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);
    var postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;
    var marks = []; // TODO: vgMarks
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
    marks.push(__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), { from: { data: model.requestDataName(data_1.MAIN) }, encode: { update: markCompiler[mark].encodeEntry(model) } }, (postEncodingTransform ? { transform: postEncodingTransform } : {})));
    return marks;
}
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
function pathGroupingFields(encoding) {
    return util_1.keys(encoding).reduce(function (details, channel) {
        switch (channel) {
            // x, y, x2, y2, order, tooltip, href, cursor should not cause lines to group
            case 'x':
            case 'y':
            case 'order':
            case 'tooltip':
            case 'href':
            case 'x2':
            case 'y2':
            // TODO: case 'cursor':
            // text, shape, shouldn't be a part of line/area
            case 'text':
            case 'shape':
                return details;
            case 'detail':
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdUNBQWtDO0FBQ2xDLG1DQUFnQztBQUNoQywyQ0FBcUQ7QUFDckQsMkNBQW9EO0FBQ3BELG1DQUFzQztBQUN0QyxtQ0FBdUM7QUFDdkMsbUNBQTBDO0FBQzFDLG9DQUFnRDtBQUVoRCwrQkFBNEI7QUFDNUIsNkJBQTBCO0FBRTFCLHVDQUFvQztBQUNwQywrQkFBNEI7QUFDNUIsaUNBQThDO0FBQzlDLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUc1QixJQUFNLFlBQVksR0FBbUM7SUFDbkQsSUFBSSxFQUFFLFdBQUk7SUFDVixHQUFHLEVBQUUsU0FBRztJQUNSLElBQUksRUFBRSxXQUFJO0lBQ1YsS0FBSyxFQUFFLGFBQUs7SUFDWixJQUFJLEVBQUUsV0FBSTtJQUNWLElBQUksRUFBRSxXQUFJO0lBQ1YsSUFBSSxFQUFFLFdBQUk7SUFDVixJQUFJLEVBQUUsV0FBSTtJQUNWLE1BQU0sRUFBRSxjQUFNO0lBQ2QsTUFBTSxFQUFFLGNBQU07SUFDZCxRQUFRLEVBQUUsbUJBQVE7Q0FDbkIsQ0FBQztBQUdGLHdCQUErQixLQUFnQjtJQUM3QyxFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxXQUFJLEVBQUUsV0FBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7QUFDSCxDQUFDO0FBTkQsd0NBTUM7QUFFRCxJQUFNLG1CQUFtQixHQUFHLGVBQWUsQ0FB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SyxDQUFDO0FBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge01BSU59IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtFbmNvZGluZywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7Z2V0RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgTElORX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2lzU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRTdHlsZXMsIHNvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9iYXInO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2dlb3NoYXBlfSBmcm9tICcuL2dlb3NoYXBlJztcbmltcG9ydCB7bGluZX0gZnJvbSAnLi9saW5lJztcbmltcG9ydCB7Y2lyY2xlLCBwb2ludCwgc3F1YXJlfSBmcm9tICcuL3BvaW50JztcbmltcG9ydCB7cmVjdH0gZnJvbSAnLi9yZWN0JztcbmltcG9ydCB7cnVsZX0gZnJvbSAnLi9ydWxlJztcbmltcG9ydCB7dGV4dH0gZnJvbSAnLi90ZXh0JztcbmltcG9ydCB7dGlja30gZnJvbSAnLi90aWNrJztcblxuXG5jb25zdCBtYXJrQ29tcGlsZXI6IHtbdHlwZTogc3RyaW5nXTogTWFya0NvbXBpbGVyfSA9IHtcbiAgYXJlYTogYXJlYSxcbiAgYmFyOiBiYXIsXG4gIGxpbmU6IGxpbmUsXG4gIHBvaW50OiBwb2ludCxcbiAgdGV4dDogdGV4dCxcbiAgdGljazogdGljayxcbiAgcmVjdDogcmVjdCxcbiAgcnVsZTogcnVsZSxcbiAgY2lyY2xlOiBjaXJjbGUsXG4gIHNxdWFyZTogc3F1YXJlLFxuICBnZW9zaGFwZTogZ2Vvc2hhcGVcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWFya0dyb3VwKG1vZGVsOiBVbml0TW9kZWwpOiBhbnlbXSB7XG4gIGlmIChjb250YWlucyhbTElORSwgQVJFQV0sIG1vZGVsLm1hcmsoKSkpIHtcbiAgICByZXR1cm4gcGFyc2VQYXRoTWFyayhtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhcnNlTm9uUGF0aE1hcmsobW9kZWwpO1xuICB9XG59XG5cbmNvbnN0IEZBQ0VURURfUEFUSF9QUkVGSVggPSAnZmFjZXRlZF9wYXRoXyc7XG5cbmZ1bmN0aW9uIHBhcnNlUGF0aE1hcmsobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuICBjb25zdCBkZXRhaWxzID0gcGF0aEdyb3VwaW5nRmllbGRzKG1vZGVsLmVuY29kaW5nKTtcblxuICBjb25zdCBwb3N0RW5jb2RpbmdUcmFuc2Zvcm0gPSBtYXJrQ29tcGlsZXJbbWFya10ucG9zdEVuY29kaW5nVHJhbnNmb3JtID8gbWFya0NvbXBpbGVyW21hcmtdLnBvc3RFbmNvZGluZ1RyYW5zZm9ybShtb2RlbCkgOiBudWxsO1xuXG4gIGNvbnN0IGNsaXAgPSBtb2RlbC5tYXJrRGVmLmNsaXAgIT09IHVuZGVmaW5lZCA/ICEhbW9kZWwubWFya0RlZi5jbGlwIDogc2NhbGVDbGlwKG1vZGVsKTtcbiAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZXMobW9kZWwubWFya0RlZik7XG4gIGNvbnN0IHNvcnQgPSBnZXRQYXRoU29ydChtb2RlbCk7XG5cbiAgY29uc3QgcGF0aE1hcmtzOiBhbnkgPSBbXG4gICAge1xuICAgICAgbmFtZTogbW9kZWwuZ2V0TmFtZSgnbWFya3MnKSxcbiAgICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgICAuLi4oY2xpcCA/IHtjbGlwOiB0cnVlfSA6IHt9KSxcbiAgICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICAgIC4uLihzb3J0PyB7c29ydH0gOiB7fSksXG4gICAgICAvLyBJZiBoYXMgc3ViZmFjZXQgZm9yIGxpbmUvYXJlYSBncm91cCwgbmVlZCB0byB1c2UgZmFjZXRlZCBkYXRhIGZyb20gYmVsb3cuXG4gICAgICAvLyBGSVhNRTogc3VwcG9ydCBzb3J0aW5nIHBhdGggb3JkZXIgKGluIGNvbm5lY3RlZCBzY2F0dGVycGxvdClcbiAgICAgIGZyb206IHtkYXRhOiAoZGV0YWlscy5sZW5ndGggPiAwID8gRkFDRVRFRF9QQVRIX1BSRUZJWCA6ICcnKSArIG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKX0sXG4gICAgICBlbmNvZGU6IHt1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5lbmNvZGVFbnRyeShtb2RlbCl9LFxuICAgICAgLi4ucG9zdEVuY29kaW5nVHJhbnNmb3JtID8ge3RyYW5zZm9ybTogcG9zdEVuY29kaW5nVHJhbnNmb3JtfSA6IHt9XG4gICAgfVxuICBdO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgLy8gVE9ETzogZm9yIG5vbi1zdGFja2VkIHBsb3QsIG1hcCBvcmRlciB0byB6aW5kZXguIChNYXliZSByZW5hbWUgb3JkZXIgZm9yIGxheWVyIHRvIHppbmRleD8pXG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ3BhdGhncm91cCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBGQUNFVEVEX1BBVEhfUFJFRklYICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBncm91cGJ5OiBkZXRhaWxzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcmtzOiBwYXRoTWFya3NcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGF0aE1hcmtzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXRoU29ydChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGlmIChtb2RlbC5tYXJrKCkgPT09ICdsaW5lJyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ29yZGVyJykpIHtcbiAgICAvLyBGb3Igb25seSBsaW5lLCBzb3J0IGJ5IHRoZSBvcmRlciBmaWVsZCBpZiBpdCBpcyBzcGVjaWZpZWQuXG4gICAgcmV0dXJuIHNvcnRQYXJhbXMobW9kZWwuZW5jb2Rpbmcub3JkZXIsIHtleHByOiAnZGF0dW0nfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICBjb25zdCBkaW1lbnNpb25DaGFubmVsOiAneCcgfCAneScgPSBtb2RlbC5tYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IHMgPSBtb2RlbC5zb3J0KGRpbWVuc2lvbkNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnRGaWVsZCA9IGlzU29ydEZpZWxkKHMpID9cbiAgICAgIHZnRmllbGQoe1xuICAgICAgICAvLyBGSVhNRTogdGhpcyBvcCBtaWdodCBub3QgYWxyZWFkeSBleGlzdD9cbiAgICAgICAgLy8gRklYTUU6IHdoYXQgaWYgZGltZW5zaW9uQ2hhbm5lbCAoeCBvciB5KSBjb250YWlucyBjdXN0b20gZG9tYWluP1xuICAgICAgICBhZ2dyZWdhdGU6IGlzQWdncmVnYXRlKG1vZGVsLmVuY29kaW5nKSA/IHMub3AgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpZWxkOiBzLmZpZWxkXG4gICAgICB9LCB7ZXhwcjogJ2RhdHVtJ30pIDpcbiAgICAgIG1vZGVsLnZnRmllbGQoZGltZW5zaW9uQ2hhbm5lbCwge1xuICAgICAgICAvLyBGb3Igc3RhY2sgd2l0aCBpbXB1dGF0aW9uLCB3ZSBvbmx5IGhhdmUgYmluX21pZFxuICAgICAgICBiaW5TdWZmaXg6IG1vZGVsLnN0YWNrICYmIG1vZGVsLnN0YWNrLmltcHV0ZSA/ICdtaWQnIDogdW5kZWZpbmVkLFxuICAgICAgICBleHByOiAnZGF0dW0nXG4gICAgICB9KTtcblxuICAgIHJldHVybiBzb3J0RmllbGQgP1xuICAgICAge1xuICAgICAgICBmaWVsZDogc29ydEZpZWxkLFxuICAgICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgICB9IDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZU5vblBhdGhNYXJrKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgbWFyayA9IG1vZGVsLm1hcmsoKTtcblxuICBjb25zdCBzdHlsZSA9IGdldFN0eWxlcyhtb2RlbC5tYXJrRGVmKTtcbiAgY29uc3QgY2xpcCA9IG1vZGVsLm1hcmtEZWYuY2xpcCAhPT0gdW5kZWZpbmVkID8gISFtb2RlbC5tYXJrRGVmLmNsaXAgOiBzY2FsZUNsaXAobW9kZWwpO1xuXG4gIGNvbnN0IHBvc3RFbmNvZGluZ1RyYW5zZm9ybSA9IG1hcmtDb21waWxlclttYXJrXS5wb3N0RW5jb2RpbmdUcmFuc2Zvcm0gPyBtYXJrQ29tcGlsZXJbbWFya10ucG9zdEVuY29kaW5nVHJhbnNmb3JtKG1vZGVsKSA6IG51bGw7XG5cbiAgY29uc3QgbWFya3M6IGFueVtdID0gW107IC8vIFRPRE86IHZnTWFya3NcblxuICAvLyBUT0RPOiBmb3Igbm9uLXN0YWNrZWQgcGxvdCwgbWFwIG9yZGVyIHRvIHppbmRleC4gKE1heWJlIHJlbmFtZSBvcmRlciBmb3IgbGF5ZXIgdG8gemluZGV4PylcblxuICBtYXJrcy5wdXNoKHtcbiAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdtYXJrcycpLFxuICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgLi4uKGNsaXAgPyB7Y2xpcDogdHJ1ZX0gOiB7fSksXG4gICAgLi4uKHN0eWxlPyB7c3R5bGV9IDoge30pLFxuICAgIGZyb206IHtkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTil9LFxuICAgIGVuY29kZToge3VwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLmVuY29kZUVudHJ5KG1vZGVsKX0sXG4gICAgLi4uKHBvc3RFbmNvZGluZ1RyYW5zZm9ybSA/IHt0cmFuc2Zvcm06IHBvc3RFbmNvZGluZ1RyYW5zZm9ybX0gOiB7fSlcbiAgfSk7XG5cbiAgcmV0dXJuIG1hcmtzO1xufVxuXG4vKipcbiAqIFJldHVybnMgbGlzdCBvZiBwYXRoIGdyb3VwaW5nIGZpZWxkc1xuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aEdyb3VwaW5nRmllbGRzKGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogc3RyaW5nW10ge1xuICByZXR1cm4ga2V5cyhlbmNvZGluZykucmVkdWNlKChkZXRhaWxzLCBjaGFubmVsKSA9PiB7XG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICAvLyB4LCB5LCB4MiwgeTIsIG9yZGVyLCB0b29sdGlwLCBocmVmLCBjdXJzb3Igc2hvdWxkIG5vdCBjYXVzZSBsaW5lcyB0byBncm91cFxuICAgICAgY2FzZSAneCc6XG4gICAgICBjYXNlICd5JzpcbiAgICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgICAgY2FzZSAnaHJlZic6XG4gICAgICBjYXNlICd4Mic6XG4gICAgICBjYXNlICd5Mic6XG4gICAgICAvLyBUT0RPOiBjYXNlICdjdXJzb3InOlxuXG4gICAgICAvLyB0ZXh0LCBzaGFwZSwgc2hvdWxkbid0IGJlIGEgcGFydCBvZiBsaW5lL2FyZWFcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICByZXR1cm4gZGV0YWlscztcblxuICAgICAgY2FzZSAnZGV0YWlsJzpcbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICAgIChpc0FycmF5KGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZiA6IFtjaGFubmVsRGVmXSkuZm9yRWFjaCgoZmllbGREZWYpID0+IHtcbiAgICAgICAgICAgIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgY2FzZSAnc2l6ZSc6XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgIC8vIFRPRE8gc3Ryb2tlRGFzaE9mZnNldDpcbiAgICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZjxzdHJpbmc+KGVuY29kaW5nW2NoYW5uZWxdKTtcbiAgICAgICAgaWYgKGZpZWxkRGVmICYmICFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2godmdGaWVsZChmaWVsZERlZiwge30pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV0YWlscztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQnVnOiBDaGFubmVsICR7Y2hhbm5lbH0gdW5pbXBsZW1lbnRlZCBmb3IgbGluZSBtYXJrYCk7XG4gICAgfVxuICB9LCBbXSk7XG59XG5cbi8qKlxuICogSWYgc2NhbGVzIGFyZSBib3VuZCB0byBpbnRlcnZhbCBzZWxlY3Rpb25zLCB3ZSB3YW50IHRvIGF1dG9tYXRpY2FsbHkgY2xpcFxuICogbWFya3MgdG8gYWNjb3VudCBmb3IgcGFubmluZy96b29taW5nIGludGVyYWN0aW9ucy4gV2UgaWRlbnRpZnkgYm91bmQgc2NhbGVzXG4gKiBieSB0aGUgZG9tYWluUmF3IHByb3BlcnR5LCB3aGljaCBnZXRzIGFkZGVkIGR1cmluZyBzY2FsZSBwYXJzaW5nLlxuICovXG5mdW5jdGlvbiBzY2FsZUNsaXAobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCB4U2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpO1xuICBjb25zdCB5U2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpO1xuICByZXR1cm4gKHhTY2FsZSAmJiB4U2NhbGUuZ2V0KCdkb21haW5SYXcnKSkgfHxcbiAgICAoeVNjYWxlICYmIHlTY2FsZS5nZXQoJ2RvbWFpblJhdycpKSA/IHRydWUgOiBmYWxzZTtcbn1cbiJdfQ==