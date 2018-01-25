"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var scale_1 = require("../scale");
var spec_1 = require("../spec");
var title_1 = require("../title");
var transform_1 = require("../transform");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var assemble_1 = require("./axis/assemble");
var header_1 = require("./layout/header");
var assemble_2 = require("./layoutsize/assemble");
var assemble_3 = require("./legend/assemble");
var parse_1 = require("./legend/parse");
var assemble_4 = require("./projection/assemble");
var parse_2 = require("./projection/parse");
var assemble_5 = require("./scale/assemble");
var domain_1 = require("./scale/domain");
var parse_3 = require("./scale/parse");
var split_1 = require("./split");
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
exports.NameMap = NameMap;
/*
  We use type guards instead of `instanceof` as `instanceof` makes
  different parts of the compiler depend on the actual implementation of
  the model classes, which in turn depend on different parts of the compiler.
  Thus, `instanceof` leads to circular dependency problems.

  On the other hand, type guards only make different parts of the compiler
  depend on the type of the model classes, but not the actual implementation.
*/
function isUnitModel(model) {
    return model && model.type === 'unit';
}
exports.isUnitModel = isUnitModel;
function isFacetModel(model) {
    return model && model.type === 'facet';
}
exports.isFacetModel = isFacetModel;
function isRepeatModel(model) {
    return model && model.type === 'repeat';
}
exports.isRepeatModel = isRepeatModel;
function isConcatModel(model) {
    return model && model.type === 'concat';
}
exports.isConcatModel = isConcatModel;
function isLayerModel(model) {
    return model && model.type === 'layer';
}
exports.isLayerModel = isLayerModel;
var Model = /** @class */ (function () {
    function Model(spec, parent, parentGivenName, config, resolve) {
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
        // If name is not provided, always use parent's givenName to avoid name conflicts.
        this.name = spec.name || parentGivenName;
        this.title = vega_util_1.isString(spec.title) ? { text: spec.title } : spec.title;
        // Shared name maps
        this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
        this.projectionNameMap = parent ? parent.projectionNameMap : new NameMap();
        this.layoutSizeNameMap = parent ? parent.layoutSizeNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = transform_1.normalizeTransform(spec.transform || []);
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : {},
                outputNodes: parent ? parent.component.data.outputNodes : {},
                outputNodeRefCounts: parent ? parent.component.data.outputNodeRefCounts : {},
                ancestorParse: parent ? __assign({}, parent.component.data.ancestorParse) : {},
                // data is faceted if the spec is a facet spec or the parent has faceted data and no data is defined
                isFaceted: spec_1.isFacetSpec(spec) || (parent && parent.component.data.isFaceted && !spec.data)
            },
            layoutSize: new split_1.Split(),
            layoutHeaders: { row: {}, column: {} },
            mark: null,
            resolve: __assign({ scale: {}, axis: {}, legend: {} }, (resolve || {})),
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
        parse_3.parseScale(this);
    };
    Model.prototype.parseProjection = function () {
        parse_2.parseProjection(this);
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
        parse_1.parseLegend(this);
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
        for (var _i = 0, HEADER_CHANNELS_1 = header_1.HEADER_CHANNELS; _i < HEADER_CHANNELS_1.length; _i++) {
            var channel = HEADER_CHANNELS_1[_i];
            if (layoutHeaders[channel].title) {
                headerMarks.push(header_1.getTitleGroup(this, channel));
            }
        }
        for (var _a = 0, HEADER_CHANNELS_2 = header_1.HEADER_CHANNELS; _a < HEADER_CHANNELS_2.length; _a++) {
            var channel = HEADER_CHANNELS_2[_a];
            headerMarks = headerMarks.concat(header_1.getHeaderGroups(this, channel));
        }
        return headerMarks;
    };
    Model.prototype.assembleAxes = function () {
        return assemble_1.assembleAxes(this.component.axes);
    };
    Model.prototype.assembleLegends = function () {
        return assemble_3.assembleLegends(this);
    };
    Model.prototype.assembleProjections = function () {
        return assemble_4.assembleProjections(this);
    };
    Model.prototype.assembleTitle = function () {
        var title = __assign({}, title_1.extractTitleConfig(this.config.title).nonMark, this.title);
        if (title.text) {
            if (!util_1.contains(['unit', 'layer'], this.type)) {
                // As described in https://github.com/vega/vega-lite/issues/2875:
                // Due to vega/vega#960 (comment), we only support title's anchor for unit and layered spec for now.
                if (title.anchor && title.anchor !== 'start') {
                    log.warn(log.message.cannotSetTitleAnchor(this.type));
                }
                title.anchor = 'start';
            }
            return util_1.keys(title).length > 0 ? title : undefined;
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
        var scales = (!this.parent || isFacetModel(this.parent)) ? assemble_5.assembleScales(this) : [];
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
        return util_1.varName((this.name ? this.name + '_' : '') + text);
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
                var type = scaleComponent.get('type');
                var range = scaleComponent.get('range');
                if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                    var scaleName = scaleComponent.get('name');
                    var domain = domain_1.assembleDomain(this, channel);
                    var field = domain_1.getFieldFromDomain(domain);
                    if (field) {
                        var fieldRef = fielddef_1.vgField({ aggregate: 'distinct', field: field }, { expr: 'datum' });
                        return {
                            signal: assemble_2.sizeExpr(scaleName, scaleComponent, fieldRef)
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
        (channel_1.isChannel(originalScaleName) && channel_1.isScaleChannel(originalScaleName) && this.component.scales[originalScaleName]) ||
            // in the scale name map (the the scale get merged by its parent)
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
exports.Model = Model;
/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
var ModelWithField = /** @class */ (function (_super) {
    __extends(ModelWithField, _super);
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
        return fielddef_1.vgField(fieldDef, opt);
    };
    ModelWithField.prototype.reduceFieldDef = function (f, init, t) {
        return encoding_1.reduce(this.getMapping(), function (acc, cd, c) {
            var fieldDef = fielddef_1.getFieldDef(cd);
            if (fieldDef) {
                return f(acc, fieldDef, c);
            }
            return acc;
        }, init, t);
    };
    ModelWithField.prototype.forEachFieldDef = function (f, t) {
        encoding_1.forEach(this.getMapping(), function (cd, c) {
            var fieldDef = fielddef_1.getFieldDef(cd);
            if (fieldDef) {
                f(fieldDef, c);
            }
        }, t);
    };
    return ModelWithField;
}(Model));
exports.ModelWithField = ModelWithField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUVuQyxzQ0FBOEY7QUFHOUYsd0NBQTRDO0FBQzVDLHdDQUF1RjtBQUN2Riw0QkFBOEI7QUFFOUIsa0NBQTJDO0FBQzNDLGdDQUE4QztBQUM5QyxrQ0FBeUQ7QUFDekQsMENBQTJEO0FBQzNELGdDQUFzRDtBQUN0RCw4Q0FXd0I7QUFFeEIsNENBQTZDO0FBTTdDLDBDQUF1RztBQUN2RyxrREFBK0M7QUFFL0MsOENBQWtEO0FBRWxELHdDQUEyQztBQUMzQyxrREFBMEQ7QUFFMUQsNENBQW1EO0FBRW5ELDZDQUFnRDtBQUVoRCx5Q0FBa0U7QUFDbEUsdUNBQXlDO0FBRXpDLGlDQUE4QjtBQXlDOUI7SUFHRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3QkFBTSxHQUFiLFVBQWMsT0FBZSxFQUFFLE9BQWU7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbEMsQ0FBQztJQUdNLHFCQUFHLEdBQVYsVUFBVyxJQUFZO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUMxQyxDQUFDO0lBRU0scUJBQUcsR0FBVixVQUFXLElBQVk7UUFDckIscUVBQXFFO1FBQ3JFLDZFQUE2RTtRQUM3RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN6RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQsTUFBTSxDQUFDLElB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TSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxVQUFDLEdBQUssRUFBRyxFQUFzQixFQUFFLENBQVU7WUFDMUUsSUFBTSxRQUFRLEdBQUcsc0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDO0lBRU0sd0NBQWUsR0FBdEIsVUFBdUIsQ0FBNkMsRUFBRSxDQUFPO1FBQzNFLGtCQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFVBQUMsRUFBc0IsRUFBRSxDQUFVO1lBQzVELElBQU0sUUFBUSxHQUFHLHNCQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLENBQUM7UUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUgscUJBQUM7QUFBRCxDQUFDLEFBbkNELENBQTZDLEtBQUssR0FtQ2pEO0FBbkNxQix3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbmltcG9ydCB7Q2hhbm5lbCwgaXNDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbCwgU2NhbGVDaGFubmVsLCBTaW5nbGVEZWZDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtEYXRhLCBEYXRhU291cmNlVHlwZX0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQge2ZvckVhY2gsIHJlZHVjZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBGaWVsZERlZiwgRmllbGRSZWZPcHRpb24sIGdldEZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7UmVzb2x2ZX0gZnJvbSAnLi4vcmVzb2x2ZSc7XG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge0Jhc2VTcGVjLCBpc0ZhY2V0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2V4dHJhY3RUaXRsZUNvbmZpZywgVGl0bGVQYXJhbXN9IGZyb20gJy4uL3RpdGxlJztcbmltcG9ydCB7bm9ybWFsaXplVHJhbnNmb3JtLCBUcmFuc2Zvcm19IGZyb20gJy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2NvbnRhaW5zLCBEaWN0LCBrZXlzLCB2YXJOYW1lfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7XG4gIGlzVmdSYW5nZVN0ZXAsXG4gIFZnQXhpcyxcbiAgVmdEYXRhLFxuICBWZ0VuY29kZUVudHJ5LFxuICBWZ0xheW91dCxcbiAgVmdMZWdlbmQsXG4gIFZnTWFya0dyb3VwLFxuICBWZ1NpZ25hbCxcbiAgVmdTaWduYWxSZWYsXG4gIFZnVGl0bGUsXG59IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VmdQcm9qZWN0aW9ufSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2Fzc2VtYmxlQXhlc30gZnJvbSAnLi9heGlzL2Fzc2VtYmxlJztcbmltcG9ydCB7QXhpc0NvbXBvbmVudEluZGV4fSBmcm9tICcuL2F4aXMvY29tcG9uZW50JztcbmltcG9ydCB7Q29uY2F0TW9kZWx9IGZyb20gJy4vY29uY2F0JztcbmltcG9ydCB7RGF0YUNvbXBvbmVudH0gZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7RmFjZXRNb2RlbH0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0xheWVyTW9kZWx9IGZyb20gJy4vbGF5ZXInO1xuaW1wb3J0IHtnZXRIZWFkZXJHcm91cHMsIGdldFRpdGxlR3JvdXAsIEhFQURFUl9DSEFOTkVMUywgTGF5b3V0SGVhZGVyQ29tcG9uZW50fSBmcm9tICcuL2xheW91dC9oZWFkZXInO1xuaW1wb3J0IHtzaXplRXhwcn0gZnJvbSAnLi9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCB7TGF5b3V0U2l6ZUNvbXBvbmVudCwgTGF5b3V0U2l6ZUluZGV4fSBmcm9tICcuL2xheW91dHNpemUvY29tcG9uZW50JztcbmltcG9ydCB7YXNzZW1ibGVMZWdlbmRzfSBmcm9tICcuL2xlZ2VuZC9hc3NlbWJsZSc7XG5pbXBvcnQge0xlZ2VuZENvbXBvbmVudEluZGV4fSBmcm9tICcuL2xlZ2VuZC9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZUxlZ2VuZH0gZnJvbSAnLi9sZWdlbmQvcGFyc2UnO1xuaW1wb3J0IHthc3NlbWJsZVByb2plY3Rpb25zfSBmcm9tICcuL3Byb2plY3Rpb24vYXNzZW1ibGUnO1xuaW1wb3J0IHtQcm9qZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL3Byb2plY3Rpb24vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VQcm9qZWN0aW9ufSBmcm9tICcuL3Byb2plY3Rpb24vcGFyc2UnO1xuaW1wb3J0IHtSZXBlYXRNb2RlbH0gZnJvbSAnLi9yZXBlYXQnO1xuaW1wb3J0IHthc3NlbWJsZVNjYWxlc30gZnJvbSAnLi9zY2FsZS9hc3NlbWJsZSc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4fSBmcm9tICcuL3NjYWxlL2NvbXBvbmVudCc7XG5pbXBvcnQge2Fzc2VtYmxlRG9tYWluLCBnZXRGaWVsZEZyb21Eb21haW59IGZyb20gJy4vc2NhbGUvZG9tYWluJztcbmltcG9ydCB7cGFyc2VTY2FsZX0gZnJvbSAnLi9zY2FsZS9wYXJzZSc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7U3BsaXR9IGZyb20gJy4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vdW5pdCc7XG5cblxuLyoqXG4gKiBDb21wb3NhYmxlIENvbXBvbmVudHMgdGhhdCBhcmUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIHBhcnNpbmcgcGhhc2Ugb2YgdGhlXG4gKiBjb21waWxhdGlvbnMuICBUaGUgY29tcG9uZW50cyByZXByZXNlbnRzIHBhcnRzIG9mIHRoZSBzcGVjaWZpY2F0aW9uIGluIGEgZm9ybSB0aGF0XG4gKiBjYW4gYmUgZWFzaWx5IG1lcmdlZCAoZHVyaW5nIHBhcnNpbmcgZm9yIGNvbXBvc2l0ZSBzcGVjcykuXG4gKiBJbiBhZGRpdGlvbiwgdGhlc2UgY29tcG9uZW50cyBhcmUgZWFzaWx5IHRyYW5zZm9ybWVkIGludG8gVmVnYSBzcGVjaWZpY2F0aW9uc1xuICogZHVyaW5nIHRoZSBcImFzc2VtYmxlXCIgcGhhc2UsIHdoaWNoIGlzIHRoZSBsYXN0IHBoYXNlIG9mIHRoZSBjb21waWxhdGlvbiBzdGVwLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudCB7XG4gIGRhdGE6IERhdGFDb21wb25lbnQ7XG5cbiAgbGF5b3V0U2l6ZTogTGF5b3V0U2l6ZUNvbXBvbmVudDtcblxuICBsYXlvdXRIZWFkZXJzOiB7XG4gICAgcm93PzogTGF5b3V0SGVhZGVyQ29tcG9uZW50LFxuICAgIGNvbHVtbj86IExheW91dEhlYWRlckNvbXBvbmVudFxuICB9O1xuXG4gIG1hcms6IFZnTWFya0dyb3VwW107XG4gIHNjYWxlczogU2NhbGVDb21wb25lbnRJbmRleDtcbiAgcHJvamVjdGlvbjogUHJvamVjdGlvbkNvbXBvbmVudDtcbiAgc2VsZWN0aW9uOiBEaWN0PFNlbGVjdGlvbkNvbXBvbmVudD47XG5cbiAgLyoqIERpY3Rpb25hcnkgbWFwcGluZyBjaGFubmVsIHRvIFZnQXhpcyBkZWZpbml0aW9uICovXG4gIGF4ZXM6IEF4aXNDb21wb25lbnRJbmRleDtcblxuICAvKiogRGljdGlvbmFyeSBtYXBwaW5nIGNoYW5uZWwgdG8gVmdMZWdlbmQgZGVmaW5pdGlvbiAqL1xuICBsZWdlbmRzOiBMZWdlbmRDb21wb25lbnRJbmRleDtcblxuICByZXNvbHZlOiBSZXNvbHZlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVNYXBJbnRlcmZhY2Uge1xuICByZW5hbWUob2xkbmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICBoYXMobmFtZTogc3RyaW5nKTogYm9vbGVhbjtcbiAgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVNYXAgaW1wbGVtZW50cyBOYW1lTWFwSW50ZXJmYWNlIHtcbiAgcHJpdmF0ZSBuYW1lTWFwOiBEaWN0PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lTWFwID0ge307XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lTWFwW29sZE5hbWVdID0gbmV3TmFtZTtcbiAgfVxuXG5cbiAgcHVibGljIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lTWFwW25hbWVdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gSWYgdGhlIG5hbWUgYXBwZWFycyBpbiB0aGUgX25hbWVNYXAsIHdlIG5lZWQgdG8gcmVhZCBpdHMgbmV3IG5hbWUuXG4gICAgLy8gV2UgaGF2ZSB0byBsb29wIG92ZXIgdGhlIGRpY3QganVzdCBpbiBjYXNlIHRoZSBuZXcgbmFtZSBhbHNvIGdldHMgcmVuYW1lZC5cbiAgICB3aGlsZSAodGhpcy5uYW1lTWFwW25hbWVdICYmIG5hbWUgIT09IHRoaXMubmFtZU1hcFtuYW1lXSkge1xuICAgICAgbmFtZSA9IHRoaXMubmFtZU1hcFtuYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuXG4vKlxuICBXZSB1c2UgdHlwZSBndWFyZHMgaW5zdGVhZCBvZiBgaW5zdGFuY2VvZmAgYXMgYGluc3RhbmNlb2ZgIG1ha2VzXG4gIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIgZGVwZW5kIG9uIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2ZcbiAgdGhlIG1vZGVsIGNsYXNzZXMsIHdoaWNoIGluIHR1cm4gZGVwZW5kIG9uIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIuXG4gIFRodXMsIGBpbnN0YW5jZW9mYCBsZWFkcyB0byBjaXJjdWxhciBkZXBlbmRlbmN5IHByb2JsZW1zLlxuXG4gIE9uIHRoZSBvdGhlciBoYW5kLCB0eXBlIGd1YXJkcyBvbmx5IG1ha2UgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlclxuICBkZXBlbmQgb24gdGhlIHR5cGUgb2YgdGhlIG1vZGVsIGNsYXNzZXMsIGJ1dCBub3QgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VuaXRNb2RlbChtb2RlbDogTW9kZWwpOiBtb2RlbCBpcyBVbml0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3VuaXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYWNldE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIEZhY2V0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2ZhY2V0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgUmVwZWF0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3JlcGVhdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNhdE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIENvbmNhdE1vZGVsIHtcbiAgcmV0dXJuIG1vZGVsICYmIG1vZGVsLnR5cGUgPT09ICdjb25jYXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNMYXllck1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIExheWVyTW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2xheWVyJztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsIHtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgdHlwZTogJ3VuaXQnIHwgJ2ZhY2V0JyB8ICdsYXllcicgfCAnY29uY2F0JyB8ICdyZXBlYXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50OiBNb2RlbDtcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgdGl0bGU6IFRpdGxlUGFyYW1zO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb246IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZGF0YTogRGF0YTtcbiAgcHVibGljIHJlYWRvbmx5IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2NhbGVzLCB3aGljaCBjYW4gYmUgcmVuYW1lZCBieSBhIG1vZGVsJ3MgcGFyZW50LiAqL1xuICBwcm90ZWN0ZWQgc2NhbGVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3IgcHJvamVjdGlvbnMsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBwcm9qZWN0aW9uTmFtZU1hcDogTmFtZU1hcEludGVyZmFjZTtcblxuICAvKiogTmFtZSBtYXAgZm9yIHNpemUsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBsYXlvdXRTaXplTmFtZU1hcDogTmFtZU1hcEludGVyZmFjZTtcblxuXG4gIHB1YmxpYyByZWFkb25seSBjb25maWc6IENvbmZpZztcblxuICBwdWJsaWMgcmVhZG9ubHkgY29tcG9uZW50OiBDb21wb25lbnQ7XG5cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNoaWxkcmVuOiBNb2RlbFtdID0gW107XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogQmFzZVNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLCBjb25maWc6IENvbmZpZywgcmVzb2x2ZTogUmVzb2x2ZSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgLy8gSWYgbmFtZSBpcyBub3QgcHJvdmlkZWQsIGFsd2F5cyB1c2UgcGFyZW50J3MgZ2l2ZW5OYW1lIHRvIGF2b2lkIG5hbWUgY29uZmxpY3RzLlxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZSB8fCBwYXJlbnRHaXZlbk5hbWU7XG4gICAgdGhpcy50aXRsZSA9IGlzU3RyaW5nKHNwZWMudGl0bGUpID8ge3RleHQ6IHNwZWMudGl0bGV9IDogc3BlYy50aXRsZTtcblxuICAgIC8vIFNoYXJlZCBuYW1lIG1hcHNcbiAgICB0aGlzLnNjYWxlTmFtZU1hcCA9IHBhcmVudCA/IHBhcmVudC5zY2FsZU5hbWVNYXAgOiBuZXcgTmFtZU1hcCgpO1xuICAgIHRoaXMucHJvamVjdGlvbk5hbWVNYXAgPSBwYXJlbnQgPyBwYXJlbnQucHJvamVjdGlvbk5hbWVNYXAgOiBuZXcgTmFtZU1hcCgpO1xuICAgIHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAgPSBwYXJlbnQgPyBwYXJlbnQubGF5b3V0U2l6ZU5hbWVNYXAgOiBuZXcgTmFtZU1hcCgpO1xuXG4gICAgdGhpcy5kYXRhID0gc3BlYy5kYXRhO1xuXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHNwZWMuZGVzY3JpcHRpb247XG4gICAgdGhpcy50cmFuc2Zvcm1zID0gbm9ybWFsaXplVHJhbnNmb3JtKHNwZWMudHJhbnNmb3JtIHx8IFtdKTtcblxuICAgIHRoaXMuY29tcG9uZW50ID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICBzb3VyY2VzOiBwYXJlbnQgPyBwYXJlbnQuY29tcG9uZW50LmRhdGEuc291cmNlcyA6IHt9LFxuICAgICAgICBvdXRwdXROb2RlczogcGFyZW50ID8gcGFyZW50LmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVzIDoge30sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHM6IHBhcmVudCA/IHBhcmVudC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlUmVmQ291bnRzIDoge30sXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHBhcmVudCA/IHsuLi5wYXJlbnQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZX0gOiB7fSxcbiAgICAgICAgLy8gZGF0YSBpcyBmYWNldGVkIGlmIHRoZSBzcGVjIGlzIGEgZmFjZXQgc3BlYyBvciB0aGUgcGFyZW50IGhhcyBmYWNldGVkIGRhdGEgYW5kIG5vIGRhdGEgaXMgZGVmaW5lZFxuICAgICAgICBpc0ZhY2V0ZWQ6IGlzRmFjZXRTcGVjKHNwZWMpIHx8IChwYXJlbnQgJiYgcGFyZW50LmNvbXBvbmVudC5kYXRhLmlzRmFjZXRlZCAmJiAhc3BlYy5kYXRhKVxuICAgICAgfSxcbiAgICAgIGxheW91dFNpemU6IG5ldyBTcGxpdDxMYXlvdXRTaXplSW5kZXg+KCksXG4gICAgICBsYXlvdXRIZWFkZXJzOntyb3c6IHt9LCBjb2x1bW46IHt9fSxcbiAgICAgIG1hcms6IG51bGwsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHNjYWxlOiB7fSwgYXhpczoge30sIGxlZ2VuZDoge30sXG4gICAgICAgIC4uLihyZXNvbHZlIHx8IHt9KVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGlvbjogbnVsbCxcbiAgICAgIHNjYWxlczogbnVsbCxcbiAgICAgIHByb2plY3Rpb246IG51bGwsXG4gICAgICBheGVzOiB7fSxcbiAgICAgIGxlZ2VuZHM6IHt9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0IHdpZHRoKCk6IFZnU2lnbmFsUmVmIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpO1xuICB9XG5cblxuICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBWZ1NpZ25hbFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0Jyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdFNpemUoc2l6ZTogTGF5b3V0U2l6ZUluZGV4KSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gc2l6ZTtcbiAgICBpZiAod2lkdGgpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50LmxheW91dFNpemUuc2V0KCd3aWR0aCcsIHdpZHRoLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5sYXlvdXRTaXplLnNldCgnaGVpZ2h0JywgaGVpZ2h0LCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2UoKSB7XG4gICAgdGhpcy5wYXJzZVNjYWxlKCk7XG5cbiAgICB0aGlzLnBhcnNlTGF5b3V0U2l6ZSgpOyAvLyBkZXBlbmRzIG9uIHNjYWxlXG4gICAgdGhpcy5yZW5hbWVUb3BMZXZlbExheW91dFNpemUoKTtcblxuICAgIHRoaXMucGFyc2VTZWxlY3Rpb24oKTtcbiAgICB0aGlzLnBhcnNlUHJvamVjdGlvbigpO1xuICAgIHRoaXMucGFyc2VEYXRhKCk7IC8vIChwYXRob3JkZXIpIGRlcGVuZHMgb24gbWFya0RlZjsgc2VsZWN0aW9uIGZpbHRlcnMgZGVwZW5kIG9uIHBhcnNlZCBzZWxlY3Rpb25zOyBkZXBlbmRzIG9uIHByb2plY3Rpb24gYmVjYXVzZSBzb21lIHRyYW5zZm9ybXMgcmVxdWlyZSB0aGUgZmluYWxpemVkIHByb2plY3Rpb24gbmFtZS5cbiAgICB0aGlzLnBhcnNlQXhpc0FuZEhlYWRlcigpOyAvLyBkZXBlbmRzIG9uIHNjYWxlIGFuZCBsYXlvdXQgc2l6ZVxuICAgIHRoaXMucGFyc2VMZWdlbmQoKTsgLy8gZGVwZW5kcyBvbiBzY2FsZSwgbWFya0RlZlxuICAgIHRoaXMucGFyc2VNYXJrR3JvdXAoKTsgLy8gZGVwZW5kcyBvbiBkYXRhIG5hbWUsIHNjYWxlLCBsYXlvdXQgc2l6ZSwgYXhpc0dyb3VwLCBhbmQgY2hpbGRyZW4ncyBzY2FsZSwgYXhpcywgbGVnZW5kIGFuZCBtYXJrLlxuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlRGF0YSgpOiB2b2lkO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZVNlbGVjdGlvbigpOiB2b2lkO1xuXG5cbiAgcHVibGljIHBhcnNlU2NhbGUoKSB7XG4gICAgcGFyc2VTY2FsZSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVByb2plY3Rpb24oKSB7XG4gICAgcGFyc2VQcm9qZWN0aW9uKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlTGF5b3V0U2l6ZSgpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW5hbWUgdG9wLWxldmVsIHNwZWMncyBzaXplIHRvIGJlIGp1c3Qgd2lkdGggLyBoZWlnaHQsIGlnbm9yaW5nIG1vZGVsIG5hbWUuXG4gICAqIFRoaXMgZXNzZW50aWFsbHkgbWVyZ2VzIHRoZSB0b3AtbGV2ZWwgc3BlYydzIHdpZHRoL2hlaWdodCBzaWduYWxzIHdpdGggdGhlIHdpZHRoL2hlaWdodCBzaWduYWxzXG4gICAqIHRvIGhlbHAgdXMgcmVkdWNlIHJlZHVuZGFudCBzaWduYWxzIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5hbWVUb3BMZXZlbExheW91dFNpemUoKSB7XG4gICAgaWYgKHRoaXMuZ2V0TmFtZSgnd2lkdGgnKSAhPT0gJ3dpZHRoJykge1xuICAgICAgdGhpcy5yZW5hbWVMYXlvdXRTaXplKHRoaXMuZ2V0TmFtZSgnd2lkdGgnKSwgJ3dpZHRoJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmdldE5hbWUoJ2hlaWdodCcpICE9PSAnaGVpZ2h0Jykge1xuICAgICAgdGhpcy5yZW5hbWVMYXlvdXRTaXplKHRoaXMuZ2V0TmFtZSgnaGVpZ2h0JyksICdoZWlnaHQnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VNYXJrR3JvdXAoKTogdm9pZDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VBeGlzQW5kSGVhZGVyKCk6IHZvaWQ7XG5cbiAgcHVibGljIHBhcnNlTGVnZW5kKCkge1xuICAgIHBhcnNlTGVnZW5kKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogYW55W107XG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogYW55W107XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdO1xuXG4gIHB1YmxpYyBhc3NlbWJsZUdyb3VwU3R5bGUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy50eXBlID09PSAndW5pdCcgfHwgdGhpcy50eXBlID09PSAnbGF5ZXInKSB7XG4gICAgICByZXR1cm4gJ2NlbGwnO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2l6ZSgpOiBWZ0VuY29kZUVudHJ5IHtcbiAgICBpZiAodGhpcy50eXBlID09PSAndW5pdCcgfHwgdGhpcy50eXBlID09PSAnbGF5ZXInKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JylcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQ7XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdO1xuXG4gIHB1YmxpYyBhc3NlbWJsZUhlYWRlck1hcmtzKCk6IFZnTWFya0dyb3VwW10ge1xuICAgIGNvbnN0IHtsYXlvdXRIZWFkZXJzfSA9IHRoaXMuY29tcG9uZW50O1xuICAgIGxldCBoZWFkZXJNYXJrcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIEhFQURFUl9DSEFOTkVMUykge1xuICAgICAgaWYgKGxheW91dEhlYWRlcnNbY2hhbm5lbF0udGl0bGUpIHtcbiAgICAgICAgaGVhZGVyTWFya3MucHVzaChnZXRUaXRsZUdyb3VwKHRoaXMsIGNoYW5uZWwpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgSEVBREVSX0NIQU5ORUxTKSB7XG4gICAgICBoZWFkZXJNYXJrcyA9IGhlYWRlck1hcmtzLmNvbmNhdChnZXRIZWFkZXJHcm91cHModGhpcywgY2hhbm5lbCkpO1xuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyTWFya3M7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVNYXJrcygpOiBWZ01hcmtHcm91cFtdOyAvLyBUT0RPOiBWZ01hcmtHcm91cFtdXG5cbiAgcHVibGljIGFzc2VtYmxlQXhlcygpOiBWZ0F4aXNbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlQXhlcyh0aGlzLmNvbXBvbmVudC5heGVzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxlZ2VuZHMoKTogVmdMZWdlbmRbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlTGVnZW5kcyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVByb2plY3Rpb25zKCk6IFZnUHJvamVjdGlvbltdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVQcm9qZWN0aW9ucyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRpdGxlKCk6IFZnVGl0bGUge1xuICAgIGNvbnN0IHRpdGxlOiBWZ1RpdGxlID0ge1xuICAgICAgLi4uZXh0cmFjdFRpdGxlQ29uZmlnKHRoaXMuY29uZmlnLnRpdGxlKS5ub25NYXJrLFxuICAgICAgLi4udGhpcy50aXRsZVxuICAgIH07XG5cbiAgICBpZiAodGl0bGUudGV4dCkge1xuICAgICAgaWYgKCFjb250YWlucyhbJ3VuaXQnLCAnbGF5ZXInXSwgdGhpcy50eXBlKSkge1xuICAgICAgICAvLyBBcyBkZXNjcmliZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yODc1OlxuICAgICAgICAvLyBEdWUgdG8gdmVnYS92ZWdhIzk2MCAoY29tbWVudCksIHdlIG9ubHkgc3VwcG9ydCB0aXRsZSdzIGFuY2hvciBmb3IgdW5pdCBhbmQgbGF5ZXJlZCBzcGVjIGZvciBub3cuXG5cbiAgICAgICAgaWYgKHRpdGxlLmFuY2hvciAmJiB0aXRsZS5hbmNob3IgIT09ICdzdGFydCcpIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RTZXRUaXRsZUFuY2hvcih0aGlzLnR5cGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aXRsZS5hbmNob3IgPSAnc3RhcnQnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5cyh0aXRsZSkubGVuZ3RoID4gMCA/IHRpdGxlIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VtYmxlIHRoZSBtYXJrIGdyb3VwIGZvciB0aGlzIG1vZGVsLiAgV2UgYWNjZXB0IG9wdGlvbmFsIGBzaWduYWxzYCBzbyB0aGF0IHdlIGNhbiBpbmNsdWRlIGNvbmNhdCB0b3AtbGV2ZWwgc2lnbmFscyB3aXRoIHRoZSB0b3AtbGV2ZWwgbW9kZWwncyBsb2NhbCBzaWduYWxzLlxuICAgKi9cbiAgcHVibGljIGFzc2VtYmxlR3JvdXAoc2lnbmFsczogVmdTaWduYWxbXSA9IFtdKSB7XG4gICAgY29uc3QgZ3JvdXA6IFZnTWFya0dyb3VwID0ge307XG5cbiAgICBzaWduYWxzID0gc2lnbmFscy5jb25jYXQodGhpcy5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKSk7XG5cbiAgICBpZiAoc2lnbmFscy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5zaWduYWxzID0gc2lnbmFscztcbiAgICB9XG5cbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmFzc2VtYmxlTGF5b3V0KCk7XG4gICAgaWYgKGxheW91dCkge1xuICAgICAgZ3JvdXAubGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cblxuICAgIGdyb3VwLm1hcmtzID0gW10uY29uY2F0KFxuICAgICAgdGhpcy5hc3NlbWJsZUhlYWRlck1hcmtzKCksXG4gICAgICB0aGlzLmFzc2VtYmxlTWFya3MoKVxuICAgICk7XG5cbiAgICAvLyBPbmx5IGluY2x1ZGUgc2NhbGVzIGlmIHRoaXMgc3BlYyBpcyB0b3AtbGV2ZWwgb3IgaWYgcGFyZW50IGlzIGZhY2V0LlxuICAgIC8vIChPdGhlcndpc2UsIGl0IHdpbGwgYmUgbWVyZ2VkIHdpdGggdXBwZXItbGV2ZWwncyBzY29wZS4pXG4gICAgY29uc3Qgc2NhbGVzID0gKCF0aGlzLnBhcmVudCB8fCBpc0ZhY2V0TW9kZWwodGhpcy5wYXJlbnQpKSA/IGFzc2VtYmxlU2NhbGVzKHRoaXMpIDogW107XG4gICAgaWYgKHNjYWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5zY2FsZXMgPSBzY2FsZXM7XG4gICAgfVxuXG4gICAgY29uc3QgYXhlcyA9IHRoaXMuYXNzZW1ibGVBeGVzKCk7XG4gICAgaWYgKGF4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAuYXhlcyA9IGF4ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgbGVnZW5kcyA9IHRoaXMuYXNzZW1ibGVMZWdlbmRzKCk7XG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAubGVnZW5kcyA9IGxlZ2VuZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgcHVibGljIGhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgaWYgKGlzVW5pdE1vZGVsKGNoaWxkKSkge1xuICAgICAgICBpZiAoY2hpbGQuY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjaGlsZC5oYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhck5hbWUoKHRoaXMubmFtZSA/IHRoaXMubmFtZSArICdfJyA6ICcnKSArIHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYSBkYXRhIHNvdXJjZSBuYW1lIGZvciB0aGUgZ2l2ZW4gZGF0YSBzb3VyY2UgdHlwZSBhbmQgbWFyayB0aGF0IGRhdGEgc291cmNlIGFzIHJlcXVpcmVkLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGluIHBhcnNlLCBzbyB0aGF0IGFsbCB1c2VkIGRhdGEgc291cmNlIGNhbiBiZSBjb3JyZWN0bHkgaW5zdGFudGlhdGVkIGluIGFzc2VtYmxlRGF0YSgpLlxuICAgKi9cbiAgcHVibGljIHJlcXVlc3REYXRhTmFtZShuYW1lOiBEYXRhU291cmNlVHlwZSkge1xuICAgIGNvbnN0IGZ1bGxOYW1lID0gdGhpcy5nZXROYW1lKG5hbWUpO1xuXG4gICAgLy8gSW5jcmVhc2UgcmVmIGNvdW50LiBUaGlzIGlzIGNyaXRpY2FsIGJlY2F1c2Ugb3RoZXJ3aXNlIHdlIHdvbid0IGNyZWF0ZSBhIGRhdGEgc291cmNlLlxuICAgIC8vIFdlIGFsc28gaW5jcmVhc2UgdGhlIHJlZiBjb3VudHMgb24gT3V0cHV0Tm9kZS5nZXRTb3VyY2UoKSBjYWxscy5cbiAgICBjb25zdCByZWZDb3VudHMgPSB0aGlzLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHM7XG4gICAgcmVmQ291bnRzW2Z1bGxOYW1lXSA9IChyZWZDb3VudHNbZnVsbE5hbWVdIHx8IDApICsgMTtcblxuICAgIHJldHVybiBmdWxsTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlOiAnd2lkdGgnIHwgJ2hlaWdodCcpOiBWZ1NpZ25hbFJlZiB7XG4gICAgaWYgKGlzRmFjZXRNb2RlbCh0aGlzLnBhcmVudCkpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBzaXplVHlwZSA9PT0gJ3dpZHRoJyA/ICd4JyA6ICd5JztcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoc2NhbGVDb21wb25lbnQgJiYgIXNjYWxlQ29tcG9uZW50Lm1lcmdlZCkgeyAvLyBpbmRlcGVuZGVudCBzY2FsZVxuICAgICAgICBjb25zdCB0eXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gc2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICAgIGNvbnN0IHNjYWxlTmFtZSA9IHNjYWxlQ29tcG9uZW50LmdldCgnbmFtZScpO1xuICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMsIGNoYW5uZWwpO1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZFJlZiA9IHZnRmllbGQoe2FnZ3JlZ2F0ZTogJ2Rpc3RpbmN0JywgZmllbGR9LCB7ZXhwcjogJ2RhdHVtJ30pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc2lnbmFsOiBzaXplRXhwcihzY2FsZU5hbWUsIHNjYWxlQ29tcG9uZW50LCBmaWVsZFJlZilcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShzaXplVHlwZSkpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rdXAgdGhlIG5hbWUgb2YgdGhlIGRhdGFzb3VyY2UgZm9yIGFuIG91dHB1dCBub2RlLiBZb3UgcHJvYmFibHkgd2FudCB0byBjYWxsIHRoaXMgaW4gYXNzZW1ibGUuXG4gICAqL1xuICBwdWJsaWMgbG9va3VwRGF0YVNvdXJjZShuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5jb21wb25lbnQuZGF0YS5vdXRwdXROb2Rlc1tuYW1lXTtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgLy8gTmFtZSBub3QgZm91bmQgaW4gbWFwIHNvIGxldCdzIGp1c3QgcmV0dXJuIHdoYXQgd2UgZ290LlxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGUgY29ycmVjdCBuYW1lLlxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGUuZ2V0U291cmNlKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2l6ZU5hbWUob2xkU2l6ZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgIHJldHVybiB0aGlzLmxheW91dFNpemVOYW1lTWFwLmdldChvbGRTaXplTmFtZSk7XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lTGF5b3V0U2l6ZShvbGROYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZVNjYWxlKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY2FsZU5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZVByb2plY3Rpb24ob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnByb2plY3Rpb25OYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCBhZnRlciB0aGUgc2NhbGUgaGFzIGJlZW4gcGFyc2VkIGFuZCBuYW1lZC5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU5hbWUob3JpZ2luYWxTY2FsZU5hbWU6IENoYW5uZWwgfCBzdHJpbmcsIHBhcnNlPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICAvLyBEdXJpbmcgdGhlIHBhcnNlIHBoYXNlIGFsd2F5cyByZXR1cm4gYSB2YWx1ZVxuICAgICAgLy8gTm8gbmVlZCB0byByZWZlciB0byByZW5hbWUgbWFwIGJlY2F1c2UgYSBzY2FsZSBjYW4ndCBiZSByZW5hbWVkXG4gICAgICAvLyBiZWZvcmUgaXQgaGFzIHRoZSBvcmlnaW5hbCBuYW1lLlxuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIGl0IHNob3VsZCBlaXRoZXJcbiAgICAvLyBiZSBpbiB0aGUgc2NhbGUgY29tcG9uZW50IG9yIGV4aXN0IGluIHRoZSBuYW1lIG1hcFxuICAgIGlmIChcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIHRoZXJlIHNob3VsZCBiZSBhIGxvY2FsIHNjYWxlIGNvbXBvbmVudCBmb3IgaXRcbiAgICAgICAgKGlzQ2hhbm5lbChvcmlnaW5hbFNjYWxlTmFtZSkgJiYgaXNTY2FsZUNoYW5uZWwob3JpZ2luYWxTY2FsZU5hbWUpICYmIHRoaXMuY29tcG9uZW50LnNjYWxlc1tvcmlnaW5hbFNjYWxlTmFtZV0pIHx8XG4gICAgICAgIC8vIGluIHRoZSBzY2FsZSBuYW1lIG1hcCAodGhlIHRoZSBzY2FsZSBnZXQgbWVyZ2VkIGJ5IGl0cyBwYXJlbnQpXG4gICAgICAgIHRoaXMuc2NhbGVOYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUob3JpZ2luYWxTY2FsZU5hbWUpKVxuICAgICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2FsZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gcHJvamVjdGlvbiBuYW1lIGFmdGVyIHRoZSBwcm9qZWN0aW9uIGhhcyBiZWVuIHBhcnNlZCBhbmQgbmFtZWQuXG4gICAqL1xuICBwdWJsaWMgcHJvamVjdGlvbk5hbWUocGFyc2U/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBpZiAocGFyc2UpIHtcbiAgICAgIC8vIER1cmluZyB0aGUgcGFyc2UgcGhhc2UgYWx3YXlzIHJldHVybiBhIHZhbHVlXG4gICAgICAvLyBObyBuZWVkIHRvIHJlZmVyIHRvIHJlbmFtZSBtYXAgYmVjYXVzZSBhIHByb2plY3Rpb24gY2FuJ3QgYmUgcmVuYW1lZFxuICAgICAgLy8gYmVmb3JlIGl0IGhhcyB0aGUgb3JpZ2luYWwgbmFtZS5cbiAgICAgIHJldHVybiB0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMuY29tcG9uZW50LnByb2plY3Rpb24gJiYgIXRoaXMuY29tcG9uZW50LnByb2plY3Rpb24ubWVyZ2VkKSB8fCB0aGlzLnByb2plY3Rpb25OYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2plY3Rpb25OYW1lTWFwLmdldCh0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIGRhdGEgcmVmZXJlbmNlcyBpbiBtYXJrcyBhZnRlciBhc3NlbWJsZS5cbiAgICovXG4gIHB1YmxpYyBjb3JyZWN0RGF0YU5hbWVzID0gKG1hcms6IFZnTWFya0dyb3VwKSA9PiB7XG4gICAgLy8gVE9ETzogbWFrZSB0aGlzIGNvcnJlY3RcblxuICAgIC8vIGZvciBub3JtYWwgZGF0YSByZWZlcmVuY2VzXG4gICAgaWYgKG1hcmsuZnJvbSAmJiBtYXJrLmZyb20uZGF0YSkge1xuICAgICAgbWFyay5mcm9tLmRhdGEgPSB0aGlzLmxvb2t1cERhdGFTb3VyY2UobWFyay5mcm9tLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIGZvciBhY2Nlc3MgdG8gZmFjZXQgZGF0YVxuICAgIGlmIChtYXJrLmZyb20gJiYgbWFyay5mcm9tLmZhY2V0ICYmIG1hcmsuZnJvbS5mYWNldC5kYXRhKSB7XG4gICAgICBtYXJrLmZyb20uZmFjZXQuZGF0YSA9IHRoaXMubG9va3VwRGF0YVNvdXJjZShtYXJrLmZyb20uZmFjZXQuZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcms7XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2UgYSBtb2RlbCdzIGhpZXJhcmNoeSB0byBnZXQgdGhlIHNjYWxlIGNvbXBvbmVudCBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWwuXG4gICAqL1xuICBwdWJsaWMgZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbDogU2NhbGVDaGFubmVsKTogU2NhbGVDb21wb25lbnQge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBUaGlzIGlzIHdhcm5pbmcgZm9yIGRlYnVnZ2luZyB0ZXN0ICovXG4gICAgaWYgKCF0aGlzLmNvbXBvbmVudC5zY2FsZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0U2NhbGVDb21wb25lbnQgY2Fubm90IGJlIGNhbGxlZCBiZWZvcmUgcGFyc2VTY2FsZSgpLiAgTWFrZSBzdXJlIHlvdSBoYXZlIGNhbGxlZCBwYXJzZVNjYWxlIG9yIHVzZSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSgpLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgaWYgKGxvY2FsU2NhbGVDb21wb25lbnQgJiYgIWxvY2FsU2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICByZXR1cm4gbG9jYWxTY2FsZUNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpIDogdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZSBhIG1vZGVsJ3MgaGllcmFyY2h5IHRvIGdldCBhIHBhcnRpY3VsYXIgc2VsZWN0aW9uIGNvbXBvbmVudC5cbiAgICovXG4gIHB1YmxpYyBnZXRTZWxlY3Rpb25Db21wb25lbnQodmFyaWFibGVOYW1lOiBzdHJpbmcsIG9yaWdOYW1lOiBzdHJpbmcpOiBTZWxlY3Rpb25Db21wb25lbnQge1xuICAgIGxldCBzZWwgPSB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb25bdmFyaWFibGVOYW1lXTtcbiAgICBpZiAoIXNlbCAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgc2VsID0gdGhpcy5wYXJlbnQuZ2V0U2VsZWN0aW9uQ29tcG9uZW50KHZhcmlhYmxlTmFtZSwgb3JpZ05hbWUpO1xuICAgIH1cbiAgICBpZiAoIXNlbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLnNlbGVjdGlvbk5vdEZvdW5kKG9yaWdOYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiBzZWw7XG4gIH1cbn1cblxuLyoqIEFic3RyYWN0IGNsYXNzIGZvciBVbml0TW9kZWwgYW5kIEZhY2V0TW9kZWwuICBCb3RoIG9mIHdoaWNoIGNhbiBjb250YWluIGZpZWxkRGVmcyBhcyBhIHBhcnQgb2YgaXRzIG93biBzcGVjaWZpY2F0aW9uLiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsV2l0aEZpZWxkIGV4dGVuZHMgTW9kZWwge1xuICBwdWJsaWMgYWJzdHJhY3QgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz47XG5cbiAgLyoqIEdldCBcImZpZWxkXCIgcmVmZXJlbmNlIGZvciB2ZWdhICovXG4gIHB1YmxpYyB2Z0ZpZWxkKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwsIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSkge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcblxuICAgIGlmICghZmllbGREZWYpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZnRmllbGQoZmllbGREZWYsIG9wdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0TWFwcGluZygpOiB7W2tleSBpbiBDaGFubmVsXT86IGFueX07XG5cbiAgcHVibGljIHJlZHVjZUZpZWxkRGVmPFQsIFU+KGY6IChhY2M6IFUsIGZkOiBGaWVsZERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiBVLCBpbml0OiBULCB0PzogYW55KSB7XG4gICAgcmV0dXJuIHJlZHVjZSh0aGlzLmdldE1hcHBpbmcoKSwgKGFjYzpVICwgY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgcmV0dXJuIGYoYWNjLCBmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGluaXQsIHQpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2hGaWVsZERlZihmOiAoZmQ6IEZpZWxkRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IHZvaWQsIHQ/OiBhbnkpIHtcbiAgICBmb3JFYWNoKHRoaXMuZ2V0TWFwcGluZygpLCAoY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgZihmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgfSwgdCk7XG4gIH1cbiAgcHVibGljIGFic3RyYWN0IGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbjtcbn1cbiJdfQ==