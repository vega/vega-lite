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
                "[" + datum + util_1.accessPath(model.vgField(channel, {})) + ", " +
                    ("" + datum + util_1.accessPath(model.vgField(channel, { binSuffix: 'end' })) + "]")) :
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUQ7QUFDbkQseUNBQStEO0FBQy9ELGdEQUEyQztBQUczQyxJQUFNLEtBQUssR0FBcUI7SUFDOUIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsV0FBVyxFQUFFLGVBQWU7SUFFNUIsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDOUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFNLEtBQUssR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDdkQsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEYsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO1lBQ3hCLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDMUIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxnRkFBZ0Y7WUFDaEYsTUFBTSxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3JELE1BQUksS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBSTtxQkFDbEQsS0FBRyxLQUFLLEdBQUcsaUJBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDM0UsS0FBRyxLQUFLLEdBQUcsaUJBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFHLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWQseUVBQXlFO1FBQ3pFLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMEVBQTBFO1FBQzFFLHFFQUFxRTtRQUNyRSxzRUFBc0U7UUFDdEUsbUNBQW1DO1FBQ25DLE1BQU0sQ0FBQyxDQUFDO2dCQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLO2dCQUMxQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBRSw4Q0FBOEM7NkJBQ3BELFlBQVUsb0JBQVEsQ0FBQyxLQUFLLENBQUMsc0JBQWlCLFNBQVMsUUFBSyxDQUFBOzZCQUN4RCxjQUFZLE1BQU0sb0JBQWUsTUFBTSxNQUFHLENBQUE7NEJBQzFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBRyxrQkFBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBSyxFQUEvQixDQUErQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7NEJBQ3ZGLFVBQVU7d0JBQ1osS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQzthQUNILENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFVLG9CQUFRLENBQUMsS0FBSyxDQUFDLE1BQUcsQ0FBQyxDQUFDO0lBQzNFLENBQUM7Q0FDRixDQUFDO0FBRWUsd0JBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FjY2Vzc1BhdGgsIHN0cmluZ1ZhbHVlfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcGlsZXIsIFRVUExFLCB1bml0TmFtZX0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IG5lYXJlc3QgZnJvbSAnLi90cmFuc2Zvcm1zL25lYXJlc3QnO1xuXG5cbmNvbnN0IG11bHRpOlNlbGVjdGlvbkNvbXBpbGVyID0ge1xuICBwcmVkaWNhdGU6ICd2bE11bHRpJyxcbiAgc2NhbGVEb21haW46ICd2bE11bHRpRG9tYWluJyxcblxuICBzaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IHByb2ogPSBzZWxDbXB0LnByb2plY3Q7XG4gICAgY29uc3QgZGF0dW0gPSBuZWFyZXN0LmhhcyhzZWxDbXB0KSA/XG4gICAgICAnKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKScgOiAnZGF0dW0nO1xuICAgIGNvbnN0IGJpbnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgZW5jb2RpbmdzID0gcHJvai5tYXAoKHApID0+IHN0cmluZ1ZhbHVlKHAuY2hhbm5lbCkpLmZpbHRlcigoZSkgPT4gZSkuam9pbignLCAnKTtcbiAgICBjb25zdCBmaWVsZHMgPSBwcm9qLm1hcCgocCkgPT4gc3RyaW5nVmFsdWUocC5maWVsZCkpLmpvaW4oJywgJyk7XG4gICAgY29uc3QgdmFsdWVzID0gcHJvai5tYXAoKHApID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBwLmNoYW5uZWw7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgICAgLy8gQmlubmVkIGZpZWxkcyBzaG91bGQgY2FwdHVyZSBleHRlbnRzLCBmb3IgYSByYW5nZSB0ZXN0IGFnYWluc3QgdGhlIHJhdyBmaWVsZC5cbiAgICAgIHJldHVybiAoZmllbGREZWYgJiYgZmllbGREZWYuYmluKSA/IChiaW5zLnB1c2gocC5maWVsZCksXG4gICAgICAgIGBbJHtkYXR1bX0ke2FjY2Vzc1BhdGgobW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSkpfSwgYCArXG4gICAgICAgICAgICBgJHtkYXR1bX0ke2FjY2Vzc1BhdGgobW9kZWwudmdGaWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnZW5kJ30pKX1dYCkgOlxuICAgICAgICBgJHtkYXR1bX0ke2FjY2Vzc1BhdGgocC5maWVsZCl9YDtcbiAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgLy8gT25seSBhZGQgYSBkaXNjcmV0ZSBzZWxlY3Rpb24gdG8gdGhlIHN0b3JlIGlmIGEgZGF0dW0gaXMgcHJlc2VudCBfYW5kX1xuICAgIC8vIHRoZSBpbnRlcmFjdGlvbiBpc24ndCBvY2N1cmluZyBvbiBhIGdyb3VwIG1hcmsuIFRoaXMgZ3VhcmRzIGFnYWluc3RcbiAgICAvLyBwb2xsdXRpbmcgaW50ZXJhY3RpdmUgc3RhdGUgd2l0aCBpbnZhbGlkIHZhbHVlcyBpbiBmYWNldGVkIGRpc3BsYXlzXG4gICAgLy8gYXMgdGhlIGdyb3VwIG1hcmtzIGFyZSBhbHNvIGRhdGEtZHJpdmVuLiBXZSBmb3JjZSB0aGUgdXBkYXRlIHRvIGFjY291bnRcbiAgICAvLyBmb3IgY29uc3RhbnQgbnVsbCBzdGF0ZXMgYnV0IHZhcnlpbmcgdG9nZ2xlcyAoZS5nLiwgc2hpZnQtY2xpY2sgaW5cbiAgICAvLyB3aGl0ZXNwYWNlIGZvbGxvd2VkIGJ5IGEgY2xpY2sgaW4gd2hpdGVzcGFjZTsgdGhlIHN0b3JlIHNob3VsZCBvbmx5XG4gICAgLy8gYmUgY2xlYXJlZCBvbiB0aGUgc2Vjb25kIGNsaWNrKS5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IHNlbENtcHQubmFtZSArIFRVUExFLFxuICAgICAgdmFsdWU6IHt9LFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogc2VsQ21wdC5ldmVudHMsXG4gICAgICAgIHVwZGF0ZTogYGRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gYCArXG4gICAgICAgICAgYHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX0sIGVuY29kaW5nczogWyR7ZW5jb2RpbmdzfV0sIGAgK1xuICAgICAgICAgIGBmaWVsZHM6IFske2ZpZWxkc31dLCB2YWx1ZXM6IFske3ZhbHVlc31dYCArXG4gICAgICAgICAgKGJpbnMubGVuZ3RoID8gJywgJyArIGJpbnMubWFwKChiKSA9PiBgJHtzdHJpbmdWYWx1ZSgnYmluXycgKyBiKX06IDFgKS5qb2luKCcsICcpIDogJycpICtcbiAgICAgICAgICAnfSA6IG51bGwnLFxuICAgICAgICBmb3JjZTogdHJ1ZVxuICAgICAgfV1cbiAgICB9XTtcbiAgfSxcblxuICBtb2RpZnlFeHByOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IHRwbCA9IHNlbENtcHQubmFtZSArIFRVUExFO1xuICAgIHJldHVybiB0cGwgKyAnLCAnICtcbiAgICAgIChzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnID8gJ251bGwnIDogYHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX19YCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7bXVsdGkgYXMgZGVmYXVsdH07XG4iXX0=