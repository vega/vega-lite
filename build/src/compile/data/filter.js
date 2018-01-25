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
    function FilterNode(model, filter) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.filter = filter;
        _this.expr = predicate_1.expression(_this.model, _this.filter, _this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQXNEO0FBQ3RELG1DQUFxQztBQUdyQyx1Q0FBd0M7QUFFeEM7SUFBZ0MsOEJBQVk7SUFNMUMsb0JBQTZCLEtBQVksRUFBVSxNQUFpQztRQUFwRixZQUNFLGlCQUFPLFNBRVI7UUFINEIsV0FBSyxHQUFMLEtBQUssQ0FBTztRQUFVLFlBQU0sR0FBTixNQUFNLENBQTJCO1FBRWxGLEtBQUksQ0FBQyxJQUFJLEdBQUcsc0JBQVUsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLENBQUM7O0lBQ3hELENBQUM7SUFQTSwwQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBT00sNkJBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBakJELENBQWdDLHVCQUFZLEdBaUIzQztBQWpCWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4uLy4uL2xvZ2ljYWwnO1xuaW1wb3J0IHtleHByZXNzaW9uLCBQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRmlsdGVyVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBleHByOiBzdHJpbmc7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEZpbHRlck5vZGUodGhpcy5tb2RlbCwgZHVwbGljYXRlKHRoaXMuZmlsdGVyKSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG1vZGVsOiBNb2RlbCwgcHJpdmF0ZSBmaWx0ZXI6IExvZ2ljYWxPcGVyYW5kPFByZWRpY2F0ZT4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZXhwciA9IGV4cHJlc3Npb24odGhpcy5tb2RlbCwgdGhpcy5maWx0ZXIsIHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnRmlsdGVyVHJhbnNmb3JtIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICBleHByOiB0aGlzLmV4cHJcbiAgICB9O1xuICB9XG59XG4iXX0=