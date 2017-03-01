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
//# sourceMappingURL=timeunit.js.map