/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
"use strict";
var data_1 = require("../data");
var log = require("../log");
var spec_1 = require("../spec");
var util_1 = require("../util");
var common_1 = require("./common");
function compile(inputSpec, logger) {
    if (logger) {
        // set the singleton logger to the provided logger
        log.set(logger);
    }
    try {
        // 1. Convert input spec into a normal form
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec);
        // 2. Instantiate the model with default properties
        var model = common_1.buildModel(spec, null, '');
        // 3. Parse each part of the model to produce components that will be assembled later
        // We traverse the whole tree to parse once for each type of components
        // (e.g., data, layout, mark, scale).
        // Please see inside model.parse() for order for compilation.
        model.parse();
        // 4. Assemble a Vega Spec from the parsed components in 3.
        return assemble(model);
    }
    finally {
        // Reset the singleton logger if a logger is provided
        if (logger) {
            log.reset();
        }
    }
}
exports.compile = compile;
function assemble(model) {
    // TODO: change type to become VgSpec
    var output = util_1.extend({
        $schema: 'http://vega.github.io/schema/vega/v3.0.json',
    }, topLevelBasicProperties(model), {
        // Map calculated layout width and height to width and height signals.
        signals: [
            {
                name: 'width',
                update: "data('layout')[0].width"
            },
            {
                name: 'height',
                update: "data('layout')[0].height"
            }
        ] // TODO: concat.(model.assembleTopLevelSignals())
    }, {
        data: [].concat(model.assembleData([]), model.assembleLayout([])),
        marks: [assembleRootGroup(model)]
    });
    return {
        spec: output
    };
}
function topLevelBasicProperties(model) {
    var config = model.config;
    return util_1.extend(
    // TODO: Add other top-level basic properties (#1778)
    { padding: model.padding || config.padding }, { autosize: 'pad' }, config.viewport ? { viewport: config.viewport } : {}, config.background ? { background: config.background } : {});
}
exports.topLevelBasicProperties = topLevelBasicProperties;
function assembleRootGroup(model) {
    var rootGroup = util_1.extend({
        name: model.getName('main'),
        type: 'group',
    }, model.description ? { description: model.description } : {}, {
        from: { data: model.getName(data_1.LAYOUT + '') },
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
//# sourceMappingURL=compile.js.map