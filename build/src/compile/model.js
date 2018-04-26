"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
                ancestorParse: parent ? tslib_1.__assign({}, parent.component.data.ancestorParse) : {},
                // data is faceted if the spec is a facet spec or the parent has faceted data and no data is defined
                isFaceted: spec_1.isFacetSpec(spec) || (parent && parent.component.data.isFaceted && !spec.data)
            },
            layoutSize: new split_1.Split(),
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
        var title = tslib_1.__assign({}, title_1.extractTitleConfig(this.config.title).nonMark, this.title);
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
            if (scaleComponent && !scaleComponent.merged) { // independent scale
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
exports.Model = Model;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBbUM7QUFFbkMsc0NBQThGO0FBRzlGLHdDQUE0QztBQUM1Qyx3Q0FBdUY7QUFDdkYsNEJBQThCO0FBRTlCLGtDQUEyQztBQUMzQyxnQ0FBOEM7QUFDOUMsa0NBQXlEO0FBQ3pELDBDQUEyRDtBQUMzRCxnQ0FBc0Q7QUFDdEQsOENBV3dCO0FBRXhCLDRDQUE2QztBQU03QywwQ0FBdUc7QUFDdkcsa0RBQStDO0FBRS9DLDhDQUFrRDtBQUVsRCx3Q0FBMkM7QUFDM0Msa0RBQTBEO0FBRTFELDRDQUFtRDtBQUduRCw2Q0FBZ0Q7QUFFaEQseUNBQWtFO0FBQ2xFLHVDQUF5QztBQUV6QyxpQ0FBOEI7QUF5QzlCO0lBR0U7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sd0JBQU0sR0FBYixVQUFjLE9BQWUsRUFBRSxPQUFlO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2xDLENBQUM7SUFHTSxxQkFBRyxHQUFWLFVBQVcsSUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDO0lBQzFDLENBQUM7SUFFTSxxQkFBRyxHQUFWLFVBQVcsSUFBWTtRQUNyQixxRUFBcUU7UUFDckUsNkVBQTZFO1FBQzdFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFD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QjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFTSx3Q0FBZSxHQUF0QixVQUF1QixDQUE2QyxFQUFFLENBQU87UUFDM0Usa0JBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsVUFBQyxFQUFzQixFQUFFLENBQVU7WUFDNUQsSUFBTSxRQUFRLEdBQUcsc0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQyxJQUFJLFFBQVEsRUFBRTtnQkFDWixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO1FBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVILHFCQUFDO0FBQUQsQ0FBQyxBQW5DRCxDQUE2QyxLQUFLLEdBbUNqRDtBQW5DcUIsd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge0NoYW5uZWwsIGlzQ2hhbm5lbCwgaXNTY2FsZUNoYW5uZWwsIFNjYWxlQ2hhbm5lbCwgU2luZ2xlRGVmQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RGF0YSwgRGF0YVNvdXJjZVR5cGV9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHtmb3JFYWNoLCByZWR1Y2V9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgRmllbGREZWYsIEZpZWxkUmVmT3B0aW9uLCBnZXRGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge1Jlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtCYXNlU3BlYywgaXNGYWNldFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtleHRyYWN0VGl0bGVDb25maWcsIFRpdGxlUGFyYW1zfSBmcm9tICcuLi90aXRsZSc7XG5pbXBvcnQge25vcm1hbGl6ZVRyYW5zZm9ybSwgVHJhbnNmb3JtfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtjb250YWlucywgRGljdCwga2V5cywgdmFyTmFtZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1xuICBpc1ZnUmFuZ2VTdGVwLFxuICBWZ0F4aXMsXG4gIFZnRGF0YSxcbiAgVmdFbmNvZGVFbnRyeSxcbiAgVmdMYXlvdXQsXG4gIFZnTGVnZW5kLFxuICBWZ01hcmtHcm91cCxcbiAgVmdTaWduYWwsXG4gIFZnU2lnbmFsUmVmLFxuICBWZ1RpdGxlLFxufSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1ZnUHJvamVjdGlvbn0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHthc3NlbWJsZUF4ZXN9IGZyb20gJy4vYXhpcy9hc3NlbWJsZSc7XG5pbXBvcnQge0F4aXNDb21wb25lbnRJbmRleH0gZnJvbSAnLi9heGlzL2NvbXBvbmVudCc7XG5pbXBvcnQge0NvbmNhdE1vZGVsfSBmcm9tICcuL2NvbmNhdCc7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vZGF0YSc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtMYXllck1vZGVsfSBmcm9tICcuL2xheWVyJztcbmltcG9ydCB7Z2V0SGVhZGVyR3JvdXBzLCBnZXRUaXRsZUdyb3VwLCBIRUFERVJfQ0hBTk5FTFMsIExheW91dEhlYWRlckNvbXBvbmVudH0gZnJvbSAnLi9sYXlvdXQvaGVhZGVyJztcbmltcG9ydCB7c2l6ZUV4cHJ9IGZyb20gJy4vbGF5b3V0c2l6ZS9hc3NlbWJsZSc7XG5pbXBvcnQge0xheW91dFNpemVDb21wb25lbnQsIExheW91dFNpemVJbmRleH0gZnJvbSAnLi9sYXlvdXRzaXplL2NvbXBvbmVudCc7XG5pbXBvcnQge2Fzc2VtYmxlTGVnZW5kc30gZnJvbSAnLi9sZWdlbmQvYXNzZW1ibGUnO1xuaW1wb3J0IHtMZWdlbmRDb21wb25lbnRJbmRleH0gZnJvbSAnLi9sZWdlbmQvY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VMZWdlbmR9IGZyb20gJy4vbGVnZW5kL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVQcm9qZWN0aW9uc30gZnJvbSAnLi9wcm9qZWN0aW9uL2Fzc2VtYmxlJztcbmltcG9ydCB7UHJvamVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9wcm9qZWN0aW9uL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlUHJvamVjdGlvbn0gZnJvbSAnLi9wcm9qZWN0aW9uL3BhcnNlJztcbmltcG9ydCB7UmVwZWF0TW9kZWx9IGZyb20gJy4vcmVwZWF0JztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZX0gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge2Fzc2VtYmxlU2NhbGVzfSBmcm9tICcuL3NjYWxlL2Fzc2VtYmxlJztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vc2NhbGUvY29tcG9uZW50JztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi9zY2FsZS9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlfSBmcm9tICcuL3NjYWxlL3BhcnNlJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTcGxpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG4vKipcbiAqIENvbXBvc2FibGUgQ29tcG9uZW50cyB0aGF0IGFyZSBpbnRlcm1lZGlhdGUgcmVzdWx0cyBvZiB0aGUgcGFyc2luZyBwaGFzZSBvZiB0aGVcbiAqIGNvbXBpbGF0aW9ucy4gIFRoZSBjb21wb25lbnRzIHJlcHJlc2VudHMgcGFydHMgb2YgdGhlIHNwZWNpZmljYXRpb24gaW4gYSBmb3JtIHRoYXRcbiAqIGNhbiBiZSBlYXNpbHkgbWVyZ2VkIChkdXJpbmcgcGFyc2luZyBmb3IgY29tcG9zaXRlIHNwZWNzKS5cbiAqIEluIGFkZGl0aW9uLCB0aGVzZSBjb21wb25lbnRzIGFyZSBlYXNpbHkgdHJhbnNmb3JtZWQgaW50byBWZWdhIHNwZWNpZmljYXRpb25zXG4gKiBkdXJpbmcgdGhlIFwiYXNzZW1ibGVcIiBwaGFzZSwgd2hpY2ggaXMgdGhlIGxhc3QgcGhhc2Ugb2YgdGhlIGNvbXBpbGF0aW9uIHN0ZXAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50IHtcbiAgZGF0YTogRGF0YUNvbXBvbmVudDtcblxuICBsYXlvdXRTaXplOiBMYXlvdXRTaXplQ29tcG9uZW50O1xuXG4gIGxheW91dEhlYWRlcnM6IHtcbiAgICByb3c/OiBMYXlvdXRIZWFkZXJDb21wb25lbnQsXG4gICAgY29sdW1uPzogTGF5b3V0SGVhZGVyQ29tcG9uZW50XG4gIH07XG5cbiAgbWFyazogVmdNYXJrR3JvdXBbXTtcbiAgc2NhbGVzOiBTY2FsZUNvbXBvbmVudEluZGV4O1xuICBwcm9qZWN0aW9uOiBQcm9qZWN0aW9uQ29tcG9uZW50O1xuICBzZWxlY3Rpb246IERpY3Q8U2VsZWN0aW9uQ29tcG9uZW50PjtcblxuICAvKiogRGljdGlvbmFyeSBtYXBwaW5nIGNoYW5uZWwgdG8gVmdBeGlzIGRlZmluaXRpb24gKi9cbiAgYXhlczogQXhpc0NvbXBvbmVudEluZGV4O1xuXG4gIC8qKiBEaWN0aW9uYXJ5IG1hcHBpbmcgY2hhbm5lbCB0byBWZ0xlZ2VuZCBkZWZpbml0aW9uICovXG4gIGxlZ2VuZHM6IExlZ2VuZENvbXBvbmVudEluZGV4O1xuXG4gIHJlc29sdmU6IFJlc29sdmU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmFtZU1hcEludGVyZmFjZSB7XG4gIHJlbmFtZShvbGRuYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHZvaWQ7XG4gIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuO1xuICBnZXQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTmFtZU1hcCBpbXBsZW1lbnRzIE5hbWVNYXBJbnRlcmZhY2Uge1xuICBwcml2YXRlIG5hbWVNYXA6IERpY3Q8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVNYXAgPSB7fTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWUob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5hbWVNYXBbb2xkTmFtZV0gPSBuZXdOYW1lO1xuICB9XG5cblxuICBwdWJsaWMgaGFzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5hbWVNYXBbbmFtZV0gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBJZiB0aGUgbmFtZSBhcHBlYXJzIGluIHRoZSBfbmFtZU1hcCwgd2UgbmVlZCB0byByZWFkIGl0cyBuZXcgbmFtZS5cbiAgICAvLyBXZSBoYXZlIHRvIGxvb3Agb3ZlciB0aGUgZGljdCBqdXN0IGluIGNhc2UgdGhlIG5ldyBuYW1lIGFsc28gZ2V0cyByZW5hbWVkLlxuICAgIHdoaWxlICh0aGlzLm5hbWVNYXBbbmFtZV0gJiYgbmFtZSAhPT0gdGhpcy5uYW1lTWFwW25hbWVdKSB7XG4gICAgICBuYW1lID0gdGhpcy5uYW1lTWFwW25hbWVdO1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lO1xuICB9XG59XG5cbi8qXG4gIFdlIHVzZSB0eXBlIGd1YXJkcyBpbnN0ZWFkIG9mIGBpbnN0YW5jZW9mYCBhcyBgaW5zdGFuY2VvZmAgbWFrZXNcbiAgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlciBkZXBlbmQgb24gdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZlxuICB0aGUgbW9kZWwgY2xhc3Nlcywgd2hpY2ggaW4gdHVybiBkZXBlbmQgb24gZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBjb21waWxlci5cbiAgVGh1cywgYGluc3RhbmNlb2ZgIGxlYWRzIHRvIGNpcmN1bGFyIGRlcGVuZGVuY3kgcHJvYmxlbXMuXG5cbiAgT24gdGhlIG90aGVyIGhhbmQsIHR5cGUgZ3VhcmRzIG9ubHkgbWFrZSBkaWZmZXJlbnQgcGFydHMgb2YgdGhlIGNvbXBpbGVyXG4gIGRlcGVuZCBvbiB0aGUgdHlwZSBvZiB0aGUgbW9kZWwgY2xhc3NlcywgYnV0IG5vdCB0aGUgYWN0dWFsIGltcGxlbWVudGF0aW9uLlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5pdE1vZGVsKG1vZGVsOiBNb2RlbCk6IG1vZGVsIGlzIFVuaXRNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAndW5pdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZhY2V0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgRmFjZXRNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAnZmFjZXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBlYXRNb2RlbChtb2RlbDogTW9kZWwpOiBtb2RlbCBpcyBSZXBlYXRNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAncmVwZWF0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uY2F0TW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgQ29uY2F0TW9kZWwge1xuICByZXR1cm4gbW9kZWwgJiYgbW9kZWwudHlwZSA9PT0gJ2NvbmNhdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xheWVyTW9kZWwobW9kZWw6IE1vZGVsKTogbW9kZWwgaXMgTGF5ZXJNb2RlbCB7XG4gIHJldHVybiBtb2RlbCAmJiBtb2RlbC50eXBlID09PSAnbGF5ZXInO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9kZWwge1xuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB0eXBlOiAndW5pdCcgfCAnZmFjZXQnIHwgJ2xheWVyJyB8ICdjb25jYXQnIHwgJ3JlcGVhdCc7XG4gIHB1YmxpYyByZWFkb25seSBwYXJlbnQ6IE1vZGVsO1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSB0aXRsZTogVGl0bGVQYXJhbXM7XG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBkYXRhOiBEYXRhO1xuICBwdWJsaWMgcmVhZG9ubHkgdHJhbnNmb3JtczogVHJhbnNmb3JtW107XG5cbiAgLyoqIE5hbWUgbWFwIGZvciBzY2FsZXMsIHdoaWNoIGNhbiBiZSByZW5hbWVkIGJ5IGEgbW9kZWwncyBwYXJlbnQuICovXG4gIHByb3RlY3RlZCBzY2FsZU5hbWVNYXA6IE5hbWVNYXBJbnRlcmZhY2U7XG5cbiAgLyoqIE5hbWUgbWFwIGZvciBwcm9qZWN0aW9ucywgd2hpY2ggY2FuIGJlIHJlbmFtZWQgYnkgYSBtb2RlbCdzIHBhcmVudC4gKi9cbiAgcHJvdGVjdGVkIHByb2plY3Rpb25OYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIC8qKiBOYW1lIG1hcCBmb3Igc2l6ZSwgd2hpY2ggY2FuIGJlIHJlbmFtZWQgYnkgYSBtb2RlbCdzIHBhcmVudC4gKi9cbiAgcHJvdGVjdGVkIGxheW91dFNpemVOYW1lTWFwOiBOYW1lTWFwSW50ZXJmYWNlO1xuXG4gIHB1YmxpYyByZWFkb25seSByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgY29uZmlnOiBDb25maWc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbXBvbmVudDogQ29tcG9uZW50O1xuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjaGlsZHJlbjogTW9kZWxbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IEJhc2VTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZywgY29uZmlnOiBDb25maWcsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCByZXNvbHZlOiBSZXNvbHZlKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5yZXBlYXRlciA9IHJlcGVhdGVyO1xuXG4gICAgLy8gSWYgbmFtZSBpcyBub3QgcHJvdmlkZWQsIGFsd2F5cyB1c2UgcGFyZW50J3MgZ2l2ZW5OYW1lIHRvIGF2b2lkIG5hbWUgY29uZmxpY3RzLlxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZSB8fCBwYXJlbnRHaXZlbk5hbWU7XG4gICAgdGhpcy50aXRsZSA9IGlzU3RyaW5nKHNwZWMudGl0bGUpID8ge3RleHQ6IHNwZWMudGl0bGV9IDogc3BlYy50aXRsZTtcblxuICAgIC8vIFNoYXJlZCBuYW1lIG1hcHNcbiAgICB0aGlzLnNjYWxlTmFtZU1hcCA9IHBhcmVudCA/IHBhcmVudC5zY2FsZU5hbWVNYXAgOiBuZXcgTmFtZU1hcCgpO1xuICAgIHRoaXMucHJvamVjdGlvbk5hbWVNYXAgPSBwYXJlbnQgPyBwYXJlbnQucHJvamVjdGlvbk5hbWVNYXAgOiBuZXcgTmFtZU1hcCgpO1xuICAgIHRoaXMubGF5b3V0U2l6ZU5hbWVNYXAgPSBwYXJlbnQgPyBwYXJlbnQubGF5b3V0U2l6ZU5hbWVNYXAgOiBuZXcgTmFtZU1hcCgpO1xuXG4gICAgdGhpcy5kYXRhID0gc3BlYy5kYXRhO1xuXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHNwZWMuZGVzY3JpcHRpb247XG4gICAgdGhpcy50cmFuc2Zvcm1zID0gbm9ybWFsaXplVHJhbnNmb3JtKHNwZWMudHJhbnNmb3JtIHx8IFtdKTtcblxuICAgIHRoaXMuY29tcG9uZW50ID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICBzb3VyY2VzOiBwYXJlbnQgPyBwYXJlbnQuY29tcG9uZW50LmRhdGEuc291cmNlcyA6IHt9LFxuICAgICAgICBvdXRwdXROb2RlczogcGFyZW50ID8gcGFyZW50LmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVzIDoge30sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHM6IHBhcmVudCA/IHBhcmVudC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlUmVmQ291bnRzIDoge30sXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHBhcmVudCA/IHsuLi5wYXJlbnQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZX0gOiB7fSxcbiAgICAgICAgLy8gZGF0YSBpcyBmYWNldGVkIGlmIHRoZSBzcGVjIGlzIGEgZmFjZXQgc3BlYyBvciB0aGUgcGFyZW50IGhhcyBmYWNldGVkIGRhdGEgYW5kIG5vIGRhdGEgaXMgZGVmaW5lZFxuICAgICAgICBpc0ZhY2V0ZWQ6IGlzRmFjZXRTcGVjKHNwZWMpIHx8IChwYXJlbnQgJiYgcGFyZW50LmNvbXBvbmVudC5kYXRhLmlzRmFjZXRlZCAmJiAhc3BlYy5kYXRhKVxuICAgICAgfSxcbiAgICAgIGxheW91dFNpemU6IG5ldyBTcGxpdDxMYXlvdXRTaXplSW5kZXg+KCksXG4gICAgICBsYXlvdXRIZWFkZXJzOntyb3c6IHt9LCBjb2x1bW46IHt9fSxcbiAgICAgIG1hcms6IG51bGwsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHNjYWxlOiB7fSwgYXhpczoge30sIGxlZ2VuZDoge30sXG4gICAgICAgIC4uLihyZXNvbHZlIHx8IHt9KVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGlvbjogbnVsbCxcbiAgICAgIHNjYWxlczogbnVsbCxcbiAgICAgIHByb2plY3Rpb246IG51bGwsXG4gICAgICBheGVzOiB7fSxcbiAgICAgIGxlZ2VuZHM6IHt9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0IHdpZHRoKCk6IFZnU2lnbmFsUmVmIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpO1xuICB9XG5cblxuICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBWZ1NpZ25hbFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0Jyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdFNpemUoc2l6ZTogTGF5b3V0U2l6ZUluZGV4KSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gc2l6ZTtcbiAgICBpZiAod2lkdGgpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50LmxheW91dFNpemUuc2V0KCd3aWR0aCcsIHdpZHRoLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5sYXlvdXRTaXplLnNldCgnaGVpZ2h0JywgaGVpZ2h0LCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2UoKSB7XG4gICAgdGhpcy5wYXJzZVNjYWxlKCk7XG5cbiAgICB0aGlzLnBhcnNlTGF5b3V0U2l6ZSgpOyAvLyBkZXBlbmRzIG9uIHNjYWxlXG4gICAgdGhpcy5yZW5hbWVUb3BMZXZlbExheW91dFNpemUoKTtcblxuICAgIHRoaXMucGFyc2VTZWxlY3Rpb24oKTtcbiAgICB0aGlzLnBhcnNlUHJvamVjdGlvbigpO1xuICAgIHRoaXMucGFyc2VEYXRhKCk7IC8vIChwYXRob3JkZXIpIGRlcGVuZHMgb24gbWFya0RlZjsgc2VsZWN0aW9uIGZpbHRlcnMgZGVwZW5kIG9uIHBhcnNlZCBzZWxlY3Rpb25zOyBkZXBlbmRzIG9uIHByb2plY3Rpb24gYmVjYXVzZSBzb21lIHRyYW5zZm9ybXMgcmVxdWlyZSB0aGUgZmluYWxpemVkIHByb2plY3Rpb24gbmFtZS5cbiAgICB0aGlzLnBhcnNlQXhpc0FuZEhlYWRlcigpOyAvLyBkZXBlbmRzIG9uIHNjYWxlIGFuZCBsYXlvdXQgc2l6ZVxuICAgIHRoaXMucGFyc2VMZWdlbmQoKTsgLy8gZGVwZW5kcyBvbiBzY2FsZSwgbWFya0RlZlxuICAgIHRoaXMucGFyc2VNYXJrR3JvdXAoKTsgLy8gZGVwZW5kcyBvbiBkYXRhIG5hbWUsIHNjYWxlLCBsYXlvdXQgc2l6ZSwgYXhpc0dyb3VwLCBhbmQgY2hpbGRyZW4ncyBzY2FsZSwgYXhpcywgbGVnZW5kIGFuZCBtYXJrLlxuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlRGF0YSgpOiB2b2lkO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBwYXJzZVNlbGVjdGlvbigpOiB2b2lkO1xuXG5cbiAgcHVibGljIHBhcnNlU2NhbGUoKSB7XG4gICAgcGFyc2VTY2FsZSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVByb2plY3Rpb24oKSB7XG4gICAgcGFyc2VQcm9qZWN0aW9uKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHBhcnNlTGF5b3V0U2l6ZSgpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW5hbWUgdG9wLWxldmVsIHNwZWMncyBzaXplIHRvIGJlIGp1c3Qgd2lkdGggLyBoZWlnaHQsIGlnbm9yaW5nIG1vZGVsIG5hbWUuXG4gICAqIFRoaXMgZXNzZW50aWFsbHkgbWVyZ2VzIHRoZSB0b3AtbGV2ZWwgc3BlYydzIHdpZHRoL2hlaWdodCBzaWduYWxzIHdpdGggdGhlIHdpZHRoL2hlaWdodCBzaWduYWxzXG4gICAqIHRvIGhlbHAgdXMgcmVkdWNlIHJlZHVuZGFudCBzaWduYWxzIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5hbWVUb3BMZXZlbExheW91dFNpemUoKSB7XG4gICAgaWYgKHRoaXMuZ2V0TmFtZSgnd2lkdGgnKSAhPT0gJ3dpZHRoJykge1xuICAgICAgdGhpcy5yZW5hbWVMYXlvdXRTaXplKHRoaXMuZ2V0TmFtZSgnd2lkdGgnKSwgJ3dpZHRoJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmdldE5hbWUoJ2hlaWdodCcpICE9PSAnaGVpZ2h0Jykge1xuICAgICAgdGhpcy5yZW5hbWVMYXlvdXRTaXplKHRoaXMuZ2V0TmFtZSgnaGVpZ2h0JyksICdoZWlnaHQnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VNYXJrR3JvdXAoKTogdm9pZDtcblxuICBwdWJsaWMgYWJzdHJhY3QgcGFyc2VBeGlzQW5kSGVhZGVyKCk6IHZvaWQ7XG5cbiAgcHVibGljIHBhcnNlTGVnZW5kKCkge1xuICAgIHBhcnNlTGVnZW5kKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogYW55W107XG4gIHB1YmxpYyBhYnN0cmFjdCBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogYW55W107XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdO1xuXG4gIHB1YmxpYyBhc3NlbWJsZUdyb3VwU3R5bGUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy50eXBlID09PSAndW5pdCcgfHwgdGhpcy50eXBlID09PSAnbGF5ZXInKSB7XG4gICAgICByZXR1cm4gJ2NlbGwnO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2l6ZSgpOiBWZ0VuY29kZUVudHJ5IHtcbiAgICBpZiAodGhpcy50eXBlID09PSAndW5pdCcgfHwgdGhpcy50eXBlID09PSAnbGF5ZXInKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JylcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQ7XG5cbiAgcHVibGljIGFic3RyYWN0IGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdO1xuXG4gIHB1YmxpYyBhc3NlbWJsZUhlYWRlck1hcmtzKCk6IFZnTWFya0dyb3VwW10ge1xuICAgIGNvbnN0IHtsYXlvdXRIZWFkZXJzfSA9IHRoaXMuY29tcG9uZW50O1xuICAgIGxldCBoZWFkZXJNYXJrcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIEhFQURFUl9DSEFOTkVMUykge1xuICAgICAgaWYgKGxheW91dEhlYWRlcnNbY2hhbm5lbF0udGl0bGUpIHtcbiAgICAgICAgaGVhZGVyTWFya3MucHVzaChnZXRUaXRsZUdyb3VwKHRoaXMsIGNoYW5uZWwpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgSEVBREVSX0NIQU5ORUxTKSB7XG4gICAgICBoZWFkZXJNYXJrcyA9IGhlYWRlck1hcmtzLmNvbmNhdChnZXRIZWFkZXJHcm91cHModGhpcywgY2hhbm5lbCkpO1xuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyTWFya3M7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgYXNzZW1ibGVNYXJrcygpOiBWZ01hcmtHcm91cFtdOyAvLyBUT0RPOiBWZ01hcmtHcm91cFtdXG5cbiAgcHVibGljIGFzc2VtYmxlQXhlcygpOiBWZ0F4aXNbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlQXhlcyh0aGlzLmNvbXBvbmVudC5heGVzLCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMZWdlbmRzKCk6IFZnTGVnZW5kW10ge1xuICAgIHJldHVybiBhc3NlbWJsZUxlZ2VuZHModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVQcm9qZWN0aW9ucygpOiBWZ1Byb2plY3Rpb25bXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlUHJvamVjdGlvbnModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVUaXRsZSgpOiBWZ1RpdGxlIHtcbiAgICBjb25zdCB0aXRsZTogVmdUaXRsZSA9IHtcbiAgICAgIC4uLmV4dHJhY3RUaXRsZUNvbmZpZyh0aGlzLmNvbmZpZy50aXRsZSkubm9uTWFyayxcbiAgICAgIC4uLnRoaXMudGl0bGVcbiAgICB9O1xuXG4gICAgaWYgKHRpdGxlLnRleHQpIHtcbiAgICAgIGlmICghY29udGFpbnMoWyd1bml0JywgJ2xheWVyJ10sIHRoaXMudHlwZSkpIHtcbiAgICAgICAgLy8gQXMgZGVzY3JpYmVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjg3NTpcbiAgICAgICAgLy8gRHVlIHRvIHZlZ2EvdmVnYSM5NjAgKGNvbW1lbnQpLCB3ZSBvbmx5IHN1cHBvcnQgdGl0bGUncyBhbmNob3IgZm9yIHVuaXQgYW5kIGxheWVyZWQgc3BlYyBmb3Igbm93LlxuXG4gICAgICAgIGlmICh0aXRsZS5hbmNob3IgJiYgdGl0bGUuYW5jaG9yICE9PSAnc3RhcnQnKSB7XG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY2Fubm90U2V0VGl0bGVBbmNob3IodGhpcy50eXBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGl0bGUuYW5jaG9yID0gJ3N0YXJ0JztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleXModGl0bGUpLmxlbmd0aCA+IDAgPyB0aXRsZSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlbWJsZSB0aGUgbWFyayBncm91cCBmb3IgdGhpcyBtb2RlbC4gIFdlIGFjY2VwdCBvcHRpb25hbCBgc2lnbmFsc2Agc28gdGhhdCB3ZSBjYW4gaW5jbHVkZSBjb25jYXQgdG9wLWxldmVsIHNpZ25hbHMgd2l0aCB0aGUgdG9wLWxldmVsIG1vZGVsJ3MgbG9jYWwgc2lnbmFscy5cbiAgICovXG4gIHB1YmxpYyBhc3NlbWJsZUdyb3VwKHNpZ25hbHM6IFZnU2lnbmFsW10gPSBbXSkge1xuICAgIGNvbnN0IGdyb3VwOiBWZ01hcmtHcm91cCA9IHt9O1xuXG4gICAgc2lnbmFscyA9IHNpZ25hbHMuY29uY2F0KHRoaXMuYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCkpO1xuXG4gICAgaWYgKHNpZ25hbHMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAuc2lnbmFscyA9IHNpZ25hbHM7XG4gICAgfVxuXG4gICAgY29uc3QgbGF5b3V0ID0gdGhpcy5hc3NlbWJsZUxheW91dCgpO1xuICAgIGlmIChsYXlvdXQpIHtcbiAgICAgIGdyb3VwLmxheW91dCA9IGxheW91dDtcbiAgICB9XG5cbiAgICBncm91cC5tYXJrcyA9IFtdLmNvbmNhdChcbiAgICAgIHRoaXMuYXNzZW1ibGVIZWFkZXJNYXJrcygpLFxuICAgICAgdGhpcy5hc3NlbWJsZU1hcmtzKClcbiAgICApO1xuXG4gICAgLy8gT25seSBpbmNsdWRlIHNjYWxlcyBpZiB0aGlzIHNwZWMgaXMgdG9wLWxldmVsIG9yIGlmIHBhcmVudCBpcyBmYWNldC5cbiAgICAvLyAoT3RoZXJ3aXNlLCBpdCB3aWxsIGJlIG1lcmdlZCB3aXRoIHVwcGVyLWxldmVsJ3Mgc2NvcGUuKVxuICAgIGNvbnN0IHNjYWxlcyA9ICghdGhpcy5wYXJlbnQgfHwgaXNGYWNldE1vZGVsKHRoaXMucGFyZW50KSkgPyBhc3NlbWJsZVNjYWxlcyh0aGlzKSA6IFtdO1xuICAgIGlmIChzY2FsZXMubGVuZ3RoID4gMCkge1xuICAgICAgZ3JvdXAuc2NhbGVzID0gc2NhbGVzO1xuICAgIH1cblxuICAgIGNvbnN0IGF4ZXMgPSB0aGlzLmFzc2VtYmxlQXhlcygpO1xuICAgIGlmIChheGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLmF4ZXMgPSBheGVzO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZ2VuZHMgPSB0aGlzLmFzc2VtYmxlTGVnZW5kcygpO1xuICAgIGlmIChsZWdlbmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGdyb3VwLmxlZ2VuZHMgPSBsZWdlbmRzO1xuICAgIH1cblxuICAgIHJldHVybiBncm91cDtcbiAgfVxuXG4gIHB1YmxpYyBoYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChpc1VuaXRNb2RlbChjaGlsZCkpIHtcbiAgICAgICAgaWYgKGNoaWxkLmNoYW5uZWxIYXNGaWVsZChjaGFubmVsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2hpbGQuaGFzRGVzY2VuZGFudFdpdGhGaWVsZE9uQ2hhbm5lbChjaGFubmVsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROYW1lKHRleHQ6IHN0cmluZykge1xuICAgIHJldHVybiB2YXJOYW1lKCh0aGlzLm5hbWUgPyB0aGlzLm5hbWUgKyAnXycgOiAnJykgKyB0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IGEgZGF0YSBzb3VyY2UgbmFtZSBmb3IgdGhlIGdpdmVuIGRhdGEgc291cmNlIHR5cGUgYW5kIG1hcmsgdGhhdCBkYXRhIHNvdXJjZSBhcyByZXF1aXJlZC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCBpbiBwYXJzZSwgc28gdGhhdCBhbGwgdXNlZCBkYXRhIHNvdXJjZSBjYW4gYmUgY29ycmVjdGx5IGluc3RhbnRpYXRlZCBpbiBhc3NlbWJsZURhdGEoKS5cbiAgICovXG4gIHB1YmxpYyByZXF1ZXN0RGF0YU5hbWUobmFtZTogRGF0YVNvdXJjZVR5cGUpIHtcbiAgICBjb25zdCBmdWxsTmFtZSA9IHRoaXMuZ2V0TmFtZShuYW1lKTtcblxuICAgIC8vIEluY3JlYXNlIHJlZiBjb3VudC4gVGhpcyBpcyBjcml0aWNhbCBiZWNhdXNlIG90aGVyd2lzZSB3ZSB3b24ndCBjcmVhdGUgYSBkYXRhIHNvdXJjZS5cbiAgICAvLyBXZSBhbHNvIGluY3JlYXNlIHRoZSByZWYgY291bnRzIG9uIE91dHB1dE5vZGUuZ2V0U291cmNlKCkgY2FsbHMuXG4gICAgY29uc3QgcmVmQ291bnRzID0gdGhpcy5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlUmVmQ291bnRzO1xuICAgIHJlZkNvdW50c1tmdWxsTmFtZV0gPSAocmVmQ291bnRzW2Z1bGxOYW1lXSB8fCAwKSArIDE7XG5cbiAgICByZXR1cm4gZnVsbE5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2l6ZVNpZ25hbFJlZihzaXplVHlwZTogJ3dpZHRoJyB8ICdoZWlnaHQnKTogVmdTaWduYWxSZWYge1xuICAgIGlmIChpc0ZhY2V0TW9kZWwodGhpcy5wYXJlbnQpKSB7XG4gICAgICBjb25zdCBjaGFubmVsID0gc2l6ZVR5cGUgPT09ICd3aWR0aCcgPyAneCcgOiAneSc7XG4gICAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcblxuICAgICAgaWYgKHNjYWxlQ29tcG9uZW50ICYmICFzY2FsZUNvbXBvbmVudC5tZXJnZWQpIHsgLy8gaW5kZXBlbmRlbnQgc2NhbGVcbiAgICAgICAgY29uc3QgdHlwZSA9IHNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgICAgICBjb25zdCByYW5nZSA9IHNjYWxlQ29tcG9uZW50LmdldCgncmFuZ2UnKTtcblxuICAgICAgICBpZiAoaGFzRGlzY3JldGVEb21haW4odHlwZSkgJiYgaXNWZ1JhbmdlU3RlcChyYW5nZSkpIHtcbiAgICAgICAgICBjb25zdCBzY2FsZU5hbWUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ25hbWUnKTtcbiAgICAgICAgICBjb25zdCBkb21haW4gPSBhc3NlbWJsZURvbWFpbih0aGlzLCBjaGFubmVsKTtcbiAgICAgICAgICBjb25zdCBmaWVsZCA9IGdldEZpZWxkRnJvbURvbWFpbihkb21haW4pO1xuICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGRSZWYgPSB2Z0ZpZWxkKHthZ2dyZWdhdGU6ICdkaXN0aW5jdCcsIGZpZWxkfSwge2V4cHI6ICdkYXR1bSd9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNpZ25hbDogc2l6ZUV4cHIoc2NhbGVOYW1lLCBzY2FsZUNvbXBvbmVudCwgZmllbGRSZWYpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2cud2FybignVW5rbm93biBmaWVsZCBmb3IgJHtjaGFubmVsfS4gIENhbm5vdCBjYWxjdWxhdGUgdmlldyBzaXplLicpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiB0aGlzLmxheW91dFNpemVOYW1lTWFwLmdldCh0aGlzLmdldE5hbWUoc2l6ZVR5cGUpKVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIHRoZSBuYW1lIG9mIHRoZSBkYXRhc291cmNlIGZvciBhbiBvdXRwdXQgbm9kZS4gWW91IHByb2JhYmx5IHdhbnQgdG8gY2FsbCB0aGlzIGluIGFzc2VtYmxlLlxuICAgKi9cbiAgcHVibGljIGxvb2t1cERhdGFTb3VyY2UobmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXNbbmFtZV07XG5cbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIC8vIE5hbWUgbm90IGZvdW5kIGluIG1hcCBzbyBsZXQncyBqdXN0IHJldHVybiB3aGF0IHdlIGdvdC5cbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhlIGNvcnJlY3QgbmFtZS5cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlLmdldFNvdXJjZSgpO1xuICB9XG5cbiAgcHVibGljIGdldFNpemVOYW1lKG9sZFNpemVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICByZXR1cm4gdGhpcy5sYXlvdXRTaXplTmFtZU1hcC5nZXQob2xkU2l6ZU5hbWUpO1xuICB9XG5cbiAgcHVibGljIHJlbmFtZUxheW91dFNpemUob2xkTmFtZTogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxheW91dFNpemVOYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWVTY2FsZShvbGROYW1lOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2NhbGVOYW1lTWFwLnJlbmFtZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWVQcm9qZWN0aW9uKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5wcm9qZWN0aW9uTmFtZU1hcC5yZW5hbWUob2xkTmFtZSwgbmV3TmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiBzY2FsZSBuYW1lIGZvciBhIGdpdmVuIGNoYW5uZWwgYWZ0ZXIgdGhlIHNjYWxlIGhhcyBiZWVuIHBhcnNlZCBhbmQgbmFtZWQuXG4gICAqL1xuICBwdWJsaWMgc2NhbGVOYW1lKG9yaWdpbmFsU2NhbGVOYW1lOiBDaGFubmVsIHwgc3RyaW5nLCBwYXJzZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGlmIChwYXJzZSkge1xuICAgICAgLy8gRHVyaW5nIHRoZSBwYXJzZSBwaGFzZSBhbHdheXMgcmV0dXJuIGEgdmFsdWVcbiAgICAgIC8vIE5vIG5lZWQgdG8gcmVmZXIgdG8gcmVuYW1lIG1hcCBiZWNhdXNlIGEgc2NhbGUgY2FuJ3QgYmUgcmVuYW1lZFxuICAgICAgLy8gYmVmb3JlIGl0IGhhcyB0aGUgb3JpZ2luYWwgbmFtZS5cbiAgICAgIHJldHVybiB0aGlzLmdldE5hbWUob3JpZ2luYWxTY2FsZU5hbWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGEgc2NhbGUgZm9yIHRoZSBjaGFubmVsLCBpdCBzaG91bGQgZWl0aGVyXG4gICAgLy8gYmUgaW4gdGhlIHNjYWxlIGNvbXBvbmVudCBvciBleGlzdCBpbiB0aGUgbmFtZSBtYXBcbiAgICBpZiAoXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgc2NhbGUgZm9yIHRoZSBjaGFubmVsLCB0aGVyZSBzaG91bGQgYmUgYSBsb2NhbCBzY2FsZSBjb21wb25lbnQgZm9yIGl0XG4gICAgICAgIChpc0NoYW5uZWwob3JpZ2luYWxTY2FsZU5hbWUpICYmIGlzU2NhbGVDaGFubmVsKG9yaWdpbmFsU2NhbGVOYW1lKSAmJiB0aGlzLmNvbXBvbmVudC5zY2FsZXNbb3JpZ2luYWxTY2FsZU5hbWVdKSB8fFxuICAgICAgICAvLyBpbiB0aGUgc2NhbGUgbmFtZSBtYXAgKHRoZSBzY2FsZSBnZXQgbWVyZ2VkIGJ5IGl0cyBwYXJlbnQpXG4gICAgICAgIHRoaXMuc2NhbGVOYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUob3JpZ2luYWxTY2FsZU5hbWUpKVxuICAgICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2FsZU5hbWVNYXAuZ2V0KHRoaXMuZ2V0TmFtZShvcmlnaW5hbFNjYWxlTmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gcHJvamVjdGlvbiBuYW1lIGFmdGVyIHRoZSBwcm9qZWN0aW9uIGhhcyBiZWVuIHBhcnNlZCBhbmQgbmFtZWQuXG4gICAqL1xuICBwdWJsaWMgcHJvamVjdGlvbk5hbWUocGFyc2U/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBpZiAocGFyc2UpIHtcbiAgICAgIC8vIER1cmluZyB0aGUgcGFyc2UgcGhhc2UgYWx3YXlzIHJldHVybiBhIHZhbHVlXG4gICAgICAvLyBObyBuZWVkIHRvIHJlZmVyIHRvIHJlbmFtZSBtYXAgYmVjYXVzZSBhIHByb2plY3Rpb24gY2FuJ3QgYmUgcmVuYW1lZFxuICAgICAgLy8gYmVmb3JlIGl0IGhhcyB0aGUgb3JpZ2luYWwgbmFtZS5cbiAgICAgIHJldHVybiB0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMuY29tcG9uZW50LnByb2plY3Rpb24gJiYgIXRoaXMuY29tcG9uZW50LnByb2plY3Rpb24ubWVyZ2VkKSB8fCB0aGlzLnByb2plY3Rpb25OYW1lTWFwLmhhcyh0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2plY3Rpb25OYW1lTWFwLmdldCh0aGlzLmdldE5hbWUoJ3Byb2plY3Rpb24nKSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ29ycmVjdHMgdGhlIGRhdGEgcmVmZXJlbmNlcyBpbiBtYXJrcyBhZnRlciBhc3NlbWJsZS5cbiAgICovXG4gIHB1YmxpYyBjb3JyZWN0RGF0YU5hbWVzID0gKG1hcms6IFZnTWFya0dyb3VwKSA9PiB7XG4gICAgLy8gVE9ETzogbWFrZSB0aGlzIGNvcnJlY3RcblxuICAgIC8vIGZvciBub3JtYWwgZGF0YSByZWZlcmVuY2VzXG4gICAgaWYgKG1hcmsuZnJvbSAmJiBtYXJrLmZyb20uZGF0YSkge1xuICAgICAgbWFyay5mcm9tLmRhdGEgPSB0aGlzLmxvb2t1cERhdGFTb3VyY2UobWFyay5mcm9tLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIGZvciBhY2Nlc3MgdG8gZmFjZXQgZGF0YVxuICAgIGlmIChtYXJrLmZyb20gJiYgbWFyay5mcm9tLmZhY2V0ICYmIG1hcmsuZnJvbS5mYWNldC5kYXRhKSB7XG4gICAgICBtYXJrLmZyb20uZmFjZXQuZGF0YSA9IHRoaXMubG9va3VwRGF0YVNvdXJjZShtYXJrLmZyb20uZmFjZXQuZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcms7XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2UgYSBtb2RlbCdzIGhpZXJhcmNoeSB0byBnZXQgdGhlIHNjYWxlIGNvbXBvbmVudCBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWwuXG4gICAqL1xuICBwdWJsaWMgZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbDogU2NhbGVDaGFubmVsKTogU2NhbGVDb21wb25lbnQge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBUaGlzIGlzIHdhcm5pbmcgZm9yIGRlYnVnZ2luZyB0ZXN0ICovXG4gICAgaWYgKCF0aGlzLmNvbXBvbmVudC5zY2FsZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0U2NhbGVDb21wb25lbnQgY2Fubm90IGJlIGNhbGxlZCBiZWZvcmUgcGFyc2VTY2FsZSgpLiAgTWFrZSBzdXJlIHlvdSBoYXZlIGNhbGxlZCBwYXJzZVNjYWxlIG9yIHVzZSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSgpLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgaWYgKGxvY2FsU2NhbGVDb21wb25lbnQgJiYgIWxvY2FsU2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICByZXR1cm4gbG9jYWxTY2FsZUNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpIDogdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZSBhIG1vZGVsJ3MgaGllcmFyY2h5IHRvIGdldCBhIHBhcnRpY3VsYXIgc2VsZWN0aW9uIGNvbXBvbmVudC5cbiAgICovXG4gIHB1YmxpYyBnZXRTZWxlY3Rpb25Db21wb25lbnQodmFyaWFibGVOYW1lOiBzdHJpbmcsIG9yaWdOYW1lOiBzdHJpbmcpOiBTZWxlY3Rpb25Db21wb25lbnQge1xuICAgIGxldCBzZWwgPSB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb25bdmFyaWFibGVOYW1lXTtcbiAgICBpZiAoIXNlbCAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgc2VsID0gdGhpcy5wYXJlbnQuZ2V0U2VsZWN0aW9uQ29tcG9uZW50KHZhcmlhYmxlTmFtZSwgb3JpZ05hbWUpO1xuICAgIH1cbiAgICBpZiAoIXNlbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLnNlbGVjdGlvbk5vdEZvdW5kKG9yaWdOYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiBzZWw7XG4gIH1cbn1cblxuLyoqIEFic3RyYWN0IGNsYXNzIGZvciBVbml0TW9kZWwgYW5kIEZhY2V0TW9kZWwuICBCb3RoIG9mIHdoaWNoIGNhbiBjb250YWluIGZpZWxkRGVmcyBhcyBhIHBhcnQgb2YgaXRzIG93biBzcGVjaWZpY2F0aW9uLiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1vZGVsV2l0aEZpZWxkIGV4dGVuZHMgTW9kZWwge1xuICBwdWJsaWMgYWJzdHJhY3QgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz47XG5cbiAgLyoqIEdldCBcImZpZWxkXCIgcmVmZXJlbmNlIGZvciB2ZWdhICovXG4gIHB1YmxpYyB2Z0ZpZWxkKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwsIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSkge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcblxuICAgIGlmICghZmllbGREZWYpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZnRmllbGQoZmllbGREZWYsIG9wdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0TWFwcGluZygpOiB7W2tleSBpbiBDaGFubmVsXT86IGFueX07XG5cbiAgcHVibGljIHJlZHVjZUZpZWxkRGVmPFQsIFU+KGY6IChhY2M6IFUsIGZkOiBGaWVsZERlZjxzdHJpbmc+LCBjOiBDaGFubmVsKSA9PiBVLCBpbml0OiBULCB0PzogYW55KSB7XG4gICAgcmV0dXJuIHJlZHVjZSh0aGlzLmdldE1hcHBpbmcoKSwgKGFjYzpVICwgY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgcmV0dXJuIGYoYWNjLCBmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGluaXQsIHQpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2hGaWVsZERlZihmOiAoZmQ6IEZpZWxkRGVmPHN0cmluZz4sIGM6IENoYW5uZWwpID0+IHZvaWQsIHQ/OiBhbnkpIHtcbiAgICBmb3JFYWNoKHRoaXMuZ2V0TWFwcGluZygpLCAoY2Q6IENoYW5uZWxEZWY8c3RyaW5nPiwgYzogQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBnZXRGaWVsZERlZihjZCk7XG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgZihmaWVsZERlZiwgYyk7XG4gICAgICB9XG4gICAgfSwgdCk7XG4gIH1cbiAgcHVibGljIGFic3RyYWN0IGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbjtcbn1cbiJdfQ==