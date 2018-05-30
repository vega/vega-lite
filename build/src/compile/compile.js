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
        optimizeDataflow(model.component.data);
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
    var output = tslib_1.__assign({ $schema: 'https://vega.github.io/schema/vega/v3.json' }, (model.description ? { description: model.description } : {}), topLevelProperties, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: data }, (projections.length > 0 ? { projections: projections } : {}), model.assembleGroup(layoutSignals.concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBUyxVQUFVLEVBQUUsc0JBQXNCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDckUsT0FBTyxLQUFLLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxLQUFLLEdBQUcsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQW9CLFNBQVMsRUFBeUIsTUFBTSxTQUFTLENBQUM7QUFDckcsT0FBTyxFQUFpQix5QkFBeUIsRUFBRSxpQkFBaUIsRUFBcUIsTUFBTSxrQkFBa0IsQ0FBQztBQUNsSCxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBVWpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILE1BQU0sa0JBQWtCLFNBQXVCLEVBQUUsR0FBd0I7SUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtJQUN2RSxtQ0FBbUM7SUFDbkMsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2Qsa0RBQWtEO1FBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1FBQ2xCLDBDQUEwQztRQUMxQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsSUFBSTtRQUNGLDhHQUE4RztRQUM5RyxJQUFNLE1BQU0sR0FBRyxV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QUNMLElBQUksRUFBRSxNQUFNO1FBQ1osa0NBQWtDO0tBQ25DLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWcsIGluaXRDb25maWcsIHN0cmlwQW5kUmVkaXJlY3RDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtpc0xheWVyU3BlYywgaXNVbml0U3BlYywgTGF5b3V0U2l6ZU1peGlucywgbm9ybWFsaXplLCBUb3BMZXZlbCwgVG9wTGV2ZWxTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7QXV0b1NpemVQYXJhbXMsIGV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXMsIG5vcm1hbGl6ZUF1dG9TaXplLCBUb3BMZXZlbFByb3BlcnRpZXN9IGZyb20gJy4uL3RvcGxldmVscHJvcHMnO1xuaW1wb3J0IHtrZXlzLCBtZXJnZURlZXB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtvcHRpbWl6ZURhdGFmbG93fSBmcm9tICcuL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZU9wdGlvbnMge1xuICBjb25maWc/OiBDb25maWc7XG4gIGxvZ2dlcj86IGxvZy5Mb2dnZXJJbnRlcmZhY2U7XG5cbiAgZmllbGRUaXRsZT86IHZsRmllbGREZWYuRmllbGRUaXRsZUZvcm1hdHRlcjtcbn1cblxuLyoqXG4gKiBWZWdhLUxpdGUncyBtYWluIGZ1bmN0aW9uLCBmb3IgY29tcGlsaW5nIFZlZ2EtbGl0ZSBzcGVjIGludG8gVmVnYSBzcGVjLlxuICpcbiAqIEF0IGEgaGlnaC1sZXZlbCwgd2UgbWFrZSB0aGUgZm9sbG93aW5nIHRyYW5zZm9ybWF0aW9ucyBpbiBkaWZmZXJlbnQgcGhhc2VzOlxuICpcbiAqIElucHV0IHNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKE5vcm1hbGl6YXRpb24pXG4gKiAgICAgdlxuICogTm9ybWFsaXplZCBTcGVjIChSb3cvQ29sdW1uIGNoYW5uZWxzIGluIHNpbmdsZS12aWV3IHNwZWNzIGJlY29tZXMgZmFjZXRlZCBzcGVjcywgY29tcG9zaXRlIG1hcmtzIGJlY29tZXMgbGF5ZXJlZCBzcGVjcy4pXG4gKiAgICAgfFxuICogICAgIHwgIChCdWlsZCBNb2RlbClcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgb2YgdGhlIHNwZWNcbiAqICAgICB8XG4gKiAgICAgfCAgKFBhcnNlKVxuICogICAgIHZcbiAqIEEgbW9kZWwgdHJlZSB3aXRoIHBhcnNlZCBjb21wb25lbnRzIChpbnRlcm1lZGlhdGUgc3RydWN0dXJlIG9mIHZpc3VhbGl6YXRpb24gcHJpbWl0aXZlcyBpbiBhIGZvcm1hdCB0aGF0IGNhbiBiZSBlYXNpbHkgbWVyZ2VkKVxuICogICAgIHxcbiAqICAgICB8IChPcHRpbWl6ZSlcbiAqICAgICB2XG4gKiBBIG1vZGVsIHRyZWUgd2l0aCBwYXJzZWQgY29tcG9uZW50cyB3aXRoIHRoZSBkYXRhIGNvbXBvbmVudCBvcHRpbWl6ZWRcbiAqICAgICB8XG4gKiAgICAgfCAoQXNzZW1ibGUpXG4gKiAgICAgdlxuICogVmVnYSBzcGVjXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKGlucHV0U3BlYzogVG9wTGV2ZWxTcGVjLCBvcHQ6IENvbXBpbGVPcHRpb25zID0ge30pIHtcbiAgLy8gMC4gQXVnbWVudCBvcHQgd2l0aCBkZWZhdWx0IG9wdHNcbiAgaWYgKG9wdC5sb2dnZXIpIHtcbiAgICAvLyBzZXQgdGhlIHNpbmdsZXRvbiBsb2dnZXIgdG8gdGhlIHByb3ZpZGVkIGxvZ2dlclxuICAgIGxvZy5zZXQob3B0LmxvZ2dlcik7XG4gIH1cblxuICBpZiAob3B0LmZpZWxkVGl0bGUpIHtcbiAgICAvLyBzZXQgdGhlIHNpbmdsZXRvbiBmaWVsZCB0aXRsZSBmb3JtYXR0ZXJcbiAgICB2bEZpZWxkRGVmLnNldFRpdGxlRm9ybWF0dGVyKG9wdC5maWVsZFRpdGxlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gMS4gSW5pdGlhbGl6ZSBjb25maWcgYnkgZGVlcCBtZXJnaW5nIGRlZmF1bHQgY29uZmlnIHdpdGggdGhlIGNvbmZpZyBwcm92aWRlZCB2aWEgb3B0aW9uIGFuZCB0aGUgaW5wdXQgc3BlYy5cbiAgICBjb25zdCBjb25maWcgPSBpbml0Q29uZmlnKG1lcmdlRGVlcCh7fSwgb3B0LmNvbmZpZywgaW5wdXRTcGVjLmNvbmZpZykpO1xuXG4gICAgLy8gMi4gTm9ybWFsaXplOiBDb252ZXJ0IGlucHV0IHNwZWMgLT4gbm9ybWFsaXplZCBzcGVjXG5cbiAgICAvLyAtIERlY29tcG9zZSBhbGwgZXh0ZW5kZWQgdW5pdCBzcGVjcyBpbnRvIGNvbXBvc2l0aW9uIG9mIHVuaXQgc3BlYy4gIEZvciBleGFtcGxlLCBhIGJveCBwbG90IGdldCBleHBhbmRlZCBpbnRvIG11bHRpcGxlIGxheWVycyBvZiBiYXJzLCB0aWNrcywgYW5kIHJ1bGVzLiBUaGUgc2hvcnRoYW5kIHJvdy9jb2x1bW4gY2hhbm5lbCBpcyBhbHNvIGV4cGFuZGVkIHRvIGEgZmFjZXQgc3BlYy5cbiAgICBjb25zdCBzcGVjID0gbm9ybWFsaXplKGlucHV0U3BlYywgY29uZmlnKTtcbiAgICAvLyAtIE5vcm1hbGl6ZSBhdXRvc2l6ZSB0byBiZSBhIGF1dG9zaXplIHByb3BlcnRpZXMgb2JqZWN0LlxuICAgIGNvbnN0IGF1dG9zaXplID0gbm9ybWFsaXplQXV0b1NpemUoaW5wdXRTcGVjLmF1dG9zaXplLCBjb25maWcuYXV0b3NpemUsIGlzTGF5ZXJTcGVjKHNwZWMpIHx8IGlzVW5pdFNwZWMoc3BlYykpO1xuXG4gICAgLy8gMy4gQnVpbGQgTW9kZWw6IG5vcm1hbGl6ZWQgc3BlYyAtPiBNb2RlbCAoYSB0cmVlIHN0cnVjdHVyZSlcblxuICAgIC8vIFRoaXMgcGhhc2VzIGluc3RhbnRpYXRlcyB0aGUgbW9kZWxzIHdpdGggZGVmYXVsdCBjb25maWcgYnkgZG9pbmcgYSB0b3AtZG93biB0cmF2ZXJzYWwuIFRoaXMgYWxsb3dzIHVzIHRvIHBhc3MgcHJvcGVydGllcyB0aGF0IGNoaWxkIG1vZGVscyBkZXJpdmUgZnJvbSB0aGVpciBwYXJlbnRzIHZpYSB0aGVpciBjb25zdHJ1Y3RvcnMuXG4gICAgLy8gU2VlIHRoZSBhYnN0cmFjdCBgTW9kZWxgIGNsYXNzIGFuZCBpdHMgY2hpbGRyZW4gKFVuaXRNb2RlbCwgTGF5ZXJNb2RlbCwgRmFjZXRNb2RlbCwgUmVwZWF0TW9kZWwsIENvbmNhdE1vZGVsKSBmb3IgZGlmZmVyZW50IHR5cGVzIG9mIG1vZGVscy5cbiAgICBjb25zdCBtb2RlbDogTW9kZWwgPSBidWlsZE1vZGVsKHNwZWMsIG51bGwsICcnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29uZmlnLCBhdXRvc2l6ZS50eXBlID09PSAnZml0Jyk7XG5cbiAgICAvLyA0IFBhcnNlOiBNb2RlbCAtLT4gTW9kZWwgd2l0aCBjb21wb25lbnRzXG5cbiAgICAvLyBOb3RlIHRoYXQgY29tcG9uZW50cyA9IGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvbnMgdGhhdCBhcmUgZXF1aXZhbGVudCB0byBWZWdhIHNwZWNzLlxuICAgIC8vIFdlIG5lZWQgdGhlc2UgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uIGJlY2F1c2Ugd2UgbmVlZCB0byBtZXJnZSBtYW55IHZpc3VhbGl6YWl0b24gXCJjb21wb25lbnRzXCIgbGlrZSBwcm9qZWN0aW9ucywgc2NhbGVzLCBheGVzLCBhbmQgbGVnZW5kcy5cbiAgICAvLyBXZSB3aWxsIGxhdGVyIGNvbnZlcnQgdGhlc2UgY29tcG9uZW50cyBpbnRvIGFjdHVhbCBWZWdhIHNwZWNzIGluIHRoZSBhc3NlbWJsZSBwaGFzZS5cblxuICAgIC8vIEluIHRoaXMgcGhhc2UsIHdlIGRvIGEgYm90dG9tLXVwIHRyYXZlcnNhbCBvdmVyIHRoZSB3aG9sZSB0cmVlIHRvXG4gICAgLy8gcGFyc2UgZm9yIGVhY2ggdHlwZSBvZiBjb21wb25lbnRzIG9uY2UgKGUuZy4sIGRhdGEsIGxheW91dCwgbWFyaywgc2NhbGUpLlxuICAgIC8vIEJ5IGRvaW5nIGJvdHRvbS11cCB0cmF2ZXJzYWwsIHdlIHN0YXJ0IHBhcnNpbmcgY29tcG9uZW50cyBvZiB1bml0IHNwZWNzIGFuZFxuICAgIC8vIHRoZW4gbWVyZ2UgY2hpbGQgY29tcG9uZW50cyBvZiBwYXJlbnQgY29tcG9zaXRlIHNwZWNzLlxuICAgIC8vXG4gICAgLy8gUGxlYXNlIHNlZSBpbnNpZGUgbW9kZWwucGFyc2UoKSBmb3Igb3JkZXIgb2YgZGlmZmVyZW50IGNvbXBvbmVudHMgcGFyc2VkLlxuICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAvLyA1LiBPcHRpbWl6ZSB0aGUgZGF0YWZsb3cuICBUaGlzIHdpbGwgbW9kaWZ5IHRoZSBkYXRhIGNvbXBvbmVudCBvZiB0aGUgbW9kZWwuXG4gICAgb3B0aW1pemVEYXRhZmxvdyhtb2RlbC5jb21wb25lbnQuZGF0YSk7XG5cbiAgICAvLyA2LiBBc3NlbWJsZTogY29udmVydCBtb2RlbCBjb21wb25lbnRzIC0tPiBWZWdhIFNwZWMuXG4gICAgcmV0dXJuIGFzc2VtYmxlVG9wTGV2ZWxNb2RlbChtb2RlbCwgZ2V0VG9wTGV2ZWxQcm9wZXJ0aWVzKGlucHV0U3BlYywgY29uZmlnLCBhdXRvc2l6ZSkpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIGlmIGEgbG9nZ2VyIGlzIHByb3ZpZGVkXG4gICAgaWYgKG9wdC5sb2dnZXIpIHtcbiAgICAgIGxvZy5yZXNldCgpO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgc2luZ2xldG9uIGZpZWxkIHRpdGxlIGZvcm1hdHRlciBpZiBwcm92aWRlZFxuICAgIGlmIChvcHQuZmllbGRUaXRsZSkge1xuICAgICAgdmxGaWVsZERlZi5yZXNldFRpdGxlRm9ybWF0dGVyKCk7XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gZ2V0VG9wTGV2ZWxQcm9wZXJ0aWVzKHRvcExldmVsU3BlYzogVG9wTGV2ZWw8YW55PiwgY29uZmlnOiBDb25maWcsIGF1dG9zaXplOiBBdXRvU2l6ZVBhcmFtcykge1xuICByZXR1cm4ge1xuICAgIGF1dG9zaXplOiBrZXlzKGF1dG9zaXplKS5sZW5ndGggPT09IDEgJiYgYXV0b3NpemUudHlwZSA/IGF1dG9zaXplLnR5cGUgOiBhdXRvc2l6ZSxcbiAgICAuLi5leHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzKGNvbmZpZyksXG4gICAgLi4uZXh0cmFjdFRvcExldmVsUHJvcGVydGllcyh0b3BMZXZlbFNwZWMpXG4gIH07XG59XG5cbi8qXG4gKiBBc3NlbWJsZSB0aGUgdG9wLWxldmVsIG1vZGVsLlxuICpcbiAqIE5vdGU6IHRoaXMgY291bGRuJ3QgYmUgYG1vZGVsLmFzc2VtYmxlKClgIHNpbmNlIHRoZSB0b3AtbGV2ZWwgbW9kZWxcbiAqIG5lZWRzIHNvbWUgc3BlY2lhbCB0cmVhdG1lbnQgdG8gZ2VuZXJhdGUgdG9wLWxldmVsIHByb3BlcnRpZXMuXG4gKi9cbmZ1bmN0aW9uIGFzc2VtYmxlVG9wTGV2ZWxNb2RlbChtb2RlbDogTW9kZWwsIHRvcExldmVsUHJvcGVydGllczogVG9wTGV2ZWxQcm9wZXJ0aWVzICYgTGF5b3V0U2l6ZU1peGlucykge1xuICAvLyBUT0RPOiBjaGFuZ2UgdHlwZSB0byBiZWNvbWUgVmdTcGVjXG5cbiAgLy8gQ29uZmlnIHdpdGggVmVnYS1MaXRlIG9ubHkgY29uZmlnIHJlbW92ZWQuXG4gIGNvbnN0IHZnQ29uZmlnID0gbW9kZWwuY29uZmlnID8gc3RyaXBBbmRSZWRpcmVjdENvbmZpZyhtb2RlbC5jb25maWcpIDogdW5kZWZpbmVkO1xuXG4gIGNvbnN0IGRhdGEgPSBbXS5jb25jYXQoXG4gICAgbW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKFtdKSxcbiAgICAvLyBvbmx5IGFzc2VtYmxlIGRhdGEgaW4gdGhlIHJvb3RcbiAgICBhc3NlbWJsZVJvb3REYXRhKG1vZGVsLmNvbXBvbmVudC5kYXRhLCB0b3BMZXZlbFByb3BlcnRpZXMuZGF0YXNldHMgfHwge30pXG4gICk7XG5cbiAgZGVsZXRlIHRvcExldmVsUHJvcGVydGllcy5kYXRhc2V0cztcblxuICBjb25zdCBwcm9qZWN0aW9ucyA9IG1vZGVsLmFzc2VtYmxlUHJvamVjdGlvbnMoKTtcbiAgY29uc3QgdGl0bGUgPSBtb2RlbC5hc3NlbWJsZVRpdGxlKCk7XG4gIGNvbnN0IHN0eWxlID0gbW9kZWwuYXNzZW1ibGVHcm91cFN0eWxlKCk7XG5cbiAgbGV0IGxheW91dFNpZ25hbHMgPSBtb2RlbC5hc3NlbWJsZUxheW91dFNpZ25hbHMoKTtcblxuICAvLyBtb3ZlIHdpZHRoIGFuZCBoZWlnaHQgc2lnbmFscyB3aXRoIHZhbHVlcyB0byB0b3AgbGV2ZWxcbiAgbGF5b3V0U2lnbmFscyA9IGxheW91dFNpZ25hbHMuZmlsdGVyKHNpZ25hbCA9PiB7XG4gICAgaWYgKChzaWduYWwubmFtZSA9PT0gJ3dpZHRoJyB8fCBzaWduYWwubmFtZSA9PT0gJ2hlaWdodCcpICYmIHNpZ25hbC52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0b3BMZXZlbFByb3BlcnRpZXNbc2lnbmFsLm5hbWVdID0gK3NpZ25hbC52YWx1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIGNvbnN0IG91dHB1dCA9IHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS92My5qc29uJyxcbiAgICAuLi4obW9kZWwuZGVzY3JpcHRpb24gPyB7ZGVzY3JpcHRpb246IG1vZGVsLmRlc2NyaXB0aW9ufSA6IHt9KSxcbiAgICAuLi50b3BMZXZlbFByb3BlcnRpZXMsXG4gICAgLi4uKHRpdGxlPyB7dGl0bGV9IDoge30pLFxuICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIC4uLihwcm9qZWN0aW9ucy5sZW5ndGggPiAwID8ge3Byb2plY3Rpb25zOiBwcm9qZWN0aW9uc30gOiB7fSksXG4gICAgLi4ubW9kZWwuYXNzZW1ibGVHcm91cChbXG4gICAgICAuLi5sYXlvdXRTaWduYWxzLFxuICAgICAgLi4ubW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoW10pXG4gICAgXSksXG4gICAgLi4uKHZnQ29uZmlnID8ge2NvbmZpZzogdmdDb25maWd9IDoge30pXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzcGVjOiBvdXRwdXRcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyAvIGVycm9ycyBoZXJlXG4gIH07XG59XG4iXX0=