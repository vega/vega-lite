"use strict";
var Model_1 = require('./Model');
var axis_1 = require('./axis');
var data_1 = require('./data');
var layout_1 = require('./layout');
var facet_1 = require('./facet');
var legend_1 = require('./legend');
var mark_1 = require('./mark/mark');
var scale_1 = require('./scale');
var common_1 = require('./common');
var util_1 = require('../util');
var data_2 = require('../data');
var channel_1 = require('../channel');
var Model_2 = require('./Model');
exports.Model = Model_2.Model;
function compile(spec) {
    var model = new Model_1.Model(spec);
    var config = model.config();
    var output = util_1.extend(spec.name ? { name: spec.name } : {}, {
        width: 1,
        height: 1,
        padding: 'auto'
    }, config.viewport ? { viewport: config.viewport } : {}, config.background ? { background: config.background } : {}, {
        data: data_1.compileData(model).concat([layout_1.compileLayoutData(model)]),
        marks: [compileRootGroup(model)]
    });
    return {
        spec: output
    };
}
exports.compile = compile;
function compileRootGroup(model) {
    var spec = model.spec();
    var rootGroup = util_1.extend({
        name: spec.name ? spec.name + '-root' : 'root',
        type: 'group',
    }, spec.description ? { description: spec.description } : {}, {
        from: { data: data_2.LAYOUT },
        properties: {
            update: {
                width: { field: 'width' },
                height: { field: 'height' }
            }
        }
    });
    var marks = mark_1.compileMark(model);
    if (model.has(channel_1.ROW) || model.has(channel_1.COLUMN)) {
        util_1.extend(rootGroup, facet_1.facetMixins(model, marks));
    }
    else {
        common_1.applyConfig(rootGroup.properties.update, model.config().cell, common_1.FILL_STROKE_CONFIG.concat(['clip']));
        rootGroup.marks = marks;
        rootGroup.scales = scale_1.compileScales(model);
        var axes = (model.has(channel_1.X) && model.axis(channel_1.X) ? [axis_1.compileAxis(channel_1.X, model)] : [])
            .concat(model.has(channel_1.Y) && model.axis(channel_1.Y) ? [axis_1.compileAxis(channel_1.Y, model)] : []);
        if (axes.length > 0) {
            rootGroup.axes = axes;
        }
    }
    var legends = legend_1.compileLegends(model);
    if (legends.length > 0) {
        rootGroup.legends = legends;
    }
    return rootGroup;
}
exports.compileRootGroup = compileRootGroup;
//# sourceMappingURL=compile.js.map