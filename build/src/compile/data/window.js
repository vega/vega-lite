"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
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
        return new WindowTransformNode(this.parent, util_1.duplicate(this.transform));
    };
    WindowTransformNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        this.transform.window.forEach(function (windowFieldDef) {
            out[_this.getDefaultName(windowFieldDef)] = true;
        });
        return out;
    };
    WindowTransformNode.prototype.getDefaultName = function (windowFieldDef) {
        return windowFieldDef.as === undefined ? String(windowFieldDef.op) + '_field' : windowFieldDef.as;
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
                sortOrder.push(sortField.order === undefined ? null : sortField.order);
            }
        }
        var sort = {
            field: sortFields,
            order: sortOrder,
        };
        var ignorePeers = this.transform.ignorePeers;
        var result = {
            type: 'window',
            params: params,
            as: as,
            ops: ops,
            fields: fields,
            sort: sort,
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
}(dataflow_1.DataFlowNode));
exports.WindowTransformNode = WindowTransformNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbUNBQXFDO0FBRXJDLHVDQUF3QztBQUV4Qzs7R0FFRztBQUNIO0lBQXlDLCtDQUFZO0lBS25ELDZCQUFZLE1BQW9CLEVBQVUsU0FBMEI7UUFBcEUsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FDZDtRQUZ5QyxlQUFTLEdBQVQsU0FBUyxDQUFpQjs7SUFFcEUsQ0FBQztJQU5NLG1DQUFLLEdBQVo7UUFDSSxPQUFPLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxnQkFBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFNTSw0Q0FBYyxHQUFyQjtRQUFBLGlCQU9DO1FBTkMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsY0FBYztZQUMxQyxHQUFHLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVPLDRDQUFjLEdBQXRCLFVBQXVCLGNBQThCO1FBQ25ELE9BQU8sY0FBYyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO0lBQ3BHLENBQUM7SUFFTSxzQ0FBUSxHQUFmO1FBQ0UsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQU0sR0FBRyxHQUFtQyxFQUFFLENBQUM7UUFDL0MsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLEtBQXFCLFVBQXFCLEVBQXJCLEtBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQXJCLGNBQXFCLEVBQXJCLElBQXFCO1lBQXJDLElBQU0sUUFBTSxTQUFBO1lBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQU0sQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN2QyxJQUFNLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFDaEMsSUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUNyQyxLQUF3QixVQUFtQixFQUFuQixLQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFuQixjQUFtQixFQUFuQixJQUFtQjtnQkFBdEMsSUFBTSxTQUFTLFNBQUE7Z0JBQ2xCLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUEwQixDQUFDLENBQUM7YUFDN0Y7U0FDRjtRQUNELElBQU0sSUFBSSxHQUFpQjtZQUN6QixLQUFLLEVBQUUsVUFBVTtZQUNqQixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDO1FBQ0YsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFFL0MsSUFBTSxNQUFNLEdBQXNCO1lBQ2hDLElBQUksRUFBRSxRQUFRO1lBQ2QsTUFBTSxRQUFBO1lBQ04sRUFBRSxJQUFBO1lBQ0YsR0FBRyxLQUFBO1lBQ0gsTUFBTSxRQUFBO1lBQ04sSUFBSSxNQUFBO1NBQ0wsQ0FBQztRQUVGLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztTQUNsQztRQUVELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN6QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMxQjtRQUVELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN0QjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUF6RUQsQ0FBeUMsdUJBQVksR0F5RXBEO0FBekVZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuaW1wb3J0IHtXaW5kb3dGaWVsZERlZiwgV2luZG93T25seU9wLCBXaW5kb3dUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQ29tcGFyYXRvciwgVmdDb21wYXJhdG9yT3JkZXIsIFZnV2luZG93VHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbi8qKlxuICogQSBjbGFzcyBmb3IgdGhlIHdpbmRvdyB0cmFuc2Zvcm0gbm9kZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFdpbmRvd1RyYW5zZm9ybU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgICByZXR1cm4gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUodGhpcy5wYXJlbnQsIGR1cGxpY2F0ZSh0aGlzLnRyYW5zZm9ybSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgdHJhbnNmb3JtOiBXaW5kb3dUcmFuc2Zvcm0pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuICAgIHRoaXMudHJhbnNmb3JtLndpbmRvdy5mb3JFYWNoKHdpbmRvd0ZpZWxkRGVmID0+IHtcbiAgICAgIG91dFt0aGlzLmdldERlZmF1bHROYW1lKHdpbmRvd0ZpZWxkRGVmKV0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVmYXVsdE5hbWUod2luZG93RmllbGREZWY6IFdpbmRvd0ZpZWxkRGVmKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd2luZG93RmllbGREZWYuYXMgPT09IHVuZGVmaW5lZCA/IFN0cmluZyh3aW5kb3dGaWVsZERlZi5vcCkgKyAnX2ZpZWxkJyA6IHdpbmRvd0ZpZWxkRGVmLmFzO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnV2luZG93VHJhbnNmb3JtIHtcbiAgICBjb25zdCBmaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3Qgb3BzOiAoQWdncmVnYXRlT3AgfCBXaW5kb3dPbmx5T3ApW10gPSBbXTtcbiAgICBjb25zdCBhcyA9IFtdO1xuICAgIGNvbnN0IHBhcmFtcyA9IFtdO1xuICAgIGZvciAoY29uc3Qgd2luZG93IG9mIHRoaXMudHJhbnNmb3JtLndpbmRvdykge1xuICAgICAgb3BzLnB1c2god2luZG93Lm9wKTtcbiAgICAgIGFzLnB1c2godGhpcy5nZXREZWZhdWx0TmFtZSh3aW5kb3cpKTtcbiAgICAgIHBhcmFtcy5wdXNoKHdpbmRvdy5wYXJhbSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHdpbmRvdy5wYXJhbSk7XG4gICAgICBmaWVsZHMucHVzaCh3aW5kb3cuZmllbGQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB3aW5kb3cuZmllbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYW1lID0gdGhpcy50cmFuc2Zvcm0uZnJhbWU7XG4gICAgY29uc3QgZ3JvdXBieSA9IHRoaXMudHJhbnNmb3JtLmdyb3VwYnk7XG4gICAgY29uc3Qgc29ydEZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBzb3J0T3JkZXI6IFZnQ29tcGFyYXRvck9yZGVyW10gPSBbXTtcbiAgICBpZiAodGhpcy50cmFuc2Zvcm0uc29ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGNvbnN0IHNvcnRGaWVsZCBvZiB0aGlzLnRyYW5zZm9ybS5zb3J0KSB7XG4gICAgICAgIHNvcnRGaWVsZHMucHVzaChzb3J0RmllbGQuZmllbGQpO1xuICAgICAgICBzb3J0T3JkZXIucHVzaChzb3J0RmllbGQub3JkZXIgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBzb3J0RmllbGQub3JkZXIgYXMgVmdDb21wYXJhdG9yT3JkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzb3J0OiBWZ0NvbXBhcmF0b3IgPSB7XG4gICAgICBmaWVsZDogc29ydEZpZWxkcyxcbiAgICAgIG9yZGVyOiBzb3J0T3JkZXIsXG4gICAgfTtcbiAgICBjb25zdCBpZ25vcmVQZWVycyA9IHRoaXMudHJhbnNmb3JtLmlnbm9yZVBlZXJzO1xuXG4gICAgY29uc3QgcmVzdWx0OiBWZ1dpbmRvd1RyYW5zZm9ybSA9IHtcbiAgICAgIHR5cGU6ICd3aW5kb3cnLFxuICAgICAgcGFyYW1zLFxuICAgICAgYXMsXG4gICAgICBvcHMsXG4gICAgICBmaWVsZHMsXG4gICAgICBzb3J0LFxuICAgIH07XG5cbiAgICBpZiAoaWdub3JlUGVlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0Lmlnbm9yZVBlZXJzID0gaWdub3JlUGVlcnM7XG4gICAgfVxuXG4gICAgaWYgKGdyb3VwYnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0Lmdyb3VwYnkgPSBncm91cGJ5O1xuICAgIH1cblxuICAgIGlmIChmcmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQuZnJhbWUgPSBmcmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=