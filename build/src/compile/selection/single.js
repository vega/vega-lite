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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUF1QztBQUN2QyxpQ0FBNEI7QUFDNUIseUNBQXNFO0FBR3RFLElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsVUFBVTtJQUNyQixXQUFXLEVBQUUsZ0JBQWdCO0lBRTdCLE9BQU8sRUFBRSxlQUFLLENBQUMsT0FBTztJQUV0QixlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0MsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sSUFBSSxHQUFHLFVBQVEsa0JBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUMsTUFBRyxDQUFDO1FBQzFELElBQU0sTUFBTSxHQUFNLElBQUksZUFBWSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBSyxJQUFJLGlCQUFjO2dCQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBRyxDQUFDLENBQUMsS0FBSyxVQUFLLE1BQU0sU0FBSSxDQUFDLE1BQUcsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHO1NBQ2hGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFVLG9CQUFRLENBQUMsS0FBSyxDQUFDLE1BQUcsQ0FBQyxDQUFDO0lBQzNFLENBQUM7Q0FDRixDQUFDO0FBRWdCLHlCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJpbmdWYWx1ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgbXVsdGkgZnJvbSAnLi9tdWx0aSc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBpbGVyLCBTVE9SRSwgVFVQTEUsIHVuaXROYW1lfSBmcm9tICcuL3NlbGVjdGlvbic7XG5cblxuY29uc3Qgc2luZ2xlOlNlbGVjdGlvbkNvbXBpbGVyID0ge1xuICBwcmVkaWNhdGU6ICd2bFNpbmdsZScsXG4gIHNjYWxlRG9tYWluOiAndmxTaW5nbGVEb21haW4nLFxuXG4gIHNpZ25hbHM6IG11bHRpLnNpZ25hbHMsXG5cbiAgdG9wTGV2ZWxTaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgc2lnbmFscykge1xuICAgIGNvbnN0IGhhc1NpZ25hbCA9IHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09IHNlbENtcHQubmFtZSk7XG4gICAgY29uc3QgZGF0YSA9IGBkYXRhKCR7c3RyaW5nVmFsdWUoc2VsQ21wdC5uYW1lICsgU1RPUkUpfSlgO1xuICAgIGNvbnN0IHZhbHVlcyA9IGAke2RhdGF9WzBdLnZhbHVlc2A7XG4gICAgcmV0dXJuIGhhc1NpZ25hbC5sZW5ndGggPyBzaWduYWxzIDogc2lnbmFscy5jb25jYXQoe1xuICAgICAgbmFtZTogc2VsQ21wdC5uYW1lLFxuICAgICAgdXBkYXRlOiBgJHtkYXRhfS5sZW5ndGggJiYge2AgK1xuICAgICAgICBzZWxDbXB0LnByb2plY3QubWFwKChwLCBpKSA9PiBgJHtwLmZpZWxkfTogJHt2YWx1ZXN9WyR7aX1dYCkuam9pbignLCAnKSArICd9J1xuICAgIH0pO1xuICB9LFxuXG4gIG1vZGlmeUV4cHI6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgdHBsID0gc2VsQ21wdC5uYW1lICsgVFVQTEU7XG4gICAgcmV0dXJuIHRwbCArICcsICcgK1xuICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAndHJ1ZScgOiBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IHtzaW5nbGUgYXMgZGVmYXVsdH07XG4iXX0=