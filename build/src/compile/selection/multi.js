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
                "[" + datum + "[" + util_1.stringValue(model.field(channel, {})) + "], " +
                    (datum + "[" + util_1.stringValue(model.field(channel, { binSuffix: 'end' })) + "]]")) :
                datum + "[" + util_1.stringValue(p.field) + "]";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBdUM7QUFDdkMseUNBQStEO0FBQy9ELGdEQUEyQztBQUczQyxJQUFNLEtBQUssR0FBcUI7SUFDOUIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsV0FBVyxFQUFFLGVBQWU7SUFFNUIsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDOUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFNLEtBQUssR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDaEMsMENBQTBDLEdBQUcsT0FBTyxDQUFDO1FBQ3ZELElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsa0JBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztZQUN4QixJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsZ0ZBQWdGO1lBQ2hGLE1BQU0sQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3JELE1BQUksS0FBSyxTQUFJLGtCQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBSztxQkFDaEQsS0FBSyxTQUFJLGtCQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxPQUFJLENBQUEsQ0FBQztnQkFDdkUsS0FBSyxTQUFJLGtCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFHLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWQseUVBQXlFO1FBQ3pFLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMEVBQTBFO1FBQzFFLHFFQUFxRTtRQUNyRSxzRUFBc0U7UUFDdEUsbUNBQW1DO1FBQ25DLE1BQU0sQ0FBQyxDQUFDO2dCQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLO2dCQUMxQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07d0JBQ3RCLE1BQU0sRUFBRSw4Q0FBOEM7NkJBQ3BELFlBQVUsb0JBQVEsQ0FBQyxLQUFLLENBQUMsc0JBQWlCLFNBQVMsUUFBSyxDQUFBOzZCQUN4RCxjQUFZLE1BQU0sb0JBQWUsTUFBTSxNQUFHLENBQUE7NEJBQzFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFHLGtCQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxRQUFLLEVBQS9CLENBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOzRCQUN2RixVQUFVO3dCQUNaLEtBQUssRUFBRSxJQUFJO3FCQUNaLENBQUM7YUFDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSTtZQUNmLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVUsb0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBRyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGLENBQUM7QUFFZSx3QkFBTyJ9