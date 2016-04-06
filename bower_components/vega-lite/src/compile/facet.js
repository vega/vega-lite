"use strict";
var util = require('../util');
var util_1 = require('../util');
var channel_1 = require('../channel');
var fielddef_1 = require('../fielddef');
var axis_1 = require('./axis');
var scale_1 = require('./scale');
var common_1 = require('./common');
function facetMixins(model, marks) {
    var hasRow = model.has(channel_1.ROW), hasCol = model.has(channel_1.COLUMN);
    if (model.has(channel_1.ROW) && !fielddef_1.isDimension(model.encoding().row)) {
        util.error('Row encoding should be ordinal.');
    }
    if (model.has(channel_1.COLUMN) && !fielddef_1.isDimension(model.encoding().column)) {
        util.error('Col encoding should be ordinal.');
    }
    return {
        marks: [].concat(getFacetGuideGroups(model), [getFacetGroup(model, marks)]),
        scales: scale_1.compileScales(model),
        axes: [].concat(hasRow && model.axis(channel_1.ROW) ? [axis_1.compileAxis(channel_1.ROW, model)] : [], hasCol && model.axis(channel_1.COLUMN) ? [axis_1.compileAxis(channel_1.COLUMN, model)] : [])
    };
}
exports.facetMixins = facetMixins;
function getCellAxes(model) {
    var cellAxes = [];
    if (model.has(channel_1.X) && model.axis(channel_1.X) && axis_1.gridShow(model, channel_1.X)) {
        cellAxes.push(axis_1.compileInnerAxis(channel_1.X, model));
    }
    if (model.has(channel_1.Y) && model.axis(channel_1.Y) && axis_1.gridShow(model, channel_1.Y)) {
        cellAxes.push(axis_1.compileInnerAxis(channel_1.Y, model));
    }
    return cellAxes;
}
function getFacetGroup(model, marks) {
    var name = model.spec().name;
    var facetGroup = {
        name: (name ? name + '-' : '') + 'cell',
        type: 'group',
        from: {
            data: model.dataTable(),
            transform: [{
                    type: 'facet',
                    groupby: [].concat(model.has(channel_1.ROW) ? [model.field(channel_1.ROW)] : [], model.has(channel_1.COLUMN) ? [model.field(channel_1.COLUMN)] : [])
                }]
        },
        properties: {
            update: getFacetGroupProperties(model)
        },
        marks: marks
    };
    var cellAxes = getCellAxes(model);
    if (cellAxes.length > 0) {
        facetGroup.axes = cellAxes;
    }
    return facetGroup;
}
function getFacetGroupProperties(model) {
    var facetGroupProperties = {
        x: model.has(channel_1.COLUMN) ? {
            scale: model.scaleName(channel_1.COLUMN),
            field: model.field(channel_1.COLUMN),
            offset: model.scale(channel_1.COLUMN).padding / 2
        } : { value: model.config().facet.scale.padding / 2 },
        y: model.has(channel_1.ROW) ? {
            scale: model.scaleName(channel_1.ROW),
            field: model.field(channel_1.ROW),
            offset: model.scale(channel_1.ROW).padding / 2
        } : { value: model.config().facet.scale.padding / 2 },
        width: { field: { parent: 'cellWidth' } },
        height: { field: { parent: 'cellHeight' } }
    };
    common_1.applyConfig(facetGroupProperties, model.config().cell, common_1.FILL_STROKE_CONFIG.concat(['clip']));
    common_1.applyConfig(facetGroupProperties, model.config().facet.cell, common_1.FILL_STROKE_CONFIG.concat(['clip']));
    return facetGroupProperties;
}
function getFacetGuideGroups(model) {
    var rootAxesGroups = [];
    if (model.has(channel_1.X)) {
        if (model.axis(channel_1.X)) {
            rootAxesGroups.push(getXAxesGroup(model));
        }
    }
    else {
        if (model.has(channel_1.ROW)) {
            rootAxesGroups.push.apply(rootAxesGroups, getRowGridGroups(model));
        }
    }
    if (model.has(channel_1.Y)) {
        if (model.axis(channel_1.Y)) {
            rootAxesGroups.push(getYAxesGroup(model));
        }
    }
    else {
        if (model.has(channel_1.COLUMN)) {
            rootAxesGroups.push.apply(rootAxesGroups, getColumnGridGroups(model));
        }
    }
    return rootAxesGroups;
}
function getXAxesGroup(model) {
    var hasCol = model.has(channel_1.COLUMN);
    var name = model.spec().name;
    return util_1.extend({
        name: (name ? name + '-' : '') + 'x-axes',
        type: 'group'
    }, hasCol ? {
        from: {
            data: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.COLUMN)],
                    summarize: { '*': ['count'] }
                }]
        }
    } : {}, {
        properties: {
            update: {
                width: { field: { parent: 'cellWidth' } },
                height: {
                    field: { group: 'height' }
                },
                x: hasCol ? {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN),
                    offset: model.scale(channel_1.COLUMN).padding / 2
                } : {
                    value: model.config().facet.scale.padding / 2
                }
            }
        }
    }, model.axis(channel_1.X) ? {
        axes: [axis_1.compileAxis(channel_1.X, model)]
    } : {});
}
function getYAxesGroup(model) {
    var hasRow = model.has(channel_1.ROW);
    var name = model.spec().name;
    return util_1.extend({
        name: (name ? name + '-' : '') + 'y-axes',
        type: 'group'
    }, hasRow ? {
        from: {
            data: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.ROW)],
                    summarize: { '*': ['count'] }
                }]
        }
    } : {}, {
        properties: {
            update: {
                width: {
                    field: { group: 'width' }
                },
                height: { field: { parent: 'cellHeight' } },
                y: hasRow ? {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW),
                    offset: model.scale(channel_1.ROW).padding / 2
                } : {
                    value: model.config().facet.scale.padding / 2
                }
            }
        },
    }, model.axis(channel_1.Y) ? {
        axes: [axis_1.compileAxis(channel_1.Y, model)]
    } : {});
}
function getRowGridGroups(model) {
    var name = model.spec().name;
    var facetGridConfig = model.config().facet.grid;
    var rowGrid = {
        name: (name ? name + '-' : '') + 'row-grid',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.ROW)] }]
        },
        properties: {
            update: {
                y: {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW)
                },
                x: { value: 0, offset: -facetGridConfig.offset },
                x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [rowGrid, {
            name: (name ? name + '-' : '') + 'row-grid-end',
            type: 'rule',
            properties: {
                update: {
                    y: { field: { group: 'height' } },
                    x: { value: 0, offset: -facetGridConfig.offset },
                    x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
function getColumnGridGroups(model) {
    var name = model.spec().name;
    var facetGridConfig = model.config().facet.grid;
    var columnGrid = {
        name: (name ? name + '-' : '') + 'column-grid',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.COLUMN)] }]
        },
        properties: {
            update: {
                x: {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN)
                },
                y: { value: 0, offset: -facetGridConfig.offset },
                y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [columnGrid, {
            name: (name ? name + '-' : '') + 'column-grid-end',
            type: 'rule',
            properties: {
                update: {
                    x: { field: { group: 'width' } },
                    y: { value: 0, offset: -facetGridConfig.offset },
                    y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
//# sourceMappingURL=facet.js.map