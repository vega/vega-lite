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
import { isVgRangeStep, } from '../vega.schema';
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
                ancestorParse: parent ? tslib_1.__assign({}, parent.component.data.ancestorParse) : {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVuQyxPQUFPLEVBQVUsU0FBUyxFQUFFLGNBQWMsRUFBaUMsTUFBTSxZQUFZLENBQUM7QUFHOUYsT0FBTyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUF1QyxXQUFXLEVBQUUsT0FBTyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3ZGLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBRTlCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMzQyxPQUFPLEVBQVcsV0FBVyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlDLE9BQU8sRUFBQyxrQkFBa0IsRUFBYyxNQUFNLFVBQVUsQ0FBQztBQUN6RCxPQUFPLEVBQUMsa0JBQWtCLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDM0QsT0FBTyxFQUFDLFFBQVEsRUFBUSxJQUFJLEVBQUUsT0FBTyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ3RELE9BQU8sRUFDTCxhQUFhLEdBVWQsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFNN0MsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUF3QixNQUFNLGlCQUFpQixDQUFDO0FBQ3ZHLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHVCQUF1QixDQUFD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Q0FBQyxDQUFDLENBQUM7YUFDaEI7UUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUgscUJBQUM7QUFBRCxDQUFDLEFBbkNELENBQTZDLEtBQUssR0FtQ2pEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHtDaGFubmVsLCBpc0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsLCBTY2FsZUNoYW5uZWwsIFNpbmdsZURlZkNoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGEsIERhdGFTb3VyY2VUeXBlfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Zm9yRWFjaCwgcmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0NoYW5uZWxEZWYsIEZpZWxkRGVmLCBGaWVsZFJlZk9wdGlvbiwgZ2V0RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7QmFzZVNwZWMsIGlzRmFjZXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7ZXh0cmFjdFRpdGxlQ29uZmlnLCBUaXRsZVBhcmFtc30gZnJvbSAnLi4vdGl0bGUnO1xuaW1wb3J0IHtub3JtYWxpemVUcmFuc2Zvcm0sIFRyYW5zZm9ybX0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7Y29udGFpbnMsIERpY3QsIGtleXMsIHZhck5hbWV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtcbiAgaXNWZ1JhbmdlU3RlcCxcbiAgVmdBeGlzLFxuICBWZ0RhdGEsXG4gIFZnRW5jb2RlRW50cnksXG4gIFZnTGF5b3V0LFxuICBWZ0xlZ2VuZCxcbiAgVmdNYXJrR3JvdXAsXG4gIFZnU2lnbmFsLFxuICBWZ1NpZ25hbFJlZixcbiAgVmdUaXRsZSxcbn0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtWZ1Byb2plY3Rpb259IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YXNzZW1ibGVBeGVzfSBmcm9tICcuL2F4aXMvYXNzZW1ibGUnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb25jYXRNb2RlbH0gZnJvbSAnLi9jb25jYXQnO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHtGYWNldE1vZGVsfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi9sYXllcic7XG5pbXBvcnQge2dldEhlYWRlckdyb3VwcywgZ2V0VGl0bGVHcm91cCwgSEVBREVSX0NIQU5ORUxTLCBMYXlvdXRIZWFkZXJDb21wb25lbnR9IGZyb20gJy4vbGF5b3V0L2hlYWRlcic7XG5pbXBvcnQge3NpemVFeHByfSBmcm9tICcuL2xheW91dHNpemUvYXNzZW1ibGUnO1xuaW1wb3J0IHtMYXlvdXRTaXplQ29tcG9uZW50LCBMYXlvdXRTaXplSW5kZXh9IGZyb20gJy4vbGF5b3V0c2l6ZS9jb21wb25lbnQnO1xuaW1wb3J0IHthc3NlbWJsZUxlZ2VuZHN9IGZyb20gJy4vbGVnZW5kL2Fzc2VtYmxlJztcbmltcG9ydCB7TGVnZW5kQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vbGVnZW5kL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlTGVnZW5kfSBmcm9tICcuL2xlZ2VuZC9wYXJzZSc7XG5pbXBvcnQge2Fzc2VtYmxlUHJvamVjdGlvbnN9IGZyb20gJy4vcHJvamVjdGlvbi9hc3NlbWJsZSc7XG5pbXBvcnQge1Byb2plY3Rpb25Db21wb25lbnR9IGZyb20gJy4vcHJvamVjdGlvbi9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVByb2plY3Rpb259IGZyb20gJy4vcHJvamVjdGlvbi9wYXJzZSc7XG5pbXBvcnQge1JlcGVhdE1vZGVsfSBmcm9tICcuL3JlcGVhdCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWV9IGZyb20gJy4vcmVwZWF0ZXInO1xuaW1wb3J0IHthc3NlbWJsZVNjYWxlc30gZnJvbSAnLi9zY2FsZS9hc3NlbWJsZSc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4fSBmcm9tICcuL3NjYWxlL2NvbXBvbmVudCc7XG5pbXBvcnQge2Fzc2VtYmxlRG9tYWluLCBnZXRGaWVsZEZyb21Eb21haW59IGZyb20gJy4vc2NhbGUvZG9tYWluJztcbmltcG9ydCB7cGFyc2VTY2FsZX0gZnJvbSAnLi9zY2FsZS9wYXJzZSc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7U3BsaXR9IGZyb20gJy4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vdW5pdCc7XG5cblxuLyoqXG4gKiBDb21wb3NhYmxlIENvbXBvbmVudHMgdGhhdCBhcmUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIHBhcnNpbmcgcGhhc2Ugb2YgdGhlXG4gKiBjb21waWxhdGlvbnMuICBUaGUgY29tcG9uZW50cyByZXByZXNlbnRzIHBhcnRzIG9mIHRoZSBzcGVjaWZpY2F0aW9uIGluIGEgZm9ybSB0aGF0XG4gKiBjYW4gYmUgZWFzaWx5IG1lcmdlZCAoZHVyaW5nIHBhcnNpbmcgZm9yIGNvbXBvc2l0ZSBzcGVjcykuXG4gKiBJbiBhZGRpdGlvbiwgdGhlc2UgY29tcG9uZW50cyBhcmUgZWFzaWx5IHRyYW5zZm9ybWVkIGludG8gVmVnYSBzcGVjaWZpY2F0aW9uc1xuICogZHVyaW5nIHRoZSBcImFzc2VtYmxlXCIgcGhhc2UsIHdoaWNoIGlzIHRoZSBsYXN0IHBoYXNlIG9mIHRoZSBjb21waWxhdGlvbiBzdGVwLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudCB7XG4gIGRhdGE6IERhdGFDb21wb25lbnQ7XG5cbiAgbGF5b3V0U2l6ZTogTGF5b3V0U2l6ZUNvbXBvbmVudDtcblxuICBsYXlvdXRIZWFkZXJzOiB7XG4gICAgcm93PzogTGF5b3V0SGVhZGVyQ29tcG9uZW50LFxuICAgIGNvbHVtbj86IExheW91dEhlYWRlckNvbXBvbmVudFxuICB9O1xuXG4gIG1hcms6IFZnTWFya0dyb3VwW107XG4gIHNjYWxlczogU2NhbGVDb21wb25lbnRJbmRleDtcbiAgcHJvamVjdGlvbjogUHJvamVjdGlvbkNvbXBvbmVudDtcbiAgc2VsZWN0aW9uOiBEaWN0PFNlbGVjdGlvbkNvbXBvbmVudD47XG5cbiAgLyoqIERpY3Rpb25hcnkgbWFwcGluZyBjaGFubmVsIHRvIFZnQXhpcyBkZWZpbml0aW9uICovXG4gIGF4ZXM6IEF4aXNDb21wb25lbnRJbmRleDtcblxuICAvKiogRGljdGlvbmFyeSBtYXBwaW5nIGNoYW5uZWwgdG8gVmdMZWdlbmQgZGVmaW5pdGlvbiAqL1xuICBsZWdlbmRzOiBMZWdlbmRDb21wb25lbnRJbmRleDtcblxuICByZXNvbHZlOiBSZXNvbHZlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVNYXBJbnRlcmZhY2Uge1xuICByZW5hbWUob2xkbmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICBoYXMobmFtZTogc3RyaW5nKTogYm9vbGVhbjtcbiAgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVNYXAgaW1wbGVtZW50cyBOYW1lTWFwSW50ZXJmYWNlIHtcbiAgcHJpdmF0ZSBuYW1lTWFwOiBEaWN0PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lTWFwID0ge307XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lTWFwW29sZE5hbWVdID0gbmV3TmFtZTtcbiAgfVxuXG5cbiAgcHVibGljIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lTWFwW25hbWVdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gSWYgdGhlIG5hbWUgYXBwZWFycyBpbiB0aGUgX25hbWVNYXAsIHdlIG5lZWQgdG8gcmVhZCBpdHMgbmV3IG5hbWUuXG4gICAgLy8gV2UgaGF2ZSB0byBsb29wIG92ZXIgdGhlIGRpY3QganVzdCBpbiBjYXNlIHRoZSBuZXcgbmFtZSBhbHNvIGdldHMgcmVuYW1lZC5cbiAgICB3aGlsZSAodGhpcy5uYW1lTWFwW25hbWVdICYmIG5hbWUgIT09IHRoaXMubmFtZU1hcFtuYW1lXSkge1xuICAgICAgbmFtZSA9IHRoaXMubmFtZU1hcFtuYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuXG4vKlxuICBXZSB1c2UgdHlwZSBndWFyZHMgaW5zdGVhZCBvZiBgaW5zdGFuY2VvZmAgYXMgYGluc3RhbmNlb2ZgIG1ha2VzXG4gIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIgZGVwZW5kIG9uIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2ZcbiAgdGhlIG1vZGVsIGNsYXNzZXMsIHdoaWNoIGluIHR1cm4gZGVwZW5kIG9uIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIuXG4gIFRodXMsIGBpbnN0YW5jZW9mYCBsZWFkcyB0byBjaXJjdWxhciBkZXBlbmRlbmN5IHByb2JsZW1zLlxuXG4gIE9uIHRoZSBvdGhlciBoYW5kLCB0eXBlIGd1YXJkcyBvbmx5IG1ha2UgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlclxuICBkZXBlbmQgb24gdGhlIHR5cGUgb2YgdGhlIG1vZGVsIGNsYXNzZXMsIGJ1dCBub3QgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VuaXRNb2RlbChtb2RlbDogTW9kZWwpOiBtb2RlbCBpcyBVbml0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3VuaXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYWNldE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIEZhY2V0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2ZhY2V0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgUmVwZWF0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3JlcGVhdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNhdE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIENvbmNhdE1vZGVsIHtcbiAgcmV0dXJuIG1vZGVsICYmIG1vZGVsLnR5cGUgPT09ICdjb25jYXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNMYXllck1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIExheWVyTW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2xheWVyJztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsIHtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgdHlwZTogJ3VuaXQnIHwgJ2ZhY2V0JyB8ICdsYXllcicgfCAnY29uY2F0JyB8ICdyZXBlYXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50OiBNb2RlbDtcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgdGl0bGU6IFRpdGxlUGFyYW1zO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb246IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZGF0YTogRGF0YTtcbiAgcHVibGljIHJlYWRvbmx5IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2NhbGVzLCB3aGljaCBjYW4gYmUgcmVuYW1lZCBieSBhIG1vZGVsJ3MgcGFyZW50LiAqL1xuICBwcm90ZWN0ZWQgc2NhbGVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3IgcHJvamVjdGlvbnMsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBwcm9qZWN0aW9uTmFtZU1hcDogTmFtZU1hcEludGVyZmFjZTtcblxuICAvKiogTmFtZSBtYXAgZm9yIHNpemUsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBsYXlvdXRTaXplTmFtZU1hcDogTmFtZU1hcEludGVyZmFjZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWU7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuXG4gIHB1YmxpYyByZWFkb25seSBjb21wb25lbnQ6IENvbXBvbmVudDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBCYXNlU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgcmVzb2x2ZTogUmVzb2x2ZSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucmVwZWF0ZXIgPSByZXBlYXRlcjtcblxuICAgIC8vIElmIG5hbWUgaXMgbm90IHByb3ZpZGVkLCBhbHdheXMgdXNlIHBhcmVudCdzIGdpdmVuTmFtZSB0byBhdm9pZCBuYW1lIGNvbmZsaWN0cy5cbiAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWUgfHwgcGFyZW50R2l2ZW5OYW1lO1xuICAgIHRoaXMudGl0bGUgPSBpc1N0cmluZyhzcGVjLnRpdGxlKSA/IHt0ZXh0OiBzcGVjLnRpdGxlfSA6IHNwZWMudGl0bGU7XG5cbiAgICAvLyBTaGFyZWQgbmFtZSBtYXBzXG4gICAgdGhpcy5zY2FsZU5hbWVNYXAgPSBwYXJlbnQgPyBwYXJlbnQuc2NhbGVOYW1lTWFwIDogbmV3IE5hbWVNYXAoKTtcbiAgICB0aGlzLnByb2plY3Rpb25OYW1lTWFwID0gcGFyZW50ID8gcGFyZW50LnByb2plY3Rpb25OYW1lTWFwIDogbmV3IE5hbWVNYXAoKTtcbiAgICB0aGlzLmxheW91dFNpemVOYW1lTWFwID0gcGFyZW50ID8gcGFyZW50LmxheW91dFNpemVOYW1lTWFwIDogbmV3IE5hbWVNYXAoKTtcblxuICAgIHRoaXMuZGF0YSA9IHNwZWMuZGF0YTtcblxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBzcGVjLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMudHJhbnNmb3JtcyA9IG5vcm1hbGl6ZVRyYW5zZm9ybShzcGVjLnRyYW5zZm9ybSB8fCBbXSk7XG5cbiAgICB0aGlzLmNvbXBvbmVudCA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc291cmNlczogcGFyZW50ID8gcGFyZW50LmNvbXBvbmVudC5kYXRhLnNvdXJjZXMgOiB7fSxcbiAgICAgICAgb3V0cHV0Tm9kZXM6IHBhcmVudCA/IHBhcmVudC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlcyA6IHt9LFxuICAgICAgICBvdXRwdXROb2RlUmVmQ291bnRzOiBwYXJlbnQgPyBwYXJlbnQuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZVJlZkNvdW50cyA6IHt9LFxuICAgICAgICBhbmNlc3RvclBhcnNlOiBwYXJlbnQgPyB7Li4ucGFyZW50LmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2V9IDoge30sXG4gICAgICAgIC8vIGRhdGEgaXMgZmFjZXRlZCBpZiB0aGUgc3BlYyBpcyBhIGZhY2V0IHNwZWMgb3IgdGhlIHBhcmVudCBoYXMgZmFjZXRlZCBkYXRhIGFuZCBubyBkYXRhIGlzIGRlZmluZWRcbiAgICAgICAgaXNGYWNldGVkOiBpc0ZhY2V0U3BlYyhzcGVjKSB8fCAocGFyZW50ICYmIHBhcmVudC5jb21wb25lbnQuZGF0YS5pc0ZhY2V0ZWQgJiYgIXNwZWMuZGF0YSlcbiAgICAgIH0sXG4gICAgICBsYXlvdXRTaXplOiBuZXcgU3BsaXQ8TGF5b3V0U2l6ZUluZGV4PigpLFxuICAgICAgbGF5b3V0SGVhZGVyczp7cm93OiB7fSwgY29sdW1uOiB7fX0sXG4gICAgICBtYXJrOiBudWxsLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBzY2FsZToge30sIGF4aXM6IHt9LCBsZWdlbmQ6IHt9LFxuICAgICAgICAuLi4ocmVzb2x2ZSB8fCB7fSlcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb246IG51bGwsXG4gICAgICBzY2FsZXM6IG51bGwsXG4gICAgICBwcm9qZWN0aW9uOiBudWxsLFxuICAgICAgYXhlczoge30sXG4gICAgICBsZWdlbmRzOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldCB3aWR0aCgpOiBWZ1NpZ25hbFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKTtcbiAgfVxuXG5cbiAgcHVibGljIGdldCBoZWlnaHQoKTogVmdTaWduYWxSZWYge1xuICAgIHJldHVybiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRTaXplKHNpemU6IExheW91dFNpemVJbmRleCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHNpemU7XG4gICAgaWYgKHdpZHRoKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5sYXlvdXRTaXplLnNldCgnd2lkdGgnLCB3aWR0aCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGhlaWdodCkge1xuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0U2l6ZS5zZXQoJ2hlaWdodCcsIGhlaWdodCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlKCkge1xuICAgIHRoaXMucGFyc2VTY2FsZSgpO1xuXG4gICAgdGhpcy5wYXJzZUxheW91dFNpemUoKTsgLy8gZGVwZW5kcyBvbiBzY2FsZVxuICAgIHRoaXMucmVuYW1lVG9wTGV2ZWxMYXlvdXRTaXplKCk7XG5cbiAgICB0aGlzLnBhcnNlU2VsZWN0aW9uKCk7XG4gICAgdGhpcy5wYXJzZVByb2plY3Rpb24oKTtcbiAgICB0aGlzLnBhcnNlRGF0YSgpOyAvLyAocGF0aG9yZGVyKSBkZXBlbmRzIG9uIG1hcmtEZWY7IHNlbGVjdGlvbiBmaWx0ZXJzIGRlcGVuZCBvbiBwYXJzZWQgc2VsZWN0aW9uczsgZGVwZW5kcyBvbiBwcm9qZWN0aW9uIGJlY2F1c2Ugc29tZSB0cmFuc2Zvcm1zIHJlcXVpcmUgdGhlIGZpbmFsaXplZCBwcm9qZWN0aW9uIG5hbWUuXG4gICAgdGhpcy5wYXJzZUF4aXNBbmRIZWFkZXIoKTsgLy8gZGVwZW5kcyBvbiBzY2FsZSBhbmQgbGF5b3V0IHNpemVcbiAgICB0aGlzLnBhcnNlTGVnZW5kKCk7IC8vIGRlcGVuZHMgb24gc2NhbGUsIG1hcmtEZWZcbiAgICB0aGlzLnBhcnNlTWFya0dyb3VwKCk7IC8vIGRlcGVuZHMgb24gZGF0YSBuYW1lLCBzY2FsZSwgbGF5b3V0IHNpemUsIGF4aXNHcm91cCwgYW5kIGNoaWxkcmVuJ3Mgc2NhbGUsIGF4aXMsIGxlZ2VuZCBhbmQgbWFyay5cbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZURhdGEoKTogdm9pZDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VTZWxlY3Rpb24oKTogdm9pZDtcblxuXG4gIHB1YmxpYyBwYXJzZVNjYWxlKCkge1xuICAgIHBhcnNlU2NhbGUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VQcm9qZWN0aW9uKCkge1xuICAgIHBhcnNlUHJvamVjdGlvbih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZUxheW91dFNpemUoKTogdm9pZDtcblxuICAvKipcbiAgICogUmVuYW1lIHRvcC1sZXZlbCBzcGVjJ3Mgc2l6ZSB0byBiZSBqdXN0IHdpZHRoIC8gaGVpZ2h0LCBpZ25vcmluZyBtb2RlbCBuYW1lLlxuICAgKiBUaGlzIGVzc2VudGlhbGx5IG1lcmdlcyB0aGUgdG9wLWxldmVsIHNwZWMncyB3aWR0aC9oZWlnaHQgc2lnbmFscyB3aXRoIHRoZSB3aWR0aC9oZWlnaHQgc2lnbmFsc1xuICAgKiB0byBoZWxwIHVzIHJlZHVjZSByZWR1bmRhbnQgc2lnbmFscyBkZWNsYXJhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgcmVuYW1lVG9wTGV2ZWxMYXlvdXRTaXplKCkge1xuICAgIGlmICh0aGlzLmdldE5hbWUoJ3dpZHRoJykgIT09ICd3aWR0aCcpIHtcbiAgICAgIHRoaXMucmVuYW1lTGF5b3V0U2l6ZSh0aGlzLmdldE5hbWUoJ3dpZHRoJyksICd3aWR0aCcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXROYW1lKCdoZWlnaHQnKSAhPT0gJ2hlaWdodCcpIHtcbiAgICAgIHRoaXMucmVuYW1lTGF5b3V0U2l6ZSh0aGlzLmdldE5hbWUoJ2hlaWdodCcpLCAnaGVpZ2h0Jyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlTWFya0dyb3VwKCk6IHZvaWQ7XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlQXhpc0FuZEhlYWRlcigpOiB2b2lkO1xuXG4gIHB1YmxpYyBwYXJzZUxlZ2VuZCgpIHtcbiAgICBwYXJzZUxlZ2VuZCh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzOiBhbnlbXSk6IGFueVtdO1xuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCk6IGFueVtdO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGF0YTogVmdEYXRhW10pOiBWZ0RhdGFbXTtcblxuICBwdWJsaWMgYXNzZW1ibGVHcm91cFN0eWxlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3VuaXQnIHx8IHRoaXMudHlwZSA9PT0gJ2xheWVyJykge1xuICAgICAgcmV0dXJuICdjZWxsJztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpemUoKTogVmdFbmNvZGVFbnRyeSB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3VuaXQnIHx8IHRoaXMudHlwZSA9PT0gJ2xheWVyJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0O1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXTtcblxuICBwdWJsaWMgYXNzZW1ibGVIZWFkZXJNYXJrcygpOiBWZ01hcmtHcm91cFtdIHtcbiAgICBjb25zdCB7bGF5b3V0SGVhZGVyc30gPSB0aGlzLmNvbXBvbmVudDtcbiAgICBsZXQgaGVhZGVyTWFya3MgPSBbXTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBIRUFERVJfQ0hBTk5FTFMpIHtcbiAgICAgIGlmIChsYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlKSB7XG4gICAgICAgIGhlYWRlck1hcmtzLnB1c2goZ2V0VGl0bGVHcm91cCh0aGlzLCBjaGFubmVsKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIEhFQURFUl9DSEFOTkVMUykge1xuICAgICAgaGVhZGVyTWFya3MgPSBoZWFkZXJNYXJrcy5jb25jYXQoZ2V0SGVhZGVyR3JvdXBzKHRoaXMsIGNoYW5uZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlck1hcmtzO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlTWFya3MoKTogVmdNYXJrR3JvdXBbXTsgLy8gVE9ETzogVmdNYXJrR3JvdXBbXVxuXG4gIHB1YmxpYyBhc3NlbWJsZUF4ZXMoKTogVmdBeGlzW10ge1xuICAgIHJldHVybiBhc3NlbWJsZUF4ZXModGhpcy5jb21wb25lbnQuYXhlcywgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGVnZW5kcygpOiBWZ0xlZ2VuZFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVMZWdlbmRzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlUHJvamVjdGlvbnMoKTogVmdQcm9qZWN0aW9uW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVByb2plY3Rpb25zKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlVGl0bGUoKTogVmdUaXRsZSB7XG4gICAgY29uc3QgdGl0bGU6IFZnVGl0bGUgPSB7XG4gICAgICAuLi5leHRyYWN0VGl0bGVDb25maWcodGhpcy5jb25maWcudGl0bGUpLm5vbk1hcmssXG4gICAgICAuLi50aGlzLnRpdGxlXG4gICAgfTtcblxuICAgIGlmICh0aXRsZS50ZXh0KSB7XG4gICAgICBpZiAoIWNvbnRhaW5zKFsndW5pdCcsICdsYXllciddLCB0aGlzLnR5cGUpKSB7XG4gICAgICAgIC8vIEFzIGRlc2NyaWJlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI4NzU6XG4gICAgICAgIC8vIER1ZSB0byB2ZWdhL3ZlZ2EjOTYwIChjb21tZW50KSwgd2Ugb25seSBzdXBwb3J0IHRpdGxlJ3MgYW5jaG9yIGZvciB1bml0IGFuZCBsYXllcmVkIHNwZWMgZm9yIG5vdy5cblxuICAgICAgICBpZiAodGl0bGUuYW5jaG9yICYmIHRpdGxlLmFuY2hvciAhPT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdFNldFRpdGxlQW5jaG9yKHRoaXMudHlwZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRpdGxlLmFuY2hvciA9ICdzdGFydCc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXlzKHRpdGxlKS5sZW5ndGggPiAwID8gdGl0bGUgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQXNzZW1ibGUgdGhlIG1hcmsgZ3JvdXAgZm9yIHRoaXMgbW9kZWwuICBXZSBhY2NlcHQgb3B0aW9uYWwgYHNpZ25hbHNgIHNvIHRoYXQgd2UgY2FuIGluY2x1ZGUgY29uY2F0IHRvcC1sZXZlbCBzaWduYWxzIHdpdGggdGhlIHRvcC1sZXZlbCBtb2RlbCdzIGxvY2FsIHNpZ25hbHMuXG4gICAqL1xuICBwdWJsaWMgYXNzZW1ibGVHcm91cChzaWduYWxzOiBWZ1NpZ25hbFtdID0gW10pIHtcbiAgICBjb25zdCBncm91cDogVmdNYXJrR3JvdXAgPSB7fTtcblxuICAgIHNpZ25hbHMgPSBzaWduYWxzLmNvbmNhdCh0aGlzLmFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpKTtcblxuICAgIGlmIChzaWduYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLnNpZ25hbHMgPSBzaWduYWxzO1xuICAgIH1cblxuICAgIGNvbnN0IGxheW91dCA9IHRoaXMuYXNzZW1ibGVMYXlvdXQoKTtcbiAgICBpZiAobGF5b3V0KSB7XG4gICAgICBncm91cC5sYXlvdXQgPSBsYXlvdXQ7XG4gICAgfVxuXG4gICAgZ3JvdXAubWFya3MgPSBbXS5jb25jYXQoXG4gICAgICB0aGlzLmFzc2VtYmxlSGVhZGVyTWFya3MoKSxcbiAgICAgIHRoaXMuYXNzZW1ibGVNYXJrcygpXG4gICAgKTtcblxuICAgIC8vIE9ubHkgaW5jbHVkZSBzY2FsZXMgaWYgdGhpcyBzcGVjIGlzIHRvcC1sZXZlbCBvciBpZiBwYXJlbnQgaXMgZmFjZXQuXG4gICAgLy8gKE90aGVyd2lzZSwgaXQgd2lsbCBiZSBtZXJnZWQgd2l0aCB1cHBlci1sZXZlbCdzIHNjb3BlLilcbiAgICBjb25zdCBzY2FsZXMgPSAoIXRoaXMucGFyZW50IHx8IGlzRmFjZXRNb2RlbCh0aGlzLnBhcmVudCkpID8gYXNzZW1ibGVTY2FsZXModGhpcykgOiBbXTtcbiAgICBpZiAoc2NhbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLnNjYWxlcyA9IHNjYWxlcztcbiAgICB9XG5cbiAgICBjb25zdCBheGVzID0gdGhpcy5hc3NlbWJsZUF4ZXMoKTtcbiAgICBpZiAoYXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5heGVzID0gYXhlcztcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRzID0gdGhpcy5hc3NlbWJsZUxlZ2VuZHMoKTtcbiAgICBpZiAobGVnZW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5sZWdlbmRzID0gbGVnZW5kcztcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JvdXA7XG4gIH1cblxuICBwdWJsaWMgaGFzRGVzY2VuZGFudFdpdGhGaWVsZE9uQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoaXNVbml0TW9kZWwoY2hpbGQpKSB7XG4gICAgICAgIGlmIChjaGlsZC5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNoaWxkLmhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoY2hhbm5lbCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdmFyTmFtZSgodGhpcy5uYW1lID8gdGhpcy5uYW1lICsgJ18nIDogJycpICsgdGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBhIGRhdGEgc291cmNlIG5hbWUgZm9yIHRoZSBnaXZlbiBkYXRhIHNvdXJjZSB0eXBlIGFuZCBtYXJrIHRoYXQgZGF0YSBzb3VyY2UgYXMgcmVxdWlyZWQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgaW4gcGFyc2UsIHNvIHRoYXQgYWxsIHVzZWQgZGF0YSBzb3VyY2UgY2FuIGJlIGNvcnJlY3RseSBpbnN0YW50aWF0ZWQgaW4gYXNzZW1ibGVEYXRhKCkuXG4gICAqL1xuICBwdWJsaWMgcmVxdWVzdERhdGFOYW1lKG5hbWU6IERhdGFTb3VyY2VUeXBlKSB7XG4gICAgY29uc3QgZnVsbE5hbWUgPSB0aGlzLmdldE5hbWUobmFtZSk7XG5cbiAgICAvLyBJbmNyZWFzZSByZWYgY291bnQuIFRoaXMgaXMgY3JpdGljYWwgYmVjYXVzZSBvdGhlcndpc2Ugd2Ugd29uJ3QgY3JlYXRlIGEgZGF0YSBzb3VyY2UuXG4gICAgLy8gV2UgYWxzbyBpbmNyZWFzZSB0aGUgcmVmIGNvdW50cyBvbiBPdXRwdXROb2RlLmdldFNvdXJjZSgpIGNhbGxzLlxuICAgIGNvbnN0IHJlZkNvdW50cyA9IHRoaXMuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZVJlZkNvdW50cztcbiAgICByZWZDb3VudHNbZnVsbE5hbWVdID0gKHJlZkNvdW50c1tmdWxsTmFtZV0gfHwgMCkgKyAxO1xuXG4gICAgcmV0dXJuIGZ1bGxOYW1lO1xuICB9XG5cbiAgcHVibGljIGdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGU6ICd3aWR0aCcgfCAnaGVpZ2h0Jyk6IFZnU2lnbmFsUmVmIHtcbiAgICBpZiAoaXNGYWNldE1vZGVsKHRoaXMucGFyZW50KSkge1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHNpemVUeXBlID09PSAnd2lkdGgnID8gJ3gnIDogJ3knO1xuICAgICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG5cbiAgICAgIGlmIChzY2FsZUNvbXBvbmVudCAmJiAhc2NhbGVDb21wb25lbnQubWVyZ2VkKSB7IC8vIGluZGVwZW5kZW50IHNjYWxlXG4gICAgICAgIGNvbnN0IHR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgICAgY29uc3Qgc2NhbGVOYW1lID0gc2NhbGVDb21wb25lbnQuZ2V0KCduYW1lJyk7XG4gICAgICAgICAgY29uc3QgZG9tYWluID0gYXNzZW1ibGVEb21haW4odGhpcywgY2hhbm5lbCk7XG4gICAgICAgICAgY29uc3QgZmllbGQgPSBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluKTtcbiAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkUmVmID0gdmdGaWVsZCh7YWdncmVnYXRlOiAnZGlzdGluY3QnLCBmaWVsZH0sIHtleHByOiAnZGF0dW0nfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBzaWduYWw6IHNpemVFeHByKHNjYWxlTmFtZSwgc2NhbGVDb21wb25lbnQsIGZpZWxkUmVmKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nLndhcm4oJ1Vua25vd24gZmllbGQgZm9yICR7Y2hhbm5lbH0uICBDYW5ub3QgY2FsY3VsYXRlIHZpZXcgc2l6ZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogdGhpcy5sYXlvdXRTaXplTmFtZU1hcC5nZXQodGhpcy5nZXROYW1lKHNpemVUeXBlKSlcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIExvb2t1cCB0aGUgbmFtZSBvZiB0aGUgZGF0YXNvdXJjZSBmb3IgYW4gb3V0cHV0IG5vZGUuIFlvdSBwcm9iYWJseSB3YW50IHRvIGNhbGwgdGhpcyBpbiBhc3NlbWJsZS5cbiAgICovXG4gIHB1YmxpYyBsb29rdXBEYXRhU291cmNlKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVzW25hbWVdO1xuXG4gICAgaWYgKCFub2RlKSB7XG4gICAgICAvLyBOYW1lIG5vdCBmb3VuZCBpbiBtYXAgc28gbGV0J3MganVzdCByZXR1cm4gd2hhdCB3ZSBnb3QuXG4gICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgd2UgYWxyZWFkeSBoYXZlIHRoZSBjb3JyZWN0IG5hbWUuXG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZS5nZXRTb3VyY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTaXplTmFtZShvbGRTaXplTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgcmV0dXJuIHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAuZ2V0KG9sZFNpemVOYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWVMYXlvdXRTaXplKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5sYXlvdXRTaXplTmFtZU1hcC5yZW5hbWUob2xkTmFtZSwgbmV3TmFtZSk7XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lU2NhbGUob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNjYWxlTmFtZU1hcC5yZW5hbWUob2xkTmFtZSwgbmV3TmFtZSk7XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lUHJvamVjdGlvbihvbGROYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMucHJvamVjdGlvbk5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gc2NhbGUgbmFtZSBmb3IgYSBnaXZlbiBjaGFubmVsIGFmdGVyIHRoZSBzY2FsZSBoYXMgYmVlbiBwYXJzZWQgYW5kIG5hbWVkLlxuICAgKi9cbiAgcHVibGljIHNjYWxlTmFtZShvcmlnaW5hbFNjYWxlTmFtZTogQ2hhbm5lbCB8IHN0cmluZywgcGFyc2U/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBpZiAocGFyc2UpIHtcbiAgICAgIC8vIER1cmluZyB0aGUgcGFyc2UgcGhhc2UgYWx3YXlzIHJldHVybiBhIHZhbHVlXG4gICAgICAvLyBObyBuZWVkIHRvIHJlZmVyIHRvIHJlbmFtZSBtYXAgYmVjYXVzZSBhIHNjYWxlIGNhbid0IGJlIHJlbmFtZWRcbiAgICAgIC8vIGJlZm9yZSBpdCBoYXMgdGhlIG9yaWdpbmFsIG5hbWUuXG4gICAgICByZXR1cm4gdGhpcy5nZXROYW1lKG9yaWdpbmFsU2NhbGVOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIHNjYWxlIGZvciB0aGUgY2hhbm5lbCwgaXQgc2hvdWxkIGVpdGhlclxuICAgIC8vIGJlIGluIHRoZSBzY2FsZSBjb21wb25lbnQgb3IgZXhpc3QgaW4gdGhlIG5hbWUgbWFwXG4gICAgaWYgKFxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHNjYWxlIGZvciB0aGUgY2hhbm5lbCwgdGhlcmUgc2hvdWxkIGJlIGEgbG9jYWwgc2NhbGUgY29tcG9uZW50IGZvciBpdFxuICAgICAgICAoaXNDaGFubmVsKG9yaWdpbmFsU2NhbGVOYW1lKSAmJiBpc1NjYWxlQ2hhbm5lbChvcmlnaW5hbFNjYWxlTmFtZSkgJiYgdGhpcy5jb21wb25lbnQuc2NhbGVzW29yaWdpbmFsU2NhbGVOYW1lXSkgfHxcbiAgICAgICAgLy8gaW4gdGhlIHNjYWxlIG5hbWUgbWFwICh0aGUgc2NhbGUgZ2V0IG1lcmdlZCBieSBpdHMgcGFyZW50KVxuICAgICAgICB0aGlzLnNjYWxlTmFtZU1hcC5oYXModGhpcy5nZXROYW1lKG9yaWdpbmFsU2NhbGVOYW1lKSlcbiAgICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NhbGVOYW1lTWFwLmdldCh0aGlzLmdldE5hbWUob3JpZ2luYWxTY2FsZU5hbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHByb2plY3Rpb24gbmFtZSBhZnRlciB0aGUgcHJvamVjdGlvbiBoYXMgYmVlbiBwYXJzZWQgYW5kIG5hbWVkLlxuICAgKi9cbiAgcHVibGljIHByb2plY3Rpb25OYW1lKHBhcnNlPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICAvLyBEdXJpbmcgdGhlIHBhcnNlIHBoYXNlIGFsd2F5cyByZXR1cm4gYSB2YWx1ZVxuICAgICAgLy8gTm8gbmVlZCB0byByZWZlciB0byByZW5hbWUgbWFwIGJlY2F1c2UgYSBwcm9qZWN0aW9uIGNhbid0IGJlIHJlbmFtZWRcbiAgICAgIC8vIGJlZm9yZSBpdCBoYXMgdGhlIG9yaWdpbmFsIG5hbWUuXG4gICAgICByZXR1cm4gdGhpcy5nZXROYW1lKCdwcm9qZWN0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYgKCh0aGlzLmNvbXBvbmVudC5wcm9qZWN0aW9uICYmICF0aGlzLmNvbXBvbmVudC5wcm9qZWN0aW9uLm1lcmdlZCkgfHwgdGhpcy5wcm9qZWN0aW9uTmFtZU1hcC5oYXModGhpcy5nZXROYW1lKCdwcm9qZWN0aW9uJykpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9qZWN0aW9uTmFtZU1hcC5nZXQodGhpcy5nZXROYW1lKCdwcm9qZWN0aW9uJykpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSBkYXRhIHJlZmVyZW5jZXMgaW4gbWFya3MgYWZ0ZXIgYXNzZW1ibGUuXG4gICAqL1xuICBwdWJsaWMgY29ycmVjdERhdGFOYW1lcyA9IChtYXJrOiBWZ01hcmtHcm91cCkgPT4ge1xuICAgIC8vIFRPRE86IG1ha2UgdGhpcyBjb3JyZWN0XG5cbiAgICAvLyBmb3Igbm9ybWFsIGRhdGEgcmVmZXJlbmNlc1xuICAgIGlmIChtYXJrLmZyb20gJiYgbWFyay5mcm9tLmRhdGEpIHtcbiAgICAgIG1hcmsuZnJvbS5kYXRhID0gdGhpcy5sb29rdXBEYXRhU291cmNlKG1hcmsuZnJvbS5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyBmb3IgYWNjZXNzIHRvIGZhY2V0IGRhdGFcbiAgICBpZiAobWFyay5mcm9tICYmIG1hcmsuZnJvbS5mYWNldCAmJiBtYXJrLmZyb20uZmFjZXQuZGF0YSkge1xuICAgICAgbWFyay5mcm9tLmZhY2V0LmRhdGEgPSB0aGlzLmxvb2t1cERhdGFTb3VyY2UobWFyay5mcm9tLmZhY2V0LmRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlIGEgbW9kZWwncyBoaWVyYXJjaHkgdG8gZ2V0IHRoZSBzY2FsZSBjb21wb25lbnQgZm9yIGEgcGFydGljdWxhciBjaGFubmVsLlxuICAgKi9cbiAgcHVibGljIGdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IFNjYWxlQ29tcG9uZW50IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogVGhpcyBpcyB3YXJuaW5nIGZvciBkZWJ1Z2dpbmcgdGVzdCAqL1xuICAgIGlmICghdGhpcy5jb21wb25lbnQuc2NhbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNjYWxlQ29tcG9uZW50IGNhbm5vdCBiZSBjYWxsZWQgYmVmb3JlIHBhcnNlU2NhbGUoKS4gIE1ha2Ugc3VyZSB5b3UgaGF2ZSBjYWxsZWQgcGFyc2VTY2FsZSBvciB1c2UgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoKS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgIGlmIChsb2NhbFNjYWxlQ29tcG9uZW50ICYmICFsb2NhbFNjYWxlQ29tcG9uZW50Lm1lcmdlZCkge1xuICAgICAgcmV0dXJuIGxvY2FsU2NhbGVDb21wb25lbnQ7XG4gICAgfVxuICAgIHJldHVybiAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSA6IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2UgYSBtb2RlbCdzIGhpZXJhcmNoeSB0byBnZXQgYSBwYXJ0aWN1bGFyIHNlbGVjdGlvbiBjb21wb25lbnQuXG4gICAqL1xuICBwdWJsaWMgZ2V0U2VsZWN0aW9uQ29tcG9uZW50KHZhcmlhYmxlTmFtZTogc3RyaW5nLCBvcmlnTmFtZTogc3RyaW5nKTogU2VsZWN0aW9uQ29tcG9uZW50IHtcbiAgICBsZXQgc2VsID0gdGhpcy5jb21wb25lbnQuc2VsZWN0aW9uW3ZhcmlhYmxlTmFtZV07XG4gICAgaWYgKCFzZWwgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgIHNlbCA9IHRoaXMucGFyZW50LmdldFNlbGVjdGlvbkNvbXBvbmVudCh2YXJpYWJsZU5hbWUsIG9yaWdOYW1lKTtcbiAgICB9XG4gICAgaWYgKCFzZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5zZWxlY3Rpb25Ob3RGb3VuZChvcmlnTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsO1xuICB9XG59XG5cbi8qKiBBYnN0cmFjdCBjbGFzcyBmb3IgVW5pdE1vZGVsIGFuZCBGYWNldE1vZGVsLiAgQm90aCBvZiB3aGljaCBjYW4gY29udGFpbiBmaWVsZERlZnMgYXMgYSBwYXJ0IG9mIGl0cyBvd24gc3BlY2lmaWNhdGlvbi4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNb2RlbFdpdGhGaWVsZCBleHRlbmRzIE1vZGVsIHtcbiAgcHVibGljIGFic3RyYWN0IGZpZWxkRGVmKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwpOiBGaWVsZERlZjxzdHJpbmc+O1xuXG4gIC8qKiBHZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYSAqL1xuICBwdWJsaWMgdmdGaWVsZChjaGFubmVsOiBTaW5nbGVEZWZDaGFubmVsLCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pIHtcbiAgICBjb25zdCBmaWVsZERlZiA9IHRoaXMuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgICBpZiAoIWZpZWxkRGVmKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB2Z0ZpZWxkKGZpZWxkRGVmLCBvcHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGdldE1hcHBpbmcoKToge1trZXkgaW4gQ2hhbm5lbF0/OiBhbnl9O1xuXG4gIHB1YmxpYyByZWR1Y2VGaWVsZERlZjxULCBVPihmOiAoYWNjOiBVLCBmZDogRmllbGREZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4gVSwgaW5pdDogVCwgdD86IGFueSkge1xuICAgIHJldHVybiByZWR1Y2UodGhpcy5nZXRNYXBwaW5nKCksIChhY2M6VSAsIGNkOiBDaGFubmVsRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWYoY2QpO1xuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIHJldHVybiBmKGFjYywgZmllbGREZWYsIGMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBpbml0LCB0KTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JFYWNoRmllbGREZWYoZjogKGZkOiBGaWVsZERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiB2b2lkLCB0PzogYW55KSB7XG4gICAgZm9yRWFjaCh0aGlzLmdldE1hcHBpbmcoKSwgKGNkOiBDaGFubmVsRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWYoY2QpO1xuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIGYoZmllbGREZWYsIGMpO1xuICAgICAgfVxuICAgIH0sIHQpO1xuICB9XG4gIHB1YmxpYyBhYnN0cmFjdCBjaGFubmVsSGFzRmllbGQoY2hhbm5lbDogQ2hhbm5lbCk6IGJvb2xlYW47XG59XG4iXX0=