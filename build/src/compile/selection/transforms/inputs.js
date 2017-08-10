"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                            update: "datum && item().mark.marktype !== 'group' ? " + datum + "[" + util_1.stringValue(p.field) + "] : null"
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
        var fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', ');
        var values = proj.map(function (p) { return util_1.varName(name + "_" + p.field); });
        signal.update = values.join(' && ') + " ? {fields: [" + fields + "], values: [" + values.join(', ') + "]} : null";
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
exports.default = inputBindings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvaW5wdXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBQ25ELDBDQUFtQztBQUNuQyxxQ0FBZ0M7QUFJaEMsSUFBTSxhQUFhLEdBQXFCO0lBQ3RDLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUTtZQUM5RCxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0lBQzlDLENBQUM7SUFFRCxlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0MsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ2hDLDBDQUEwQyxHQUFHLE9BQU8sQ0FBQztRQUV2RCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztZQUNyQixJQUFNLE1BQU0sR0FBRyxjQUFPLENBQUksSUFBSSxTQUFJLENBQUMsQ0FBQyxLQUFPLENBQUMsQ0FBQztZQUM3QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUMzRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixPQUFPLENBQUMsT0FBTyxDQUFDO29CQUNkLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxFQUFFO29CQUNULEVBQUUsRUFBRSxDQUFDOzRCQUNILE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTs0QkFDdEIsTUFBTSxFQUFFLGlEQUErQyxLQUFLLFNBQUksa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQVU7eUJBQy9GLENBQUM7b0JBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJO2lCQUMvQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxpQkFBSyxFQUF2QixDQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxjQUFPLENBQUksSUFBSSxTQUFJLENBQUMsQ0FBQyxLQUFPLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDO1FBRTlELE1BQU0sQ0FBQyxNQUFNLEdBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQWdCLE1BQU0sb0JBQWUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBVyxDQUFDO1FBQ3hHLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwQixPQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFFakIsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0YsQ0FBQztBQUV1QixnQ0FBTyJ9