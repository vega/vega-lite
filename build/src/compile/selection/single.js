"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: multi_1.default.predicate,
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt) {
        return [{
                name: selCmpt.name,
                update: "data(" + util_1.stringValue(selCmpt.name + selection_1.STORE) + ")[0]"
            }];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1QztBQUN2QyxpQ0FBNEI7QUFDNUIseUNBQTREO0FBRTVELElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsZUFBSyxDQUFDLFNBQVM7SUFFMUIsT0FBTyxFQUFFLGVBQUssQ0FBQyxPQUFPO0lBRXRCLGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ3RDLE1BQU0sQ0FBQyxDQUFDO2dCQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtnQkFDbEIsTUFBTSxFQUFFLFVBQVEsa0JBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUMsU0FBTTthQUN4RCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDaEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEdBQU0sSUFBSSxZQUFTLENBQUM7UUFDckQsTUFBTSxDQUFDLGdCQUFjLElBQUksNEJBQXVCLElBQUksY0FBVzthQUM3RCxhQUFXLE1BQU0sT0FBSSxDQUFBO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sQ0FBSSxDQUFDLENBQUMsS0FBSyxVQUFLLE1BQU0sU0FBSSxDQUFDLE1BQUcsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsaUJBQUssQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUk7WUFDZixDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxHQUFHLE1BQU0sR0FBRyxZQUFVLEdBQUcsV0FBUSxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNGLENBQUM7QUFFZ0IseUJBQU8ifQ==