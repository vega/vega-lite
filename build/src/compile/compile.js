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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9DQUFxRTtBQUNyRSx3Q0FBMEM7QUFDMUMsNEJBQThCO0FBQzlCLGdDQUE2RztBQUM3RyxrREFBa0g7QUFDbEgsZ0NBQXdDO0FBQ3hDLDJDQUF3QztBQUN4Qyw0Q0FBaUQ7QUFDakQsNENBQWlEO0FBVWpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILGlCQUF3QixTQUErQixFQUFFLEdBQXdCO0lBQXhCLG9CQUFBLEVBQUEsUUFBd0I7SUFDL0UsbUNBQW1DO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2Ysa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuQiwwQ0FBMEM7UUFDMUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsOEdBQThHO1FBQzlHLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV2RSxzREFBc0Q7UUFFdEQsOE5BQThOO1FBQzlOLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLDJEQUEyRDtRQUMzRCxJQUFNLFFBQVEsR0FBRyxpQ0FBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JB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Q3hGLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDaEQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFNLE1BQU0sY0FDVixPQUFPLEVBQUUsOENBQThDLElBQ3BELENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDM0Qsa0JBQWtCLEVBQ2xCLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNyQixDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDeEIsSUFBSSxFQUFFLElBQUksSUFDUCxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFELEtBQUssQ0FBQyxhQUFhLENBQ2pCLGFBQWEsUUFDYixLQUFLLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDLEVBQzdDLEVBQ0MsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDeEMsQ0FBQztJQUVGLE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osa0NBQWtDO0tBQ25DLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWcsIGluaXRDb25maWcsIHN0cmlwQW5kUmVkaXJlY3RDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtpc0xheWVyU3BlYywgaXNVbml0U3BlYywgTGF5b3V0U2l6ZU1peGlucywgbm9ybWFsaXplLCBUb3BMZXZlbCwgVG9wTGV2ZWxFeHRlbmRlZFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtBdXRvU2l6ZVBhcmFtcywgZXh0cmFjdFRvcExldmVsUHJvcGVydGllcywgbm9ybWFsaXplQXV0b1NpemUsIFRvcExldmVsUHJvcGVydGllc30gZnJvbSAnLi4vdG9wbGV2ZWxwcm9wcyc7XG5pbXBvcnQge2tleXMsIG1lcmdlRGVlcH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2J1aWxkTW9kZWx9IGZyb20gJy4vYnVpbGRtb2RlbCc7XG5pbXBvcnQge2Fzc2VtYmxlUm9vdERhdGF9IGZyb20gJy4vZGF0YS9hc3NlbWJsZSc7XG5pbXBvcnQge29wdGltaXplRGF0YWZsb3d9IGZyb20gJy4vZGF0YS9vcHRpbWl6ZSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL21vZGVsJztcblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlT3B0aW9ucyB7XG4gIGNvbmZpZz86IENvbmZpZztcbiAgbG9nZ2VyPzogbG9nLkxvZ2dlckludGVyZmFjZTtcblxuICBmaWVsZFRpdGxlPzogdmxGaWVsZERlZi5GaWVsZFRpdGxlRm9ybWF0dGVyO1xufVxuXG4vKipcbiAqIFZlZ2EtTGl0ZSdzIG1haW4gZnVuY3Rpb24sIGZvciBjb21waWxpbmcgVmVnYS1saXRlIHNwZWMgaW50byBWZWdhIHNwZWMuXG4gKlxuICogQXQgYSBoaWdoLWxldmVsLCB3ZSBtYWtlIHRoZSBmb2xsb3dpbmcgdHJhbnNmb3JtYXRpb25zIGluIGRpZmZlcmVudCBwaGFzZXM6XG4gKlxuICogSW5wdXQgc3BlY1xuICogICAgIHxcbiAqICAgICB8ICAoTm9ybWFsaXphdGlvbilcbiAqICAgICB2XG4gKiBOb3JtYWxpemVkIFNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKEJ1aWxkIE1vZGVsKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSBvZiB0aGUgc3BlY1xuICogICAgIHxcbiAqICAgICB8ICAoUGFyc2UpXG4gKiAgICAgdlxuICogQSBtb2RlbCB0cmVlIHdpdGggcGFyc2VkIGNvbXBvbmVudHMgKGludGVybWVkaWF0ZSBzdHJ1Y3R1cmUgb2YgdmlzdWFsaXphdGlvbiBwcmltaXRpdmVzIGluIGEgZm9ybWF0IHRoYXQgY2FuIGJlIGVhc2lseSBtZXJnZWQpXG4gKiAgICAgfFxuICogICAgIHwgKE9wdGltaXplKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSB3aXRoIHBhcnNlZCBjb21wb25lbnRzIHdpdGggdGhlIGRhdGEgY29tcG9uZW50IG9wdGltaXplZFxuICogICAgIHxcbiAqICAgICB8IChBc3NlbWJsZSlcbiAqICAgICB2XG4gKiBWZWdhIHNwZWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoaW5wdXRTcGVjOiBUb3BMZXZlbEV4dGVuZGVkU3BlYywgb3B0OiBDb21waWxlT3B0aW9ucyA9IHt9KSB7XG4gIC8vIDAuIEF1Z21lbnQgb3B0IHdpdGggZGVmYXVsdCBvcHRzXG4gIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIHRvIHRoZSBwcm92aWRlZCBsb2dnZXJcbiAgICBsb2cuc2V0KG9wdC5sb2dnZXIpO1xuICB9XG5cbiAgaWYgKG9wdC5maWVsZFRpdGxlKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gZmllbGQgdGl0bGUgZm9ybWF0dGVyXG4gICAgdmxGaWVsZERlZi5zZXRUaXRsZUZvcm1hdHRlcihvcHQuZmllbGRUaXRsZSk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIDEuIEluaXRpYWxpemUgY29uZmlnIGJ5IGRlZXAgbWVyZ2luZyBkZWZhdWx0IGNvbmZpZyB3aXRoIHRoZSBjb25maWcgcHJvdmlkZWQgdmlhIG9wdGlvbiBhbmQgdGhlIGlucHV0IHNwZWMuXG4gICAgY29uc3QgY29uZmlnID0gaW5pdENvbmZpZyhtZXJnZURlZXAoe30sIG9wdC5jb25maWcsIGlucHV0U3BlYy5jb25maWcpKTtcblxuICAgIC8vIDIuIE5vcm1hbGl6ZTogQ29udmVydCBpbnB1dCBzcGVjIC0+IG5vcm1hbGl6ZWQgc3BlY1xuXG4gICAgLy8gLSBEZWNvbXBvc2UgYWxsIGV4dGVuZGVkIHVuaXQgc3BlY3MgaW50byBjb21wb3NpdGlvbiBvZiB1bml0IHNwZWMuICBGb3IgZXhhbXBsZSwgYSBib3ggcGxvdCBnZXQgZXhwYW5kZWQgaW50byBtdWx0aXBsZSBsYXllcnMgb2YgYmFycywgdGlja3MsIGFuZCBydWxlcy4gVGhlIHNob3J0aGFuZCByb3cvY29sdW1uIGNoYW5uZWwgaXMgYWxzbyBleHBhbmRlZCB0byBhIGZhY2V0IHNwZWMuXG4gICAgY29uc3Qgc3BlYyA9IG5vcm1hbGl6ZShpbnB1dFNwZWMsIGNvbmZpZyk7XG4gICAgLy8gLSBOb3JtYWxpemUgYXV0b3NpemUgdG8gYmUgYSBhdXRvc2l6ZSBwcm9wZXJ0aWVzIG9iamVjdC5cbiAgICBjb25zdCBhdXRvc2l6ZSA9IG5vcm1hbGl6ZUF1dG9TaXplKGlucHV0U3BlYy5hdXRvc2l6ZSwgY29uZmlnLmF1dG9zaXplLCBpc0xheWVyU3BlYyhzcGVjKSB8fCBpc1VuaXRTcGVjKHNwZWMpKTtcblxuICAgIC8vIDMuIEJ1aWxkIE1vZGVsOiBub3JtYWxpemVkIHNwZWMgLT4gTW9kZWwgKGEgdHJlZSBzdHJ1Y3R1cmUpXG5cbiAgICAvLyBUaGlzIHBoYXNlcyBpbnN0YW50aWF0ZXMgdGhlIG1vZGVscyB3aXRoIGRlZmF1bHQgY29uZmlnIGJ5IGRvaW5nIGEgdG9wLWRvd24gdHJhdmVyc2FsLiBUaGlzIGFsbG93cyB1cyB0byBwYXNzIHByb3BlcnRpZXMgdGhhdCBjaGlsZCBtb2RlbHMgZGVyaXZlIGZyb20gdGhlaXIgcGFyZW50cyB2aWEgdGhlaXIgY29uc3RydWN0b3JzLlxuICAgIC8vIFNlZSB0aGUgYWJzdHJhY3QgYE1vZGVsYCBjbGFzcyBhbmQgaXRzIGNoaWxkcmVuIChVbml0TW9kZWwsIExheWVyTW9kZWwsIEZhY2V0TW9kZWwsIFJlcGVhdE1vZGVsLCBDb25jYXRNb2RlbCkgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBtb2RlbHMuXG4gICAgY29uc3QgbW9kZWw6IE1vZGVsID0gYnVpbGRNb2RlbChzcGVjLCBudWxsLCAnJywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbmZpZywgYXV0b3NpemUudHlwZSA9PT0gJ2ZpdCcpO1xuXG4gICAgLy8gNCBQYXJzZTogTW9kZWwgLS0+IE1vZGVsIHdpdGggY29tcG9uZW50cyAoY29tcG9uZW50cyA9IGludGVybWVkaWF0ZSB0aGF0IGNhbiBiZSBtZXJnZWRcbiAgICAvLyBhbmQgYXNzZW1ibGVkIGVhc2lseSlcblxuICAgIC8vIEluIHRoaXMgcGhhc2UsIHdlIGRvIGEgYm90dG9tLXVwIHRyYXZlcnNhbCBvdmVyIHRoZSB3aG9sZSB0cmVlIHRvXG4gICAgLy8gcGFyc2UgZm9yIGVhY2ggdHlwZSBvZiBjb21wb25lbnRzIG9uY2UgKGUuZy4sIGRhdGEsIGxheW91dCwgbWFyaywgc2NhbGUpLlxuICAgIC8vIEJ5IGRvaW5nIGJvdHRvbS11cCB0cmF2ZXJzYWwsIHdlIHN0YXJ0IHBhcnNpbmcgY29tcG9uZW50cyBvZiB1bml0IHNwZWNzIGFuZFxuICAgIC8vIHRoZW4gbWVyZ2UgY2hpbGQgY29tcG9uZW50cyBvZiBwYXJlbnQgY29tcG9zaXRlIHNwZWNzLlxuICAgIC8vXG4gICAgLy8gUGxlYXNlIHNlZSBpbnNpZGUgbW9kZWwucGFyc2UoKSBmb3Igb3JkZXIgb2YgZGlmZmVyZW50IGNvbXBvbmVudHMgcGFyc2VkLlxuICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAvLyA1LiBPcHRpbWl6ZSB0aGUgZGF0YWZsb3cuICBUaGlzIHdpbGwgbW9kaWZ5IHRoZSBkYXRhIGNvbXBvbmVudCBvZiB0aGUgbW9kZWwuXG4gICAgb3B0aW1pemVEYXRhZmxvdyhtb2RlbC5jb21wb25lbnQuZGF0YSk7XG5cbiAgICAvLyA2LiBBc3NlbWJsZTogY29udmVydCBtb2RlbCBhbmQgY29tcG9uZW50cyAtLT4gVmVnYSBTcGVjLlxuICAgIHJldHVybiBhc3NlbWJsZVRvcExldmVsTW9kZWwobW9kZWwsIGdldFRvcExldmVsUHJvcGVydGllcyhpbnB1dFNwZWMsIGNvbmZpZywgYXV0b3NpemUpKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZXNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciBpZiBhIGxvZ2dlciBpcyBwcm92aWRlZFxuICAgIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgICBsb2cucmVzZXQoKTtcbiAgICB9XG4gICAgLy8gUmVzZXQgdGhlIHNpbmdsZXRvbiBmaWVsZCB0aXRsZSBmb3JtYXR0ZXIgaWYgcHJvdmlkZWRcbiAgICBpZiAob3B0LmZpZWxkVGl0bGUpIHtcbiAgICAgIHZsRmllbGREZWYucmVzZXRUaXRsZUZvcm1hdHRlcigpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGdldFRvcExldmVsUHJvcGVydGllcyh0b3BMZXZlbFNwZWM6IFRvcExldmVsPGFueT4sIGNvbmZpZzogQ29uZmlnLCBhdXRvc2l6ZTogQXV0b1NpemVQYXJhbXMpIHtcbiAgcmV0dXJuIHtcbiAgICBhdXRvc2l6ZToga2V5cyhhdXRvc2l6ZSkubGVuZ3RoID09PSAxICYmIGF1dG9zaXplLnR5cGUgPyBhdXRvc2l6ZS50eXBlIDogYXV0b3NpemUsXG4gICAgLi4uZXh0cmFjdFRvcExldmVsUHJvcGVydGllcyhjb25maWcpLFxuICAgIC4uLmV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXModG9wTGV2ZWxTcGVjKVxuICB9O1xufVxuXG4vKlxuICogQXNzZW1ibGUgdGhlIHRvcC1sZXZlbCBtb2RlbC5cbiAqXG4gKiBOb3RlOiB0aGlzIGNvdWxkbid0IGJlIGBtb2RlbC5hc3NlbWJsZSgpYCBzaW5jZSB0aGUgdG9wLWxldmVsIG1vZGVsXG4gKiBuZWVkcyBzb21lIHNwZWNpYWwgdHJlYXRtZW50IHRvIGdlbmVyYXRlIHRvcC1sZXZlbCBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBhc3NlbWJsZVRvcExldmVsTW9kZWwobW9kZWw6IE1vZGVsLCB0b3BMZXZlbFByb3BlcnRpZXM6IFRvcExldmVsUHJvcGVydGllcyAmIExheW91dFNpemVNaXhpbnMpIHtcbiAgLy8gVE9ETzogY2hhbmdlIHR5cGUgdG8gYmVjb21lIFZnU3BlY1xuXG4gIC8vIENvbmZpZyB3aXRoIFZlZ2EtTGl0ZSBvbmx5IGNvbmZpZyByZW1vdmVkLlxuICBjb25zdCB2Z0NvbmZpZyA9IG1vZGVsLmNvbmZpZyA/IHN0cmlwQW5kUmVkaXJlY3RDb25maWcobW9kZWwuY29uZmlnKSA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBkYXRhID0gW10uY29uY2F0KFxuICAgIG1vZGVsLmFzc2VtYmxlU2VsZWN0aW9uRGF0YShbXSksXG4gICAgLy8gb25seSBhc3NlbWJsZSBkYXRhIGluIHRoZSByb290XG4gICAgYXNzZW1ibGVSb290RGF0YShtb2RlbC5jb21wb25lbnQuZGF0YSwgdG9wTGV2ZWxQcm9wZXJ0aWVzLmRhdGFzZXRzIHx8IHt9KVxuICApO1xuXG4gIGRlbGV0ZSB0b3BMZXZlbFByb3BlcnRpZXMuZGF0YXNldHM7XG5cbiAgY29uc3QgcHJvamVjdGlvbnMgPSBtb2RlbC5hc3NlbWJsZVByb2plY3Rpb25zKCk7XG4gIGNvbnN0IHRpdGxlID0gbW9kZWwuYXNzZW1ibGVUaXRsZSgpO1xuICBjb25zdCBzdHlsZSA9IG1vZGVsLmFzc2VtYmxlR3JvdXBTdHlsZSgpO1xuXG4gIGxldCBsYXlvdXRTaWduYWxzID0gbW9kZWwuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk7XG5cbiAgLy8gbW92ZSB3aWR0aCBhbmQgaGVpZ2h0IHNpZ25hbHMgd2l0aCB2YWx1ZXMgdG8gdG9wIGxldmVsXG4gIGxheW91dFNpZ25hbHMgPSBsYXlvdXRTaWduYWxzLmZpbHRlcihzaWduYWwgPT4ge1xuICAgIGlmICgoc2lnbmFsLm5hbWUgPT09ICd3aWR0aCcgfHwgc2lnbmFsLm5hbWUgPT09ICdoZWlnaHQnKSAmJiBzaWduYWwudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdG9wTGV2ZWxQcm9wZXJ0aWVzW3NpZ25hbC5uYW1lXSA9ICtzaWduYWwudmFsdWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuICBjb25zdCBvdXRwdXQgPSB7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EvdjMuMC5qc29uJyxcbiAgICAuLi4obW9kZWwuZGVzY3JpcHRpb24gPyB7ZGVzY3JpcHRpb246IG1vZGVsLmRlc2NyaXB0aW9ufSA6IHt9KSxcbiAgICAuLi50b3BMZXZlbFByb3BlcnRpZXMsXG4gICAgLi4uKHRpdGxlPyB7dGl0bGV9IDoge30pLFxuICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIC4uLihwcm9qZWN0aW9ucy5sZW5ndGggPiAwID8ge3Byb2plY3Rpb25zOiBwcm9qZWN0aW9uc30gOiB7fSksXG4gICAgLi4ubW9kZWwuYXNzZW1ibGVHcm91cChbXG4gICAgICAuLi5sYXlvdXRTaWduYWxzLFxuICAgICAgLi4ubW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoW10pXG4gICAgXSksXG4gICAgLi4uKHZnQ29uZmlnID8ge2NvbmZpZzogdmdDb25maWd9IDoge30pXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzcGVjOiBvdXRwdXRcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyAvIGVycm9ycyBoZXJlXG4gIH07XG59XG4iXX0=