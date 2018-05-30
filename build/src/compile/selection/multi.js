"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var selection_1 = require("./selection");
var nearest_1 = require("./transforms/nearest");
function signals(model, selCmpt) {
    var proj = selCmpt.project;
    var datum = nearest_1.default.has(selCmpt) ?
        '(item().isVoronoi ? datum.datum : datum)' : 'datum';
    var bins = [];
    var encodings = proj.map(function (p) { return vega_util_1.stringValue(p.channel); }).filter(function (e) { return e; }).join(', ');
    var fields = proj.map(function (p) { return vega_util_1.stringValue(p.field); }).join(', ');
    var values = proj.map(function (p) {
        var channel = p.channel;
        var fieldDef = model.fieldDef(channel);
        // Binned fields should capture extents, for a range test against the raw field.
        return (fieldDef && fieldDef.bin) ? (bins.push(p.field),
            "[" + util_1.accessPathWithDatum(model.vgField(channel, {}), datum) + ", " +
                (util_1.accessPathWithDatum(model.vgField(channel, { binSuffix: 'end' }), datum) + "]")) :
            "" + util_1.accessPathWithDatum(p.field, datum);
    }).join(', ');
    // Only add a discrete selection to the store if a datum is present _and_
    // the interaction isn't occurring on a group mark. This guards against
    // polluting interactive state with invalid values in faceted displays
    // as the group marks are also data-driven. We force the update to account
    // for constant null states but varying toggles (e.g., shift-click in
    // whitespace followed by a click in whitespace; the store should only
    // be cleared on the second click).
    return [{
            name: selCmpt.name + selection_1.TUPLE,
            value: {},
            on: [{
                    events: selCmpt.events,
                    update: "datum && item().mark.marktype !== 'group' ? " +
                        ("{unit: " + selection_1.unitName(model) + ", encodings: [" + encodings + "], ") +
                        ("fields: [" + fields + "], values: [" + values + "]") +
                        (bins.length ? ', ' + bins.map(function (b) { return vega_util_1.stringValue('bin_' + b) + ": 1"; }).join(', ') : '') +
                        '} : null',
                    force: true
                }]
        }];
}
exports.signals = signals;
var multi = {
    predicate: 'vlMulti',
    scaleDomain: 'vlMultiDomain',
    signals: signals,
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'null' : "{unit: " + selection_1.unitName(model) + "}");
    }
};
exports.default = multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBc0M7QUFFdEMsbUNBQStDO0FBRS9DLHlDQUFtRjtBQUNuRixnREFBMkM7QUFFM0MsaUJBQXdCLEtBQWdCLEVBQUUsT0FBMkI7SUFDbkUsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUM3QixJQUFNLEtBQUssR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDdkQsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO0lBQzFCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSx1QkFBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEYsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLHVCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO1FBQ3hCLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDMUIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxnRkFBZ0Y7UUFDaEYsT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3JELE1BQUksMEJBQW1CLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQUk7aUJBQ3ZELDBCQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQUcsQ0FBQSxDQUFDLENBQUMsQ0FBQztZQUNuRixLQUFHLDBCQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFHLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWQseUVBQXlFO0lBQ3pFLHVFQUF1RTtJQUN2RSxzRUFBc0U7SUFDdEUsMEVBQTBFO0lBQzFFLHFFQUFxRTtJQUNyRSxzRUFBc0U7SUFDdEUsbUNBQW1DO0lBQ25DLE9BQU8sQ0FBQztZQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLO1lBQzFCLEtBQUssRUFBRSxFQUFFO1lBQ1QsRUFBRSxFQUFFLENBQUM7b0JBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO29CQUN0QixNQUFNLEVBQUUsOENBQThDO3lCQUNwRCxZQUFVLG9CQUFRLENBQUMsS0FBSyxDQUFDLHNCQUFpQixTQUFTLFFBQUssQ0FBQTt5QkFDeEQsY0FBWSxNQUFNLG9CQUFlLE1BQU0sTUFBRyxDQUFBO3dCQUMxQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUcsdUJBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQUssRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO3dCQUN2RixVQUFVO29CQUNaLEtBQUssRUFBRSxJQUFJO2lCQUNaLENBQUM7U0FDSCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBckNELDBCQXFDQztBQUVELElBQU0sS0FBSyxHQUFxQjtJQUM5QixTQUFTLEVBQUUsU0FBUztJQUNwQixXQUFXLEVBQUUsZUFBZTtJQUU1QixPQUFPLEVBQUUsT0FBTztJQUVoQixVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsT0FBTyxHQUFHLEdBQUcsSUFBSTtZQUNmLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBVSxvQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFHLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLEtBQUssQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RyaW5nVmFsdWV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbmltcG9ydCB7YWNjZXNzUGF0aFdpdGhEYXR1bX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBpbGVyLCBTZWxlY3Rpb25Db21wb25lbnQsIFRVUExFLCB1bml0TmFtZX0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IG5lYXJlc3QgZnJvbSAnLi90cmFuc2Zvcm1zL25lYXJlc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2lnbmFscyhtb2RlbDogVW5pdE1vZGVsLCBzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQpIHtcbiAgY29uc3QgcHJvaiA9IHNlbENtcHQucHJvamVjdDtcbiAgY29uc3QgZGF0dW0gPSBuZWFyZXN0LmhhcyhzZWxDbXB0KSA/XG4gICAgJyhpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSknIDogJ2RhdHVtJztcbiAgY29uc3QgYmluczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgZW5jb2RpbmdzID0gcHJvai5tYXAoKHApID0+IHN0cmluZ1ZhbHVlKHAuY2hhbm5lbCkpLmZpbHRlcigoZSkgPT4gZSkuam9pbignLCAnKTtcbiAgY29uc3QgZmllbGRzID0gcHJvai5tYXAoKHApID0+IHN0cmluZ1ZhbHVlKHAuZmllbGQpKS5qb2luKCcsICcpO1xuICBjb25zdCB2YWx1ZXMgPSBwcm9qLm1hcCgocCkgPT4ge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBwLmNoYW5uZWw7XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICAvLyBCaW5uZWQgZmllbGRzIHNob3VsZCBjYXB0dXJlIGV4dGVudHMsIGZvciBhIHJhbmdlIHRlc3QgYWdhaW5zdCB0aGUgcmF3IGZpZWxkLlxuICAgIHJldHVybiAoZmllbGREZWYgJiYgZmllbGREZWYuYmluKSA/IChiaW5zLnB1c2gocC5maWVsZCksXG4gICAgICBgWyR7YWNjZXNzUGF0aFdpdGhEYXR1bShtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KSwgZGF0dW0pfSwgYCArXG4gICAgICAgICAgYCR7YWNjZXNzUGF0aFdpdGhEYXR1bShtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtiaW5TdWZmaXg6ICdlbmQnfSksIGRhdHVtKX1dYCkgOlxuICAgICAgYCR7YWNjZXNzUGF0aFdpdGhEYXR1bShwLmZpZWxkLCBkYXR1bSl9YDtcbiAgfSkuam9pbignLCAnKTtcblxuICAvLyBPbmx5IGFkZCBhIGRpc2NyZXRlIHNlbGVjdGlvbiB0byB0aGUgc3RvcmUgaWYgYSBkYXR1bSBpcyBwcmVzZW50IF9hbmRfXG4gIC8vIHRoZSBpbnRlcmFjdGlvbiBpc24ndCBvY2N1cnJpbmcgb24gYSBncm91cCBtYXJrLiBUaGlzIGd1YXJkcyBhZ2FpbnN0XG4gIC8vIHBvbGx1dGluZyBpbnRlcmFjdGl2ZSBzdGF0ZSB3aXRoIGludmFsaWQgdmFsdWVzIGluIGZhY2V0ZWQgZGlzcGxheXNcbiAgLy8gYXMgdGhlIGdyb3VwIG1hcmtzIGFyZSBhbHNvIGRhdGEtZHJpdmVuLiBXZSBmb3JjZSB0aGUgdXBkYXRlIHRvIGFjY291bnRcbiAgLy8gZm9yIGNvbnN0YW50IG51bGwgc3RhdGVzIGJ1dCB2YXJ5aW5nIHRvZ2dsZXMgKGUuZy4sIHNoaWZ0LWNsaWNrIGluXG4gIC8vIHdoaXRlc3BhY2UgZm9sbG93ZWQgYnkgYSBjbGljayBpbiB3aGl0ZXNwYWNlOyB0aGUgc3RvcmUgc2hvdWxkIG9ubHlcbiAgLy8gYmUgY2xlYXJlZCBvbiB0aGUgc2Vjb25kIGNsaWNrKS5cbiAgcmV0dXJuIFt7XG4gICAgbmFtZTogc2VsQ21wdC5uYW1lICsgVFVQTEUsXG4gICAgdmFsdWU6IHt9LFxuICAgIG9uOiBbe1xuICAgICAgZXZlbnRzOiBzZWxDbXB0LmV2ZW50cyxcbiAgICAgIHVwZGF0ZTogYGRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gYCArXG4gICAgICAgIGB7dW5pdDogJHt1bml0TmFtZShtb2RlbCl9LCBlbmNvZGluZ3M6IFske2VuY29kaW5nc31dLCBgICtcbiAgICAgICAgYGZpZWxkczogWyR7ZmllbGRzfV0sIHZhbHVlczogWyR7dmFsdWVzfV1gICtcbiAgICAgICAgKGJpbnMubGVuZ3RoID8gJywgJyArIGJpbnMubWFwKChiKSA9PiBgJHtzdHJpbmdWYWx1ZSgnYmluXycgKyBiKX06IDFgKS5qb2luKCcsICcpIDogJycpICtcbiAgICAgICAgJ30gOiBudWxsJyxcbiAgICAgIGZvcmNlOiB0cnVlXG4gICAgfV1cbiAgfV07XG59XG5cbmNvbnN0IG11bHRpOlNlbGVjdGlvbkNvbXBpbGVyID0ge1xuICBwcmVkaWNhdGU6ICd2bE11bHRpJyxcbiAgc2NhbGVEb21haW46ICd2bE11bHRpRG9tYWluJyxcblxuICBzaWduYWxzOiBzaWduYWxzLFxuXG4gIG1vZGlmeUV4cHI6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgdHBsID0gc2VsQ21wdC5uYW1lICsgVFVQTEU7XG4gICAgcmV0dXJuIHRwbCArICcsICcgK1xuICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAnbnVsbCcgOiBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbXVsdGk7XG4iXX0=