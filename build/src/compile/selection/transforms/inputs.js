import { accessPathWithDatum, varName } from '../../../util';
import { TUPLE } from '../selection';
import nearest from './nearest';
import { TUPLE_FIELDS } from './project';
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind !== 'scales';
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var proj = selCmpt.project;
        var bind = selCmpt.bind;
        var datum = nearest.has(selCmpt) ? '(item().isVoronoi ? datum.datum : datum)' : 'datum';
        var _loop_1 = function (p) {
            var sgname = varName(name + "_" + p.field);
            var hasSignal = signals.filter(function (s) { return s.name === sgname; });
            if (!hasSignal.length) {
                signals.unshift({
                    name: sgname,
                    value: '',
                    on: [
                        {
                            events: selCmpt.events,
                            update: "datum && item().mark.marktype !== 'group' ? " + accessPathWithDatum(p.field, datum) + " : null"
                        }
                    ],
                    bind: bind[p.field] || bind[p.channel] || bind
                });
            }
        };
        for (var _i = 0, proj_1 = proj; _i < proj_1.length; _i++) {
            var p = proj_1[_i];
            _loop_1(p);
        }
        return signals;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var proj = selCmpt.project;
        var signal = signals.filter(function (s) { return s.name === name + TUPLE; })[0];
        var fields = name + TUPLE + TUPLE_FIELDS;
        var values = proj.map(function (p) { return varName(name + "_" + p.field); });
        var valid = values.map(function (v) { return v + " !== null"; }).join(' && ');
        if (values.length) {
            signal.update = valid + " ? {fields: " + fields + ", values: [" + values.join(', ') + "]} : null";
        }
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
export default inputBindings;
//# sourceMappingURL=inputs.js.map