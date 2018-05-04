import * as tslib_1 from "tslib";
import { initConfig, stripAndRedirectConfig } from '../config';
import * as vlFieldDef from '../fielddef';
import * as log from '../log';
import { isLayerSpec, isUnitSpec, normalize } from '../spec';
import { extractTopLevelProperties, normalizeAutoSize } from '../toplevelprops';
import { keys, mergeDeep } from '../util';
import { buildModel } from './buildmodel';
import { assembleRootData } from './data/assemble';
import { optimizeDataflow } from './data/optimize';
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
export function compile(inputSpec, opt) {
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
        var config = initConfig(mergeDeep({}, opt.config, inputSpec.config));
        // 2. Normalize: Convert input spec -> normalized spec
        // - Decompose all extended unit specs into composition of unit spec.  For example, a box plot get expanded into multiple layers of bars, ticks, and rules. The shorthand row/column channel is also expanded to a facet spec.
        var spec = normalize(inputSpec, config);
        // - Normalize autosize to be a autosize properties object.
        var autosize = normalizeAutoSize(inputSpec.autosize, config.autosize, isLayerSpec(spec) || isUnitSpec(spec));
        // 3. Build Model: normalized spec -> Model (a tree structure)
        // This phases instantiates the models with default config by doing a top-down traversal. This allows us to pass properties that child models derive from their parents via their constructors.
        // See the abstract `Model` class and its children (UnitModel, LayerModel, FacetModel, RepeatModel, ConcatModel) for different types of models.
        var model = buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');
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
        optimizeDataflow(model.component.data);
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
function getTopLevelProperties(topLevelSpec, config, autosize) {
    return tslib_1.__assign({ autosize: keys(autosize).length === 1 && autosize.type ? autosize.type : autosize }, extractTopLevelProperties(config), extractTopLevelProperties(topLevelSpec));
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
    var vgConfig = model.config ? stripAndRedirectConfig(model.config) : undefined;
    var data = [].concat(model.assembleSelectionData([]), 
    // only assemble data in the root
    assembleRootData(model.component.data, topLevelProperties.datasets || {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBUyxVQUFVLEVBQUUsc0JBQXNCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDckUsT0FBTyxLQUFLLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxLQUFLLEdBQUcsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQW9CLFNBQVMsRUFBeUIsTUFBTSxTQUFTLENBQUM7QUFDckcsT0FBTyxFQUFpQix5QkFBeUIsRUFBRSxpQkFBaUIsRUFBcUIsTUFBTSxrQkFBa0IsQ0FBQztBQUNsSCxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBVWpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILE1BQU0sa0JBQWtCLFNBQXVCLEVBQUUsR0FBd0I7SUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtJQUN2RSxtQ0FBbUM7SUFDbkMsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2Qsa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1FBQ2xCLDBDQUEwQztRQUMxQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsSUFBSTtRQUNGLDhHQUE4RztRQUM5RyxJQUFNLE1BQU0sR0FBRyxV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QUFrQztLQUNuQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnLCBpbml0Q29uZmlnLCBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNMYXllclNwZWMsIGlzVW5pdFNwZWMsIExheW91dFNpemVNaXhpbnMsIG5vcm1hbGl6ZSwgVG9wTGV2ZWwsIFRvcExldmVsU3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge0F1dG9TaXplUGFyYW1zLCBleHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzLCBub3JtYWxpemVBdXRvU2l6ZSwgVG9wTGV2ZWxQcm9wZXJ0aWVzfSBmcm9tICcuLi90b3BsZXZlbHByb3BzJztcbmltcG9ydCB7a2V5cywgbWVyZ2VEZWVwfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7YnVpbGRNb2RlbH0gZnJvbSAnLi9idWlsZG1vZGVsJztcbmltcG9ydCB7YXNzZW1ibGVSb290RGF0YX0gZnJvbSAnLi9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7b3B0aW1pemVEYXRhZmxvd30gZnJvbSAnLi9kYXRhL29wdGltaXplJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vbW9kZWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBpbGVPcHRpb25zIHtcbiAgY29uZmlnPzogQ29uZmlnO1xuICBsb2dnZXI/OiBsb2cuTG9nZ2VySW50ZXJmYWNlO1xuXG4gIGZpZWxkVGl0bGU/OiB2bEZpZWxkRGVmLkZpZWxkVGl0bGVGb3JtYXR0ZXI7XG59XG5cbi8qKlxuICogVmVnYS1MaXRlJ3MgbWFpbiBmdW5jdGlvbiwgZm9yIGNvbXBpbGluZyBWZWdhLWxpdGUgc3BlYyBpbnRvIFZlZ2Egc3BlYy5cbiAqXG4gKiBBdCBhIGhpZ2gtbGV2ZWwsIHdlIG1ha2UgdGhlIGZvbGxvd2luZyB0cmFuc2Zvcm1hdGlvbnMgaW4gZGlmZmVyZW50IHBoYXNlczpcbiAqXG4gKiBJbnB1dCBzcGVjXG4gKiAgICAgfFxuICogICAgIHwgIChOb3JtYWxpemF0aW9uKVxuICogICAgIHZcbiAqIE5vcm1hbGl6ZWQgU3BlY1xuICogICAgIHxcbiAqICAgICB8ICAoQnVpbGQgTW9kZWwpXG4gKiAgICAgdlxuICogQSBtb2RlbCB0cmVlIG9mIHRoZSBzcGVjXG4gKiAgICAgfFxuICogICAgIHwgIChQYXJzZSlcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgd2l0aCBwYXJzZWQgY29tcG9uZW50cyAoaW50ZXJtZWRpYXRlIHN0cnVjdHVyZSBvZiB2aXN1YWxpemF0aW9uIHByaW1pdGl2ZXMgaW4gYSBmb3JtYXQgdGhhdCBjYW4gYmUgZWFzaWx5IG1lcmdlZClcbiAqICAgICB8XG4gKiAgICAgfCAoT3B0aW1pemUpXG4gKiAgICAgdlxuICogQSBtb2RlbCB0cmVlIHdpdGggcGFyc2VkIGNvbXBvbmVudHMgd2l0aCB0aGUgZGF0YSBjb21wb25lbnQgb3B0aW1pemVkXG4gKiAgICAgfFxuICogICAgIHwgKEFzc2VtYmxlKVxuICogICAgIHZcbiAqIFZlZ2Egc3BlY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShpbnB1dFNwZWM6IFRvcExldmVsU3BlYywgb3B0OiBDb21waWxlT3B0aW9ucyA9IHt9KSB7XG4gIC8vIDAuIEF1Z21lbnQgb3B0IHdpdGggZGVmYXVsdCBvcHRzXG4gIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIHRvIHRoZSBwcm92aWRlZCBsb2dnZXJcbiAgICBsb2cuc2V0KG9wdC5sb2dnZXIpO1xuICB9XG5cbiAgaWYgKG9wdC5maWVsZFRpdGxlKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gZmllbGQgdGl0bGUgZm9ybWF0dGVyXG4gICAgdmxGaWVsZERlZi5zZXRUaXRsZUZvcm1hdHRlcihvcHQuZmllbGRUaXRsZSk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIDEuIEluaXRpYWxpemUgY29uZmlnIGJ5IGRlZXAgbWVyZ2luZyBkZWZhdWx0IGNvbmZpZyB3aXRoIHRoZSBjb25maWcgcHJvdmlkZWQgdmlhIG9wdGlvbiBhbmQgdGhlIGlucHV0IHNwZWMuXG4gICAgY29uc3QgY29uZmlnID0gaW5pdENvbmZpZyhtZXJnZURlZXAoe30sIG9wdC5jb25maWcsIGlucHV0U3BlYy5jb25maWcpKTtcblxuICAgIC8vIDIuIE5vcm1hbGl6ZTogQ29udmVydCBpbnB1dCBzcGVjIC0+IG5vcm1hbGl6ZWQgc3BlY1xuXG4gICAgLy8gLSBEZWNvbXBvc2UgYWxsIGV4dGVuZGVkIHVuaXQgc3BlY3MgaW50byBjb21wb3NpdGlvbiBvZiB1bml0IHNwZWMuICBGb3IgZXhhbXBsZSwgYSBib3ggcGxvdCBnZXQgZXhwYW5kZWQgaW50byBtdWx0aXBsZSBsYXllcnMgb2YgYmFycywgdGlja3MsIGFuZCBydWxlcy4gVGhlIHNob3J0aGFuZCByb3cvY29sdW1uIGNoYW5uZWwgaXMgYWxzbyBleHBhbmRlZCB0byBhIGZhY2V0IHNwZWMuXG4gICAgY29uc3Qgc3BlYyA9IG5vcm1hbGl6ZShpbnB1dFNwZWMsIGNvbmZpZyk7XG4gICAgLy8gLSBOb3JtYWxpemUgYXV0b3NpemUgdG8gYmUgYSBhdXRvc2l6ZSBwcm9wZXJ0aWVzIG9iamVjdC5cbiAgICBjb25zdCBhdXRvc2l6ZSA9IG5vcm1hbGl6ZUF1dG9TaXplKGlucHV0U3BlYy5hdXRvc2l6ZSwgY29uZmlnLmF1dG9zaXplLCBpc0xheWVyU3BlYyhzcGVjKSB8fCBpc1VuaXRTcGVjKHNwZWMpKTtcblxuICAgIC8vIDMuIEJ1aWxkIE1vZGVsOiBub3JtYWxpemVkIHNwZWMgLT4gTW9kZWwgKGEgdHJlZSBzdHJ1Y3R1cmUpXG5cbiAgICAvLyBUaGlzIHBoYXNlcyBpbnN0YW50aWF0ZXMgdGhlIG1vZGVscyB3aXRoIGRlZmF1bHQgY29uZmlnIGJ5IGRvaW5nIGEgdG9wLWRvd24gdHJhdmVyc2FsLiBUaGlzIGFsbG93cyB1cyB0byBwYXNzIHByb3BlcnRpZXMgdGhhdCBjaGlsZCBtb2RlbHMgZGVyaXZlIGZyb20gdGhlaXIgcGFyZW50cyB2aWEgdGhlaXIgY29uc3RydWN0b3JzLlxuICAgIC8vIFNlZSB0aGUgYWJzdHJhY3QgYE1vZGVsYCBjbGFzcyBhbmQgaXRzIGNoaWxkcmVuIChVbml0TW9kZWwsIExheWVyTW9kZWwsIEZhY2V0TW9kZWwsIFJlcGVhdE1vZGVsLCBDb25jYXRNb2RlbCkgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBtb2RlbHMuXG4gICAgY29uc3QgbW9kZWw6IE1vZGVsID0gYnVpbGRNb2RlbChzcGVjLCBudWxsLCAnJywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbmZpZywgYXV0b3NpemUudHlwZSA9PT0gJ2ZpdCcpO1xuXG4gICAgLy8gNCBQYXJzZTogTW9kZWwgLS0+IE1vZGVsIHdpdGggY29tcG9uZW50cyAoY29tcG9uZW50cyA9IGludGVybWVkaWF0ZSB0aGF0IGNhbiBiZSBtZXJnZWRcbiAgICAvLyBhbmQgYXNzZW1ibGVkIGVhc2lseSlcblxuICAgIC8vIEluIHRoaXMgcGhhc2UsIHdlIGRvIGEgYm90dG9tLXVwIHRyYXZlcnNhbCBvdmVyIHRoZSB3aG9sZSB0cmVlIHRvXG4gICAgLy8gcGFyc2UgZm9yIGVhY2ggdHlwZSBvZiBjb21wb25lbnRzIG9uY2UgKGUuZy4sIGRhdGEsIGxheW91dCwgbWFyaywgc2NhbGUpLlxuICAgIC8vIEJ5IGRvaW5nIGJvdHRvbS11cCB0cmF2ZXJzYWwsIHdlIHN0YXJ0IHBhcnNpbmcgY29tcG9uZW50cyBvZiB1bml0IHNwZWNzIGFuZFxuICAgIC8vIHRoZW4gbWVyZ2UgY2hpbGQgY29tcG9uZW50cyBvZiBwYXJlbnQgY29tcG9zaXRlIHNwZWNzLlxuICAgIC8vXG4gICAgLy8gUGxlYXNlIHNlZSBpbnNpZGUgbW9kZWwucGFyc2UoKSBmb3Igb3JkZXIgb2YgZGlmZmVyZW50IGNvbXBvbmVudHMgcGFyc2VkLlxuICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAvLyA1LiBPcHRpbWl6ZSB0aGUgZGF0YWZsb3cuICBUaGlzIHdpbGwgbW9kaWZ5IHRoZSBkYXRhIGNvbXBvbmVudCBvZiB0aGUgbW9kZWwuXG4gICAgb3B0aW1pemVEYXRhZmxvdyhtb2RlbC5jb21wb25lbnQuZGF0YSk7XG5cbiAgICAvLyA2LiBBc3NlbWJsZTogY29udmVydCBtb2RlbCBhbmQgY29tcG9uZW50cyAtLT4gVmVnYSBTcGVjLlxuICAgIHJldHVybiBhc3NlbWJsZVRvcExldmVsTW9kZWwobW9kZWwsIGdldFRvcExldmVsUHJvcGVydGllcyhpbnB1dFNwZWMsIGNvbmZpZywgYXV0b3NpemUpKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZXNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciBpZiBhIGxvZ2dlciBpcyBwcm92aWRlZFxuICAgIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgICBsb2cucmVzZXQoKTtcbiAgICB9XG4gICAgLy8gUmVzZXQgdGhlIHNpbmdsZXRvbiBmaWVsZCB0aXRsZSBmb3JtYXR0ZXIgaWYgcHJvdmlkZWRcbiAgICBpZiAob3B0LmZpZWxkVGl0bGUpIHtcbiAgICAgIHZsRmllbGREZWYucmVzZXRUaXRsZUZvcm1hdHRlcigpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGdldFRvcExldmVsUHJvcGVydGllcyh0b3BMZXZlbFNwZWM6IFRvcExldmVsPGFueT4sIGNvbmZpZzogQ29uZmlnLCBhdXRvc2l6ZTogQXV0b1NpemVQYXJhbXMpIHtcbiAgcmV0dXJuIHtcbiAgICBhdXRvc2l6ZToga2V5cyhhdXRvc2l6ZSkubGVuZ3RoID09PSAxICYmIGF1dG9zaXplLnR5cGUgPyBhdXRvc2l6ZS50eXBlIDogYXV0b3NpemUsXG4gICAgLi4uZXh0cmFjdFRvcExldmVsUHJvcGVydGllcyhjb25maWcpLFxuICAgIC4uLmV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXModG9wTGV2ZWxTcGVjKVxuICB9O1xufVxuXG4vKlxuICogQXNzZW1ibGUgdGhlIHRvcC1sZXZlbCBtb2RlbC5cbiAqXG4gKiBOb3RlOiB0aGlzIGNvdWxkbid0IGJlIGBtb2RlbC5hc3NlbWJsZSgpYCBzaW5jZSB0aGUgdG9wLWxldmVsIG1vZGVsXG4gKiBuZWVkcyBzb21lIHNwZWNpYWwgdHJlYXRtZW50IHRvIGdlbmVyYXRlIHRvcC1sZXZlbCBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBhc3NlbWJsZVRvcExldmVsTW9kZWwobW9kZWw6IE1vZGVsLCB0b3BMZXZlbFByb3BlcnRpZXM6IFRvcExldmVsUHJvcGVydGllcyAmIExheW91dFNpemVNaXhpbnMpIHtcbiAgLy8gVE9ETzogY2hhbmdlIHR5cGUgdG8gYmVjb21lIFZnU3BlY1xuXG4gIC8vIENvbmZpZyB3aXRoIFZlZ2EtTGl0ZSBvbmx5IGNvbmZpZyByZW1vdmVkLlxuICBjb25zdCB2Z0NvbmZpZyA9IG1vZGVsLmNvbmZpZyA/IHN0cmlwQW5kUmVkaXJlY3RDb25maWcobW9kZWwuY29uZmlnKSA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBkYXRhID0gW10uY29uY2F0KFxuICAgIG1vZGVsLmFzc2VtYmxlU2VsZWN0aW9uRGF0YShbXSksXG4gICAgLy8gb25seSBhc3NlbWJsZSBkYXRhIGluIHRoZSByb290XG4gICAgYXNzZW1ibGVSb290RGF0YShtb2RlbC5jb21wb25lbnQuZGF0YSwgdG9wTGV2ZWxQcm9wZXJ0aWVzLmRhdGFzZXRzIHx8IHt9KVxuICApO1xuXG4gIGRlbGV0ZSB0b3BMZXZlbFByb3BlcnRpZXMuZGF0YXNldHM7XG5cbiAgY29uc3QgcHJvamVjdGlvbnMgPSBtb2RlbC5hc3NlbWJsZVByb2plY3Rpb25zKCk7XG4gIGNvbnN0IHRpdGxlID0gbW9kZWwuYXNzZW1ibGVUaXRsZSgpO1xuICBjb25zdCBzdHlsZSA9IG1vZGVsLmFzc2VtYmxlR3JvdXBTdHlsZSgpO1xuXG4gIGxldCBsYXlvdXRTaWduYWxzID0gbW9kZWwuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk7XG5cbiAgLy8gbW92ZSB3aWR0aCBhbmQgaGVpZ2h0IHNpZ25hbHMgd2l0aCB2YWx1ZXMgdG8gdG9wIGxldmVsXG4gIGxheW91dFNpZ25hbHMgPSBsYXlvdXRTaWduYWxzLmZpbHRlcihzaWduYWwgPT4ge1xuICAgIGlmICgoc2lnbmFsLm5hbWUgPT09ICd3aWR0aCcgfHwgc2lnbmFsLm5hbWUgPT09ICdoZWlnaHQnKSAmJiBzaWduYWwudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdG9wTGV2ZWxQcm9wZXJ0aWVzW3NpZ25hbC5uYW1lXSA9ICtzaWduYWwudmFsdWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuICBjb25zdCBvdXRwdXQgPSB7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EvdjMuMC5qc29uJyxcbiAgICAuLi4obW9kZWwuZGVzY3JpcHRpb24gPyB7ZGVzY3JpcHRpb246IG1vZGVsLmRlc2NyaXB0aW9ufSA6IHt9KSxcbiAgICAuLi50b3BMZXZlbFByb3BlcnRpZXMsXG4gICAgLi4uKHRpdGxlPyB7dGl0bGV9IDoge30pLFxuICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIC4uLihwcm9qZWN0aW9ucy5sZW5ndGggPiAwID8ge3Byb2plY3Rpb25zOiBwcm9qZWN0aW9uc30gOiB7fSksXG4gICAgLi4ubW9kZWwuYXNzZW1ibGVHcm91cChbXG4gICAgICAuLi5sYXlvdXRTaWduYWxzLFxuICAgICAgLi4ubW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoW10pXG4gICAgXSksXG4gICAgLi4uKHZnQ29uZmlnID8ge2NvbmZpZzogdmdDb25maWd9IDoge30pXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzcGVjOiBvdXRwdXRcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyAvIGVycm9ycyBoZXJlXG4gIH07XG59XG4iXX0=