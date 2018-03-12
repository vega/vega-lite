"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var predicate_1 = require("../../predicate");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var FilterNode = /** @class */ (function (_super) {
    __extends(FilterNode, _super);
    function FilterNode(parent, model, filter) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.filter = filter;
        _this.expr = predicate_1.expression(_this.model, _this.filter, _this);
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(null, this.model, util_1.duplicate(this.filter));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQXNEO0FBQ3RELG1DQUFxQztBQUdyQyx1Q0FBd0M7QUFFeEM7SUFBZ0MsOEJBQVk7SUFNMUMsb0JBQVksTUFBb0IsRUFBbUIsS0FBWSxFQUFVLE1BQWlDO1FBQTFHLFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBRWQ7UUFIa0QsV0FBSyxHQUFMLEtBQUssQ0FBTztRQUFVLFlBQU0sR0FBTixNQUFNLENBQTJCO1FBRXhHLEtBQUksQ0FBQyxJQUFJLEdBQUcsc0JBQVUsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLENBQUM7O0lBQ3hELENBQUM7SUFQTSwwQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQU9NLDZCQUFRLEdBQWY7UUFDRSxNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQWpCRCxDQUFnQyx1QkFBWSxHQWlCM0M7QUFqQlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xvZ2ljYWxPcGVyYW5kfSBmcm9tICcuLi8uLi9sb2dpY2FsJztcbmltcG9ydCB7ZXhwcmVzc2lvbiwgUHJlZGljYXRlfSBmcm9tICcuLi8uLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0ZpbHRlclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgZXhwcjogc3RyaW5nO1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJOb2RlKG51bGwsIHRoaXMubW9kZWwsIGR1cGxpY2F0ZSh0aGlzLmZpbHRlcikpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgcmVhZG9ubHkgbW9kZWw6IE1vZGVsLCBwcml2YXRlIGZpbHRlcjogTG9naWNhbE9wZXJhbmQ8UHJlZGljYXRlPikge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gICAgdGhpcy5leHByID0gZXhwcmVzc2lvbih0aGlzLm1vZGVsLCB0aGlzLmZpbHRlciwgdGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdGaWx0ZXJUcmFuc2Zvcm0ge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgIGV4cHI6IHRoaXMuZXhwclxuICAgIH07XG4gIH1cbn1cbiJdfQ==