"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: multi_1.default.predicate,
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt) {
        var name = selCmpt.name;
        return [{
                name: name,
                update: "data(" + util_1.stringValue(name + selection_1.STORE) + ")[0]"
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name, values = name + ".values";
        return "fields: " + name + ".fields, values: " + values + ", " +
            selCmpt.project.map(function (p, i) {
                return p.field + ": " + values + "[" + i + "]";
            }).join(', ');
    },
    modifyExpr: function (model, selCmpt) {
        return selCmpt.name + selection_1.TUPLE + ', true';
    }
};
exports.default = single;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1QztBQUN2QyxpQ0FBNEI7QUFDNUIseUNBQTREO0FBRTVELElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsZUFBSyxDQUFDLFNBQVM7SUFFMUIsT0FBTyxFQUFFLGVBQUssQ0FBQyxPQUFPO0lBRXRCLGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ3RDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsTUFBTSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLFVBQVEsa0JBQVcsQ0FBQyxJQUFJLEdBQUcsaUJBQUssQ0FBQyxTQUFNO2FBQ2hELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNoQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sR0FBTSxJQUFJLFlBQVMsQ0FBQztRQUNyRCxNQUFNLENBQUMsYUFBVyxJQUFJLHlCQUFvQixNQUFNLE9BQUk7WUFDbEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxDQUFJLENBQUMsQ0FBQyxLQUFLLFVBQUssTUFBTSxTQUFJLENBQUMsTUFBRyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsaUJBQUssR0FBRyxRQUFRLENBQUM7SUFDekMsQ0FBQztDQUNGLENBQUM7QUFFZ0IseUJBQU8ifQ==