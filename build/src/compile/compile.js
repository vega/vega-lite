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
    var output = tslib_1.__assign({ $schema: 'https://vega.github.io/schema/vega/v3.0.json' }, (model.description ? { description: model.description } : {}), topLevelProperties, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: data }, (projections.length > 0 ? { projections: projections } : {}), model.assembleGroup(layoutSignals.concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBQXFFO0FBQ3JFLHdDQUEwQztBQUMxQyw0QkFBOEI7QUFDOUIsZ0NBQXFHO0FBQ3JHLGtEQUFrSDtBQUNsSCxnQ0FBd0M7QUFDeEMsMkNBQXdDO0FBQ3hDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFVakQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJHO0FBQ0gsaUJBQXdCLFNBQXVCLEVBQUUsR0FBd0I7SUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtJQUN2RSxtQ0FBbUM7SUFDbkMsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2Qsa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1FBQ2xCLDBDQUEwQztRQUMxQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsSUFBSTtRQUNGLDhHQUE4RztRQUM5RyxJQUFNLE1BQU0sR0FBRyxtQkFBVSxDQUFDLGdCQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFdkUsc0RBQXNEO1FBRXRELDhOQUE4TjtRQUM5TixJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxQywyREFBMkQ7UUFDM0QsSUFBTSxRQUFRLEdBQUcsaUNBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGtCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRS9HLDhE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TyxFQUFFLDhDQUE4QyxJQUNwRCxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzNELGtCQUFrQixFQUNsQixDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDckIsQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQ3hCLElBQUksRUFBRSxJQUFJLElBQ1AsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUMxRCxLQUFLLENBQUMsYUFBYSxDQUNqQixhQUFhLFFBQ2IsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsQ0FBQyxFQUM3QyxFQUNDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ3hDLENBQUM7SUFFRixPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixrQ0FBa0M7S0FDbkMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbmZpZywgaW5pdENvbmZpZywgc3RyaXBBbmRSZWRpcmVjdENvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2lzTGF5ZXJTcGVjLCBpc1VuaXRTcGVjLCBMYXlvdXRTaXplTWl4aW5zLCBub3JtYWxpemUsIFRvcExldmVsLCBUb3BMZXZlbFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtBdXRvU2l6ZVBhcmFtcywgZXh0cmFjdFRvcExldmVsUHJvcGVydGllcywgbm9ybWFsaXplQXV0b1NpemUsIFRvcExldmVsUHJvcGVydGllc30gZnJvbSAnLi4vdG9wbGV2ZWxwcm9wcyc7XG5pbXBvcnQge2tleXMsIG1lcmdlRGVlcH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2J1aWxkTW9kZWx9IGZyb20gJy4vYnVpbGRtb2RlbCc7XG5pbXBvcnQge2Fzc2VtYmxlUm9vdERhdGF9IGZyb20gJy4vZGF0YS9hc3NlbWJsZSc7XG5pbXBvcnQge29wdGltaXplRGF0YWZsb3d9IGZyb20gJy4vZGF0YS9vcHRpbWl6ZSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL21vZGVsJztcblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlT3B0aW9ucyB7XG4gIGNvbmZpZz86IENvbmZpZztcbiAgbG9nZ2VyPzogbG9nLkxvZ2dlckludGVyZmFjZTtcblxuICBmaWVsZFRpdGxlPzogdmxGaWVsZERlZi5GaWVsZFRpdGxlRm9ybWF0dGVyO1xufVxuXG4vKipcbiAqIFZlZ2EtTGl0ZSdzIG1haW4gZnVuY3Rpb24sIGZvciBjb21waWxpbmcgVmVnYS1saXRlIHNwZWMgaW50byBWZWdhIHNwZWMuXG4gKlxuICogQXQgYSBoaWdoLWxldmVsLCB3ZSBtYWtlIHRoZSBmb2xsb3dpbmcgdHJhbnNmb3JtYXRpb25zIGluIGRpZmZlcmVudCBwaGFzZXM6XG4gKlxuICogSW5wdXQgc3BlY1xuICogICAgIHxcbiAqICAgICB8ICAoTm9ybWFsaXphdGlvbilcbiAqICAgICB2XG4gKiBOb3JtYWxpemVkIFNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKEJ1aWxkIE1vZGVsKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSBvZiB0aGUgc3BlY1xuICogICAgIHxcbiAqICAgICB8ICAoUGFyc2UpXG4gKiAgICAgdlxuICogQSBtb2RlbCB0cmVlIHdpdGggcGFyc2VkIGNvbXBvbmVudHMgKGludGVybWVkaWF0ZSBzdHJ1Y3R1cmUgb2YgdmlzdWFsaXphdGlvbiBwcmltaXRpdmVzIGluIGEgZm9ybWF0IHRoYXQgY2FuIGJlIGVhc2lseSBtZXJnZWQpXG4gKiAgICAgfFxuICogICAgIHwgKE9wdGltaXplKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSB3aXRoIHBhcnNlZCBjb21wb25lbnRzIHdpdGggdGhlIGRhdGEgY29tcG9uZW50IG9wdGltaXplZFxuICogICAgIHxcbiAqICAgICB8IChBc3NlbWJsZSlcbiAqICAgICB2XG4gKiBWZWdhIHNwZWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoaW5wdXRTcGVjOiBUb3BMZXZlbFNwZWMsIG9wdDogQ29tcGlsZU9wdGlvbnMgPSB7fSkge1xuICAvLyAwLiBBdWdtZW50IG9wdCB3aXRoIGRlZmF1bHQgb3B0c1xuICBpZiAob3B0LmxvZ2dlcikge1xuICAgIC8vIHNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciB0byB0aGUgcHJvdmlkZWQgbG9nZ2VyXG4gICAgbG9nLnNldChvcHQubG9nZ2VyKTtcbiAgfVxuXG4gIGlmIChvcHQuZmllbGRUaXRsZSkge1xuICAgIC8vIHNldCB0aGUgc2luZ2xldG9uIGZpZWxkIHRpdGxlIGZvcm1hdHRlclxuICAgIHZsRmllbGREZWYuc2V0VGl0bGVGb3JtYXR0ZXIob3B0LmZpZWxkVGl0bGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyAxLiBJbml0aWFsaXplIGNvbmZpZyBieSBkZWVwIG1lcmdpbmcgZGVmYXVsdCBjb25maWcgd2l0aCB0aGUgY29uZmlnIHByb3ZpZGVkIHZpYSBvcHRpb24gYW5kIHRoZSBpbnB1dCBzcGVjLlxuICAgIGNvbnN0IGNvbmZpZyA9IGluaXRDb25maWcobWVyZ2VEZWVwKHt9LCBvcHQuY29uZmlnLCBpbnB1dFNwZWMuY29uZmlnKSk7XG5cbiAgICAvLyAyLiBOb3JtYWxpemU6IENvbnZlcnQgaW5wdXQgc3BlYyAtPiBub3JtYWxpemVkIHNwZWNcblxuICAgIC8vIC0gRGVjb21wb3NlIGFsbCBleHRlbmRlZCB1bml0IHNwZWNzIGludG8gY29tcG9zaXRpb24gb2YgdW5pdCBzcGVjLiAgRm9yIGV4YW1wbGUsIGEgYm94IHBsb3QgZ2V0IGV4cGFuZGVkIGludG8gbXVsdGlwbGUgbGF5ZXJzIG9mIGJhcnMsIHRpY2tzLCBhbmQgcnVsZXMuIFRoZSBzaG9ydGhhbmQgcm93L2NvbHVtbiBjaGFubmVsIGlzIGFsc28gZXhwYW5kZWQgdG8gYSBmYWNldCBzcGVjLlxuICAgIGNvbnN0IHNwZWMgPSBub3JtYWxpemUoaW5wdXRTcGVjLCBjb25maWcpO1xuICAgIC8vIC0gTm9ybWFsaXplIGF1dG9zaXplIHRvIGJlIGEgYXV0b3NpemUgcHJvcGVydGllcyBvYmplY3QuXG4gICAgY29uc3QgYXV0b3NpemUgPSBub3JtYWxpemVBdXRvU2l6ZShpbnB1dFNwZWMuYXV0b3NpemUsIGNvbmZpZy5hdXRvc2l6ZSwgaXNMYXllclNwZWMoc3BlYykgfHwgaXNVbml0U3BlYyhzcGVjKSk7XG5cbiAgICAvLyAzLiBCdWlsZCBNb2RlbDogbm9ybWFsaXplZCBzcGVjIC0+IE1vZGVsIChhIHRyZWUgc3RydWN0dXJlKVxuXG4gICAgLy8gVGhpcyBwaGFzZXMgaW5zdGFudGlhdGVzIHRoZSBtb2RlbHMgd2l0aCBkZWZhdWx0IGNvbmZpZyBieSBkb2luZyBhIHRvcC1kb3duIHRyYXZlcnNhbC4gVGhpcyBhbGxvd3MgdXMgdG8gcGFzcyBwcm9wZXJ0aWVzIHRoYXQgY2hpbGQgbW9kZWxzIGRlcml2ZSBmcm9tIHRoZWlyIHBhcmVudHMgdmlhIHRoZWlyIGNvbnN0cnVjdG9ycy5cbiAgICAvLyBTZWUgdGhlIGFic3RyYWN0IGBNb2RlbGAgY2xhc3MgYW5kIGl0cyBjaGlsZHJlbiAoVW5pdE1vZGVsLCBMYXllck1vZGVsLCBGYWNldE1vZGVsLCBSZXBlYXRNb2RlbCwgQ29uY2F0TW9kZWwpIGZvciBkaWZmZXJlbnQgdHlwZXMgb2YgbW9kZWxzLlxuICAgIGNvbnN0IG1vZGVsOiBNb2RlbCA9IGJ1aWxkTW9kZWwoc3BlYywgbnVsbCwgJycsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb25maWcsIGF1dG9zaXplLnR5cGUgPT09ICdmaXQnKTtcblxuICAgIC8vIDQgUGFyc2U6IE1vZGVsIC0tPiBNb2RlbCB3aXRoIGNvbXBvbmVudHMgKGNvbXBvbmVudHMgPSBpbnRlcm1lZGlhdGUgdGhhdCBjYW4gYmUgbWVyZ2VkXG4gICAgLy8gYW5kIGFzc2VtYmxlZCBlYXNpbHkpXG5cbiAgICAvLyBJbiB0aGlzIHBoYXNlLCB3ZSBkbyBhIGJvdHRvbS11cCB0cmF2ZXJzYWwgb3ZlciB0aGUgd2hvbGUgdHJlZSB0b1xuICAgIC8vIHBhcnNlIGZvciBlYWNoIHR5cGUgb2YgY29tcG9uZW50cyBvbmNlIChlLmcuLCBkYXRhLCBsYXlvdXQsIG1hcmssIHNjYWxlKS5cbiAgICAvLyBCeSBkb2luZyBib3R0b20tdXAgdHJhdmVyc2FsLCB3ZSBzdGFydCBwYXJzaW5nIGNvbXBvbmVudHMgb2YgdW5pdCBzcGVjcyBhbmRcbiAgICAvLyB0aGVuIG1lcmdlIGNoaWxkIGNvbXBvbmVudHMgb2YgcGFyZW50IGNvbXBvc2l0ZSBzcGVjcy5cbiAgICAvL1xuICAgIC8vIFBsZWFzZSBzZWUgaW5zaWRlIG1vZGVsLnBhcnNlKCkgZm9yIG9yZGVyIG9mIGRpZmZlcmVudCBjb21wb25lbnRzIHBhcnNlZC5cbiAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgLy8gNS4gT3B0aW1pemUgdGhlIGRhdGFmbG93LiAgVGhpcyB3aWxsIG1vZGlmeSB0aGUgZGF0YSBjb21wb25lbnQgb2YgdGhlIG1vZGVsLlxuICAgIG9wdGltaXplRGF0YWZsb3cobW9kZWwuY29tcG9uZW50LmRhdGEpO1xuXG4gICAgLy8gNi4gQXNzZW1ibGU6IGNvbnZlcnQgbW9kZWwgYW5kIGNvbXBvbmVudHMgLS0+IFZlZ2EgU3BlYy5cbiAgICByZXR1cm4gYXNzZW1ibGVUb3BMZXZlbE1vZGVsKG1vZGVsLCBnZXRUb3BMZXZlbFByb3BlcnRpZXMoaW5wdXRTcGVjLCBjb25maWcsIGF1dG9zaXplKSk7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gUmVzZXQgdGhlIHNpbmdsZXRvbiBsb2dnZXIgaWYgYSBsb2dnZXIgaXMgcHJvdmlkZWRcbiAgICBpZiAob3B0LmxvZ2dlcikge1xuICAgICAgbG9nLnJlc2V0KCk7XG4gICAgfVxuICAgIC8vIFJlc2V0IHRoZSBzaW5nbGV0b24gZmllbGQgdGl0bGUgZm9ybWF0dGVyIGlmIHByb3ZpZGVkXG4gICAgaWYgKG9wdC5maWVsZFRpdGxlKSB7XG4gICAgICB2bEZpZWxkRGVmLnJlc2V0VGl0bGVGb3JtYXR0ZXIoKTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBnZXRUb3BMZXZlbFByb3BlcnRpZXModG9wTGV2ZWxTcGVjOiBUb3BMZXZlbDxhbnk+LCBjb25maWc6IENvbmZpZywgYXV0b3NpemU6IEF1dG9TaXplUGFyYW1zKSB7XG4gIHJldHVybiB7XG4gICAgYXV0b3NpemU6IGtleXMoYXV0b3NpemUpLmxlbmd0aCA9PT0gMSAmJiBhdXRvc2l6ZS50eXBlID8gYXV0b3NpemUudHlwZSA6IGF1dG9zaXplLFxuICAgIC4uLmV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXMoY29uZmlnKSxcbiAgICAuLi5leHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzKHRvcExldmVsU3BlYylcbiAgfTtcbn1cblxuLypcbiAqIEFzc2VtYmxlIHRoZSB0b3AtbGV2ZWwgbW9kZWwuXG4gKlxuICogTm90ZTogdGhpcyBjb3VsZG4ndCBiZSBgbW9kZWwuYXNzZW1ibGUoKWAgc2luY2UgdGhlIHRvcC1sZXZlbCBtb2RlbFxuICogbmVlZHMgc29tZSBzcGVjaWFsIHRyZWF0bWVudCB0byBnZW5lcmF0ZSB0b3AtbGV2ZWwgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gYXNzZW1ibGVUb3BMZXZlbE1vZGVsKG1vZGVsOiBNb2RlbCwgdG9wTGV2ZWxQcm9wZXJ0aWVzOiBUb3BMZXZlbFByb3BlcnRpZXMgJiBMYXlvdXRTaXplTWl4aW5zKSB7XG4gIC8vIFRPRE86IGNoYW5nZSB0eXBlIHRvIGJlY29tZSBWZ1NwZWNcblxuICAvLyBDb25maWcgd2l0aCBWZWdhLUxpdGUgb25seSBjb25maWcgcmVtb3ZlZC5cbiAgY29uc3QgdmdDb25maWcgPSBtb2RlbC5jb25maWcgPyBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnKG1vZGVsLmNvbmZpZykgOiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgZGF0YSA9IFtdLmNvbmNhdChcbiAgICBtb2RlbC5hc3NlbWJsZVNlbGVjdGlvbkRhdGEoW10pLFxuICAgIC8vIG9ubHkgYXNzZW1ibGUgZGF0YSBpbiB0aGUgcm9vdFxuICAgIGFzc2VtYmxlUm9vdERhdGEobW9kZWwuY29tcG9uZW50LmRhdGEsIHRvcExldmVsUHJvcGVydGllcy5kYXRhc2V0cyB8fCB7fSlcbiAgKTtcblxuICBkZWxldGUgdG9wTGV2ZWxQcm9wZXJ0aWVzLmRhdGFzZXRzO1xuXG4gIGNvbnN0IHByb2plY3Rpb25zID0gbW9kZWwuYXNzZW1ibGVQcm9qZWN0aW9ucygpO1xuICBjb25zdCB0aXRsZSA9IG1vZGVsLmFzc2VtYmxlVGl0bGUoKTtcbiAgY29uc3Qgc3R5bGUgPSBtb2RlbC5hc3NlbWJsZUdyb3VwU3R5bGUoKTtcblxuICBsZXQgbGF5b3V0U2lnbmFscyA9IG1vZGVsLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpO1xuXG4gIC8vIG1vdmUgd2lkdGggYW5kIGhlaWdodCBzaWduYWxzIHdpdGggdmFsdWVzIHRvIHRvcCBsZXZlbFxuICBsYXlvdXRTaWduYWxzID0gbGF5b3V0U2lnbmFscy5maWx0ZXIoc2lnbmFsID0+IHtcbiAgICBpZiAoKHNpZ25hbC5uYW1lID09PSAnd2lkdGgnIHx8IHNpZ25hbC5uYW1lID09PSAnaGVpZ2h0JykgJiYgc2lnbmFsLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRvcExldmVsUHJvcGVydGllc1tzaWduYWwubmFtZV0gPSArc2lnbmFsLnZhbHVlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG5cbiAgY29uc3Qgb3V0cHV0ID0ge1xuICAgICRzY2hlbWE6ICdodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhL3YzLjAuanNvbicsXG4gICAgLi4uKG1vZGVsLmRlc2NyaXB0aW9uID8ge2Rlc2NyaXB0aW9uOiBtb2RlbC5kZXNjcmlwdGlvbn0gOiB7fSksXG4gICAgLi4udG9wTGV2ZWxQcm9wZXJ0aWVzLFxuICAgIC4uLih0aXRsZT8ge3RpdGxlfSA6IHt9KSxcbiAgICAuLi4oc3R5bGU/IHtzdHlsZX0gOiB7fSksXG4gICAgZGF0YTogZGF0YSxcbiAgICAuLi4ocHJvamVjdGlvbnMubGVuZ3RoID4gMCA/IHtwcm9qZWN0aW9uczogcHJvamVjdGlvbnN9IDoge30pLFxuICAgIC4uLm1vZGVsLmFzc2VtYmxlR3JvdXAoW1xuICAgICAgLi4ubGF5b3V0U2lnbmFscyxcbiAgICAgIC4uLm1vZGVsLmFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKFtdKVxuICAgIF0pLFxuICAgIC4uLih2Z0NvbmZpZyA/IHtjb25maWc6IHZnQ29uZmlnfSA6IHt9KVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogb3V0cHV0XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgLyBlcnJvcnMgaGVyZVxuICB9O1xufVxuIl19