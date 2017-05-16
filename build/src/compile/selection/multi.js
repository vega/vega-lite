"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var selection_1 = require("./selection");
var multi = {
    predicate: 'vlPoint',
    signals: function (model, selCmpt) {
        var proj = selCmpt.project, datum = '(item().isVoronoi ? datum.datum : datum)', encodings = proj.map(function (p) { return util_1.stringValue(p.encoding); }).join(', '), fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return datum + "[" + util_1.stringValue(p.field) + "]"; }).join(', ');
        return [{
                name: selCmpt.name,
                value: {},
                on: [{
                        events: selCmpt.events,
                        update: "{encodings: [" + encodings + "], fields: [" + fields + "], values: [" + values + "]}"
                    }]
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name;
        return "encodings: " + name + ".encodings, fields: " + name + ".fields, values: " + name + ".values";
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'null' : "{unit: " + tpl + ".unit}");
    }
};
exports.default = multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBdUM7QUFDdkMseUNBQXFEO0FBRXJELElBQU0sS0FBSyxHQUFxQjtJQUM5QixTQUFTLEVBQUUsU0FBUztJQUVwQixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUN4QixLQUFLLEdBQUksMENBQTBDLEVBQ25ELFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsa0JBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQy9ELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3pELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUcsS0FBSyxTQUFJLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFHLEVBQW5DLENBQW1DLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO2dCQUNsQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBRSxrQkFBZ0IsU0FBUyxvQkFBZSxNQUFNLG9CQUFlLE1BQU0sT0FBSTtxQkFDaEYsQ0FBQzthQUNILENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNoQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxnQkFBYyxJQUFJLDRCQUF1QixJQUFJLHlCQUFvQixJQUFJLFlBQVMsQ0FBQztJQUN4RixDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSTtZQUNmLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVUsR0FBRyxXQUFRLENBQUMsQ0FBQztJQUNwRSxDQUFDO0NBQ0YsQ0FBQztBQUVlLHdCQUFPIn0=