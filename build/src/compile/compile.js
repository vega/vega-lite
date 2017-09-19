"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var log = require("../log");
var spec_1 = require("../spec");
var toplevelprops_1 = require("../toplevelprops");
var util_1 = require("../util");
var buildmodel_1 = require("./buildmodel");
var assemble_1 = require("./data/assemble");
var optimize_1 = require("./data/optimize");
/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
function compile(inputSpec, logger) {
    if (logger) {
        // set the singleton logger to the provided logger
        log.set(logger);
    }
    try {
        // 1. initialize config
        var config = config_1.initConfig(inputSpec.config);
        // 2. Convert input spec into a normalized form
        // (Normalize autosize to be a autosize properties object.)
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec, config);
        // 3. Instantiate the models with default config by doing a top-down traversal.
        // This allows us to pass properties that child models derive from their parents via their constructors.
        var autosize = toplevelprops_1.normalizeAutoSize(inputSpec.autosize, spec_1.isLayerSpec(spec) || spec_1.isUnitSpec(spec));
        var model = buildmodel_1.buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');
        // 4. Parse parts of each model to produce components that can be merged
        // and assembled easily as a part of a model.
        // In this phase, we do a bottom-up traversal over the whole tree to
        // parse for each type of components once (e.g., data, layout, mark, scale).
        // By doing bottom-up traversal, we start parsing components of unit specs and
        // then merge child components of parent composite specs.
        //
        // Please see inside model.parse() for order of different components parsed.
        model.parse();
        // 5. Optimize the datafow.
        optimize_1.optimizeDataflow(model.component.data);
        // 6. Assemble a Vega Spec from the parsed components.
        return assembleTopLevelModel(model, getTopLevelProperties(inputSpec, config, autosize));
    }
    finally {
        // Reset the singleton logger if a logger is provided
        if (logger) {
            log.reset();
        }
    }
}
exports.compile = compile;
function getTopLevelProperties(topLevelSpec, config, autosize) {
    return tslib_1.__assign({ autosize: util_1.keys(autosize).length === 1 && autosize.type ? autosize.type : autosize }, toplevelprops_1.extractTopLevelProperties(config), toplevelprops_1.extractTopLevelProperties(topLevelSpec));
}
/*
 * Assemble the top-level model.
 *
 * Note: this couldn't be `model.assemble()` since the top-level model
 * needs some special treatment to generate top-level properties.
 */
function assembleTopLevelModel(model, topLevelProperties) {
    // TODO: change type to become VgSpec
    // Config with Vega-Lite only config removed.
    var vgConfig = model.config ? config_1.stripAndRedirectConfig(model.config) : undefined;
    var title = model.assembleTitle();
    var style = model.assembleGroupStyle();
    var layoutSignals = model.assembleLayoutSignals();
    // move width and height signals with values to top level
    layoutSignals = layoutSignals.filter(function (signal) {
        if ((signal.name === 'width' || signal.name === 'height') && signal.value !== undefined) {
            topLevelProperties[signal.name] = signal.value;
            return false;
        }
        return true;
    });
    var output = tslib_1.__assign({ $schema: 'https://vega.github.io/schema/vega/v3.0.json' }, (model.description ? { description: model.description } : {}), topLevelProperties, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: [].concat(model.assembleSelectionData([]), 
        // only assemble data in the root
        assemble_1.assembleRootData(model.component.data)) }, model.assembleGroup(layoutSignals.concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBQXFFO0FBQ3JFLDRCQUE4QjtBQUM5QixnQ0FBNkc7QUFDN0csa0RBQWtIO0FBQ2xILGdDQUE2QjtBQUM3QiwyQ0FBd0M7QUFDeEMsNENBQWlEO0FBQ2pELDRDQUFpRDtBQUdqRDs7R0FFRztBQUNILGlCQUF3QixTQUErQixFQUFFLE1BQTRCO0lBQ25GLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxrREFBa0Q7UUFDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsdUJBQXVCO1FBQ3ZCLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLCtDQUErQztRQUMvQywyREFBMkQ7UUFDM0QscUVBQXFFO1FBQ3JFLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLCtFQUErRTtRQUMvRSx3R0FBd0c7UUFDeEcsSUFBTSxRQUFRLEdBQUcsaUNBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxrQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RixJQUFNLEtBQUssR0FBRyx1QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7UUFFaEcsd0VBQXdFO1FBQ3hFLDZDQUE2QztRQUM3QyxvRUFBb0U7UUFDcEUsNEVBQTRFO1FBQzVFLDhFQUE4RTtRQUM5RSx5REFBeUQ7UUFDekQsRUFB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