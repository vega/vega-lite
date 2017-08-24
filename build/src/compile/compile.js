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
var buildmodel_1 = require("./buildmodel");
var assemble_1 = require("./data/assemble");
var optimize_1 = require("./data/optimize");
function compile(inputSpec, logger) {
    if (logger) {
        // set the singleton logger to the provided logger
        log.set(logger);
    }
    try {
        // 1. initialize config
        var config = config_1.initConfig(inputSpec.config);
        // 2. Convert input spec into a normalized form
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec, config);
        // 3. Instantiate the models with default config by doing a top-down traversal.
        // This allows us to pass properties that child models derive from their parents via their constructors.
        var model = buildmodel_1.buildModel(spec, null, '', undefined, undefined, config);
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
        return assembleTopLevelModel(model, getTopLevelProperties(inputSpec, config));
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
    // autoResize has to be put under autosize
    var autoResize = topLevelProperties.autoResize, topLevelProps = tslib_1.__rest(topLevelProperties, ["autoResize"]);
    var title = model.assembleTitle();
    var style = model.assembleGroupStyle();
    var output = tslib_1.__assign({ $schema: 'https://vega.github.io/schema/vega/v3.0.json' }, (model.description ? { description: model.description } : {}), { 
        // By using Vega layout, we don't support custom autosize
        autosize: topLevelProperties.autoResize ? { type: 'pad', resize: true } : 'pad' }, topLevelProps, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: [].concat(model.assembleSelectionData([]), 
        // only assemble data in the root
        assemble_1.assembleRootData(model.component.data)) }, model.assembleGroup(model.assembleLayoutSignals().concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxvQ0FBcUU7QUFDckUsNEJBQThCO0FBQzlCLGdDQUFrRTtBQUNsRSxrREFBK0U7QUFDL0UsMkNBQXdDO0FBQ3hDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFHakQsaUJBQXdCLFNBQStCLEVBQUUsTUFBNEI7SUFDbkYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLGtEQUFrRDtRQUNsRCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCx1QkFBdUI7UUFDdkIsSUFBTSxNQUFNLEdBQUcsbUJBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUMsK0NBQStDO1FBQy9DLHFFQUFxRTtRQUNyRSxJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUxQywrRUFBK0U7UUFDL0Usd0dBQXdHO1FBQ3hHLElBQU0sS0FBSyxHQUFHLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2RSx3RUFBd0U7UUFDeEUsNkNBQTZDO1FBQzdDLG9FQUFvRTtRQUNwRSw0RUFBNEU7UUFDNUUsOEVBQThFO1FBQzlFLHlEQUF5RDtRQUN6RCxFQUFFO1FBQ0YsNEVBQTRFO1FBQzVFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVkLDJCQUEyQjtRQUMzQiwyQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLHNEQUFzRDtRQUN0RCxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7WUFBUyxDQUFDO1FBQ1QscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUF2Q0QsMEJBdUNDO0FBR0QsK0JBQStCLFlBQTJCLEVBQUUsTUFBYztJQUN4RSxNQUFNLHNCQUNELHlDQUF5QixDQUFDLE1BQU0sQ0FBQyxFQUNqQyx5Q0FBeUIsQ0FBQyxZQUFZLENBQUMsRUFDMUM7QUFDSixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCwrQkFBK0IsS0FBWSxFQUFFLGtCQUFzQztJQUNqRixxQ0FBcUM7SUFFckMsNkNBQTZDO0lBQzdDLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsK0JBQXNCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVqRiwwQ0FBMEM7SUFDbkMsSUFBQSwwQ0FBVSxFQUFFLGtFQUFnQixDQUF1QjtJQUUxRCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDcEMsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFFekMsSUFBTSxNQUFNLHNCQUNWLE9BQU8sRUFBRSw4Q0FBOEMsSUFDcEQsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUQseURBQXlEO1FBQ3pELFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsR0FBRyxLQUFLLElBQzFFLGFBQWEsRUFDYixDQUFDLEtBQUssR0FBRSxFQUFDLEtBQUssT0FBQSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQ3JCLENBQUMsS0FBSyxHQUFFLEVBQUMsS0FBSyxPQUFBLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFDeEIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQ2IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQztRQUMvQixpQ0FBaUM7UUFDakMsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FDdkMsSUFDRSxLQUFLLENBQUMsYUFBYSxDQUNqQixLQUFLLENBQUMscUJBQXFCLEVBQUUsUUFDN0IsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsQ0FBQyxFQUM3QyxFQUNDLENBQUMsUUFBUSxHQUFHLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUN4QyxDQUFDO0lBRUYsTUFBTSxDQUFDO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixrQ0FBa0M7S0FDbkMsQ0FBQztBQUNKLENBQUMifQ==