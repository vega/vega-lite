"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var selection_1 = require("./selection");
var multi = {
    predicate: 'vlPoint',
    signals: function (model, selCmpt) {
        var proj = selCmpt.project, datum = '(item().isVoronoi ? datum.datum : datum)', fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return datum + "[" + util_1.stringValue(p.field) + "]"; }).join(', ');
        return [{
                name: selCmpt.name,
                value: {},
                on: [{
                        events: selCmpt.events,
                        update: "{fields: [" + fields + "], values: [" + values + "]}"
                    }]
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name;
        return "fields: " + name + ".fields, values: " + name + ".values";
    },
    modifyExpr: function (model, selCmpt) {
        return selCmpt.name + selection_1.TUPLE;
    }
};
exports.default = multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBdUM7QUFDdkMseUNBQXFEO0FBRXJELElBQU0sS0FBSyxHQUFxQjtJQUM5QixTQUFTLEVBQUUsU0FBUztJQUVwQixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUN4QixLQUFLLEdBQUksMENBQTBDLEVBQ25ELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3pELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUcsS0FBSyxTQUFJLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFHLEVBQW5DLENBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO2dCQUNsQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBRSxlQUFhLE1BQU0sb0JBQWUsTUFBTSxPQUFJO3FCQUNyRCxDQUFDO2FBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2hDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsTUFBTSxDQUFDLGFBQVcsSUFBSSx5QkFBb0IsSUFBSSxZQUFTLENBQUM7SUFDMUQsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7SUFDOUIsQ0FBQztDQUNGLENBQUM7QUFFZSx3QkFBTyJ9