"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
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
        var encodings = proj.map(function (p) { return vega_util_1.stringValue(p.channel); }).filter(function (e) { return e; }).join(', ');
        var fields = proj.map(function (p) { return vega_util_1.stringValue(p.field); }).join(', ');
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
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'null' : "{unit: " + selection_1.unitName(model) + "}");
    }
};
exports.default = multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBc0M7QUFDdEMsbUNBQXNDO0FBQ3RDLHlDQUErRDtBQUMvRCxnREFBMkM7QUFHM0MsSUFBTSxLQUFLLEdBQXFCO0lBQzlCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFdBQVcsRUFBRSxlQUFlO0lBRTVCLE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQzlCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBTSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNsQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3ZELElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsdUJBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSx1QkFBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztZQUN4QixJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsZ0ZBQWdGO1lBQ2hGLE1BQU0sQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNyRCxNQUFJLEtBQUssR0FBRyxpQkFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQUk7cUJBQ2xELEtBQUcsS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxNQUFHLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLEtBQUcsS0FBSyxHQUFHLGlCQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBRyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVkLHlFQUF5RTtRQUN6RSx1RUFBdUU7UUFDdkUsc0VBQXNFO1FBQ3RFLDBFQUEwRTtRQUMxRSxxRUFBcUU7UUFDckUsc0VBQXNFO1FBQ3RFLG1DQUFtQztRQUNuQyxNQUFNLENBQUMsQ0FBQztnQkFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSztnQkFDMUIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLENBQUM7d0JBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO3dCQUN0QixNQUFNLEVBQUUsOENBQThDOzZCQUNwRCxZQUFVLG9CQUFRLENBQUMsS0FBSyxDQUFDLHNCQUFpQixTQUFTLFFBQUssQ0FBQTs2QkFDeEQsY0FBWSxNQUFNLG9CQUFlLE1BQU0sTUFBRyxDQUFBOzRCQUMxQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUcsdUJBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQUssRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOzRCQUN2RixVQUFVO3dCQUNaLEtBQUssRUFBRSxJQUFJO3FCQUNaLENBQUM7YUFDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSTtZQUNmLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBVSxvQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFHLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YsQ0FBQztBQUVlLHdCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7YWNjZXNzUGF0aH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBpbGVyLCBUVVBMRSwgdW5pdE5hbWV9IGZyb20gJy4vc2VsZWN0aW9uJztcbmltcG9ydCBuZWFyZXN0IGZyb20gJy4vdHJhbnNmb3Jtcy9uZWFyZXN0JztcblxuXG5jb25zdCBtdWx0aTpTZWxlY3Rpb25Db21waWxlciA9IHtcbiAgcHJlZGljYXRlOiAndmxNdWx0aScsXG4gIHNjYWxlRG9tYWluOiAndmxNdWx0aURvbWFpbicsXG5cbiAgc2lnbmFsczogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQpIHtcbiAgICBjb25zdCBwcm9qID0gc2VsQ21wdC5wcm9qZWN0O1xuICAgIGNvbnN0IGRhdHVtID0gbmVhcmVzdC5oYXMoc2VsQ21wdCkgP1xuICAgICAgJyhpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSknIDogJ2RhdHVtJztcbiAgICBjb25zdCBiaW5zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGVuY29kaW5ncyA9IHByb2oubWFwKChwKSA9PiBzdHJpbmdWYWx1ZShwLmNoYW5uZWwpKS5maWx0ZXIoKGUpID0+IGUpLmpvaW4oJywgJyk7XG4gICAgY29uc3QgZmllbGRzID0gcHJvai5tYXAoKHApID0+IHN0cmluZ1ZhbHVlKHAuZmllbGQpKS5qb2luKCcsICcpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHByb2oubWFwKChwKSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsID0gcC5jaGFubmVsO1xuICAgICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICAgIC8vIEJpbm5lZCBmaWVsZHMgc2hvdWxkIGNhcHR1cmUgZXh0ZW50cywgZm9yIGEgcmFuZ2UgdGVzdCBhZ2FpbnN0IHRoZSByYXcgZmllbGQuXG4gICAgICByZXR1cm4gKGZpZWxkRGVmICYmIGZpZWxkRGVmLmJpbikgPyAoYmlucy5wdXNoKHAuZmllbGQpLFxuICAgICAgICBgWyR7ZGF0dW19JHthY2Nlc3NQYXRoKG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pKX0sIGAgK1xuICAgICAgICAgICAgYCR7ZGF0dW19JHthY2Nlc3NQYXRoKG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ2VuZCd9KSl9XWApIDpcbiAgICAgICAgYCR7ZGF0dW19JHthY2Nlc3NQYXRoKHAuZmllbGQpfWA7XG4gICAgfSkuam9pbignLCAnKTtcblxuICAgIC8vIE9ubHkgYWRkIGEgZGlzY3JldGUgc2VsZWN0aW9uIHRvIHRoZSBzdG9yZSBpZiBhIGRhdHVtIGlzIHByZXNlbnQgX2FuZF9cbiAgICAvLyB0aGUgaW50ZXJhY3Rpb24gaXNuJ3Qgb2NjdXJyaW5nIG9uIGEgZ3JvdXAgbWFyay4gVGhpcyBndWFyZHMgYWdhaW5zdFxuICAgIC8vIHBvbGx1dGluZyBpbnRlcmFjdGl2ZSBzdGF0ZSB3aXRoIGludmFsaWQgdmFsdWVzIGluIGZhY2V0ZWQgZGlzcGxheXNcbiAgICAvLyBhcyB0aGUgZ3JvdXAgbWFya3MgYXJlIGFsc28gZGF0YS1kcml2ZW4uIFdlIGZvcmNlIHRoZSB1cGRhdGUgdG8gYWNjb3VudFxuICAgIC8vIGZvciBjb25zdGFudCBudWxsIHN0YXRlcyBidXQgdmFyeWluZyB0b2dnbGVzIChlLmcuLCBzaGlmdC1jbGljayBpblxuICAgIC8vIHdoaXRlc3BhY2UgZm9sbG93ZWQgYnkgYSBjbGljayBpbiB3aGl0ZXNwYWNlOyB0aGUgc3RvcmUgc2hvdWxkIG9ubHlcbiAgICAvLyBiZSBjbGVhcmVkIG9uIHRoZSBzZWNvbmQgY2xpY2spLlxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogc2VsQ21wdC5uYW1lICsgVFVQTEUsXG4gICAgICB2YWx1ZToge30sXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0LmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiBgZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyBgICtcbiAgICAgICAgICBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfSwgZW5jb2RpbmdzOiBbJHtlbmNvZGluZ3N9XSwgYCArXG4gICAgICAgICAgYGZpZWxkczogWyR7ZmllbGRzfV0sIHZhbHVlczogWyR7dmFsdWVzfV1gICtcbiAgICAgICAgICAoYmlucy5sZW5ndGggPyAnLCAnICsgYmlucy5tYXAoKGIpID0+IGAke3N0cmluZ1ZhbHVlKCdiaW5fJyArIGIpfTogMWApLmpvaW4oJywgJykgOiAnJykgK1xuICAgICAgICAgICd9IDogbnVsbCcsXG4gICAgICAgIGZvcmNlOiB0cnVlXG4gICAgICB9XVxuICAgIH1dO1xuICB9LFxuXG4gIG1vZGlmeUV4cHI6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgdHBsID0gc2VsQ21wdC5uYW1lICsgVFVQTEU7XG4gICAgcmV0dXJuIHRwbCArICcsICcgK1xuICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAnbnVsbCcgOiBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IHttdWx0aSBhcyBkZWZhdWx0fTtcbiJdfQ==