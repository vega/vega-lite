import { accessPathWithDatum } from '../../util';
import { TUPLE, unitName } from './selection';
import nearest from './transforms/nearest';
import { TUPLE_FIELDS } from './transforms/project';
export function signals(model, selCmpt) {
    var name = selCmpt.name;
    var fieldsSg = name + TUPLE + TUPLE_FIELDS;
    var proj = selCmpt.project;
    var datum = nearest.has(selCmpt) ? '(item().isVoronoi ? datum.datum : datum)' : 'datum';
    var values = proj
        .map(function (p) {
        var fieldDef = model.fieldDef(p.channel);
        // Binned fields should capture extents, for a range test against the raw field.
        return fieldDef && fieldDef.bin
            ? "[" + accessPathWithDatum(model.vgField(p.channel, {}), datum) + ", " +
                (accessPathWithDatum(model.vgField(p.channel, { binSuffix: 'end' }), datum) + "]")
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
            name: name + TUPLE,
            value: {},
            on: [
                {
                    events: selCmpt.events,
                    update: "datum && item().mark.marktype !== 'group' ? " +
                        ("{unit: " + unitName(model) + ", fields: " + fieldsSg + ", values: [" + values + "]} : null"),
                    force: true
                }
            ]
        }
    ];
}
var multi = {
    signals: signals,
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'null' : "{unit: " + unitName(model) + "}");
    }
};
export default multi;
//# sourceMappingURL=multi.js.map