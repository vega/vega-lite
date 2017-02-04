"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var channel_1 = require("../../channel");
var mark_1 = require("../../mark");
var util_1 = require("../../util");
var area_1 = require("./area");
var bar_1 = require("./bar");
var line_1 = require("./line");
var point_1 = require("./point");
var rect_1 = require("./rect");
var rule_1 = require("./rule");
var text_1 = require("./text");
var label_1 = require("./label");
var tick_1 = require("./tick");
var markCompiler = {
    area: area_1.area,
    bar: bar_1.bar,
    line: line_1.line,
    point: point_1.point,
    text: text_1.text,
    label: label_1.label,
    tick: tick_1.tick,
    rect: rect_1.rect,
    rule: rule_1.rule,
    circle: point_1.circle,
    square: point_1.square
};
function parseMark(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA], model.mark())) {
        return parsePathMark(model);
    }
    else {
        return parseNonPathMark(model);
    }
}
exports.parseMark = parseMark;
// FIXME: maybe this should not be here.  Need re-think and refactor, esp. after having all composition in.
function dataFrom(model) {
    var parent = model.parent();
    if (parent && parent.isFacet()) {
        return parent.facetedTable();
    }
    if (model.stack()) {
        return model.dataName('stacked');
    }
    return model.dataTable();
}
var FACETED_PATH_PREFIX = 'faceted-path-';
function parsePathMark(model) {
    var mark = model.mark();
    // FIXME: replace this with more general case for composition
    var details = detailFields(model);
    var pathMarks = [
        {
            name: model.name('marks'),
            type: markCompiler[mark].vgMark,
            // If has subfacet for line/area group, need to use faceted data from below.
            // FIXME: support sorting path order (in connected scatterplot)
            from: { data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + dataFrom(model) },
            encode: { update: markCompiler[mark].encodeEntry(model) }
        }
    ];
    if (details.length > 0) {
        // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
        return [{
                name: model.name('pathgroup'),
                type: 'group',
                from: {
                    facet: {
                        name: FACETED_PATH_PREFIX + dataFrom(model),
                        data: dataFrom(model),
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
function parseNonPathMark(model) {
    var mark = model.mark();
    var role = markCompiler[mark].role;
    var marks = []; // TODO: vgMarks
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
    marks.push(__assign({ name: model.name('marks'), type: markCompiler[mark].vgMark }, (role ? { role: role } : {}), { 
        // refactor for Label
        from: { data: dataFrom(model) }, encode: { update: markCompiler[mark].encodeEntry(model) } }, ((mark === mark_1.LABEL) ? {
        transform: markCompiler[mark_1.LABEL].transform(model)
    } : {})));
    return marks;
}
var NONSPATIAL_CHANNELS_EXCEPT_ORDER = util_1.without(channel_1.NONSPATIAL_CHANNELS, ['order']);
/**
 * Returns list of detail (group-by) fields
 * that the model's spec contains.
 */
function detailFields(model) {
    return NONSPATIAL_CHANNELS_EXCEPT_ORDER.reduce(function (details, channel) {
        if (model.channelHasField(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}
//# sourceMappingURL=mark.js.map