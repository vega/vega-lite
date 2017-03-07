"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var channel_1 = require("../channel");
var data_1 = require("../data");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var scale_1 = require("../scale");
var util_1 = require("../util");
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
        return util_1.flatten(util_1.vals(this.component.scales).map(function (scale) {
            var arr = [scale];
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
        (this.scale && this.scales[originalScaleName]) ||
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUE4QjtBQUc5QixzQ0FBOEM7QUFFOUMsZ0NBQWtFO0FBQ2xFLHdDQUE0QztBQUM1Qyx3Q0FBb0Y7QUFFcEYsa0NBQWtEO0FBSWxELGdDQUFvRDtBQXFDcEQ7SUFHRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3QkFBTSxHQUFiLFVBQWMsT0FBZSxFQUFFLE9BQWU7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbEMsQ0FBQztJQUdNLHFCQUFHLEdBQVYsVUFBVyxJQUFZO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUMxQyxDQUFDO0lBRU0scUJBQUcsR0FBVixVQUFXLElBQVk7UUFDckIscUVBQXFFO1FBQ3JFLDZFQUE2RTtRQUM3RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQztBQXpCWSwwQkFBTztBQWlDcEI7SUFnQ0UsZUFBWSxJQUFjLEVBQUUsTUFBYSxFQUFFLGVBQXVCO1FBZHRDLFdBQU0sR0FBZ0IsRUFBRSxDQUFDO1FBRXpCLFNBQUksR0FBZSxFQUFFLENBQUM7UUFFdEIsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFNOUIsYUFBUSxHQUFZLEVBQUUsQ0FBQztRQUs5QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixrRkFBa0Y7UUFDbEYsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLGVBQWUsQ0FBQztRQUV6QyxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNqRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFFL0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxLQUFLLFNBQVM7Z0JBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDNUQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDL0MsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUN4SixDQUFDO0lBR00scUJBQUssR0FBWjtRQUNFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsdUJBQXVCO1FBQzFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyx3QkFBd0I7UUFDMUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsd0JBQXdCO1FBQzVDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QjtRQUMvQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMseUdBQXlHO0lBQzdILENBQUM7SUEyQk0sOEJBQWMsR0FBckI7UUFDRSxpREFBaUQ7UUFDakQsMkRBQTJEO1FBQzNELE1BQU0sQ0FBQyxjQUFPLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBYztZQUM1RCxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUlNLDRCQUFZLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxXQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSwrQkFBZSxHQUF0QjtRQUNFLE1BQU0sQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sNkJBQWEsR0FBcEI7UUFDRSxJQUFJLEtBQUssR0FBa0IsRUFBRSxDQUFDO1FBRTlCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDMUIsQ0FBQztRQUVELDRFQUE0RTtRQUM1RSxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLENBQUM7UUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzFCLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQVFNLDhCQUFjLEdBQXJCLFVBQTRCLENBQTBDLEVBQUUsSUFBTyxFQUFFLENBQU87UUFDdEYsTUFBTSxDQUFDLGlCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFVBQUMsR0FBSyxFQUFHLEVBQWMsRUFBRSxDQUFVO1lBQ2xFLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM5QyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUVNLCtCQUFlLEdBQXRCLFVBQXVCLENBQXFDLEVBQUUsQ0FBTztRQUNuRSxrQkFBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxVQUFDLEVBQWMsRUFBRSxDQUFVO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztRQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFTSwrQ0FBK0IsR0FBdEMsVUFBdUMsT0FBZ0I7UUFDckQsR0FBRyxDQUFDLENBQWMsVUFBYSxFQUFiLEtBQUEsSUFBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYTtZQUExQixJQUFJLEtBQUssU0FBQTtZQUNaLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNkLENBQUM7WUFDSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDO1lBQ0gsQ0FBQztTQUNGO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFJTSx1QkFBTyxHQUFkLFVBQWUsSUFBWSxFQUFFLFNBQXVCO1FBQXZCLDBCQUFBLEVBQUEsZUFBdUI7UUFDbEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssYUFBTSxJQUFJLGtCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDeEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3pELENBQUM7SUFFTSwwQkFBVSxHQUFqQixVQUFrQixPQUFlLEVBQUUsT0FBZTtRQUMvQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksd0JBQVEsR0FBZixVQUFnQixjQUE4QjtRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTSwwQkFBVSxHQUFqQixVQUFrQixPQUFlLEVBQUUsT0FBZTtRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVNLCtCQUFlLEdBQXRCLFVBQXVCLE9BQWdCO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxXQUFDLElBQUksT0FBTyxLQUFLLGdCQUFNLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFTSx3QkFBUSxHQUFmLFVBQWdCLElBQVk7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUlELGFBQWE7SUFDTix5QkFBUyxHQUFoQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvRCxDQUFDO0lBRU0sNkJBQWEsR0FBcEI7UUFDRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDL0QsQ0FBQztRQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxzQkFBTSxHQUFiO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQzVELENBQUM7SUFFRCxxQ0FBcUM7SUFDOUIscUJBQUssR0FBWixVQUFhLE9BQWdCLEVBQUUsR0FBd0I7UUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtRQUNyRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsR0FBRyxhQUFNLENBQUM7Z0JBQ1gsU0FBUyxFQUFFLHlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxHQUFHLE9BQU87YUFDM0UsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNWLENBQUM7UUFFRCxNQUFNLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUlNLHFCQUFLLEdBQVosVUFBYSxPQUFnQjtRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sZ0NBQWdCLEdBQXZCLFVBQXdCLE9BQWdCO1FBQ3RDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEtBQUssSUFBSSx5QkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLDJCQUFXLEdBQWxCLFVBQW1CLE9BQWUsRUFBRSxPQUFlO1FBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBR0Q7OztPQUdHO0lBQ0kseUJBQVMsR0FBaEIsVUFBOEIsaUJBQWlDLEVBQUUsS0FBZTtRQUM5RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsK0NBQStDO1lBQy9DLGtFQUFrRTtZQUNsRSxtQ0FBbUM7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVELHdEQUF3RDtRQUN4RCxvREFBb0Q7UUFDcEQsRUFBRSxDQUFDLENBQUM7UUFDQSwyREFBMkQ7UUFDM0QsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM5QyxpRUFBaUU7WUFDakUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUMsQ0FDNUQsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTSxvQkFBSSxHQUFYLFVBQVksT0FBZ0I7UUFDMUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNqRCxDQUFDO0lBRU0sb0JBQUksR0FBWCxVQUFZLE9BQWdCO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxzQkFBTSxHQUFiLFVBQWMsT0FBZ0I7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEOztPQUVHO0lBQ0ksc0JBQU0sR0FBYjtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ00sdUJBQU8sR0FBZDtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ00sdUJBQU8sR0FBZDtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ0gsWUFBQztBQUFELENBQUMsQUF4VEQsSUF3VEM7QUF4VHFCLHNCQUFLIn0=