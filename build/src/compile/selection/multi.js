import { stringValue } from 'vega-util';
import { accessPathWithDatum } from '../../util';
import { TUPLE, unitName } from './selection';
import nearest from './transforms/nearest';
export function signals(model, selCmpt) {
    var proj = selCmpt.project;
    var datum = nearest.has(selCmpt) ? '(item().isVoronoi ? datum.datum : datum)' : 'datum';
    var bins = [];
    var encodings = proj
        .map(function (p) { return stringValue(p.channel); })
        .filter(function (e) { return e; })
        .join(', ');
    var fields = proj.map(function (p) { return stringValue(p.field); }).join(', ');
    var values = proj
        .map(function (p) {
        var channel = p.channel;
        var fieldDef = model.fieldDef(channel);
        // Binned fields should capture extents, for a range test against the raw field.
        return fieldDef && fieldDef.bin
            ? (bins.push(p.field),
                "[" + accessPathWithDatum(model.vgField(channel, {}), datum) + ", " +
                    (accessPathWithDatum(model.vgField(channel, { binSuffix: 'end' }), datum) + "]"))
            : "" + accessPathWithDatum(p.field, datum);
    })
        .join(', ');
    // Only add a discrete selection to the store if a datum is present _and_
    // the interaction isn't occurring on a group mark. This guards against
    // polluting interactive state with invalid values in faceted displays
    // as the group marks are also data-driven. We force the update to account
    // for constant null states but varying toggles (e.g., shift-click in
    // whitespace followed by a click in whitespace; the store should only
    // be cleared on the second click).
    return [
        {
            name: selCmpt.name + TUPLE,
            value: {},
            on: [
                {
                    events: selCmpt.events,
                    update: "datum && item().mark.marktype !== 'group' ? " +
                        ("{unit: " + unitName(model) + ", encodings: [" + encodings + "], ") +
                        ("fields: [" + fields + "], values: [" + values + "]") +
                        (bins.length ? ', ' + bins.map(function (b) { return stringValue('bin_' + b) + ": 1"; }).join(', ') : '') +
                        '} : null',
                    force: true
                }
            ]
        }
    ];
}
var multi = {
    predicate: 'vlMulti',
    scaleDomain: 'vlMultiDomain',
    signals: signals,
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'null' : "{unit: " + unitName(model) + "}");
    }
};
export default multi;
//# sourceMappingURL=multi.js.map