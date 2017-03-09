/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../data");
var log = require("../log");
var spec_1 = require("../spec");
var util_1 = require("../util");
var selection_1 = require("./selection/selection");
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
        ].concat(selection_1.assembleTopLevelSignals(model))
    }, {
        data: [].concat(model.assembleData([]), model.assembleLayout([]), model.assembleSelectionData([])),
        marks: [assembleRootGroup(model)]
    });
    return {
        spec: output
        // TODO: add warning / errors here
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7OztBQUVILGdDQUErQjtBQUMvQiw0QkFBOEI7QUFFOUIsZ0NBQWdEO0FBQ2hELGdDQUErQjtBQUMvQixtREFBOEQ7QUFDOUQsbUNBQW9DO0FBRXBDLGlCQUF3QixTQUF1QixFQUFFLE1BQTRCO0lBQzNFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxrREFBa0Q7UUFDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsMkNBQTJDO1FBQzNDLHFFQUFxRTtRQUNyRSxJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxDLG1EQUFtRDtRQUNuRCxJQUFNLEtBQUssR0FBRyxtQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekMscUZBQXFGO1FBQ3JGLHVFQUF1RTtRQUN2RSxxQ0FBcUM7UUFDckMsNkRBQTZEO1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVkLDJEQUEyRDtRQUMzRCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7WUFBUyxDQUFDO1FBQ1QscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUE1QkQsMEJBNEJDO0FBRUQsa0JBQWtCLEtBQVk7SUFDNUIscUNBQXFDO0lBQ3JDLElBQU0sTUFBTSxHQUFHLGFBQU0sQ0FDbkI7UUFDRSxPQUFPLEVBQUUsNkNBQTZDO0tBQ3ZELEVBQ0QsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEVBQzlCO1FBQ0Usc0VBQXNFO1FBQ3RFLE9BQU8sRUFBRTtZQUNQO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLE1BQU0sRUFBRSx5QkFBeUI7YUFDbEM7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsMEJBQTBCO2FBQ25DO1NBQ0YsQ0FBQyxNQUFNLENBQUMsbUNBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekMsRUFBQztRQUNBLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUNiLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQ3RCLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEVBQ3hCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FDaEM7UUFDRCxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsQyxDQUFDLENBQUM7SUFFTCxNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLGtDQUFrQztLQUNuQyxDQUFDO0FBQ0osQ0FBQztBQUVELGlDQUF3QyxLQUFZO0lBQ2xELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsTUFBTSxDQUFDLGFBQU07SUFDWCxxREFBcUQ7SUFDckQsRUFBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFDLEVBQzFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxFQUNqQixNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsR0FBRyxFQUFFLEVBQ2xELE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUUsQ0FDekQsQ0FBQztBQUNKLENBQUM7QUFURCwwREFTQztBQUVELDJCQUFrQyxLQUFZO0lBQzVDLElBQUksU0FBUyxHQUFPLGFBQU0sQ0FDeEI7UUFDRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxFQUFFLE9BQU87S0FDZCxFQUNELEtBQUssQ0FBQyxXQUFXLEdBQUcsRUFBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUUsRUFDekQ7UUFDRSxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFNLEdBQUUsRUFBRSxDQUFDLEVBQUM7UUFDdkMsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLGFBQU0sQ0FDWjtnQkFDRSxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQztnQkFDdEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUM7YUFDekMsRUFDRCxLQUFLLENBQUMsNkJBQTZCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FDdkQ7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVMLE1BQU0sQ0FBQyxhQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFyQkQsOENBcUJDIn0=