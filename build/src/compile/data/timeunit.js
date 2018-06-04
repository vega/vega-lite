"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var timeunit_1 = require("../../timeunit");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var TimeUnitNode = /** @class */ (function (_super) {
    tslib_1.__extends(TimeUnitNode, _super);
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
        var _a;
        return new TimeUnitNode(parent, (_a = {},
            _a[t.field] = {
                as: t.as,
                timeUnit: t.timeUnit,
                field: t.field
            },
            _a));
    };
    TimeUnitNode.prototype.merge = function (other) {
        this.formula = tslib_1.__assign({}, this.formula, other.formula);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF1QztBQUN2QywyQ0FBbUQ7QUFFbkQsbUNBQXVEO0FBR3ZELHVDQUF3QztBQVN4QztJQUFrQyx3Q0FBWTtJQUs1QyxzQkFBWSxNQUFvQixFQUFVLE9BQWdDO1FBQTFFLFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBQ2Q7UUFGeUMsYUFBTyxHQUFQLE9BQU8sQ0FBeUI7O0lBRTFFLENBQUM7SUFOTSw0QkFBSyxHQUFaO1FBQ0UsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBTWEsNkJBQWdCLEdBQTlCLFVBQStCLE1BQW9CLEVBQUUsS0FBcUI7UUFDeEUsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFDLGlCQUFvQyxFQUFFLFFBQVE7WUFDbEYsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO2dCQUNyQixJQUFNLENBQUMsR0FBRyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRztvQkFDckIsRUFBRSxFQUFFLENBQUM7b0JBQ0wsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO29CQUMzQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7aUJBQ3RCLENBQUM7YUFDSDtZQUNELE9BQU8saUJBQWlCLENBQUM7UUFDM0IsQ0FBQyxFQUFFLEVBQTZCLENBQUMsQ0FBQztRQUVsQyxJQUFJLFdBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRWEsOEJBQWlCLEdBQS9CLFVBQWdDLE1BQW9CLEVBQUUsQ0FBb0I7O1FBQ3hFLE9BQU8sSUFBSSxZQUFZLENBQUMsTUFBTTtZQUM1QixHQUFDLENBQUMsQ0FBQyxLQUFLLElBQUc7Z0JBQ1QsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNSLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUTtnQkFDcEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO2FBQ2Y7Z0JBQ0QsQ0FBQztJQUNMLENBQUM7SUFFTSw0QkFBSyxHQUFaLFVBQWEsS0FBbUI7UUFDOUIsSUFBSSxDQUFDLE9BQU8sd0JBQU8sSUFBSSxDQUFDLE9BQU8sRUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTSxxQ0FBYyxHQUFyQjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLFdBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVNLHNDQUFlLEdBQXRCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1lBQzdCLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNSLElBQUksRUFBRSxvQkFBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUNmLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBekVELENBQWtDLHVCQUFZLEdBeUU3QztBQXpFWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtmaWVsZEV4cHIsIFRpbWVVbml0fSBmcm9tICcuLi8uLi90aW1ldW5pdCc7XG5pbXBvcnQge1RpbWVVbml0VHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGUsIGtleXMsIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0Zvcm11bGFUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7TW9kZWxXaXRoRmllbGR9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVVbml0Q29tcG9uZW50IHtcbiAgYXM6IHN0cmluZztcbiAgdGltZVVuaXQ6IFRpbWVVbml0O1xuICBmaWVsZDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZVVuaXROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgVGltZVVuaXROb2RlKG51bGwsIGR1cGxpY2F0ZSh0aGlzLmZvcm11bGEpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIGZvcm11bGE6IERpY3Q8VGltZVVuaXRDb21wb25lbnQ+KSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21FbmNvZGluZyhwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsV2l0aEZpZWxkKSB7XG4gICAgY29uc3QgZm9ybXVsYSA9IG1vZGVsLnJlZHVjZUZpZWxkRGVmKCh0aW1lVW5pdENvbXBvbmVudDogVGltZVVuaXRDb21wb25lbnQsIGZpZWxkRGVmKSA9PiB7XG4gICAgICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgY29uc3QgZiA9IHZnRmllbGQoZmllbGREZWYpO1xuICAgICAgICB0aW1lVW5pdENvbXBvbmVudFtmXSA9IHtcbiAgICAgICAgICBhczogZixcbiAgICAgICAgICB0aW1lVW5pdDogZmllbGREZWYudGltZVVuaXQsXG4gICAgICAgICAgZmllbGQ6IGZpZWxkRGVmLmZpZWxkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdGltZVVuaXRDb21wb25lbnQ7XG4gICAgfSwge30gYXMgRGljdDxUaW1lVW5pdENvbXBvbmVudD4pO1xuXG4gICAgaWYgKGtleXMoZm9ybXVsYSkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRpbWVVbml0Tm9kZShwYXJlbnQsIGZvcm11bGEpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgdDogVGltZVVuaXRUcmFuc2Zvcm0pIHtcbiAgICByZXR1cm4gbmV3IFRpbWVVbml0Tm9kZShwYXJlbnQsIHtcbiAgICAgIFt0LmZpZWxkXToge1xuICAgICAgICBhczogdC5hcyxcbiAgICAgICAgdGltZVVuaXQ6IHQudGltZVVuaXQsXG4gICAgICAgIGZpZWxkOiB0LmZpZWxkXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFRpbWVVbml0Tm9kZSkge1xuICAgIHRoaXMuZm9ybXVsYSA9IHsuLi50aGlzLmZvcm11bGEsIC4uLm90aGVyLmZvcm11bGF9O1xuICAgIG90aGVyLnJlbW92ZSgpO1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgdmFscyh0aGlzLmZvcm11bGEpLmZvckVhY2goZiA9PiB7XG4gICAgICBvdXRbZi5hc10gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICB2YWxzKHRoaXMuZm9ybXVsYSkuZm9yRWFjaChmID0+IHtcbiAgICAgIG91dFtmLmZpZWxkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCkge1xuICAgIHJldHVybiB2YWxzKHRoaXMuZm9ybXVsYSkubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBhczogYy5hcyxcbiAgICAgICAgZXhwcjogZmllbGRFeHByKGMudGltZVVuaXQsIGMuZmllbGQpXG4gICAgICB9IGFzIFZnRm9ybXVsYVRyYW5zZm9ybTtcbiAgICB9KTtcbiAgfVxufVxuIl19