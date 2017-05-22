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
            ("values: " + values + ", ") +
            selCmpt.project.map(function (p, i) {
                return p.field + ": " + values + "[" + i + "]";
            }).join(', ');
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + tpl + ".unit}");
    }
};
exports.default = single;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1QztBQUN2QyxpQ0FBNEI7QUFDNUIseUNBQTREO0FBRTVELElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsZUFBSyxDQUFDLFNBQVM7SUFFMUIsT0FBTyxFQUFFLGVBQUssQ0FBQyxPQUFPO0lBRXRCLGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUMvQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUF2QixDQUF1QixDQUFDLENBQUM7UUFDakUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBRSxVQUFRLGtCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDLFNBQU07U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2hDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFNLElBQUksWUFBUyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxnQkFBYyxJQUFJLDRCQUF1QixJQUFJLGNBQVc7YUFDN0QsYUFBVyxNQUFNLE9BQUksQ0FBQTtZQUNyQixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDO2dCQUMvQixNQUFNLENBQUksQ0FBQyxDQUFDLEtBQUssVUFBSyxNQUFNLFNBQUksQ0FBQyxNQUFHLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBVSxHQUFHLFdBQVEsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FDRixDQUFDO0FBRWdCLHlCQUFPIn0=