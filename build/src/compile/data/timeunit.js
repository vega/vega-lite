"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var timeunit_1 = require("../../timeunit");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var TimeUnitNode = (function (_super) {
    tslib_1.__extends(TimeUnitNode, _super);
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
            if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
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
        this.formula = util_1.extend(this.formula, other.formula);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFxQztBQUNyQywyQ0FBbUQ7QUFFbkQsbUNBQW9DO0FBQ3BDLG1DQUErRDtBQUcvRCx1Q0FBd0M7QUFTeEM7SUFBa0Msd0NBQVk7SUFLNUMsc0JBQW9CLE9BQWdDO1FBQXBELFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixhQUFPLEdBQVAsT0FBTyxDQUF5Qjs7SUFFcEQsQ0FBQztJQU5NLDRCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBTWEsNkJBQWdCLEdBQTlCLFVBQStCLEtBQXFCO1FBQ2xELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxpQkFBb0MsRUFBRSxRQUFRO1lBQ2xGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssZUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFNLENBQUMsR0FBRyxnQkFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMxQixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRztvQkFDckIsRUFBRSxFQUFFLENBQUM7b0JBQ0wsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO29CQUMzQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7aUJBQ3RCLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQzNCLENBQUMsRUFBRSxFQUE2QixDQUFDLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFYSw4QkFBaUIsR0FBL0IsVUFBZ0MsQ0FBb0I7UUFDbEQsTUFBTSxDQUFDLElBQUksWUFBWTtZQUNyQixHQUFDLENBQUMsQ0FBQyxLQUFLLElBQUc7Z0JBQ1QsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNSLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUTtnQkFDcEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO2FBQ2Y7Z0JBQ0QsQ0FBQzs7SUFDTCxDQUFDO0lBRU0sNEJBQUssR0FBWixVQUFhLEtBQW1CO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRU0scUNBQWMsR0FBckI7UUFDRSxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFZixXQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDMUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVNLHNDQUFlLEdBQXRCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSwrQkFBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztZQUM3QixNQUFNLENBQUM7Z0JBQ0wsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNSLElBQUksRUFBRSxvQkFBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUNmLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBekVELENBQWtDLHVCQUFZLEdBeUU3QztBQXpFWSxvQ0FBWSJ9