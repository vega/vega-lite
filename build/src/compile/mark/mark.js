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
var channel_1 = require("../../channel");
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
    // FIXME: replace this with more general case for composition
    var details = detailFields(model);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdUNBQWtDO0FBQ2xDLHlDQUFtRDtBQUNuRCxtQ0FBZ0M7QUFDaEMsMkNBQTJDO0FBQzNDLDJDQUFrRDtBQUNsRCxtQ0FBc0M7QUFDdEMsbUNBQXVDO0FBQ3ZDLG1DQUFvQztBQUNwQyxvQ0FBZ0Q7QUFHaEQsK0JBQTRCO0FBQzVCLDZCQUEwQjtBQUcxQiwrQkFBNEI7QUFDNUIsaUNBQThDO0FBQzlDLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUc1QixJQUFNLFlBQVksR0FBbUM7SUFDbkQsSUFBSSxFQUFFLFdBQUk7SUFDVixHQUFHLEVBQUUsU0FBRztJQUNSLElBQUksRUFBRSxXQUFJO0lBQ1YsS0FBSyxFQUFFLGFBQUs7SUFDWixJQUFJLEVBQUUsV0FBSTtJQUNWLElBQUksRUFBRSxXQUFJO0lBQ1YsSUFBSSxFQUFFLFdBQUk7SUFDVixJQUFJLEVBQUUsV0FBSTtJQUNWLE1BQU0sRUFBRSxjQUFNO0lBQ2QsTUFBTSxFQUFFLGNBQU07Q0FDZixDQUFDO0FBR0Ysd0JBQStCLEtBQWdCO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLFdBQUksRUFBRSxXQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUM7QUFORCx3Q0FNQztBQUVELElBQU0sbUJBQW1CLEdBQUcsZUFBZSxDQUFDO0FBRTVDLHVCQUF1QixLQUFnQjtJ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QUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4QyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge05PTlBPU0lUSU9OX0NIQU5ORUxTfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7TUFJTn0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge2lzQWdncmVnYXRlfSBmcm9tICcuLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge2ZpZWxkLCBnZXRGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtBUkVBLCBMSU5FfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7aXNTb3J0RmllbGR9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2dldFN0eWxlcywgc29ydFBhcmFtc30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9iYXInO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge25vcm1hbGl6ZU1hcmtEZWZ9IGZyb20gJy4vaW5pdCc7XG5pbXBvcnQge2xpbmV9IGZyb20gJy4vbGluZSc7XG5pbXBvcnQge2NpcmNsZSwgcG9pbnQsIHNxdWFyZX0gZnJvbSAnLi9wb2ludCc7XG5pbXBvcnQge3JlY3R9IGZyb20gJy4vcmVjdCc7XG5pbXBvcnQge3J1bGV9IGZyb20gJy4vcnVsZSc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4vdGV4dCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4vdGljayc7XG5cblxuY29uc3QgbWFya0NvbXBpbGVyOiB7W3R5cGU6IHN0cmluZ106IE1hcmtDb21waWxlcn0gPSB7XG4gIGFyZWE6IGFyZWEsXG4gIGJhcjogYmFyLFxuICBsaW5lOiBsaW5lLFxuICBwb2ludDogcG9pbnQsXG4gIHRleHQ6IHRleHQsXG4gIHRpY2s6IHRpY2ssXG4gIHJlY3Q6IHJlY3QsXG4gIHJ1bGU6IHJ1bGUsXG4gIGNpcmNsZTogY2lyY2xlLFxuICBzcXVhcmU6IHNxdWFyZVxufTtcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNYXJrR3JvdXAobW9kZWw6IFVuaXRNb2RlbCk6IGFueVtdIHtcbiAgaWYgKGNvbnRhaW5zKFtMSU5FLCBBUkVBXSwgbW9kZWwubWFyaygpKSkge1xuICAgIHJldHVybiBwYXJzZVBhdGhNYXJrKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGFyc2VOb25QYXRoTWFyayhtb2RlbCk7XG4gIH1cbn1cblxuY29uc3QgRkFDRVRFRF9QQVRIX1BSRUZJWCA9ICdmYWNldGVkX3BhdGhfJztcblxuZnVuY3Rpb24gcGFyc2VQYXRoTWFyayhtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG4gIC8vIEZJWE1FOiByZXBsYWNlIHRoaXMgd2l0aCBtb3JlIGdlbmVyYWwgY2FzZSBmb3IgY29tcG9zaXRpb25cbiAgY29uc3QgZGV0YWlscyA9IGRldGFpbEZpZWxkcyhtb2RlbCk7XG5cbiAgY29uc3QgY2xpcCA9IG1vZGVsLm1hcmtEZWYuY2xpcCAhPT0gdW5kZWZpbmVkID8gISFtb2RlbC5tYXJrRGVmLmNsaXAgOiBzY2FsZUNsaXAobW9kZWwpO1xuICBjb25zdCBzdHlsZSA9IGdldFN0eWxlcyhtb2RlbC5tYXJrRGVmKTtcbiAgY29uc3Qgc29ydCA9IGdldFBhdGhTb3J0KG1vZGVsKTtcblxuICBjb25zdCBwYXRoTWFya3M6IGFueSA9IFtcbiAgICB7XG4gICAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdtYXJrcycpLFxuICAgICAgdHlwZTogbWFya0NvbXBpbGVyW21hcmtdLnZnTWFyayxcbiAgICAgIC4uLihjbGlwID8ge2NsaXA6IHRydWV9IDoge30pLFxuICAgICAgLi4uKHN0eWxlPyB7c3R5bGV9IDoge30pLFxuICAgICAgLi4uKHNvcnQ/IHtzb3J0fSA6IHt9KSxcbiAgICAgIC8vIElmIGhhcyBzdWJmYWNldCBmb3IgbGluZS9hcmVhIGdyb3VwLCBuZWVkIHRvIHVzZSBmYWNldGVkIGRhdGEgZnJvbSBiZWxvdy5cbiAgICAgIC8vIEZJWE1FOiBzdXBwb3J0IHNvcnRpbmcgcGF0aCBvcmRlciAoaW4gY29ubmVjdGVkIHNjYXR0ZXJwbG90KVxuICAgICAgZnJvbToge2RhdGE6IChkZXRhaWxzLmxlbmd0aCA+IDAgPyBGQUNFVEVEX1BBVEhfUFJFRklYIDogJycpICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pfSxcbiAgICAgIGVuY29kZToge3VwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLmVuY29kZUVudHJ5KG1vZGVsKX1cbiAgICB9XG4gIF07XG5cbiAgaWYgKGRldGFpbHMubGVuZ3RoID4gMCkgeyAvLyBoYXZlIGxldmVsIG9mIGRldGFpbHMgLSBuZWVkIHRvIGZhY2V0IGxpbmUgaW50byBzdWJncm91cHNcbiAgICAvLyBUT0RPOiBmb3Igbm9uLXN0YWNrZWQgcGxvdCwgbWFwIG9yZGVyIHRvIHppbmRleC4gKE1heWJlIHJlbmFtZSBvcmRlciBmb3IgbGF5ZXIgdG8gemluZGV4PylcblxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogbW9kZWwuZ2V0TmFtZSgncGF0aGdyb3VwJyksXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgZnJvbToge1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIG5hbWU6IEZBQ0VURURfUEFUSF9QUkVGSVggKyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGdyb3VwYnk6IGRldGFpbHMsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXG4gICAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWFya3M6IHBhdGhNYXJrc1xuICAgIH1dO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXRoTWFya3M7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGhTb3J0KG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgaWYgKG1vZGVsLm1hcmsoKSA9PT0gJ2xpbmUnICYmIG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgnb3JkZXInKSkge1xuICAgIC8vIEZvciBvbmx5IGxpbmUsIHNvcnQgYnkgdGhlIG9yZGVyIGZpZWxkIGlmIGl0IGlzIHNwZWNpZmllZC5cbiAgICByZXR1cm4gc29ydFBhcmFtcyhtb2RlbC5lbmNvZGluZy5vcmRlciwge2V4cHI6ICdkYXR1bSd9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgYm90aCBsaW5lIGFuZCBhcmVhLCB3ZSBzb3J0IHZhbHVlcyBiYXNlZCBvbiBkaW1lbnNpb24gYnkgZGVmYXVsdFxuICAgIGNvbnN0IGRpbWVuc2lvbkNoYW5uZWw6ICd4JyB8ICd5JyA9IG1vZGVsLm1hcmtEZWYub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneScgOiAneCc7XG4gICAgY29uc3QgcyA9IG1vZGVsLnNvcnQoZGltZW5zaW9uQ2hhbm5lbCk7XG4gICAgY29uc3Qgc29ydEZpZWxkID0gaXNTb3J0RmllbGQocykgP1xuICAgICAgZmllbGQoe1xuICAgICAgICAvLyBGSVhNRTogdGhpcyBvcCBtaWdodCBub3QgYWxyZWFkeSBleGlzdD9cbiAgICAgICAgLy8gRklYTUU6IHdoYXQgaWYgZGltZW5zaW9uQ2hhbm5lbCAoeCBvciB5KSBjb250YWlucyBjdXN0b20gZG9tYWluP1xuICAgICAgICBhZ2dyZWdhdGU6IGlzQWdncmVnYXRlKG1vZGVsLmVuY29kaW5nKSA/IHMub3AgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpZWxkOiBzLmZpZWxkXG4gICAgICB9LCB7ZXhwcjogJ2RhdHVtJ30pIDpcbiAgICAgIG1vZGVsLmZpZWxkKGRpbWVuc2lvbkNoYW5uZWwsIHtcbiAgICAgICAgLy8gRm9yIHN0YWNrIHdpdGggaW1wdXRhdGlvbiwgd2Ugb25seSBoYXZlIGJpbl9taWRcbiAgICAgICAgYmluU3VmZml4OiBtb2RlbC5zdGFjayAmJiBtb2RlbC5zdGFjay5pbXB1dGUgPyAnbWlkJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgZXhwcjogJ2RhdHVtJ1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gc29ydEZpZWxkID9cbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IHNvcnRGaWVsZCxcbiAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgICAgfSA6XG4gICAgICB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VOb25QYXRoTWFyayhtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG5cbiAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZXMobW9kZWwubWFya0RlZik7XG4gIGNvbnN0IGNsaXAgPSBtb2RlbC5tYXJrRGVmLmNsaXAgIT09IHVuZGVmaW5lZCA/ICEhbW9kZWwubWFya0RlZi5jbGlwIDogc2NhbGVDbGlwKG1vZGVsKTtcblxuICBjb25zdCBtYXJrczogYW55W10gPSBbXTsgLy8gVE9ETzogdmdNYXJrc1xuXG4gIC8vIFRPRE86IGZvciBub24tc3RhY2tlZCBwbG90LCBtYXAgb3JkZXIgdG8gemluZGV4LiAoTWF5YmUgcmVuYW1lIG9yZGVyIGZvciBsYXllciB0byB6aW5kZXg/KVxuXG4gIG1hcmtzLnB1c2goe1xuICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ21hcmtzJyksXG4gICAgdHlwZTogbWFya0NvbXBpbGVyW21hcmtdLnZnTWFyayxcbiAgICAuLi4oY2xpcCA/IHtjbGlwOiB0cnVlfSA6IHt9KSxcbiAgICAuLi4oc3R5bGU/IHtzdHlsZX0gOiB7fSksXG4gICAgZnJvbToge2RhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKX0sXG4gICAgZW5jb2RlOiB7dXBkYXRlOiBtYXJrQ29tcGlsZXJbbWFya10uZW5jb2RlRW50cnkobW9kZWwpfVxuICB9KTtcblxuICByZXR1cm4gbWFya3M7XG59XG5cbi8qKlxuICogUmV0dXJucyBsaXN0IG9mIGRldGFpbCAoZ3JvdXAtYnkpIGZpZWxkc1xuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5mdW5jdGlvbiBkZXRhaWxGaWVsZHMobW9kZWw6IFVuaXRNb2RlbCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIE5PTlBPU0lUSU9OX0NIQU5ORUxTLnJlZHVjZShmdW5jdGlvbihkZXRhaWxzLCBjaGFubmVsKSB7XG4gICAgY29uc3Qge2VuY29kaW5nfSA9IG1vZGVsO1xuICAgIGlmIChjaGFubmVsID09PSAnb3JkZXInKSB7XG4gICAgICByZXR1cm4gZGV0YWlscztcbiAgICB9XG4gICAgaWYgKGNoYW5uZWwgPT09ICdkZXRhaWwnKSB7XG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICAoaXNBcnJheShjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYgOiBbY2hhbm5lbERlZl0pLmZvckVhY2goKGZpZWxkRGVmKSA9PiB7XG4gICAgICAgICAgaWYgKCFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICAgIGRldGFpbHMucHVzaChmaWVsZChmaWVsZERlZiwge30pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IGdldEZpZWxkRGVmPHN0cmluZz4oZW5jb2RpbmdbY2hhbm5lbF0pO1xuICAgICAgaWYgKGZpZWxkRGVmICYmICFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgZGV0YWlscy5wdXNoKGZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIElmIHNjYWxlcyBhcmUgYm91bmQgdG8gaW50ZXJ2YWwgc2VsZWN0aW9ucywgd2Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IGNsaXBcbiAqIG1hcmtzIHRvIGFjY291bnQgZm9yIHBhbm5pbmcvem9vbWluZyBpbnRlcmFjdGlvbnMuIFdlIGlkZW50aWZ5IGJvdW5kIHNjYWxlc1xuICogYnkgdGhlIGRvbWFpblJhdyBwcm9wZXJ0eSwgd2hpY2ggZ2V0cyBhZGRlZCBkdXJpbmcgc2NhbGUgcGFyc2luZy5cbiAqL1xuZnVuY3Rpb24gc2NhbGVDbGlwKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgeFNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgY29uc3QgeVNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKTtcbiAgcmV0dXJuICh4U2NhbGUgJiYgeFNjYWxlLmdldCgnZG9tYWluUmF3JykpIHx8XG4gICAgKHlTY2FsZSAmJiB5U2NhbGUuZ2V0KCdkb21haW5SYXcnKSkgPyB0cnVlIDogZmFsc2U7XG59XG4iXX0=