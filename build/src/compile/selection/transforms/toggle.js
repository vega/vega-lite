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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMENBQTZDO0FBSTdDLElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUV6QixJQUFNLE1BQU0sR0FBcUI7SUFDL0IsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNwRCxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU07WUFDM0IsS0FBSyxFQUFFLEtBQUs7WUFDWixFQUFFLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFDLENBQUM7U0FDdkQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUN2QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFFckMsTUFBTSxDQUFJLE1BQU0sa0JBQWEsR0FBRyxPQUFJO1lBQ2xDLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxxQkFBa0IsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLHlCQUFvQixvQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFLLENBQUM7YUFDakQsTUFBTSxXQUFNLEdBQUcsWUFBUyxDQUFBLENBQUM7SUFDaEMsQ0FBQztDQUNGLENBQUM7QUFFZ0IseUJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7VFVQTEUsIHVuaXROYW1lfSBmcm9tICcuLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtUcmFuc2Zvcm1Db21waWxlcn0gZnJvbSAnLi90cmFuc2Zvcm1zJztcblxuXG5jb25zdCBUT0dHTEUgPSAnX3RvZ2dsZSc7XG5cbmNvbnN0IHRvZ2dsZTpUcmFuc2Zvcm1Db21waWxlciA9IHtcbiAgaGFzOiBmdW5jdGlvbihzZWxDbXB0KSB7XG4gICAgcmV0dXJuIHNlbENtcHQudHlwZSA9PT0gJ211bHRpJyAmJiBzZWxDbXB0LnRvZ2dsZTtcbiAgfSxcblxuICBzaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgc2lnbmFscykge1xuICAgIHJldHVybiBzaWduYWxzLmNvbmNhdCh7XG4gICAgICBuYW1lOiBzZWxDbXB0Lm5hbWUgKyBUT0dHTEUsXG4gICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICBvbjogW3tldmVudHM6IHNlbENtcHQuZXZlbnRzLCB1cGRhdGU6IHNlbENtcHQudG9nZ2xlfV1cbiAgICB9KTtcbiAgfSxcblxuICBtb2RpZnlFeHByOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgZXhwcikge1xuICAgIGNvbnN0IHRwbCA9IHNlbENtcHQubmFtZSArIFRVUExFO1xuICAgIGNvbnN0IHNpZ25hbCA9IHNlbENtcHQubmFtZSArIFRPR0dMRTtcblxuICAgIHJldHVybiBgJHtzaWduYWx9ID8gbnVsbCA6ICR7dHBsfSwgYCArXG4gICAgICAoc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyA/XG4gICAgICAgIGAke3NpZ25hbH0gPyBudWxsIDogdHJ1ZSwgYCA6XG4gICAgICAgIGAke3NpZ25hbH0gPyBudWxsIDoge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX0sIGApICtcbiAgICAgIGAke3NpZ25hbH0gPyAke3RwbH0gOiBudWxsYDtcbiAgfVxufTtcblxuZXhwb3J0IHt0b2dnbGUgYXMgZGVmYXVsdH07XG4iXX0=