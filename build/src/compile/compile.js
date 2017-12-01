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
    var output = __assign({ $schema: 'https://vega.github.io/schema/vega/v3.0.json' }, (model.description ? { description: model.description } : {}), topLevelProperties, (title ? { title: title } : {}), (style ? { style: style } : {}), { data: [].concat(model.assembleSelectionData([]), 
        // only assemble data in the root
        assemble_1.assembleRootData(model.component.data)) }, model.assembleGroup(layoutSignals.concat(model.assembleSelectionTopLevelSignals([]))), (vgConfig ? { config: vgConfig } : {}));
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9DQUFxRTtBQUNyRSx3Q0FBMEM7QUFDMUMsNEJBQThCO0FBQzlCLGdDQUE2RztBQUM3RyxrREFBa0g7QUFDbEgsZ0NBQXdDO0FBQ3hDLDJDQUF3QztBQUN4Qyw0Q0FBaUQ7QUFDakQsNENBQWlEO0FBVWpEOztHQUVHO0FBQ0gsaUJBQXdCLFNBQStCLEVBQUUsR0FBd0I7SUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtJQUMvRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNmLGtEQUFrRDtRQUNsRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkIsMENBQTBDO1FBQzFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILHVCQUF1QjtRQUN2QixJQUFNLE1BQU0sR0FBRyxtQkFBVSxDQUFDLGdCQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFdkUsK0NBQStDO1FBQy9DLDJEQUEyRDtRQUMzRCxxRUFBcUU7UUFDckUsSUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFMUMsK0VBQStFO1FBQy9FLHdHQUF3RztRQUN4RyxJQUFNLFFBQVEsR0FBRyxpQ0FBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JBQVcsQ0FBQyxJQUFJ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S0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNyQixDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDeEIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQ2IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQztRQUMvQixpQ0FBaUM7UUFDakMsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FDdkMsSUFDRSxLQUFLLENBQUMsYUFBYSxDQUNqQixhQUFhLFFBQ2IsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsQ0FBQyxFQUM3QyxFQUNDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ3hDLENBQUM7SUFFRixNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLGtDQUFrQztLQUNuQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnLCBpbml0Q29uZmlnLCBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNMYXllclNwZWMsIGlzVW5pdFNwZWMsIExheW91dFNpemVNaXhpbnMsIG5vcm1hbGl6ZSwgVG9wTGV2ZWwsIFRvcExldmVsRXh0ZW5kZWRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7QXV0b1NpemVQYXJhbXMsIGV4dHJhY3RUb3BMZXZlbFByb3BlcnRpZXMsIG5vcm1hbGl6ZUF1dG9TaXplLCBUb3BMZXZlbFByb3BlcnRpZXN9IGZyb20gJy4uL3RvcGxldmVscHJvcHMnO1xuaW1wb3J0IHtrZXlzLCBtZXJnZURlZXB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtvcHRpbWl6ZURhdGFmbG93fSBmcm9tICcuL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGlsZU9wdGlvbnMge1xuICBjb25maWc/OiBDb25maWc7XG4gIGxvZ2dlcj86IGxvZy5Mb2dnZXJJbnRlcmZhY2U7XG5cbiAgZmllbGRUaXRsZT86IHZsRmllbGREZWYuRmllbGRUaXRsZUZvcm1hdHRlcjtcbn1cblxuLyoqXG4gKiBNb2R1bGUgZm9yIGNvbXBpbGluZyBWZWdhLWxpdGUgc3BlYyBpbnRvIFZlZ2Egc3BlYy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoaW5wdXRTcGVjOiBUb3BMZXZlbEV4dGVuZGVkU3BlYywgb3B0OiBDb21waWxlT3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHQubG9nZ2VyKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIHRvIHRoZSBwcm92aWRlZCBsb2dnZXJcbiAgICBsb2cuc2V0KG9wdC5sb2dnZXIpO1xuICB9XG5cbiAgaWYgKG9wdC5maWVsZFRpdGxlKSB7XG4gICAgLy8gc2V0IHRoZSBzaW5nbGV0b24gZmllbGQgdGl0bGUgZm9ybWF0dGVyXG4gICAgdmxGaWVsZERlZi5zZXRUaXRsZUZvcm1hdHRlcihvcHQuZmllbGRUaXRsZSk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIDEuIGluaXRpYWxpemUgY29uZmlnXG4gICAgY29uc3QgY29uZmlnID0gaW5pdENvbmZpZyhtZXJnZURlZXAoe30sIG9wdC5jb25maWcsIGlucHV0U3BlYy5jb25maWcpKTtcblxuICAgIC8vIDIuIENvbnZlcnQgaW5wdXQgc3BlYyBpbnRvIGEgbm9ybWFsaXplZCBmb3JtXG4gICAgLy8gKE5vcm1hbGl6ZSBhdXRvc2l6ZSB0byBiZSBhIGF1dG9zaXplIHByb3BlcnRpZXMgb2JqZWN0LilcbiAgICAvLyAoRGVjb21wb3NlIGFsbCBleHRlbmRlZCB1bml0IHNwZWNzIGludG8gY29tcG9zaXRpb24gb2YgdW5pdCBzcGVjLilcbiAgICBjb25zdCBzcGVjID0gbm9ybWFsaXplKGlucHV0U3BlYywgY29uZmlnKTtcblxuICAgIC8vIDMuIEluc3RhbnRpYXRlIHRoZSBtb2RlbHMgd2l0aCBkZWZhdWx0IGNvbmZpZyBieSBkb2luZyBhIHRvcC1kb3duIHRyYXZlcnNhbC5cbiAgICAvLyBUaGlzIGFsbG93cyB1cyB0byBwYXNzIHByb3BlcnRpZXMgdGhhdCBjaGlsZCBtb2RlbHMgZGVyaXZlIGZyb20gdGhlaXIgcGFyZW50cyB2aWEgdGhlaXIgY29uc3RydWN0b3JzLlxuICAgIGNvbnN0IGF1dG9zaXplID0gbm9ybWFsaXplQXV0b1NpemUoaW5wdXRTcGVjLmF1dG9zaXplLCBjb25maWcuYXV0b3NpemUsIGlzTGF5ZXJTcGVjKHNwZWMpIHx8IGlzVW5pdFNwZWMoc3BlYykpO1xuICAgIGNvbnN0IG1vZGVsID0gYnVpbGRNb2RlbChzcGVjLCBudWxsLCAnJywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbmZpZywgYXV0b3NpemUudHlwZSA9PT0gJ2ZpdCcpO1xuXG4gICAgLy8gNC4gUGFyc2UgcGFydHMgb2YgZWFjaCBtb2RlbCB0byBwcm9kdWNlIGNvbXBvbmVudHMgdGhhdCBjYW4gYmUgbWVyZ2VkXG4gICAgLy8gYW5kIGFzc2VtYmxlZCBlYXNpbHkgYXMgYSBwYXJ0IG9mIGEgbW9kZWwuXG4gICAgLy8gSW4gdGhpcyBwaGFzZSwgd2UgZG8gYSBib3R0b20tdXAgdHJhdmVyc2FsIG92ZXIgdGhlIHdob2xlIHRyZWUgdG9cbiAgICAvLyBwYXJzZSBmb3IgZWFjaCB0eXBlIG9mIGNvbXBvbmVudHMgb25jZSAoZS5nLiwgZGF0YSwgbGF5b3V0LCBtYXJrLCBzY2FsZSkuXG4gICAgLy8gQnkgZG9pbmcgYm90dG9tLXVwIHRyYXZlcnNhbCwgd2Ugc3RhcnQgcGFyc2luZyBjb21wb25lbnRzIG9mIHVuaXQgc3BlY3MgYW5kXG4gICAgLy8gdGhlbiBtZXJnZSBjaGlsZCBjb21wb25lbnRzIG9mIHBhcmVudCBjb21wb3NpdGUgc3BlY3MuXG4gICAgLy9cbiAgICAvLyBQbGVhc2Ugc2VlIGluc2lkZSBtb2RlbC5wYXJzZSgpIGZvciBvcmRlciBvZiBkaWZmZXJlbnQgY29tcG9uZW50cyBwYXJzZWQuXG4gICAgbW9kZWwucGFyc2UoKTtcblxuICAgIC8vIDUuIE9wdGltaXplIHRoZSBkYXRhZm93LlxuICAgIG9wdGltaXplRGF0YWZsb3cobW9kZWwuY29tcG9uZW50LmRhdGEpO1xuXG4gICAgLy8gNi4gQXNzZW1ibGUgYSBWZWdhIFNwZWMgZnJvbSB0aGUgcGFyc2VkIGNvbXBvbmVudHMuXG4gICAgcmV0dXJuIGFzc2VtYmxlVG9wTGV2ZWxNb2RlbChtb2RlbCwgZ2V0VG9wTGV2ZWxQcm9wZXJ0aWVzKGlucHV0U3BlYywgY29uZmlnLCBhdXRvc2l6ZSkpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlc2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIGlmIGEgbG9nZ2VyIGlzIHByb3ZpZGVkXG4gICAgaWYgKG9wdC5sb2dnZXIpIHtcbiAgICAgIGxvZy5yZXNldCgpO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgc2luZ2xldG9uIGZpZWxkIHRpdGxlIGZvcm1hdHRlciBpZiBwcm92aWRlZFxuICAgIGlmIChvcHQuZmllbGRUaXRsZSkge1xuICAgICAgdmxGaWVsZERlZi5yZXNldFRpdGxlRm9ybWF0dGVyKCk7XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gZ2V0VG9wTGV2ZWxQcm9wZXJ0aWVzKHRvcExldmVsU3BlYzogVG9wTGV2ZWw8YW55PiwgY29uZmlnOiBDb25maWcsIGF1dG9zaXplOiBBdXRvU2l6ZVBhcmFtcykge1xuICByZXR1cm4ge1xuICAgIGF1dG9zaXplOiBrZXlzKGF1dG9zaXplKS5sZW5ndGggPT09IDEgJiYgYXV0b3NpemUudHlwZSA/IGF1dG9zaXplLnR5cGUgOiBhdXRvc2l6ZSxcbiAgICAuLi5leHRyYWN0VG9wTGV2ZWxQcm9wZXJ0aWVzKGNvbmZpZyksXG4gICAgLi4uZXh0cmFjdFRvcExldmVsUHJvcGVydGllcyh0b3BMZXZlbFNwZWMpXG4gIH07XG59XG5cbi8qXG4gKiBBc3NlbWJsZSB0aGUgdG9wLWxldmVsIG1vZGVsLlxuICpcbiAqIE5vdGU6IHRoaXMgY291bGRuJ3QgYmUgYG1vZGVsLmFzc2VtYmxlKClgIHNpbmNlIHRoZSB0b3AtbGV2ZWwgbW9kZWxcbiAqIG5lZWRzIHNvbWUgc3BlY2lhbCB0cmVhdG1lbnQgdG8gZ2VuZXJhdGUgdG9wLWxldmVsIHByb3BlcnRpZXMuXG4gKi9cbmZ1bmN0aW9uIGFzc2VtYmxlVG9wTGV2ZWxNb2RlbChtb2RlbDogTW9kZWwsIHRvcExldmVsUHJvcGVydGllczogVG9wTGV2ZWxQcm9wZXJ0aWVzICYgTGF5b3V0U2l6ZU1peGlucykge1xuICAvLyBUT0RPOiBjaGFuZ2UgdHlwZSB0byBiZWNvbWUgVmdTcGVjXG5cbiAgLy8gQ29uZmlnIHdpdGggVmVnYS1MaXRlIG9ubHkgY29uZmlnIHJlbW92ZWQuXG4gIGNvbnN0IHZnQ29uZmlnID0gbW9kZWwuY29uZmlnID8gc3RyaXBBbmRSZWRpcmVjdENvbmZpZyhtb2RlbC5jb25maWcpIDogdW5kZWZpbmVkO1xuICBjb25zdCB0aXRsZSA9IG1vZGVsLmFzc2VtYmxlVGl0bGUoKTtcbiAgY29uc3Qgc3R5bGUgPSBtb2RlbC5hc3NlbWJsZUdyb3VwU3R5bGUoKTtcblxuICBsZXQgbGF5b3V0U2lnbmFscyA9IG1vZGVsLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpO1xuXG4gIC8vIG1vdmUgd2lkdGggYW5kIGhlaWdodCBzaWduYWxzIHdpdGggdmFsdWVzIHRvIHRvcCBsZXZlbFxuICBsYXlvdXRTaWduYWxzID0gbGF5b3V0U2lnbmFscy5maWx0ZXIoc2lnbmFsID0+IHtcbiAgICBpZiAoKHNpZ25hbC5uYW1lID09PSAnd2lkdGgnIHx8IHNpZ25hbC5uYW1lID09PSAnaGVpZ2h0JykgJiYgc2lnbmFsLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRvcExldmVsUHJvcGVydGllc1tzaWduYWwubmFtZV0gPSArc2lnbmFsLnZhbHVlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG5cbiAgY29uc3Qgb3V0cHV0ID0ge1xuICAgICRzY2hlbWE6ICdodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhL3YzLjAuanNvbicsXG4gICAgLi4uKG1vZGVsLmRlc2NyaXB0aW9uID8ge2Rlc2NyaXB0aW9uOiBtb2RlbC5kZXNjcmlwdGlvbn0gOiB7fSksXG4gICAgLi4udG9wTGV2ZWxQcm9wZXJ0aWVzLFxuICAgIC4uLih0aXRsZT8ge3RpdGxlfSA6IHt9KSxcbiAgICAuLi4oc3R5bGU/IHtzdHlsZX0gOiB7fSksXG4gICAgZGF0YTogW10uY29uY2F0KFxuICAgICAgbW9kZWwuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKFtdKSxcbiAgICAgIC8vIG9ubHkgYXNzZW1ibGUgZGF0YSBpbiB0aGUgcm9vdFxuICAgICAgYXNzZW1ibGVSb290RGF0YShtb2RlbC5jb21wb25lbnQuZGF0YSlcbiAgICApLFxuICAgIC4uLm1vZGVsLmFzc2VtYmxlR3JvdXAoW1xuICAgICAgLi4ubGF5b3V0U2lnbmFscyxcbiAgICAgIC4uLm1vZGVsLmFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKFtdKVxuICAgIF0pLFxuICAgIC4uLih2Z0NvbmZpZyA/IHtjb25maWc6IHZnQ29uZmlnfSA6IHt9KVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogb3V0cHV0XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgLyBlcnJvcnMgaGVyZVxuICB9O1xufVxuIl19