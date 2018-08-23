import * as log from '../../../log';
import { keys } from '../../../util';
import { TimeUnitNode } from '../../data/timeunit';
var project = {
    has: function (selDef) {
        var def = selDef;
        return def.fields !== undefined || def.encodings !== undefined;
    },
    parse: function (model, selDef, selCmpt) {
        var channels = {};
        var timeUnits = {};
        // TODO: find a possible channel mapping for these fields.
        (selDef.fields || []).forEach(function (field) { return (channels[field] = null); });
        (selDef.encodings || []).forEach(function (channel) {
            var fieldDef = model.fieldDef(channel);
            if (fieldDef) {
                if (fieldDef.timeUnit) {
                    var tuField = model.vgField(channel);
                    channels[tuField] = channel;
                    // Construct TimeUnitComponents which will be combined into a
                    // TimeUnitNode. This node may need to be inserted into the
                    // dataflow if the selection is used across views that do not
                    // have these time units defined.
                    timeUnits[tuField] = {
                        as: tuField,
                        field: fieldDef.field,
                        timeUnit: fieldDef.timeUnit
                    };
                }
                else {
                    channels[fieldDef.field] = channel;
                }
            }
            else {
                log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
            }
        });
        var projection = selCmpt.project || (selCmpt.project = []);
        for (var field in channels) {
            if (channels.hasOwnProperty(field)) {
                projection.push({ field: field, channel: channels[field] });
            }
        }
        var fields = selCmpt.fields || (selCmpt.fields = {});
        projection.filter(function (p) { return p.channel; }).forEach(function (p) { return (fields[p.channel] = p.field); });
        if (keys(timeUnits).length) {
            selCmpt.timeUnit = new TimeUnitNode(null, timeUnits);
        }
    }
};
export default project;
//# sourceMappingURL=project.js.map