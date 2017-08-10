"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: 'vlSingle',
    scaleDomain: 'vlSingleDomain',
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt, signals) {
        var hasSignal = signals.filter(function (s) { return s.name === selCmpt.name; });
        var data = "data(" + util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
        var values = data + "[0].values";
        return hasSignal.length ? signals : signals.concat({
            name: selCmpt.name,
            update: data + ".length && {" +
                selCmpt.project.map(function (p, i) { return p.field + ": " + values + "[" + i + "]"; }).join(', ') + '}'
        });
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + selection_1.unitName(model) + "}");
    }
};
exports.default = single;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1QztBQUN2QyxpQ0FBNEI7QUFDNUIseUNBQXNFO0FBR3RFLElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsVUFBVTtJQUNyQixXQUFXLEVBQUUsZ0JBQWdCO0lBRTdCLE9BQU8sRUFBRSxlQUFLLENBQUMsT0FBTztJQUV0QixlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0MsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sSUFBSSxHQUFHLFVBQVEsa0JBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUMsTUFBRyxDQUFDO1FBQzFELElBQU0sTUFBTSxHQUFNLElBQUksZUFBWSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2pELElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNsQixNQUFNLEVBQUssSUFBSSxpQkFBYztnQkFDM0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUcsQ0FBQyxDQUFDLEtBQUssVUFBSyxNQUFNLFNBQUksQ0FBQyxNQUFHLEVBQTdCLENBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRztTQUNoRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSTtZQUNmLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVUsb0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBRyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGLENBQUM7QUFFZ0IseUJBQU8ifQ==