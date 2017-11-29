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
var title_1 = require("../title");
var transform_1 = require("../transform");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var assemble_1 = require("./axis/assemble");
var header_1 = require("./layout/header");
var assemble_2 = require("./layoutsize/assemble");
var assemble_3 = require("./legend/assemble");
var parse_1 = require("./legend/parse");
var assemble_4 = require("./scale/assemble");
var domain_1 = require("./scale/domain");
var parse_2 = require("./scale/parse");
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
        this.layoutSizeNameMap = parent ? parent.layoutSizeNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = transform_1.normalizeTransform(spec.transform || []);
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : {},
                outputNodes: parent ? parent.component.data.outputNodes : {},
                outputNodeRefCounts: parent ? parent.component.data.outputNodeRefCounts : {},
                ancestorParse: parent ? __assign({}, parent.component.data.ancestorParse) : {}
            },
            layoutSize: new split_1.Split(),
            layoutHeaders: { row: {}, column: {} },
            mark: null,
            resolve: __assign({ scale: {}, axis: {}, legend: {} }, (resolve || {})),
            selection: null,
            scales: null,
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
        this.parseData(); // (pathorder) depends on markDef; selection filters depend on parsed selections.
        this.parseAxisAndHeader(); // depends on scale and layout size
        this.parseLegend(); // depends on scale, markDef
        this.parseMarkGroup(); // depends on data name, scale, layout size, axisGroup, and children's scale, axis, legend and mark.
    };
    Model.prototype.parseScale = function () {
        parse_2.parseScale(this);
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
            var layoutHeader = layoutHeaders[channel];
            for (var _b = 0, HEADER_TYPES_1 = header_1.HEADER_TYPES; _b < HEADER_TYPES_1.length; _b++) {
                var headerType = HEADER_TYPES_1[_b];
                if (layoutHeader[headerType]) {
                    for (var _c = 0, _d = layoutHeader[headerType]; _c < _d.length; _c++) {
                        var header = _d[_c];
                        var headerGroup = header_1.getHeaderGroup(this, channel, headerType, layoutHeader, header);
                        if (headerGroup) {
                            headerMarks.push(headerGroup);
                        }
                    }
                }
            }
        }
        return headerMarks;
    };
    Model.prototype.assembleAxes = function () {
        return assemble_1.assembleAxes(this.component.axes);
    };
    Model.prototype.assembleLegends = function () {
        return assemble_3.assembleLegends(this);
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
        var scales = (!this.parent || isFacetModel(this.parent)) ? assemble_4.assembleScales(this) : [];
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
                    var fieldName = domain_1.getFieldFromDomain(domain);
                    if (fieldName) {
                        var fieldRef = fielddef_1.field({ aggregate: 'distinct', field: fieldName }, { expr: 'datum' });
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
    Model.prototype.getSelectionComponent = function (varName, origName) {
        var sel = this.component.selection[varName];
        if (!sel && this.parent) {
            sel = this.parent.getSelectionComponent(varName, origName);
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
    ModelWithField.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (!fieldDef) {
            return undefined;
        }
        return fielddef_1.field(fieldDef, opt);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUVuQyxzQ0FBOEY7QUFHOUYsd0NBQTRDO0FBQzVDLHdDQUFxRjtBQUNyRiw0QkFBOEI7QUFFOUIsa0NBQTJDO0FBRTNDLGtDQUF5RDtBQUN6RCwwQ0FBMkQ7QUFDM0QsZ0NBQXNEO0FBQ3RELDhDQVd3QjtBQUN4Qiw0Q0FBNkM7QUFNN0MsMENBQW9IO0FBQ3BILGtEQUErQztBQUUvQyw4Q0FBa0Q7QUFFbEQsd0NBQTJDO0FBRTNDLDZDQUFnRDtBQUVoRCx5Q0FBa0U7QUFDbEUsdUNBQXlDO0FBRXpDLGlDQUE4QjtBQXdDOUI7SUFHRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3QkFBTSxHQUFiLFVBQWMsT0FBZSxFQUFFLE9BQWU7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbEMsQ0FBQztJQUdNLHFCQUFHLEdBQVYsVUFBVyxJQUFZO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUMxQyxDQUFDO0lBRU0scUJBQUcsR0FBVixVQUFXLElBQVk7UUFDckIscUVBQXFFO1FBQ3JFLDZFQUE2RTtRQUM3RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN6RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxB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ZXNDb250ZW50IjpbImltcG9ydCB7aXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbmltcG9ydCB7Q2hhbm5lbCwgaXNDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbCwgU2NhbGVDaGFubmVsLCBTaW5nbGVEZWZDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtEYXRhLCBEYXRhU291cmNlVHlwZX0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQge2ZvckVhY2gsIHJlZHVjZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBmaWVsZCwgRmllbGREZWYsIEZpZWxkUmVmT3B0aW9uLCBnZXRGaWVsZERlZn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge1Jlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtCYXNlU3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2V4dHJhY3RUaXRsZUNvbmZpZywgVGl0bGVQYXJhbXN9IGZyb20gJy4uL3RpdGxlJztcbmltcG9ydCB7bm9ybWFsaXplVHJhbnNmb3JtLCBUcmFuc2Zvcm19IGZyb20gJy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2NvbnRhaW5zLCBEaWN0LCBrZXlzLCB2YXJOYW1lfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7XG4gIGlzVmdSYW5nZVN0ZXAsXG4gIFZnQXhpcyxcbiAgVmdEYXRhLFxuICBWZ0VuY29kZUVudHJ5LFxuICBWZ0xheW91dCxcbiAgVmdMZWdlbmQsXG4gIFZnTWFya0dyb3VwLFxuICBWZ1NpZ25hbCxcbiAgVmdTaWduYWxSZWYsXG4gIFZnVGl0bGUsXG59IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YXNzZW1ibGVBeGVzfSBmcm9tICcuL2F4aXMvYXNzZW1ibGUnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb25jYXRNb2RlbH0gZnJvbSAnLi9jb25jYXQnO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuL2RhdGEvaW5kZXgnO1xuaW1wb3J0IHtGYWNldE1vZGVsfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi9sYXllcic7XG5pbXBvcnQge2dldEhlYWRlckdyb3VwLCBnZXRUaXRsZUdyb3VwLCBIRUFERVJfQ0hBTk5FTFMsIEhFQURFUl9UWVBFUywgTGF5b3V0SGVhZGVyQ29tcG9uZW50fSBmcm9tICcuL2xheW91dC9oZWFkZXInO1xuaW1wb3J0IHtzaXplRXhwcn0gZnJvbSAnLi9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCB7TGF5b3V0U2l6ZUNvbXBvbmVudCwgTGF5b3V0U2l6ZUluZGV4fSBmcm9tICcuL2xheW91dHNpemUvY29tcG9uZW50JztcbmltcG9ydCB7YXNzZW1ibGVMZWdlbmRzfSBmcm9tICcuL2xlZ2VuZC9hc3NlbWJsZSc7XG5pbXBvcnQge0xlZ2VuZENvbXBvbmVudEluZGV4fSBmcm9tICcuL2xlZ2VuZC9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZUxlZ2VuZH0gZnJvbSAnLi9sZWdlbmQvcGFyc2UnO1xuaW1wb3J0IHtSZXBlYXRNb2RlbH0gZnJvbSAnLi9yZXBlYXQnO1xuaW1wb3J0IHthc3NlbWJsZVNjYWxlc30gZnJvbSAnLi9zY2FsZS9hc3NlbWJsZSc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4fSBmcm9tICcuL3NjYWxlL2NvbXBvbmVudCc7XG5pbXBvcnQge2Fzc2VtYmxlRG9tYWluLCBnZXRGaWVsZEZyb21Eb21haW59IGZyb20gJy4vc2NhbGUvZG9tYWluJztcbmltcG9ydCB7cGFyc2VTY2FsZX0gZnJvbSAnLi9zY2FsZS9wYXJzZSc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7U3BsaXR9IGZyb20gJy4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vdW5pdCc7XG5cblxuLyoqXG4gKiBDb21wb3NhYmxlIENvbXBvbmVudHMgdGhhdCBhcmUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIHBhcnNpbmcgcGhhc2Ugb2YgdGhlXG4gKiBjb21waWxhdGlvbnMuICBUaGUgY29tcG9uZW50cyByZXByZXNlbnRzIHBhcnRzIG9mIHRoZSBzcGVjaWZpY2F0aW9uIGluIGEgZm9ybSB0aGF0XG4gKiBjYW4gYmUgZWFzaWx5IG1lcmdlZCAoZHVyaW5nIHBhcnNpbmcgZm9yIGNvbXBvc2l0ZSBzcGVjcykuXG4gKiBJbiBhZGRpdGlvbiwgdGhlc2UgY29tcG9uZW50cyBhcmUgZWFzaWx5IHRyYW5zZm9ybWVkIGludG8gVmVnYSBzcGVjaWZpY2F0aW9uc1xuICogZHVyaW5nIHRoZSBcImFzc2VtYmxlXCIgcGhhc2UsIHdoaWNoIGlzIHRoZSBsYXN0IHBoYXNlIG9mIHRoZSBjb21waWxhdGlvbiBzdGVwLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudCB7XG4gIGRhdGE6IERhdGFDb21wb25lbnQ7XG5cbiAgbGF5b3V0U2l6ZTogTGF5b3V0U2l6ZUNvbXBvbmVudDtcblxuICBsYXlvdXRIZWFkZXJzOiB7XG4gICAgcm93PzogTGF5b3V0SGVhZGVyQ29tcG9uZW50LFxuICAgIGNvbHVtbj86IExheW91dEhlYWRlckNvbXBvbmVudFxuICB9O1xuXG4gIG1hcms6IFZnTWFya0dyb3VwW107XG4gIHNjYWxlczogU2NhbGVDb21wb25lbnRJbmRleDtcbiAgc2VsZWN0aW9uOiBEaWN0PFNlbGVjdGlvbkNvbXBvbmVudD47XG5cbiAgLyoqIERpY3Rpb25hcnkgbWFwcGluZyBjaGFubmVsIHRvIFZnQXhpcyBkZWZpbml0aW9uICovXG4gIGF4ZXM6IEF4aXNDb21wb25lbnRJbmRleDtcblxuICAvKiogRGljdGlvbmFyeSBtYXBwaW5nIGNoYW5uZWwgdG8gVmdMZWdlbmQgZGVmaW5pdGlvbiAqL1xuICBsZWdlbmRzOiBMZWdlbmRDb21wb25lbnRJbmRleDtcblxuICByZXNvbHZlOiBSZXNvbHZlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVNYXBJbnRlcmZhY2Uge1xuICByZW5hbWUob2xkbmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICBoYXMobmFtZTogc3RyaW5nKTogYm9vbGVhbjtcbiAgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVNYXAgaW1wbGVtZW50cyBOYW1lTWFwSW50ZXJmYWNlIHtcbiAgcHJpdmF0ZSBuYW1lTWFwOiBEaWN0PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lTWFwID0ge307XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lTWFwW29sZE5hbWVdID0gbmV3TmFtZTtcbiAgfVxuXG5cbiAgcHVibGljIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lTWFwW25hbWVdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gSWYgdGhlIG5hbWUgYXBwZWFycyBpbiB0aGUgX25hbWVNYXAsIHdlIG5lZWQgdG8gcmVhZCBpdHMgbmV3IG5hbWUuXG4gICAgLy8gV2UgaGF2ZSB0byBsb29wIG92ZXIgdGhlIGRpY3QganVzdCBpbiBjYXNlIHRoZSBuZXcgbmFtZSBhbHNvIGdldHMgcmVuYW1lZC5cbiAgICB3aGlsZSAodGhpcy5uYW1lTWFwW25hbWVdICYmIG5hbWUgIT09IHRoaXMubmFtZU1hcFtuYW1lXSkge1xuICAgICAgbmFtZSA9IHRoaXMubmFtZU1hcFtuYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuXG4vKlxuICBXZSB1c2UgdHlwZSBndWFyZHMgaW5zdGVhZCBvZiBgaW5zdGFuY2VvZmAgYXMgYGluc3RhbmNlb2ZgIG1ha2VzXG4gIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIgZGVwZW5kIG9uIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2ZcbiAgdGhlIG1vZGVsIGNsYXNzZXMsIHdoaWNoIGluIHR1cm4gZGVwZW5kIG9uIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgY29tcGlsZXIuXG4gIFRodXMsIGBpbnN0YW5jZW9mYCBsZWFkcyB0byBjaXJjdWxhciBkZXBlbmRlbmN5IHByb2JsZW1zLlxuXG4gIE9uIHRoZSBvdGhlciBoYW5kLCB0eXBlIGd1YXJkcyBvbmx5IG1ha2UgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlclxuICBkZXBlbmQgb24gdGhlIHR5cGUgb2YgdGhlIG1vZGVsIGNsYXNzZXMsIGJ1dCBub3QgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VuaXRNb2RlbChtb2RlbDogTW9kZWwpOiBtb2RlbCBpcyBVbml0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3VuaXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYWNldE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIEZhY2V0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2ZhY2V0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgUmVwZWF0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ3JlcGVhdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNhdE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIENvbmNhdE1vZGVsIHtcbiAgcmV0dXJuIG1vZGVsICYmIG1vZGVsLnR5cGUgPT09ICdjb25jYXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNMYXllck1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIExheWVyTW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2xheWVyJztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsIHtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgdHlwZTogJ3VuaXQnIHwgJ2ZhY2V0JyB8ICdsYXllcicgfCAnY29uY2F0JyB8ICdyZXBlYXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50OiBNb2RlbDtcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgdGl0bGU6IFRpdGxlUGFyYW1zO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb246IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZGF0YTogRGF0YTtcbiAgcHVibGljIHJlYWRvbmx5IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2NhbGVzLCB3aGljaCBjYW4gYmUgcmVuYW1lZCBieSBhIG1vZGVsJ3MgcGFyZW50LiAqL1xuICBwcm90ZWN0ZWQgc2NhbGVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2l6ZSwgd2hpY2ggY2FuIGJlIHJlbmFtZWQgYnkgYSBtb2RlbCdzIHBhcmVudC4gKi9cbiAgcHJvdGVjdGVkIGxheW91dFNpemVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuXG4gIHB1YmxpYyByZWFkb25seSBjb21wb25lbnQ6IENvbXBvbmVudDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBCYXNlU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnLCByZXNvbHZlOiBSZXNvbHZlKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAvLyBJZiBuYW1lIGlzIG5vdCBwcm92aWRlZCwgYWx3YXlzIHVzZSBwYXJlbnQncyBnaXZlbk5hbWUgdG8gYXZvaWQgbmFtZSBjb25mbGljdHMuXG4gICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lIHx8IHBhcmVudEdpdmVuTmFtZTtcbiAgICB0aGlzLnRpdGxlID0gaXNTdHJpbmcoc3BlYy50aXRsZSkgPyB7dGV4dDogc3BlYy50aXRsZX0gOiBzcGVjLnRpdGxlO1xuXG4gICAgLy8gU2hhcmVkIG5hbWUgbWFwc1xuICAgIHRoaXMuc2NhbGVOYW1lTWFwID0gcGFyZW50ID8gcGFyZW50LnNjYWxlTmFtZU1hcCA6IG5ldyBOYW1lTWFwKCk7XG4gICAgdGhpcy5sYXlvdXRTaXplTmFtZU1hcCA9IHBhcmVudCA/IHBhcmVudC5sYXlvdXRTaXplTmFtZU1hcCA6IG5ldyBOYW1lTWFwKCk7XG5cbiAgICB0aGlzLmRhdGEgPSBzcGVjLmRhdGE7XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gc3BlYy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRyYW5zZm9ybXMgPSBub3JtYWxpemVUcmFuc2Zvcm0oc3BlYy50cmFuc2Zvcm0gfHwgW10pO1xuXG4gICAgdGhpcy5jb21wb25lbnQgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHNvdXJjZXM6IHBhcmVudCA/IHBhcmVudC5jb21wb25lbnQuZGF0YS5zb3VyY2VzIDoge30sXG4gICAgICAgIG91dHB1dE5vZGVzOiBwYXJlbnQgPyBwYXJlbnQuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXMgOiB7fSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50czogcGFyZW50ID8gcGFyZW50LmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHMgOiB7fSxcbiAgICAgICAgYW5jZXN0b3JQYXJzZTogcGFyZW50ID8gey4uLnBhcmVudC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlfSA6IHt9XG4gICAgICB9LFxuICAgICAgbGF5b3V0U2l6ZTogbmV3IFNwbGl0PExheW91dFNpemVJbmRleD4oKSxcbiAgICAgIGxheW91dEhlYWRlcnM6e3Jvdzoge30sIGNvbHVtbjoge319LFxuICAgICAgbWFyazogbnVsbCxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgc2NhbGU6IHt9LCBheGlzOiB7fSwgbGVnZW5kOiB7fSxcbiAgICAgICAgLi4uKHJlc29sdmUgfHwge30pXG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uOiBudWxsLFxuICAgICAgc2NhbGVzOiBudWxsLFxuICAgICAgYXhlczoge30sXG4gICAgICBsZWdlbmRzOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldCB3aWR0aCgpOiBWZ1NpZ25hbFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKTtcbiAgfVxuXG5cbiAgcHVibGljIGdldCBoZWlnaHQoKTogVmdTaWduYWxSZWYge1xuICAgIHJldHVybiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRTaXplKHNpemU6IExheW91dFNpemVJbmRleCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHNpemU7XG4gICAgaWYgKHdpZHRoKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5sYXlvdXRTaXplLnNldCgnd2lkdGgnLCB3aWR0aCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGhlaWdodCkge1xuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0U2l6ZS5zZXQoJ2hlaWdodCcsIGhlaWdodCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlKCkge1xuICAgIHRoaXMucGFyc2VTY2FsZSgpO1xuXG4gICAgdGhpcy5wYXJzZUxheW91dFNpemUoKTsgLy8gZGVwZW5kcyBvbiBzY2FsZVxuICAgIHRoaXMucmVuYW1lVG9wTGV2ZWxMYXlvdXRTaXplKCk7XG5cbiAgICB0aGlzLnBhcnNlU2VsZWN0aW9uKCk7XG4gICAgdGhpcy5wYXJzZURhdGEoKTsgLy8gKHBhdGhvcmRlcikgZGVwZW5kcyBvbiBtYXJrRGVmOyBzZWxlY3Rpb24gZmlsdGVycyBkZXBlbmQgb24gcGFyc2VkIHNlbGVjdGlvbnMuXG4gICAgdGhpcy5wYXJzZUF4aXNBbmRIZWFkZXIoKTsgLy8gZGVwZW5kcyBvbiBzY2FsZSBhbmQgbGF5b3V0IHNpemVcbiAgICB0aGlzLnBhcnNlTGVnZW5kKCk7IC8vIGRlcGVuZHMgb24gc2NhbGUsIG1hcmtEZWZcbiAgICB0aGlzLnBhcnNlTWFya0dyb3VwKCk7IC8vIGRlcGVuZHMgb24gZGF0YSBuYW1lLCBzY2FsZSwgbGF5b3V0IHNpemUsIGF4aXNHcm91cCwgYW5kIGNoaWxkcmVuJ3Mgc2NhbGUsIGF4aXMsIGxlZ2VuZCBhbmQgbWFyay5cbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZURhdGEoKTogdm9pZDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VTZWxlY3Rpb24oKTogdm9pZDtcblxuXG4gIHB1YmxpYyBwYXJzZVNjYWxlKCkge1xuICAgIHBhcnNlU2NhbGUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VMYXlvdXRTaXplKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbmFtZSB0b3AtbGV2ZWwgc3BlYydzIHNpemUgdG8gYmUganVzdCB3aWR0aCAvIGhlaWdodCwgaWdub3JpbmcgbW9kZWwgbmFtZS5cbiAgICogVGhpcyBlc3NlbnRpYWxseSBtZXJnZXMgdGhlIHRvcC1sZXZlbCBzcGVjJ3Mgd2lkdGgvaGVpZ2h0IHNpZ25hbHMgd2l0aCB0aGUgd2lkdGgvaGVpZ2h0IHNpZ25hbHNcbiAgICogdG8gaGVscCB1cyByZWR1Y2UgcmVkdW5kYW50IHNpZ25hbHMgZGVjbGFyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIHJlbmFtZVRvcExldmVsTGF5b3V0U2l6ZSgpIHtcbiAgICBpZiAodGhpcy5nZXROYW1lKCd3aWR0aCcpICE9PSAnd2lkdGgnKSB7XG4gICAgICB0aGlzLnJlbmFtZUxheW91dFNpemUodGhpcy5nZXROYW1lKCd3aWR0aCcpLCAnd2lkdGgnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0TmFtZSgnaGVpZ2h0JykgIT09ICdoZWlnaHQnKSB7XG4gICAgICB0aGlzLnJlbmFtZUxheW91dFNpemUodGhpcy5nZXROYW1lKCdoZWlnaHQnKSwgJ2hlaWdodCcpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZU1hcmtHcm91cCgpOiB2b2lkO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZUF4aXNBbmRIZWFkZXIoKTogdm9pZDtcblxuICBwdWJsaWMgcGFyc2VMZWdlbmQoKSB7XG4gICAgcGFyc2VMZWdlbmQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBhbnlbXTtcbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBhbnlbXTtcblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW107XG5cbiAgcHVibGljIGFzc2VtYmxlR3JvdXBTdHlsZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd1bml0JyB8fCB0aGlzLnR5cGUgPT09ICdsYXllcicpIHtcbiAgICAgIHJldHVybiAnY2VsbCc7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaXplKCk6IFZnRW5jb2RlRW50cnkge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd1bml0JyB8fCB0aGlzLnR5cGUgPT09ICdsYXllcicpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dDtcblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW107XG5cbiAgcHVibGljIGFzc2VtYmxlSGVhZGVyTWFya3MoKTogVmdNYXJrR3JvdXBbXSB7XG4gICAgY29uc3Qge2xheW91dEhlYWRlcnN9ID0gdGhpcy5jb21wb25lbnQ7XG4gICAgY29uc3QgaGVhZGVyTWFya3MgPSBbXTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBIRUFERVJfQ0hBTk5FTFMpIHtcbiAgICAgIGlmIChsYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlKSB7XG4gICAgICAgIGhlYWRlck1hcmtzLnB1c2goZ2V0VGl0bGVHcm91cCh0aGlzLCBjaGFubmVsKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIEhFQURFUl9DSEFOTkVMUykge1xuICAgICAgY29uc3QgbGF5b3V0SGVhZGVyID0gbGF5b3V0SGVhZGVyc1tjaGFubmVsXTtcbiAgICAgIGZvciAoY29uc3QgaGVhZGVyVHlwZSBvZiBIRUFERVJfVFlQRVMpIHtcbiAgICAgICAgaWYgKGxheW91dEhlYWRlcltoZWFkZXJUeXBlXSkge1xuICAgICAgICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIGxheW91dEhlYWRlcltoZWFkZXJUeXBlXSkge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyR3JvdXAgPSBnZXRIZWFkZXJHcm91cCh0aGlzLCBjaGFubmVsLCBoZWFkZXJUeXBlLCBsYXlvdXRIZWFkZXIsIGhlYWRlcik7XG4gICAgICAgICAgICBpZiAoaGVhZGVyR3JvdXApIHtcbiAgICAgICAgICAgICAgaGVhZGVyTWFya3MucHVzaChoZWFkZXJHcm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJNYXJrcztcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZU1hcmtzKCk6IFZnTWFya0dyb3VwW107IC8vIFRPRE86IFZnTWFya0dyb3VwW11cblxuICBwdWJsaWMgYXNzZW1ibGVBeGVzKCk6IFZnQXhpc1tdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVBeGVzKHRoaXMuY29tcG9uZW50LmF4ZXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGVnZW5kcygpOiBWZ0xlZ2VuZFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVMZWdlbmRzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlVGl0bGUoKTogVmdUaXRsZSB7XG4gICAgY29uc3QgdGl0bGU6IFZnVGl0bGUgPSB7XG4gICAgICAuLi5leHRyYWN0VGl0bGVDb25maWcodGhpcy5jb25maWcudGl0bGUpLm5vbk1hcmssXG4gICAgICAuLi50aGlzLnRpdGxlXG4gICAgfTtcblxuICAgIGlmICh0aXRsZS50ZXh0KSB7XG4gICAgICBpZiAoIWNvbnRhaW5zKFsndW5pdCcsICdsYXllciddLCB0aGlzLnR5cGUpKSB7XG4gICAgICAgIC8vIEFzIGRlc2NyaWJlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI4NzU6XG4gICAgICAgIC8vIER1ZSB0byB2ZWdhL3ZlZ2EjOTYwIChjb21tZW50KSwgd2Ugb25seSBzdXBwb3J0IHRpdGxlJ3MgYW5jaG9yIGZvciB1bml0IGFuZCBsYXllcmVkIHNwZWMgZm9yIG5vdy5cblxuICAgICAgICBpZiAodGl0bGUuYW5jaG9yICYmIHRpdGxlLmFuY2hvciAhPT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdFNldFRpdGxlQW5jaG9yKHRoaXMudHlwZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRpdGxlLmFuY2hvciA9ICdzdGFydCc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXlzKHRpdGxlKS5sZW5ndGggPiAwID8gdGl0bGUgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQXNzZW1ibGUgdGhlIG1hcmsgZ3JvdXAgZm9yIHRoaXMgbW9kZWwuICBXZSBhY2NlcHQgb3B0aW9uYWwgYHNpZ25hbHNgIHNvIHRoYXQgd2UgY2FuIGluY2x1ZGUgY29uY2F0IHRvcC1sZXZlbCBzaWduYWxzIHdpdGggdGhlIHRvcC1sZXZlbCBtb2RlbCdzIGxvY2FsIHNpZ25hbHMuXG4gICAqL1xuICBwdWJsaWMgYXNzZW1ibGVHcm91cChzaWduYWxzOiBWZ1NpZ25hbFtdID0gW10pIHtcbiAgICBjb25zdCBncm91cDogVmdNYXJrR3JvdXAgPSB7fTtcblxuICAgIHNpZ25hbHMgPSBzaWduYWxzLmNvbmNhdCh0aGlzLmFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpKTtcblxuICAgIGlmIChzaWduYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLnNpZ25hbHMgPSBzaWduYWxzO1xuICAgIH1cblxuICAgIGNvbnN0IGxheW91dCA9IHRoaXMuYXNzZW1ibGVMYXlvdXQoKTtcbiAgICBpZiAobGF5b3V0KSB7XG4gICAgICBncm91cC5sYXlvdXQgPSBsYXlvdXQ7XG4gICAgfVxuXG4gICAgZ3JvdXAubWFya3MgPSBbXS5jb25jYXQoXG4gICAgICB0aGlzLmFzc2VtYmxlSGVhZGVyTWFya3MoKSxcbiAgICAgIHRoaXMuYXNzZW1ibGVNYXJrcygpXG4gICAgKTtcblxuICAgIC8vIE9ubHkgaW5jbHVkZSBzY2FsZXMgaWYgdGhpcyBzcGVjIGlzIHRvcC1sZXZlbCBvciBpZiBwYXJlbnQgaXMgZmFjZXQuXG4gICAgLy8gKE90aGVyd2lzZSwgaXQgd2lsbCBiZSBtZXJnZWQgd2l0aCB1cHBlci1sZXZlbCdzIHNjb3BlLilcbiAgICBjb25zdCBzY2FsZXMgPSAoIXRoaXMucGFyZW50IHx8IGlzRmFjZXRNb2RlbCh0aGlzLnBhcmVudCkpID8gYXNzZW1ibGVTY2FsZXModGhpcykgOiBbXTtcbiAgICBpZiAoc2NhbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLnNjYWxlcyA9IHNjYWxlcztcbiAgICB9XG5cbiAgICBjb25zdCBheGVzID0gdGhpcy5hc3NlbWJsZUF4ZXMoKTtcbiAgICBpZiAoYXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5heGVzID0gYXhlcztcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRzID0gdGhpcy5hc3NlbWJsZUxlZ2VuZHMoKTtcbiAgICBpZiAobGVnZW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICBncm91cC5sZWdlbmRzID0gbGVnZW5kcztcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JvdXA7XG4gIH1cblxuICBwdWJsaWMgaGFzRGVzY2VuZGFudFdpdGhGaWVsZE9uQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoaXNVbml0TW9kZWwoY2hpbGQpKSB7XG4gICAgICAgIGlmIChjaGlsZC5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNoaWxkLmhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoY2hhbm5lbCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdmFyTmFtZSgodGhpcy5uYW1lID8gdGhpcy5uYW1lICsgJ18nIDogJycpICsgdGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBhIGRhdGEgc291cmNlIG5hbWUgZm9yIHRoZSBnaXZlbiBkYXRhIHNvdXJjZSB0eXBlIGFuZCBtYXJrIHRoYXQgZGF0YSBzb3VyY2UgYXMgcmVxdWlyZWQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgaW4gcGFyc2UsIHNvIHRoYXQgYWxsIHVzZWQgZGF0YSBzb3VyY2UgY2FuIGJlIGNvcnJlY3RseSBpbnN0YW50aWF0ZWQgaW4gYXNzZW1ibGVEYXRhKCkuXG4gICAqL1xuICBwdWJsaWMgcmVxdWVzdERhdGFOYW1lKG5hbWU6IERhdGFTb3VyY2VUeXBlKSB7XG4gICAgY29uc3QgZnVsbE5hbWUgPSB0aGlzLmdldE5hbWUobmFtZSk7XG5cbiAgICAvLyBJbmNyZWFzZSByZWYgY291bnQuIFRoaXMgaXMgY3JpdGljYWwgYmVjYXVzZSBvdGhlcndpc2Ugd2Ugd29uJ3QgY3JlYXRlIGEgZGF0YSBzb3VyY2UuXG4gICAgLy8gV2UgYWxzbyBpbmNyZWFzZSB0aGUgcmVmIGNvdW50cyBvbiBPdXRwdXROb2RlLmdldFNvdXJjZSgpIGNhbGxzLlxuICAgIGNvbnN0IHJlZkNvdW50cyA9IHRoaXMuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZVJlZkNvdW50cztcbiAgICByZWZDb3VudHNbZnVsbE5hbWVdID0gKHJlZkNvdW50c1tmdWxsTmFtZV0gfHwgMCkgKyAxO1xuXG4gICAgcmV0dXJuIGZ1bGxOYW1lO1xuICB9XG5cbiAgcHVibGljIGdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGU6ICd3aWR0aCcgfCAnaGVpZ2h0Jyk6IFZnU2lnbmFsUmVmIHtcbiAgICBpZiAoaXNGYWNldE1vZGVsKHRoaXMucGFyZW50KSkge1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHNpemVUeXBlID09PSAnd2lkdGgnID8gJ3gnIDogJ3knO1xuICAgICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG5cbiAgICAgIGlmIChzY2FsZUNvbXBvbmVudCAmJiAhc2NhbGVDb21wb25lbnQubWVyZ2VkKSB7IC8vIGluZGVwZW5kZW50IHNjYWxlXG4gICAgICAgIGNvbnN0IHR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgICAgY29uc3Qgc2NhbGVOYW1lID0gc2NhbGVDb21wb25lbnQuZ2V0KCduYW1lJyk7XG4gICAgICAgICAgY29uc3QgZG9tYWluID0gYXNzZW1ibGVEb21haW4odGhpcywgY2hhbm5lbCk7XG4gICAgICAgICAgY29uc3QgZmllbGROYW1lID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgaWYgKGZpZWxkTmFtZSkge1xuICAgICAgICAgICAgY29uc3QgZmllbGRSZWYgPSBmaWVsZCh7YWdncmVnYXRlOiAnZGlzdGluY3QnLCBmaWVsZDogZmllbGROYW1lfSwge2V4cHI6ICdkYXR1bSd9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNpZ25hbDogc2l6ZUV4cHIoc2NhbGVOYW1lLCBzY2FsZUNvbXBvbmVudCwgZmllbGRSZWYpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2cud2FybignVW5rbm93biBmaWVsZCBmb3IgJHtjaGFubmVsfS4gIENhbm5vdCBjYWxjdWxhdGUgdmlldyBzaXplLicpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiB0aGlzLmxheW91dFNpemVOYW1lTWFwLmdldCh0aGlzLmdldE5hbWUoc2l6ZVR5cGUpKVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIHRoZSBuYW1lIG9mIHRoZSBkYXRhc291cmNlIGZvciBhbiBvdXRwdXQgbm9kZS4gWW91IHByb2JhYmx5IHdhbnQgdG8gY2FsbCB0aGlzIGluIGFzc2VtYmxlLlxuICAgKi9cbiAgcHVibGljIGxvb2t1cERhdGFTb3VyY2UobmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXNbbmFtZV07XG5cbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIC8vIE5hbWUgbm90IGZvdW5kIGluIG1hcCBzbyBsZXQncyBqdXN0IHJldHVybiB3aGF0IHdlIGdvdC5cbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhlIGNvcnJlY3QgbmFtZS5cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlLmdldFNvdXJjZSgpO1xuICB9XG5cbiAgcHVibGljIGdldFNpemVOYW1lKG9sZFNpemVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICByZXR1cm4gdGhpcy5sYXlvdXRTaXplTmFtZU1hcC5nZXQob2xkU2l6ZU5hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZUxheW91dFNpemUob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxheW91dFNpemVOYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWVTY2FsZShvbGROYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2NhbGVOYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCBhZnRlciB0aGUgc2NhbGUgaGFzIGJlZW4gcGFyc2VkIGFuZCBuYW1lZC5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU5hbWUob3JpZ2luYWxTY2FsZU5hbWU6IENoYW5uZWwgfCBzdHJpbmcsIHBhcnNlPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICAvLyBEdXJpbmcgdGhlIHBhcnNlIHBoYXNlIGFsd2F5cyByZXR1cm4gYSB2YWx1ZVxuICAgICAgLy8gTm8gbmVlZCB0byByZWZlciB0byByZW5hbWUgbWFwIGJlY2F1c2UgYSBzY2FsZSBjYW4ndCBiZSByZW5hbWVkXG4gICAgICAvLyBiZWZvcmUgaXQgaGFzIHRoZSBvcmlnaW5hbCBuYW1lLlxuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIGl0IHNob3VsZCBlaXRoZXJcbiAgICAvLyBiZSBpbiB0aGUgc2NhbGUgY29tcG9uZW50IG9yIGV4aXN0IGluIHRoZSBuYW1lIG1hcFxuICAgIGlmIChcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBzY2FsZSBmb3IgdGhlIGNoYW5uZWwsIHRoZXJlIHNob3VsZCBiZSBhIGxvY2FsIHNjYWxlIGNvbXBvbmVudCBmb3IgaXRcbiAgICAgICAgKGlzQ2hhbm5lbChvcmlnaW5hbFNjYWxlTmFtZSkgJiYgaXNTY2FsZUNoYW5uZWwob3JpZ2luYWxTY2FsZU5hbWUpICYmIHRoaXMuY29tcG9uZW50LnNjYWxlc1tvcmlnaW5hbFNjYWxlTmFtZV0pIHx8XG4gICAgICAgIC8vIGluIHRoZSBzY2FsZSBuYW1lIG1hcCAodGhlIHRoZSBzY2FsZSBnZXQgbWVyZ2VkIGJ5IGl0cyBwYXJlbnQpXG4gICAgICAgIHRoaXMuc2NhbGVOYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUob3JpZ2luYWxTY2FsZU5hbWUpKVxuICAgICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2FsZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcnJlY3RzIHRoZSBkYXRhIHJlZmVyZW5jZXMgaW4gbWFya3MgYWZ0ZXIgYXNzZW1ibGUuXG4gICAqL1xuICBwdWJsaWMgY29ycmVjdERhdGFOYW1lcyA9IChtYXJrOiBWZ01hcmtHcm91cCkgPT4ge1xuICAgIC8vIFRPRE86IG1ha2UgdGhpcyBjb3JyZWN0XG5cbiAgICAvLyBmb3Igbm9ybWFsIGRhdGEgcmVmZXJlbmNlc1xuICAgIGlmIChtYXJrLmZyb20gJiYgbWFyay5mcm9tLmRhdGEpIHtcbiAgICAgIG1hcmsuZnJvbS5kYXRhID0gdGhpcy5sb29rdXBEYXRhU291cmNlKG1hcmsuZnJvbS5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyBmb3IgYWNjZXNzIHRvIGZhY2V0IGRhdGFcbiAgICBpZiAobWFyay5mcm9tICYmIG1hcmsuZnJvbS5mYWNldCAmJiBtYXJrLmZyb20uZmFjZXQuZGF0YSkge1xuICAgICAgbWFyay5mcm9tLmZhY2V0LmRhdGEgPSB0aGlzLmxvb2t1cERhdGFTb3VyY2UobWFyay5mcm9tLmZhY2V0LmRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlIGEgbW9kZWwncyBoaWVyYXJjaHkgdG8gZ2V0IHRoZSBzY2FsZSBjb21wb25lbnQgZm9yIGEgcGFydGljdWxhciBjaGFubmVsLlxuICAgKi9cbiAgcHVibGljIGdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IFNjYWxlQ29tcG9uZW50IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogVGhpcyBpcyB3YXJuaW5nIGZvciBkZWJ1Z2dpbmcgdGVzdCAqL1xuICAgIGlmICghdGhpcy5jb21wb25lbnQuc2NhbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNjYWxlQ29tcG9uZW50IGNhbm5vdCBiZSBjYWxsZWQgYmVmb3JlIHBhcnNlU2NhbGUoKS4gIE1ha2Ugc3VyZSB5b3UgaGF2ZSBjYWxsZWQgcGFyc2VTY2FsZSBvciB1c2UgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoKS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgIGlmIChsb2NhbFNjYWxlQ29tcG9uZW50ICYmICFsb2NhbFNjYWxlQ29tcG9uZW50Lm1lcmdlZCkge1xuICAgICAgcmV0dXJuIGxvY2FsU2NhbGVDb21wb25lbnQ7XG4gICAgfVxuICAgIHJldHVybiAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSA6IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2UgYSBtb2RlbCdzIGhpZXJhcmNoeSB0byBnZXQgYSBwYXJ0aWN1bGFyIHNlbGVjdGlvbiBjb21wb25lbnQuXG4gICAqL1xuICBwdWJsaWMgZ2V0U2VsZWN0aW9uQ29tcG9uZW50KHZhck5hbWU6IHN0cmluZywgb3JpZ05hbWU6IHN0cmluZyk6IFNlbGVjdGlvbkNvbXBvbmVudCB7XG4gICAgbGV0IHNlbCA9IHRoaXMuY29tcG9uZW50LnNlbGVjdGlvblt2YXJOYW1lXTtcbiAgICBpZiAoIXNlbCAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgc2VsID0gdGhpcy5wYXJlbnQuZ2V0U2VsZWN0aW9uQ29tcG9uZW50KHZhck5hbWUsIG9yaWdOYW1lKTtcbiAgICB9XG4gICAgaWYgKCFzZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5zZWxlY3Rpb25Ob3RGb3VuZChvcmlnTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsO1xuICB9XG59XG5cbi8qKiBBYnN0cmFjdCBjbGFzcyBmb3IgVW5pdE1vZGVsIGFuZCBGYWNldE1vZGVsLiAgQm90aCBvZiB3aGljaCBjYW4gY29udGFpbiBmaWVsZERlZnMgYXMgYSBwYXJ0IG9mIGl0cyBvd24gc3BlY2lmaWNhdGlvbi4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNb2RlbFdpdGhGaWVsZCBleHRlbmRzIE1vZGVsIHtcbiAgcHVibGljIGFic3RyYWN0IGZpZWxkRGVmKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwpOiBGaWVsZERlZjxzdHJpbmc+O1xuXG4gIC8qKiBHZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYSAqL1xuICBwdWJsaWMgZmllbGQoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KSB7XG4gICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gICAgaWYgKCFmaWVsZERlZikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGQoZmllbGREZWYsIG9wdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0TWFwcGluZygpOiB7W2tleSBpbiBDaGFubmVsXT86IGFueX07XG5cbiAgcHVibGljIHJlZHVjZUZpZWxkRGVmPFQsIFU+KGY6IChhY2M6IFUsIGZkOiBGaWVsZERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiBVLCBpbml0OiBULCB0PzogYW55KSB7XG4gICAgcmV0dXJuIHJlZHVjZSh0aGlzLmdldE1hcHBpbmcoKSwgKGFjYzpVICwgY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgcmV0dXJuIGYoYWNjLCBmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGluaXQsIHQpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2hGaWVsZERlZihmOiAoZmQ6IEZpZWxkRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IHZvaWQsIHQ/OiBhbnkpIHtcbiAgICBmb3JFYWNoKHRoaXMuZ2V0TWFwcGluZygpLCAoY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgZihmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgfSwgdCk7XG4gIH1cbiAgcHVibGljIGFic3RyYWN0IGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbjtcbn1cbiJdfQ==