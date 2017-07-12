"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
var config_1 = require("../config");
var log = require("../log");
var spec_1 = require("../spec");
var toplevelprops_1 = require("../toplevelprops");
var common_1 = require("./common");
var layer_1 = require("./layer");
var unit_1 = require("./unit");
function compile(inputSpec, logger) {
    if (logger) {
        // set the singleton logger to the provided logger
        log.set(logger);
    }
    try {
        // 1. initialize config
        var config = config_1.initConfig(inputSpec.config);
        // 2. Convert input spec into a normal form
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec, config);
        // 3. Instantiate the model with default config
        var model = common_1.buildModel(spec, null, '', undefined, undefined, config);
        // 4. Parse each part of the model to produce components that will be assembled later
        // We traverse the whole tree to parse once for each type of components
        // (e.g., data, layout, mark, scale).
        // Please see inside model.parse() for order for compilation.
        model.parse();
        // 5. Assemble a Vega Spec from the parsed components in 3.
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
    // Config with Vega-Lite only config removed.
    var vgConfig = model.config ? config_1.stripConfig(model.config) : undefined;
    // autoResize has to be put under autosize
    var autoResize = topLevelProperties.autoResize, topLevelProps = tslib_1.__rest(topLevelProperties, ["autoResize"]);
    var encode = model.assembleParentGroupProperties();
    if (encode) {
        delete encode.width;
        delete encode.height;
    }
    var output = tslib_1.__assign({ $schema: 'https://vega.github.io/schema/vega/v3.0.json' }, (model.description ? { description: model.description } : {}), { 
        // By using Vega layout, we don't support custom autosize
        autosize: topLevelProperties.autoResize ? { type: 'pad', resize: true } : 'pad' }, topLevelProps, (encode ? { encode: { update: encode } } : {}), { data: [].concat(model.assembleSelectionData([]), model.assembleData()) }, model.assembleGroup([].concat(
    // TODO(https://github.com/vega/vega-lite/issues/2198):
    // Merge the top-level's width/height signal with the top-level model
    // so we can remove this special casing based on model.name
    ((model.name && ((model instanceof layer_1.LayerModel) || (model instanceof unit_1.UnitModel))) ? [
        // If model has name, its calculated width and height will not be named width and height, need to map it to the global width and height signals.
        { name: 'width', update: model.getName('width') },
        { name: 'height', update: model.getName('height') }
    ] : []), model.assembleLayoutSignals(), model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxvQ0FBMEQ7QUFDMUQsNEJBQThCO0FBQzlCLGdDQUFrRTtBQUNsRSxrREFBK0U7QUFFL0UsbUNBQW9DO0FBQ3BDLGlDQUFtQztBQUVuQywrQkFBaUM7QUFHakMsaUJBQXdCLFNBQStCLEVBQUUsTUFBNEI7SUFDbkYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLGtEQUFrRDtRQUNsRCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCx1QkFBdUI7UUFDdkIsSUFBTSxNQUFNLEdBQUcsbUJBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUMsMkNBQTJDO1FBQzNDLHFFQUFxRTtRQUNyRSxJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUxQywrQ0FBK0M7UUFDL0MsSUFBTSxLQUFLLEdBQUcsbUJBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXZFLHFGQUFxRjtRQUNyRix1RUFBdUU7UUFDdkUscUNBQXFDO1FBQ3JDLDZEQUE2RDtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCwyREFBMkQ7UUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztZQUFTLENBQUM7UUFDVCxxREFBcUQ7UUFDckQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLEdBQUcsQ0FBQyxLQUFL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