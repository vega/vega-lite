"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var predicate_1 = require("../../predicate");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var expressions_1 = require("./expressions");
var FilterNode = /** @class */ (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(parent, model, filter) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.filter = filter;
        _this.expr = predicate_1.expression(_this.model, _this.filter, _this);
        _this._dependentFields = expressions_1.getDependentFields(_this.expr);
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(null, this.model, util_1.duplicate(this.filter));
    };
    FilterNode.prototype.dependentFields = function () {
        return this._dependentFields;
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: this.expr
        };
    };
    FilterNode.prototype.hash = function () {
        return "Filter " + util_1.hash(this.filter);
    };
    return FilterNode;
}(dataflow_1.TransformNode));
exports.FilterNode = FilterNode;
//# sourceMappingURL=filter.js.map