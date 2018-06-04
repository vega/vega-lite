"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: 'vlSingle',
    scaleDomain: 'vlSingleDomain',
    signals: multi_1.signals,
    topLevelSignals: function (model, selCmpt, signals) {
        var hasSignal = signals.filter(function (s) { return s.name === selCmpt.name; });
        var data = "data(" + vega_util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFzQztBQUV0QyxpQ0FBZ0Q7QUFDaEQseUNBQXNFO0FBR3RFLElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsVUFBVTtJQUNyQixXQUFXLEVBQUUsZ0JBQWdCO0lBRTdCLE9BQU8sRUFBRSxlQUFZO0lBRXJCLGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUMvQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUF2QixDQUF1QixDQUFDLENBQUM7UUFDakUsSUFBTSxJQUFJLEdBQUcsVUFBUSx1QkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsaUJBQUssQ0FBQyxNQUFHLENBQUM7UUFDMUQsSUFBTSxNQUFNLEdBQU0sSUFBSSxlQUFZLENBQUM7UUFDbkMsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBSyxJQUFJLGlCQUFjO2dCQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBRyxDQUFDLENBQUMsS0FBSyxVQUFLLE1BQU0sU0FBSSxDQUFDLE1BQUcsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHO1NBQ2hGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsT0FBTyxHQUFHLEdBQUcsSUFBSTtZQUNmLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBVSxvQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFHLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RyaW5nVmFsdWV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbmltcG9ydCB7c2lnbmFscyBhcyBtdWx0aVNpZ25hbHN9IGZyb20gJy4vbXVsdGknO1xuaW1wb3J0IHtTZWxlY3Rpb25Db21waWxlciwgU1RPUkUsIFRVUExFLCB1bml0TmFtZX0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuXG5cbmNvbnN0IHNpbmdsZTpTZWxlY3Rpb25Db21waWxlciA9IHtcbiAgcHJlZGljYXRlOiAndmxTaW5nbGUnLFxuICBzY2FsZURvbWFpbjogJ3ZsU2luZ2xlRG9tYWluJyxcblxuICBzaWduYWxzOiBtdWx0aVNpZ25hbHMsXG5cbiAgdG9wTGV2ZWxTaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgc2lnbmFscykge1xuICAgIGNvbnN0IGhhc1NpZ25hbCA9IHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09IHNlbENtcHQubmFtZSk7XG4gICAgY29uc3QgZGF0YSA9IGBkYXRhKCR7c3RyaW5nVmFsdWUoc2VsQ21wdC5uYW1lICsgU1RPUkUpfSlgO1xuICAgIGNvbnN0IHZhbHVlcyA9IGAke2RhdGF9WzBdLnZhbHVlc2A7XG4gICAgcmV0dXJuIGhhc1NpZ25hbC5sZW5ndGggPyBzaWduYWxzIDogc2lnbmFscy5jb25jYXQoe1xuICAgICAgbmFtZTogc2VsQ21wdC5uYW1lLFxuICAgICAgdXBkYXRlOiBgJHtkYXRhfS5sZW5ndGggJiYge2AgK1xuICAgICAgICBzZWxDbXB0LnByb2plY3QubWFwKChwLCBpKSA9PiBgJHtwLmZpZWxkfTogJHt2YWx1ZXN9WyR7aX1dYCkuam9pbignLCAnKSArICd9J1xuICAgIH0pO1xuICB9LFxuXG4gIG1vZGlmeUV4cHI6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgdHBsID0gc2VsQ21wdC5uYW1lICsgVFVQTEU7XG4gICAgcmV0dXJuIHRwbCArICcsICcgK1xuICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAndHJ1ZScgOiBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2luZ2xlO1xuIl19