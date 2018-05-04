import * as tslib_1 from "tslib";
import { vgField } from '../../fielddef';
import { fieldExpr } from '../../timeunit';
import { duplicate, keys, vals } from '../../util';
import { DataFlowNode } from './dataflow';
var TimeUnitNode = /** @class */ (function (_super) {
    tslib_1.__extends(TimeUnitNode, _super);
    function TimeUnitNode(parent, formula) {
        var _this = _super.call(this, parent) || this;
        _this.formula = formula;
        return _this;
    }
    TimeUnitNode.prototype.clone = function () {
        return new TimeUnitNode(null, duplicate(this.formula));
    };
    TimeUnitNode.makeFromEncoding = function (parent, model) {
        var formula = model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
            if (fieldDef.timeUnit) {
                var f = vgField(fieldDef);
                timeUnitComponent[f] = {
                    as: f,
                    timeUnit: fieldDef.timeUnit,
                    field: fieldDef.field
                };
            }
            return timeUnitComponent;
        }, {});
        if (keys(formula).length === 0) {
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
        this.formula = tslib_1.__assign({}, this.formula, other.formula);
        other.remove();
    };
    TimeUnitNode.prototype.producedFields = function () {
        var out = {};
        vals(this.formula).forEach(function (f) {
            out[f.as] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.dependentFields = function () {
        var out = {};
        vals(this.formula).forEach(function (f) {
            out[f.field] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.assemble = function () {
        return vals(this.formula).map(function (c) {
            return {
                type: 'formula',
                as: c.as,
                expr: fieldExpr(c.timeUnit, c.field)
            };
        });
    };
    return TimeUnitNode;
}(DataFlowNode));
export { TimeUnitNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkMsT0FBTyxFQUFDLFNBQVMsRUFBVyxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBTyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUd2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBU3hDO0lBQWtDLHdDQUFZO0lBSzVDLHNCQUFZLE1BQW9CLEVBQVUsT0FBZ0M7UUFBMUUsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FDZDtRQUZ5QyxhQUFPLEdBQVAsT0FBTyxDQUF5Qjs7SUFFMUUsQ0FBQztJQU5NLDRCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQU1hLDZCQUFnQixHQUE5QixVQUErQixNQUFvQixFQUFFLEtBQXFCO1FBQ3hFLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxpQkFBb0MsRUFBRSxRQUFRO1lBQ2xGLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtnQkFDckIsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRztvQkFDckIsRUFBRSxFQUFFLENBQUM7b0JBQ0wsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO29CQUMzQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7aUJBQ3RCLENBQUM7YUFDSDtZQUNELE9BQU8saUJBQWlCLENBQUM7UUFDM0IsQ0FBQyxFQUFFLEVBQTZCLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRWEsOEJBQWlCLEdBQS9CLFVBQWdDLE1BQW9CLEVBQUUsQ0FBb0I7UUFDeEUsT0FBTyxJQUFJLFlBQVksQ0FBQyxNQUFNO1lBQzVCLEdBQUMsQ0FBQyxDQUFDLEtBQUssSUFBRztnQkFDVCxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1IsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO2dCQUNwQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7YUFDZjtnQkFDRCxDQUFDOztJQUNMLENBQUM7SUFFTSw0QkFBSyxHQUFaLFVBQWEsS0FBbUI7UUFDOUIsSUFBSSxDQUFDLE9BQU8sd0JBQU8sSUFBSSxDQUFDLE9BQU8sRUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTSxxQ0FBYyxHQUFyQjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVNLHNDQUFlLEdBQXRCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1lBQzdCLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ2YsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUF6RUQsQ0FBa0MsWUFBWSxHQXlFN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3ZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7ZmllbGRFeHByLCBUaW1lVW5pdH0gZnJvbSAnLi4vLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlLCBrZXlzLCB2YWxzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGb3JtdWxhVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lVW5pdENvbXBvbmVudCB7XG4gIGFzOiBzdHJpbmc7XG4gIHRpbWVVbml0OiBUaW1lVW5pdDtcbiAgZmllbGQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFRpbWVVbml0Tm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVVbml0Tm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5mb3JtdWxhKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSBmb3JtdWxhOiBEaWN0PFRpbWVVbml0Q29tcG9uZW50Pikge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICAgIGNvbnN0IGZvcm11bGEgPSBtb2RlbC5yZWR1Y2VGaWVsZERlZigodGltZVVuaXRDb21wb25lbnQ6IFRpbWVVbml0Q29tcG9uZW50LCBmaWVsZERlZikgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGNvbnN0IGYgPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcbiAgICAgICAgdGltZVVuaXRDb21wb25lbnRbZl0gPSB7XG4gICAgICAgICAgYXM6IGYsXG4gICAgICAgICAgdGltZVVuaXQ6IGZpZWxkRGVmLnRpbWVVbml0LFxuICAgICAgICAgIGZpZWxkOiBmaWVsZERlZi5maWVsZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVVbml0Q29tcG9uZW50O1xuICAgIH0sIHt9IGFzIERpY3Q8VGltZVVuaXRDb21wb25lbnQ+KTtcblxuICAgIGlmIChrZXlzKGZvcm11bGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUocGFyZW50LCBmb3JtdWxhKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHQ6IFRpbWVVbml0VHJhbnNmb3JtKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lVW5pdE5vZGUocGFyZW50LCB7XG4gICAgICBbdC5maWVsZF06IHtcbiAgICAgICAgYXM6IHQuYXMsXG4gICAgICAgIHRpbWVVbml0OiB0LnRpbWVVbml0LFxuICAgICAgICBmaWVsZDogdC5maWVsZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBUaW1lVW5pdE5vZGUpIHtcbiAgICB0aGlzLmZvcm11bGEgPSB7Li4udGhpcy5mb3JtdWxhLCAuLi5vdGhlci5mb3JtdWxhfTtcbiAgICBvdGhlci5yZW1vdmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIHZhbHModGhpcy5mb3JtdWxhKS5mb3JFYWNoKGYgPT4ge1xuICAgICAgb3V0W2YuYXNdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgdmFscyh0aGlzLmZvcm11bGEpLmZvckVhY2goZiA9PiB7XG4gICAgICBvdXRbZi5maWVsZF0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpIHtcbiAgICByZXR1cm4gdmFscyh0aGlzLmZvcm11bGEpLm1hcChjID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgYXM6IGMuYXMsXG4gICAgICAgIGV4cHI6IGZpZWxkRXhwcihjLnRpbWVVbml0LCBjLmZpZWxkKVxuICAgICAgfSBhcyBWZ0Zvcm11bGFUcmFuc2Zvcm07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==