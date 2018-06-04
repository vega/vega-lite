"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
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
        return windowFieldDef.as || fielddef_1.vgField(windowFieldDef);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXVDO0FBRXZDLG1DQUFxQztBQUVyQyx1Q0FBd0M7QUFFeEM7O0dBRUc7QUFDSDtJQUF5QywrQ0FBWTtJQUtuRCw2QkFBWSxNQUFvQixFQUFVLFNBQTBCO1FBQXBFLFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBQ2Q7UUFGeUMsZUFBUyxHQUFULFNBQVMsQ0FBaUI7O0lBRXBFLENBQUM7SUFOTSxtQ0FBSyxHQUFaO1FBQ0ksT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBTU0sNENBQWMsR0FBckI7UUFBQSxpQkFPQztRQU5DLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLGNBQWM7WUFDMUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTyw0Q0FBYyxHQUF0QixVQUF1QixjQUE4QjtRQUNuRCxPQUFPLGNBQWMsQ0FBQyxFQUFFLElBQUksa0JBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0sc0NBQVEsR0FBZjtRQUNFLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFNLEdBQUcsR0FBbUMsRUFBRSxDQUFDO1FBQy9DLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixLQUFxQixVQUFxQixFQUFyQixLQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFyQixjQUFxQixFQUFyQixJQUFxQixFQUFFO1lBQXZDLElBQU0sUUFBTSxTQUFBO1lBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQU0sQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN2QyxJQUFNLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFDaEMsSUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUNyQyxLQUF3QixVQUFtQixFQUFuQixLQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFuQixjQUFtQixFQUFuQixJQUFtQixFQUFFO2dCQUF4QyxJQUFNLFNBQVMsU0FBQTtnQkFDbEIsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQTBCLENBQUMsQ0FBQzthQUM3RjtTQUNGO1FBQ0QsSUFBTSxJQUFJLEdBQWlCO1lBQ3pCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUM7UUFDRixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUUvQyxJQUFNLE1BQU0sR0FBc0I7WUFDaEMsSUFBSSxFQUFFLFFBQVE7WUFDZCxNQUFNLFFBQUE7WUFDTixFQUFFLElBQUE7WUFDRixHQUFHLEtBQUE7WUFDSCxNQUFNLFFBQUE7WUFDTixJQUFJLE1BQUE7U0FDTCxDQUFDO1FBRUYsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQzFCO1FBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQXpFRCxDQUF5Qyx1QkFBWSxHQXlFcEQ7QUF6RVksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5pbXBvcnQge3ZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7V2luZG93RmllbGREZWYsIFdpbmRvd09ubHlPcCwgV2luZG93VHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0NvbXBhcmF0b3IsIFZnQ29tcGFyYXRvck9yZGVyLCBWZ1dpbmRvd1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG4vKipcbiAqIEEgY2xhc3MgZm9yIHRoZSB3aW5kb3cgdHJhbnNmb3JtIG5vZGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBXaW5kb3dUcmFuc2Zvcm1Ob2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgICAgcmV0dXJuIG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKHRoaXMucGFyZW50LCBkdXBsaWNhdGUodGhpcy50cmFuc2Zvcm0pKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIHRyYW5zZm9ybTogV2luZG93VHJhbnNmb3JtKSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcbiAgICB0aGlzLnRyYW5zZm9ybS53aW5kb3cuZm9yRWFjaCh3aW5kb3dGaWVsZERlZiA9PiB7XG4gICAgICBvdXRbdGhpcy5nZXREZWZhdWx0TmFtZSh3aW5kb3dGaWVsZERlZildID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwcml2YXRlIGdldERlZmF1bHROYW1lKHdpbmRvd0ZpZWxkRGVmOiBXaW5kb3dGaWVsZERlZik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHdpbmRvd0ZpZWxkRGVmLmFzIHx8IHZnRmllbGQod2luZG93RmllbGREZWYpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnV2luZG93VHJhbnNmb3JtIHtcbiAgICBjb25zdCBmaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3Qgb3BzOiAoQWdncmVnYXRlT3AgfCBXaW5kb3dPbmx5T3ApW10gPSBbXTtcbiAgICBjb25zdCBhcyA9IFtdO1xuICAgIGNvbnN0IHBhcmFtcyA9IFtdO1xuICAgIGZvciAoY29uc3Qgd2luZG93IG9mIHRoaXMudHJhbnNmb3JtLndpbmRvdykge1xuICAgICAgb3BzLnB1c2god2luZG93Lm9wKTtcbiAgICAgIGFzLnB1c2godGhpcy5nZXREZWZhdWx0TmFtZSh3aW5kb3cpKTtcbiAgICAgIHBhcmFtcy5wdXNoKHdpbmRvdy5wYXJhbSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHdpbmRvdy5wYXJhbSk7XG4gICAgICBmaWVsZHMucHVzaCh3aW5kb3cuZmllbGQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB3aW5kb3cuZmllbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYW1lID0gdGhpcy50cmFuc2Zvcm0uZnJhbWU7XG4gICAgY29uc3QgZ3JvdXBieSA9IHRoaXMudHJhbnNmb3JtLmdyb3VwYnk7XG4gICAgY29uc3Qgc29ydEZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBzb3J0T3JkZXI6IFZnQ29tcGFyYXRvck9yZGVyW10gPSBbXTtcbiAgICBpZiAodGhpcy50cmFuc2Zvcm0uc29ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGNvbnN0IHNvcnRGaWVsZCBvZiB0aGlzLnRyYW5zZm9ybS5zb3J0KSB7XG4gICAgICAgIHNvcnRGaWVsZHMucHVzaChzb3J0RmllbGQuZmllbGQpO1xuICAgICAgICBzb3J0T3JkZXIucHVzaChzb3J0RmllbGQub3JkZXIgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBzb3J0RmllbGQub3JkZXIgYXMgVmdDb21wYXJhdG9yT3JkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzb3J0OiBWZ0NvbXBhcmF0b3IgPSB7XG4gICAgICBmaWVsZDogc29ydEZpZWxkcyxcbiAgICAgIG9yZGVyOiBzb3J0T3JkZXIsXG4gICAgfTtcbiAgICBjb25zdCBpZ25vcmVQZWVycyA9IHRoaXMudHJhbnNmb3JtLmlnbm9yZVBlZXJzO1xuXG4gICAgY29uc3QgcmVzdWx0OiBWZ1dpbmRvd1RyYW5zZm9ybSA9IHtcbiAgICAgIHR5cGU6ICd3aW5kb3cnLFxuICAgICAgcGFyYW1zLFxuICAgICAgYXMsXG4gICAgICBvcHMsXG4gICAgICBmaWVsZHMsXG4gICAgICBzb3J0LFxuICAgIH07XG5cbiAgICBpZiAoaWdub3JlUGVlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0Lmlnbm9yZVBlZXJzID0gaWdub3JlUGVlcnM7XG4gICAgfVxuXG4gICAgaWYgKGdyb3VwYnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0Lmdyb3VwYnkgPSBncm91cGJ5O1xuICAgIH1cblxuICAgIGlmIChmcmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQuZnJhbWUgPSBmcmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=