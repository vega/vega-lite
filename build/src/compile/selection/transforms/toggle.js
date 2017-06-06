"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
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
            (selCmpt.resolve === 'global' ?
                signal + " ? null : true, " :
                signal + " ? null : {unit: " + util_1.stringValue(model.getName('')) + "}, ") +
            (signal + " ? " + tpl + " : null");
    }
};
exports.default = toggle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBDO0FBQzFDLDBDQUFtQztBQUduQyxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFFekIsSUFBTSxNQUFNLEdBQXFCO0lBQy9CLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTTtZQUMzQixLQUFLLEVBQUUsS0FBSztZQUNaLEVBQUUsRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUMsQ0FBQztTQUN2RCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ3ZDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsaUJBQUssRUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBRW5DLE1BQU0sQ0FBSSxNQUFNLGtCQUFhLEdBQUcsT0FBSTtZQUNsQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUTtnQkFDeEIsTUFBTSxxQkFBa0I7Z0JBQ3hCLE1BQU0seUJBQW9CLGtCQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFLLENBQUM7YUFDaEUsTUFBTSxXQUFNLEdBQUcsWUFBUyxDQUFBLENBQUM7SUFDaEMsQ0FBQztDQUNGLENBQUM7QUFFZ0IseUJBQU8ifQ==