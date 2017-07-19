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
        autosize: topLevelProperties.autoResize ? { type: 'pad', resize: true } : 'pad' }, topLevelProps, (encode ? { encode: { update: encode } } : {}), { data: [].concat(model.assembleSelectionData([]), model.assembleData()) }, model.assembleGroup([].concat(model.assembleLayoutSignals(), model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxvQ0FBMEQ7QUFDMUQsNEJBQThCO0FBQzlCLGdDQUFrRTtBQUNsRSxrREFBK0U7QUFFL0UsbUNBQW9DO0FBTXBDLGlCQUF3QixTQUErQixFQUFFLE1BQTRCO0lBQ25GLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxrREFBa0Q7UUFDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsdUJBQXVCO1FBQ3ZCLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLDJDQUEyQztRQUMzQyxxRUFBcUU7UUFDckUsSUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFMUMsK0NBQStDO1FBQy9DLElBQU0sS0FBSyxHQUFHLG1CQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2RSxxRkFBcUY7UUFDckYsdUVBQXVFO1FBQ3ZFLHFDQUFxQztRQUNyQyw2REFBNkQ7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWQsMkRBQTJEO1FBQzNELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7WUFBUyxDQUFDO1FBQ1QscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUEvQkQsMEJBK0JDO0FBR0QsK0JBQStCLFlBQTJCLEVBQUUsTUFBYztJQUN4RSxNQUFNLHNCQUNELHlDQUF5QixDQUFDLE1BQU0sQ0FBQyxFQUNqQyx5Q0FBeUIsQ0FBQyxZQUFZLENBQUMsRUFDMUM7QUFDSixDQUFDO0FBRUQsa0JBQWtCLEtBQVksRUFBRSxrQkFBc0M7SUFDcEUscUNBQXFDO0lBRXJDLDZDQUE2QztJQUM3QyxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLG9CQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUV0RSwwQ0FBMEM7SUFDbkMsSUFBQSwwQ0FBVSxFQUFFLGtFQUFnQixDQUF1QjtJQUUxRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztJQUNyRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBTSxNQUFNLHNCQUNWLE9BQU8sRUFBRSw4Q0FBOEMsSUFDcEQsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUQseURBQXlEO1FBQ3pELFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsR0FBRyxLQUFLLElBQzFFLGFBQWEsRUFDYixDQUFDLE1BQU0sR0FBRyxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUM3QyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FDYixLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLEVBQy9CLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FDckIsSUFDRSxLQUFLLENBQUMsYUFBYSxDQUNwQixFQUFFLENBQUMsTUFBTSxDQUNQLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxFQUM3QixLQUFLLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDLENBQzNDLENBQ0YsRUFDRSxDQUFDLFFBQVEsR0FBRyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsR0FBRyxFQUFFLENBQUMsQ0FDeEMsQ0FBQztJQUVGLE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osa0NBQWtDO0tBQ25DLENBQUM7QUFDSixDQUFDIn0=