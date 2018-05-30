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
    var encoding = model.encoding, stack = model.stack, mark = model.mark, markDef = model.markDef;
    var order = encoding.order;
    if (!vega_util_1.isArray(order) && fielddef_1.isValueDef(order)) {
        return undefined;
    }
    else if ((vega_util_1.isArray(order) || fielddef_1.isFieldDef(order)) && !stack) {
        // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
        return common_1.sortParams(order, { expr: 'datum' });
    }
    else if (mark_1.isPathMark(mark)) {
        // For both line and area, we sort values based on dimension by default
        var dimensionChannelDef = encoding[markDef.orient === 'horizontal' ? 'y' : 'x'];
        if (fielddef_1.isFieldDef(dimensionChannelDef)) {
            var s = dimensionChannelDef.sort;
            var sortField = sort_1.isSortField(s) ?
                fielddef_1.vgField({
                    // FIXME: this op might not already exist?
                    // FIXME: what if dimensionChannel (x or y) contains custom domain?
                    aggregate: encoding_1.isAggregate(model.encoding) ? s.op : undefined,
                    field: s.field
                }, { expr: 'datum' }) :
                fielddef_1.vgField(dimensionChannelDef, {
                    // For stack with imputation, we only have bin_mid
                    binSuffix: model.stack && model.stack.impute ? 'mid' : undefined,
                    expr: 'datum'
                });
            return {
                field: sortField,
                order: 'descending'
            };
        }
        return undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMsbUNBQWdDO0FBQ2hDLDJDQUFxRDtBQUNyRCwyQ0FBNEU7QUFDNUUsbUNBQStEO0FBQy9ELG1DQUF1QztBQUN2QyxtQ0FBMEM7QUFDMUMsb0NBQWdEO0FBRWhELCtCQUE0QjtBQUM1Qiw2QkFBMEI7QUFFMUIsdUNBQW9DO0FBQ3BDLCtCQUFtQztBQUNuQyxpQ0FBOEM7QUFDOUMsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBRzVCLElBQU0sWUFBWSxHQUFnQztJQUNoRCxJQUFJLGFBQUE7SUFDSixHQUFHLFdBQUE7SUFDSCxNQUFNLGdCQUFBO0lBQ04sUUFBUSxxQkFBQTtJQUNSLElBQUksYUFBQTtJQUNKLEtBQUssZUFBQTtJQUNMLElBQUksYUFBQTtJQUNKLElBQUksYUFBQTtJQUNKLE1BQU0sZ0JBQUE7SUFDTixJQUFJLGFBQUE7SUFDSixJQUFJLGFBQUE7SUFDSixLQUFLLGNBQUE7Q0FDTixDQUFDO0FBRUYsd0JBQStCLEtBQWdCO0lBQzdDLElBQUksZUFBUSxDQUFDLENBQUMsV0FBSSxFQUFFLFdBQUksRUFBRSxZQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDN0MsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7U0FBTTtRQUNMLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO0FBQ0gsQ0FBQztBQU5ELHdDQU1DO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFFNUMsdUJBQXVCLEtBQWdCO0lBQ3JDLElBQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFD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O2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWdCLE9BQU8saUNBQThCLENBQUMsQ0FBQztTQUMxRTtJQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUE3REQsZ0RBNkRDO0FBRUQ7Ozs7R0FJRztBQUNILG1CQUFtQixLQUFnQjtJQUNqQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4QyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge01BSU59IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtFbmNvZGluZywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7Z2V0RmllbGREZWYsIGlzRmllbGREZWYsIGlzVmFsdWVEZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgaXNQYXRoTWFyaywgTElORSwgTWFyaywgVFJBSUx9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtpc1NvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2NvbnRhaW5zLCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Z2V0U3R5bGVzLCBzb3J0UGFyYW1zfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHthcmVhfSBmcm9tICcuL2FyZWEnO1xuaW1wb3J0IHtiYXJ9IGZyb20gJy4vYmFyJztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtnZW9zaGFwZX0gZnJvbSAnLi9nZW9zaGFwZSc7XG5pbXBvcnQge2xpbmUsIHRyYWlsfSBmcm9tICcuL2xpbmUnO1xuaW1wb3J0IHtjaXJjbGUsIHBvaW50LCBzcXVhcmV9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHtyZWN0fSBmcm9tICcuL3JlY3QnO1xuaW1wb3J0IHtydWxlfSBmcm9tICcuL3J1bGUnO1xuaW1wb3J0IHt0ZXh0fSBmcm9tICcuL3RleHQnO1xuaW1wb3J0IHt0aWNrfSBmcm9tICcuL3RpY2snO1xuXG5cbmNvbnN0IG1hcmtDb21waWxlcjoge1ttIGluIE1hcmtdOiBNYXJrQ29tcGlsZXJ9ID0ge1xuICBhcmVhLFxuICBiYXIsXG4gIGNpcmNsZSxcbiAgZ2Vvc2hhcGUsXG4gIGxpbmUsXG4gIHBvaW50LFxuICByZWN0LFxuICBydWxlLFxuICBzcXVhcmUsXG4gIHRleHQsXG4gIHRpY2ssXG4gIHRyYWlsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNYXJrR3JvdXAobW9kZWw6IFVuaXRNb2RlbCk6IGFueVtdIHtcbiAgaWYgKGNvbnRhaW5zKFtMSU5FLCBBUkVBLCBUUkFJTF0sIG1vZGVsLm1hcmspKSB7XG4gICAgcmV0dXJuIHBhcnNlUGF0aE1hcmsobW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRNYXJrR3JvdXBzKG1vZGVsKTtcbiAgfVxufVxuXG5jb25zdCBGQUNFVEVEX1BBVEhfUFJFRklYID0gJ2ZhY2V0ZWRfcGF0aF8nO1xuXG5mdW5jdGlvbiBwYXJzZVBhdGhNYXJrKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgZGV0YWlscyA9IHBhdGhHcm91cGluZ0ZpZWxkcyhtb2RlbC5tYXJrLCBtb2RlbC5lbmNvZGluZyk7XG5cbiAgY29uc3QgcGF0aE1hcmtzID0gZ2V0TWFya0dyb3Vwcyhtb2RlbCwge1xuICAgIC8vIElmIGhhcyBzdWJmYWNldCBmb3IgbGluZS9hcmVhIGdyb3VwLCBuZWVkIHRvIHVzZSBmYWNldGVkIGRhdGEgZnJvbSBiZWxvdy5cbiAgICBmcm9tUHJlZml4OiAoZGV0YWlscy5sZW5ndGggPiAwID8gRkFDRVRFRF9QQVRIX1BSRUZJWCA6ICcnKVxuICB9KTtcblxuICBpZiAoZGV0YWlscy5sZW5ndGggPiAwKSB7IC8vIGhhdmUgbGV2ZWwgb2YgZGV0YWlscyAtIG5lZWQgdG8gZmFjZXQgbGluZSBpbnRvIHN1Ymdyb3Vwc1xuICAgIC8vIFRPRE86IGZvciBub24tc3RhY2tlZCBwbG90LCBtYXAgb3JkZXIgdG8gemluZGV4LiAoTWF5YmUgcmVuYW1lIG9yZGVyIGZvciBsYXllciB0byB6aW5kZXg/KVxuXG4gICAgcmV0dXJuIFt7XG4gICAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdwYXRoZ3JvdXAnKSxcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICBmcm9tOiB7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgbmFtZTogRkFDRVRFRF9QQVRIX1BSRUZJWCArIG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZ3JvdXBieTogZGV0YWlscyxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVuY29kZToge1xuICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICB3aWR0aDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSxcbiAgICAgICAgICBoZWlnaHQ6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtYXJrczogcGF0aE1hcmtzXG4gICAgfV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGhNYXJrcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHtlbmNvZGluZywgc3RhY2ssIG1hcmssIG1hcmtEZWZ9ID0gbW9kZWw7XG4gIGNvbnN0IG9yZGVyID0gZW5jb2Rpbmcub3JkZXI7XG4gIGlmICghaXNBcnJheShvcmRlcikgJiYgaXNWYWx1ZURlZihvcmRlcikpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKChpc0FycmF5KG9yZGVyKSB8fCBpc0ZpZWxkRGVmKG9yZGVyKSkgJiYgIXN0YWNrKSB7XG4gICAgLy8gU29ydCBieSB0aGUgb3JkZXIgZmllbGQgaWYgaXQgaXMgc3BlY2lmaWVkIGFuZCB0aGUgZmllbGQgaXMgbm90IHN0YWNrZWQuIChGb3Igc3RhY2tlZCBmaWVsZCwgb3JkZXIgc3BlY2lmeSBzdGFjayBvcmRlci4pXG4gICAgcmV0dXJuIHNvcnRQYXJhbXMob3JkZXIsIHtleHByOiAnZGF0dW0nfSk7XG4gIH0gZWxzZSBpZiAoaXNQYXRoTWFyayhtYXJrKSkge1xuICAgIC8vIEZvciBib3RoIGxpbmUgYW5kIGFyZWEsIHdlIHNvcnQgdmFsdWVzIGJhc2VkIG9uIGRpbWVuc2lvbiBieSBkZWZhdWx0XG4gICAgY29uc3QgZGltZW5zaW9uQ2hhbm5lbERlZiA9IGVuY29kaW5nW21hcmtEZWYub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneScgOiAneCddO1xuICAgIGlmIChpc0ZpZWxkRGVmKGRpbWVuc2lvbkNoYW5uZWxEZWYpKSB7XG4gICAgICBjb25zdCBzID0gZGltZW5zaW9uQ2hhbm5lbERlZi5zb3J0O1xuICAgICAgY29uc3Qgc29ydEZpZWxkID0gaXNTb3J0RmllbGQocykgP1xuICAgICAgICB2Z0ZpZWxkKHtcbiAgICAgICAgICAvLyBGSVhNRTogdGhpcyBvcCBtaWdodCBub3QgYWxyZWFkeSBleGlzdD9cbiAgICAgICAgICAvLyBGSVhNRTogd2hhdCBpZiBkaW1lbnNpb25DaGFubmVsICh4IG9yIHkpIGNvbnRhaW5zIGN1c3RvbSBkb21haW4/XG4gICAgICAgICAgYWdncmVnYXRlOiBpc0FnZ3JlZ2F0ZShtb2RlbC5lbmNvZGluZykgPyBzLm9wIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGZpZWxkOiBzLmZpZWxkXG4gICAgICAgIH0sIHtleHByOiAnZGF0dW0nfSkgOlxuICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkNoYW5uZWxEZWYsIHtcbiAgICAgICAgICAvLyBGb3Igc3RhY2sgd2l0aCBpbXB1dGF0aW9uLCB3ZSBvbmx5IGhhdmUgYmluX21pZFxuICAgICAgICAgIGJpblN1ZmZpeDogbW9kZWwuc3RhY2sgJiYgbW9kZWwuc3RhY2suaW1wdXRlID8gJ21pZCcgOiB1bmRlZmluZWQsXG4gICAgICAgICAgZXhwcjogJ2RhdHVtJ1xuICAgICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmllbGQ6IHNvcnRGaWVsZCxcbiAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRNYXJrR3JvdXBzKG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge1xuICBmcm9tUHJlZml4OiBzdHJpbmdcbn0gPSB7ZnJvbVByZWZpeDogJyd9KSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrO1xuXG4gIGNvbnN0IGNsaXAgPSBtb2RlbC5tYXJrRGVmLmNsaXAgIT09IHVuZGVmaW5lZCA/XG4gICAgISFtb2RlbC5tYXJrRGVmLmNsaXAgOiBzY2FsZUNsaXAobW9kZWwpO1xuICBjb25zdCBzdHlsZSA9IGdldFN0eWxlcyhtb2RlbC5tYXJrRGVmKTtcbiAgY29uc3Qga2V5ID0gbW9kZWwuZW5jb2Rpbmcua2V5O1xuICBjb25zdCBzb3J0ID0gZ2V0U29ydChtb2RlbCk7XG5cbiAgY29uc3QgcG9zdEVuY29kaW5nVHJhbnNmb3JtID0gbWFya0NvbXBpbGVyW21hcmtdLnBvc3RFbmNvZGluZ1RyYW5zZm9ybSA/IG1hcmtDb21waWxlclttYXJrXS5wb3N0RW5jb2RpbmdUcmFuc2Zvcm0obW9kZWwpIDogbnVsbDtcblxuICByZXR1cm4gW3tcbiAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdtYXJrcycpLFxuICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgLi4uKGNsaXAgPyB7Y2xpcDogdHJ1ZX0gOiB7fSksXG4gICAgLi4uKHN0eWxlID8ge3N0eWxlfSA6IHt9KSxcbiAgICAuLi4oa2V5ID8ge2tleToge2ZpZWxkOiBrZXkuZmllbGR9fSA6IHt9KSxcbiAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KSxcbiAgICBmcm9tOiB7ZGF0YTogb3B0LmZyb21QcmVmaXggKyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTil9LFxuICAgIGVuY29kZToge1xuICAgICAgdXBkYXRlOiBtYXJrQ29tcGlsZXJbbWFya10uZW5jb2RlRW50cnkobW9kZWwpXG4gICAgfSxcbiAgICAuLi4ocG9zdEVuY29kaW5nVHJhbnNmb3JtID8ge1xuICAgICAgdHJhbnNmb3JtOiBwb3N0RW5jb2RpbmdUcmFuc2Zvcm1cbiAgICB9IDoge30pXG4gIH1dO1xuXG59XG5cbi8qKlxuICogUmV0dXJucyBsaXN0IG9mIHBhdGggZ3JvdXBpbmcgZmllbGRzXG4gKiB0aGF0IHRoZSBtb2RlbCdzIHNwZWMgY29udGFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXRoR3JvdXBpbmdGaWVsZHMobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBrZXlzKGVuY29kaW5nKS5yZWR1Y2UoKGRldGFpbHMsIGNoYW5uZWwpID0+IHtcbiAgICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICAgIC8vIHgsIHksIHgyLCB5MiwgbGF0LCBsb25nLCBsYXQxLCBsb25nMiwgb3JkZXIsIHRvb2x0aXAsIGhyZWYsIGN1cnNvciBzaG91bGQgbm90IGNhdXNlIGxpbmVzIHRvIGdyb3VwXG4gICAgICBjYXNlICd4JzpcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgY2FzZSAndG9vbHRpcCc6XG4gICAgICBjYXNlICdocmVmJzpcbiAgICAgIGNhc2UgJ3gyJzpcbiAgICAgIGNhc2UgJ3kyJzpcblxuICAgICAgY2FzZSAnbGF0aXR1ZGUnOlxuICAgICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICAgIGNhc2UgJ2xhdGl0dWRlMic6XG4gICAgICBjYXNlICdsb25naXR1ZGUyJzpcbiAgICAgIC8vIFRPRE86IGNhc2UgJ2N1cnNvcic6XG5cbiAgICAgIC8vIHRleHQsIHNoYXBlLCBzaG91bGRuJ3QgYmUgYSBwYXJ0IG9mIGxpbmUvdHJhaWwvYXJlYVxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICBjYXNlICdzaGFwZSc6XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuXG4gICAgICBjYXNlICdkZXRhaWwnOlxuICAgICAgY2FzZSAna2V5JzpcbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICAgIChpc0FycmF5KGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZiA6IFtjaGFubmVsRGVmXSkuZm9yRWFjaCgoZmllbGREZWYpID0+IHtcbiAgICAgICAgICAgIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuXG4gICAgICBjYXNlICdzaXplJzpcbiAgICAgICAgaWYgKG1hcmsgPT09ICd0cmFpbCcpIHtcbiAgICAgICAgICAvLyBGb3IgdHJhaWwsIHNpemUgc2hvdWxkIG5vdCBncm91cCB0cmFpbCBsaW5lcy5cbiAgICAgICAgICByZXR1cm4gZGV0YWlscztcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3IgbGluZSwgaXQgc2hvdWxkIGdyb3VwIGxpbmVzLlxuXG4gICAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuICAgICAgLy8gaW50ZW50aW9uYWwgZmFsbCB0aHJvdWdoXG5cbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgY2FzZSAnc3Ryb2tlJzpcbiAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgLy8gVE9ETyBzdHJva2VEYXNoT2Zmc2V0OlxuXG4gICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWY8c3RyaW5nPihlbmNvZGluZ1tjaGFubmVsXSk7XG4gICAgICAgIGlmIChmaWVsZERlZiAmJiAhZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKHZnRmllbGQoZmllbGREZWYsIHt9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEJ1ZzogQ2hhbm5lbCAke2NoYW5uZWx9IHVuaW1wbGVtZW50ZWQgZm9yIGxpbmUgbWFya2ApO1xuICAgIH1cbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIElmIHNjYWxlcyBhcmUgYm91bmQgdG8gaW50ZXJ2YWwgc2VsZWN0aW9ucywgd2Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IGNsaXBcbiAqIG1hcmtzIHRvIGFjY291bnQgZm9yIHBhbm5pbmcvem9vbWluZyBpbnRlcmFjdGlvbnMuIFdlIGlkZW50aWZ5IGJvdW5kIHNjYWxlc1xuICogYnkgdGhlIGRvbWFpblJhdyBwcm9wZXJ0eSwgd2hpY2ggZ2V0cyBhZGRlZCBkdXJpbmcgc2NhbGUgcGFyc2luZy5cbiAqL1xuZnVuY3Rpb24gc2NhbGVDbGlwKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgeFNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgY29uc3QgeVNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKTtcbiAgcmV0dXJuICh4U2NhbGUgJiYgeFNjYWxlLmdldCgnZG9tYWluUmF3JykpIHx8XG4gICAgKHlTY2FsZSAmJiB5U2NhbGUuZ2V0KCdkb21haW5SYXcnKSkgPyB0cnVlIDogZmFsc2U7XG59XG4iXX0=