var channel_1 = require('../channel');
var mark_1 = require('../mark');
var type_1 = require('../type');
var stack_1 = require('./stack');
var MARKTYPES_MAP = {
    bar: 'rect',
    tick: 'rect',
    point: 'symbol',
    line: 'line',
    area: 'area',
    text: 'text',
    circle: 'symbol',
    square: 'symbol'
};
function compileMarks(model) {
    var mark = model.mark();
    if (mark === mark_1.LINE || mark === mark_1.AREA) {
        var sortBy = mark === mark_1.LINE ? model.config('sortLineBy') : undefined;
        if (!sortBy) {
            var sortField = (model.isMeasure(channel_1.X) && model.isDimension(channel_1.Y)) ? channel_1.Y : channel_1.X;
            sortBy = '-' + model.field(sortField);
        }
        var pathMarks = {
            type: MARKTYPES_MAP[mark],
            from: {
                transform: [{ type: 'sort', by: sortBy }]
            },
            properties: {
                update: properties[mark](model)
            }
        };
        var details = detailFields(model);
        if (details.length > 0) {
            var facetTransform = { type: 'facet', groupby: details };
            var transform = mark === mark_1.AREA && model.stack() ?
                [stack_1.imputeTransform(model), stack_1.stackTransform(model), facetTransform] :
                [facetTransform];
            return [{
                    name: mark + '-facet',
                    type: 'group',
                    from: {
                        transform: transform
                    },
                    properties: {
                        update: {
                            width: { field: { group: 'width' } },
                            height: { field: { group: 'height' } }
                        }
                    },
                    marks: [pathMarks]
                }];
        }
        else {
            return [pathMarks];
        }
    }
    else {
        var marks = [];
        if (mark === mark_1.TEXT && model.has(channel_1.COLOR)) {
            marks.push({
                type: 'rect',
                properties: { update: properties.textBackground(model) }
            });
        }
        var mainDef = {
            type: MARKTYPES_MAP[mark],
            properties: {
                update: properties[mark](model)
            }
        };
        var stack = model.stack();
        if (mark === mark_1.BAR && stack) {
            mainDef.from = {
                transform: [stack_1.stackTransform(model)]
            };
        }
        marks.push(mainDef);
        return marks;
    }
}
exports.compileMarks = compileMarks;
function applyMarksConfig(marksProperties, marksConfig, propsList) {
    propsList.forEach(function (property) {
        var value = marksConfig[property];
        if (value !== undefined) {
            marksProperties[property] = { value: value };
        }
    });
}
function detailFields(model) {
    return [channel_1.COLOR, channel_1.DETAIL, channel_1.SHAPE].reduce(function (details, channel) {
        if (model.has(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}
var properties;
(function (properties) {
    function bar(model) {
        var stack = model.stack();
        var p = {};
        if (stack && channel_1.X === stack.fieldChannel) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_start'
            };
            p.x2 = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_end'
            };
        }
        else if (model.fieldDef(channel_1.X).bin) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_start' }),
                offset: 1
            };
            p.x2 = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_end' })
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X)
            };
            if (!model.has(channel_1.Y) || model.isDimension(channel_1.Y)) {
                p.x2 = { value: 0 };
            }
        }
        else {
            if (model.has(channel_1.X)) {
                p.xc = {
                    scale: channel_1.X,
                    field: model.field(channel_1.X)
                };
            }
            else {
                p.x = { value: 0, offset: model.config('singleBarOffset') };
            }
        }
        if (!p.x2) {
            if (!model.has(channel_1.X) || model.isOrdinalScale(channel_1.X)) {
                if (model.has(channel_1.SIZE)) {
                    p.width = {
                        scale: channel_1.SIZE,
                        field: model.field(channel_1.SIZE)
                    };
                }
                else {
                    p.width = {
                        value: model.fieldDef(channel_1.X).scale.bandWidth,
                        offset: -1
                    };
                }
            }
            else {
                p.width = { value: 2 };
            }
        }
        if (stack && channel_1.Y === stack.fieldChannel) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_start'
            };
            p.y2 = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_end'
            };
        }
        else if (model.fieldDef(channel_1.Y).bin) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_start' })
            };
            p.y2 = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_end' }),
                offset: 1
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y)
            };
            p.y2 = { field: { group: 'height' } };
        }
        else {
            if (model.has(channel_1.Y)) {
                p.yc = {
                    scale: channel_1.Y,
                    field: model.field(channel_1.Y)
                };
            }
            else {
                p.y2 = {
                    field: { group: 'height' },
                    offset: -model.config('singleBarOffset')
                };
            }
            if (model.has(channel_1.SIZE)) {
                p.height = {
                    scale: channel_1.SIZE,
                    field: model.field(channel_1.SIZE)
                };
            }
            else {
                p.height = {
                    value: model.fieldDef(channel_1.Y).scale.bandWidth,
                    offset: -1
                };
            }
        }
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.markOpacity();
        if (opacity) {
            p.opacity = { value: opacity };
        }
        ;
        return p;
    }
    properties.bar = bar;
    function point(model) {
        var p = {};
        var marksConfig = model.config('marks');
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.X)) {
            p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.SIZE)) {
            p.size = {
                scale: channel_1.SIZE,
                field: model.field(channel_1.SIZE)
            };
        }
        else if (!model.has(channel_1.SIZE)) {
            p.size = { value: model.fieldDef(channel_1.SIZE).value };
        }
        if (model.has(channel_1.SHAPE)) {
            p.shape = {
                scale: channel_1.SHAPE,
                field: model.field(channel_1.SHAPE)
            };
        }
        else if (!model.has(channel_1.SHAPE)) {
            p.shape = { value: model.fieldDef(channel_1.SHAPE).value };
        }
        if (marksConfig.filled) {
            if (model.has(channel_1.COLOR)) {
                p.fill = {
                    scale: channel_1.COLOR,
                    field: model.field(channel_1.COLOR)
                };
            }
            else if (!model.has(channel_1.COLOR)) {
                p.fill = { value: model.fieldDef(channel_1.COLOR).value };
            }
        }
        else {
            if (model.has(channel_1.COLOR)) {
                p.stroke = {
                    scale: channel_1.COLOR,
                    field: model.field(channel_1.COLOR)
                };
            }
            else if (!model.has(channel_1.COLOR)) {
                p.stroke = { value: model.fieldDef(channel_1.COLOR).value };
            }
            p.strokeWidth = { value: model.config('marks').strokeWidth };
        }
        var opacity = model.markOpacity();
        if (opacity) {
            p.opacity = { value: opacity };
        }
        ;
        return p;
    }
    properties.point = point;
    function line(model) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.X)) {
            p.x = { value: 0 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { field: { group: 'height' } };
        }
        if (model.has(channel_1.COLOR)) {
            p.stroke = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else if (!model.has(channel_1.COLOR)) {
            p.stroke = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.markOpacity();
        if (opacity) {
            p.opacity = { value: opacity };
        }
        ;
        p.strokeWidth = { value: model.config('marks').strokeWidth };
        applyMarksConfig(p, model.config('marks'), ['interpolate', 'tension']);
        return p;
    }
    properties.line = line;
    function area(model) {
        var stack = model.stack();
        var p = {};
        if (stack && channel_1.X === stack.fieldChannel) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_start'
            };
            p.x2 = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_end'
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            p.x = { scale: channel_1.X, field: model.field(channel_1.X) };
            if (model.isDimension(channel_1.Y)) {
                p.x2 = {
                    scale: channel_1.X,
                    value: 0
                };
                p.orient = { value: 'horizontal' };
            }
        }
        else if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else {
            p.x = { value: 0 };
        }
        if (stack && channel_1.Y === stack.fieldChannel) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_start'
            };
            p.y2 = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_end'
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y)
            };
            p.y2 = {
                scale: channel_1.Y,
                value: 0
            };
        }
        else if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { field: { group: 'height' } };
        }
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else if (!model.has(channel_1.COLOR)) {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.markOpacity();
        if (opacity) {
            p.opacity = { value: opacity };
        }
        ;
        applyMarksConfig(p, model.config('marks'), ['interpolate', 'tension']);
        return p;
    }
    properties.area = area;
    function tick(model) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
            if (model.isDimension(channel_1.X)) {
                p.x.offset = -model.fieldDef(channel_1.X).scale.bandWidth / 3;
            }
        }
        else if (!model.has(channel_1.X)) {
            p.x = { value: 0 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
            if (model.isDimension(channel_1.Y)) {
                p.y.offset = -model.fieldDef(channel_1.Y).scale.bandWidth / 3;
            }
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { value: 0 };
        }
        if (!model.has(channel_1.X) || model.isDimension(channel_1.X)) {
            p.width = { value: model.fieldDef(channel_1.X).scale.bandWidth / 1.5 };
        }
        else {
            p.width = { value: 1 };
        }
        if (!model.has(channel_1.Y) || model.isDimension(channel_1.Y)) {
            p.height = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 1.5 };
        }
        else {
            p.height = { value: 1 };
        }
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.markOpacity();
        if (opacity) {
            p.opacity = { value: opacity };
        }
        ;
        return p;
    }
    properties.tick = tick;
    function filled_point_props(shape) {
        return function (model) {
            var p = {};
            if (model.has(channel_1.X)) {
                p.x = {
                    scale: channel_1.X,
                    field: model.field(channel_1.X, { binSuffix: '_mid' })
                };
            }
            else if (!model.has(channel_1.X)) {
                p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
            }
            if (model.has(channel_1.Y)) {
                p.y = {
                    scale: channel_1.Y,
                    field: model.field(channel_1.Y, { binSuffix: '_mid' })
                };
            }
            else if (!model.has(channel_1.Y)) {
                p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
            }
            if (model.has(channel_1.SIZE)) {
                p.size = {
                    scale: channel_1.SIZE,
                    field: model.field(channel_1.SIZE)
                };
            }
            else if (!model.has(channel_1.X)) {
                p.size = { value: model.fieldDef(channel_1.SIZE).value };
            }
            p.shape = { value: shape };
            if (model.has(channel_1.COLOR)) {
                p.fill = {
                    scale: channel_1.COLOR,
                    field: model.field(channel_1.COLOR)
                };
            }
            else if (!model.has(channel_1.COLOR)) {
                p.fill = { value: model.fieldDef(channel_1.COLOR).value };
            }
            var opacity = model.markOpacity();
            if (opacity) {
                p.opacity = { value: opacity };
            }
            ;
            return p;
        };
    }
    properties.circle = filled_point_props('circle');
    properties.square = filled_point_props('square');
    function textBackground(model) {
        return {
            x: { value: 0 },
            y: { value: 0 },
            width: { field: { group: 'width' } },
            height: { field: { group: 'height' } },
            fill: { scale: channel_1.COLOR, field: model.field(channel_1.COLOR) }
        };
    }
    properties.textBackground = textBackground;
    function text(model) {
        var p = {};
        var fieldDef = model.fieldDef(channel_1.TEXT);
        var marksConfig = model.config('marks');
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.X)) {
            if (model.has(channel_1.TEXT) && model.fieldDef(channel_1.TEXT).type === type_1.QUANTITATIVE) {
                p.x = { field: { group: 'width' }, offset: -5 };
            }
            else {
                p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
            }
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.SIZE)) {
            p.fontSize = {
                scale: channel_1.SIZE,
                field: model.field(channel_1.SIZE)
            };
        }
        else if (!model.has(channel_1.SIZE)) {
            p.fontSize = { value: marksConfig.fontSize };
        }
        var opacity = model.markOpacity();
        if (opacity) {
            p.opacity = { value: opacity };
        }
        ;
        if (model.has(channel_1.TEXT)) {
            if (model.fieldDef(channel_1.TEXT).type === type_1.QUANTITATIVE) {
                var numberFormat = marksConfig.format !== undefined ?
                    marksConfig.format : model.numberFormat(channel_1.TEXT);
                p.text = {
                    template: '{{' + model.field(channel_1.TEXT, { datum: true }) +
                        ' | number:\'' + numberFormat + '\'}}'
                };
            }
            else {
                p.text = { field: model.field(channel_1.TEXT) };
            }
        }
        else {
            p.text = { value: fieldDef.value };
        }
        applyMarksConfig(p, marksConfig, ['angle', 'align', 'baseline', 'dx', 'dy', 'fill', 'font', 'fontWeight',
            'fontStyle', 'radius', 'theta']);
        return p;
    }
    properties.text = text;
})(properties = exports.properties || (exports.properties = {}));
//# sourceMappingURL=marks.js.map