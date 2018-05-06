"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    circle: point_1.circle,
    geoshape: geoshape_1.geoshape,
    line: line_1.line,
    point: point_1.point,
    rect: rect_1.rect,
    rule: rule_1.rule,
    square: point_1.square,
    text: text_1.text,
    tick: tick_1.tick,
    trail: line_1.trail
};
function parseMarkGroup(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA, mark_1.TRAIL], model.mark)) {
        return parsePathMark(model);
    }
    else {
        return getMarkGroups(model);
    }
}
exports.parseMarkGroup = parseMarkGroup;
var FACETED_PATH_PREFIX = 'faceted_path_';
function parsePathMark(model) {
    var details = pathGroupingFields(model.mark, model.encoding);
    var pathMarks = getMarkGroups(model, {
        // If has subfacet for line/area group, need to use faceted data from below.
        fromPrefix: (details.length > 0 ? FACETED_PATH_PREFIX : '')
    });
    if (details.length > 0) { // have level of details - need to facet line into subgroups
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
    var order = model.encoding.order;
    if (!vega_util_1.isArray(order) && fielddef_1.isValueDef(order)) {
        return undefined;
    }
    else if ((vega_util_1.isArray(order) || fielddef_1.isFieldDef(order)) && !model.stack) {
        // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
        return common_1.sortParams(order, { expr: 'datum' });
    }
    else if (mark_1.isPathMark(model.mark)) {
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
    var mark = model.mark;
    var clip = model.markDef.clip !== undefined ?
        !!model.markDef.clip : scaleClip(model);
    var style = common_1.getStyles(model.markDef);
    var key = model.encoding.key;
    var sort = getSort(model);
    var postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;
    return [tslib_1.__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), (key ? { key: { field: key.field } } : {}), (sort ? { sort: sort } : {}), { from: { data: opt.fromPrefix + model.requestDataName(data_1.MAIN) }, encode: {
                update: markCompiler[mark].encodeEntry(model)
            } }, (postEncodingTransform ? {
            transform: postEncodingTransform
        } : {}))];
}
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
function pathGroupingFields(mark, encoding) {
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
            // text, shape, shouldn't be a part of line/trail/area
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
            case 'size':
                if (mark === 'trail') {
                    // For trail, size should not group trail lines.
                    return details;
                }
            // For line, it should group lines.
            /* tslint:disable */
            // intentional fall through
            case 'color':
            case 'fill':
            case 'stroke':
            case 'opacity':
                // TODO strokeDashOffset:
                /* tslint:enable */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMsbUNBQWdDO0FBQ2hDLDJDQUFxRDtBQUNyRCwyQ0FBNEU7QUFDNUUsbUNBQStEO0FBQy9ELG1DQUF1QztBQUN2QyxtQ0FBMEM7QUFDMUMsb0NBQWdEO0FBRWhELCtCQUE0QjtBQUM1Qiw2QkFBMEI7QUFFMUIsdUNBQW9DO0FBQ3BDLCtCQUFtQztBQUNuQyxpQ0FBOEM7QUFDOUMsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBRzVCLElBQU0sWUFBWSxHQUFnQztJQUNoRCxJQUFJLGFBQUE7SUFDSixHQUFHLFdBQUE7SUFDSCxNQUFNLGdCQUFBO0lBQ04sUUFBUSxxQkFBQTtJQUNSLElBQUksYUFBQTtJQUNKLEtBQUssZUFBQTtJQUNMLElBQUksYUFBQTtJQUNKLElBQUksYUFBQTtJQUNKLE1BQU0sZ0JBQUE7SUFDTixJQUFJLGFBQUE7SUFDSixJQUFJLGFBQUE7SUFDSixLQUFLLGNBQUE7Q0FDTixDQUFDO0FBRUYsd0JBQStCLEtBQWdCO0lBQzdDLElBQUksZUFBUSxDQUFDLENBQUMsV0FBSSxFQUFFLFdBQUksRUFBRSxZQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDN0MsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7U0FBTTtRQUNMLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO0FBQ0gsQ0FBQztBQU5ELHdDQU1DO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFFNUMsdUJBQXVCLEtBQWdCO0lBQ3JDLElBQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFD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T0FBTyxpQ0FBOEIsQ0FBQyxDQUFDO1NBQzFFO0lBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQTdERCxnREE2REM7QUFFRDs7OztHQUlHO0FBQ0gsbUJBQW1CLEtBQWdCO0lBQ2pDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7TUFJTn0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0VuY29kaW5nLCBpc0FnZ3JlZ2F0ZX0gZnJvbSAnLi4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtnZXRGaWVsZERlZiwgaXNGaWVsZERlZiwgaXNWYWx1ZURlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtBUkVBLCBpc1BhdGhNYXJrLCBMSU5FLCBNYXJrLCBUUkFJTH0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2lzU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRTdHlsZXMsIHNvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9iYXInO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2dlb3NoYXBlfSBmcm9tICcuL2dlb3NoYXBlJztcbmltcG9ydCB7bGluZSwgdHJhaWx9IGZyb20gJy4vbGluZSc7XG5pbXBvcnQge2NpcmNsZSwgcG9pbnQsIHNxdWFyZX0gZnJvbSAnLi9wb2ludCc7XG5pbXBvcnQge3JlY3R9IGZyb20gJy4vcmVjdCc7XG5pbXBvcnQge3J1bGV9IGZyb20gJy4vcnVsZSc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4vdGV4dCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4vdGljayc7XG5cblxuY29uc3QgbWFya0NvbXBpbGVyOiB7W20gaW4gTWFya106IE1hcmtDb21waWxlcn0gPSB7XG4gIGFyZWEsXG4gIGJhcixcbiAgY2lyY2xlLFxuICBnZW9zaGFwZSxcbiAgbGluZSxcbiAgcG9pbnQsXG4gIHJlY3QsXG4gIHJ1bGUsXG4gIHNxdWFyZSxcbiAgdGV4dCxcbiAgdGljayxcbiAgdHJhaWxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1hcmtHcm91cChtb2RlbDogVW5pdE1vZGVsKTogYW55W10ge1xuICBpZiAoY29udGFpbnMoW0xJTkUsIEFSRUEsIFRSQUlMXSwgbW9kZWwubWFyaykpIHtcbiAgICByZXR1cm4gcGFyc2VQYXRoTWFyayhtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldE1hcmtHcm91cHMobW9kZWwpO1xuICB9XG59XG5cbmNvbnN0IEZBQ0VURURfUEFUSF9QUkVGSVggPSAnZmFjZXRlZF9wYXRoXyc7XG5cbmZ1bmN0aW9uIHBhcnNlUGF0aE1hcmsobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBkZXRhaWxzID0gcGF0aEdyb3VwaW5nRmllbGRzKG1vZGVsLm1hcmssIG1vZGVsLmVuY29kaW5nKTtcblxuICBjb25zdCBwYXRoTWFya3MgPSBnZXRNYXJrR3JvdXBzKG1vZGVsLCB7XG4gICAgLy8gSWYgaGFzIHN1YmZhY2V0IGZvciBsaW5lL2FyZWEgZ3JvdXAsIG5lZWQgdG8gdXNlIGZhY2V0ZWQgZGF0YSBmcm9tIGJlbG93LlxuICAgIGZyb21QcmVmaXg6IChkZXRhaWxzLmxlbmd0aCA+IDAgPyBGQUNFVEVEX1BBVEhfUFJFRklYIDogJycpXG4gIH0pO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgLy8gVE9ETzogZm9yIG5vbi1zdGFja2VkIHBsb3QsIG1hcCBvcmRlciB0byB6aW5kZXguIChNYXliZSByZW5hbWUgb3JkZXIgZm9yIGxheWVyIHRvIHppbmRleD8pXG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ3BhdGhncm91cCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBGQUNFVEVEX1BBVEhfUFJFRklYICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBncm91cGJ5OiBkZXRhaWxzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcmtzOiBwYXRoTWFya3NcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGF0aE1hcmtzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0KG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3Qgb3JkZXIgPSBtb2RlbC5lbmNvZGluZy5vcmRlcjtcbiAgaWYgKCFpc0FycmF5KG9yZGVyKSAmJiBpc1ZhbHVlRGVmKG9yZGVyKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAoKGlzQXJyYXkob3JkZXIpIHx8IGlzRmllbGREZWYob3JkZXIpKSAmJiAhbW9kZWwuc3RhY2spIHtcbiAgICAvLyBTb3J0IGJ5IHRoZSBvcmRlciBmaWVsZCBpZiBpdCBpcyBzcGVjaWZpZWQgYW5kIHRoZSBmaWVsZCBpcyBub3Qgc3RhY2tlZC4gKEZvciBzdGFja2VkIGZpZWxkLCBvcmRlciBzcGVjaWZ5IHN0YWNrIG9yZGVyLilcbiAgICByZXR1cm4gc29ydFBhcmFtcyhvcmRlciwge2V4cHI6ICdkYXR1bSd9KTtcbiAgfSBlbHNlIGlmIChpc1BhdGhNYXJrKG1vZGVsLm1hcmspKSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICBjb25zdCBkaW1lbnNpb25DaGFubmVsOiAneCcgfCAneScgPSBtb2RlbC5tYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IHMgPSBtb2RlbC5zb3J0KGRpbWVuc2lvbkNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnRGaWVsZCA9IGlzU29ydEZpZWxkKHMpID9cbiAgICAgIHZnRmllbGQoe1xuICAgICAgICAvLyBGSVhNRTogdGhpcyBvcCBtaWdodCBub3QgYWxyZWFkeSBleGlzdD9cbiAgICAgICAgLy8gRklYTUU6IHdoYXQgaWYgZGltZW5zaW9uQ2hhbm5lbCAoeCBvciB5KSBjb250YWlucyBjdXN0b20gZG9tYWluP1xuICAgICAgICBhZ2dyZWdhdGU6IGlzQWdncmVnYXRlKG1vZGVsLmVuY29kaW5nKSA/IHMub3AgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpZWxkOiBzLmZpZWxkXG4gICAgICB9LCB7ZXhwcjogJ2RhdHVtJ30pIDpcbiAgICAgIG1vZGVsLnZnRmllbGQoZGltZW5zaW9uQ2hhbm5lbCwge1xuICAgICAgICAvLyBGb3Igc3RhY2sgd2l0aCBpbXB1dGF0aW9uLCB3ZSBvbmx5IGhhdmUgYmluX21pZFxuICAgICAgICBiaW5TdWZmaXg6IG1vZGVsLnN0YWNrICYmIG1vZGVsLnN0YWNrLmltcHV0ZSA/ICdtaWQnIDogdW5kZWZpbmVkLFxuICAgICAgICBleHByOiAnZGF0dW0nXG4gICAgICB9KTtcblxuICAgIHJldHVybiBzb3J0RmllbGQgP1xuICAgICAge1xuICAgICAgICBmaWVsZDogc29ydEZpZWxkLFxuICAgICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgICB9IDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRNYXJrR3JvdXBzKG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge1xuICBmcm9tUHJlZml4OiBzdHJpbmdcbn0gPSB7ZnJvbVByZWZpeDogJyd9KSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrO1xuXG4gIGNvbnN0IGNsaXAgPSBtb2RlbC5tYXJrRGVmLmNsaXAgIT09IHVuZGVmaW5lZCA/XG4gICAgISFtb2RlbC5tYXJrRGVmLmNsaXAgOiBzY2FsZUNsaXAobW9kZWwpO1xuICBjb25zdCBzdHlsZSA9IGdldFN0eWxlcyhtb2RlbC5tYXJrRGVmKTtcbiAgY29uc3Qga2V5ID0gbW9kZWwuZW5jb2Rpbmcua2V5O1xuICBjb25zdCBzb3J0ID0gZ2V0U29ydChtb2RlbCk7XG5cbiAgY29uc3QgcG9zdEVuY29kaW5nVHJhbnNmb3JtID0gbWFya0NvbXBpbGVyW21hcmtdLnBvc3RFbmNvZGluZ1RyYW5zZm9ybSA/IG1hcmtDb21waWxlclttYXJrXS5wb3N0RW5jb2RpbmdUcmFuc2Zvcm0obW9kZWwpIDogbnVsbDtcblxuICByZXR1cm4gW3tcbiAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdtYXJrcycpLFxuICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgLi4uKGNsaXAgPyB7Y2xpcDogdHJ1ZX0gOiB7fSksXG4gICAgLi4uKHN0eWxlID8ge3N0eWxlfSA6IHt9KSxcbiAgICAuLi4oa2V5ID8ge2tleToge2ZpZWxkOiBrZXkuZmllbGR9fSA6IHt9KSxcbiAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KSxcbiAgICBmcm9tOiB7ZGF0YTogb3B0LmZyb21QcmVmaXggKyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTil9LFxuICAgIGVuY29kZToge1xuICAgICAgdXBkYXRlOiBtYXJrQ29tcGlsZXJbbWFya10uZW5jb2RlRW50cnkobW9kZWwpXG4gICAgfSxcbiAgICAuLi4ocG9zdEVuY29kaW5nVHJhbnNmb3JtID8ge1xuICAgICAgdHJhbnNmb3JtOiBwb3N0RW5jb2RpbmdUcmFuc2Zvcm1cbiAgICB9IDoge30pXG4gIH1dO1xuXG59XG5cbi8qKlxuICogUmV0dXJucyBsaXN0IG9mIHBhdGggZ3JvdXBpbmcgZmllbGRzXG4gKiB0aGF0IHRoZSBtb2RlbCdzIHNwZWMgY29udGFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXRoR3JvdXBpbmdGaWVsZHMobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBrZXlzKGVuY29kaW5nKS5yZWR1Y2UoKGRldGFpbHMsIGNoYW5uZWwpID0+IHtcbiAgICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICAgIC8vIHgsIHksIHgyLCB5MiwgbGF0LCBsb25nLCBsYXQxLCBsb25nMiwgb3JkZXIsIHRvb2x0aXAsIGhyZWYsIGN1cnNvciBzaG91bGQgbm90IGNhdXNlIGxpbmVzIHRvIGdyb3VwXG4gICAgICBjYXNlICd4JzpcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgY2FzZSAndG9vbHRpcCc6XG4gICAgICBjYXNlICdocmVmJzpcbiAgICAgIGNhc2UgJ3gyJzpcbiAgICAgIGNhc2UgJ3kyJzpcblxuICAgICAgY2FzZSAnbGF0aXR1ZGUnOlxuICAgICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICAgIGNhc2UgJ2xhdGl0dWRlMic6XG4gICAgICBjYXNlICdsb25naXR1ZGUyJzpcbiAgICAgIC8vIFRPRE86IGNhc2UgJ2N1cnNvcic6XG5cbiAgICAgIC8vIHRleHQsIHNoYXBlLCBzaG91bGRuJ3QgYmUgYSBwYXJ0IG9mIGxpbmUvdHJhaWwvYXJlYVxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICBjYXNlICdzaGFwZSc6XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuXG4gICAgICBjYXNlICdkZXRhaWwnOlxuICAgICAgY2FzZSAna2V5JzpcbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICAgIChpc0FycmF5KGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZiA6IFtjaGFubmVsRGVmXSkuZm9yRWFjaCgoZmllbGREZWYpID0+IHtcbiAgICAgICAgICAgIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuXG4gICAgICBjYXNlICdzaXplJzpcbiAgICAgICAgaWYgKG1hcmsgPT09ICd0cmFpbCcpIHtcbiAgICAgICAgICAvLyBGb3IgdHJhaWwsIHNpemUgc2hvdWxkIG5vdCBncm91cCB0cmFpbCBsaW5lcy5cbiAgICAgICAgICByZXR1cm4gZGV0YWlscztcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3IgbGluZSwgaXQgc2hvdWxkIGdyb3VwIGxpbmVzLlxuXG4gICAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuICAgICAgLy8gaW50ZW50aW9uYWwgZmFsbCB0aHJvdWdoXG5cbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgY2FzZSAnc3Ryb2tlJzpcbiAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgLy8gVE9ETyBzdHJva2VEYXNoT2Zmc2V0OlxuXG4gICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWY8c3RyaW5nPihlbmNvZGluZ1tjaGFubmVsXSk7XG4gICAgICAgIGlmIChmaWVsZERlZiAmJiAhZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKHZnRmllbGQoZmllbGREZWYsIHt9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEJ1ZzogQ2hhbm5lbCAke2NoYW5uZWx9IHVuaW1wbGVtZW50ZWQgZm9yIGxpbmUgbWFya2ApO1xuICAgIH1cbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIElmIHNjYWxlcyBhcmUgYm91bmQgdG8gaW50ZXJ2YWwgc2VsZWN0aW9ucywgd2Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IGNsaXBcbiAqIG1hcmtzIHRvIGFjY291bnQgZm9yIHBhbm5pbmcvem9vbWluZyBpbnRlcmFjdGlvbnMuIFdlIGlkZW50aWZ5IGJvdW5kIHNjYWxlc1xuICogYnkgdGhlIGRvbWFpblJhdyBwcm9wZXJ0eSwgd2hpY2ggZ2V0cyBhZGRlZCBkdXJpbmcgc2NhbGUgcGFyc2luZy5cbiAqL1xuZnVuY3Rpb24gc2NhbGVDbGlwKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgeFNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgY29uc3QgeVNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKTtcbiAgcmV0dXJuICh4U2NhbGUgJiYgeFNjYWxlLmdldCgnZG9tYWluUmF3JykpIHx8XG4gICAgKHlTY2FsZSAmJiB5U2NhbGUuZ2V0KCdkb21haW5SYXcnKSkgPyB0cnVlIDogZmFsc2U7XG59XG4iXX0=