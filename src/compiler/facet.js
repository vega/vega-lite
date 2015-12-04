var util = require('../util');
var channel_1 = require('../channel');
var axis_1 = require('./axis');
var scale_1 = require('./scale');
function facetMixins(model, marks) {
    var layout = model.layout();
    var cellWidth = !model.has(channel_1.COLUMN) ?
        { field: { group: 'width' } } :
        layout.cellWidth.field ?
            { scale: 'column', band: true } :
            { value: layout.cellWidth };
    var cellHeight = !model.has(channel_1.ROW) ?
        { field: { group: 'height' } } :
        layout.cellHeight.field ?
            { scale: 'row', band: true } :
            { value: layout.cellHeight };
    var facetGroupProperties = {
        width: cellWidth,
        height: cellHeight
    };
    var cellConfig = model.config('cell');
    ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
        'strokeOpacity', 'strokeDash', 'strokeDashOffset']
        .forEach(function (property) {
        var value = cellConfig[property];
        if (value !== undefined) {
            facetGroupProperties[property] = value;
        }
    });
    var rootMarks = [], rootAxes = [], facetKeys = [], cellAxes = [];
    var hasRow = model.has(channel_1.ROW), hasCol = model.has(channel_1.COLUMN);
    if (hasRow) {
        if (!model.isDimension(channel_1.ROW)) {
            util.error('Row encoding should be ordinal.');
        }
        facetGroupProperties.y = {
            scale: channel_1.ROW,
            field: model.field(channel_1.ROW)
        };
        facetKeys.push(model.field(channel_1.ROW));
        rootAxes.push(axis_1.compileAxis(channel_1.ROW, model));
        if (model.has(channel_1.X)) {
            rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
        }
        rootMarks.push(getRowRulesGroup(model, cellHeight));
    }
    else {
        if (model.has(channel_1.X)) {
            cellAxes.push(axis_1.compileAxis(channel_1.X, model));
        }
    }
    if (hasCol) {
        if (!model.isDimension(channel_1.COLUMN)) {
            util.error('Col encoding should be ordinal.');
        }
        facetGroupProperties.x = {
            scale: channel_1.COLUMN,
            field: model.field(channel_1.COLUMN)
        };
        facetKeys.push(model.field(channel_1.COLUMN));
        rootAxes.push(axis_1.compileAxis(channel_1.COLUMN, model));
        if (model.has(channel_1.Y)) {
            rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
        }
        rootMarks.push(getColumnRulesGroup(model, cellWidth));
    }
    else {
        if (model.has(channel_1.Y)) {
            cellAxes.push(axis_1.compileAxis(channel_1.Y, model));
        }
    }
    var facetGroup = {
        name: 'cell',
        type: 'group',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: facetKeys }]
        },
        properties: {
            update: facetGroupProperties
        },
        marks: marks
    };
    if (cellAxes.length > 0) {
        facetGroup.axes = cellAxes;
    }
    rootMarks.push(facetGroup);
    var scaleNames = model.map(function (_, channel) {
        return channel;
    });
    return {
        marks: rootMarks,
        axes: rootAxes,
        scales: scale_1.compileScales(scaleNames, model)
    };
}
exports.facetMixins = facetMixins;
function getXAxesGroup(model, cellWidth, hasCol) {
    var xAxesGroup = {
        name: 'x-axes',
        type: 'group',
        properties: {
            update: {
                width: cellWidth,
                height: { field: { group: 'height' } },
                x: hasCol ? { scale: channel_1.COLUMN, field: model.field(channel_1.COLUMN) } : { value: 0 },
                y: { value: -model.config('cell').padding / 2 }
            }
        },
        axes: [axis_1.compileAxis(channel_1.X, model)]
    };
    if (hasCol) {
        xAxesGroup.from = {
            data: model.dataTable(),
            transform: { type: 'facet', groupby: [model.field(channel_1.COLUMN)] }
        };
    }
    return xAxesGroup;
}
function getYAxesGroup(model, cellHeight, hasRow) {
    var yAxesGroup = {
        name: 'y-axes',
        type: 'group',
        properties: {
            update: {
                width: { field: { group: 'width' } },
                height: cellHeight,
                x: { value: -model.config('cell').padding / 2 },
                y: hasRow ? { scale: channel_1.ROW, field: model.field(channel_1.ROW) } : { value: 0 }
            }
        },
        axes: [axis_1.compileAxis(channel_1.Y, model)]
    };
    if (hasRow) {
        yAxesGroup.from = {
            data: model.dataTable(),
            transform: { type: 'facet', groupby: [model.field(channel_1.ROW)] }
        };
    }
    return yAxesGroup;
}
function getRowRulesGroup(model, cellHeight) {
    var rowRulesOnTop = !model.has(channel_1.X) || model.fieldDef(channel_1.X).axis.orient !== 'top';
    var offset = model.config('cell').padding / 2 - 1;
    var rowRules = {
        name: 'row-rules',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.ROW)] }]
        },
        properties: {
            update: {
                y: {
                    scale: 'row',
                    field: model.field(channel_1.ROW),
                    offset: (rowRulesOnTop ? -1 : 1) * offset
                },
                x: { value: 0, offset: -model.config('cell').gridOffset },
                x2: { field: { group: 'width' }, offset: model.config('cell').gridOffset },
                stroke: { value: model.config('cell').gridColor },
                strokeOpacity: { value: model.config('cell').gridOpacity }
            }
        }
    };
    if (rowRulesOnTop) {
        return rowRules;
    }
    return {
        name: 'row-rules-group',
        type: 'group',
        properties: {
            update: {
                y: cellHeight.value ?
                    cellHeight :
                    { field: { parent: 'cellHeight' } },
                width: { field: { group: 'width' } }
            }
        },
        marks: [rowRules]
    };
}
function getColumnRulesGroup(model, cellWidth) {
    var colRulesOnLeft = !model.has(channel_1.Y) || model.fieldDef(channel_1.Y).axis.orient === 'right';
    var offset = model.config('cell').padding / 2 - 1;
    var columnRules = {
        name: 'column-rules',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.COLUMN)] }]
        },
        properties: {
            update: {
                x: {
                    scale: 'column',
                    field: model.field(channel_1.COLUMN),
                    offset: (colRulesOnLeft ? -1 : 1) * offset
                },
                y: { value: 0, offset: -model.config('cell').gridOffset },
                y2: { field: { group: 'height' }, offset: model.config('cell').gridOffset },
                stroke: { value: model.config('cell').gridColor },
                strokeOpacity: { value: model.config('cell').gridOpacity }
            }
        }
    };
    if (colRulesOnLeft) {
        return columnRules;
    }
    return {
        name: 'column-rules-group',
        type: 'group',
        properties: {
            update: {
                x: cellWidth.value ?
                    cellWidth :
                    { field: { parent: 'cellWidth' } },
                height: { field: { group: 'height' } }
            }
        },
        marks: [columnRules]
    };
}
//# sourceMappingURL=facet.js.map