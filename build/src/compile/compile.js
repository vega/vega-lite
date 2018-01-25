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
    assemble_1.assembleRootData(model.component.data));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9DQUFxRTtBQUNyRSx3Q0FBMEM7QUFDMUMsNEJBQThCO0FBQzlCLGdDQUE2RztBQUM3RyxrREFBa0g7QUFDbEgsZ0NBQXdDO0FBQ3hDLDJDQUF3QztBQUN4Qyw0Q0FBaUQ7QUFDakQsNENBQWlEO0FBVWpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILGlCQUF3QixTQUErQixFQUFFLEdBQXdCO0lBQXhCLG9CQUFBLEVBQUEsUUFBd0I7SUFDL0UsbUNBQW1DO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2Ysa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuQiwwQ0FBMEM7UUFDMUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsOEdBQThHO1FBQzlHLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV2RSxzREFBc0Q7UUFFdEQsOE5BQThOO1FBQzlOLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLDJEQUEyRDtRQUMzRCxJQUFNLFFBQVEsR0FBRyxpQ0FBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JB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O1lBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBTSxNQUFNLGNBQ1YsT0FBTyxFQUFFLDhDQUE4QyxJQUNwRCxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzNELGtCQUFrQixFQUNsQixDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDckIsQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQ3hCLElBQUksRUFBRSxJQUFJLElBQ1AsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUMxRCxLQUFLLENBQUMsYUFBYSxDQUNqQixhQUFhLFFBQ2IsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsQ0FBQyxFQUM3QyxFQUNDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ3hDLENBQUM7SUFFRixNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLGtDQUFrQztLQUNuQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnLCBpbml0Q29uZmlnLCBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNMYXllclNwZWMsIGlzVW5pdFNwZWMsIExheW91dFNpemVNaXhpbnMsIG5vcm1hbGl6ZSwgVG9wTGV2ZWwsIFRvcExldmVsRXh0ZW5kZWRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7QXV0b1NpemVQYXJhbXMsIGV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXMsIG5vcm1hbGl6ZUF1dG9TaXplLCBUb3BMZXZlbFByb3BlcnRpZXN9IGZyb20gJy4uL3RvcGxldmVscHJvcHMnO1xuaW1wb3J0IHtrZXlzLCBtZXJnZURlZXB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtvcHRpbWl6ZURhdGFmbG93fSBmcm9tICcuL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZU9wdGlvbnMge1xuICBjb25maWc/OiBDb25maWc7XG4gIGxvZ2dlcj86IGxvZy5Mb2dnZXJJbnRlcmZhY2U7XG5cbiAgZmllbGRUaXRsZT86IHZsRmllbGREZWYuRmllbGRUaXRsZUZvcm1hdHRlcjtcbn1cblxuLyoqXG4gKiBWZWdhLUxpdGUncyBtYWluIGZ1bmN0aW9uLCBmb3IgY29tcGlsaW5nIFZlZ2EtbGl0ZSBzcGVjIGludG8gVmVnYSBzcGVjLlxuICpcbiAqIEF0IGEgaGlnaC1sZXZlbCwgd2UgbWFrZSB0aGUgZm9sbG93aW5nIHRyYW5zZm9ybWF0aW9ucyBpbiBkaWZmZXJlbnQgcGhhc2VzOlxuICpcbiAqIElucHV0IHNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKE5vcm1hbGl6YXRpb24pXG4gKiAgICAgdlxuICogTm9ybWFsaXplZCBTcGVjXG4gKiAgICAgfFxuICogICAgIHwgIChCdWlsZCBNb2RlbClcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgb2YgdGhlIHNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKFBhcnNlKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSB3aXRoIHBhcnNlZCBjb21wb25lbnRzIChpbnRlcm1lZGlhdGUgc3RydWN0dXJlIG9mIHZpc3VhbGl6YXRpb24gcHJpbWl0aXZlcyBpbiBhIGZvcm1hdCB0aGF0IGNhbiBiZSBlYXNpbHkgbWVyZ2VkKVxuICogICAgIHxcbiAqICAgICB8IChPcHRpbWl6ZSlcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgd2l0aCBwYXJzZWQgY29tcG9uZW50cyB3aXRoIHRoZSBkYXRhIGNvbXBvbmVudCBvcHRpbWl6ZWRcbiAqICAgICB8XG4gKiAgICAgfCAoQXNzZW1ibGUpXG4gKiAgICAgdlxuICogVmVnYSBzcGVjXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKGlucHV0U3BlYzogVG9wTGV2ZWxFeHRlbmRlZFNwZWMsIG9wdDogQ29tcGlsZU9wdGlvbnMgPSB7fSkge1xuICAvLyAwLiBBdWdtZW50IG9wdCB3aXRoIGRlZmF1bHQgb3B0c1xuICBpZiAob3B0LmxvZ2dlcikge1xuICAgIC8vIHNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciB0byB0aGUgcHJvdmlkZWQgbG9nZ2VyXG4gICAgbG9nLnNldChvcHQubG9nZ2VyKTtcbiAgfVxuXG4gIGlmIChvcHQuZmllbGRUaXRsZSkge1xuICAgIC8vIHNldCB0aGUgc2luZ2xldG9uIGZpZWxkIHRpdGxlIGZvcm1hdHRlclxuICAgIHZsRmllbGREZWYuc2V0VGl0bGVGb3JtYXR0ZXIob3B0LmZpZWxkVGl0bGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyAxLiBJbml0aWFsaXplIGNvbmZpZyBieSBkZWVwIG1lcmdpbmcgZGVmYXVsdCBjb25maWcgd2l0aCB0aGUgY29uZmlnIHByb3ZpZGVkIHZpYSBvcHRpb24gYW5kIHRoZSBpbnB1dCBzcGVjLlxuICAgIGNvbnN0IGNvbmZpZyA9IGluaXRDb25maWcobWVyZ2VEZWVwKHt9LCBvcHQuY29uZmlnLCBpbnB1dFNwZWMuY29uZmlnKSk7XG5cbiAgICAvLyAyLiBOb3JtYWxpemU6IENvbnZlcnQgaW5wdXQgc3BlYyAtPiBub3JtYWxpemVkIHNwZWNcblxuICAgIC8vIC0gRGVjb21wb3NlIGFsbCBleHRlbmRlZCB1bml0IHNwZWNzIGludG8gY29tcG9zaXRpb24gb2YgdW5pdCBzcGVjLiAgRm9yIGV4YW1wbGUsIGEgYm94IHBsb3QgZ2V0IGV4cGFuZGVkIGludG8gbXVsdGlwbGUgbGF5ZXJzIG9mIGJhcnMsIHRpY2tzLCBhbmQgcnVsZXMuIFRoZSBzaG9ydGhhbmQgcm93L2NvbHVtbiBjaGFubmVsIGlzIGFsc28gZXhwYW5kZWQgdG8gYSBmYWNldCBzcGVjLlxuICAgIGNvbnN0IHNwZWMgPSBub3JtYWxpemUoaW5wdXRTcGVjLCBjb25maWcpO1xuICAgIC8vIC0gTm9ybWFsaXplIGF1dG9zaXplIHRvIGJlIGEgYXV0b3NpemUgcHJvcGVydGllcyBvYmplY3QuXG4gICAgY29uc3QgYXV0b3NpemUgPSBub3JtYWxpemVBdXRvU2l6ZShpbnB1dFNwZWMuYXV0b3NpemUsIGNvbmZpZy5hdXRvc2l6ZSwgaXNMYXllclNwZWMoc3BlYykgfHwgaXNVbml0U3BlYyhzcGVjKSk7XG5cbiAgICAvLyAzLiBCdWlsZCBNb2RlbDogbm9ybWFsaXplZCBzcGVjIC0+IE1vZGVsIChhIHRyZWUgc3RydWN0dXJlKVxuXG4gICAgLy8gVGhpcyBwaGFzZXMgaW5zdGFudGlhdGVzIHRoZSBtb2RlbHMgd2l0aCBkZWZhdWx0IGNvbmZpZyBieSBkb2luZyBhIHRvcC1kb3duIHRyYXZlcnNhbC4gVGhpcyBhbGxvd3MgdXMgdG8gcGFzcyBwcm9wZXJ0aWVzIHRoYXQgY2hpbGQgbW9kZWxzIGRlcml2ZSBmcm9tIHRoZWlyIHBhcmVudHMgdmlhIHRoZWlyIGNvbnN0cnVjdG9ycy5cbiAgICAvLyBTZWUgdGhlIGFic3RyYWN0IGBNb2RlbGAgY2xhc3MgYW5kIGl0cyBjaGlsZHJlbiAoVW5pdE1vZGVsLCBMYXllck1vZGVsLCBGYWNldE1vZGVsLCBSZXBlYXRNb2RlbCwgQ29uY2F0TW9kZWwpIGZvciBkaWZmZXJlbnQgdHlwZXMgb2YgbW9kZWxzLlxuICAgIGNvbnN0IG1vZGVsOiBNb2RlbCA9IGJ1aWxkTW9kZWwoc3BlYywgbnVsbCwgJycsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb25maWcsIGF1dG9zaXplLnR5cGUgPT09ICdmaXQnKTtcblxuICAgIC8vIDQgUGFyc2U6IE1vZGVsIC0tPiBNb2RlbCB3aXRoIGNvbXBvbmVudHMgKGNvbXBvbmVudHMgPSBpbnRlcm1lZGlhdGUgdGhhdCBjYW4gYmUgbWVyZ2VkXG4gICAgLy8gYW5kIGFzc2VtYmxlZCBlYXNpbHkpXG5cbiAgICAvLyBJbiB0aGlzIHBoYXNlLCB3ZSBkbyBhIGJvdHRvbS11cCB0cmF2ZXJzYWwgb3ZlciB0aGUgd2hvbGUgdHJlZSB0b1xuICAgIC8vIHBhcnNlIGZvciBlYWNoIHR5cGUgb2YgY29tcG9uZW50cyBvbmNlIChlLmcuLCBkYXRhLCBsYXlvdXQsIG1hcmssIHNjYWxlKS5cbiAgICAvLyBCeSBkb2luZyBib3R0b20tdXAgdHJhdmVyc2FsLCB3ZSBzdGFydCBwYXJzaW5nIGNvbXBvbmVudHMgb2YgdW5pdCBzcGVjcyBhbmRcbiAgICAvLyB0aGVuIG1lcmdlIGNoaWxkIGNvbXBvbmVudHMgb2YgcGFyZW50IGNvbXBvc2l0ZSBzcGVjcy5cbiAgICAvL1xuICAgIC8vIFBsZWFzZSBzZWUgaW5zaWRlIG1vZGVsLnBhcnNlKCkgZm9yIG9yZGVyIG9mIGRpZmZlcmVudCBjb21wb25lbnRzIHBhcnNlZC5cbiAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgLy8gNS4gT3B0aW1pemUgdGhlIGRhdGFmbG93LiAgVGhpcyB3aWxsIG1vZGlmeSB0aGUgZGF0YSBjb21wb25lbnQgb2YgdGhlIG1vZGVsLlxuICAgIG9wdGltaXplRGF0YWZsb3cobW9kZWwuY29tcG9uZW50LmRhdGEpO1xuXG4gICAgLy8gNi4gQXNzZW1ibGU6IGNvbnZlcnQgbW9kZWwgYW5kIGNvbXBvbmVudHMgLS0+IFZlZ2EgU3BlYy5cbiAgICByZXR1cm4gYXNzZW1ibGVUb3BMZXZlbE1vZGVsKG1vZGVsLCBnZXRUb3BMZXZlbFByb3BlcnRpZXMoaW5wdXRTcGVjLCBjb25maWcsIGF1dG9zaXplKSk7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gUmVzZXQgdGhlIHNpbmdsZXRvbiBsb2dnZXIgaWYgYSBsb2dnZXIgaXMgcHJvdmlkZWRcbiAgICBpZiAob3B0LmxvZ2dlcikge1xuICAgICAgbG9nLnJlc2V0KCk7XG4gICAgfVxuICAgIC8vIFJlc2V0IHRoZSBzaW5nbGV0b24gZmllbGQgdGl0bGUgZm9ybWF0dGVyIGlmIHByb3ZpZGVkXG4gICAgaWYgKG9wdC5maWVsZFRpdGxlKSB7XG4gICAgICB2bEZpZWxkRGVmLnJlc2V0VGl0bGVGb3JtYXR0ZXIoKTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBnZXRUb3BMZXZlbFByb3BlcnRpZXModG9wTGV2ZWxTcGVjOiBUb3BMZXZlbDxhbnk+LCBjb25maWc6IENvbmZpZywgYXV0b3NpemU6IEF1dG9TaXplUGFyYW1zKSB7XG4gIHJldHVybiB7XG4gICAgYXV0b3NpemU6IGtleXMoYXV0b3NpemUpLmxlbmd0aCA9PT0gMSAmJiBhdXRvc2l6ZS50eXBlID8gYXV0b3NpemUudHlwZSA6IGF1dG9zaXplLFxuICAgIC4uLmV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXMoY29uZmlnKSxcbiAgICAuLi5leHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzKHRvcExldmVsU3BlYylcbiAgfTtcbn1cblxuLypcbiAqIEFzc2VtYmxlIHRoZSB0b3AtbGV2ZWwgbW9kZWwuXG4gKlxuICogTm90ZTogdGhpcyBjb3VsZG4ndCBiZSBgbW9kZWwuYXNzZW1ibGUoKWAgc2luY2UgdGhlIHRvcC1sZXZlbCBtb2RlbFxuICogbmVlZHMgc29tZSBzcGVjaWFsIHRyZWF0bWVudCB0byBnZW5lcmF0ZSB0b3AtbGV2ZWwgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gYXNzZW1ibGVUb3BMZXZlbE1vZGVsKG1vZGVsOiBNb2RlbCwgdG9wTGV2ZWxQcm9wZXJ0aWVzOiBUb3BMZXZlbFByb3BlcnRpZXMgJiBMYXlvdXRTaXplTWl4aW5zKSB7XG4gIC8vIFRPRE86IGNoYW5nZSB0eXBlIHRvIGJlY29tZSBWZ1NwZWNcblxuICAvLyBDb25maWcgd2l0aCBWZWdhLUxpdGUgb25seSBjb25maWcgcmVtb3ZlZC5cbiAgY29uc3QgdmdDb25maWcgPSBtb2RlbC5jb25maWcgPyBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnKG1vZGVsLmNvbmZpZykgOiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgZGF0YSA9IFtdLmNvbmNhdChcbiAgICBtb2RlbC5hc3NlbWJsZVNlbGVjdGlvbkRhdGEoW10pLFxuICAgIC8vIG9ubHkgYXNzZW1ibGUgZGF0YSBpbiB0aGUgcm9vdFxuICAgIGFzc2VtYmxlUm9vdERhdGEobW9kZWwuY29tcG9uZW50LmRhdGEpXG4gICk7XG5cbiAgY29uc3QgcHJvamVjdGlvbnMgPSBtb2RlbC5hc3NlbWJsZVByb2plY3Rpb25zKCk7XG4gIGNvbnN0IHRpdGxlID0gbW9kZWwuYXNzZW1ibGVUaXRsZSgpO1xuICBjb25zdCBzdHlsZSA9IG1vZGVsLmFzc2VtYmxlR3JvdXBTdHlsZSgpO1xuXG4gIGxldCBsYXlvdXRTaWduYWxzID0gbW9kZWwuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk7XG5cbiAgLy8gbW92ZSB3aWR0aCBhbmQgaGVpZ2h0IHNpZ25hbHMgd2l0aCB2YWx1ZXMgdG8gdG9wIGxldmVsXG4gIGxheW91dFNpZ25hbHMgPSBsYXlvdXRTaWduYWxzLmZpbHRlcihzaWduYWwgPT4ge1xuICAgIGlmICgoc2lnbmFsLm5hbWUgPT09ICd3aWR0aCcgfHwgc2lnbmFsLm5hbWUgPT09ICdoZWlnaHQnKSAmJiBzaWduYWwudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdG9wTGV2ZWxQcm9wZXJ0aWVzW3NpZ25hbC5uYW1lXSA9ICtzaWduYWwudmFsdWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuICBjb25zdCBvdXRwdXQgPSB7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EvdjMuMC5qc29uJyxcbiAgICAuLi4obW9kZWwuZGVzY3JpcHRpb24gPyB7ZGVzY3JpcHRpb246IG1vZGVsLmRlc2NyaXB0aW9ufSA6IHt9KSxcbiAgICAuLi50b3BMZXZlbFByb3BlcnRpZXMsXG4gICAgLi4uKHRpdGxlPyB7dGl0bGV9IDoge30pLFxuICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIC4uLihwcm9qZWN0aW9ucy5sZW5ndGggPiAwID8ge3Byb2plY3Rpb25zOiBwcm9qZWN0aW9uc30gOiB7fSksXG4gICAgLi4ubW9kZWwuYXNzZW1ibGVHcm91cChbXG4gICAgICAuLi5sYXlvdXRTaWduYWxzLFxuICAgICAgLi4ubW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoW10pXG4gICAgXSksXG4gICAgLi4uKHZnQ29uZmlnID8ge2NvbmZpZzogdmdDb25maWd9IDoge30pXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzcGVjOiBvdXRwdXRcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyAvIGVycm9ycyBoZXJlXG4gIH07XG59XG4iXX0=