"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var util_1 = require("../../util");
exports.nonPositiveFilter = {
    parseUnit: function (model) {
        return model.channels().reduce(function (nonPositiveComponent, channel) {
            var scale = model.scale(channel);
            if (!model.field(channel) || !scale) {
                // don't set anything
                return nonPositiveComponent;
            }
            nonPositiveComponent[model.field(channel)] = scale.type === scale_1.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});
    },
    parseFacet: function (model) {
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then consider merging
        if (!childDataComponent.source) {
            // For now, let's assume it always has union scale
            var nonPositiveFilterComponent = childDataComponent.nonPositiveFilter;
            delete childDataComponent.nonPositiveFilter;
            return nonPositiveFilterComponent;
        }
        return {};
    },
    parseLayer: function (model) {
        // note that we run this before source.parseLayer
        var nonPositiveFilterComponent = {};
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util_1.differ(childDataComponent.nonPositiveFilter, nonPositiveFilterComponent)) {
                util_1.extend(nonPositiveFilterComponent, childDataComponent.nonPositiveFilter);
                delete childDataComponent.nonPositiveFilter;
            }
        });
        return nonPositiveFilterComponent;
    },
    assemble: function (nonPositiveFilterComponent) {
        if (nonPositiveFilterComponent) {
            return util_1.keys(nonPositiveFilterComponent).filter(function (field) {
                // Only filter fields (keys) with value = true
                return nonPositiveFilterComponent[field];
            }).map(function (field) {
                return {
                    type: 'filter',
                    expr: 'datum["' + field + '"] > 0'
                };
            });
        }
        return [];
    }
};
//# sourceMappingURL=nonpositivefilter.js.map