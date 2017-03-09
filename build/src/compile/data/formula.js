"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
function parse(model) {
    return (model.calculate() || []).reduce(function (formulaComponent, formula) {
        formulaComponent[util_1.hash(formula)] = formula;
        return formulaComponent;
    }, {});
}
exports.formula = {
    parseUnit: parse,
    parseFacet: function (model) {
        var formulaComponent = parse(model);
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then merge
        if (!childDataComponent.source) {
            util_1.extend(formulaComponent, childDataComponent.calculate);
            delete childDataComponent.calculate;
        }
        return formulaComponent;
    },
    parseLayer: function (model) {
        var formulaComponent = parse(model);
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source && childDataComponent.calculate) {
                util_1.extend(formulaComponent || {}, childDataComponent.calculate);
                delete childDataComponent.calculate;
            }
        });
        return formulaComponent;
    },
    assemble: function (component) {
        return util_1.vals(component).reduce(function (transform, f) {
            transform.push(util_1.extend({ type: 'formula' }, f));
            return transform;
        }, []);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXVsYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZm9ybXVsYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG1DQUFvRDtBQU1wRCxlQUFlLEtBQVk7SUFDekIsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFTLGdCQUFnQixFQUFFLE9BQU87UUFDeEUsZ0JBQWdCLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRVksUUFBQSxPQUFPLEdBQXlDO0lBQzNELFNBQVMsRUFBRSxLQUFLO0lBRWhCLFVBQVUsRUFBRSxVQUFTLEtBQWlCO1FBQ3BDLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRXRELHdEQUF3RDtRQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0IsYUFBTSxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sa0JBQWtCLENBQUMsU0FBUyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQWlCO1FBQ3BDLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMzQixJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxJQUFJLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELGFBQU0sQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdELE9BQU8sa0JBQWtCLENBQUMsU0FBUyxDQUFDO1lBQ3RDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQsUUFBUSxFQUFFLFVBQVMsU0FBd0I7UUFDekMsTUFBTSxDQUFDLFdBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBUyxTQUFjLEVBQUUsQ0FBTTtZQUMzRCxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztDQUNGLENBQUMifQ==