"use strict";
var stringify = require("json-stable-stringify");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
exports.pathOrder = {
    parseUnit: function (model) {
        if (util_1.contains(['line', 'area'], model.mark())) {
            if (model.mark() === 'line' && model.channelHasField('order')) {
                // For only line, sort by the order field if it is specified.
                return common_1.sortParams(model.encoding().order);
            }
            else {
                // For both line and area, we sort values based on dimension by default
                var dimensionChannel = model.config().mark.orient === 'horizontal' ? 'y' : 'x';
                var sort = model.sort(dimensionChannel);
                var sortField = sort_1.isSortField(sort) ?
                    fielddef_1.field({
                        // FIXME: this op might not already exist?
                        // FIXME: what if dimensionChannel (x or y) contains custom domain?
                        aggregate: encoding_1.isAggregate(model.encoding()) ? sort.op : undefined,
                        field: sort.field
                    }) :
                    model.field(dimensionChannel, { binSuffix: 'start' });
                return {
                    field: sortField,
                    order: 'descending'
                };
            }
        }
        return null;
    },
    parseFacet: function (model) {
        var childDataComponent = model.child().component.data;
        // If child doesn't have its own data source, then consider merging
        if (!childDataComponent.source) {
            // For now, let's assume it always has union scale
            var pathOrderComponent = childDataComponent.pathOrder;
            delete childDataComponent.pathOrder;
            return pathOrderComponent;
        }
        return null;
    },
    parseLayer: function (model) {
        // note that we run this before source.parseLayer
        var pathOrderComponent = null;
        var stringifiedPathOrder = null;
        for (var _i = 0, _a = model.children(); _i < _a.length; _i++) {
            var child = _a[_i];
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && childDataComponent.pathOrder !== null) {
                if (pathOrderComponent === null) {
                    pathOrderComponent = childDataComponent.pathOrder;
                    stringifiedPathOrder = stringify(pathOrderComponent);
                }
                else if (stringifiedPathOrder !== stringify(childDataComponent.pathOrder)) {
                    pathOrderComponent = null;
                    break;
                }
            }
        }
        if (pathOrderComponent !== null) {
            // If we merge pathOrderComponent, remove them from children.
            for (var _b = 0, _c = model.children(); _b < _c.length; _b++) {
                var child = _c[_b];
                delete child.component.data.pathOrder;
            }
        }
        return pathOrderComponent;
    },
    assemble: function (pathOrderComponent) {
        if (pathOrderComponent) {
            return {
                type: 'collect',
                sort: pathOrderComponent
            };
        }
        return null;
    }
};
//# sourceMappingURL=pathorder.js.map