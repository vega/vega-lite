import * as tslib_1 from "tslib";
import { vgField } from '../../fielddef';
import { duplicate, hash } from '../../util';
import { unique } from './../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the window transform nodes
 */
var WindowTransformNode = /** @class */ (function (_super) {
    tslib_1.__extends(WindowTransformNode, _super);
    function WindowTransformNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        return _this;
    }
    WindowTransformNode.prototype.clone = function () {
        return new WindowTransformNode(null, duplicate(this.transform));
    };
    WindowTransformNode.prototype.addDimensions = function (fields) {
        this.transform.groupby = unique(this.transform.groupby.concat(fields), function (d) { return d; });
    };
    WindowTransformNode.prototype.dependentFields = function () {
        var out = {};
        this.transform.groupby.forEach(function (f) { return (out[f] = true); });
        this.transform.sort.forEach(function (m) { return (out[m.field] = true); });
        this.transform.window
            .map(function (w) { return w.field; })
            .filter(function (f) { return f !== undefined; })
            .forEach(function (f) { return (out[f] = true); });
        return out;
    };
    WindowTransformNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        this.transform.window.forEach(function (windowFieldDef) { return (out[_this.getDefaultName(windowFieldDef)] = true); });
        return out;
    };
    WindowTransformNode.prototype.getDefaultName = function (windowFieldDef) {
        return windowFieldDef.as || vgField(windowFieldDef);
    };
    WindowTransformNode.prototype.hash = function () {
        return "WindowTransform " + hash(this.transform);
    };
    WindowTransformNode.prototype.assemble = function () {
        var fields = [];
        var ops = [];
        var as = [];
        var params = [];
        for (var _i = 0, _a = this.transform.window; _i < _a.length; _i++) {
            var window_1 = _a[_i];
            ops.push(window_1.op);
            as.push(this.getDefaultName(window_1));
            params.push(window_1.param === undefined ? null : window_1.param);
            fields.push(window_1.field === undefined ? null : window_1.field);
        }
        var frame = this.transform.frame;
        var groupby = this.transform.groupby;
        var sortFields = [];
        var sortOrder = [];
        if (this.transform.sort !== undefined) {
            for (var _b = 0, _c = this.transform.sort; _b < _c.length; _b++) {
                var sortField = _c[_b];
                sortFields.push(sortField.field);
                sortOrder.push(sortField.order || 'ascending');
            }
        }
        var sort = {
            field: sortFields,
            order: sortOrder
        };
        var ignorePeers = this.transform.ignorePeers;
        var result = {
            type: 'window',
            params: params,
            as: as,
            ops: ops,
            fields: fields,
            sort: sort
        };
        if (ignorePeers !== undefined) {
            result.ignorePeers = ignorePeers;
        }
        if (groupby !== undefined) {
            result.groupby = groupby;
        }
        if (frame !== undefined) {
            result.frame = frame;
        }
        return result;
    };
    return WindowTransformNode;
}(DataFlowNode));
export { WindowTransformNode };
//# sourceMappingURL=window.js.map