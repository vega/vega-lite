"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var vlFieldDef = require("../fielddef");
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
function compile(inputSpec, opt) {
    if (opt === void 0) { opt = {}; }
    if (opt.logger) {
        // set the singleton logger to the provided logger
        log.set(opt.logger);
    }
    if (opt.fieldTitle) {
        // set the singleton field title formatter
        vlFieldDef.setTitleFormatter(opt.fieldTitle);
    }
    try {
        // 1. initialize config
        var config = config_1.initConfig(util_1.mergeDeep({}, opt.config, inputSpec.config));
        // 2. Convert input spec into a normalized form
        // (Normalize autosize to be a autosize properties object.)
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec, config);
        // 3. Instantiate the models with default config by doing a top-down traversal.
        // This allows us to pass properties that child models derive from their parents via their constructors.
        var autosize = toplevelprops_1.normalizeAutoSize(inputSpec.autosize, config.autosize, spec_1.isLayerSpec(spec) || spec_1.isUnitSpec(spec));
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
        if (opt.logger) {
            log.reset();
        }
        // Reset the singleton field title formatter if provided
        if (opt.fieldTitle) {
            vlFieldDef.resetTitleFormatter();
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
            topLevelProperties[signal.name] = +signal.value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBQXFFO0FBQ3JFLHdDQUEwQztBQUMxQyw0QkFBOEI7QUFDOUIsZ0NBQTZHO0FBQzdHLGtEQUFrSDtBQUNsSCxnQ0FBd0M7QUFDeEMsMkNBQXdDO0FBQ3hDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFVakQ7O0dBRUc7QUFDSCxpQkFBd0IsU0FBK0IsRUFBRSxHQUF3QjtJQUF4QixvQkFBQSxFQUFBLFFBQXdCO0lBQy9FLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2Ysa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuQiwwQ0FBMEM7UUFDMUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsdUJBQXVCO1FBQ3ZCLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV2RSwrQ0FBK0M7UUFDL0MsMkRBQTJEO1FBQzNELHFFQUFxRTtRQUNyRSxJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUxQywrRUFBK0U7UUFDL0Usd0dBQXdHO1FBQ3hHLElBQU0sUUFBUSxHQUFHLGlDQUFpQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxrQkFBVyxDQUFDLElBQUksQ0FBQyxJ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