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
    var mark = model.mark();
    var name = model.spec().name;
    var isFaceted = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
    var dataFrom = { data: model.dataTable() };
    var markConfig = model.config().mark;
    var sortBy = markConfig.sortBy;
    if (mark === mark_1.LINE || mark === mark_1.AREA) {
        var details = detailFields(model);
        var pathOrder = getPathOrder(model);
        var pathMarks = [util_1.extend(name ? { name: name + '-marks' } : {}, {
                type: markCompiler[mark].markType(),
                from: util_1.extend(isFaceted || details.length > 0 ? {} : dataFrom, { transform: [{ type: 'sort', by: pathOrder }] }),
                properties: { update: markCompiler[mark].properties(model) }
            })];
        if (details.length > 0) {
            var facetTransform = { type: 'facet', groupby: details };
            var transform = [].concat((sortBy ? [{ type: 'sort', by: sortBy }] : []), mark === mark_1.AREA && model.stack() ?
                [stack_1.imputeTransform(model), stack_1.stackTransform(model), facetTransform] :
                [facetTransform]);
            return [{
                    name: (name ? name + '-' : '') + mark + '-facet',
                    type: 'group',
                    from: util_1.extend(isFaceted ? {} : dataFrom, { transform: transform }),
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
    else {
        var marks = [];
        if (mark === mark_1.TEXT &&
            model.has(channel_1.COLOR) &&
            model.config().mark.applyColorToBackground && !model.has(channel_1.X) && !model.has(channel_1.Y)) {
            marks.push(util_1.extend(name ? { name: name + '-background' } : {}, { type: 'rect' }, isFaceted ? {} : { from: dataFrom }, { properties: { update: mark_text_1.text.background(model) } }));
        }
        marks.push(util_1.extend(name ? { name: name + '-marks' } : {}, { type: markCompiler[mark].markType() }, (!isFaceted || model.stack() || sortBy) ? {
            from: util_1.extend(isFaceted ? {} : dataFrom, model.stack() || sortBy ? { transform: [].concat((model.stack() ? [stack_1.stackTransform(model)] : []), sortBy ? [{ type: 'sort', by: sortBy }] : []) } : {})
        } : {}, { properties: { update: markCompiler[mark].properties(model) } }));
        if (model.has(channel_1.LABEL) && markCompiler[mark].labels) {
            var labelProperties = markCompiler[mark].labels(model);
            if (labelProperties !== undefined) {
                marks.push(util_1.extend(name ? { name: name + '-label' } : {}, { type: 'text' }, isFaceted ? {} : { from: dataFrom }, { properties: { update: labelProperties } }));
            }
        }
        return marks;
    }
}
exports.compileMark = compileMark;
function getPathOrder(model) {
    if (model.mark() === mark_1.LINE && model.has(channel_1.PATH)) {
        if (util_1.isArray(model.spec().encoding[channel_1.PATH])) {
            return model.spec().encoding[channel_1.PATH].map(function (fieldDef) {
                return (fieldDef.sort === 'descending' ? '-' : '') + fieldDef.field;
            });
        }
        else {
            var fieldDef = model.fieldDef(channel_1.PATH);
            return (fieldDef.sort === 'descending' ? '-' : '') + fieldDef.field;
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