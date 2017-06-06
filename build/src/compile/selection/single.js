"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: multi_1.default.predicate,
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt, signals) {
        var hasSignal = signals.filter(function (s) { return s.name === selCmpt.name; });
        return hasSignal.length ? signals : signals.concat({
            name: selCmpt.name,
            update: "data(" + util_1.stringValue(selCmpt.name + selection_1.STORE) + ")[0]"
        });
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name, values = name + ".values";
        return "encodings: " + name + ".encodings, fields: " + name + ".fields, " +
            ("values: " + values + ", bins: " + name + ".bins, ") +
            selCmpt.project.map(function (p, i) {
                return p.field + ": " + values + "[" + i + "]";
            }).join(', ');
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + util_1.stringValue(model.getName('')) + "}");
    }
};
exports.default = single;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1QztBQUN2QyxpQ0FBNEI7QUFDNUIseUNBQTREO0FBRTVELElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsZUFBSyxDQUFDLFNBQVM7SUFFMUIsT0FBTyxFQUFFLGVBQUssQ0FBQyxPQUFPO0lBRXRCLGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUMvQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUF2QixDQUF1QixDQUFDLENBQUM7UUFDakUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBRSxVQUFRLGtCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDLFNBQU07U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2hDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFNLElBQUksWUFBUyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxnQkFBYyxJQUFJLDRCQUF1QixJQUFJLGNBQVc7YUFDN0QsYUFBVyxNQUFNLGdCQUFXLElBQUksWUFBUyxDQUFBO1lBQ3pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sQ0FBSSxDQUFDLENBQUMsS0FBSyxVQUFLLE1BQU0sU0FBSSxDQUFDLE1BQUcsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsaUJBQUssQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUk7WUFDZixDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxHQUFHLE1BQU0sR0FBRyxZQUFVLGtCQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFHLENBQUMsQ0FBQztJQUMxRixDQUFDO0NBQ0YsQ0FBQztBQUVnQix5QkFBTyJ9