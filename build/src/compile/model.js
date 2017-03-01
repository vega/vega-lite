"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var scale_1 = require("../scale");
var util_1 = require("../util");
var scale_2 = require("./scale/scale");
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
    function Model(spec, parent, parentGivenName) {
        this.scales = {};
        this.axes = {};
        this.legends = {};
        this.children = [];
        this.parent = parent;
        // If name is not provided, always use parent's givenName to avoid name conflicts.
        this.name = spec.name || parentGivenName;
        // Shared name maps
        this.dataNameMap = parent ? parent.dataNameMap : new NameMap();
        this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
        this.sizeNameMap = parent ? parent.sizeNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.padding = spec.padding;
        this.transform = spec.transform;
        if (spec.transform) {
            if (spec.transform.filterInvalid === undefined &&
                spec.transform['filterNull'] !== undefined) {
                spec.transform.filterInvalid = spec.transform['filterNull'];
                log.warn(log.message.DEPRECATED_FILTER_NULL);
            }
        }
        this.component = { data: null, layout: null, mark: null, scales: null, axes: null, axisGroups: null, gridGroups: null, legends: null, selection: null };
    }
    Model.prototype.parse = function () {
        this.parseData();
        this.parseLayoutData();
        this.parseScale(); // depends on data name
        this.parseSelection();
        this.parseAxis(); // depends on scale name
        this.parseLegend(); // depends on scale name
        this.parseAxisGroup(); // depends on child axis
        this.parseGridGroup();
        this.parseMark(); // depends on data name and scale name, axisGroup, gridGroup and children's scale, axis, legend and mark.
    };
    Model.prototype.assembleScales = function () {
        // FIXME: write assembleScales() in scale.ts that
        // help assemble scale domains with scale signature as well
        return util_1.flatten(util_1.vals(this.component.scales).map(function (scales) {
            var arr = [scales.main];
            if (scales.binLegend) {
                arr.push(scales.binLegend);
            }
            if (scales.binLegendLabel) {
                arr.push(scales.binLegendLabel);
            }
            return arr;
        }));
    };
    Model.prototype.assembleAxes = function () {
        return [].concat.apply([], util_1.vals(this.component.axes));
    };
    Model.prototype.assembleLegends = function () {
        return util_1.vals(this.component.legends);
    };
    Model.prototype.assembleGroup = function () {
        var group = {};
        var signals = this.assembleSignals(group.signals || []);
        if (signals.length > 0) {
            group.signals = signals;
        }
        // TODO: consider if we want scales to come before marks in the output spec.
        group.marks = this.assembleMarks();
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
    Model.prototype.reduceFieldDef = function (f, init, t) {
        return encoding_1.reduce(this.getMapping(), function (acc, cd, c) {
            return fielddef_1.isFieldDef(cd) ? f(acc, cd, c) : acc;
        }, init, t);
    };
    Model.prototype.forEachFieldDef = function (f, t) {
        encoding_1.forEach(this.getMapping(), function (cd, c) {
            if (fielddef_1.isFieldDef(cd)) {
                f(cd, c);
            }
        }, t);
    };
    Model.prototype.hasDescendantWithFieldOnChannel = function (channel) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.isUnit()) {
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
    Model.prototype.getName = function (text, delimiter) {
        if (delimiter === void 0) { delimiter = '_'; }
        return (this.name ? this.name + delimiter : '') + text;
    };
    Model.prototype.renameData = function (oldName, newName) {
        this.dataNameMap.rename(oldName, newName);
    };
    /**
     * Return the data source name for the given data source type.
     *
     * For unit spec, this is always simply the spec.name + '-' + dataSourceType.
     * We already use the name map so that marks and scales use the correct data.
     */
    Model.prototype.dataName = function (dataSourceType) {
        return this.dataNameMap.get(this.getName(String(dataSourceType)));
    };
    Model.prototype.renameSize = function (oldName, newName) {
        this.sizeNameMap.rename(oldName, newName);
    };
    Model.prototype.channelSizeName = function (channel) {
        return this.sizeName(channel === channel_1.X || channel === channel_1.COLUMN ? 'width' : 'height');
    };
    Model.prototype.sizeName = function (size) {
        return this.sizeNameMap.get(this.getName(size, '_'));
    };
    // TRANSFORMS
    Model.prototype.calculate = function () {
        return this.transform ? this.transform.calculate : undefined;
    };
    Model.prototype.filterInvalid = function () {
        var transform = this.transform || {};
        if (transform.filterInvalid === undefined) {
            return this.parent ? this.parent.filterInvalid() : undefined;
        }
        return transform.filterInvalid;
    };
    Model.prototype.filter = function () {
        return this.transform ? this.transform.filter : undefined;
    };
    /** Get "field" reference for vega */
    Model.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: scale_1.hasDiscreteDomain(this.scale(channel).type) ? 'range' : 'start'
            }, opt);
        }
        return fielddef_1.field(fieldDef, opt);
    };
    Model.prototype.scale = function (channel) {
        return this.scales[channel];
    };
    Model.prototype.hasDiscreteScale = function (channel) {
        var scale = this.scale(channel);
        return scale && scale_1.hasDiscreteDomain(scale.type);
    };
    Model.prototype.renameScale = function (oldName, newName) {
        this.scaleNameMap.rename(oldName, newName);
    };
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     * (DO NOT USE THIS METHOD DURING SCALE PARSING, use model.name() instead)
     */
    Model.prototype.scaleName = function (originalScaleName, parse) {
        var channel = originalScaleName.replace(scale_2.BIN_LEGEND_SUFFIX, '').replace(scale_2.BIN_LEGEND_LABEL_SUFFIX, '');
        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a scale can't be renamed
            // before it has the original name.
            return this.getName(originalScaleName + '');
        }
        // If there is a scale for the channel, it should either
        // be in the _scale mapping or exist in the name map
        if (
        // in the scale map (the scale is not merged by its parent)
        (this.scale && this.scales[channel]) ||
            // in the scale name map (the the scale get merged by its parent)
            this.scaleNameMap.has(this.getName(originalScaleName + ''))) {
            return this.scaleNameMap.get(this.getName(originalScaleName + ''));
        }
        return undefined;
    };
    Model.prototype.sort = function (channel) {
        return (this.getMapping()[channel] || {}).sort;
    };
    Model.prototype.axis = function (channel) {
        return this.axes[channel];
    };
    Model.prototype.legend = function (channel) {
        return this.legends[channel];
    };
    /**
     * Type checks
     */
    Model.prototype.isUnit = function () {
        return false;
    };
    Model.prototype.isFacet = function () {
        return false;
    };
    Model.prototype.isLayer = function () {
        return false;
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map