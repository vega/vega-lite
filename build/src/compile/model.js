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
        return assemble_1.assembleAxes(this.component.axes, this.config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUVuQyxzQ0FBOEY7QUFHOUYsd0NBQTRDO0FBQzVDLHdDQUF1RjtBQUN2Riw0QkFBOEI7QUFFOUIsa0NBQTJDO0FBQzNDLGdDQUE4QztBQUM5QyxrQ0FBeUQ7QUFDekQsMENBQTJEO0FBQzNELGdDQUFzRDtBQUN0RCw4Q0FXd0I7QUFFeEIsNENBQTZDO0FBTTdDLDBDQUF1RztBQUN2RyxrREFBK0M7QUFFL0MsOENBQWtEO0FBRWxELHdDQUEyQztBQUMzQyxrREFBMEQ7QUFFMUQsNENBQW1EO0FBRW5ELDZDQUFnRDtBQUVoRCx5Q0FBa0U7QUFDbEUsdUNBQXlDO0FBRXpDLGlDQUE4QjtBQXlDOUI7SUFHRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3QkFBTSxHQUFiLFVBQWMsT0FBZSxFQUFFLE9BQWU7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbEMsQ0FBQztJQUdNLHFCQUFHLEdBQVYsVUFBVyxJQUFZO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUMxQyxDQUFDO0lBRU0scUJBQUcsR0FBVixVQUFXLElBQVk7UUFDckIscUVBQXFFO1FBQ3JFLDZFQUE2RTtRQUM3RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN6RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQsTUFBTSxDQUFDLElB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UUFDOUYsTUFBTSxDQUFDLGlCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFVBQUMsR0FBSyxFQUFHLEVBQXNCLEVBQUUsQ0FBVTtZQUMxRSxJQUFNLFFBQVEsR0FBRyxzQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFTSx3Q0FBZSxHQUF0QixVQUF1QixDQUE2QyxFQUFFLENBQU87UUFDM0Usa0JBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsVUFBQyxFQUFzQixFQUFFLENBQVU7WUFDNUQsSUFBTSxRQUFRLEdBQUcsc0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQztRQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFSCxxQkFBQztBQUFELENBQUMsQUFuQ0QsQ0FBNkMsS0FBSyxHQW1DakQ7QUFuQ3FCLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHtDaGFubmVsLCBpc0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsLCBTY2FsZUNoYW5uZWwsIFNpbmdsZURlZkNoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGEsIERhdGFTb3VyY2VUeXBlfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Zm9yRWFjaCwgcmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0NoYW5uZWxEZWYsIEZpZWxkRGVmLCBGaWVsZFJlZk9wdGlvbiwgZ2V0RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7QmFzZVNwZWMsIGlzRmFjZXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7ZXh0cmFjdFRpdGxlQ29uZmlnLCBUaXRsZVBhcmFtc30gZnJvbSAnLi4vdGl0bGUnO1xuaW1wb3J0IHtub3JtYWxpemVUcmFuc2Zvcm0sIFRyYW5zZm9ybX0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7Y29udGFpbnMsIERpY3QsIGtleXMsIHZhck5hbWV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtcbiAgaXNWZ1JhbmdlU3RlcCxcbiAgVmdBeGlzLFxuICBWZ0RhdGEsXG4gIFZnRW5jb2RlRW50cnksXG4gIFZnTGF5b3V0LFxuICBWZ0xlZ2VuZCxcbiAgVmdNYXJrR3JvdXAsXG4gIFZnU2lnbmFsLFxuICBWZ1NpZ25hbFJlZixcbiAgVmdUaXRsZSxcbn0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtWZ1Byb2plY3Rpb259IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YXNzZW1ibGVBeGVzfSBmcm9tICcuL2F4aXMvYXNzZW1ibGUnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb25jYXRNb2RlbH0gZnJvbSAnLi9jb25jYXQnO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHtGYWNldE1vZGVsfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi9sYXllcic7XG5pbXBvcnQge2dldEhlYWRlckdyb3VwcywgZ2V0VGl0bGVHcm91cCwgSEVBREVSX0NIQU5ORUxTLCBMYXlvdXRIZWFkZXJDb21wb25lbnR9IGZyb20gJy4vbGF5b3V0L2hlYWRlcic7XG5pbXBvcnQge3NpemVFeHByfSBmcm9tICcuL2xheW91dHNpemUvYXNzZW1ibGUnO1xuaW1wb3J0IHtMYXlvdXRTaXplQ29tcG9uZW50LCBMYXlvdXRTaXplSW5kZXh9IGZyb20gJy4vbGF5b3V0c2l6ZS9jb21wb25lbnQnO1xuaW1wb3J0IHthc3NlbWJsZUxlZ2VuZHN9IGZyb20gJy4vbGVnZW5kL2Fzc2VtYmxlJztcbmltcG9ydCB7TGVnZW5kQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vbGVnZW5kL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlTGVnZW5kfSBmcm9tICcuL2xlZ2VuZC9wYXJzZSc7XG5pbXBvcnQge2Fzc2VtYmxlUHJvamVjdGlvbnN9IGZyb20gJy4vcHJvamVjdGlvbi9hc3NlbWJsZSc7XG5pbXBvcnQge1Byb2plY3Rpb25Db21wb25lbnR9IGZyb20gJy4vcHJvamVjdGlvbi9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVByb2plY3Rpb259IGZyb20gJy4vcHJvamVjdGlvbi9wYXJzZSc7XG5pbXBvcnQge1JlcGVhdE1vZGVsfSBmcm9tICcuL3JlcGVhdCc7XG5pbXBvcnQge2Fzc2VtYmxlU2NhbGVzfSBmcm9tICcuL3NjYWxlL2Fzc2VtYmxlJztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vc2NhbGUvY29tcG9uZW50JztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi9zY2FsZS9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlfSBmcm9tICcuL3NjYWxlL3BhcnNlJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTcGxpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG4vKipcbiAqIENvbXBvc2FibGUgQ29tcG9uZW50cyB0aGF0IGFyZSBpbnRlcm1lZGlhdGUgcmVzdWx0cyBvZiB0aGUgcGFyc2luZyBwaGFzZSBvZiB0aGVcbiAqIGNvbXBpbGF0aW9ucy4gIFRoZSBjb21wb25lbnRzIHJlcHJlc2VudHMgcGFydHMgb2YgdGhlIHNwZWNpZmljYXRpb24gaW4gYSBmb3JtIHRoYXRcbiAqIGNhbiBiZSBlYXNpbHkgbWVyZ2VkIChkdXJpbmcgcGFyc2luZyBmb3IgY29tcG9zaXRlIHNwZWNzKS5cbiAqIEluIGFkZGl0aW9uLCB0aGVzZSBjb21wb25lbnRzIGFyZSBlYXNpbHkgdHJhbnNmb3JtZWQgaW50byBWZWdhIHNwZWNpZmljYXRpb25zXG4gKiBkdXJpbmcgdGhlIFwiYXNzZW1ibGVcIiBwaGFzZSwgd2hpY2ggaXMgdGhlIGxhc3QgcGhhc2Ugb2YgdGhlIGNvbXBpbGF0aW9uIHN0ZXAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50IHtcbiAgZGF0YTogRGF0YUNvbXBvbmVudDtcblxuICBsYXlvdXRTaXplOiBMYXlvdXRTaXplQ29tcG9uZW50O1xuXG4gIGxheW91dEhlYWRlcnM6IHtcbiAgICByb3c/OiBMYXlvdXRIZWFkZXJDb21wb25lbnQsXG4gICAgY29sdW1uPzogTGF5b3V0SGVhZGVyQ29tcG9uZW50XG4gIH07XG5cbiAgbWFyazogVmdNYXJrR3JvdXBbXTtcbiAgc2NhbGVzOiBTY2FsZUNvbXBvbmVudEluZGV4O1xuICBwcm9qZWN0aW9uOiBQcm9qZWN0aW9uQ29tcG9uZW50O1xuICBzZWxlY3Rpb246IERpY3Q8U2VsZWN0aW9uQ29tcG9uZW50PjtcblxuICAvKiogRGljdGlvbmFyeSBtYXBwaW5nIGNoYW5uZWwgdG8gVmdBeGlzIGRlZmluaXRpb24gKi9cbiAgYXhlczogQXhpc0NvbXBvbmVudEluZGV4O1xuXG4gIC8qKiBEaWN0aW9uYXJ5IG1hcHBpbmcgY2hhbm5lbCB0byBWZ0xlZ2VuZCBkZWZpbml0aW9uICovXG4gIGxlZ2VuZHM6IExlZ2VuZENvbXBvbmVudEluZGV4O1xuXG4gIHJlc29sdmU6IFJlc29sdmU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmFtZU1hcEludGVyZmFjZSB7XG4gIHJlbmFtZShvbGRuYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHZvaWQ7XG4gIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuO1xuICBnZXQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTmFtZU1hcCBpbXBsZW1lbnRzIE5hbWVNYXBJbnRlcmZhY2Uge1xuICBwcml2YXRlIG5hbWVNYXA6IERpY3Q8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVNYXAgPSB7fTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWUob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5hbWVNYXBbb2xkTmFtZV0gPSBuZXdOYW1lO1xuICB9XG5cblxuICBwdWJsaWMgaGFzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5hbWVNYXBbbmFtZV0gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBJZiB0aGUgbmFtZSBhcHBlYXJzIGluIHRoZSBfbmFtZU1hcCwgd2UgbmVlZCB0byByZWFkIGl0cyBuZXcgbmFtZS5cbiAgICAvLyBXZSBoYXZlIHRvIGxvb3Agb3ZlciB0aGUgZGljdCBqdXN0IGluIGNhc2UgdGhlIG5ldyBuYW1lIGFsc28gZ2V0cyByZW5hbWVkLlxuICAgIHdoaWxlICh0aGlzLm5hbWVNYXBbbmFtZV0gJiYgbmFtZSAhPT0gdGhpcy5uYW1lTWFwW25hbWVdKSB7XG4gICAgICBuYW1lID0gdGhpcy5uYW1lTWFwW25hbWVdO1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lO1xuICB9XG59XG5cbi8qXG4gIFdlIHVzZSB0eXBlIGd1YXJkcyBpbnN0ZWFkIG9mIGBpbnN0YW5jZW9mYCBhcyBgaW5zdGFuY2VvZmAgbWFrZXNcbiAgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlciBkZXBlbmQgb24gdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZlxuICB0aGUgbW9kZWwgY2xhc3Nlcywgd2hpY2ggaW4gdHVybiBkZXBlbmQgb24gZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlci5cbiAgVGh1cywgYGluc3RhbmNlb2ZgIGxlYWRzIHRvIGNpcmN1bGFyIGRlcGVuZGVuY3kgcHJvYmxlbXMuXG5cbiAgT24gdGhlIG90aGVyIGhhbmQsIHR5cGUgZ3VhcmRzIG9ubHkgbWFrZSBkaWZmZXJlbnQgcGFydHMgb2YgdGhlIGNvbXBpbGVyXG4gIGRlcGVuZCBvbiB0aGUgdHlwZSBvZiB0aGUgbW9kZWwgY2xhc3NlcywgYnV0IG5vdCB0aGUgYWN0dWFsIGltcGxlbWVudGF0aW9uLlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5pdE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIFVuaXRNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAndW5pdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZhY2V0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgRmFjZXRNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAnZmFjZXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBlYXRNb2RlbChtb2RlbDogTW9kZWwpOiBtb2RlbCBpcyBSZXBlYXRNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAncmVwZWF0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uY2F0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgQ29uY2F0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2NvbmNhdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xheWVyTW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgTGF5ZXJNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAnbGF5ZXInO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9kZWwge1xuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB0eXBlOiAndW5pdCcgfCAnZmFjZXQnIHwgJ2xheWVyJyB8ICdjb25jYXQnIHwgJ3JlcGVhdCc7XG4gIHB1YmxpYyByZWFkb25seSBwYXJlbnQ6IE1vZGVsO1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSB0aXRsZTogVGl0bGVQYXJhbXM7XG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBkYXRhOiBEYXRhO1xuICBwdWJsaWMgcmVhZG9ubHkgdHJhbnNmb3JtczogVHJhbnNmb3JtW107XG5cbiAgLyoqIE5hbWUgbWFwIGZvciBzY2FsZXMsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBzY2FsZU5hbWVNYXA6IE5hbWVNYXBJbnRlcmZhY2U7XG5cbiAgLyoqIE5hbWUgbWFwIGZvciBwcm9qZWN0aW9ucywgd2hpY2ggY2FuIGJlIHJlbmFtZWQgYnkgYSBtb2RlbCdzIHBhcmVudC4gKi9cbiAgcHJvdGVjdGVkIHByb2plY3Rpb25OYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2l6ZSwgd2hpY2ggY2FuIGJlIHJlbmFtZWQgYnkgYSBtb2RlbCdzIHBhcmVudC4gKi9cbiAgcHJvdGVjdGVkIGxheW91dFNpemVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuXG4gIHB1YmxpYyByZWFkb25seSBjb21wb25lbnQ6IENvbXBvbmVudDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBCYXNlU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnLCByZXNvbHZlOiBSZXNvbHZlKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAvLyBJZiBuYW1lIGlzIG5vdCBwcm92aWRlZCwgYWx3YXlzIHVzZSBwYXJlbnQncyBnaXZlbk5hbWUgdG8gYXZvaWQgbmFtZSBjb25mbGljdHMuXG4gICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lIHx8IHBhcmVudEdpdmVuTmFtZTtcbiAgICB0aGlzLnRpdGxlID0gaXNTdHJpbmcoc3BlYy50aXRsZSkgPyB7dGV4dDogc3BlYy50aXRsZX0gOiBzcGVjLnRpdGxlO1xuXG4gICAgLy8gU2hhcmVkIG5hbWUgbWFwc1xuICAgIHRoaXMuc2NhbGVOYW1lTWFwID0gcGFyZW50ID8gcGFyZW50LnNjYWxlTmFtZU1hcCA6IG5ldyBOYW1lTWFwKCk7XG4gICAgdGhpcy5wcm9qZWN0aW9uTmFtZU1hcCA9IHBhcmVudCA/IHBhcmVudC5wcm9qZWN0aW9uTmFtZU1hcCA6IG5ldyBOYW1lTWFwKCk7XG4gICAgdGhpcy5sYXlvdXRTaXplTmFtZU1hcCA9IHBhcmVudCA/IHBhcmVudC5sYXlvdXRTaXplTmFtZU1hcCA6IG5ldyBOYW1lTWFwKCk7XG5cbiAgICB0aGlzLmRhdGEgPSBzcGVjLmRhdGE7XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gc3BlYy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRyYW5zZm9ybXMgPSBub3JtYWxpemVUcmFuc2Zvcm0oc3BlYy50cmFuc2Zvcm0gfHwgW10pO1xuXG4gICAgdGhpcy5jb21wb25lbnQgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHNvdXJjZXM6IHBhcmVudCA/IHBhcmVudC5jb21wb25lbnQuZGF0YS5zb3VyY2VzIDoge30sXG4gICAgICAgIG91dHB1dE5vZGVzOiBwYXJlbnQgPyBwYXJlbnQuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXMgOiB7fSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50czogcGFyZW50ID8gcGFyZW50LmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHMgOiB7fSxcbiAgICAgICAgYW5jZXN0b3JQYXJzZTogcGFyZW50ID8gey4uLnBhcmVudC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlfSA6IHt9LFxuICAgICAgICAvLyBkYXRhIGlzIGZhY2V0ZWQgaWYgdGhlIHNwZWMgaXMgYSBmYWNldCBzcGVjIG9yIHRoZSBwYXJlbnQgaGFzIGZhY2V0ZWQgZGF0YSBhbmQgbm8gZGF0YSBpcyBkZWZpbmVkXG4gICAgICAgIGlzRmFjZXRlZDogaXNGYWNldFNwZWMoc3BlYykgfHwgKHBhcmVudCAmJiBwYXJlbnQuY29tcG9uZW50LmRhdGEuaXNGYWNldGVkICYmICFzcGVjLmRhdGEpXG4gICAgICB9LFxuICAgICAgbGF5b3V0U2l6ZTogbmV3IFNwbGl0PExheW91dFNpemVJbmRleD4oKSxcbiAgICAgIGxheW91dEhlYWRlcnM6e3Jvdzoge30sIGNvbHVtbjoge319LFxuICAgICAgbWFyazogbnVsbCxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgc2NhbGU6IHt9LCBheGlzOiB7fSwgbGVnZW5kOiB7fSxcbiAgICAgICAgLi4uKHJlc29sdmUgfHwge30pXG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uOiBudWxsLFxuICAgICAgc2NhbGVzOiBudWxsLFxuICAgICAgcHJvamVjdGlvbjogbnVsbCxcbiAgICAgIGF4ZXM6IHt9LFxuICAgICAgbGVnZW5kczoge30sXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgd2lkdGgoKTogVmdTaWduYWxSZWYge1xuICAgIHJldHVybiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyk7XG4gIH1cblxuXG4gIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IFZnU2lnbmFsUmVmIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0U2l6ZShzaXplOiBMYXlvdXRTaXplSW5kZXgpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBzaXplO1xuICAgIGlmICh3aWR0aCkge1xuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0U2l6ZS5zZXQoJ3dpZHRoJywgd2lkdGgsIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChoZWlnaHQpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50LmxheW91dFNpemUuc2V0KCdoZWlnaHQnLCBoZWlnaHQsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYXJzZSgpIHtcbiAgICB0aGlzLnBhcnNlU2NhbGUoKTtcblxuICAgIHRoaXMucGFyc2VMYXlvdXRTaXplKCk7IC8vIGRlcGVuZHMgb24gc2NhbGVcbiAgICB0aGlzLnJlbmFtZVRvcExldmVsTGF5b3V0U2l6ZSgpO1xuXG4gICAgdGhpcy5wYXJzZVNlbGVjdGlvbigpO1xuICAgIHRoaXMucGFyc2VQcm9qZWN0aW9uKCk7XG4gICAgdGhpcy5wYXJzZURhdGEoKTsgLy8gKHBhdGhvcmRlcikgZGVwZW5kcyBvbiBtYXJrRGVmOyBzZWxlY3Rpb24gZmlsdGVycyBkZXBlbmQgb24gcGFyc2VkIHNlbGVjdGlvbnM7IGRlcGVuZHMgb24gcHJvamVjdGlvbiBiZWNhdXNlIHNvbWUgdHJhbnNmb3JtcyByZXF1aXJlIHRoZSBmaW5hbGl6ZWQgcHJvamVjdGlvbiBuYW1lLlxuICAgIHRoaXMucGFyc2VBeGlzQW5kSGVhZGVyKCk7IC8vIGRlcGVuZHMgb24gc2NhbGUgYW5kIGxheW91dCBzaXplXG4gICAgdGhpcy5wYXJzZUxlZ2VuZCgpOyAvLyBkZXBlbmRzIG9uIHNjYWxlLCBtYXJrRGVmXG4gICAgdGhpcy5wYXJzZU1hcmtHcm91cCgpOyAvLyBkZXBlbmRzIG9uIGRhdGEgbmFtZSwgc2NhbGUsIGxheW91dCBzaXplLCBheGlzR3JvdXAsIGFuZCBjaGlsZHJlbidzIHNjYWxlLCBheGlzLCBsZWdlbmQgYW5kIG1hcmsuXG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VEYXRhKCk6IHZvaWQ7XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlU2VsZWN0aW9uKCk6IHZvaWQ7XG5cblxuICBwdWJsaWMgcGFyc2VTY2FsZSgpIHtcbiAgICBwYXJzZVNjYWxlKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlUHJvamVjdGlvbigpIHtcbiAgICBwYXJzZVByb2plY3Rpb24odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VMYXlvdXRTaXplKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbmFtZSB0b3AtbGV2ZWwgc3BlYydzIHNpemUgdG8gYmUganVzdCB3aWR0aCAvIGhlaWdodCwgaWdub3JpbmcgbW9kZWwgbmFtZS5cbiAgICogVGhpcyBlc3NlbnRpYWxseSBtZXJnZXMgdGhlIHRvcC1sZXZlbCBzcGVjJ3Mgd2lkdGgvaGVpZ2h0IHNpZ25hbHMgd2l0aCB0aGUgd2lkdGgvaGVpZ2h0IHNpZ25hbHNcbiAgICogdG8gaGVscCB1cyByZWR1Y2UgcmVkdW5kYW50IHNpZ25hbHMgZGVjbGFyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIHJlbmFtZVRvcExldmVsTGF5b3V0U2l6ZSgpIHtcbiAgICBpZiAodGhpcy5nZXROYW1lKCd3aWR0aCcpICE9PSAnd2lkdGgnKSB7XG4gICAgICB0aGlzLnJlbmFtZUxheW91dFNpemUodGhpcy5nZXROYW1lKCd3aWR0aCcpLCAnd2lkdGgnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0TmFtZSgnaGVpZ2h0JykgIT09ICdoZWlnaHQnKSB7XG4gICAgICB0aGlzLnJlbmFtZUxheW91dFNpemUodGhpcy5nZXROYW1lKCdoZWlnaHQnKSwgJ2hlaWdodCcpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZU1hcmtHcm91cCgpOiB2b2lkO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZUF4aXNBbmRIZWFkZXIoKTogdm9pZDtcblxuICBwdWJsaWMgcGFyc2VMZWdlbmQoKSB7XG4gICAgcGFyc2VMZWdlbmQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBhbnlbXTtcbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBhbnlbXTtcblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW107XG5cbiAgcHVibGljIGFzc2VtYmxlR3JvdXBTdHlsZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd1bml0JyB8fCB0aGlzLnR5cGUgPT09ICdsYXllcicpIHtcbiAgICAgIHJldHVybiAnY2VsbCc7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaXplKCk6IFZnRW5jb2RlRW50cnkge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd1bml0JyB8fCB0aGlzLnR5cGUgPT09ICdsYXllcicpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dDtcblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW107XG5cbiAgcHVibGljIGFzc2VtYmxlSGVhZGVyTWFya3MoKTogVmdNYXJrR3JvdXBbXSB7XG4gICAgY29uc3Qge2xheW91dEhlYWRlcnN9ID0gdGhpcy5jb21wb25lbnQ7XG4gICAgbGV0IGhlYWRlck1hcmtzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgSEVBREVSX0NIQU5ORUxTKSB7XG4gICAgICBpZiAobGF5b3V0SGVhZGVyc1tjaGFubmVsXS50aXRsZSkge1xuICAgICAgICBoZWFkZXJNYXJrcy5wdXNoKGdldFRpdGxlR3JvdXAodGhpcywgY2hhbm5lbCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBIRUFERVJfQ0hBTk5FTFMpIHtcbiAgICAgIGhlYWRlck1hcmtzID0gaGVhZGVyTWFya3MuY29uY2F0KGdldEhlYWRlckdyb3Vwcyh0aGlzLCBjaGFubmVsKSk7XG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJNYXJrcztcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZU1hcmtzKCk6IFZnTWFya0dyb3VwW107IC8vIFRPRE86IFZnTWFya0dyb3VwW11cblxuICBwdWJsaWMgYXNzZW1ibGVBeGVzKCk6IFZnQXhpc1tdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVBeGVzKHRoaXMuY29tcG9uZW50LmF4ZXMsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxlZ2VuZHMoKTogVmdMZWdlbmRbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlTGVnZW5kcyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVByb2plY3Rpb25zKCk6IFZnUHJvamVjdGlvbltdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVQcm9qZWN0aW9ucyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRpdGxlKCk6IFZnVGl0bGUge1xuICAgIGNvbnN0IHRpdGxlOiBWZ1RpdGxlID0ge1xuICAgICAgLi4uZXh0cmFjdFRpdGxlQ29uZmlnKHRoaXMuY29uZmlnLnRpdGxlKS5ub25NYXJrLFxuICAgICAgLi4udGhpcy50aXRsZVxuICAgIH07XG5cbiAgICBpZiAodGl0bGUudGV4dCkge1xuICAgICAgaWYgKCFjb250YWlucyhbJ3VuaXQnLCAnbGF5ZXInXSwgdGhpcy50eXBlKSkge1xuICAgICAgICAvLyBBcyBkZXNjcmliZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yODc1OlxuICAgICAgICAvLyBEdWUgdG8gdmVnYS92ZWdhIzk2MCAoY29tbWVudCksIHdlIG9ubHkgc3VwcG9ydCB0aXRsZSdzIGFuY2hvciBmb3IgdW5pdCBhbmQgbGF5ZXJlZCBzcGVjIGZvciBub3cuXG5cbiAgICAgICAgaWYgKHRpdGxlLmFuY2hvciAmJiB0aXRsZS5hbmNob3IgIT09ICdzdGFydCcpIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RTZXRUaXRsZUFuY2hvcih0aGlzLnR5cGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aXRsZS5hbmNob3IgPSAnc3RhcnQnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5cyh0aXRsZSkubGVuZ3RoID4gMCA/IHRpdGxlIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VtYmxlIHRoZSBtYXJrIGdyb3VwIGZvciB0aGlzIG1vZGVsLiAgV2UgYWNjZXB0IG9wdGlvbmFsIGBzaWduYWxzYCBzbyB0aGF0IHdlIGNhbiBpbmNsdWRlIGNvbmNhdCB0b3AtbGV2ZWwgc2lnbmFscyB3aXRoIHRoZSB0b3AtbGV2ZWwgbW9kZWwncyBsb2NhbCBzaWduYWxzLlxuICAgKi9cbiAgcHVibGljIGFzc2VtYmxlR3JvdXAoc2lnbmFsczogVmdTaWduYWxbXSA9IFtdKSB7XG4gICAgY29uc3QgZ3JvdXA6IFZnTWFya0dyb3VwID0ge307XG5cbiAgICBzaWduYWxzID0gc2lnbmFscy5jb25jYXQodGhpcy5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKSk7XG5cbiAgICBpZiAoc2lnbmFscy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5zaWduYWxzID0gc2lnbmFscztcbiAgICB9XG5cbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmFzc2VtYmxlTGF5b3V0KCk7XG4gICAgaWYgKGxheW91dCkge1xuICAgICAgZ3JvdXAubGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cblxuICAgIGdyb3VwLm1hcmtzID0gW10uY29uY2F0KFxuICAgICAgdGhpcy5hc3NlbWJsZUhlYWRlck1hcmtzKCksXG4gICAgICB0aGlzLmFzc2VtYmxlTWFya3MoKVxuICAgICk7XG5cbiAgICAvLyBPbmx5IGluY2x1ZGUgc2NhbGVzIGlmIHRoaXMgc3BlYyBpcyB0b3AtbGV2ZWwgb3IgaWYgcGFyZW50IGlzIGZhY2V0LlxuICAgIC8vIChPdGhlcndpc2UsIGl0IHdpbGwgYmUgbWVyZ2VkIHdpdGggdXBwZXItbGV2ZWwncyBzY29wZS4pXG4gICAgY29uc3Qgc2NhbGVzID0gKCF0aGlzLnBhcmVudCB8fCBpc0ZhY2V0TW9kZWwodGhpcy5wYXJlbnQpKSA/IGFzc2VtYmxlU2NhbGVzKHRoaXMpIDogW107XG4gICAgaWYgKHNjYWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5zY2FsZXMgPSBzY2FsZXM7XG4gICAgfVxuXG4gICAgY29uc3QgYXhlcyA9IHRoaXMuYXNzZW1ibGVBeGVzKCk7XG4gICAgaWYgKGF4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAuYXhlcyA9IGF4ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgbGVnZW5kcyA9IHRoaXMuYXNzZW1ibGVMZWdlbmRzKCk7XG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAubGVnZW5kcyA9IGxlZ2VuZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgcHVibGljIGhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgaWYgKGlzVW5pdE1vZGVsKGNoaWxkKSkge1xuICAgICAgICBpZiAoY2hpbGQuY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjaGlsZC5oYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUodGV4dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhck5hbWUoKHRoaXMubmFtZSA/IHRoaXMubmFtZSArICdfJyA6ICcnKSArIHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYSBkYXRhIHNvdXJjZSBuYW1lIGZvciB0aGUgZ2l2ZW4gZGF0YSBzb3VyY2UgdHlwZSBhbmQgbWFyayB0aGF0IGRhdGEgc291cmNlIGFzIHJlcXVpcmVkLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGluIHBhcnNlLCBzbyB0aGF0IGFsbCB1c2VkIGRhdGEgc291cmNlIGNhbiBiZSBjb3JyZWN0bHkgaW5zdGFudGlhdGVkIGluIGFzc2VtYmxlRGF0YSgpLlxuICAgKi9cbiAgcHVibGljIHJlcXVlc3REYXRhTmFtZShuYW1lOiBEYXRhU291cmNlVHlwZSkge1xuICAgIGNvbnN0IGZ1bGxOYW1lID0gdGhpcy5nZXROYW1lKG5hbWUpO1xuXG4gICAgLy8gSW5jcmVhc2UgcmVmIGNvdW50LiBUaGlzIGlzIGNyaXRpY2FsIGJlY2F1c2Ugb3RoZXJ3aXNlIHdlIHdvbid0IGNyZWF0ZSBhIGRhdGEgc291cmNlLlxuICAgIC8vIFdlIGFsc28gaW5jcmVhc2UgdGhlIHJlZiBjb3VudHMgb24gT3V0cHV0Tm9kZS5nZXRTb3VyY2UoKSBjYWxscy5cbiAgICBjb25zdCByZWZDb3VudHMgPSB0aGlzLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHM7XG4gICAgcmVmQ291bnRzW2Z1bGxOYW1lXSA9IChyZWZDb3VudHNbZnVsbE5hbWVdIHx8IDApICsgMTtcblxuICAgIHJldHVybiBmdWxsTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlOiAnd2lkdGgnIHwgJ2hlaWdodCcpOiBWZ1NpZ25hbFJlZiB7XG4gICAgaWYgKGlzRmFjZXRNb2RlbCh0aGlzLnBhcmVudCkpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBzaXplVHlwZSA9PT0gJ3dpZHRoJyA/ICd4JyA6ICd5JztcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoc2NhbGVDb21wb25lbnQgJiYgIXNjYWxlQ29tcG9uZW50Lm1lcmdlZCkgeyAvLyBpbmRlcGVuZGVudCBzY2FsZVxuICAgICAgICBjb25zdCB0eXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gc2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICAgIGNvbnN0IHNjYWxlTmFtZSA9IHNjYWxlQ29tcG9uZW50LmdldCgnbmFtZScpO1xuICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMsIGNoYW5uZWwpO1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZFJlZiA9IHZnRmllbGQoe2FnZ3JlZ2F0ZTogJ2Rpc3RpbmN0JywgZmllbGR9LCB7ZXhwcjogJ2RhdHVtJ30pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc2lnbmFsOiBzaXplRXhwcihzY2FsZU5hbWUsIHNjYWxlQ29tcG9uZW50LCBmaWVsZFJlZilcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShzaXplVHlwZSkpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rdXAgdGhlIG5hbWUgb2YgdGhlIGRhdGFzb3VyY2UgZm9yIGFuIG91dHB1dCBub2RlLiBZb3UgcHJvYmFibHkgd2FudCB0byBjYWxsIHRoaXMgaW4gYXNzZW1ibGUuXG4gICAqL1xuICBwdWJsaWMgbG9va3VwRGF0YVNvdXJjZShuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5jb21wb25lbnQuZGF0YS5vdXRwdXROb2Rlc1tuYW1lXTtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgLy8gTmFtZSBub3QgZm91bmQgaW4gbWFwIHNvIGxldCdzIGp1c3QgcmV0dXJuIHdoYXQgd2UgZ290LlxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGUgY29ycmVjdCBuYW1lLlxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGUuZ2V0U291cmNlKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2l6ZU5hbWUob2xkU2l6ZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgIHJldHVybiB0aGlzLmxheW91dFNpemVOYW1lTWFwLmdldChvbGRTaXplTmFtZSk7XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lTGF5b3V0U2l6ZShvbGROYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZVNjYWxlKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zY2FsZU5hbWVNYXAucmVuYW1lKG9sZE5hbWUsIG5ld05hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZVByb2plY3Rpb24ob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnByb2plY3Rpb25OYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCBhZnRlciB0aGUgc2NhbGUgaGFzIGJlZW4gcGFyc2VkIGFuZCBuYW1lZC5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU5hbWUob3JpZ2luYWxTY2FsZU5hbWU6IENoYW5uZWwgfCBzdHJpbmcsIHBhcnNlPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICAvLyBEdXJpbmcgdGhlIHBhcnNlIHBoYXNlIGFsd2F5cyByZXR1cm4gYSB2YWx1ZVxuICAgICAgLy8gTm8gbmVlZCB0byByZWZlciB0byByZW5hbWUgbWFwIGJlY2F1c2UgYSBzY2FsZSBjYW4ndCBiZSByZW5hbWVkXG4gICAgICAvLyBiZWZvcmUgaXQgaGFzIHRoZSBvcmlnaW5hbCBuYW1lLlxuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIGl0IHNob3VsZCBlaXRoZXJcbiAgICAvLyBiZSBpbiB0aGUgc2NhbGUgY29tcG9uZW50IG9yIGV4aXN0IGluIHRoZSBuYW1lIG1hcFxuICAgIGlmIChcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIHRoZXJlIHNob3VsZCBiZSBhIGxvY2FsIHNjYWxlIGNvbXBvbmVudCBmb3IgaXRcbiAgICAgICAgKGlzQ2hhbm5lbChvcmlnaW5hbFNjYWxlTmFtZSkgJiYgaXNTY2FsZUNoYW5uZWwob3JpZ2luYWxTY2FsZU5hbWUpICYmIHRoaXMuY29tcG9uZW50LnNjYWxlc1tvcmlnaW5hbFNjYWxlTmFtZV0pIHx8XG4gICAgICAgIC8vIGluIHRoZSBzY2FsZSBuYW1lIG1hcCAodGhlIHRoZSBzY2FsZSBnZXQgbWVyZ2VkIGJ5IGl0cyBwYXJlbnQpXG4gICAgICAgIHRoaXMuc2NhbGVOYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUob3JpZ2luYWxTY2FsZU5hbWUpKVxuICAgICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2FsZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gcHJvamVjdGlvbiBuYW1lIGFmdGVyIHRoZSBwcm9qZWN0aW9uIGhhcyBiZWVuIHBhcnNlZCBhbmQgbmFtZWQuXG4gICAqL1xuICBwdWJsaWMgcHJvamVjdGlvbk5hbWUocGFyc2U/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBpZiAocGFyc2UpIHtcbiAgICAgIC8vIER1cmluZyB0aGUgcGFyc2UgcGhhc2UgYWx3YXlzIHJldHVybiBhIHZhbHVlXG4gICAgICAvLyBObyBuZWVkIHRvIHJlZmVyIHRvIHJlbmFtZSBtYXAgYmVjYXVzZSBhIHByb2plY3Rpb24gY2FuJ3QgYmUgcmVuYW1lZFxuICAgICAgLy8gYmVmb3JlIGl0IGhhcyB0aGUgb3JpZ2luYWwgbmFtZS5cbiAgICAgIHJldHVybiB0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMuY29tcG9uZW50LnByb2plY3Rpb24gJiYgIXRoaXMuY29tcG9uZW50LnByb2plY3Rpb24ubWVyZ2VkKSB8fCB0aGlzLnByb2plY3Rpb25OYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2plY3Rpb25OYW1lTWFwLmdldCh0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIGRhdGEgcmVmZXJlbmNlcyBpbiBtYXJrcyBhZnRlciBhc3NlbWJsZS5cbiAgICovXG4gIHB1YmxpYyBjb3JyZWN0RGF0YU5hbWVzID0gKG1hcms6IFZnTWFya0dyb3VwKSA9PiB7XG4gICAgLy8gVE9ETzogbWFrZSB0aGlzIGNvcnJlY3RcblxuICAgIC8vIGZvciBub3JtYWwgZGF0YSByZWZlcmVuY2VzXG4gICAgaWYgKG1hcmsuZnJvbSAmJiBtYXJrLmZyb20uZGF0YSkge1xuICAgICAgbWFyay5mcm9tLmRhdGEgPSB0aGlzLmxvb2t1cERhdGFTb3VyY2UobWFyay5mcm9tLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIGZvciBhY2Nlc3MgdG8gZmFjZXQgZGF0YVxuICAgIGlmIChtYXJrLmZyb20gJiYgbWFyay5mcm9tLmZhY2V0ICYmIG1hcmsuZnJvbS5mYWNldC5kYXRhKSB7XG4gICAgICBtYXJrLmZyb20uZmFjZXQuZGF0YSA9IHRoaXMubG9va3VwRGF0YVNvdXJjZShtYXJrLmZyb20uZmFjZXQuZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcms7XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2UgYSBtb2RlbCdzIGhpZXJhcmNoeSB0byBnZXQgdGhlIHNjYWxlIGNvbXBvbmVudCBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWwuXG4gICAqL1xuICBwdWJsaWMgZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbDogU2NhbGVDaGFubmVsKTogU2NhbGVDb21wb25lbnQge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBUaGlzIGlzIHdhcm5pbmcgZm9yIGRlYnVnZ2luZyB0ZXN0ICovXG4gICAgaWYgKCF0aGlzLmNvbXBvbmVudC5zY2FsZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0U2NhbGVDb21wb25lbnQgY2Fubm90IGJlIGNhbGxlZCBiZWZvcmUgcGFyc2VTY2FsZSgpLiAgTWFrZSBzdXJlIHlvdSBoYXZlIGNhbGxlZCBwYXJzZVNjYWxlIG9yIHVzZSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSgpLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgaWYgKGxvY2FsU2NhbGVDb21wb25lbnQgJiYgIWxvY2FsU2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICByZXR1cm4gbG9jYWxTY2FsZUNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpIDogdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZSBhIG1vZGVsJ3MgaGllcmFyY2h5IHRvIGdldCBhIHBhcnRpY3VsYXIgc2VsZWN0aW9uIGNvbXBvbmVudC5cbiAgICovXG4gIHB1YmxpYyBnZXRTZWxlY3Rpb25Db21wb25lbnQodmFyaWFibGVOYW1lOiBzdHJpbmcsIG9yaWdOYW1lOiBzdHJpbmcpOiBTZWxlY3Rpb25Db21wb25lbnQge1xuICAgIGxldCBzZWwgPSB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb25bdmFyaWFibGVOYW1lXTtcbiAgICBpZiAoIXNlbCAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgc2VsID0gdGhpcy5wYXJlbnQuZ2V0U2VsZWN0aW9uQ29tcG9uZW50KHZhcmlhYmxlTmFtZSwgb3JpZ05hbWUpO1xuICAgIH1cbiAgICBpZiAoIXNlbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLnNlbGVjdGlvbk5vdEZvdW5kKG9yaWdOYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiBzZWw7XG4gIH1cbn1cblxuLyoqIEFic3RyYWN0IGNsYXNzIGZvciBVbml0TW9kZWwgYW5kIEZhY2V0TW9kZWwuICBCb3RoIG9mIHdoaWNoIGNhbiBjb250YWluIGZpZWxkRGVmcyBhcyBhIHBhcnQgb2YgaXRzIG93biBzcGVjaWZpY2F0aW9uLiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsV2l0aEZpZWxkIGV4dGVuZHMgTW9kZWwge1xuICBwdWJsaWMgYWJzdHJhY3QgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz47XG5cbiAgLyoqIEdldCBcImZpZWxkXCIgcmVmZXJlbmNlIGZvciB2ZWdhICovXG4gIHB1YmxpYyB2Z0ZpZWxkKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwsIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSkge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcblxuICAgIGlmICghZmllbGREZWYpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZnRmllbGQoZmllbGREZWYsIG9wdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0TWFwcGluZygpOiB7W2tleSBpbiBDaGFubmVsXT86IGFueX07XG5cbiAgcHVibGljIHJlZHVjZUZpZWxkRGVmPFQsIFU+KGY6IChhY2M6IFUsIGZkOiBGaWVsZERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiBVLCBpbml0OiBULCB0PzogYW55KSB7XG4gICAgcmV0dXJuIHJlZHVjZSh0aGlzLmdldE1hcHBpbmcoKSwgKGFjYzpVICwgY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgcmV0dXJuIGYoYWNjLCBmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGluaXQsIHQpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2hGaWVsZERlZihmOiAoZmQ6IEZpZWxkRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IHZvaWQsIHQ/OiBhbnkpIHtcbiAgICBmb3JFYWNoKHRoaXMuZ2V0TWFwcGluZygpLCAoY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgZihmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgfSwgdCk7XG4gIH1cbiAgcHVibGljIGFic3RyYWN0IGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbjtcbn1cbiJdfQ==