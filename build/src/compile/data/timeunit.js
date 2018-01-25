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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXVDO0FBQ3ZDLDJDQUFtRDtBQUVuRCxtQ0FBdUQ7QUFHdkQsdUNBQXdDO0FBU3hDO0lBQWtDLGdDQUFZO0lBSzVDLHNCQUFvQixPQUFnQztRQUFwRCxZQUNFLGlCQUFPLFNBQ1I7UUFGbUIsYUFBTyxHQUFQLE9BQU8sQ0FBeUI7O0lBRXBELENBQUM7SUFOTSw0QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQU1hLDZCQUFnQixHQUE5QixVQUErQixLQUFxQjtRQUNsRCxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQUMsaUJBQW9DLEVBQUUsUUFBUTtZQUNsRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxDQUFDLEdBQUcsa0JBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUIsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUc7b0JBQ3JCLEVBQUUsRUFBRSxDQUFDO29CQUNMLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtvQkFDM0IsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO2lCQUN0QixDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUMzQixDQUFDLEVBQUUsRUFBNkIsQ0FBQyxDQUFDO1FBRWxDLEVBQUUsQ0FBQyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRWEsOEJBQWlCLEdBQS9CLFVBQWdDLENBQW9CO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLFlBQVk7WUFDckIsR0FBQyxDQUFDLENBQUMsS0FBSyxJQUFHO2dCQUNULEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSzthQUNmO2dCQUNELENBQUM7O0lBQ0wsQ0FBQztJQUVNLDRCQUFLLEdBQVosVUFBYSxLQUFtQjtRQUM5QixJQUFJLENBQUMsT0FBTyxnQkFBTyxJQUFJLENBQUMsT0FBTyxFQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVNLHFDQUFjLEdBQXJCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxzQ0FBZSxHQUF0QjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLFdBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDN0IsTUFBTSxDQUFDO2dCQUNMLElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUixJQUFJLEVBQUUsb0JBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDZixDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXpFRCxDQUFrQyx1QkFBWSxHQXlFN0M7QUF6RVksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3ZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7ZmllbGRFeHByLCBUaW1lVW5pdH0gZnJvbSAnLi4vLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlLCBrZXlzLCB2YWxzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGb3JtdWxhVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lVW5pdENvbXBvbmVudCB7XG4gIGFzOiBzdHJpbmc7XG4gIHRpbWVVbml0OiBUaW1lVW5pdDtcbiAgZmllbGQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFRpbWVVbml0Tm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVVbml0Tm9kZShkdXBsaWNhdGUodGhpcy5mb3JtdWxhKSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZvcm11bGE6IERpY3Q8VGltZVVuaXRDb21wb25lbnQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21FbmNvZGluZyhtb2RlbDogTW9kZWxXaXRoRmllbGQpIHtcbiAgICBjb25zdCBmb3JtdWxhID0gbW9kZWwucmVkdWNlRmllbGREZWYoKHRpbWVVbml0Q29tcG9uZW50OiBUaW1lVW5pdENvbXBvbmVudCwgZmllbGREZWYpID0+IHtcbiAgICAgIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBjb25zdCBmID0gdmdGaWVsZChmaWVsZERlZik7XG4gICAgICAgIHRpbWVVbml0Q29tcG9uZW50W2ZdID0ge1xuICAgICAgICAgIGFzOiBmLFxuICAgICAgICAgIHRpbWVVbml0OiBmaWVsZERlZi50aW1lVW5pdCxcbiAgICAgICAgICBmaWVsZDogZmllbGREZWYuZmllbGRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lVW5pdENvbXBvbmVudDtcbiAgICB9LCB7fSBhcyBEaWN0PFRpbWVVbml0Q29tcG9uZW50Pik7XG5cbiAgICBpZiAoa2V5cyhmb3JtdWxhKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGltZVVuaXROb2RlKGZvcm11bGEpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbVRyYW5zZm9ybSh0OiBUaW1lVW5pdFRyYW5zZm9ybSkge1xuICAgIHJldHVybiBuZXcgVGltZVVuaXROb2RlKHtcbiAgICAgIFt0LmZpZWxkXToge1xuICAgICAgICBhczogdC5hcyxcbiAgICAgICAgdGltZVVuaXQ6IHQudGltZVVuaXQsXG4gICAgICAgIGZpZWxkOiB0LmZpZWxkXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFRpbWVVbml0Tm9kZSkge1xuICAgIHRoaXMuZm9ybXVsYSA9IHsuLi50aGlzLmZvcm11bGEsIC4uLm90aGVyLmZvcm11bGF9O1xuICAgIG90aGVyLnJlbW92ZSgpO1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgdmFscyh0aGlzLmZvcm11bGEpLmZvckVhY2goZiA9PiB7XG4gICAgICBvdXRbZi5hc10gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICB2YWxzKHRoaXMuZm9ybXVsYSkuZm9yRWFjaChmID0+IHtcbiAgICAgIG91dFtmLmZpZWxkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCkge1xuICAgIHJldHVybiB2YWxzKHRoaXMuZm9ybXVsYSkubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBhczogYy5hcyxcbiAgICAgICAgZXhwcjogZmllbGRFeHByKGMudGltZVVuaXQsIGMuZmllbGQpXG4gICAgICB9IGFzIFZnRm9ybXVsYVRyYW5zZm9ybTtcbiAgICB9KTtcbiAgfVxufVxuIl19