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
//# sourceMappingURL=multi.js.map