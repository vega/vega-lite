"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.bind && selCmpt.bind !== 'scales';
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var name = selCmpt.name, proj = selCmpt.project, bind = selCmpt.bind, datum = '(item().isVoronoi ? datum.datum : datum)';
        proj.forEach(function (p) {
            signals.unshift({
                name: name + id(p.field),
                value: '',
                on: [{
                        events: selCmpt.events,
                        update: datum + "[" + util_1.stringValue(p.field) + "]"
                    }],
                bind: bind[p.field] || bind[p.encoding] || bind
            });
        });
        return signals;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, proj = selCmpt.project, signal = signals.filter(function (s) { return s.name === name; })[0], fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return name + id(p.field); }).join(', ');
        signal.update = "{fields: [" + fields + "], values: [" + values + "]}";
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
exports.default = inputBindings;
function id(str) {
    return '_' + str.replace(/\W/g, '_');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvaW5wdXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBDO0FBRzFDLElBQU0sYUFBYSxHQUFxQjtJQUN0QyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0lBQ2hGLENBQUM7SUFFRCxlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0MsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDckIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQ3RCLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUNuQixLQUFLLEdBQUcsMENBQTBDLENBQUM7UUFFdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLENBQUM7WUFDckIsT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDZCxJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUN4QixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBSyxLQUFLLFNBQUksa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQUc7cUJBQzVDLENBQUM7Z0JBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJO2FBQ2hELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQzdDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQWYsQ0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3pELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFhLE1BQU0sb0JBQWUsTUFBTSxPQUFJLENBQUM7UUFDN0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUVqQixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRixDQUFDO0FBRXVCLGdDQUFPO0FBRWhDLFlBQVksR0FBVztJQUNyQixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMifQ==