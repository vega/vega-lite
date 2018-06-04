"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var selection_1 = require("./selection");
var nearest_1 = tslib_1.__importDefault(require("./transforms/nearest"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXNDO0FBRXRDLG1DQUErQztBQUUvQyx5Q0FBbUY7QUFDbkYseUVBQTJDO0FBRTNDLGlCQUF3QixLQUFnQixFQUFFLE9BQTJCO0lBQ25FLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDN0IsSUFBTSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNsQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3ZELElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztJQUMxQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsdUJBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSx1QkFBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztRQUN4QixJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzFCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsZ0ZBQWdGO1FBQ2hGLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNyRCxNQUFJLDBCQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFJO2lCQUN2RCwwQkFBbUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFHLENBQUEsQ0FBQyxDQUFDLENBQUM7WUFDbkYsS0FBRywwQkFBbUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBRyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVkLHlFQUF5RTtJQUN6RSx1RUFBdUU7SUFDdkUsc0VBQXNFO0lBQ3RFLDBFQUEwRTtJQUMxRSxxRUFBcUU7SUFDckUsc0VBQXNFO0lBQ3RFLG1DQUFtQztJQUNuQyxPQUFPLENBQUM7WUFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSztZQUMxQixLQUFLLEVBQUUsRUFBRTtZQUNULEVBQUUsRUFBRSxDQUFDO29CQUNILE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtvQkFDdEIsTUFBTSxFQUFFLDhDQUE4Qzt5QkFDcEQsWUFBVSxvQkFBUSxDQUFDLEtBQUssQ0FBQyxzQkFBaUIsU0FBUyxRQUFLLENBQUE7eUJBQ3hELGNBQVksTUFBTSxvQkFBZSxNQUFNLE1BQUcsQ0FBQTt3QkFDMUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFHLHVCQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxRQUFLLEVBQS9CLENBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzt3QkFDdkYsVUFBVTtvQkFDWixLQUFLLEVBQUUsSUFBSTtpQkFDWixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXJDRCwwQkFxQ0M7QUFFRCxJQUFNLEtBQUssR0FBcUI7SUFDOUIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsV0FBVyxFQUFFLGVBQWU7SUFFNUIsT0FBTyxFQUFFLE9BQU87SUFFaEIsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxHQUFHLElBQUk7WUFDZixDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVUsb0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBRyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGLENBQUM7QUFFRixrQkFBZSxLQUFLLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cmluZ1ZhbHVlfSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge2FjY2Vzc1BhdGhXaXRoRGF0dW19IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtTZWxlY3Rpb25Db21waWxlciwgU2VsZWN0aW9uQ29tcG9uZW50LCBUVVBMRSwgdW5pdE5hbWV9IGZyb20gJy4vc2VsZWN0aW9uJztcbmltcG9ydCBuZWFyZXN0IGZyb20gJy4vdHJhbnNmb3Jtcy9uZWFyZXN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25hbHMobW9kZWw6IFVuaXRNb2RlbCwgc2VsQ21wdDogU2VsZWN0aW9uQ29tcG9uZW50KSB7XG4gIGNvbnN0IHByb2ogPSBzZWxDbXB0LnByb2plY3Q7XG4gIGNvbnN0IGRhdHVtID0gbmVhcmVzdC5oYXMoc2VsQ21wdCkgP1xuICAgICcoaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pJyA6ICdkYXR1bSc7XG4gIGNvbnN0IGJpbnM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGVuY29kaW5ncyA9IHByb2oubWFwKChwKSA9PiBzdHJpbmdWYWx1ZShwLmNoYW5uZWwpKS5maWx0ZXIoKGUpID0+IGUpLmpvaW4oJywgJyk7XG4gIGNvbnN0IGZpZWxkcyA9IHByb2oubWFwKChwKSA9PiBzdHJpbmdWYWx1ZShwLmZpZWxkKSkuam9pbignLCAnKTtcbiAgY29uc3QgdmFsdWVzID0gcHJvai5tYXAoKHApID0+IHtcbiAgICBjb25zdCBjaGFubmVsID0gcC5jaGFubmVsO1xuICAgIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gICAgLy8gQmlubmVkIGZpZWxkcyBzaG91bGQgY2FwdHVyZSBleHRlbnRzLCBmb3IgYSByYW5nZSB0ZXN0IGFnYWluc3QgdGhlIHJhdyBmaWVsZC5cbiAgICByZXR1cm4gKGZpZWxkRGVmICYmIGZpZWxkRGVmLmJpbikgPyAoYmlucy5wdXNoKHAuZmllbGQpLFxuICAgICAgYFske2FjY2Vzc1BhdGhXaXRoRGF0dW0obW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSksIGRhdHVtKX0sIGAgK1xuICAgICAgICAgIGAke2FjY2Vzc1BhdGhXaXRoRGF0dW0obW9kZWwudmdGaWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnZW5kJ30pLCBkYXR1bSl9XWApIDpcbiAgICAgIGAke2FjY2Vzc1BhdGhXaXRoRGF0dW0ocC5maWVsZCwgZGF0dW0pfWA7XG4gIH0pLmpvaW4oJywgJyk7XG5cbiAgLy8gT25seSBhZGQgYSBkaXNjcmV0ZSBzZWxlY3Rpb24gdG8gdGhlIHN0b3JlIGlmIGEgZGF0dW0gaXMgcHJlc2VudCBfYW5kX1xuICAvLyB0aGUgaW50ZXJhY3Rpb24gaXNuJ3Qgb2NjdXJyaW5nIG9uIGEgZ3JvdXAgbWFyay4gVGhpcyBndWFyZHMgYWdhaW5zdFxuICAvLyBwb2xsdXRpbmcgaW50ZXJhY3RpdmUgc3RhdGUgd2l0aCBpbnZhbGlkIHZhbHVlcyBpbiBmYWNldGVkIGRpc3BsYXlzXG4gIC8vIGFzIHRoZSBncm91cCBtYXJrcyBhcmUgYWxzbyBkYXRhLWRyaXZlbi4gV2UgZm9yY2UgdGhlIHVwZGF0ZSB0byBhY2NvdW50XG4gIC8vIGZvciBjb25zdGFudCBudWxsIHN0YXRlcyBidXQgdmFyeWluZyB0b2dnbGVzIChlLmcuLCBzaGlmdC1jbGljayBpblxuICAvLyB3aGl0ZXNwYWNlIGZvbGxvd2VkIGJ5IGEgY2xpY2sgaW4gd2hpdGVzcGFjZTsgdGhlIHN0b3JlIHNob3VsZCBvbmx5XG4gIC8vIGJlIGNsZWFyZWQgb24gdGhlIHNlY29uZCBjbGljaykuXG4gIHJldHVybiBbe1xuICAgIG5hbWU6IHNlbENtcHQubmFtZSArIFRVUExFLFxuICAgIHZhbHVlOiB7fSxcbiAgICBvbjogW3tcbiAgICAgIGV2ZW50czogc2VsQ21wdC5ldmVudHMsXG4gICAgICB1cGRhdGU6IGBkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IGAgK1xuICAgICAgICBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfSwgZW5jb2RpbmdzOiBbJHtlbmNvZGluZ3N9XSwgYCArXG4gICAgICAgIGBmaWVsZHM6IFske2ZpZWxkc31dLCB2YWx1ZXM6IFske3ZhbHVlc31dYCArXG4gICAgICAgIChiaW5zLmxlbmd0aCA/ICcsICcgKyBiaW5zLm1hcCgoYikgPT4gYCR7c3RyaW5nVmFsdWUoJ2Jpbl8nICsgYil9OiAxYCkuam9pbignLCAnKSA6ICcnKSArXG4gICAgICAgICd9IDogbnVsbCcsXG4gICAgICBmb3JjZTogdHJ1ZVxuICAgIH1dXG4gIH1dO1xufVxuXG5jb25zdCBtdWx0aTpTZWxlY3Rpb25Db21waWxlciA9IHtcbiAgcHJlZGljYXRlOiAndmxNdWx0aScsXG4gIHNjYWxlRG9tYWluOiAndmxNdWx0aURvbWFpbicsXG5cbiAgc2lnbmFsczogc2lnbmFscyxcblxuICBtb2RpZnlFeHByOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IHRwbCA9IHNlbENtcHQubmFtZSArIFRVUExFO1xuICAgIHJldHVybiB0cGwgKyAnLCAnICtcbiAgICAgIChzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnID8gJ251bGwnIDogYHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX19YCk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IG11bHRpO1xuIl19