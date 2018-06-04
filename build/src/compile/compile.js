"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var vlFieldDef = tslib_1.__importStar(require("../fielddef"));
var log = tslib_1.__importStar(require("../log"));
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
 * Normalized Spec (Row/Column channels in single-view specs becomes faceted specs, composite marks becomes layered specs.)
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
        // 4 Parse: Model --> Model with components
        // Note that components = intermediate representations that are equivalent to Vega specs.
        // We need these intermediate representation because we need to merge many visualizaiton "components" like projections, scales, axes, and legends.
        // We will later convert these components into actual Vega specs in the assemble phase.
        // In this phase, we do a bottom-up traversal over the whole tree to
        // parse for each type of components once (e.g., data, layout, mark, scale).
        // By doing bottom-up traversal, we start parsing components of unit specs and
        // then merge child components of parent composite specs.
        //
        // Please see inside model.parse() for order of different components parsed.
        model.parse();
        // 5. Optimize the dataflow.  This will modify the data component of the model.
        optimize_1.optimizeDataflow(model.component.data);
        // 6. Assemble: convert model components --> Vega Spec.
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
    var output = tslib_1.__assign({ $schema: 'https://vega.github.io/schema/vega/v3.json' }, (model.description ? { description: model.description } : {}), topLevelProperties, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: data }, (projections.length > 0 ? { projections: projections } : {}), model.assembleGroup(layoutSignals.concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBQXFFO0FBQ3JFLDhEQUEwQztBQUMxQyxrREFBOEI7QUFDOUIsZ0NBQXFHO0FBQ3JHLGtEQUFrSDtBQUNsSCxnQ0FBd0M7QUFDeEMsMkNBQXdDO0FBQ3hDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFVakQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJHO0FBQ0gsaUJBQXdCLFNBQXVCLEVBQUUsR0FBd0I7SUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtJQUN2RSxtQ0FBbUM7SUFDbkMsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2Qsa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1FBQ2xCLDBDQUEwQztRQUMxQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsSUFBSTtRQUNGLDhHQUE4RztRQUM5RyxJQUFNLE1BQU0sR0FBRyxtQkFBVSxDQUFDLGdCQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFdkUsc0RBQXNEO1FBRXRELDhOQUE4TjtRQUM5TixJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxQywyREFBMkQ7UUFDM0QsSUFBTSxRQUFRLEdBQUcsaUNBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGtCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRS9HLDhE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QztJQUVILElBQU0sTUFBTSxzQkFDVixPQUFPLEVBQUUsNENBQTRDLElBQ2xELENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDM0Qsa0JBQWtCLEVBQ2xCLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNyQixDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDeEIsSUFBSSxFQUFFLElBQUksSUFDUCxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFELEtBQUssQ0FBQyxhQUFhLENBQ2pCLGFBQWEsUUFDYixLQUFLLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDLEVBQzdDLEVBQ0MsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDeEMsQ0FBQztJQUVGLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLGtDQUFrQztLQUNuQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnLCBpbml0Q29uZmlnLCBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNMYXllclNwZWMsIGlzVW5pdFNwZWMsIExheW91dFNpemVNaXhpbnMsIG5vcm1hbGl6ZSwgVG9wTGV2ZWwsIFRvcExldmVsU3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge0F1dG9TaXplUGFyYW1zLCBleHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzLCBub3JtYWxpemVBdXRvU2l6ZSwgVG9wTGV2ZWxQcm9wZXJ0aWVzfSBmcm9tICcuLi90b3BsZXZlbHByb3BzJztcbmltcG9ydCB7a2V5cywgbWVyZ2VEZWVwfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7YnVpbGRNb2RlbH0gZnJvbSAnLi9idWlsZG1vZGVsJztcbmltcG9ydCB7YXNzZW1ibGVSb290RGF0YX0gZnJvbSAnLi9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7b3B0aW1pemVEYXRhZmxvd30gZnJvbSAnLi9kYXRhL29wdGltaXplJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vbW9kZWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVPcHRpb25zIHtcbiAgY29uZmlnPzogQ29uZmlnO1xuICBsb2dnZXI/OiBsb2cuTG9nZ2VySW50ZXJmYWNlO1xuXG4gIGZpZWxkVGl0bGU/OiB2bEZpZWxkRGVmLkZpZWxkVGl0bGVGb3JtYXR0ZXI7XG59XG5cbi8qKlxuICogVmVnYS1MaXRlJ3MgbWFpbiBmdW5jdGlvbiwgZm9yIGNvbXBpbGluZyBWZWdhLWxpdGUgc3BlYyBpbnRvIFZlZ2Egc3BlYy5cbiAqXG4gKiBBdCBhIGhpZ2gtbGV2ZWwsIHdlIG1ha2UgdGhlIGZvbGxvd2luZyB0cmFuc2Zvcm1hdGlvbnMgaW4gZGlmZmVyZW50IHBoYXNlczpcbiAqXG4gKiBJbnB1dCBzcGVjXG4gKiAgICAgfFxuICogICAgIHwgIChOb3JtYWxpemF0aW9uKVxuICogICAgIHZcbiAqIE5vcm1hbGl6ZWQgU3BlYyAoUm93L0NvbHVtbiBjaGFubmVscyBpbiBzaW5nbGUtdmlldyBzcGVjcyBiZWNvbWVzIGZhY2V0ZWQgc3BlY3MsIGNvbXBvc2l0ZSBtYXJrcyBiZWNvbWVzIGxheWVyZWQgc3BlY3MuKVxuICogICAgIHxcbiAqICAgICB8ICAoQnVpbGQgTW9kZWwpXG4gKiAgICAgdlxuICogQSBtb2RlbCB0cmVlIG9mIHRoZSBzcGVjXG4gKiAgICAgfFxuICogICAgIHwgIChQYXJzZSlcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgd2l0aCBwYXJzZWQgY29tcG9uZW50cyAoaW50ZXJtZWRpYXRlIHN0cnVjdHVyZSBvZiB2aXN1YWxpemF0aW9uIHByaW1pdGl2ZXMgaW4gYSBmb3JtYXQgdGhhdCBjYW4gYmUgZWFzaWx5IG1lcmdlZClcbiAqICAgICB8XG4gKiAgICAgfCAoT3B0aW1pemUpXG4gKiAgICAgdlxuICogQSBtb2RlbCB0cmVlIHdpdGggcGFyc2VkIGNvbXBvbmVudHMgd2l0aCB0aGUgZGF0YSBjb21wb25lbnQgb3B0aW1pemVkXG4gKiAgICAgfFxuICogICAgIHwgKEFzc2VtYmxlKVxuICogICAgIHZcbiAqIFZlZ2Egc3BlY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShpbnB1dFNwZWM6IFRvcExldmVsU3BlYywgb3B0OiBDb21waWxlT3B0aW9ucyA9IHt9KSB7XG4gIC8vIDAuIEF1Z21lbnQgb3B0IHdpdGggZGVmYXVsdCBvcHRzXG4gIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIHRvIHRoZSBwcm92aWRlZCBsb2dnZXJcbiAgICBsb2cuc2V0KG9wdC5sb2dnZXIpO1xuICB9XG5cbiAgaWYgKG9wdC5maWVsZFRpdGxlKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gZmllbGQgdGl0bGUgZm9ybWF0dGVyXG4gICAgdmxGaWVsZERlZi5zZXRUaXRsZUZvcm1hdHRlcihvcHQuZmllbGRUaXRsZSk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIDEuIEluaXRpYWxpemUgY29uZmlnIGJ5IGRlZXAgbWVyZ2luZyBkZWZhdWx0IGNvbmZpZyB3aXRoIHRoZSBjb25maWcgcHJvdmlkZWQgdmlhIG9wdGlvbiBhbmQgdGhlIGlucHV0IHNwZWMuXG4gICAgY29uc3QgY29uZmlnID0gaW5pdENvbmZpZyhtZXJnZURlZXAoe30sIG9wdC5jb25maWcsIGlucHV0U3BlYy5jb25maWcpKTtcblxuICAgIC8vIDIuIE5vcm1hbGl6ZTogQ29udmVydCBpbnB1dCBzcGVjIC0+IG5vcm1hbGl6ZWQgc3BlY1xuXG4gICAgLy8gLSBEZWNvbXBvc2UgYWxsIGV4dGVuZGVkIHVuaXQgc3BlY3MgaW50byBjb21wb3NpdGlvbiBvZiB1bml0IHNwZWMuICBGb3IgZXhhbXBsZSwgYSBib3ggcGxvdCBnZXQgZXhwYW5kZWQgaW50byBtdWx0aXBsZSBsYXllcnMgb2YgYmFycywgdGlja3MsIGFuZCBydWxlcy4gVGhlIHNob3J0aGFuZCByb3cvY29sdW1uIGNoYW5uZWwgaXMgYWxzbyBleHBhbmRlZCB0byBhIGZhY2V0IHNwZWMuXG4gICAgY29uc3Qgc3BlYyA9IG5vcm1hbGl6ZShpbnB1dFNwZWMsIGNvbmZpZyk7XG4gICAgLy8gLSBOb3JtYWxpemUgYXV0b3NpemUgdG8gYmUgYSBhdXRvc2l6ZSBwcm9wZXJ0aWVzIG9iamVjdC5cbiAgICBjb25zdCBhdXRvc2l6ZSA9IG5vcm1hbGl6ZUF1dG9TaXplKGlucHV0U3BlYy5hdXRvc2l6ZSwgY29uZmlnLmF1dG9zaXplLCBpc0xheWVyU3BlYyhzcGVjKSB8fCBpc1VuaXRTcGVjKHNwZWMpKTtcblxuICAgIC8vIDMuIEJ1aWxkIE1vZGVsOiBub3JtYWxpemVkIHNwZWMgLT4gTW9kZWwgKGEgdHJlZSBzdHJ1Y3R1cmUpXG5cbiAgICAvLyBUaGlzIHBoYXNlcyBpbnN0YW50aWF0ZXMgdGhlIG1vZGVscyB3aXRoIGRlZmF1bHQgY29uZmlnIGJ5IGRvaW5nIGEgdG9wLWRvd24gdHJhdmVyc2FsLiBUaGlzIGFsbG93cyB1cyB0byBwYXNzIHByb3BlcnRpZXMgdGhhdCBjaGlsZCBtb2RlbHMgZGVyaXZlIGZyb20gdGhlaXIgcGFyZW50cyB2aWEgdGhlaXIgY29uc3RydWN0b3JzLlxuICAgIC8vIFNlZSB0aGUgYWJzdHJhY3QgYE1vZGVsYCBjbGFzcyBhbmQgaXRzIGNoaWxkcmVuIChVbml0TW9kZWwsIExheWVyTW9kZWwsIEZhY2V0TW9kZWwsIFJlcGVhdE1vZGVsLCBDb25jYXRNb2RlbCkgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBtb2RlbHMuXG4gICAgY29uc3QgbW9kZWw6IE1vZGVsID0gYnVpbGRNb2RlbChzcGVjLCBudWxsLCAnJywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbmZpZywgYXV0b3NpemUudHlwZSA9PT0gJ2ZpdCcpO1xuXG4gICAgLy8gNCBQYXJzZTogTW9kZWwgLS0+IE1vZGVsIHdpdGggY29tcG9uZW50c1xuXG4gICAgLy8gTm90ZSB0aGF0IGNvbXBvbmVudHMgPSBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb25zIHRoYXQgYXJlIGVxdWl2YWxlbnQgdG8gVmVnYSBzcGVjcy5cbiAgICAvLyBXZSBuZWVkIHRoZXNlIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvbiBiZWNhdXNlIHdlIG5lZWQgdG8gbWVyZ2UgbWFueSB2aXN1YWxpemFpdG9uIFwiY29tcG9uZW50c1wiIGxpa2UgcHJvamVjdGlvbnMsIHNjYWxlcywgYXhlcywgYW5kIGxlZ2VuZHMuXG4gICAgLy8gV2Ugd2lsbCBsYXRlciBjb252ZXJ0IHRoZXNlIGNvbXBvbmVudHMgaW50byBhY3R1YWwgVmVnYSBzcGVjcyBpbiB0aGUgYXNzZW1ibGUgcGhhc2UuXG5cbiAgICAvLyBJbiB0aGlzIHBoYXNlLCB3ZSBkbyBhIGJvdHRvbS11cCB0cmF2ZXJzYWwgb3ZlciB0aGUgd2hvbGUgdHJlZSB0b1xuICAgIC8vIHBhcnNlIGZvciBlYWNoIHR5cGUgb2YgY29tcG9uZW50cyBvbmNlIChlLmcuLCBkYXRhLCBsYXlvdXQsIG1hcmssIHNjYWxlKS5cbiAgICAvLyBCeSBkb2luZyBib3R0b20tdXAgdHJhdmVyc2FsLCB3ZSBzdGFydCBwYXJzaW5nIGNvbXBvbmVudHMgb2YgdW5pdCBzcGVjcyBhbmRcbiAgICAvLyB0aGVuIG1lcmdlIGNoaWxkIGNvbXBvbmVudHMgb2YgcGFyZW50IGNvbXBvc2l0ZSBzcGVjcy5cbiAgICAvL1xuICAgIC8vIFBsZWFzZSBzZWUgaW5zaWRlIG1vZGVsLnBhcnNlKCkgZm9yIG9yZGVyIG9mIGRpZmZlcmVudCBjb21wb25lbnRzIHBhcnNlZC5cbiAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgLy8gNS4gT3B0aW1pemUgdGhlIGRhdGFmbG93LiAgVGhpcyB3aWxsIG1vZGlmeSB0aGUgZGF0YSBjb21wb25lbnQgb2YgdGhlIG1vZGVsLlxuICAgIG9wdGltaXplRGF0YWZsb3cobW9kZWwuY29tcG9uZW50LmRhdGEpO1xuXG4gICAgLy8gNi4gQXNzZW1ibGU6IGNvbnZlcnQgbW9kZWwgY29tcG9uZW50cyAtLT4gVmVnYSBTcGVjLlxuICAgIHJldHVybiBhc3NlbWJsZVRvcExldmVsTW9kZWwobW9kZWwsIGdldFRvcExldmVsUHJvcGVydGllcyhpbnB1dFNwZWMsIGNvbmZpZywgYXV0b3NpemUpKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZXNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciBpZiBhIGxvZ2dlciBpcyBwcm92aWRlZFxuICAgIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgICBsb2cucmVzZXQoKTtcbiAgICB9XG4gICAgLy8gUmVzZXQgdGhlIHNpbmdsZXRvbiBmaWVsZCB0aXRsZSBmb3JtYXR0ZXIgaWYgcHJvdmlkZWRcbiAgICBpZiAob3B0LmZpZWxkVGl0bGUpIHtcbiAgICAgIHZsRmllbGREZWYucmVzZXRUaXRsZUZvcm1hdHRlcigpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGdldFRvcExldmVsUHJvcGVydGllcyh0b3BMZXZlbFNwZWM6IFRvcExldmVsPGFueT4sIGNvbmZpZzogQ29uZmlnLCBhdXRvc2l6ZTogQXV0b1NpemVQYXJhbXMpIHtcbiAgcmV0dXJuIHtcbiAgICBhdXRvc2l6ZToga2V5cyhhdXRvc2l6ZSkubGVuZ3RoID09PSAxICYmIGF1dG9zaXplLnR5cGUgPyBhdXRvc2l6ZS50eXBlIDogYXV0b3NpemUsXG4gICAgLi4uZXh0cmFjdFRvcExldmVsUHJvcGVydGllcyhjb25maWcpLFxuICAgIC4uLmV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXModG9wTGV2ZWxTcGVjKVxuICB9O1xufVxuXG4vKlxuICogQXNzZW1ibGUgdGhlIHRvcC1sZXZlbCBtb2RlbC5cbiAqXG4gKiBOb3RlOiB0aGlzIGNvdWxkbid0IGJlIGBtb2RlbC5hc3NlbWJsZSgpYCBzaW5jZSB0aGUgdG9wLWxldmVsIG1vZGVsXG4gKiBuZWVkcyBzb21lIHNwZWNpYWwgdHJlYXRtZW50IHRvIGdlbmVyYXRlIHRvcC1sZXZlbCBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBhc3NlbWJsZVRvcExldmVsTW9kZWwobW9kZWw6IE1vZGVsLCB0b3BMZXZlbFByb3BlcnRpZXM6IFRvcExldmVsUHJvcGVydGllcyAmIExheW91dFNpemVNaXhpbnMpIHtcbiAgLy8gVE9ETzogY2hhbmdlIHR5cGUgdG8gYmVjb21lIFZnU3BlY1xuXG4gIC8vIENvbmZpZyB3aXRoIFZlZ2EtTGl0ZSBvbmx5IGNvbmZpZyByZW1vdmVkLlxuICBjb25zdCB2Z0NvbmZpZyA9IG1vZGVsLmNvbmZpZyA/IHN0cmlwQW5kUmVkaXJlY3RDb25maWcobW9kZWwuY29uZmlnKSA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBkYXRhID0gW10uY29uY2F0KFxuICAgIG1vZGVsLmFzc2VtYmxlU2VsZWN0aW9uRGF0YShbXSksXG4gICAgLy8gb25seSBhc3NlbWJsZSBkYXRhIGluIHRoZSByb290XG4gICAgYXNzZW1ibGVSb290RGF0YShtb2RlbC5jb21wb25lbnQuZGF0YSwgdG9wTGV2ZWxQcm9wZXJ0aWVzLmRhdGFzZXRzIHx8IHt9KVxuICApO1xuXG4gIGRlbGV0ZSB0b3BMZXZlbFByb3BlcnRpZXMuZGF0YXNldHM7XG5cbiAgY29uc3QgcHJvamVjdGlvbnMgPSBtb2RlbC5hc3NlbWJsZVByb2plY3Rpb25zKCk7XG4gIGNvbnN0IHRpdGxlID0gbW9kZWwuYXNzZW1ibGVUaXRsZSgpO1xuICBjb25zdCBzdHlsZSA9IG1vZGVsLmFzc2VtYmxlR3JvdXBTdHlsZSgpO1xuXG4gIGxldCBsYXlvdXRTaWduYWxzID0gbW9kZWwuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk7XG5cbiAgLy8gbW92ZSB3aWR0aCBhbmQgaGVpZ2h0IHNpZ25hbHMgd2l0aCB2YWx1ZXMgdG8gdG9wIGxldmVsXG4gIGxheW91dFNpZ25hbHMgPSBsYXlvdXRTaWduYWxzLmZpbHRlcihzaWduYWwgPT4ge1xuICAgIGlmICgoc2lnbmFsLm5hbWUgPT09ICd3aWR0aCcgfHwgc2lnbmFsLm5hbWUgPT09ICdoZWlnaHQnKSAmJiBzaWduYWwudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdG9wTGV2ZWxQcm9wZXJ0aWVzW3NpZ25hbC5uYW1lXSA9ICtzaWduYWwudmFsdWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuICBjb25zdCBvdXRwdXQgPSB7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EvdjMuanNvbicsXG4gICAgLi4uKG1vZGVsLmRlc2NyaXB0aW9uID8ge2Rlc2NyaXB0aW9uOiBtb2RlbC5kZXNjcmlwdGlvbn0gOiB7fSksXG4gICAgLi4udG9wTGV2ZWxQcm9wZXJ0aWVzLFxuICAgIC4uLih0aXRsZT8ge3RpdGxlfSA6IHt9KSxcbiAgICAuLi4oc3R5bGU/IHtzdHlsZX0gOiB7fSksXG4gICAgZGF0YTogZGF0YSxcbiAgICAuLi4ocHJvamVjdGlvbnMubGVuZ3RoID4gMCA/IHtwcm9qZWN0aW9uczogcHJvamVjdGlvbnN9IDoge30pLFxuICAgIC4uLm1vZGVsLmFzc2VtYmxlR3JvdXAoW1xuICAgICAgLi4ubGF5b3V0U2lnbmFscyxcbiAgICAgIC4uLm1vZGVsLmFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKFtdKVxuICAgIF0pLFxuICAgIC4uLih2Z0NvbmZpZyA/IHtjb25maWc6IHZnQ29uZmlnfSA6IHt9KVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogb3V0cHV0XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgLyBlcnJvcnMgaGVyZVxuICB9O1xufVxuIl19