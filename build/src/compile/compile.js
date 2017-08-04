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
        var model = common_1.buildModel(spec, null, '', undefined, undefined, config);
        // 4. Parse parts of each model to produce components that can be merged
        // and assembled easily as a part of a model.
        // In this phase, we do a bottom-up traversal over the whole tree to
        // parse for each type of components once (e.g., data, layout, mark, scale).
        // By doing bottom-up traversal, we start parsing components of unit specs and
        // then merge child components of parent composite specs.
        //
        // Please see inside model.parse() for order of different components parsed.
        model.parse();
        // 5. Assemble a Vega Spec from the parsed components in 3.
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
        autosize: topLevelProperties.autoResize ? { type: 'pad', resize: true } : 'pad' }, topLevelProps, (encode ? { encode: { update: encode } } : {}), { data: [].concat(model.assembleSelectionData([]), model.assembleData()) }, model.assembleGroup(model.assembleLayoutSignals().concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxvQ0FBMEQ7QUFDMUQsNEJBQThCO0FBQzlCLGdDQUFrRTtBQUNsRSxrREFBK0U7QUFFL0UsbUNBQW9DO0FBTXBDLGlCQUF3QixTQUErQixFQUFFLE1BQTRCO0lBQ25GLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxrREFBa0Q7UUFDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsdUJBQXVCO1FBQ3ZCLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLCtDQUErQztRQUMvQyxxRUFBcUU7UUFDckUsSUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFMUMsK0VBQStFO1FBQy9FLHdHQUF3RztRQUN4RyxJQUFNLEtBQUssR0FBRyxtQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFdkUsd0VBQXdFO1FBQ3hFLDZDQUE2QztRQUM3QyxvRUFBb0U7UUFDcEUsNEVBQTRFO1FBQzVFLDhFQUE4RTtRQUM5RSx5REFBeUQ7UUFDekQsRUFBRTtRQUNGLDRFQUE0RTtRQUM1RSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCwyREFBMkQ7UUFDM0QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO1lBQVMsQ0FBQztRQUNULHFEQUFxRDtRQUNyRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBcENELDBCQW9DQztBQUdELCtCQUErQixZQUEyQixFQUFFLE1BQWM7SUFDeEUsTUFBTSxzQkFDRCx5Q0FBeUIsQ0FBQyxNQUFNLENBQUMsRUFDakMseUNBQXlCLENBQUMsWUFBWSxDQUFDLEVBQzFDO0FBQ0osQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsK0JBQStCLEtBQVksRUFBRSxrQkFBc0M7SUFDakYscUNBQXFDO0lBRXJDLDZDQUE2QztJQUM3QyxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLG9CQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUV0RSwwQ0FBMEM7SUFDbkMsSUFBQSwwQ0FBVSxFQUFFLGtFQUFnQixDQUF1QjtJQUUxRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztJQUNyRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBTSxNQUFNLHNCQUNWLE9BQU8sRUFBRSw4Q0FBOEMsSUFDcEQsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUQseURBQXlEO1FBQ3pELFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsR0FBRyxLQUFLLElBQzFFLGFBQWEsRUFDYixDQUFDLE1BQU0sR0FBRyxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUM3QyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FDYixLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLEVBQy9CLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FDckIsSUFDRSxLQUFLLENBQUMsYUFBYSxDQUNqQixLQUFLLENBQUMscUJBQXFCLEVBQUUsUUFDN0IsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsQ0FBQyxFQUM3QyxFQUNDLENBQUMsUUFBUSxHQUFHLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUN4QyxDQUFDO0lBRUYsTUFBTSxDQUFDO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixrQ0FBa0M7S0FDbkMsQ0FBQztBQUNKLENBQUMifQ==