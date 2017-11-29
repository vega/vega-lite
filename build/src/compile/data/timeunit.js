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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../../fielddef");
var timeunit_1 = require("../../timeunit");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var TimeUnitNode = /** @class */ (function (_super) {
    __extends(TimeUnitNode, _super);
    function TimeUnitNode(formula) {
        var _this = _super.call(this) || this;
        _this.formula = formula;
        return _this;
    }
    TimeUnitNode.prototype.clone = function () {
        return new TimeUnitNode(util_1.duplicate(this.formula));
    };
    TimeUnitNode.makeFromEncoding = function (model) {
        var formula = model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
            if (fieldDef.timeUnit) {
                var f = fielddef_1.field(fieldDef);
                timeUnitComponent[f] = {
                    as: f,
                    timeUnit: fieldDef.timeUnit,
                    field: fieldDef.field
                };
            }
            return timeUnitComponent;
        }, {});
        if (util_1.keys(formula).length === 0) {
            return null;
        }
        return new TimeUnitNode(formula);
    };
    TimeUnitNode.makeFromTransform = function (t) {
        return new TimeUnitNode((_a = {},
            _a[t.field] = {
                as: t.as,
                timeUnit: t.timeUnit,
                field: t.field
            },
            _a));
        var _a;
    };
    TimeUnitNode.prototype.merge = function (other) {
        this.formula = __assign({}, this.formula, other.formula);
        other.remove();
    };
    TimeUnitNode.prototype.producedFields = function () {
        var out = {};
        util_1.vals(this.formula).forEach(function (f) {
            out[f.as] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.dependentFields = function () {
        var out = {};
        util_1.vals(this.formula).forEach(function (f) {
            out[f.field] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.assemble = function () {
        return util_1.vals(this.formula).map(function (c) {
            return {
                type: 'formula',
                as: c.as,
                expr: timeunit_1.fieldExpr(c.timeUnit, c.field)
            };
        });
    };
    return TimeUnitNode;
}(dataflow_1.DataFlowNode));
exports.TimeUnitNode = TimeUnitNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXFDO0FBQ3JDLDJDQUFtRDtBQUVuRCxtQ0FBdUQ7QUFHdkQsdUNBQXdDO0FBU3hDO0lBQWtDLGdDQUFZO0lBSzVDLHNCQUFvQixPQUFnQztRQUFwRCxZQUNFLGlCQUFPLFNBQ1I7UUFGbUIsYUFBTyxHQUFQLE9BQU8sQ0FBeUI7O0lBRXBELENBQUM7SUFOTSw0QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQU1hLDZCQUFnQixHQUE5QixVQUErQixLQUFxQjtRQUNsRCxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQUMsaUJBQW9DLEVBQUUsUUFBUTtZQUNsRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxDQUFDLEdBQUcsZ0JBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUc7b0JBQ3JCLEVBQUUsRUFBRSxDQUFDO29CQUNMLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtvQkFDM0IsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO2lCQUN0QixDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUMzQixDQUFDLEVBQUUsRUFBNkIsQ0FBQyxDQUFDO1FBRWxDLEVBQUUsQ0FBQyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRWEsOEJBQWlCLEdBQS9CLFVBQWdDLENBQW9CO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLFlBQVk7WUFDckIsR0FBQyxDQUFDLENBQUMsS0FBSyxJQUFHO2dCQUNULEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSzthQUNmO2dCQUNELENBQUM7O0lBQ0wsQ0FBQztJQUVNLDRCQUFLLEdBQVosVUFBYSxLQUFtQjtRQUM5QixJQUFJLENBQUMsT0FBTyxnQkFBTyxJQUFJLENBQUMsT0FBTyxFQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVNLHFDQUFjLEdBQXJCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxzQ0FBZSxHQUF0QjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLFdBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDN0IsTUFBTSxDQUFDO2dCQUNMLElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUixJQUFJLEVBQUUsb0JBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDZixDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXpFRCxDQUFrQyx1QkFBWSxHQXlFN0M7QUF6RVksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge2ZpZWxkRXhwciwgVGltZVVuaXR9IGZyb20gJy4uLy4uL3RpbWV1bml0JztcbmltcG9ydCB7VGltZVVuaXRUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGR1cGxpY2F0ZSwga2V5cywgdmFsc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRm9ybXVsYVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZVVuaXRDb21wb25lbnQge1xuICBhczogc3RyaW5nO1xuICB0aW1lVW5pdDogVGltZVVuaXQ7XG4gIGZpZWxkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lVW5pdE5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUoZHVwbGljYXRlKHRoaXMuZm9ybXVsYSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmb3JtdWxhOiBEaWN0PFRpbWVVbml0Q29tcG9uZW50Pikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcobW9kZWw6IE1vZGVsV2l0aEZpZWxkKSB7XG4gICAgY29uc3QgZm9ybXVsYSA9IG1vZGVsLnJlZHVjZUZpZWxkRGVmKCh0aW1lVW5pdENvbXBvbmVudDogVGltZVVuaXRDb21wb25lbnQsIGZpZWxkRGVmKSA9PiB7XG4gICAgICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgY29uc3QgZiA9IGZpZWxkKGZpZWxkRGVmKTtcbiAgICAgICAgdGltZVVuaXRDb21wb25lbnRbZl0gPSB7XG4gICAgICAgICAgYXM6IGYsXG4gICAgICAgICAgdGltZVVuaXQ6IGZpZWxkRGVmLnRpbWVVbml0LFxuICAgICAgICAgIGZpZWxkOiBmaWVsZERlZi5maWVsZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVVbml0Q29tcG9uZW50O1xuICAgIH0sIHt9IGFzIERpY3Q8VGltZVVuaXRDb21wb25lbnQ+KTtcblxuICAgIGlmIChrZXlzKGZvcm11bGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUoZm9ybXVsYSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tVHJhbnNmb3JtKHQ6IFRpbWVVbml0VHJhbnNmb3JtKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUoe1xuICAgICAgW3QuZmllbGRdOiB7XG4gICAgICAgIGFzOiB0LmFzLFxuICAgICAgICB0aW1lVW5pdDogdC50aW1lVW5pdCxcbiAgICAgICAgZmllbGQ6IHQuZmllbGRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZShvdGhlcjogVGltZVVuaXROb2RlKSB7XG4gICAgdGhpcy5mb3JtdWxhID0gey4uLnRoaXMuZm9ybXVsYSwgLi4ub3RoZXIuZm9ybXVsYX07XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICB2YWxzKHRoaXMuZm9ybXVsYSkuZm9yRWFjaChmID0+IHtcbiAgICAgIG91dFtmLmFzXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIHZhbHModGhpcy5mb3JtdWxhKS5mb3JFYWNoKGYgPT4ge1xuICAgICAgb3V0W2YuZmllbGRdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKSB7XG4gICAgcmV0dXJuIHZhbHModGhpcy5mb3JtdWxhKS5tYXAoYyA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGFzOiBjLmFzLFxuICAgICAgICBleHByOiBmaWVsZEV4cHIoYy50aW1lVW5pdCwgYy5maWVsZClcbiAgICAgIH0gYXMgVmdGb3JtdWxhVHJhbnNmb3JtO1xuICAgIH0pO1xuICB9XG59XG4iXX0=