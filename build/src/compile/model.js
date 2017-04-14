"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var scale_1 = require("../scale");
var util_1 = require("../util");
var assemble_1 = require("./scale/assemble");
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
        this.scales = {};
        this.axes = {};
        this.legends = {};
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
            layout: null, mark: null, scales: null, axes: null,
            axisGroups: null, gridGroups: null, legends: null, selection: null
        };
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
        return assemble_1.assembleScale(this);
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
    /**
     * Return the data source name for the given data source type. You probably want to call this in parse.
     */
    Model.prototype.getDataName = function (name) {
        var fullName = this.getName(name);
        return this.lookupDataSource(fullName);
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
        return this.sizeNameMap.get(this.getName(size, '_'));
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
        (this.scale && this.scales[originalScaleName]) ||
            // in the scale name map (the the scale get merged by its parent)
            this.scaleNameMap.has(this.getName(originalScaleName))) {
            return this.scaleNameMap.get(this.getName(originalScaleName));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNDQUE4QztBQUc5Qyx3Q0FBNEM7QUFDNUMsd0NBQW9GO0FBRXBGLGtDQUFrRDtBQUtsRCxnQ0FBMkM7QUFLM0MsNkNBQStDO0FBbUMvQztJQUdFO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVNLHdCQUFNLEdBQWIsVUFBYyxPQUFlLEVBQUUsT0FBZTtRQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUNsQyxDQUFDO0lBR00scUJBQUcsR0FBVixVQUFXLElBQVk7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDO0lBQzFDLENBQUM7SUFFTSxxQkFBRyxHQUFWLFVBQVcsSUFBWTtRQUNyQixxRUFBcUU7UUFDckUsNkVBQTZFO1FBQzdFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzFCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDO0FBekJZLDBCQUFPO0FBMkJwQjtJQTZCRSxlQUFZLElBQWMsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxNQUFjO1FBQWxGLGlCQXdCQztRQXRDa0IsV0FBTSxHQUFnQixFQUFFLENBQUM7UUFFekIsU0FBSSxHQUFlLEVBQUUsQ0FBQztRQUV0QixZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQU1yQixhQUFRLEdBQVksRUFBRSxDQUFDO1FBeVBoRDs7V0FFRztRQUNJLHFCQUFnQixHQUFHLFVBQUMs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