"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("../selection");
var TOGGLE = '_toggle';
var toggle = {
    has: function (selCmpt) {
        return selCmpt.type === 'multi' && selCmpt.toggle;
    },
    signals: function (model, selCmpt, signals) {
        return signals.concat({
            name: selCmpt.name + TOGGLE,
            value: false,
            on: [{ events: selCmpt.events, update: selCmpt.toggle }]
        });
    },
    modifyExpr: function (model, selCmpt, expr) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        var signal = selCmpt.name + TOGGLE;
        return signal + " ? null : " + tpl + ", " +
            (selCmpt.resolve === 'global' ?
                signal + " ? null : true, " :
                signal + " ? null : {unit: " + selection_1.unitName(model) + "}, ") +
            (signal + " ? " + tpl + " : null");
    }
};
exports.default = toggle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMENBQTZDO0FBSTdDLElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUV6QixJQUFNLE1BQU0sR0FBcUI7SUFDL0IsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNwRCxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU07WUFDM0IsS0FBSyxFQUFFLEtBQUs7WUFDWixFQUFFLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFDLENBQUM7U0FDdkQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUN2QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFFckMsTUFBTSxDQUFJLE1BQU0sa0JBQWEsR0FBRyxPQUFJO1lBQ2xDLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRO2dCQUN4QixNQUFNLHFCQUFrQjtnQkFDeEIsTUFBTSx5QkFBb0Isb0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBSyxDQUFDO2FBQ2pELE1BQU0sV0FBTSxHQUFHLFlBQVMsQ0FBQSxDQUFDO0lBQ2hDLENBQUM7Q0FDRixDQUFDO0FBRWdCLHlCQUFPIn0=