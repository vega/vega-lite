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
    square: point_1.square
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
    var clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);
    var style = common_1.getStyles(model.markDef);
    var sort = getPathSort(model);
    var pathMarks = [
        __assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), (sort ? { sort: sort } : {}), { 
            // If has subfacet for line/area group, need to use faceted data from below.
            // FIXME: support sorting path order (in connected scatterplot)
            from: { data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + model.requestDataName(data_1.MAIN) }, encode: { update: markCompiler[mark].encodeEntry(model) } })
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
            fielddef_1.field({
                // FIXME: this op might not already exist?
                // FIXME: what if dimensionChannel (x or y) contains custom domain?
                aggregate: encoding_1.isAggregate(model.encoding) ? s.op : undefined,
                field: s.field
            }, { expr: 'datum' }) :
            model.field(dimensionChannel, {
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
    var marks = []; // TODO: vgMarks
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
    marks.push(__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), { from: { data: model.requestDataName(data_1.MAIN) }, encode: { update: markCompiler[mark].encodeEntry(model) } }));
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
            case 'x2':
            case 'y2':
            // TODO: case 'href', 'cursor':
            // text, shape, shouldn't be a part of line/area
            case 'text':
            case 'shape':
                return details;
            case 'detail':
                var channelDef = encoding[channel];
                if (channelDef) {
                    (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                        if (!fieldDef.aggregate) {
                            details.push(fielddef_1.field(fieldDef, {}));
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
                    details.push(fielddef_1.field(fieldDef, {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdUNBQWtDO0FBQ2xDLG1DQUFnQztBQUNoQywyQ0FBcUQ7QUFDckQsMkNBQWtEO0FBQ2xELG1DQUFzQztBQUN0QyxtQ0FBdUM7QUFDdkMsbUNBQTBDO0FBQzFDLG9DQUFnRDtBQUVoRCwrQkFBNEI7QUFDNUIsNkJBQTBCO0FBRTFCLCtCQUE0QjtBQUM1QixpQ0FBOEM7QUFDOUMsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBRzVCLElBQU0sWUFBWSxHQUFtQztJQUNuRCxJQUFJLEVBQUUsV0FBSTtJQUNWLEdBQUcsRUFBRSxTQUFHO0lBQ1IsSUFBSSxFQUFFLFdBQUk7SUFDVixLQUFLLEVBQUUsYUFBSztJQUNaLElBQUksRUFBRSxXQUFJO0lBQ1YsSUFBSSxFQUFFLFdBQUk7SUFDVixJQUFJLEVBQUUsV0FBSTtJQUNWLElBQUksRUFBRSxXQUFJO0lBQ1YsTUFBTSxFQUFFLGNBQU07SUFDZCxNQUFNLEVBQUUsY0FBTTtDQUNmLENBQUM7QUFHRix3QkFBK0IsS0FBZ0I7SUFDN0MsRUFBRSxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsV0FBSSxFQUFFLFdBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0FBQ0gsQ0FBQztBQU5ELHdDQU1DO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFFNUMsdUJBQXVCLEtBQWdCO0lBQ3JDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixJQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4RixJQUFNLEtBQUssR0FBRyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFaEMsSUFBTSxTQUFTLEdBQVE7bUJBRW5CLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUM1QixJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFDNUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDMUIsQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3JCLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN0Qiw0RUFBNEU7WUFDNUUsK0RBQStEO1lBQy9ELElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUMsRUFBQyxFQUMzRixNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQztLQUUxRCxDQUFDO0lBRUYsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLDZGQUE2RjtRQUU3RixNQUFNLENBQUMsQ0FBQztnQkFDTixJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ2hDLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsV0FBSSxDQUFDO3dCQUN2RCxJQUFJLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUM7d0JBQ2pDLE9BQU8sRUFBRSxPQUFPO3FCQUNqQjtpQkFDRjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQzt3QkFDaEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDO3FCQUNuQztpQkFDRjtnQkFDRCxLQUFLLEVBQUUsU0FBUzthQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBRUQscUJBQTRCLEtBQWdCO0lBQzFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsNkRBQTZEO1FBQzdELE1BQU0sQ0FBQyxtQkFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sdUVBQXVFO1FBQ3ZFLElBQU0sZ0JBQWdCLEdBQWMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN0RixJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdkMsSUFBTSxTQUFTLEdBQUcsa0JBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLGdCQUFLLENBQUM7Z0JBQ0osMENBQTBDO2dCQUMxQyxtRUFBbUU7Z0JBQ25FLFNBQVMsRUFBRSxzQkFBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDekQsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO2FBQ2YsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDNUIsa0RBQWtEO2dCQUNsRCxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNoRSxJQUFJLEVBQUUsT0FBTzthQUNkLENBQUMsQ0FBQztRQUVMLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQjtnQkFDRSxLQUFLLEVBQUUsU0FBUztnQkFDaEIsS0FBSyxFQUFFLFlBQVk7YUFDcEIsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUE1QkQsa0NBNEJDO0FBRUQsMEJBQTBCLEtBQWdCO0lBQ3hDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUxQixJQUFNLEtBQUssR0FBRyxrQkFBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXhGLElBQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQjtJQUV6Qyw2RkFBNkY7SUFFN0YsS0FBSyxDQUFDLElBQUksWUFDUixJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFDNUIsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQzVCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFCLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUN4QixJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUMsRUFBQyxFQUN6QyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxJQUN2RCxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRDs7O0dBR0c7QUFDSCw0QkFBbUMsUUFBMEI7SUFDM0QsTUFBTSxDQUFDLFdBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsT0FBTztRQUM1QyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLDZFQUE2RTtZQUM3RSxLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLFNBQVMsQ0FBQztZQUNmLEtBQUssSUFBSSxDQUFDO1lBQ1YsS0FBSyxJQUFJLENBQUM7WUFDViwrQkFBK0I7WUFFL0IsZ0RBQWdEO1lBQ2hELEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxPQUFPO2dCQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFFakIsS0FBSyxRQUFRO2dCQUNYLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDZixDQUFDLG1CQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7d0JBQ2pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDakIsS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssU0FBUztnQkFDZCx5QkFBeUI7Z0JBQ3ZCLElBQU0sUUFBUSxHQUFHLHNCQUFXLENBQVMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNqQjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFnQixPQUFPLGlDQUE4QixDQUFDLENBQUM7UUFDM0UsQ0FBQztJQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUF4Q0QsZ0RBd0NDO0FBRUQ7Ozs7R0FJRztBQUNILG1CQUFtQixLQUFnQjtJQUNqQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7TUFJTn0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0VuY29kaW5nLCBpc0FnZ3JlZ2F0ZX0gZnJvbSAnLi4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtmaWVsZCwgZ2V0RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgTElORX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2lzU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRTdHlsZXMsIHNvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9iYXInO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2xpbmV9IGZyb20gJy4vbGluZSc7XG5pbXBvcnQge2NpcmNsZSwgcG9pbnQsIHNxdWFyZX0gZnJvbSAnLi9wb2ludCc7XG5pbXBvcnQge3JlY3R9IGZyb20gJy4vcmVjdCc7XG5pbXBvcnQge3J1bGV9IGZyb20gJy4vcnVsZSc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4vdGV4dCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4vdGljayc7XG5cblxuY29uc3QgbWFya0NvbXBpbGVyOiB7W3R5cGU6IHN0cmluZ106IE1hcmtDb21waWxlcn0gPSB7XG4gIGFyZWE6IGFyZWEsXG4gIGJhcjogYmFyLFxuICBsaW5lOiBsaW5lLFxuICBwb2ludDogcG9pbnQsXG4gIHRleHQ6IHRleHQsXG4gIHRpY2s6IHRpY2ssXG4gIHJlY3Q6IHJlY3QsXG4gIHJ1bGU6IHJ1bGUsXG4gIGNpcmNsZTogY2lyY2xlLFxuICBzcXVhcmU6IHNxdWFyZVxufTtcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNYXJrR3JvdXAobW9kZWw6IFVuaXRNb2RlbCk6IGFueVtdIHtcbiAgaWYgKGNvbnRhaW5zKFtMSU5FLCBBUkVBXSwgbW9kZWwubWFyaygpKSkge1xuICAgIHJldHVybiBwYXJzZVBhdGhNYXJrKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGFyc2VOb25QYXRoTWFyayhtb2RlbCk7XG4gIH1cbn1cblxuY29uc3QgRkFDRVRFRF9QQVRIX1BSRUZJWCA9ICdmYWNldGVkX3BhdGhfJztcblxuZnVuY3Rpb24gcGFyc2VQYXRoTWFyayhtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG4gIGNvbnN0IGRldGFpbHMgPSBwYXRoR3JvdXBpbmdGaWVsZHMobW9kZWwuZW5jb2RpbmcpO1xuXG4gIGNvbnN0IGNsaXAgPSBtb2RlbC5tYXJrRGVmLmNsaXAgIT09IHVuZGVmaW5lZCA/ICEhbW9kZWwubWFya0RlZi5jbGlwIDogc2NhbGVDbGlwKG1vZGVsKTtcbiAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZXMobW9kZWwubWFya0RlZik7XG4gIGNvbnN0IHNvcnQgPSBnZXRQYXRoU29ydChtb2RlbCk7XG5cbiAgY29uc3QgcGF0aE1hcmtzOiBhbnkgPSBbXG4gICAge1xuICAgICAgbmFtZTogbW9kZWwuZ2V0TmFtZSgnbWFya3MnKSxcbiAgICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgICAuLi4oY2xpcCA/IHtjbGlwOiB0cnVlfSA6IHt9KSxcbiAgICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICAgIC4uLihzb3J0PyB7c29ydH0gOiB7fSksXG4gICAgICAvLyBJZiBoYXMgc3ViZmFjZXQgZm9yIGxpbmUvYXJlYSBncm91cCwgbmVlZCB0byB1c2UgZmFjZXRlZCBkYXRhIGZyb20gYmVsb3cuXG4gICAgICAvLyBGSVhNRTogc3VwcG9ydCBzb3J0aW5nIHBhdGggb3JkZXIgKGluIGNvbm5lY3RlZCBzY2F0dGVycGxvdClcbiAgICAgIGZyb206IHtkYXRhOiAoZGV0YWlscy5sZW5ndGggPiAwID8gRkFDRVRFRF9QQVRIX1BSRUZJWCA6ICcnKSArIG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKX0sXG4gICAgICBlbmNvZGU6IHt1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5lbmNvZGVFbnRyeShtb2RlbCl9XG4gICAgfVxuICBdO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgLy8gVE9ETzogZm9yIG5vbi1zdGFja2VkIHBsb3QsIG1hcCBvcmRlciB0byB6aW5kZXguIChNYXliZSByZW5hbWUgb3JkZXIgZm9yIGxheWVyIHRvIHppbmRleD8pXG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ3BhdGhncm91cCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBGQUNFVEVEX1BBVEhfUFJFRklYICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBncm91cGJ5OiBkZXRhaWxzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcmtzOiBwYXRoTWFya3NcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGF0aE1hcmtzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXRoU29ydChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGlmIChtb2RlbC5tYXJrKCkgPT09ICdsaW5lJyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ29yZGVyJykpIHtcbiAgICAvLyBGb3Igb25seSBsaW5lLCBzb3J0IGJ5IHRoZSBvcmRlciBmaWVsZCBpZiBpdCBpcyBzcGVjaWZpZWQuXG4gICAgcmV0dXJuIHNvcnRQYXJhbXMobW9kZWwuZW5jb2Rpbmcub3JkZXIsIHtleHByOiAnZGF0dW0nfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICBjb25zdCBkaW1lbnNpb25DaGFubmVsOiAneCcgfCAneScgPSBtb2RlbC5tYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IHMgPSBtb2RlbC5zb3J0KGRpbWVuc2lvbkNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnRGaWVsZCA9IGlzU29ydEZpZWxkKHMpID9cbiAgICAgIGZpZWxkKHtcbiAgICAgICAgLy8gRklYTUU6IHRoaXMgb3AgbWlnaHQgbm90IGFscmVhZHkgZXhpc3Q/XG4gICAgICAgIC8vIEZJWE1FOiB3aGF0IGlmIGRpbWVuc2lvbkNoYW5uZWwgKHggb3IgeSkgY29udGFpbnMgY3VzdG9tIGRvbWFpbj9cbiAgICAgICAgYWdncmVnYXRlOiBpc0FnZ3JlZ2F0ZShtb2RlbC5lbmNvZGluZykgPyBzLm9wIDogdW5kZWZpbmVkLFxuICAgICAgICBmaWVsZDogcy5maWVsZFxuICAgICAgfSwge2V4cHI6ICdkYXR1bSd9KSA6XG4gICAgICBtb2RlbC5maWVsZChkaW1lbnNpb25DaGFubmVsLCB7XG4gICAgICAgIC8vIEZvciBzdGFjayB3aXRoIGltcHV0YXRpb24sIHdlIG9ubHkgaGF2ZSBiaW5fbWlkXG4gICAgICAgIGJpblN1ZmZpeDogbW9kZWwuc3RhY2sgJiYgbW9kZWwuc3RhY2suaW1wdXRlID8gJ21pZCcgOiB1bmRlZmluZWQsXG4gICAgICAgIGV4cHI6ICdkYXR1bSdcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHNvcnRGaWVsZCA/XG4gICAgICB7XG4gICAgICAgIGZpZWxkOiBzb3J0RmllbGQsXG4gICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICAgIH0gOlxuICAgICAgdW5kZWZpbmVkO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uUGF0aE1hcmsobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuXG4gIGNvbnN0IHN0eWxlID0gZ2V0U3R5bGVzKG1vZGVsLm1hcmtEZWYpO1xuICBjb25zdCBjbGlwID0gbW9kZWwubWFya0RlZi5jbGlwICE9PSB1bmRlZmluZWQgPyAhIW1vZGVsLm1hcmtEZWYuY2xpcCA6IHNjYWxlQ2xpcChtb2RlbCk7XG5cbiAgY29uc3QgbWFya3M6IGFueVtdID0gW107IC8vIFRPRE86IHZnTWFya3NcblxuICAvLyBUT0RPOiBmb3Igbm9uLXN0YWNrZWQgcGxvdCwgbWFwIG9yZGVyIHRvIHppbmRleC4gKE1heWJlIHJlbmFtZSBvcmRlciBmb3IgbGF5ZXIgdG8gemluZGV4PylcblxuICBtYXJrcy5wdXNoKHtcbiAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdtYXJrcycpLFxuICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgLi4uKGNsaXAgPyB7Y2xpcDogdHJ1ZX0gOiB7fSksXG4gICAgLi4uKHN0eWxlPyB7c3R5bGV9IDoge30pLFxuICAgIGZyb206IHtkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTil9LFxuICAgIGVuY29kZToge3VwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLmVuY29kZUVudHJ5KG1vZGVsKX1cbiAgfSk7XG5cbiAgcmV0dXJuIG1hcmtzO1xufVxuXG4vKipcbiAqIFJldHVybnMgbGlzdCBvZiBwYXRoIGdyb3VwaW5nIGZpZWxkc1xuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aEdyb3VwaW5nRmllbGRzKGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogc3RyaW5nW10ge1xuICByZXR1cm4ga2V5cyhlbmNvZGluZykucmVkdWNlKChkZXRhaWxzLCBjaGFubmVsKSA9PiB7XG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICAvLyB4LCB5LCB4MiwgeTIsIG9yZGVyLCB0b29sdGlwLCBocmVmLCBjdXJzb3Igc2hvdWxkIG5vdCBjYXVzZSBsaW5lcyB0byBncm91cFxuICAgICAgY2FzZSAneCc6XG4gICAgICBjYXNlICd5JzpcbiAgICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgICAgY2FzZSAneDInOlxuICAgICAgY2FzZSAneTInOlxuICAgICAgLy8gVE9ETzogY2FzZSAnaHJlZicsICdjdXJzb3InOlxuXG4gICAgICAvLyB0ZXh0LCBzaGFwZSwgc2hvdWxkbid0IGJlIGEgcGFydCBvZiBsaW5lL2FyZWFcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICByZXR1cm4gZGV0YWlscztcblxuICAgICAgY2FzZSAnZGV0YWlsJzpcbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICAgIChpc0FycmF5KGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZiA6IFtjaGFubmVsRGVmXSkuZm9yRWFjaCgoZmllbGREZWYpID0+IHtcbiAgICAgICAgICAgIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgICAgIGRldGFpbHMucHVzaChmaWVsZChmaWVsZERlZiwge30pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV0YWlscztcbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgIGNhc2UgJ3NpemUnOlxuICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAvLyBUT0RPIHN0cm9rZURhc2hPZmZzZXQ6XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWY8c3RyaW5nPihlbmNvZGluZ1tjaGFubmVsXSk7XG4gICAgICAgIGlmIChmaWVsZERlZiAmJiAhZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBCdWc6IENoYW5uZWwgJHtjaGFubmVsfSB1bmltcGxlbWVudGVkIGZvciBsaW5lIG1hcmtgKTtcbiAgICB9XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBJZiBzY2FsZXMgYXJlIGJvdW5kIHRvIGludGVydmFsIHNlbGVjdGlvbnMsIHdlIHdhbnQgdG8gYXV0b21hdGljYWxseSBjbGlwXG4gKiBtYXJrcyB0byBhY2NvdW50IGZvciBwYW5uaW5nL3pvb21pbmcgaW50ZXJhY3Rpb25zLiBXZSBpZGVudGlmeSBib3VuZCBzY2FsZXNcbiAqIGJ5IHRoZSBkb21haW5SYXcgcHJvcGVydHksIHdoaWNoIGdldHMgYWRkZWQgZHVyaW5nIHNjYWxlIHBhcnNpbmcuXG4gKi9cbmZ1bmN0aW9uIHNjYWxlQ2xpcChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5Jyk7XG4gIHJldHVybiAoeFNjYWxlICYmIHhTY2FsZS5nZXQoJ2RvbWFpblJhdycpKSB8fFxuICAgICh5U2NhbGUgJiYgeVNjYWxlLmdldCgnZG9tYWluUmF3JykpID8gdHJ1ZSA6IGZhbHNlO1xufVxuIl19