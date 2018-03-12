"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
 * Vega-Lite's main function, for compiling Vega-lite spec into Vega spec.
 *
 * At a high-level, we make the following transformations in different phases:
 *
 * Input spec
 *     |
 *     |  (Normalization)
 *     v
 * Normalized Spec
 *     |
 *     |  (Build Model)
 *     v
 * A model tree of the spec
 *     |
 *     |  (Parse)
 *     v
 * A model tree with parsed components (intermediate structure of visualization primitives in a format that can be easily merged)
 *     |
 *     | (Optimize)
 *     v
 * A model tree with parsed components with the data component optimized
 *     |
 *     | (Assemble)
 *     v
 * Vega spec
 */
function compile(inputSpec, opt) {
    if (opt === void 0) { opt = {}; }
    // 0. Augment opt with default opts
    if (opt.logger) {
        // set the singleton logger to the provided logger
        log.set(opt.logger);
    }
    if (opt.fieldTitle) {
        // set the singleton field title formatter
        vlFieldDef.setTitleFormatter(opt.fieldTitle);
    }
    try {
        // 1. Initialize config by deep merging default config with the config provided via option and the input spec.
        var config = config_1.initConfig(util_1.mergeDeep({}, opt.config, inputSpec.config));
        // 2. Normalize: Convert input spec -> normalized spec
        // - Decompose all extended unit specs into composition of unit spec.  For example, a box plot get expanded into multiple layers of bars, ticks, and rules. The shorthand row/column channel is also expanded to a facet spec.
        var spec = spec_1.normalize(inputSpec, config);
        // - Normalize autosize to be a autosize properties object.
        var autosize = toplevelprops_1.normalizeAutoSize(inputSpec.autosize, config.autosize, spec_1.isLayerSpec(spec) || spec_1.isUnitSpec(spec));
        // 3. Build Model: normalized spec -> Model (a tree structure)
        // This phases instantiates the models with default config by doing a top-down traversal. This allows us to pass properties that child models derive from their parents via their constructors.
        // See the abstract `Model` class and its children (UnitModel, LayerModel, FacetModel, RepeatModel, ConcatModel) for different types of models.
        var model = buildmodel_1.buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');
        // 4 Parse: Model --> Model with components (components = intermediate that can be merged
        // and assembled easily)
        // In this phase, we do a bottom-up traversal over the whole tree to
        // parse for each type of components once (e.g., data, layout, mark, scale).
        // By doing bottom-up traversal, we start parsing components of unit specs and
        // then merge child components of parent composite specs.
        //
        // Please see inside model.parse() for order of different components parsed.
        model.parse();
        // 5. Optimize the dataflow.  This will modify the data component of the model.
        optimize_1.optimizeDataflow(model.component.data);
        // 6. Assemble: convert model and components --> Vega Spec.
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
    return __assign({ autosize: util_1.keys(autosize).length === 1 && autosize.type ? autosize.type : autosize }, toplevelprops_1.extractTopLevelProperties(config), toplevelprops_1.extractTopLevelProperties(topLevelSpec));
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
    var data = [].concat(model.assembleSelectionData([]), 
    // only assemble data in the root
    assemble_1.assembleRootData(model.component.data, topLevelProperties.datasets || {}));
    delete topLevelProperties.datasets;
    var projections = model.assembleProjections();
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
    var output = __assign({ $schema: 'https://vega.github.io/schema/vega/v3.0.json' }, (model.description ? { description: model.description } : {}), topLevelProperties, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: data }, (projections.length > 0 ? { projections: projections } : {}), model.assembleGroup(layoutSignals.concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9DQUFxRTtBQUNyRSx3Q0FBMEM7QUFDMUMsNEJBQThCO0FBQzlCLGdDQUFxRztBQUNyRyxrREFBa0g7QUFDbEgsZ0NBQXdDO0FBQ3hDLDJDQUF3QztBQUN4Qyw0Q0FBaUQ7QUFDakQsNENBQWlEO0FBVWpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILGlCQUF3QixTQUF1QixFQUFFLEdBQXdCO0lBQXhCLG9CQUFBLEVBQUEsUUFBd0I7SUFDdkUsbUNBQW1DO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2Ysa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuQiwwQ0FBMEM7UUFDMUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsOEdBQThHO1FBQzlHLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV2RSxzREFBc0Q7UUFFdEQsOE5BQThOO1FBQzlOLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLDJEQUEyRDtRQUMzRCxJQUFNLFFBQVEsR0FBRyxpQ0FBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JB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Q3hGLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDaEQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFNLE1BQU0sY0FDVixPQUFPLEVBQUUsOENBQThDLElBQ3BELENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDM0Qsa0JBQWtCLEVBQ2xCLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNyQixDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDeEIsSUFBSSxFQUFFLElBQUksSUFDUCxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFELEtBQUssQ0FBQyxhQUFhLENBQ2pCLGFBQWEsUUFDYixLQUFLLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDLEVBQzdDLEVBQ0MsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDeEMsQ0FBQztJQUVGLE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osa0NBQWtDO0tBQ25DLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWcsIGluaXRDb25maWcsIHN0cmlwQW5kUmVkaXJlY3RDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtpc0xheWVyU3BlYywgaXNVbml0U3BlYywgTGF5b3V0U2l6ZU1peGlucywgbm9ybWFsaXplLCBUb3BMZXZlbCwgVG9wTGV2ZWxTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7QXV0b1NpemVQYXJhbXMsIGV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXMsIG5vcm1hbGl6ZUF1dG9TaXplLCBUb3BMZXZlbFByb3BlcnRpZXN9IGZyb20gJy4uL3RvcGxldmVscHJvcHMnO1xuaW1wb3J0IHtrZXlzLCBtZXJnZURlZXB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtvcHRpbWl6ZURhdGFmbG93fSBmcm9tICcuL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZU9wdGlvbnMge1xuICBjb25maWc/OiBDb25maWc7XG4gIGxvZ2dlcj86IGxvZy5Mb2dnZXJJbnRlcmZhY2U7XG5cbiAgZmllbGRUaXRsZT86IHZsRmllbGREZWYuRmllbGRUaXRsZUZvcm1hdHRlcjtcbn1cblxuLyoqXG4gKiBWZWdhLUxpdGUncyBtYWluIGZ1bmN0aW9uLCBmb3IgY29tcGlsaW5nIFZlZ2EtbGl0ZSBzcGVjIGludG8gVmVnYSBzcGVjLlxuICpcbiAqIEF0IGEgaGlnaC1sZXZlbCwgd2UgbWFrZSB0aGUgZm9sbG93aW5nIHRyYW5zZm9ybWF0aW9ucyBpbiBkaWZmZXJlbnQgcGhhc2VzOlxuICpcbiAqIElucHV0IHNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKE5vcm1hbGl6YXRpb24pXG4gKiAgICAgdlxuICogTm9ybWFsaXplZCBTcGVjXG4gKiAgICAgfFxuICogICAgIHwgIChCdWlsZCBNb2RlbClcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgb2YgdGhlIHNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKFBhcnNlKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSB3aXRoIHBhcnNlZCBjb21wb25lbnRzIChpbnRlcm1lZGlhdGUgc3RydWN0dXJlIG9mIHZpc3VhbGl6YXRpb24gcHJpbWl0aXZlcyBpbiBhIGZvcm1hdCB0aGF0IGNhbiBiZSBlYXNpbHkgbWVyZ2VkKVxuICogICAgIHxcbiAqICAgICB8IChPcHRpbWl6ZSlcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgd2l0aCBwYXJzZWQgY29tcG9uZW50cyB3aXRoIHRoZSBkYXRhIGNvbXBvbmVudCBvcHRpbWl6ZWRcbiAqICAgICB8XG4gKiAgICAgfCAoQXNzZW1ibGUpXG4gKiAgICAgdlxuICogVmVnYSBzcGVjXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKGlucHV0U3BlYzogVG9wTGV2ZWxTcGVjLCBvcHQ6IENvbXBpbGVPcHRpb25zID0ge30pIHtcbiAgLy8gMC4gQXVnbWVudCBvcHQgd2l0aCBkZWZhdWx0IG9wdHNcbiAgaWYgKG9wdC5sb2dnZXIpIHtcbiAgICAvLyBzZXQgdGhlIHNpbmdsZXRvbiBsb2dnZXIgdG8gdGhlIHByb3ZpZGVkIGxvZ2dlclxuICAgIGxvZy5zZXQob3B0LmxvZ2dlcik7XG4gIH1cblxuICBpZiAob3B0LmZpZWxkVGl0bGUpIHtcbiAgICAvLyBzZXQgdGhlIHNpbmdsZXRvbiBmaWVsZCB0aXRsZSBmb3JtYXR0ZXJcbiAgICB2bEZpZWxkRGVmLnNldFRpdGxlRm9ybWF0dGVyKG9wdC5maWVsZFRpdGxlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gMS4gSW5pdGlhbGl6ZSBjb25maWcgYnkgZGVlcCBtZXJnaW5nIGRlZmF1bHQgY29uZmlnIHdpdGggdGhlIGNvbmZpZyBwcm92aWRlZCB2aWEgb3B0aW9uIGFuZCB0aGUgaW5wdXQgc3BlYy5cbiAgICBjb25zdCBjb25maWcgPSBpbml0Q29uZmlnKG1lcmdlRGVlcCh7fSwgb3B0LmNvbmZpZywgaW5wdXRTcGVjLmNvbmZpZykpO1xuXG4gICAgLy8gMi4gTm9ybWFsaXplOiBDb252ZXJ0IGlucHV0IHNwZWMgLT4gbm9ybWFsaXplZCBzcGVjXG5cbiAgICAvLyAtIERlY29tcG9zZSBhbGwgZXh0ZW5kZWQgdW5pdCBzcGVjcyBpbnRvIGNvbXBvc2l0aW9uIG9mIHVuaXQgc3BlYy4gIEZvciBleGFtcGxlLCBhIGJveCBwbG90IGdldCBleHBhbmRlZCBpbnRvIG11bHRpcGxlIGxheWVycyBvZiBiYXJzLCB0aWNrcywgYW5kIHJ1bGVzLiBUaGUgc2hvcnRoYW5kIHJvdy9jb2x1bW4gY2hhbm5lbCBpcyBhbHNvIGV4cGFuZGVkIHRvIGEgZmFjZXQgc3BlYy5cbiAgICBjb25zdCBzcGVjID0gbm9ybWFsaXplKGlucHV0U3BlYywgY29uZmlnKTtcbiAgICAvLyAtIE5vcm1hbGl6ZSBhdXRvc2l6ZSB0byBiZSBhIGF1dG9zaXplIHByb3BlcnRpZXMgb2JqZWN0LlxuICAgIGNvbnN0IGF1dG9zaXplID0gbm9ybWFsaXplQXV0b1NpemUoaW5wdXRTcGVjLmF1dG9zaXplLCBjb25maWcuYXV0b3NpemUsIGlzTGF5ZXJTcGVjKHNwZWMpIHx8IGlzVW5pdFNwZWMoc3BlYykpO1xuXG4gICAgLy8gMy4gQnVpbGQgTW9kZWw6IG5vcm1hbGl6ZWQgc3BlYyAtPiBNb2RlbCAoYSB0cmVlIHN0cnVjdHVyZSlcblxuICAgIC8vIFRoaXMgcGhhc2VzIGluc3RhbnRpYXRlcyB0aGUgbW9kZWxzIHdpdGggZGVmYXVsdCBjb25maWcgYnkgZG9pbmcgYSB0b3AtZG93biB0cmF2ZXJzYWwuIFRoaXMgYWxsb3dzIHVzIHRvIHBhc3MgcHJvcGVydGllcyB0aGF0IGNoaWxkIG1vZGVscyBkZXJpdmUgZnJvbSB0aGVpciBwYXJlbnRzIHZpYSB0aGVpciBjb25zdHJ1Y3RvcnMuXG4gICAgLy8gU2VlIHRoZSBhYnN0cmFjdCBgTW9kZWxgIGNsYXNzIGFuZCBpdHMgY2hpbGRyZW4gKFVuaXRNb2RlbCwgTGF5ZXJNb2RlbCwgRmFjZXRNb2RlbCwgUmVwZWF0TW9kZWwsIENvbmNhdE1vZGVsKSBmb3IgZGlmZmVyZW50IHR5cGVzIG9mIG1vZGVscy5cbiAgICBjb25zdCBtb2RlbDogTW9kZWwgPSBidWlsZE1vZGVsKHNwZWMsIG51bGwsICcnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29uZmlnLCBhdXRvc2l6ZS50eXBlID09PSAnZml0Jyk7XG5cbiAgICAvLyA0IFBhcnNlOiBNb2RlbCAtLT4gTW9kZWwgd2l0aCBjb21wb25lbnRzIChjb21wb25lbnRzID0gaW50ZXJtZWRpYXRlIHRoYXQgY2FuIGJlIG1lcmdlZFxuICAgIC8vIGFuZCBhc3NlbWJsZWQgZWFzaWx5KVxuXG4gICAgLy8gSW4gdGhpcyBwaGFzZSwgd2UgZG8gYSBib3R0b20tdXAgdHJhdmVyc2FsIG92ZXIgdGhlIHdob2xlIHRyZWUgdG9cbiAgICAvLyBwYXJzZSBmb3IgZWFjaCB0eXBlIG9mIGNvbXBvbmVudHMgb25jZSAoZS5nLiwgZGF0YSwgbGF5b3V0LCBtYXJrLCBzY2FsZSkuXG4gICAgLy8gQnkgZG9pbmcgYm90dG9tLXVwIHRyYXZlcnNhbCwgd2Ugc3RhcnQgcGFyc2luZyBjb21wb25lbnRzIG9mIHVuaXQgc3BlY3MgYW5kXG4gICAgLy8gdGhlbiBtZXJnZSBjaGlsZCBjb21wb25lbnRzIG9mIHBhcmVudCBjb21wb3NpdGUgc3BlY3MuXG4gICAgLy9cbiAgICAvLyBQbGVhc2Ugc2VlIGluc2lkZSBtb2RlbC5wYXJzZSgpIGZvciBvcmRlciBvZiBkaWZmZXJlbnQgY29tcG9uZW50cyBwYXJzZWQuXG4gICAgbW9kZWwucGFyc2UoKTtcblxuICAgIC8vIDUuIE9wdGltaXplIHRoZSBkYXRhZmxvdy4gIFRoaXMgd2lsbCBtb2RpZnkgdGhlIGRhdGEgY29tcG9uZW50IG9mIHRoZSBtb2RlbC5cbiAgICBvcHRpbWl6ZURhdGFmbG93KG1vZGVsLmNvbXBvbmVudC5kYXRhKTtcblxuICAgIC8vIDYuIEFzc2VtYmxlOiBjb252ZXJ0IG1vZGVsIGFuZCBjb21wb25lbnRzIC0tPiBWZWdhIFNwZWMuXG4gICAgcmV0dXJuIGFzc2VtYmxlVG9wTGV2ZWxNb2RlbChtb2RlbCwgZ2V0VG9wTGV2ZWxQcm9wZXJ0aWVzKGlucHV0U3BlYywgY29uZmlnLCBhdXRvc2l6ZSkpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIGlmIGEgbG9nZ2VyIGlzIHByb3ZpZGVkXG4gICAgaWYgKG9wdC5sb2dnZXIpIHtcbiAgICAgIGxvZy5yZXNldCgpO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgc2luZ2xldG9uIGZpZWxkIHRpdGxlIGZvcm1hdHRlciBpZiBwcm92aWRlZFxuICAgIGlmIChvcHQuZmllbGRUaXRsZSkge1xuICAgICAgdmxGaWVsZERlZi5yZXNldFRpdGxlRm9ybWF0dGVyKCk7XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gZ2V0VG9wTGV2ZWxQcm9wZXJ0aWVzKHRvcExldmVsU3BlYzogVG9wTGV2ZWw8YW55PiwgY29uZmlnOiBDb25maWcsIGF1dG9zaXplOiBBdXRvU2l6ZVBhcmFtcykge1xuICByZXR1cm4ge1xuICAgIGF1dG9zaXplOiBrZXlzKGF1dG9zaXplKS5sZW5ndGggPT09IDEgJiYgYXV0b3NpemUudHlwZSA/IGF1dG9zaXplLnR5cGUgOiBhdXRvc2l6ZSxcbiAgICAuLi5leHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzKGNvbmZpZyksXG4gICAgLi4uZXh0cmFjdFRvcExldmVsUHJvcGVydGllcyh0b3BMZXZlbFNwZWMpXG4gIH07XG59XG5cbi8qXG4gKiBBc3NlbWJsZSB0aGUgdG9wLWxldmVsIG1vZGVsLlxuICpcbiAqIE5vdGU6IHRoaXMgY291bGRuJ3QgYmUgYG1vZGVsLmFzc2VtYmxlKClgIHNpbmNlIHRoZSB0b3AtbGV2ZWwgbW9kZWxcbiAqIG5lZWRzIHNvbWUgc3BlY2lhbCB0cmVhdG1lbnQgdG8gZ2VuZXJhdGUgdG9wLWxldmVsIHByb3BlcnRpZXMuXG4gKi9cbmZ1bmN0aW9uIGFzc2VtYmxlVG9wTGV2ZWxNb2RlbChtb2RlbDogTW9kZWwsIHRvcExldmVsUHJvcGVydGllczogVG9wTGV2ZWxQcm9wZXJ0aWVzICYgTGF5b3V0U2l6ZU1peGlucykge1xuICAvLyBUT0RPOiBjaGFuZ2UgdHlwZSB0byBiZWNvbWUgVmdTcGVjXG5cbiAgLy8gQ29uZmlnIHdpdGggVmVnYS1MaXRlIG9ubHkgY29uZmlnIHJlbW92ZWQuXG4gIGNvbnN0IHZnQ29uZmlnID0gbW9kZWwuY29uZmlnID8gc3RyaXBBbmRSZWRpcmVjdENvbmZpZyhtb2RlbC5jb25maWcpIDogdW5kZWZpbmVkO1xuXG4gIGNvbnN0IGRhdGEgPSBbXS5jb25jYXQoXG4gICAgbW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKFtdKSxcbiAgICAvLyBvbmx5IGFzc2VtYmxlIGRhdGEgaW4gdGhlIHJvb3RcbiAgICBhc3NlbWJsZVJvb3REYXRhKG1vZGVsLmNvbXBvbmVudC5kYXRhLCB0b3BMZXZlbFByb3BlcnRpZXMuZGF0YXNldHMgfHwge30pXG4gICk7XG5cbiAgZGVsZXRlIHRvcExldmVsUHJvcGVydGllcy5kYXRhc2V0cztcblxuICBjb25zdCBwcm9qZWN0aW9ucyA9IG1vZGVsLmFzc2VtYmxlUHJvamVjdGlvbnMoKTtcbiAgY29uc3QgdGl0bGUgPSBtb2RlbC5hc3NlbWJsZVRpdGxlKCk7XG4gIGNvbnN0IHN0eWxlID0gbW9kZWwuYXNzZW1ibGVHcm91cFN0eWxlKCk7XG5cbiAgbGV0IGxheW91dFNpZ25hbHMgPSBtb2RlbC5hc3NlbWJsZUxheW91dFNpZ25hbHMoKTtcblxuICAvLyBtb3ZlIHdpZHRoIGFuZCBoZWlnaHQgc2lnbmFscyB3aXRoIHZhbHVlcyB0byB0b3AgbGV2ZWxcbiAgbGF5b3V0U2lnbmFscyA9IGxheW91dFNpZ25hbHMuZmlsdGVyKHNpZ25hbCA9PiB7XG4gICAgaWYgKChzaWduYWwubmFtZSA9PT0gJ3dpZHRoJyB8fCBzaWduYWwubmFtZSA9PT0gJ2hlaWdodCcpICYmIHNpZ25hbC52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0b3BMZXZlbFByb3BlcnRpZXNbc2lnbmFsLm5hbWVdID0gK3NpZ25hbC52YWx1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIGNvbnN0IG91dHB1dCA9IHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS92My4wLmpzb24nLFxuICAgIC4uLihtb2RlbC5kZXNjcmlwdGlvbiA/IHtkZXNjcmlwdGlvbjogbW9kZWwuZGVzY3JpcHRpb259IDoge30pLFxuICAgIC4uLnRvcExldmVsUHJvcGVydGllcyxcbiAgICAuLi4odGl0bGU/IHt0aXRsZX0gOiB7fSksXG4gICAgLi4uKHN0eWxlPyB7c3R5bGV9IDoge30pLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgLi4uKHByb2plY3Rpb25zLmxlbmd0aCA+IDAgPyB7cHJvamVjdGlvbnM6IHByb2plY3Rpb25zfSA6IHt9KSxcbiAgICAuLi5tb2RlbC5hc3NlbWJsZUdyb3VwKFtcbiAgICAgIC4uLmxheW91dFNpZ25hbHMsXG4gICAgICAuLi5tb2RlbC5hc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhbXSlcbiAgICBdKSxcbiAgICAuLi4odmdDb25maWcgPyB7Y29uZmlnOiB2Z0NvbmZpZ30gOiB7fSlcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHNwZWM6IG91dHB1dFxuICAgIC8vIFRPRE86IGFkZCB3YXJuaW5nIC8gZXJyb3JzIGhlcmVcbiAgfTtcbn1cbiJdfQ==