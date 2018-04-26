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
    if (model.channelHasField('order') && !model.stack) {
        // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
        return common_1.sortParams(model.encoding.order, { expr: 'datum' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMsbUNBQWdDO0FBQ2hDLDJDQUFxRDtBQUNyRCwyQ0FBb0Q7QUFDcEQsbUNBQStEO0FBQy9ELG1DQUF1QztBQUN2QyxtQ0FBMEM7QUFDMUMsb0NBQWdEO0FBRWhELCtCQUE0QjtBQUM1Qiw2QkFBMEI7QUFFMUIsdUNBQW9DO0FBQ3BDLCtCQUFtQztBQUNuQyxpQ0FBOEM7QUFDOUMsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBRzVCLElBQU0sWUFBWSxHQUFnQztJQUNoRCxJQUFJLGFBQUE7SUFDSixHQUFHLFdBQUE7SUFDSCxNQUFNLGdCQUFBO0lBQ04sUUFBUSxxQkFBQTtJQUNSLElBQUksYUFBQTtJQUNKLEtBQUssZUFBQTtJQUNMLElBQUksYUFBQTtJQUNKLElBQUksYUFBQTtJQUNKLE1BQU0sZ0JBQUE7SUFDTixJQUFJLGFBQUE7SUFDSixJQUFJLGFBQUE7SUFDSixLQUFLLGNBQUE7Q0FDTixDQUFDO0FBRUYsd0JBQStCLEtBQWdCO0lBQzdDLElBQUksZUFBUSxDQUFDLENBQUMsV0FBSSxFQUFFLFdBQUksRUFBRSxZQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDN0MsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7U0FBTTtRQUNMLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO0FBQ0gsQ0FBQztBQU5ELHdDQU1DO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFFNUMsdUJBQXVCLEtBQWdCO0lBQ3JDLElBQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFD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QUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4QyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge01BSU59IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtFbmNvZGluZywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7Z2V0RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgaXNQYXRoTWFyaywgTElORSwgTWFyaywgVFJBSUx9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtpc1NvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2NvbnRhaW5zLCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Z2V0U3R5bGVzLCBzb3J0UGFyYW1zfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHthcmVhfSBmcm9tICcuL2FyZWEnO1xuaW1wb3J0IHtiYXJ9IGZyb20gJy4vYmFyJztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtnZW9zaGFwZX0gZnJvbSAnLi9nZW9zaGFwZSc7XG5pbXBvcnQge2xpbmUsIHRyYWlsfSBmcm9tICcuL2xpbmUnO1xuaW1wb3J0IHtjaXJjbGUsIHBvaW50LCBzcXVhcmV9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHtyZWN0fSBmcm9tICcuL3JlY3QnO1xuaW1wb3J0IHtydWxlfSBmcm9tICcuL3J1bGUnO1xuaW1wb3J0IHt0ZXh0fSBmcm9tICcuL3RleHQnO1xuaW1wb3J0IHt0aWNrfSBmcm9tICcuL3RpY2snO1xuXG5cbmNvbnN0IG1hcmtDb21waWxlcjoge1ttIGluIE1hcmtdOiBNYXJrQ29tcGlsZXJ9ID0ge1xuICBhcmVhLFxuICBiYXIsXG4gIGNpcmNsZSxcbiAgZ2Vvc2hhcGUsXG4gIGxpbmUsXG4gIHBvaW50LFxuICByZWN0LFxuICBydWxlLFxuICBzcXVhcmUsXG4gIHRleHQsXG4gIHRpY2ssXG4gIHRyYWlsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNYXJrR3JvdXAobW9kZWw6IFVuaXRNb2RlbCk6IGFueVtdIHtcbiAgaWYgKGNvbnRhaW5zKFtMSU5FLCBBUkVBLCBUUkFJTF0sIG1vZGVsLm1hcmspKSB7XG4gICAgcmV0dXJuIHBhcnNlUGF0aE1hcmsobW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRNYXJrR3JvdXBzKG1vZGVsKTtcbiAgfVxufVxuXG5jb25zdCBGQUNFVEVEX1BBVEhfUFJFRklYID0gJ2ZhY2V0ZWRfcGF0aF8nO1xuXG5mdW5jdGlvbiBwYXJzZVBhdGhNYXJrKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgZGV0YWlscyA9IHBhdGhHcm91cGluZ0ZpZWxkcyhtb2RlbC5tYXJrLCBtb2RlbC5lbmNvZGluZyk7XG5cbiAgY29uc3QgcGF0aE1hcmtzID0gZ2V0TWFya0dyb3Vwcyhtb2RlbCwge1xuICAgIC8vIElmIGhhcyBzdWJmYWNldCBmb3IgbGluZS9hcmVhIGdyb3VwLCBuZWVkIHRvIHVzZSBmYWNldGVkIGRhdGEgZnJvbSBiZWxvdy5cbiAgICBmcm9tUHJlZml4OiAoZGV0YWlscy5sZW5ndGggPiAwID8gRkFDRVRFRF9QQVRIX1BSRUZJWCA6ICcnKVxuICB9KTtcblxuICBpZiAoZGV0YWlscy5sZW5ndGggPiAwKSB7IC8vIGhhdmUgbGV2ZWwgb2YgZGV0YWlscyAtIG5lZWQgdG8gZmFjZXQgbGluZSBpbnRvIHN1Ymdyb3Vwc1xuICAgIC8vIFRPRE86IGZvciBub24tc3RhY2tlZCBwbG90LCBtYXAgb3JkZXIgdG8gemluZGV4LiAoTWF5YmUgcmVuYW1lIG9yZGVyIGZvciBsYXllciB0byB6aW5kZXg/KVxuXG4gICAgcmV0dXJuIFt7XG4gICAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdwYXRoZ3JvdXAnKSxcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICBmcm9tOiB7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgbmFtZTogRkFDRVRFRF9QQVRIX1BSRUZJWCArIG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZ3JvdXBieTogZGV0YWlscyxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVuY29kZToge1xuICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICB3aWR0aDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSxcbiAgICAgICAgICBoZWlnaHQ6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtYXJrczogcGF0aE1hcmtzXG4gICAgfV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGhNYXJrcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoJ29yZGVyJykgJiYgIW1vZGVsLnN0YWNrKSB7XG4gICAgLy8gU29ydCBieSB0aGUgb3JkZXIgZmllbGQgaWYgaXQgaXMgc3BlY2lmaWVkIGFuZCB0aGUgZmllbGQgaXMgbm90IHN0YWNrZWQuIChGb3Igc3RhY2tlZCBmaWVsZCwgb3JkZXIgc3BlY2lmeSBzdGFjayBvcmRlci4pXG4gICAgcmV0dXJuIHNvcnRQYXJhbXMobW9kZWwuZW5jb2Rpbmcub3JkZXIsIHtleHByOiAnZGF0dW0nfSk7XG4gIH0gZWxzZSBpZiAoaXNQYXRoTWFyayhtb2RlbC5tYXJrKSkge1xuICAgIC8vIEZvciBib3RoIGxpbmUgYW5kIGFyZWEsIHdlIHNvcnQgdmFsdWVzIGJhc2VkIG9uIGRpbWVuc2lvbiBieSBkZWZhdWx0XG4gICAgY29uc3QgZGltZW5zaW9uQ2hhbm5lbDogJ3gnIHwgJ3knID0gbW9kZWwubWFya0RlZi5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd5JyA6ICd4JztcbiAgICBjb25zdCBzID0gbW9kZWwuc29ydChkaW1lbnNpb25DaGFubmVsKTtcbiAgICBjb25zdCBzb3J0RmllbGQgPSBpc1NvcnRGaWVsZChzKSA/XG4gICAgICB2Z0ZpZWxkKHtcbiAgICAgICAgLy8gRklYTUU6IHRoaXMgb3AgbWlnaHQgbm90IGFscmVhZHkgZXhpc3Q/XG4gICAgICAgIC8vIEZJWE1FOiB3aGF0IGlmIGRpbWVuc2lvbkNoYW5uZWwgKHggb3IgeSkgY29udGFpbnMgY3VzdG9tIGRvbWFpbj9cbiAgICAgICAgYWdncmVnYXRlOiBpc0FnZ3JlZ2F0ZShtb2RlbC5lbmNvZGluZykgPyBzLm9wIDogdW5kZWZpbmVkLFxuICAgICAgICBmaWVsZDogcy5maWVsZFxuICAgICAgfSwge2V4cHI6ICdkYXR1bSd9KSA6XG4gICAgICBtb2RlbC52Z0ZpZWxkKGRpbWVuc2lvbkNoYW5uZWwsIHtcbiAgICAgICAgLy8gRm9yIHN0YWNrIHdpdGggaW1wdXRhdGlvbiwgd2Ugb25seSBoYXZlIGJpbl9taWRcbiAgICAgICAgYmluU3VmZml4OiBtb2RlbC5zdGFjayAmJiBtb2RlbC5zdGFjay5pbXB1dGUgPyAnbWlkJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgZXhwcjogJ2RhdHVtJ1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gc29ydEZpZWxkID9cbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IHNvcnRGaWVsZCxcbiAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgICAgfSA6XG4gICAgICB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZ2V0TWFya0dyb3Vwcyhtb2RlbDogVW5pdE1vZGVsLCBvcHQ6IHtcbiAgZnJvbVByZWZpeDogc3RyaW5nXG59ID0ge2Zyb21QcmVmaXg6ICcnfSkge1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaztcblxuICBjb25zdCBjbGlwID0gbW9kZWwubWFya0RlZi5jbGlwICE9PSB1bmRlZmluZWQgP1xuICAgICEhbW9kZWwubWFya0RlZi5jbGlwIDogc2NhbGVDbGlwKG1vZGVsKTtcbiAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZXMobW9kZWwubWFya0RlZik7XG4gIGNvbnN0IGtleSA9IG1vZGVsLmVuY29kaW5nLmtleTtcbiAgY29uc3Qgc29ydCA9IGdldFNvcnQobW9kZWwpO1xuXG4gIGNvbnN0IHBvc3RFbmNvZGluZ1RyYW5zZm9ybSA9IG1hcmtDb21waWxlclttYXJrXS5wb3N0RW5jb2RpbmdUcmFuc2Zvcm0gPyBtYXJrQ29tcGlsZXJbbWFya10ucG9zdEVuY29kaW5nVHJhbnNmb3JtKG1vZGVsKSA6IG51bGw7XG5cbiAgcmV0dXJuIFt7XG4gICAgbmFtZTogbW9kZWwuZ2V0TmFtZSgnbWFya3MnKSxcbiAgICB0eXBlOiBtYXJrQ29tcGlsZXJbbWFya10udmdNYXJrLFxuICAgIC4uLihjbGlwID8ge2NsaXA6IHRydWV9IDoge30pLFxuICAgIC4uLihzdHlsZSA/IHtzdHlsZX0gOiB7fSksXG4gICAgLi4uKGtleSA/IHtrZXk6IHtmaWVsZDoga2V5LmZpZWxkfX0gOiB7fSksXG4gICAgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSksXG4gICAgZnJvbToge2RhdGE6IG9wdC5mcm9tUHJlZml4ICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pfSxcbiAgICBlbmNvZGU6IHtcbiAgICAgIHVwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLmVuY29kZUVudHJ5KG1vZGVsKVxuICAgIH0sXG4gICAgLi4uKHBvc3RFbmNvZGluZ1RyYW5zZm9ybSA/IHtcbiAgICAgIHRyYW5zZm9ybTogcG9zdEVuY29kaW5nVHJhbnNmb3JtXG4gICAgfSA6IHt9KVxuICB9XTtcblxufVxuXG4vKipcbiAqIFJldHVybnMgbGlzdCBvZiBwYXRoIGdyb3VwaW5nIGZpZWxkc1xuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aEdyb3VwaW5nRmllbGRzKG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogc3RyaW5nW10ge1xuICByZXR1cm4ga2V5cyhlbmNvZGluZykucmVkdWNlKChkZXRhaWxzLCBjaGFubmVsKSA9PiB7XG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICAvLyB4LCB5LCB4MiwgeTIsIGxhdCwgbG9uZywgbGF0MSwgbG9uZzIsIG9yZGVyLCB0b29sdGlwLCBocmVmLCBjdXJzb3Igc2hvdWxkIG5vdCBjYXVzZSBsaW5lcyB0byBncm91cFxuICAgICAgY2FzZSAneCc6XG4gICAgICBjYXNlICd5JzpcbiAgICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgICAgY2FzZSAnaHJlZic6XG4gICAgICBjYXNlICd4Mic6XG4gICAgICBjYXNlICd5Mic6XG5cbiAgICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICAgIGNhc2UgJ2xvbmdpdHVkZSc6XG4gICAgICBjYXNlICdsYXRpdHVkZTInOlxuICAgICAgY2FzZSAnbG9uZ2l0dWRlMic6XG4gICAgICAvLyBUT0RPOiBjYXNlICdjdXJzb3InOlxuXG4gICAgICAvLyB0ZXh0LCBzaGFwZSwgc2hvdWxkbid0IGJlIGEgcGFydCBvZiBsaW5lL3RyYWlsL2FyZWFcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICByZXR1cm4gZGV0YWlscztcblxuICAgICAgY2FzZSAnZGV0YWlsJzpcbiAgICAgIGNhc2UgJ2tleSc6XG4gICAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgICAgaWYgKGNoYW5uZWxEZWYpIHtcbiAgICAgICAgICAoaXNBcnJheShjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYgOiBbY2hhbm5lbERlZl0pLmZvckVhY2goKGZpZWxkRGVmKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgICAgICBkZXRhaWxzLnB1c2godmdGaWVsZChmaWVsZERlZiwge30pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV0YWlscztcblxuICAgICAgY2FzZSAnc2l6ZSc6XG4gICAgICAgIGlmIChtYXJrID09PSAndHJhaWwnKSB7XG4gICAgICAgICAgLy8gRm9yIHRyYWlsLCBzaXplIHNob3VsZCBub3QgZ3JvdXAgdHJhaWwgbGluZXMuXG4gICAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yIGxpbmUsIGl0IHNob3VsZCBncm91cCBsaW5lcy5cblxuICAgICAgLyogdHNsaW50OmRpc2FibGUgKi9cbiAgICAgIC8vIGludGVudGlvbmFsIGZhbGwgdGhyb3VnaFxuXG4gICAgICBjYXNlICdjb2xvcic6XG4gICAgICBjYXNlICdmaWxsJzpcbiAgICAgIGNhc2UgJ3N0cm9rZSc6XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgIC8vIFRPRE8gc3Ryb2tlRGFzaE9mZnNldDpcblxuICAgICAgLyogdHNsaW50OmVuYWJsZSAqL1xuICAgICAgICBjb25zdCBmaWVsZERlZiA9IGdldEZpZWxkRGVmPHN0cmluZz4oZW5jb2RpbmdbY2hhbm5lbF0pO1xuICAgICAgICBpZiAoZmllbGREZWYgJiYgIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBCdWc6IENoYW5uZWwgJHtjaGFubmVsfSB1bmltcGxlbWVudGVkIGZvciBsaW5lIG1hcmtgKTtcbiAgICB9XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBJZiBzY2FsZXMgYXJlIGJvdW5kIHRvIGludGVydmFsIHNlbGVjdGlvbnMsIHdlIHdhbnQgdG8gYXV0b21hdGljYWxseSBjbGlwXG4gKiBtYXJrcyB0byBhY2NvdW50IGZvciBwYW5uaW5nL3pvb21pbmcgaW50ZXJhY3Rpb25zLiBXZSBpZGVudGlmeSBib3VuZCBzY2FsZXNcbiAqIGJ5IHRoZSBkb21haW5SYXcgcHJvcGVydHksIHdoaWNoIGdldHMgYWRkZWQgZHVyaW5nIHNjYWxlIHBhcnNpbmcuXG4gKi9cbmZ1bmN0aW9uIHNjYWxlQ2xpcChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5Jyk7XG4gIHJldHVybiAoeFNjYWxlICYmIHhTY2FsZS5nZXQoJ2RvbWFpblJhdycpKSB8fFxuICAgICh5U2NhbGUgJiYgeVNjYWxlLmdldCgnZG9tYWluUmF3JykpID8gdHJ1ZSA6IGZhbHNlO1xufVxuIl19