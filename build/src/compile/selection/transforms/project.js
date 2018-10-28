import * as log from '../../../log';
import { hasContinuousDomain, isBinScale } from '../../../scale';
import { keys } from '../../../util';
import { TimeUnitNode } from '../../data/timeunit';
import { TUPLE } from '../selection';
export var TUPLE_FIELDS = '_fields';
var project = {
    has: function (selDef) {
        var def = selDef;
        return def.fields !== undefined || def.encodings !== undefined;
    },
    parse: function (model, selDef, selCmpt) {
        var timeUnits = {};
        var f = {};
        var p = selCmpt.project || (selCmpt.project = []);
        selCmpt.fields = {};
        // TODO: find a possible channel mapping for these fields.
        if (selDef.fields) {
            p.push.apply(p, selDef.fields.map(function (field) { return ({ field: field, type: 'E' }); }));
        }
        for (var _i = 0, _a = selDef.encodings || []; _i < _a.length; _i++) {
            var channel = _a[_i];
            var fieldDef = model.fieldDef(channel);
            if (fieldDef) {
                var field = fieldDef.field;
                if (fieldDef.timeUnit) {
                    field = model.vgField(channel);
                    // Construct TimeUnitComponents which will be combined into a
                    // TimeUnitNode. This node may need to be inserted into the
                    // dataflow if the selection is used across views that do not
                    // have these time units defined.
                    timeUnits[field] = {
                        as: field,
                        field: fieldDef.field,
                        timeUnit: fieldDef.timeUnit
                    };
                }
                // Prevent duplicate projections on the same field.
                // TODO: what if the same field is bound to multiple channels (e.g., SPLOM diag).
                if (!f[field]) {
                    // Determine whether the tuple will store enumerated or ranged values.
                    // Interval selections store ranges for continuous scales, and enumerations otherwise.
                    // Single/multi selections store ranges for binned fields, and enumerations otherwise.
                    var type = 'E';
                    if (selCmpt.type === 'interval') {
                        var scaleType = model.getScaleComponent(channel).get('type');
                        if (hasContinuousDomain(scaleType) && !isBinScale(scaleType)) {
                            type = 'R';
                        }
                    }
                    else if (fieldDef.bin) {
                        type = 'R-RE';
                    }
                    p.push((f[field] = { field: field, channel: channel, type: type }));
                }
                selCmpt.fields[channel] = field;
            }
            else {
                log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
            }
        }
        if (keys(timeUnits).length) {
            selCmpt.timeUnit = new TimeUnitNode(null, timeUnits);
        }
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name + TUPLE + TUPLE_FIELDS;
        var hasSignal = signals.filter(function (s) { return s.name === name; });
        return hasSignal.length
            ? signals
            : signals.concat({
                name: name,
                update: "" + JSON.stringify(selCmpt.project)
            });
    }
};
export default project;
//# sourceMappingURL=project.js.map