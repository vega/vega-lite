"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var channel_1 = require("../channel");
var data_1 = require("../data");
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
        if (this.data && text === data_1.SOURCE && data_1.isNamedData(this.data)) {
            return this.data.name;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUE4QjtBQUc5QixzQ0FBOEM7QUFFOUMsZ0NBQWtFO0FBQ2xFLHdDQUE0QztBQUM1Qyx3Q0FBb0Y7QUFFcEYsa0NBQWtEO0FBSWxELGdDQUFvRDtBQU9wRCx1Q0FBMEY7QUErQjFGO0lBR0U7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sd0JBQU0sR0FBYixVQUFjLE9BQWUsRUFBRSxPQUFlO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2xDLENBQUM7SUFHTSxxQkFBRyxHQUFWLFVBQVcsSUFBWTtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUM7SUFDMUMsQ0FBQztJQUVNLHFCQUFHLEdBQVYsVUFBVyxJQUFZO1FBQ3JCLHFFQUFxRTtRQUNyRSw2RUFBNkU7UUFDN0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDMUIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6QlksMEJBQU87QUFpQ3BCO0lBZ0NFLGVBQVksSUFBYyxFQUFFLE1BQWEsRUFBRSxlQUF1QjtRQWR0QyxXQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUV6QixTQUFJLEdBQWUsRUFBRSxDQUFDO1FBRXRCLFlBQU8sR0FBaUIsRUFBRSxDQUFDO1FBTTlCLGFBQVEsR0FBWSxFQUFFLENBQUM7UUFLOUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENB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