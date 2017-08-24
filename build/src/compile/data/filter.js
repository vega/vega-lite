"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var filter_1 = require("../../filter");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var FilterNode = (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(model, filter) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.filter = filter;
        _this.expr = filter_1.expression(_this.model, _this.filter, _this);
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(this.model, util_1.duplicate(this.filter));
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: this.expr
        };
    };
    return FilterNode;
}(dataflow_1.DataFlowNode));
exports.FilterNode = FilterNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQWdEO0FBRWhELG1DQUFxQztBQUdyQyx1Q0FBd0M7QUFFeEM7SUFBZ0Msc0NBQVk7SUFNMUMsb0JBQTZCLEtBQVksRUFBVSxNQUE4QjtRQUFqRixZQUNFLGlCQUFPLFNBRVI7UUFINEIsV0FBSyxHQUFMLEtBQUssQ0FBTztRQUFVLFlBQU0sR0FBTixNQUFNLENBQXdCO1FBRS9FLEtBQUksQ0FBQyxJQUFJLEdBQUcsbUJBQVUsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLENBQUM7O0lBQ3hELENBQUM7SUFQTSwwQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBT00sNkJBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBakJELENBQWdDLHVCQUFZLEdBaUIzQztBQWpCWSxnQ0FBVSJ9