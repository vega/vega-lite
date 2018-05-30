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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXVDO0FBRXZDLG1DQUFxQztBQUVyQyx1Q0FBd0M7QUFFeEM7O0dBRUc7QUFDSDtJQUF5QywrQ0FBWTtJQUtuRCw2QkFBWSxNQUFvQixFQUFVLFNBQTBCO1FBQXBFLFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBQ2Q7UUFGeUMsZUFBUyxHQUFULFNBQVMsQ0FBaUI7O0lBRXBFLENBQUM7SUFOTSxtQ0FBSyxHQUFaO1FBQ0ksT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBTU0sNENBQWMsR0FBckI7UUFBQSxpQkFPQztRQU5DLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLGNBQWM7WUFDMUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTyw0Q0FBYyxHQUF0QixVQUF1QixjQUE4QjtRQUNuRCxPQUFPLGNBQWMsQ0FBQyxFQUFFLElBQUksa0JBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0sc0NBQVEsR0FBZjtRQUNFLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFNLEdBQUcsR0FBbUMsRUFBRSxDQUFDO1FBQy9DLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixLQUFxQixVQUFxQixFQUFyQixLQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFyQixjQUFxQixFQUFyQixJQUFxQjtZQUFyQyxJQUFNLFFBQU0sU0FBQTtZQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBTSxVQUFVLEdBQWEsRUFBRSxDQUFDO1FBQ2hDLElBQU0sU0FBUyxHQUF3QixFQUFFLENBQUM7UUFDMUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDckMsS0FBd0IsVUFBbUIsRUFBbkIsS0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7Z0JBQXRDLElBQU0sU0FBUyxTQUFBO2dCQUNsQixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBMEIsQ0FBQyxDQUFDO2FBQzdGO1NBQ0Y7UUFDRCxJQUFNLElBQUksR0FBaUI7WUFDekIsS0FBSyxFQUFFLFVBQVU7WUFDakIsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQztRQUNGLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBRS9DLElBQU0sTUFBTSxHQUFzQjtZQUNoQyxJQUFJLEVBQUUsUUFBUTtZQUNkLE1BQU0sUUFBQTtZQUNOLEVBQUUsSUFBQTtZQUNGLEdBQUcsS0FBQTtZQUNILE1BQU0sUUFBQTtZQUNOLElBQUksTUFBQTtTQUNMLENBQUM7UUFFRixJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFDN0IsTUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7U0FDbEM7UUFFRCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDMUI7UUFFRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDdEI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBekVELENBQXlDLHVCQUFZLEdBeUVwRDtBQXpFWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7dmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtXaW5kb3dGaWVsZERlZiwgV2luZG93T25seU9wLCBXaW5kb3dUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQ29tcGFyYXRvciwgVmdDb21wYXJhdG9yT3JkZXIsIFZnV2luZG93VHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbi8qKlxuICogQSBjbGFzcyBmb3IgdGhlIHdpbmRvdyB0cmFuc2Zvcm0gbm9kZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFdpbmRvd1RyYW5zZm9ybU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgICByZXR1cm4gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUodGhpcy5wYXJlbnQsIGR1cGxpY2F0ZSh0aGlzLnRyYW5zZm9ybSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgdHJhbnNmb3JtOiBXaW5kb3dUcmFuc2Zvcm0pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuICAgIHRoaXMudHJhbnNmb3JtLndpbmRvdy5mb3JFYWNoKHdpbmRvd0ZpZWxkRGVmID0+IHtcbiAgICAgIG91dFt0aGlzLmdldERlZmF1bHROYW1lKHdpbmRvd0ZpZWxkRGVmKV0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVmYXVsdE5hbWUod2luZG93RmllbGREZWY6IFdpbmRvd0ZpZWxkRGVmKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd2luZG93RmllbGREZWYuYXMgfHwgdmdGaWVsZCh3aW5kb3dGaWVsZERlZik7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdXaW5kb3dUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBvcHM6IChBZ2dyZWdhdGVPcCB8IFdpbmRvd09ubHlPcClbXSA9IFtdO1xuICAgIGNvbnN0IGFzID0gW107XG4gICAgY29uc3QgcGFyYW1zID0gW107XG4gICAgZm9yIChjb25zdCB3aW5kb3cgb2YgdGhpcy50cmFuc2Zvcm0ud2luZG93KSB7XG4gICAgICBvcHMucHVzaCh3aW5kb3cub3ApO1xuICAgICAgYXMucHVzaCh0aGlzLmdldERlZmF1bHROYW1lKHdpbmRvdykpO1xuICAgICAgcGFyYW1zLnB1c2god2luZG93LnBhcmFtID09PSB1bmRlZmluZWQgPyBudWxsIDogd2luZG93LnBhcmFtKTtcbiAgICAgIGZpZWxkcy5wdXNoKHdpbmRvdy5maWVsZCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHdpbmRvdy5maWVsZCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhbWUgPSB0aGlzLnRyYW5zZm9ybS5mcmFtZTtcbiAgICBjb25zdCBncm91cGJ5ID0gdGhpcy50cmFuc2Zvcm0uZ3JvdXBieTtcbiAgICBjb25zdCBzb3J0RmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IHNvcnRPcmRlcjogVmdDb21wYXJhdG9yT3JkZXJbXSA9IFtdO1xuICAgIGlmICh0aGlzLnRyYW5zZm9ybS5zb3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoY29uc3Qgc29ydEZpZWxkIG9mIHRoaXMudHJhbnNmb3JtLnNvcnQpIHtcbiAgICAgICAgc29ydEZpZWxkcy5wdXNoKHNvcnRGaWVsZC5maWVsZCk7XG4gICAgICAgIHNvcnRPcmRlci5wdXNoKHNvcnRGaWVsZC5vcmRlciA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHNvcnRGaWVsZC5vcmRlciBhcyBWZ0NvbXBhcmF0b3JPcmRlcik7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHNvcnQ6IFZnQ29tcGFyYXRvciA9IHtcbiAgICAgIGZpZWxkOiBzb3J0RmllbGRzLFxuICAgICAgb3JkZXI6IHNvcnRPcmRlcixcbiAgICB9O1xuICAgIGNvbnN0IGlnbm9yZVBlZXJzID0gdGhpcy50cmFuc2Zvcm0uaWdub3JlUGVlcnM7XG5cbiAgICBjb25zdCByZXN1bHQ6IFZnV2luZG93VHJhbnNmb3JtID0ge1xuICAgICAgdHlwZTogJ3dpbmRvdycsXG4gICAgICBwYXJhbXMsXG4gICAgICBhcyxcbiAgICAgIG9wcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIHNvcnQsXG4gICAgfTtcblxuICAgIGlmIChpZ25vcmVQZWVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQuaWdub3JlUGVlcnMgPSBpZ25vcmVQZWVycztcbiAgICB9XG5cbiAgICBpZiAoZ3JvdXBieSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQuZ3JvdXBieSA9IGdyb3VwYnk7XG4gICAgfVxuXG4gICAgaWYgKGZyYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5mcmFtZSA9IGZyYW1lO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==