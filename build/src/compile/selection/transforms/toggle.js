"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("../selection");
var TOGGLE = '_toggle';
var toggle = {
    has: function (selCmpt) {
        return selCmpt.toggle !== undefined && selCmpt.toggle !== false;
    },
    signals: function (model, selCmpt, signals) {
        return signals.concat({
            name: selCmpt.name + TOGGLE,
            value: false,
            on: [{ events: selCmpt.events, update: selCmpt.toggle }]
        });
    },
    modifyExpr: function (model, selCmpt, expr) {
        var tpl = selCmpt.name + selection_1.TUPLE, signal = selCmpt.name + TOGGLE;
        return signal + " ? null : " + tpl + ", " +
            (signal + " ? null : true, ") +
            (signal + " ? " + tpl + " : null");
    }
};
exports.default = toggle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQW1DO0FBR25DLElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUV6QixJQUFNLE1BQU0sR0FBcUI7SUFDL0IsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUM7SUFDbEUsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNO1lBQzNCLEtBQUssRUFBRSxLQUFLO1lBQ1osRUFBRSxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBQyxDQUFDO1NBQ3ZELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDdkMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxFQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFFbkMsTUFBTSxDQUFJLE1BQU0sa0JBQWEsR0FBRyxPQUFJO2FBQy9CLE1BQU0scUJBQWtCLENBQUE7YUFDeEIsTUFBTSxXQUFNLEdBQUcsWUFBUyxDQUFBLENBQUM7SUFDaEMsQ0FBQztDQUNGLENBQUM7QUFFZ0IseUJBQU8ifQ==