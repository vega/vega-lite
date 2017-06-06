"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var selection_1 = require("./selection");
var multi = {
    predicate: 'vlPoint',
    signals: function (model, selCmpt) {
        var proj = selCmpt.project, datum = '(item().isVoronoi ? datum.datum : datum)', bins = {}, encodings = proj.map(function (p) { return util_1.stringValue(p.encoding); }).filter(function (e) { return e; }).join(', '), fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) {
            var channel = p.encoding;
            // Binned fields should capture extents, for a range test against the raw field.
            return model.fieldDef(channel).bin ? (bins[p.field] = 1,
                "[" + datum + "[" + util_1.stringValue(model.field(channel, { binSuffix: 'start' })) + "], " +
                    (datum + "[" + util_1.stringValue(model.field(channel, { binSuffix: 'end' })) + "]]")) :
                datum + "[" + util_1.stringValue(p.field) + "]";
        }).join(', ');
        return [{
                name: selCmpt.name,
                value: {},
                on: [{
                        events: selCmpt.events,
                        update: "{encodings: [" + encodings + "], fields: [" + fields + "], values: [" + values + "]" +
                            (util_1.keys(bins).length ? ", bins: " + JSON.stringify(bins) + "}" : '}')
                    }]
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name;
        return "encodings: " + name + ".encodings, fields: " + name + ".fields, " +
            ("values: " + name + ".values, bins: " + name + ".bins");
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'null' : "{unit: " + util_1.stringValue(model.getName('')) + "}");
    }
};
exports.default = multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBNkM7QUFDN0MseUNBQXFEO0FBRXJELElBQU0sS0FBSyxHQUFxQjtJQUM5QixTQUFTLEVBQUUsU0FBUztJQUVwQixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUN4QixLQUFLLEdBQUksMENBQTBDLEVBQ25ELElBQUksR0FBRyxFQUFFLEVBQ1QsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ2hGLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3pELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztZQUNsQixJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzNCLGdGQUFnRjtZQUNoRixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3JELE1BQUksS0FBSyxTQUFJLGtCQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxRQUFLO3FCQUNuRSxLQUFLLFNBQUksa0JBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLE9BQUksQ0FBQSxDQUFDO2dCQUN0RSxLQUFLLFNBQUksa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQUcsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEIsTUFBTSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO2dCQUNsQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBRSxrQkFBZ0IsU0FBUyxvQkFBZSxNQUFNLG9CQUFlLE1BQU0sTUFBRzs0QkFDNUUsQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLGFBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBRyxHQUFHLEdBQUcsQ0FBQztxQkFDakUsQ0FBQzthQUNILENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNoQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxnQkFBYyxJQUFJLDRCQUF1QixJQUFJLGNBQVc7YUFDN0QsYUFBVyxJQUFJLHVCQUFrQixJQUFJLFVBQU8sQ0FBQSxDQUFDO0lBQ2pELENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBVSxrQkFBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBRyxDQUFDLENBQUM7SUFDMUYsQ0FBQztDQUNGLENBQUM7QUFFZSx3QkFBTyJ9