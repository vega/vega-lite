"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.resolve === 'global' &&
            selCmpt.bind && selCmpt.bind !== 'scales';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvaW5wdXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTBDO0FBRzFDLElBQU0sYUFBYSxHQUFxQjtJQUN0QyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVE7WUFDOUQsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztJQUM5QyxDQUFDO0lBRUQsZUFBZSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQy9DLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQ3JCLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUN0QixJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDbkIsS0FBSyxHQUFHLDBDQUEwQyxDQUFDO1FBRXZELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQ2QsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDeEIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLENBQUM7d0JBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO3dCQUN0QixNQUFNLEVBQUssS0FBSyxTQUFJLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFHO3FCQUM1QyxDQUFDO2dCQUNGLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSTthQUNoRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUM3QyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFmLENBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNsRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN6RCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsZUFBYSxNQUFNLG9CQUFlLE1BQU0sT0FBSSxDQUFDO1FBQzdELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwQixPQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFFakIsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0YsQ0FBQztBQUV1QixnQ0FBTztBQUVoQyxZQUFZLEdBQVc7SUFDckIsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2QyxDQUFDIn0=