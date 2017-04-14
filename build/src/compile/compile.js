"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
var config_1 = require("../config");
var data_1 = require("../data");
var log = require("../log");
var spec_1 = require("../spec");
var toplevelprops_1 = require("../toplevelprops");
var util_1 = require("../util");
var common_1 = require("./common");
var selection_1 = require("./selection/selection");
function compile(inputSpec, logger) {
    if (logger) {
        // set the singleton logger to the provided logger
        log.set(logger);
    }
    try {
        // 1. Convert input spec into a normal form
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec);
        // 2. Instantiate the model with default config
        var config = config_1.initConfig(inputSpec.config);
        var model = common_1.buildModel(spec, null, '', config);
        // 3. Parse each part of the model to produce components that will be assembled later
        // We traverse the whole tree to parse once for each type of components
        // (e.g., data, layout, mark, scale).
        // Please see inside model.parse() for order for compilation.
        model.parse();
        // 4. Assemble a Vega Spec from the parsed components in 3.
        return assemble(model, getTopLevelProperties(inputSpec, config));
    }
    finally {
        // Reset the singleton logger if a logger is provided
        if (logger) {
            log.reset();
        }
    }
}
exports.compile = compile;
function getTopLevelProperties(topLevelSpec, config) {
    return tslib_1.__assign({}, toplevelprops_1.extractTopLevelProperties(config), toplevelprops_1.extractTopLevelProperties(topLevelSpec));
}
function assemble(model, topLevelProperties) {
    // TODO: change type to become VgSpec
    var output = util_1.extend({
        $schema: 'http://vega.github.io/schema/vega/v3.0.json',
    }, { autosize: 'pad' }, // Currently we don't support custom autosize
    topLevelProperties, {
        // Map calculated layout width and height to width and height signals.
        signals: [
            {
                name: 'width',
                update: "data('" + model.getName(data_1.LAYOUT) + "')[0]." + model.getName('width')
            },
            {
                name: 'height',
                update: "data('" + model.getName(data_1.LAYOUT) + "')[0]." + model.getName('height')
            }
        ].concat(selection_1.assembleTopLevelSignals(model))
    }, {
        data: [].concat(model.assembleData(), model.assembleLayout([]), model.assembleSelectionData([])),
        marks: [assembleRootGroup(model)]
    });
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
function assembleRootGroup(model) {
    var rootGroup = util_1.extend({
        name: model.getName('main-group'),
        type: 'group',
    }, model.description ? { description: model.description } : {}, {
        from: { data: model.getName(data_1.LAYOUT) },
        encode: {
            update: util_1.extend({
                width: { field: model.getName('width') },
                height: { field: model.getName('height') }
            }, model.assembleParentGroupProperties(model.config.cell))
        }
    });
    return util_1.extend(rootGroup, model.assembleGroup());
}
exports.assembleRootGroup = assembleRootGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxvQ0FBNkM7QUFDN0MsZ0NBQStCO0FBQy9CLDRCQUE4QjtBQUM5QixnQ0FBMEQ7QUFDMUQsa0RBQStFO0FBQy9FLGdDQUErQjtBQUMvQixtQ0FBb0M7QUFFcEMsbURBQThEO0FBRTlELGlCQUF3QixTQUFpQyxFQUFFLE1BQTRCO0lBQ3JGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxrREFBa0Q7UUFDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsMkNBQTJDO1FBQzNDLHFFQUFxRTtRQUNyRSxJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxDLCtDQUErQztRQUMvQyxJQUFNLE1BQU0sR0FBRyxtQkFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFNLEtBQUssR0FBRyxtQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpELHFGQUFxRjtRQUNyRix1RUFBdUU7UUFDdkUscUNBQXFDO1FBQ3JDLDZEQUE2RDtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCwyREFBMkQ7UUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztZQUFTLENBQUM7UUFDVCxxREFBcUQ7UUFDckQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFD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