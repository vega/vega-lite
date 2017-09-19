"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var data_1 = require("../../data");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
var model_1 = require("../model");
var area_1 = require("./area");
var bar_1 = require("./bar");
var init_1 = require("./init");
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
function parseMarkDef(model) {
    if (model_1.isUnitModel(model)) {
        init_1.normalizeMarkDef(model.markDef, model.encoding, model.component.scales, model.config);
    }
    else {
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            parseMarkDef(child);
        }
    }
}
exports.parseMarkDef = parseMarkDef;
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
    // FIXME: replace this with more general case for composition
    var details = detailFields(model);
    var clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);
    var style = common_1.getStyles(model.markDef);
    var sort = getPathSort(model);
    var pathMarks = [
        tslib_1.__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), (sort ? { sort: sort } : {}), { 
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
    marks.push(tslib_1.__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), { from: { data: model.requestDataName(data_1.MAIN) }, encode: { update: markCompiler[mark].encodeEntry(model) } }));
    return marks;
}
/**
 * Returns list of detail (group-by) fields
 * that the model's spec contains.
 */
function detailFields(model) {
    return channel_1.NONPOSITION_CHANNELS.reduce(function (details, channel) {
        var encoding = model.encoding;
        if (channel === 'order') {
            return details;
        }
        if (channel === 'detail') {
            var channelDef = encoding[channel];
            if (channelDef) {
                (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                    if (!fieldDef.aggregate) {
                        details.push(fielddef_1.field(fieldDef, {}));
                    }
                });
            }
        }
        else {
            var fieldDef = fielddef_1.getFieldDef(encoding[channel]);
            if (fieldDef && !fieldDef.aggregate) {
                details.push(fielddef_1.field(fieldDef, {}));
            }
        }
        return details;
    }, []);
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMseUNBQW1EO0FBQ25ELG1DQUFnQztBQUNoQywyQ0FBMkM7QUFDM0MsMkNBQWtEO0FBQ2xELG1DQUFzQztBQUN0QyxtQ0FBdUM7QUFDdkMsbUNBQW9DO0FBQ3BDLG9DQUFnRDtBQUNoRCxrQ0FBNEM7QUFFNUMsK0JBQTRCO0FBQzVCLDZCQUEwQjtBQUUxQiwrQkFBd0M7QUFDeEMsK0JBQTRCO0FBQzVCLGlDQUE4QztBQUM5QywrQkFBNEI7QUFDNUIsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFHNUIsSUFBTSxZQUFZLEdBQW1DO0lBQ25ELElBQUksRUFBRSxXQUFJO0lBQ1YsR0FBRyxFQUFFLFNBQUc7SUFDUixJQUFJLEVBQUUsV0FBSTtJQUNWLEtBQUssRUFBRSxhQUFLO0lBQ1osSUFBSSxFQUFFLFdBQUk7SUFDVixJQUFJLEVBQUUsV0FBSTtJQUNWLElBQUksRUFBRSxXQUFJO0lBQ1YsSUFBSSxFQUFFLFdBQUk7SUFDVixNQUFNLEVBQUUsY0FBTTtJQUNkLE1BQU0sRUFBRSxjQUFNO0NBQ2YsQ0FBQztBQUVGLHNCQUE2QixLQUFZO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sR0FBRyxDQUFDLENBQWdCLFVBQWMsRUFBZCxLQUFBLEtBQUssQ0FBQyxRQUFRLEVBQWQsY0FBYyxFQUFkLElBQWM7WUFBN0IsSUFB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