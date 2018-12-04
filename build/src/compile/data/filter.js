import * as tslib_1 from "tslib";
import { expression } from '../../predicate';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
import { getDependentFields } from './expressions';
var FilterNode = /** @class */ (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(parent, model, filter) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.filter = filter;
        // TODO: refactor this to not take a node and
        // then add a static function makeFromOperand and make the constructor take only an expression
        _this.expr = expression(_this.model, _this.filter, _this);
        _this._dependentFields = getDependentFields(_this.expr);
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(null, this.model, duplicate(this.filter));
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
        return "Filter " + this.expr;
    };
    return FilterNode;
}(DataFlowNode));
export { FilterNode };
//# sourceMappingURL=filter.js.map