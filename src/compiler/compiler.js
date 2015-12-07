var Model_1 = require('./Model');
var axis_1 = require('./axis');
var data_1 = require('./data');
var facet_1 = require('./facet');
var legend_1 = require('./legend');
var marks_1 = require('./marks');
var scale_1 = require('./scale');
var util_1 = require('../util');
var data_2 = require('../data');
var channel_1 = require('../channel');
var Model_2 = require('./Model');
exports.Model = Model_2.Model;
function compile(spec, theme) {
    var model = new Model_1.Model(spec, theme);
    var layout = model.layout();
    var rootGroup = util_1.extend({
        name: spec.name ? spec.name + '_root' : 'root',
        type: 'group',
    }, spec.description ? { description: spec.description } : {}, {
        from: { data: data_2.LAYOUT },
        properties: {
            update: {
                width: layout.width.field ?
                    { field: layout.width.field } :
                    { value: layout.width },
                height: layout.height.field ?
                    { field: layout.height.field } :
                    { value: layout.height }
            }
        }
    });
    var marks = marks_1.compileMarks(model);
    if (model.has(channel_1.ROW) || model.has(channel_1.COLUMN)) {
        util_1.extend(rootGroup, facet_1.facetMixins(model, marks));
    }
    else {
        rootGroup.marks = marks.map(function (mark) {
            mark.from = mark.from || {};
            mark.from.data = model.dataTable();
            return mark;
        });
        var scaleNames = model.map(function (_, channel) {
            return channel;
        });
        rootGroup.scales = scale_1.compileScales(scaleNames, model);
        var axes = (model.has(channel_1.X) ? [axis_1.compileAxis(channel_1.X, model)] : [])
            .concat(model.has(channel_1.Y) ? [axis_1.compileAxis(channel_1.Y, model)] : []);
        if (axes.length > 0) {
            rootGroup.axes = axes;
        }
    }
    var legends = legend_1.compileLegends(model);
    if (legends.length > 0) {
        rootGroup.legends = legends;
    }
    var FIT = 1;
    var output = util_1.extend(spec.name ? { name: spec.name } : {}, {
        width: layout.width.field ? FIT : layout.width,
        height: layout.height.field ? FIT : layout.height,
        padding: 'auto'
    }, ['viewport', 'background', 'scene'].reduce(function (topLevelConfig, property) {
        var value = model.config(property);
        if (value !== undefined) {
            topLevelConfig[property] = value;
        }
        return topLevelConfig;
    }, {}), {
        data: data_1.compileData(model),
        marks: [rootGroup]
    });
    return {
        spec: output
    };
}
exports.compile = compile;
//# sourceMappingURL=compiler.js.map