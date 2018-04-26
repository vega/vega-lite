"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var util_1 = require("../../../util");
var selection_1 = require("../selection");
var nearest_1 = require("./nearest");
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.resolve === 'global' &&
            selCmpt.bind && selCmpt.bind !== 'scales';
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var proj = selCmpt.project;
        var bind = selCmpt.bind;
        var datum = nearest_1.default.has(selCmpt) ?
            '(item().isVoronoi ? datum.datum : datum)' : 'datum';
        proj.forEach(function (p) {
            var sgname = util_1.varName(name + "_" + p.field);
            var hasSignal = signals.filter(function (s) { return s.name === sgname; });
            if (!hasSignal.length) {
                signals.unshift({
                    name: sgname,
                    value: '',
                    on: [{
                            events: selCmpt.events,
                            update: "datum && item().mark.marktype !== 'group' ? " + datum + util_1.accessPath(p.field) + " : null"
                        }],
                    bind: bind[p.field] || bind[p.channel] || bind
                });
            }
        });
        return signals;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var proj = selCmpt.project;
        var signal = signals.filter(function (s) { return s.name === name + selection_1.TUPLE; })[0];
        var fields = proj.map(function (p) { return vega_util_1.stringValue(p.field); }).join(', ');
        var values = proj.map(function (p) { return util_1.varName(name + "_" + p.field); });
        if (values.length) {
            signal.update = values.join(' && ') + " ? {fields: [" + fields + "], values: [" + values.join(', ') + "]} : null";
        }
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
exports.default = inputBindings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvaW5wdXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXNDO0FBQ3RDLHNDQUFrRDtBQUNsRCwwQ0FBbUM7QUFDbkMscUNBQWdDO0FBSWhDLElBQU0sYUFBYSxHQUFxQjtJQUN0QyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRO1lBQzlELE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUM7SUFDOUMsQ0FBQztJQUVELGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUMvQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLEtBQUssR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLENBQUM7WUFDckIsSUFBTSxNQUFNLEdBQUcsY0FBTyxDQUFJLElBQUksU0FBSSxDQUFDLENBQUMsS0FBTyxDQUFDLENBQUM7WUFDN0MsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFqQixDQUFpQixDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUM7b0JBQ2QsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLEVBQUU7b0JBQ1QsRUFBRSxFQUFFLENBQUM7NEJBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNOzRCQUN0QixNQUFNLEVBQUUsaURBQStDLEtBQUssR0FBRyxpQkFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBUzt5QkFDNUYsQ0FBQztvQkFDRixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUk7aUJBQy9DLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsaUJBQUssRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSx1QkFBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsY0FBTyxDQUFJLElBQUksU0FBSSxDQUFDLENBQUMsS0FBTyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztRQUU5RCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDakIsTUFBTSxDQUFDLE1BQU0sR0FBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBZ0IsTUFBTSxvQkFBZSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFXLENBQUM7U0FDekc7UUFFRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDcEIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBRWpCLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRixDQUFDO0FBRUYsa0JBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7YWNjZXNzUGF0aCwgdmFyTmFtZX0gZnJvbSAnLi4vLi4vLi4vdXRpbCc7XG5pbXBvcnQge1RVUExFfSBmcm9tICcuLi9zZWxlY3Rpb24nO1xuaW1wb3J0IG5lYXJlc3QgZnJvbSAnLi9uZWFyZXN0JztcbmltcG9ydCB7VHJhbnNmb3JtQ29tcGlsZXJ9IGZyb20gJy4vdHJhbnNmb3Jtcyc7XG5cblxuY29uc3QgaW5wdXRCaW5kaW5nczpUcmFuc2Zvcm1Db21waWxlciA9IHtcbiAgaGFzOiBmdW5jdGlvbihzZWxDbXB0KSB7XG4gICAgcmV0dXJuIHNlbENtcHQudHlwZSA9PT0gJ3NpbmdsZScgJiYgc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyAmJlxuICAgICAgc2VsQ21wdC5iaW5kICYmIHNlbENtcHQuYmluZCAhPT0gJ3NjYWxlcyc7XG4gIH0sXG5cbiAgdG9wTGV2ZWxTaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgc2lnbmFscykge1xuICAgIGNvbnN0IG5hbWUgPSBzZWxDbXB0Lm5hbWU7XG4gICAgY29uc3QgcHJvaiA9IHNlbENtcHQucHJvamVjdDtcbiAgICBjb25zdCBiaW5kID0gc2VsQ21wdC5iaW5kO1xuICAgIGNvbnN0IGRhdHVtID0gbmVhcmVzdC5oYXMoc2VsQ21wdCkgP1xuICAgICAgJyhpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSknIDogJ2RhdHVtJztcblxuICAgIHByb2ouZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICBjb25zdCBzZ25hbWUgPSB2YXJOYW1lKGAke25hbWV9XyR7cC5maWVsZH1gKTtcbiAgICAgIGNvbnN0IGhhc1NpZ25hbCA9IHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09IHNnbmFtZSk7XG4gICAgICBpZiAoIWhhc1NpZ25hbC5sZW5ndGgpIHtcbiAgICAgICAgc2lnbmFscy51bnNoaWZ0KHtcbiAgICAgICAgICBuYW1lOiBzZ25hbWUsXG4gICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgIG9uOiBbe1xuICAgICAgICAgICAgZXZlbnRzOiBzZWxDbXB0LmV2ZW50cyxcbiAgICAgICAgICAgIHVwZGF0ZTogYGRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gJHtkYXR1bX0ke2FjY2Vzc1BhdGgocC5maWVsZCl9IDogbnVsbGBcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBiaW5kOiBiaW5kW3AuZmllbGRdIHx8IGJpbmRbcC5jaGFubmVsXSB8fCBiaW5kXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNpZ25hbHM7XG4gIH0sXG5cbiAgc2lnbmFsczogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQsIHNpZ25hbHMpIHtcbiAgICBjb25zdCBuYW1lID0gc2VsQ21wdC5uYW1lO1xuICAgIGNvbnN0IHByb2ogPSBzZWxDbXB0LnByb2plY3Q7XG4gICAgY29uc3Qgc2lnbmFsID0gc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gbmFtZSArIFRVUExFKVswXTtcbiAgICBjb25zdCBmaWVsZHMgPSBwcm9qLm1hcCgocCkgPT4gc3RyaW5nVmFsdWUocC5maWVsZCkpLmpvaW4oJywgJyk7XG4gICAgY29uc3QgdmFsdWVzID0gcHJvai5tYXAoKHApID0+IHZhck5hbWUoYCR7bmFtZX1fJHtwLmZpZWxkfWApKTtcblxuICAgIGlmICh2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICBzaWduYWwudXBkYXRlID0gYCR7dmFsdWVzLmpvaW4oJyAmJiAnKX0gPyB7ZmllbGRzOiBbJHtmaWVsZHN9XSwgdmFsdWVzOiBbJHt2YWx1ZXMuam9pbignLCAnKX1dfSA6IG51bGxgO1xuICAgIH1cblxuICAgIGRlbGV0ZSBzaWduYWwudmFsdWU7XG4gICAgZGVsZXRlIHNpZ25hbC5vbjtcblxuICAgIHJldHVybiBzaWduYWxzO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbnB1dEJpbmRpbmdzO1xuIl19