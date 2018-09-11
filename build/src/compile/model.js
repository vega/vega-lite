import * as tslib_1 from "tslib";
import { isNumber, isString } from 'vega-util';
import { isChannel, isScaleChannel } from '../channel';
import { forEach, reduce } from '../encoding';
import { getFieldDef, vgField } from '../fielddef';
import * as log from '../log';
import { hasDiscreteDomain } from '../scale';
import { isFacetSpec, isLayerSpec, isUnitSpec } from '../spec';
import { extractTitleConfig } from '../title';
import { extractCompositionLayout } from '../toplevelprops';
import { normalizeTransform } from '../transform';
import { contains, keys, varName } from '../util';
import { isVgRangeStep } from '../vega.schema';
import { assembleAxes } from './axis/assemble';
import { getHeaderGroups, getTitleGroup, HEADER_CHANNELS } from './header/index';
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
        this.layout =
            isUnitSpec(spec) || isLayerSpec(spec) ? undefined : extractCompositionLayout(spec);
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
            legends: {}
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
    Model.prototype.assembleLayout = function () {
        if (!this.layout) {
            return undefined;
        }
        var _a = this.layout, align = _a.align, bounds = _a.bounds, center = _a.center, _b = _a.spacing, spacing = _b === void 0 ? {} : _b;
        return tslib_1.__assign({ padding: isNumber(spacing)
                ? spacing
                : {
                    row: spacing.row || 10,
                    column: spacing.column || 10
                } }, this.assembleDefaultLayout(), (align ? { align: align } : {}), (bounds ? { bounds: bounds } : {}), (center ? { center: center } : {}));
    };
    Model.prototype.assembleDefaultLayout = function () {
        return {};
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
        var _a = this.title || {}, encoding = _a.encoding, titleNoEncoding = tslib_1.__rest(_a, ["encoding"]);
        var title = tslib_1.__assign({}, extractTitleConfig(this.config.title).nonMark, titleNoEncoding, (encoding ? { encode: { update: encoding } } : {}));
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
        var scales = !this.parent || isFacetModel(this.parent) ? assembleScales(this) : [];
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
            if (scaleComponent && !scaleComponent.merged) {
                // independent scale
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
        if ((this.component.projection && !this.component.projection.merged) ||
            this.projectionNameMap.has(this.getName('projection'))) {
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
        return this.parent ? this.parent.getScaleComponent(channel) : undefined;
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
    /** Get "field" reference for Vega */
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
//# sourceMappingURL=model.js.map