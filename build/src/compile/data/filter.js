import * as tslib_1 from "tslib";
import { expression } from '../../predicate';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
var FilterNode = /** @class */ (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(parent, model, filter) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.filter = filter;
        _this.expr = expression(_this.model, _this.filter, _this);
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(null, this.model, duplicate(this.filter));
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: this.expr
        };
    };
    return FilterNode;
}(DataFlowNode));
export { FilterNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBQyxVQUFVLEVBQVksTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR3JDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFeEM7SUFBZ0Msc0NBQVk7SUFNMUMsb0JBQVksTUFBb0IsRUFBbUIsS0FBWSxFQUFVLE1BQWlDO1FBQTFHLFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBRWQ7UUFIa0QsV0FBSyxHQUFMLEtBQUssQ0FBTztRQUFVLFlBQU0sR0FBTixNQUFNLENBQTJCO1FBRXhHLEtBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsQ0FBQzs7SUFDeEQsQ0FBQztJQVBNLDBCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBT00sNkJBQVEsR0FBZjtRQUNFLE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQWpCRCxDQUFnQyxZQUFZLEdBaUIzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4uLy4uL2xvZ2ljYWwnO1xuaW1wb3J0IHtleHByZXNzaW9uLCBQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRmlsdGVyVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBleHByOiBzdHJpbmc7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEZpbHRlck5vZGUobnVsbCwgdGhpcy5tb2RlbCwgZHVwbGljYXRlKHRoaXMuZmlsdGVyKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSByZWFkb25seSBtb2RlbDogTW9kZWwsIHByaXZhdGUgZmlsdGVyOiBMb2dpY2FsT3BlcmFuZDxQcmVkaWNhdGU+KSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgICB0aGlzLmV4cHIgPSBleHByZXNzaW9uKHRoaXMubW9kZWwsIHRoaXMuZmlsdGVyLCB0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0ZpbHRlclRyYW5zZm9ybSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgZXhwcjogdGhpcy5leHByXG4gICAgfTtcbiAgfVxufVxuIl19