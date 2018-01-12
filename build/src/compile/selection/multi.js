"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var selection_1 = require("./selection");
var nearest_1 = require("./transforms/nearest");
var multi = {
    predicate: 'vlMulti',
    scaleDomain: 'vlMultiDomain',
    signals: function (model, selCmpt) {
        var proj = selCmpt.project;
        var datum = nearest_1.default.has(selCmpt) ?
            '(item().isVoronoi ? datum.datum : datum)' : 'datum';
        var bins = [];
        var encodings = proj.map(function (p) { return util_1.stringValue(p.channel); }).filter(function (e) { return e; }).join(', ');
        var fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', ');
        var values = proj.map(function (p) {
            var channel = p.channel;
            var fieldDef = model.fieldDef(channel);
            // Binned fields should capture extents, for a range test against the raw field.
            return (fieldDef && fieldDef.bin) ? (bins.push(p.field),
                "[" + datum + util_1.accessPath(model.field(channel, {})) + ", " +
                    ("" + datum + util_1.accessPath(model.field(channel, { binSuffix: 'end' })) + "]")) :
                "" + datum + util_1.accessPath(p.field);
        }).join(', ');
        // Only add a discrete selection to the store if a datum is present _and_
        // the interaction isn't occuring on a group mark. This guards against
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
                            (bins.length ? ', ' + bins.map(function (b) { return util_1.stringValue('bin_' + b) + ": 1"; }).join(', ') : '') +
                            '} : null',
                        force: true
                    }]
            }];
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'null' : "{unit: " + selection_1.unitName(model) + "}");
    }
};
exports.default = multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUQ7QUFDbkQseUNBQStEO0FBQy9ELGdEQUEyQztBQUczQyxJQUFNLEtBQUssR0FBcUI7SUFDOUIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsV0FBVyxFQUFFLGVBQWU7SUFFNUIsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDOUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFNLEtBQUssR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDdkQsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEYsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO1lBQ3hCLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDMUIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxnRkFBZ0Y7WUFDaEYsTUFBTSxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3JELE1BQUksS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBSTtxQkFDaEQsS0FBRyxLQUFLLEdBQUcsaUJBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDekUsS0FBRyxLQUFLLEdBQUcsaUJBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFHLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWQseUVBQXlFO1FBQ3pFLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMEVBQTBFO1FBQzFFLHFFQUFxRTtRQUNyRSxzRUFBc0U7UUFDdEUsbUNBQW1DO1FBQ25DLE1BQU0sQ0FBQyxDQUFDO2dCQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLO2dCQUMxQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBRSw4Q0FBOEM7NkJBQ3BELFlBQVUsb0JBQVEsQ0FBQyxLQUFLLENBQUMsc0JBQWlCLFNBQVMsUUFBSyxDQUFBOzZCQUN4RCxjQUFZLE1BQU0sb0JBQWUsTUFBTSxNQUFHLENBQUE7NEJBQzFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBRyxrQkFBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBSyxFQUEvQixDQUErQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7NEJBQ3ZGLFVBQVU7d0JBQ1osS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQzthQUNILENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFVLG9CQUFRLENBQUMsS0FBSyxDQUFDLE1BQUcsQ0FBQyxDQUFDO0lBQzNFLENBQUM7Q0FDRixDQUFDO0FBRWUsd0JBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FjY2Vzc1BhdGgsIHN0cmluZ1ZhbHVlfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcGlsZXIsIFRVUExFLCB1bml0TmFtZX0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IG5lYXJlc3QgZnJvbSAnLi90cmFuc2Zvcm1zL25lYXJlc3QnO1xuXG5cbmNvbnN0IG11bHRpOlNlbGVjdGlvbkNvbXBpbGVyID0ge1xuICBwcmVkaWNhdGU6ICd2bE11bHRpJyxcbiAgc2NhbGVEb21haW46ICd2bE11bHRpRG9tYWluJyxcblxuICBzaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IHByb2ogPSBzZWxDbXB0LnByb2plY3Q7XG4gICAgY29uc3QgZGF0dW0gPSBuZWFyZXN0LmhhcyhzZWxDbXB0KSA/XG4gICAgICAnKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKScgOiAnZGF0dW0nO1xuICAgIGNvbnN0IGJpbnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgZW5jb2RpbmdzID0gcHJvai5tYXAoKHApID0+IHN0cmluZ1ZhbHVlKHAuY2hhbm5lbCkpLmZpbHRlcigoZSkgPT4gZSkuam9pbignLCAnKTtcbiAgICBjb25zdCBmaWVsZHMgPSBwcm9qLm1hcCgocCkgPT4gc3RyaW5nVmFsdWUocC5maWVsZCkpLmpvaW4oJywgJyk7XG4gICAgY29uc3QgdmFsdWVzID0gcHJvai5tYXAoKHApID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBwLmNoYW5uZWw7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgICAgLy8gQmlubmVkIGZpZWxkcyBzaG91bGQgY2FwdHVyZSBleHRlbnRzLCBmb3IgYSByYW5nZSB0ZXN0IGFnYWluc3QgdGhlIHJhdyBmaWVsZC5cbiAgICAgIHJldHVybiAoZmllbGREZWYgJiYgZmllbGREZWYuYmluKSA/IChiaW5zLnB1c2gocC5maWVsZCksXG4gICAgICAgIGBbJHtkYXR1bX0ke2FjY2Vzc1BhdGgobW9kZWwuZmllbGQoY2hhbm5lbCwge30pKX0sIGAgK1xuICAgICAgICAgICAgYCR7ZGF0dW19JHthY2Nlc3NQYXRoKG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtiaW5TdWZmaXg6ICdlbmQnfSkpfV1gKSA6XG4gICAgICAgIGAke2RhdHVtfSR7YWNjZXNzUGF0aChwLmZpZWxkKX1gO1xuICAgIH0pLmpvaW4oJywgJyk7XG5cbiAgICAvLyBPbmx5IGFkZCBhIGRpc2NyZXRlIHNlbGVjdGlvbiB0byB0aGUgc3RvcmUgaWYgYSBkYXR1bSBpcyBwcmVzZW50IF9hbmRfXG4gICAgLy8gdGhlIGludGVyYWN0aW9uIGlzbid0IG9jY3VyaW5nIG9uIGEgZ3JvdXAgbWFyay4gVGhpcyBndWFyZHMgYWdhaW5zdFxuICAgIC8vIHBvbGx1dGluZyBpbnRlcmFjdGl2ZSBzdGF0ZSB3aXRoIGludmFsaWQgdmFsdWVzIGluIGZhY2V0ZWQgZGlzcGxheXNcbiAgICAvLyBhcyB0aGUgZ3JvdXAgbWFya3MgYXJlIGFsc28gZGF0YS1kcml2ZW4uIFdlIGZvcmNlIHRoZSB1cGRhdGUgdG8gYWNjb3VudFxuICAgIC8vIGZvciBjb25zdGFudCBudWxsIHN0YXRlcyBidXQgdmFyeWluZyB0b2dnbGVzIChlLmcuLCBzaGlmdC1jbGljayBpblxuICAgIC8vIHdoaXRlc3BhY2UgZm9sbG93ZWQgYnkgYSBjbGljayBpbiB3aGl0ZXNwYWNlOyB0aGUgc3RvcmUgc2hvdWxkIG9ubHlcbiAgICAvLyBiZSBjbGVhcmVkIG9uIHRoZSBzZWNvbmQgY2xpY2spLlxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogc2VsQ21wdC5uYW1lICsgVFVQTEUsXG4gICAgICB2YWx1ZToge30sXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0LmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiBgZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyBgICtcbiAgICAgICAgICBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfSwgZW5jb2RpbmdzOiBbJHtlbmNvZGluZ3N9XSwgYCArXG4gICAgICAgICAgYGZpZWxkczogWyR7ZmllbGRzfV0sIHZhbHVlczogWyR7dmFsdWVzfV1gICtcbiAgICAgICAgICAoYmlucy5sZW5ndGggPyAnLCAnICsgYmlucy5tYXAoKGIpID0+IGAke3N0cmluZ1ZhbHVlKCdiaW5fJyArIGIpfTogMWApLmpvaW4oJywgJykgOiAnJykgK1xuICAgICAgICAgICd9IDogbnVsbCcsXG4gICAgICAgIGZvcmNlOiB0cnVlXG4gICAgICB9XVxuICAgIH1dO1xuICB9LFxuXG4gIG1vZGlmeUV4cHI6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgdHBsID0gc2VsQ21wdC5uYW1lICsgVFVQTEU7XG4gICAgcmV0dXJuIHRwbCArICcsICcgK1xuICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAnbnVsbCcgOiBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IHttdWx0aSBhcyBkZWZhdWx0fTtcbiJdfQ==