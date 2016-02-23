"use strict";
var channel_1 = require('../channel');
var mark_1 = require('../mark');
var stack_1 = require('./stack');
var util_1 = require('../util');
var mark_area_1 = require('./mark-area');
var mark_bar_1 = require('./mark-bar');
var mark_line_1 = require('./mark-line');
var mark_point_1 = require('./mark-point');
var mark_text_1 = require('./mark-text');
var mark_tick_1 = require('./mark-tick');
var util_2 = require('./util');
var markCompiler = {
    area: mark_area_1.area,
    bar: mark_bar_1.bar,
    line: mark_line_1.line,
    point: mark_point_1.point,
    text: mark_text_1.text,
    tick: mark_tick_1.tick,
    circle: mark_point_1.circle,
    square: mark_point_1.square
};
function compileMark(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA], model.mark())) {
        return compilePathMark(model);
    }
    else {
        return compileNonPathMark(model);
    }
}
exports.compileMark = compileMark;
function compilePathMark(model) {
    var mark = model.mark();
    var name = model.spec().name;
    var hasParentData = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
    var dataFrom = { data: model.dataTable() };
    var details = detailFields(model);
    var pathMarks = [util_1.extend(name ? { name: name + '-marks' } : {}, {
            type: markCompiler[mark].markType(),
            from: util_1.extend(hasParentData || details.length > 0 ? {} : dataFrom, { transform: [{ type: 'sort', by: sortPathBy(model) }] }),
            properties: { update: markCompiler[mark].properties(model) }
        })];
    if (details.length > 0) {
        var facetTransform = { type: 'facet', groupby: details };
        var transform = mark === mark_1.AREA && model.stack() ?
            [stack_1.imputeTransform(model), stack_1.stackTransform(model), facetTransform] :
            [].concat(facetTransform, model.has(channel_1.ORDER) ? [{ type: 'sort', by: sortBy(model) }] : []);
        return [{
                name: (name ? name + '-' : '') + mark + '-facet',
                type: 'group',
                from: util_1.extend(hasParentData ? {} : dataFrom, { transform: transform }),
                properties: {
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
function compileNonPathMark(model) {
    var mark = model.mark();
    var name = model.spec().name;
    var hasParentData = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
    var dataFrom = { data: model.dataTable() };
    var marks = [];
    if (mark === mark_1.TEXT &&
        model.has(channel_1.COLOR) &&
        model.config().mark.applyColorToBackground && !model.has(channel_1.X) && !model.has(channel_1.Y)) {
        marks.push(util_1.extend(name ? { name: name + '-background' } : {}, { type: 'rect' }, hasParentData ? {} : { from: dataFrom }, { properties: { update: mark_text_1.text.background(model) } }));
    }
    marks.push(util_1.extend(name ? { name: name + '-marks' } : {}, { type: markCompiler[mark].markType() }, (!hasParentData || model.stack() || model.has(channel_1.ORDER)) ? {
        from: util_1.extend(hasParentData ? {} : dataFrom, model.stack() ?
            { transform: [stack_1.stackTransform(model)] } :
            model.has(channel_1.ORDER) ?
                { transform: [{ type: 'sort', by: sortBy(model) }] } :
                {})
    } : {}, { properties: { update: markCompiler[mark].properties(model) } }));
    if (model.has(channel_1.LABEL) && markCompiler[mark].labels) {
        var labelProperties = markCompiler[mark].labels(model);
        if (labelProperties !== undefined) {
            marks.push(util_1.extend(name ? { name: name + '-label' } : {}, { type: 'text' }, hasParentData ? {} : { from: dataFrom }, { properties: { update: labelProperties } }));
        }
    }
    return marks;
}
function sortBy(model) {
    if (model.has(channel_1.ORDER)) {
        var channelDef = model.encoding().order;
        if (channelDef instanceof Array) {
            return channelDef.map(util_2.sortField);
        }
        else {
            return util_2.sortField(channelDef);
        }
    }
    return null;
}
function sortPathBy(model) {
    if (model.mark() === mark_1.LINE && model.has(channel_1.PATH)) {
        var channelDef = model.encoding().path;
        if (channelDef instanceof Array) {
            return channelDef.map(util_2.sortField);
        }
        else {
            return util_2.sortField(channelDef);
        }
    }
    else {
        return '-' + model.field(model.config().mark.orient === 'horizontal' ? channel_1.Y : channel_1.X);
    }
}
function detailFields(model) {
    return [channel_1.COLOR, channel_1.DETAIL, channel_1.SHAPE].reduce(function (details, channel) {
        if (model.has(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}
//# sourceMappingURL=mark.js.map