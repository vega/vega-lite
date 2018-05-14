import * as tslib_1 from "tslib";
import { isString } from 'vega-util';
import { isChannel, isScaleChannel } from '../channel';
import { forEach, reduce } from '../encoding';
import { getFieldDef, vgField } from '../fielddef';
import * as log from '../log';
import { hasDiscreteDomain } from '../scale';
import { isFacetSpec } from '../spec';
import { extractTitleConfig } from '../title';
import { normalizeTransform } from '../transform';
import { contains, keys, varName } from '../util';
import { isVgRangeStep } from '../vega.schema';
import { assembleAxes } from './axis/assemble';
import { getHeaderGroups, getTitleGroup, HEADER_CHANNELS } from './layout/header';
import { sizeExpr } from './layoutsize/assemble';
import { assembleLegends } from './legend/assemble';
import { parseLegend } from './legend/parse';
import { assembleProjections } from './projection/assemble';
import { parseProjection } from './projection/parse';
import { assembleScales } from './scale/assemble';
import { assembleDomain, getFieldFromDomain } from './scale/domain';
import { parseScale } from './scale/parse';
import { Split } from './split';
var NameMap = /** @class */ (function () {
    function NameMap() {
        this.nameMap = {};
    }
    NameMap.prototype.rename = function (oldName, newName) {
        this.nameMap[oldName] = newName;
    };
    NameMap.prototype.has = function (name) {
        return this.nameMap[name] !== undefined;
    };
    NameMap.prototype.get = function (name) {
        // If the name appears in the _nameMap, we need to read its new name.
        // We have to loop over the dict just in case the new name also gets renamed.
        while (this.nameMap[name] && name !== this.nameMap[name]) {
            name = this.nameMap[name];
        }
        return name;
    };
    return NameMap;
}());
export { NameMap };
/*
  We use type guards instead of `instanceof` as `instanceof` makes
  different parts of the compiler depend on the actual implementation of
  the model classes, which in turn depend on different parts of the compiler.
  Thus, `instanceof` leads to circular dependency problems.

  On the other hand, type guards only make different parts of the compiler
  depend on the type of the model classes, but not the actual implementation.
*/
export function isUnitModel(model) {
    return model && model.type === 'unit';
}
export function isFacetModel(model) {
    return model && model.type === 'facet';
}
export function isRepeatModel(model) {
    return model && model.type === 'repeat';
}
export function isConcatModel(model) {
    return model && model.type === 'concat';
}
export function isLayerModel(model) {
    return model && model.type === 'layer';
}
var Model = /** @class */ (function () {
    function Model(spec, parent, parentGivenName, config, repeater, resolve) {
        var _this = this;
        this.children = [];
        /**
         * Corrects the data references in marks after assemble.
         */
        this.correctDataNames = function (mark) {
            // TODO: make this correct
            // for normal data references
            if (mark.from && mark.from.data) {
                mark.from.data = _this.lookupDataSource(mark.from.data);
            }
            // for access to facet data
            if (mark.from && mark.from.facet && mark.from.facet.data) {
                mark.from.facet.data = _this.lookupDataSource(mark.from.facet.data);
            }
            return mark;
        };
        this.parent = parent;
        this.config = config;
        this.repeater = repeater;
        // If name is not provided, always use parent's givenName to avoid name conflicts.
        this.name = spec.name || parentGivenName;
        this.title = isString(spec.title) ? { text: spec.title } : spec.title;
        // Shared name maps
        this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
        this.projectionNameMap = parent ? parent.projectionNameMap : new NameMap();
        this.layoutSizeNameMap = parent ? parent.layoutSizeNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = normalizeTransform(spec.transform || []);
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : {},
                outputNodes: parent ? parent.component.data.outputNodes : {},
                outputNodeRefCounts: parent ? parent.component.data.outputNodeRefCounts : {},
                // data is faceted if the spec is a facet spec or the parent has faceted data and no data is defined
                isFaceted: isFacetSpec(spec) || (parent && parent.component.data.isFaceted && !spec.data)
            },
            layoutSize: new Split(),
            layoutHeaders: { row: {}, column: {} },
            mark: null,
            resolve: tslib_1.__assign({ scale: {}, axis: {}, legend: {} }, (resolve || {})),
            selection: null,
            scales: null,
            projection: null,
            axes: {},
            legends: {},
        };
    }
    Object.defineProperty(Model.prototype, "width", {
        get: function () {
            return this.getSizeSignalRef('width');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "height", {
        get: function () {
            return this.getSizeSignalRef('height');
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.initSize = function (size) {
        var width = size.width, height = size.height;
        if (width) {
            this.component.layoutSize.set('width', width, true);
        }
        if (height) {
            this.component.layoutSize.set('height', height, true);
        }
    };
    Model.prototype.parse = function () {
        this.parseScale();
        this.parseLayoutSize(); // depends on scale
        this.renameTopLevelLayoutSize();
        this.parseSelection();
        this.parseProjection();
        this.parseData(); // (pathorder) depends on markDef; selection filters depend on parsed selections; depends on projection because some transforms require the finalized projection name.
        this.parseAxisAndHeader(); // depends on scale and layout size
        this.parseLegend(); // depends on scale, markDef
        this.parseMarkGroup(); // depends on data name, scale, layout size, axisGroup, and children's scale, axis, legend and mark.
    };
    Model.prototype.parseScale = function () {
        parseScale(this);
    };
    Model.prototype.parseProjection = function () {
        parseProjection(this);
    };
    /**
     * Rename top-level spec's size to be just width / height, ignoring model name.
     * This essentially merges the top-level spec's width/height signals with the width/height signals
     * to help us reduce redundant signals declaration.
     */
    Model.prototype.renameTopLevelLayoutSize = function () {
        if (this.getName('width') !== 'width') {
            this.renameLayoutSize(this.getName('width'), 'width');
        }
        if (this.getName('height') !== 'height') {
            this.renameLayoutSize(this.getName('height'), 'height');
        }
    };
    Model.prototype.parseLegend = function () {
        parseLegend(this);
    };
    Model.prototype.assembleGroupStyle = function () {
        if (this.type === 'unit' || this.type === 'layer') {
            return 'cell';
        }
        return undefined;
    };
    Model.prototype.assembleLayoutSize = function () {
        if (this.type === 'unit' || this.type === 'layer') {
            return {
                width: this.getSizeSignalRef('width'),
                height: this.getSizeSignalRef('height')
            };
        }
        return undefined;
    };
    Model.prototype.assembleHeaderMarks = function () {
        var layoutHeaders = this.component.layoutHeaders;
        var headerMarks = [];
        for (var _i = 0, HEADER_CHANNELS_1 = HEADER_CHANNELS; _i < HEADER_CHANNELS_1.length; _i++) {
            var channel = HEADER_CHANNELS_1[_i];
            if (layoutHeaders[channel].title) {
                headerMarks.push(getTitleGroup(this, channel));
            }
        }
        for (var _a = 0, HEADER_CHANNELS_2 = HEADER_CHANNELS; _a < HEADER_CHANNELS_2.length; _a++) {
            var channel = HEADER_CHANNELS_2[_a];
            headerMarks = headerMarks.concat(getHeaderGroups(this, channel));
        }
        return headerMarks;
    };
    Model.prototype.assembleAxes = function () {
        return assembleAxes(this.component.axes, this.config);
    };
    Model.prototype.assembleLegends = function () {
        return assembleLegends(this);
    };
    Model.prototype.assembleProjections = function () {
        return assembleProjections(this);
    };
    Model.prototype.assembleTitle = function () {
        var title = tslib_1.__assign({}, extractTitleConfig(this.config.title).nonMark, this.title);
        if (title.text) {
            if (!contains(['unit', 'layer'], this.type)) {
                // As described in https://github.com/vega/vega-lite/issues/2875:
                // Due to vega/vega#960 (comment), we only support title's anchor for unit and layered spec for now.
                if (title.anchor && title.anchor !== 'start') {
                    log.warn(log.message.cannotSetTitleAnchor(this.type));
                }
                title.anchor = 'start';
            }
            return keys(title).length > 0 ? title : undefined;
        }
        return undefined;
    };
    /**
     * Assemble the mark group for this model.  We accept optional `signals` so that we can include concat top-level signals with the top-level model's local signals.
     */
    Model.prototype.assembleGroup = function (signals) {
        if (signals === void 0) { signals = []; }
        var group = {};
        signals = signals.concat(this.assembleSelectionSignals());
        if (signals.length > 0) {
            group.signals = signals;
        }
        var layout = this.assembleLayout();
        if (layout) {
            group.layout = layout;
        }
        group.marks = [].concat(this.assembleHeaderMarks(), this.assembleMarks());
        // Only include scales if this spec is top-level or if parent is facet.
        // (Otherwise, it will be merged with upper-level's scope.)
        var scales = (!this.parent || isFacetModel(this.parent)) ? assembleScales(this) : [];
        if (scales.length > 0) {
            group.scales = scales;
        }
        var axes = this.assembleAxes();
        if (axes.length > 0) {
            group.axes = axes;
        }
        var legends = this.assembleLegends();
        if (legends.length > 0) {
            group.legends = legends;
        }
        return group;
    };
    Model.prototype.hasDescendantWithFieldOnChannel = function (channel) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (isUnitModel(child)) {
                if (child.channelHasField(channel)) {
                    return true;
                }
            }
            else {
                if (child.hasDescendantWithFieldOnChannel(channel)) {
                    return true;
                }
            }
        }
        return false;
    };
    Model.prototype.getName = function (text) {
        return varName((this.name ? this.name + '_' : '') + text);
    };
    /**
     * Request a data source name for the given data source type and mark that data source as required. This method should be called in parse, so that all used data source can be correctly instantiated in assembleData().
     */
    Model.prototype.requestDataName = function (name) {
        var fullName = this.getName(name);
        // Increase ref count. This is critical because otherwise we won't create a data source.
        // We also increase the ref counts on OutputNode.getSource() calls.
        var refCounts = this.component.data.outputNodeRefCounts;
        refCounts[fullName] = (refCounts[fullName] || 0) + 1;
        return fullName;
    };
    Model.prototype.getSizeSignalRef = function (sizeType) {
        if (isFacetModel(this.parent)) {
            var channel = sizeType === 'width' ? 'x' : 'y';
            var scaleComponent = this.component.scales[channel];
            if (scaleComponent && !scaleComponent.merged) { // independent scale
                var type = scaleComponent.get('type');
                var range = scaleComponent.get('range');
                if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                    var scaleName = scaleComponent.get('name');
                    var domain = assembleDomain(this, channel);
                    var field = getFieldFromDomain(domain);
                    if (field) {
                        var fieldRef = vgField({ aggregate: 'distinct', field: field }, { expr: 'datum' });
                        return {
                            signal: sizeExpr(scaleName, scaleComponent, fieldRef)
                        };
                    }
                    else {
                        log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                        return null;
                    }
                }
            }
        }
        return {
            signal: this.layoutSizeNameMap.get(this.getName(sizeType))
        };
    };
    /**
     * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
     */
    Model.prototype.lookupDataSource = function (name) {
        var node = this.component.data.outputNodes[name];
        if (!node) {
            // Name not found in map so let's just return what we got.
            // This can happen if we already have the correct name.
            return name;
        }
        return node.getSource();
    };
    Model.prototype.getSizeName = function (oldSizeName) {
        return this.layoutSizeNameMap.get(oldSizeName);
    };
    Model.prototype.renameLayoutSize = function (oldName, newName) {
        this.layoutSizeNameMap.rename(oldName, newName);
    };
    Model.prototype.renameScale = function (oldName, newName) {
        this.scaleNameMap.rename(oldName, newName);
    };
    Model.prototype.renameProjection = function (oldName, newName) {
        this.projectionNameMap.rename(oldName, newName);
    };
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     */
    Model.prototype.scaleName = function (originalScaleName, parse) {
        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a scale can't be renamed
            // before it has the original name.
            return this.getName(originalScaleName);
        }
        // If there is a scale for the channel, it should either
        // be in the scale component or exist in the name map
        if (
        // If there is a scale for the channel, there should be a local scale component for it
        (isChannel(originalScaleName) && isScaleChannel(originalScaleName) && this.component.scales[originalScaleName]) ||
            // in the scale name map (the scale get merged by its parent)
            this.scaleNameMap.has(this.getName(originalScaleName))) {
            return this.scaleNameMap.get(this.getName(originalScaleName));
        }
        return undefined;
    };
    /**
     * @return projection name after the projection has been parsed and named.
     */
    Model.prototype.projectionName = function (parse) {
        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a projection can't be renamed
            // before it has the original name.
            return this.getName('projection');
        }
        if ((this.component.projection && !this.component.projection.merged) || this.projectionNameMap.has(this.getName('projection'))) {
            return this.projectionNameMap.get(this.getName('projection'));
        }
        return undefined;
    };
    /**
     * Traverse a model's hierarchy to get the scale component for a particular channel.
     */
    Model.prototype.getScaleComponent = function (channel) {
        /* istanbul ignore next: This is warning for debugging test */
        if (!this.component.scales) {
            throw new Error('getScaleComponent cannot be called before parseScale().  Make sure you have called parseScale or use parseUnitModelWithScale().');
        }
        var localScaleComponent = this.component.scales[channel];
        if (localScaleComponent && !localScaleComponent.merged) {
            return localScaleComponent;
        }
        return (this.parent ? this.parent.getScaleComponent(channel) : undefined);
    };
    /**
     * Traverse a model's hierarchy to get a particular selection component.
     */
    Model.prototype.getSelectionComponent = function (variableName, origName) {
        var sel = this.component.selection[variableName];
        if (!sel && this.parent) {
            sel = this.parent.getSelectionComponent(variableName, origName);
        }
        if (!sel) {
            throw new Error(log.message.selectionNotFound(origName));
        }
        return sel;
    };
    return Model;
}());
export { Model };
/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
var ModelWithField = /** @class */ (function (_super) {
    tslib_1.__extends(ModelWithField, _super);
    function ModelWithField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** Get "field" reference for vega */
    ModelWithField.prototype.vgField = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (!fieldDef) {
            return undefined;
        }
        return vgField(fieldDef, opt);
    };
    ModelWithField.prototype.reduceFieldDef = function (f, init, t) {
        return reduce(this.getMapping(), function (acc, cd, c) {
            var fieldDef = getFieldDef(cd);
            if (fieldDef) {
                return f(acc, fieldDef, c);
            }
            return acc;
        }, init, t);
    };
    ModelWithField.prototype.forEachFieldDef = function (f, t) {
        forEach(this.getMapping(), function (cd, c) {
            var fieldDef = getFieldDef(cd);
            if (fieldDef) {
                f(fieldDef, c);
            }
        }, t);
    };
    return ModelWithField;
}(Model));
export { ModelWithField };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNuQyxPQUFPLEVBQVUsU0FBUyxFQUFFLGNBQWMsRUFBaUMsTUFBTSxZQUFZLENBQUM7QUFHOUYsT0FBTyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUF1QyxXQUFXLEVBQUUsT0FBTyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3ZGLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBRTlCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMzQyxPQUFPLEVBQVcsV0FBVyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlDLE9BQU8sRUFBQyxrQkFBa0IsRUFBYyxNQUFNLFVBQVUsQ0FBQztBQUN6RCxPQUFPLEVBQUMsa0JBQWtCLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDM0QsT0FBTyxFQUFDLFFBQVEsRUFBUSxJQUFJLEVBQUUsT0FBTyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ3RELE9BQU8sRUFBQyxhQUFhLEVBQStHLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0osT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBTTdDLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBd0IsTUFBTSxpQkFBaUIsQ0FBQztBQUN2RyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx1QkFBdUIsQ0FB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QyxLQUFLLEdBbUNqRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIGlzQ2hhbm5lbCwgaXNTY2FsZUNoYW5uZWwsIFNjYWxlQ2hhbm5lbCwgU2luZ2xlRGVmQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RGF0YSwgRGF0YVNvdXJjZVR5cGV9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHtmb3JFYWNoLCByZWR1Y2V9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgRmllbGREZWYsIEZpZWxkUmVmT3B0aW9uLCBnZXRGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge1Jlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtCYXNlU3BlYywgaXNGYWNldFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtleHRyYWN0VGl0bGVDb25maWcsIFRpdGxlUGFyYW1zfSBmcm9tICcuLi90aXRsZSc7XG5pbXBvcnQge25vcm1hbGl6ZVRyYW5zZm9ybSwgVHJhbnNmb3JtfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtjb250YWlucywgRGljdCwga2V5cywgdmFyTmFtZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2lzVmdSYW5nZVN0ZXAsIFZnQXhpcywgVmdEYXRhLCBWZ0VuY29kZUVudHJ5LCBWZ0xheW91dCwgVmdMZWdlbmQsIFZnTWFya0dyb3VwLCBWZ1Byb2plY3Rpb24sIFZnU2lnbmFsLCBWZ1NpZ25hbFJlZiwgVmdUaXRsZX0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHthc3NlbWJsZUF4ZXN9IGZyb20gJy4vYXhpcy9hc3NlbWJsZSc7XG5pbXBvcnQge0F4aXNDb21wb25lbnRJbmRleH0gZnJvbSAnLi9heGlzL2NvbXBvbmVudCc7XG5pbXBvcnQge0NvbmNhdE1vZGVsfSBmcm9tICcuL2NvbmNhdCc7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vZGF0YSc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtMYXllck1vZGVsfSBmcm9tICcuL2xheWVyJztcbmltcG9ydCB7Z2V0SGVhZGVyR3JvdXBzLCBnZXRUaXRsZUdyb3VwLCBIRUFERVJfQ0hBTk5FTFMsIExheW91dEhlYWRlckNvbXBvbmVudH0gZnJvbSAnLi9sYXlvdXQvaGVhZGVyJztcbmltcG9ydCB7c2l6ZUV4cHJ9IGZyb20gJy4vbGF5b3V0c2l6ZS9hc3NlbWJsZSc7XG5pbXBvcnQge0xheW91dFNpemVDb21wb25lbnQsIExheW91dFNpemVJbmRleH0gZnJvbSAnLi9sYXlvdXRzaXplL2NvbXBvbmVudCc7XG5pbXBvcnQge2Fzc2VtYmxlTGVnZW5kc30gZnJvbSAnLi9sZWdlbmQvYXNzZW1ibGUnO1xuaW1wb3J0IHtMZWdlbmRDb21wb25lbnRJbmRleH0gZnJvbSAnLi9sZWdlbmQvY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VMZWdlbmR9IGZyb20gJy4vbGVnZW5kL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVQcm9qZWN0aW9uc30gZnJvbSAnLi9wcm9qZWN0aW9uL2Fzc2VtYmxlJztcbmltcG9ydCB7UHJvamVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9wcm9qZWN0aW9uL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlUHJvamVjdGlvbn0gZnJvbSAnLi9wcm9qZWN0aW9uL3BhcnNlJztcbmltcG9ydCB7UmVwZWF0TW9kZWx9IGZyb20gJy4vcmVwZWF0JztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZX0gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge2Fzc2VtYmxlU2NhbGVzfSBmcm9tICcuL3NjYWxlL2Fzc2VtYmxlJztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vc2NhbGUvY29tcG9uZW50JztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi9zY2FsZS9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlfSBmcm9tICcuL3NjYWxlL3BhcnNlJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTcGxpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuLyoqXG4gKiBDb21wb3NhYmxlIENvbXBvbmVudHMgdGhhdCBhcmUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIHBhcnNpbmcgcGhhc2Ugb2YgdGhlXG4gKiBjb21waWxhdGlvbnMuICBUaGUgY29tcG9uZW50cyByZXByZXNlbnRzIHBhcnRzIG9mIHRoZSBzcGVjaWZpY2F0aW9uIGluIGEgZm9ybSB0aGF0XG4gKiBjYW4gYmUgZWFzaWx5IG1lcmdlZCAoZHVyaW5nIHBhcnNpbmcgZm9yIGNvbXBvc2l0ZSBzcGVjcykuXG4gKiBJbiBhZGRpdGlvbiwgdGhlc2UgY29tcG9uZW50cyBhcmUgZWFzaWx5IHRyYW5zZm9ybWVkIGludG8gVmVnYSBzcGVjaWZpY2F0aW9uc1xuICogZHVyaW5nIHRoZSBcImFzc2VtYmxlXCIgcGhhc2UsIHdoaWNoIGlzIHRoZSBsYXN0IHBoYXNlIG9mIHRoZSBjb21waWxhdGlvbiBzdGVwLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudCB7XG4gIGRhdGE6IERhdGFDb21wb25lbnQ7XG5cbiAgbGF5b3V0U2l6ZTogTGF5b3V0U2l6ZUNvbXBvbmVudDtcblxuICBsYXlvdXRIZWFkZXJzOiB7XG4gICAgcm93PzogTGF5b3V0SGVhZGVyQ29tcG9uZW50LFxuICAgIGNvbHVtbj86IExheW91dEhlYWRlckNvbXBvbmVudFxuICB9O1xuXG4gIG1hcms6IFZnTWFya0dyb3VwW107XG4gIHNjYWxlczogU2NhbGVDb21wb25lbnRJbmRleDtcbiAgcHJvamVjdGlvbjogUHJvamVjdGlvbkNvbXBvbmVudDtcbiAgc2VsZWN0aW9uOiBEaWN0PFNlbGVjdGlvbkNvbXBvbmVudD47XG5cbiAgLyoqIERpY3Rpb25hcnkgbWFwcGluZyBjaGFubmVsIHRvIFZnQXhpcyBkZWZpbml0aW9uICovXG4gIGF4ZXM6IEF4aXNDb21wb25lbnRJbmRleDtcblxuICAvKiogRGljdGlvbmFyeSBtYXBwaW5nIGNoYW5uZWwgdG8gVmdMZWdlbmQgZGVmaW5pdGlvbiAqL1xuICBsZWdlbmRzOiBMZWdlbmRDb21wb25lbnRJbmRleDtcblxuICByZXNvbHZlOiBSZXNvbHZlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVNYXBJbnRlcmZhY2Uge1xuICByZW5hbWUob2xkbmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICBoYXMobmFtZTogc3RyaW5nKTogYm9vbGVhbjtcbiAgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVNYXAgaW1wbGVtZW50cyBOYW1lTWFwSW50ZXJmYWNlIHtcbiAgcHJpdmF0ZSBuYW1lTWFwOiBEaWN0PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lTWFwID0ge307XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lTWFwW29sZE5hbWVdID0gbmV3TmFtZTtcbiAgfVxuXG5cbiAgcHVibGljIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lTWFwW25hbWVdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gSWYgdGhlIG5hbWUgYXBwZWFycyBpbiB0aGUgX25hbWVNYXAsIHdlIG5lZWQgdG8gcmVhZCBpdHMgbmV3IG5hbWUuXG4gICAgLy8gV2UgaGF2ZSB0byBsb29wIG92ZXIgdGhlIGRpY3QganVzdCBpbiBjYXNlIHRoZSBuZXcgbmFtZSBhbHNvIGdldHMgcmVuYW1lZC5cbiAgICB3aGlsZSAodGhpcy5uYW1lTWFwW25hbWVdICYmIG5hbWUgIT09IHRoaXMubmFtZU1hcFtuYW1lXSkge1xuICAgICAgbmFtZSA9IHRoaXMubmFtZU1hcFtuYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuXG4vKlxuICBXZSB1c2UgdHlwZSBndWFyZHMgaW5zdGVhZCBvZiBgaW5zdGFuY2VvZmAgYXMgYGluc3RhbmNlb2ZgIG1ha2VzXG4gIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIgZGVwZW5kIG9uIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2ZcbiAgdGhlIG1vZGVsIGNsYXNzZXMsIHdoaWNoIGluIHR1cm4gZGVwZW5kIG9uIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIuXG4gIFRodXMsIGBpbnN0YW5jZW9mYCBsZWFkcyB0byBjaXJjdWxhciBkZXBlbmRlbmN5IHByb2JsZW1zLlxuXG4gIE9uIHRoZSBvdGhlciBoYW5kLCB0eXBlIGd1YXJkcyBvbmx5IG1ha2UgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlclxuICBkZXBlbmQgb24gdGhlIHR5cGUgb2YgdGhlIG1vZGVsIGNsYXNzZXMsIGJ1dCBub3QgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VuaXRNb2RlbChtb2RlbDogTW9kZWwpOiBtb2RlbCBpcyBVbml0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3VuaXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYWNldE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIEZhY2V0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2ZhY2V0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgUmVwZWF0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3JlcGVhdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNhdE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIENvbmNhdE1vZGVsIHtcbiAgcmV0dXJuIG1vZGVsICYmIG1vZGVsLnR5cGUgPT09ICdjb25jYXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNMYXllck1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIExheWVyTW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2xheWVyJztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsIHtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgdHlwZTogJ3VuaXQnIHwgJ2ZhY2V0JyB8ICdsYXllcicgfCAnY29uY2F0JyB8ICdyZXBlYXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50OiBNb2RlbDtcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgdGl0bGU6IFRpdGxlUGFyYW1zO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb246IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZGF0YTogRGF0YTtcbiAgcHVibGljIHJlYWRvbmx5IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2NhbGVzLCB3aGljaCBjYW4gYmUgcmVuYW1lZCBieSBhIG1vZGVsJ3MgcGFyZW50LiAqL1xuICBwcm90ZWN0ZWQgc2NhbGVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3IgcHJvamVjdGlvbnMsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBwcm9qZWN0aW9uTmFtZU1hcDogTmFtZU1hcEludGVyZmFjZTtcblxuICAvKiogTmFtZSBtYXAgZm9yIHNpemUsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBsYXlvdXRTaXplTmFtZU1hcDogTmFtZU1hcEludGVyZmFjZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWU7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuXG4gIHB1YmxpYyByZWFkb25seSBjb21wb25lbnQ6IENvbXBvbmVudDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBCYXNlU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgcmVzb2x2ZTogUmVzb2x2ZSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucmVwZWF0ZXIgPSByZXBlYXRlcjtcblxuICAgIC8vIElmIG5hbWUgaXMgbm90IHByb3ZpZGVkLCBhbHdheXMgdXNlIHBhcmVudCdzIGdpdmVuTmFtZSB0byBhdm9pZCBuYW1lIGNvbmZsaWN0cy5cbiAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWUgfHwgcGFyZW50R2l2ZW5OYW1lO1xuICAgIHRoaXMudGl0bGUgPSBpc1N0cmluZyhzcGVjLnRpdGxlKSA/IHt0ZXh0OiBzcGVjLnRpdGxlfSA6IHNwZWMudGl0bGU7XG5cbiAgICAvLyBTaGFyZWQgbmFtZSBtYXBzXG4gICAgdGhpcy5zY2FsZU5hbWVNYXAgPSBwYXJlbnQgPyBwYXJlbnQuc2NhbGVOYW1lTWFwIDogbmV3IE5hbWVNYXAoKTtcbiAgICB0aGlzLnByb2plY3Rpb25OYW1lTWFwID0gcGFyZW50ID8gcGFyZW50LnByb2plY3Rpb25OYW1lTWFwIDogbmV3IE5hbWVNYXAoKTtcbiAgICB0aGlzLmxheW91dFNpemVOYW1lTWFwID0gcGFyZW50ID8gcGFyZW50LmxheW91dFNpemVOYW1lTWFwIDogbmV3IE5hbWVNYXAoKTtcblxuICAgIHRoaXMuZGF0YSA9IHNwZWMuZGF0YTtcblxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBzcGVjLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMudHJhbnNmb3JtcyA9IG5vcm1hbGl6ZVRyYW5zZm9ybShzcGVjLnRyYW5zZm9ybSB8fCBbXSk7XG5cbiAgICB0aGlzLmNvbXBvbmVudCA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc291cmNlczogcGFyZW50ID8gcGFyZW50LmNvbXBvbmVudC5kYXRhLnNvdXJjZXMgOiB7fSxcbiAgICAgICAgb3V0cHV0Tm9kZXM6IHBhcmVudCA/IHBhcmVudC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlcyA6IHt9LFxuICAgICAgICBvdXRwdXROb2RlUmVmQ291bnRzOiBwYXJlbnQgPyBwYXJlbnQuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZVJlZkNvdW50cyA6IHt9LFxuICAgICAgICAvLyBkYXRhIGlzIGZhY2V0ZWQgaWYgdGhlIHNwZWMgaXMgYSBmYWNldCBzcGVjIG9yIHRoZSBwYXJlbnQgaGFzIGZhY2V0ZWQgZGF0YSBhbmQgbm8gZGF0YSBpcyBkZWZpbmVkXG4gICAgICAgIGlzRmFjZXRlZDogaXNGYWNldFNwZWMoc3BlYykgfHwgKHBhcmVudCAmJiBwYXJlbnQuY29tcG9uZW50LmRhdGEuaXNGYWNldGVkICYmICFzcGVjLmRhdGEpXG4gICAgICB9LFxuICAgICAgbGF5b3V0U2l6ZTogbmV3IFNwbGl0PExheW91dFNpemVJbmRleD4oKSxcbiAgICAgIGxheW91dEhlYWRlcnM6e3Jvdzoge30sIGNvbHVtbjoge319LFxuICAgICAgbWFyazogbnVsbCxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgc2NhbGU6IHt9LCBheGlzOiB7fSwgbGVnZW5kOiB7fSxcbiAgICAgICAgLi4uKHJlc29sdmUgfHwge30pXG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uOiBudWxsLFxuICAgICAgc2NhbGVzOiBudWxsLFxuICAgICAgcHJvamVjdGlvbjogbnVsbCxcbiAgICAgIGF4ZXM6IHt9LFxuICAgICAgbGVnZW5kczoge30sXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgd2lkdGgoKTogVmdTaWduYWxSZWYge1xuICAgIHJldHVybiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyk7XG4gIH1cblxuXG4gIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IFZnU2lnbmFsUmVmIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0U2l6ZShzaXplOiBMYXlvdXRTaXplSW5kZXgpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBzaXplO1xuICAgIGlmICh3aWR0aCkge1xuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0U2l6ZS5zZXQoJ3dpZHRoJywgd2lkdGgsIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChoZWlnaHQpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50LmxheW91dFNpemUuc2V0KCdoZWlnaHQnLCBoZWlnaHQsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYXJzZSgpIHtcbiAgICB0aGlzLnBhcnNlU2NhbGUoKTtcblxuICAgIHRoaXMucGFyc2VMYXlvdXRTaXplKCk7IC8vIGRlcGVuZHMgb24gc2NhbGVcbiAgICB0aGlzLnJlbmFtZVRvcExldmVsTGF5b3V0U2l6ZSgpO1xuXG4gICAgdGhpcy5wYXJzZVNlbGVjdGlvbigpO1xuICAgIHRoaXMucGFyc2VQcm9qZWN0aW9uKCk7XG4gICAgdGhpcy5wYXJzZURhdGEoKTsgLy8gKHBhdGhvcmRlcikgZGVwZW5kcyBvbiBtYXJrRGVmOyBzZWxlY3Rpb24gZmlsdGVycyBkZXBlbmQgb24gcGFyc2VkIHNlbGVjdGlvbnM7IGRlcGVuZHMgb24gcHJvamVjdGlvbiBiZWNhdXNlIHNvbWUgdHJhbnNmb3JtcyByZXF1aXJlIHRoZSBmaW5hbGl6ZWQgcHJvamVjdGlvbiBuYW1lLlxuICAgIHRoaXMucGFyc2VBeGlzQW5kSGVhZGVyKCk7IC8vIGRlcGVuZHMgb24gc2NhbGUgYW5kIGxheW91dCBzaXplXG4gICAgdGhpcy5wYXJzZUxlZ2VuZCgpOyAvLyBkZXBlbmRzIG9uIHNjYWxlLCBtYXJrRGVmXG4gICAgdGhpcy5wYXJzZU1hcmtHcm91cCgpOyAvLyBkZXBlbmRzIG9uIGRhdGEgbmFtZSwgc2NhbGUsIGxheW91dCBzaXplLCBheGlzR3JvdXAsIGFuZCBjaGlsZHJlbidzIHNjYWxlLCBheGlzLCBsZWdlbmQgYW5kIG1hcmsuXG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VEYXRhKCk6IHZvaWQ7XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlU2VsZWN0aW9uKCk6IHZvaWQ7XG5cblxuICBwdWJsaWMgcGFyc2VTY2FsZSgpIHtcbiAgICBwYXJzZVNjYWxlKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlUHJvamVjdGlvbigpIHtcbiAgICBwYXJzZVByb2plY3Rpb24odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VMYXlvdXRTaXplKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbmFtZSB0b3AtbGV2ZWwgc3BlYydzIHNpemUgdG8gYmUganVzdCB3aWR0aCAvIGhlaWdodCwgaWdub3JpbmcgbW9kZWwgbmFtZS5cbiAgICogVGhpcyBlc3NlbnRpYWxseSBtZXJnZXMgdGhlIHRvcC1sZXZlbCBzcGVjJ3Mgd2lkdGgvaGVpZ2h0IHNpZ25hbHMgd2l0aCB0aGUgd2lkdGgvaGVpZ2h0IHNpZ25hbHNcbiAgICogdG8gaGVscCB1cyByZWR1Y2UgcmVkdW5kYW50IHNpZ25hbHMgZGVjbGFyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIHJlbmFtZVRvcExldmVsTGF5b3V0U2l6ZSgpIHtcbiAgICBpZiAodGhpcy5nZXROYW1lKCd3aWR0aCcpICE9PSAnd2lkdGgnKSB7XG4gICAgICB0aGlzLnJlbmFtZUxheW91dFNpemUodGhpcy5nZXROYW1lKCd3aWR0aCcpLCAnd2lkdGgnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0TmFtZSgnaGVpZ2h0JykgIT09ICdoZWlnaHQnKSB7XG4gICAgICB0aGlzLnJlbmFtZUxheW91dFNpemUodGhpcy5nZXROYW1lKCdoZWlnaHQnKSwgJ2hlaWdodCcpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZU1hcmtHcm91cCgpOiB2b2lkO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZUF4aXNBbmRIZWFkZXIoKTogdm9pZDtcblxuICBwdWJsaWMgcGFyc2VMZWdlbmQoKSB7XG4gICAgcGFyc2VMZWdlbmQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBhbnlbXTtcbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBhbnlbXTtcblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW107XG5cbiAgcHVibGljIGFzc2VtYmxlR3JvdXBTdHlsZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd1bml0JyB8fCB0aGlzLnR5cGUgPT09ICdsYXllcicpIHtcbiAgICAgIHJldHVybiAnY2VsbCc7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaXplKCk6IFZnRW5jb2RlRW50cnkge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd1bml0JyB8fCB0aGlzLnR5cGUgPT09ICdsYXllcicpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dDtcblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW107XG5cbiAgcHVibGljIGFzc2VtYmxlSGVhZGVyTWFya3MoKTogVmdNYXJrR3JvdXBbXSB7XG4gICAgY29uc3Qge2xheW91dEhlYWRlcnN9ID0gdGhpcy5jb21wb25lbnQ7XG4gICAgbGV0IGhlYWRlck1hcmtzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgSEVBREVSX0NIQU5ORUxTKSB7XG4gICAgICBpZiAobGF5b3V0SGVhZGVyc1tjaGFubmVsXS50aXRsZSkge1xuICAgICAgICBoZWFkZXJNYXJrcy5wdXNoKGdldFRpdGxlR3JvdXAodGhpcywgY2hhbm5lbCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBIRUFERVJfQ0hBTk5FTFMpIHtcbiAgICAgIGhlYWRlck1hcmtzID0gaGVhZGVyTWFya3MuY29uY2F0KGdldEhlYWRlckdyb3Vwcyh0aGlzLCBjaGFubmVsKSk7XG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJNYXJrcztcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZU1hcmtzKCk6IFZnTWFya0dyb3VwW107IC8vIFRPRE86IFZnTWFya0dyb3VwW11cblxuICBwdWJsaWMgYXNzZW1ibGVBeGVzKCk6IFZnQXhpc1tdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVBeGVzKHRoaXMuY29tcG9uZW50LmF4ZXMsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxlZ2VuZHMoKTogVmdMZWdlbmRbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlTGVnZW5kcyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVByb2plY3Rpb25zKCk6IFZnUHJvamVjdGlvbltdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVQcm9qZWN0aW9ucyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRpdGxlKCk6IFZnVGl0bGUge1xuICAgIGNvbnN0IHRpdGxlOiBWZ1RpdGxlID0ge1xuICAgICAgLi4uZXh0cmFjdFRpdGxlQ29uZmlnKHRoaXMuY29uZmlnLnRpdGxlKS5ub25NYXJrLFxuICAgICAgLi4udGhpcy50aXRsZVxuICAgIH07XG5cbiAgICBpZiAodGl0bGUudGV4dCkge1xuICAgICAgaWYgKCFjb250YWlucyhbJ3VuaXQnLCAnbGF5ZXInXSwgdGhpcy50eXBlKSkge1xuICAgICAgICAvLyBBcyBkZXNjcmliZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yODc1OlxuICAgICAgICAvLyBEdWUgdG8gdmVnYS92ZWdhIzk2MCAoY29tbWVudCksIHdlIG9ubHkgc3VwcG9ydCB0aXRsZSdzIGFuY2hvciBmb3IgdW5pdCBhbmQgbGF5ZXJlZCBzcGVjIGZvciBub3cuXG5cbiAgICAgICAgaWYgKHRpdGxlLmFuY2hvciAmJiB0aXRsZS5hbmNob3IgIT09ICdzdGFydCcpIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RTZXRUaXRsZUFuY2hvcih0aGlzLnR5cGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aXRsZS5hbmNob3IgPSAnc3RhcnQnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5cyh0aXRsZSkubGVuZ3RoID4gMCA/IHRpdGxlIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VtYmxlIHRoZSBtYXJrIGdyb3VwIGZvciB0aGlzIG1vZGVsLiAgV2UgYWNjZXB0IG9wdGlvbmFsIGBzaWduYWxzYCBzbyB0aGF0IHdlIGNhbiBpbmNsdWRlIGNvbmNhdCB0b3AtbGV2ZWwgc2lnbmFscyB3aXRoIHRoZSB0b3AtbGV2ZWwgbW9kZWwncyBsb2NhbCBzaWduYWxzLlxuICAgKi9cbiAgcHVibGljIGFzc2VtYmxlR3JvdXAoc2lnbmFsczogVmdTaWduYWxbXSA9IFtdKSB7XG4gICAgY29uc3QgZ3JvdXA6IFZnTWFya0dyb3VwID0ge307XG5cbiAgICBzaWduYWxzID0gc2lnbmFscy5jb25jYXQodGhpcy5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKSk7XG5cbiAgICBpZiAoc2lnbmFscy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5zaWduYWxzID0gc2lnbmFscztcbiAgICB9XG5cbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmFzc2VtYmxlTGF5b3V0KCk7XG4gICAgaWYgKGxheW91dCkge1xuICAgICAgZ3JvdXAubGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cblxuICAgIGdyb3VwLm1hcmtzID0gW10uY29uY2F0KFxuICAgICAgdGhpcy5hc3NlbWJsZUhlYWRlck1hcmtzKCksXG4gICAgICB0aGlzLmFzc2VtYmxlTWFya3MoKVxuICAgICk7XG5cbiAgICAvLyBPbmx5IGluY2x1ZGUgc2NhbGVzIGlmIHRoaXMgc3BlYyBpcyB0b3AtbGV2ZWwgb3IgaWYgcGFyZW50IGlzIGZhY2V0LlxuICAgIC8vIChPdGhlcndpc2UsIGl0IHdpbGwgYmUgbWVyZ2VkIHdpdGggdXBwZXItbGV2ZWwncyBzY29wZS4pXG4gICAgY29uc3Qgc2NhbGVzID0gKCF0aGlzLnBhcmVudCB8fCBpc0ZhY2V0TW9kZWwodGhpcy5wYXJlbnQpKSA/IGFzc2VtYmxlU2NhbGVzKHRoaXMpIDogW107XG4gICAgaWYgKHNjYWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5zY2FsZXMgPSBzY2FsZXM7XG4gICAgfVxuXG4gICAgY29uc3QgYXhlcyA9IHRoaXMuYXNzZW1ibGVBeGVzKCk7XG4gICAgaWYgKGF4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAuYXhlcyA9IGF4ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgbGVnZW5kcyA9IHRoaXMuYXNzZW1ibGVMZWdlbmRzKCk7XG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAubGVnZW5kcyA9IGxlZ2VuZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgcHVibGljIGhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgaWYgKGlzVW5pdE1vZGVsKGNoaWxkKSkge1xuICAgICAgICBpZiAoY2hpbGQuY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjaGlsZC5oYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhck5hbWUoKHRoaXMubmFtZSA/IHRoaXMubmFtZSArICdfJyA6ICcnKSArIHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYSBkYXRhIHNvdXJjZSBuYW1lIGZvciB0aGUgZ2l2ZW4gZGF0YSBzb3VyY2UgdHlwZSBhbmQgbWFyayB0aGF0IGRhdGEgc291cmNlIGFzIHJlcXVpcmVkLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGluIHBhcnNlLCBzbyB0aGF0IGFsbCB1c2VkIGRhdGEgc291cmNlIGNhbiBiZSBjb3JyZWN0bHkgaW5zdGFudGlhdGVkIGluIGFzc2VtYmxlRGF0YSgpLlxuICAgKi9cbiAgcHVibGljIHJlcXVlc3REYXRhTmFtZShuYW1lOiBEYXRhU291cmNlVHlwZSkge1xuICAgIGNvbnN0IGZ1bGxOYW1lID0gdGhpcy5nZXROYW1lKG5hbWUpO1xuXG4gICAgLy8gSW5jcmVhc2UgcmVmIGNvdW50LiBUaGlzIGlzIGNyaXRpY2FsIGJlY2F1c2Ugb3RoZXJ3aXNlIHdlIHdvbid0IGNyZWF0ZSBhIGRhdGEgc291cmNlLlxuICAgIC8vIFdlIGFsc28gaW5jcmVhc2UgdGhlIHJlZiBjb3VudHMgb24gT3V0cHV0Tm9kZS5nZXRTb3VyY2UoKSBjYWxscy5cbiAgICBjb25zdCByZWZDb3VudHMgPSB0aGlzLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHM7XG4gICAgcmVmQ291bnRzW2Z1bGxOYW1lXSA9IChyZWZDb3VudHNbZnVsbE5hbWVdIHx8IDApICsgMTtcblxuICAgIHJldHVybiBmdWxsTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlOiAnd2lkdGgnIHwgJ2hlaWdodCcpOiBWZ1NpZ25hbFJlZiB7XG4gICAgaWYgKGlzRmFjZXRNb2RlbCh0aGlzLnBhcmVudCkpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBzaXplVHlwZSA9PT0gJ3dpZHRoJyA/ICd4JyA6ICd5JztcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoc2NhbGVDb21wb25lbnQgJiYgIXNjYWxlQ29tcG9uZW50Lm1lcmdlZCkgeyAvLyBpbmRlcGVuZGVudCBzY2FsZVxuICAgICAgICBjb25zdCB0eXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gc2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICAgIGNvbnN0IHNjYWxlTmFtZSA9IHNjYWxlQ29tcG9uZW50LmdldCgnbmFtZScpO1xuICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMsIGNoYW5uZWwpO1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZFJlZiA9IHZnRmllbGQoe2FnZ3JlZ2F0ZTogJ2Rpc3RpbmN0JywgZmllbGR9LCB7ZXhwcjogJ2RhdHVtJ30pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc2lnbmFsOiBzaXplRXhwcihzY2FsZU5hbWUsIHNjYWxlQ29tcG9uZW50LCBmaWVsZFJlZilcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShzaXplVHlwZSkpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rdXAgdGhlIG5hbWUgb2YgdGhlIGRhdGFzb3VyY2UgZm9yIGFuIG91dHB1dCBub2RlLiBZb3UgcHJvYmFibHkgd2FudCB0byBjYWxsIHRoaXMgaW4gYXNzZW1ibGUuXG4gICAqL1xuICBwdWJsaWMgbG9va3VwRGF0YVNvdXJjZShuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5jb21wb25lbnQuZGF0YS5vdXRwdXROb2Rlc1tuYW1lXTtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgLy8gTmFtZSBub3QgZm91bmQgaW4gbWFwIHNvIGxldCdzIGp1c3QgcmV0dXJuIHdoYXQgd2UgZ290LlxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGUgY29ycmVjdCBuYW1lLlxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGUuZ2V0U291cmNlKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2l6ZU5hbWUob2xkU2l6ZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgIHJldHVybiB0aGlzLmxheW91dFNpemVOYW1lTWFwLmdldChvbGRTaXplTmFtZSk7XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lTGF5b3V0U2l6ZShvbGROYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZVNjYWxlKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY2FsZU5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZVByb2plY3Rpb24ob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnByb2plY3Rpb25OYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCBhZnRlciB0aGUgc2NhbGUgaGFzIGJlZW4gcGFyc2VkIGFuZCBuYW1lZC5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU5hbWUob3JpZ2luYWxTY2FsZU5hbWU6IENoYW5uZWwgfCBzdHJpbmcsIHBhcnNlPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICAvLyBEdXJpbmcgdGhlIHBhcnNlIHBoYXNlIGFsd2F5cyByZXR1cm4gYSB2YWx1ZVxuICAgICAgLy8gTm8gbmVlZCB0byByZWZlciB0byByZW5hbWUgbWFwIGJlY2F1c2UgYSBzY2FsZSBjYW4ndCBiZSByZW5hbWVkXG4gICAgICAvLyBiZWZvcmUgaXQgaGFzIHRoZSBvcmlnaW5hbCBuYW1lLlxuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIGl0IHNob3VsZCBlaXRoZXJcbiAgICAvLyBiZSBpbiB0aGUgc2NhbGUgY29tcG9uZW50IG9yIGV4aXN0IGluIHRoZSBuYW1lIG1hcFxuICAgIGlmIChcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIHRoZXJlIHNob3VsZCBiZSBhIGxvY2FsIHNjYWxlIGNvbXBvbmVudCBmb3IgaXRcbiAgICAgICAgKGlzQ2hhbm5lbChvcmlnaW5hbFNjYWxlTmFtZSkgJiYgaXNTY2FsZUNoYW5uZWwob3JpZ2luYWxTY2FsZU5hbWUpICYmIHRoaXMuY29tcG9uZW50LnNjYWxlc1tvcmlnaW5hbFNjYWxlTmFtZV0pIHx8XG4gICAgICAgIC8vIGluIHRoZSBzY2FsZSBuYW1lIG1hcCAodGhlIHNjYWxlIGdldCBtZXJnZWQgYnkgaXRzIHBhcmVudClcbiAgICAgICAgdGhpcy5zY2FsZU5hbWVNYXAuaGFzKHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSkpXG4gICAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjYWxlTmFtZU1hcC5nZXQodGhpcy5nZXROYW1lKG9yaWdpbmFsU2NhbGVOYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiBwcm9qZWN0aW9uIG5hbWUgYWZ0ZXIgdGhlIHByb2plY3Rpb24gaGFzIGJlZW4gcGFyc2VkIGFuZCBuYW1lZC5cbiAgICovXG4gIHB1YmxpYyBwcm9qZWN0aW9uTmFtZShwYXJzZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGlmIChwYXJzZSkge1xuICAgICAgLy8gRHVyaW5nIHRoZSBwYXJzZSBwaGFzZSBhbHdheXMgcmV0dXJuIGEgdmFsdWVcbiAgICAgIC8vIE5vIG5lZWQgdG8gcmVmZXIgdG8gcmVuYW1lIG1hcCBiZWNhdXNlIGEgcHJvamVjdGlvbiBjYW4ndCBiZSByZW5hbWVkXG4gICAgICAvLyBiZWZvcmUgaXQgaGFzIHRoZSBvcmlnaW5hbCBuYW1lLlxuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZSgncHJvamVjdGlvbicpO1xuICAgIH1cblxuICAgIGlmICgodGhpcy5jb21wb25lbnQucHJvamVjdGlvbiAmJiAhdGhpcy5jb21wb25lbnQucHJvamVjdGlvbi5tZXJnZWQpIHx8IHRoaXMucHJvamVjdGlvbk5hbWVNYXAuaGFzKHRoaXMuZ2V0TmFtZSgncHJvamVjdGlvbicpKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvamVjdGlvbk5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZSgncHJvamVjdGlvbicpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JyZWN0cyB0aGUgZGF0YSByZWZlcmVuY2VzIGluIG1hcmtzIGFmdGVyIGFzc2VtYmxlLlxuICAgKi9cbiAgcHVibGljIGNvcnJlY3REYXRhTmFtZXMgPSAobWFyazogVmdNYXJrR3JvdXApID0+IHtcbiAgICAvLyBUT0RPOiBtYWtlIHRoaXMgY29ycmVjdFxuXG4gICAgLy8gZm9yIG5vcm1hbCBkYXRhIHJlZmVyZW5jZXNcbiAgICBpZiAobWFyay5mcm9tICYmIG1hcmsuZnJvbS5kYXRhKSB7XG4gICAgICBtYXJrLmZyb20uZGF0YSA9IHRoaXMubG9va3VwRGF0YVNvdXJjZShtYXJrLmZyb20uZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gZm9yIGFjY2VzcyB0byBmYWNldCBkYXRhXG4gICAgaWYgKG1hcmsuZnJvbSAmJiBtYXJrLmZyb20uZmFjZXQgJiYgbWFyay5mcm9tLmZhY2V0LmRhdGEpIHtcbiAgICAgIG1hcmsuZnJvbS5mYWNldC5kYXRhID0gdGhpcy5sb29rdXBEYXRhU291cmNlKG1hcmsuZnJvbS5mYWNldC5kYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZSBhIG1vZGVsJ3MgaGllcmFyY2h5IHRvIGdldCB0aGUgc2NhbGUgY29tcG9uZW50IGZvciBhIHBhcnRpY3VsYXIgY2hhbm5lbC5cbiAgICovXG4gIHB1YmxpYyBnZXRTY2FsZUNvbXBvbmVudChjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBTY2FsZUNvbXBvbmVudCB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IFRoaXMgaXMgd2FybmluZyBmb3IgZGVidWdnaW5nIHRlc3QgKi9cbiAgICBpZiAoIXRoaXMuY29tcG9uZW50LnNjYWxlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRTY2FsZUNvbXBvbmVudCBjYW5ub3QgYmUgY2FsbGVkIGJlZm9yZSBwYXJzZVNjYWxlKCkuICBNYWtlIHN1cmUgeW91IGhhdmUgY2FsbGVkIHBhcnNlU2NhbGUgb3IgdXNlIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKCkuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICBpZiAobG9jYWxTY2FsZUNvbXBvbmVudCAmJiAhbG9jYWxTY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgIHJldHVybiBsb2NhbFNjYWxlQ29tcG9uZW50O1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkgOiB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlIGEgbW9kZWwncyBoaWVyYXJjaHkgdG8gZ2V0IGEgcGFydGljdWxhciBzZWxlY3Rpb24gY29tcG9uZW50LlxuICAgKi9cbiAgcHVibGljIGdldFNlbGVjdGlvbkNvbXBvbmVudCh2YXJpYWJsZU5hbWU6IHN0cmluZywgb3JpZ05hbWU6IHN0cmluZyk6IFNlbGVjdGlvbkNvbXBvbmVudCB7XG4gICAgbGV0IHNlbCA9IHRoaXMuY29tcG9uZW50LnNlbGVjdGlvblt2YXJpYWJsZU5hbWVdO1xuICAgIGlmICghc2VsICYmIHRoaXMucGFyZW50KSB7XG4gICAgICBzZWwgPSB0aGlzLnBhcmVudC5nZXRTZWxlY3Rpb25Db21wb25lbnQodmFyaWFibGVOYW1lLCBvcmlnTmFtZSk7XG4gICAgfVxuICAgIGlmICghc2VsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2Uuc2VsZWN0aW9uTm90Rm91bmQob3JpZ05hbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbDtcbiAgfVxufVxuXG4vKiogQWJzdHJhY3QgY2xhc3MgZm9yIFVuaXRNb2RlbCBhbmQgRmFjZXRNb2RlbC4gIEJvdGggb2Ygd2hpY2ggY2FuIGNvbnRhaW4gZmllbGREZWZzIGFzIGEgcGFydCBvZiBpdHMgb3duIHNwZWNpZmljYXRpb24uICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9kZWxXaXRoRmllbGQgZXh0ZW5kcyBNb2RlbCB7XG4gIHB1YmxpYyBhYnN0cmFjdCBmaWVsZERlZihjaGFubmVsOiBTaW5nbGVEZWZDaGFubmVsKTogRmllbGREZWY8c3RyaW5nPjtcblxuICAvKiogR2V0IFwiZmllbGRcIiByZWZlcmVuY2UgZm9yIHZlZ2EgKi9cbiAgcHVibGljIHZnRmllbGQoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KSB7XG4gICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gICAgaWYgKCFmaWVsZERlZikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmdGaWVsZChmaWVsZERlZiwgb3B0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRNYXBwaW5nKCk6IHtba2V5IGluIENoYW5uZWxdPzogYW55fTtcblxuICBwdWJsaWMgcmVkdWNlRmllbGREZWY8VCwgVT4oZjogKGFjYzogVSwgZmQ6IEZpZWxkRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IFUsIGluaXQ6IFQsIHQ/OiBhbnkpIHtcbiAgICByZXR1cm4gcmVkdWNlKHRoaXMuZ2V0TWFwcGluZygpLCAoYWNjOlUgLCBjZDogQ2hhbm5lbERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGNkKTtcbiAgICAgIGlmIChmaWVsZERlZikge1xuICAgICAgICByZXR1cm4gZihhY2MsIGZpZWxkRGVmLCBjKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgaW5pdCwgdCk7XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaEZpZWxkRGVmKGY6IChmZDogRmllbGREZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4gdm9pZCwgdD86IGFueSkge1xuICAgIGZvckVhY2godGhpcy5nZXRNYXBwaW5nKCksIChjZDogQ2hhbm5lbERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGNkKTtcbiAgICAgIGlmIChmaWVsZERlZikge1xuICAgICAgICBmKGZpZWxkRGVmLCBjKTtcbiAgICAgIH1cbiAgICB9LCB0KTtcbiAgfVxuICBwdWJsaWMgYWJzdHJhY3QgY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWw6IENoYW5uZWwpOiBib29sZWFuO1xufVxuIl19