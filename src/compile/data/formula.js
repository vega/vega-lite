"use strict";
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
        var childDataComponent = model.child().component.data;
        // If child doesn't have its own data source, then merge
        if (!childDataComponent.source) {
            util_1.extend(formulaComponent, childDataComponent.calculate);
            delete childDataComponent.calculate;
        }
        return formulaComponent;
    },
    parseLayer: function (model) {
        var formulaComponent = parse(model);
        model.children().forEach(function (child) {
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
//# sourceMappingURL=formula.js.map