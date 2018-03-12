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
    function TimeUnitNode(parent, formula) {
        var _this = _super.call(this, parent) || this;
        _this.formula = formula;
        return _this;
    }
    TimeUnitNode.prototype.clone = function () {
        return new TimeUnitNode(null, util_1.duplicate(this.formula));
    };
    TimeUnitNode.makeFromEncoding = function (parent, model) {
        var formula = model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
            if (fieldDef.timeUnit) {
                var f = fielddef_1.vgField(fieldDef);
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
        return new TimeUnitNode(parent, formula);
    };
    TimeUnitNode.makeFromTransform = function (parent, t) {
        return new TimeUnitNode(parent, (_a = {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXVDO0FBQ3ZDLDJDQUFtRDtBQUVuRCxtQ0FBdUQ7QUFHdkQsdUNBQXdDO0FBU3hDO0lBQWtDLGdDQUFZO0lBSzVDLHNCQUFZLE1BQW9CLEVBQVUsT0FBZ0M7UUFBMUUsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FDZDtRQUZ5QyxhQUFPLEdBQVAsT0FBTyxDQUF5Qjs7SUFFMUUsQ0FBQztJQU5NLDRCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQU1hLDZCQUFnQixHQUE5QixVQUErQixNQUFvQixFQUFFLEtBQXFCO1FBQ3hFLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxpQkFBb0MsRUFBRSxRQUFRO1lBQ2xGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFNLENBQUMsR0FBRyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRztvQkFDckIsRUFBRSxFQUFFLENBQUM7b0JBQ0wsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO29CQUMzQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7aUJBQ3RCLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQzNCLENBQUMsRUFBRSxFQUE2QixDQUFDLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRWEsOEJBQWlCLEdBQS9CLFVBQWdDLE1BQW9CLEVBQUUsQ0FBb0I7UUFDeEUsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU07WUFDNUIsR0FBQyxDQUFDLENBQUMsS0FBSyxJQUFHO2dCQUNULEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSzthQUNmO2dCQUNELENBQUM7O0lBQ0wsQ0FBQztJQUVNLDRCQUFLLEdBQVosVUFBYSxLQUFtQjtRQUM5QixJQUFJLENBQUMsT0FBTyxnQkFBTyxJQUFJLENBQUMsT0FBTyxFQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVNLHFDQUFjLEdBQXJCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxzQ0FBZSxHQUF0QjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLFdBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDN0IsTUFBTSxDQUFDO2dCQUNMLElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUixJQUFJLEVBQUUsb0JBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDZixDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXpFRCxDQUFrQyx1QkFBWSxHQXlFN0M7QUF6RVksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3ZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7ZmllbGRFeHByLCBUaW1lVW5pdH0gZnJvbSAnLi4vLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlLCBrZXlzLCB2YWxzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGb3JtdWxhVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lVW5pdENvbXBvbmVudCB7XG4gIGFzOiBzdHJpbmc7XG4gIHRpbWVVbml0OiBUaW1lVW5pdDtcbiAgZmllbGQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFRpbWVVbml0Tm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVVbml0Tm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5mb3JtdWxhKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSBmb3JtdWxhOiBEaWN0PFRpbWVVbml0Q29tcG9uZW50Pikge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICAgIGNvbnN0IGZvcm11bGEgPSBtb2RlbC5yZWR1Y2VGaWVsZERlZigodGltZVVuaXRDb21wb25lbnQ6IFRpbWVVbml0Q29tcG9uZW50LCBmaWVsZERlZikgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGNvbnN0IGYgPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcbiAgICAgICAgdGltZVVuaXRDb21wb25lbnRbZl0gPSB7XG4gICAgICAgICAgYXM6IGYsXG4gICAgICAgICAgdGltZVVuaXQ6IGZpZWxkRGVmLnRpbWVVbml0LFxuICAgICAgICAgIGZpZWxkOiBmaWVsZERlZi5maWVsZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVVbml0Q29tcG9uZW50O1xuICAgIH0sIHt9IGFzIERpY3Q8VGltZVVuaXRDb21wb25lbnQ+KTtcblxuICAgIGlmIChrZXlzKGZvcm11bGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUocGFyZW50LCBmb3JtdWxhKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHQ6IFRpbWVVbml0VHJhbnNmb3JtKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUocGFyZW50LCB7XG4gICAgICBbdC5maWVsZF06IHtcbiAgICAgICAgYXM6IHQuYXMsXG4gICAgICAgIHRpbWVVbml0OiB0LnRpbWVVbml0LFxuICAgICAgICBmaWVsZDogdC5maWVsZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBUaW1lVW5pdE5vZGUpIHtcbiAgICB0aGlzLmZvcm11bGEgPSB7Li4udGhpcy5mb3JtdWxhLCAuLi5vdGhlci5mb3JtdWxhfTtcbiAgICBvdGhlci5yZW1vdmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIHZhbHModGhpcy5mb3JtdWxhKS5mb3JFYWNoKGYgPT4ge1xuICAgICAgb3V0W2YuYXNdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgdmFscyh0aGlzLmZvcm11bGEpLmZvckVhY2goZiA9PiB7XG4gICAgICBvdXRbZi5maWVsZF0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpIHtcbiAgICByZXR1cm4gdmFscyh0aGlzLmZvcm11bGEpLm1hcChjID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgYXM6IGMuYXMsXG4gICAgICAgIGV4cHI6IGZpZWxkRXhwcihjLnRpbWVVbml0LCBjLmZpZWxkKVxuICAgICAgfSBhcyBWZ0Zvcm11bGFUcmFuc2Zvcm07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==