"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var util_1 = require("../util");
var header_1 = require("./layout/header");
var assemble_1 = require("./scale/assemble");
var unit_1 = require("./unit");
var NameMap = (function () {
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
        while (this.nameMap[name]) {
            name = this.nameMap[name];
        }
        return name;
    };
    return NameMap;
}());
exports.NameMap = NameMap;
var Model = (function () {
    function Model(spec, parent, parentGivenName, config) {
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
        // Shared name maps
        this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
        this.sizeNameMap = parent ? parent.sizeNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = spec.transform || [];
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : {},
                outputNodes: parent ? parent.component.data.outputNodes : {}
            },
            mark: null, scales: null, axes: { x: null, y: null },
            layoutHeaders: { row: {}, column: {} }, legends: null, selection: null
        };
    }
    Model.prototype.parse = function () {
        this.parseData();
        this.parseScale(); // depends on data name
        this.parseSelection();
        this.parseAxisAndHeader(); // depends on scale name
        this.parseLegend(); // depends on scale name
        this.parseMark(); // depends on data name and scale name, axisGroup, and children's scale, axis, legend and mark.
    };
    Model.prototype.assembleScales = function () {
        return assemble_1.assembleScale(this);
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
        var _a = this.component.axes, x = _a.x, y = _a.y;
        return (x ? x.axes.concat(x.gridAxes) : []).concat((y ? y.axes.concat(y.gridAxes) : []));
    };
    Model.prototype.assembleLegends = function () {
        return util_1.vals(this.component.legends);
    };
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
        var scales = this.assembleScales();
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
            if (child instanceof unit_1.UnitModel) {
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
        return this.lookupDataSource(fullName);
    };
    Model.prototype.getSizeSignalRef = function (sizeType) {
        // TODO: this could change in the future once we have sizeSignal merging
        return {
            signal: this.getName(sizeType)
        };
    };
    /**
     * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
     */
    Model.prototype.lookupDataSource = function (name) {
        var node = this.component.data.outputNodes[name];
        if (!node) {
            // name not found in map so let's just return what we got
            return name;
        }
        return node.source;
    };
    Model.prototype.renameSize = function (oldName, newName) {
        this.sizeNameMap.rename(oldName, newName);
    };
    Model.prototype.channelSizeName = function (channel) {
        return this.sizeName(channel === channel_1.X || channel === channel_1.COLUMN ? 'width' : 'height');
    };
    Model.prototype.sizeName = function (size) {
        return this.sizeNameMap.get(this.getName(size));
    };
    Model.prototype.renameScale = function (oldName, newName) {
        this.scaleNameMap.rename(oldName, newName);
    };
    // FIXME: remove this, but currently the scaleName() method below depends on this.
    Model.prototype.scale = function (channel) {
        return null;
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
        // be in the _scale mapping or exist in the name map
        if (
        // in the scale map (the scale is not merged by its parent)
        (this.scale && channel_1.isChannel(originalScaleName) && this.scale(originalScaleName)) ||
            // in the scale name map (the the scale get merged by its parent)
            this.scaleNameMap.has(this.getName(originalScaleName))) {
            return this.scaleNameMap.get(this.getName(originalScaleName));
        }
        return undefined;
    };
    /**
     * Traverse a model's hierarchy to get the specified component.
     * @param type Scales or Selection
     * @param name Name of the component
     */
    Model.prototype.getComponent = function (type, name) {
        return this.component[type][name] || this.parent.getComponent(type, name);
    };
    return Model;
}());
exports.Model = Model;
/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
var ModelWithField = (function (_super) {
    tslib_1.__extends(ModelWithField, _super);
    function ModelWithField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** Get "field" reference for vega */
    ModelWithField.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: this.hasDiscreteDomain(channel) ? 'range' : 'start'
            }, opt);
        }
        return fielddef_1.field(fieldDef, opt);
    };
    ModelWithField.prototype.reduceFieldDef = function (f, init, t) {
        return encoding_1.reduce(this.getMapping(), function (acc, cd, c) {
            return fielddef_1.isFieldDef(cd) ? f(acc, cd, c) : acc;
        }, init, t);
    };
    ModelWithField.prototype.forEachFieldDef = function (f, t) {
        encoding_1.forEach(this.getMapping(), function (cd, c) {
            if (fielddef_1.isFieldDef(cd)) {
                f(cd, c);
            }
        }, t);
    };
    return ModelWithField;
}(Model));
exports.ModelWithField = ModelWithField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBeUQ7QUFHekQsd0NBQTRDO0FBQzVDLHdDQUFpRztBQU9qRyxnQ0FBb0Q7QUFLcEQsMENBQW9IO0FBRXBILDZDQUErQztBQUUvQywrQkFBaUM7QUFnQ2pDO0lBR0U7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sd0JBQU0sR0FBYixVQUFjLE9BQWUsRUFBRSxPQUFlO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2xDLENBQUM7SUFHTSxxQkFBRyxHQUFWLFVBQVcsSUFBWTtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUM7SUFDMUMsQ0FBQztJQUVNLHFCQUFHLEdBQVYsVUFBVyxJQUFZO1FBQ3JCLHFFQUFxRTtRQUNyRSw2RUFBNkU7UUFDN0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDMUIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6QlksMEJBQU87QUEyQnBCO0lBb0JFLGVBQVksSUFBYyxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLE1BQWM7UUFBbEYsaUJBd0JDO1FBMUJ3QixhQUFRLEdBQVksRUFBRSxDQUFDO1FBNE9oRDs7V0FFRztRQUNJLHFCQUFnQixHQUFHLFVBQUMsSUFBbUI7WUFDNUMsMEJBQTBCO1lBRTFCLDZCQUE2QjtZQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFB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