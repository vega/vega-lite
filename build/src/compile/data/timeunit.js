"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../../fielddef");
var timeunit_1 = require("../../timeunit");
var type_1 = require("../../type");
var util_1 = require("../../util");
function parse(model) {
    return model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
        if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
            var f = fielddef_1.field(fieldDef);
            timeUnitComponent[f] = {
                type: 'formula',
                as: f,
                expr: timeunit_1.fieldExpr(fieldDef.timeUnit, fieldDef.field)
            };
        }
        return timeUnitComponent;
    }, {});
}
exports.timeUnit = {
    parseUnit: parse,
    parseFacet: function (model) {
        var timeUnitComponent = parse(model);
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then merge
        if (!childDataComponent.source) {
            util_1.extend(timeUnitComponent, childDataComponent.timeUnit);
            delete childDataComponent.timeUnit;
        }
        return timeUnitComponent;
    },
    parseLayer: function (model) {
        var timeUnitComponent = parse(model);
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source) {
                util_1.extend(timeUnitComponent, childDataComponent.timeUnit);
                delete childDataComponent.timeUnit;
            }
        });
        return timeUnitComponent;
    },
    assemble: function (component) {
        // just join the values, which are already transforms
        return util_1.vals(component);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsMkNBQStDO0FBQy9DLDJDQUF5QztBQUN6QyxtQ0FBb0M7QUFDcEMsbUNBQThDO0FBTzlDLGVBQWUsS0FBWTtJQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFTLGlCQUEyQyxFQUFFLFFBQWtCO1FBQ2xHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssZUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRXBELElBQU0sQ0FBQyxHQUFHLGdCQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUIsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUc7Z0JBQ3JCLElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxDQUFDO2dCQUNMLElBQUksRUFBRSxvQkFBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQzthQUNuRCxDQUFDO1FBQ0osQ0FBQztRQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUMzQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRVksUUFBQSxRQUFRLEdBQW9EO0lBQ3ZFLFNBQVMsRUFBRSxLQUFLO0lBRWhCLFVBQVUsRUFBRSxVQUFVLEtBQWlCO1FBQ3JDLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJDLElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRXRELHdEQUF3RDtRQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0IsYUFBTSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sa0JBQWtCLENBQUMsUUFBUSxDQUFDO1FBQ3JDLENBQUM7UUFDRCxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQWlCO1FBQ3BDLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMzQixJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsYUFBTSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztZQUNyQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUNELFFBQVEsRUFBRSxVQUFTLFNBQW1DO1FBQ3BELHFEQUFxRDtRQUNyRCxNQUFNLENBQUMsV0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Q0FDRixDQUFDIn0=