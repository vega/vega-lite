import { isArray } from 'vega-util';
import * as log from '../../../log';
import { hasContinuousDomain } from '../../../scale';
import { isIntervalSelection } from '../../../selection';
import { keys } from '../../../util';
import { TimeUnitNode } from '../../data/timeunit';
import { TUPLE } from '../selection';
import scales from './scales';
export const TUPLE_FIELDS = '_fields';
const project = {
    has: (selDef) => {
        const def = selDef;
        return def.fields !== undefined || def.encodings !== undefined;
    },
    parse: (model, selDef, selCmpt) => {
        const timeUnits = {};
        const f = {};
        // Selection component may already have a projection from the config. (Interval selection will have `encodings: ['x', 'y'].)
        const proj = selCmpt.project || (selCmpt.project = []);
        selCmpt.fields = {};
        // TODO: find a possible channel mapping for these fields.
        if (selDef.fields) {
            proj.push(...selDef.fields.map(field => ({ field, type: 'E' })));
        }
        for (const channel of selDef.encodings || []) {
            const fieldDef = model.fieldDef(channel);
            if (fieldDef) {
                let field = fieldDef.field;
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
                    let type = 'E';
                    if (selCmpt.type === 'interval') {
                        const scaleType = model.getScaleComponent(channel).get('type');
                        if (hasContinuousDomain(scaleType)) {
                            type = 'R';
                        }
                    }
                    else if (fieldDef.bin) {
                        type = 'R-RE';
                    }
                    proj.push((f[field] = { field, channel, type }));
                }
                selCmpt.fields[channel] = field;
            }
            else {
                log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
            }
        }
        if (selDef.init) {
            if (scales.has(selCmpt)) {
                log.warn(log.message.NO_INIT_SCALE_BINDINGS);
            }
            else {
                function parseInit(i) {
                    return proj.map(p => (i[p.channel] !== undefined ? i[p.channel] : i[p.field]));
                }
                if (isIntervalSelection(selDef)) {
                    selCmpt.init = parseInit(selDef.init);
                }
                else {
                    const init = isArray(selDef.init) ? selDef.init : [selDef.init];
                    selCmpt.init = init.map(parseInit);
                }
            }
        }
        if (keys(timeUnits).length) {
            selCmpt.timeUnit = new TimeUnitNode(null, timeUnits);
        }
    },
    signals: (model, selCmpt, signals) => {
        const name = selCmpt.name + TUPLE + TUPLE_FIELDS;
        const hasSignal = signals.filter(s => s.name === name);
        return hasSignal.length
            ? signals
            : signals.concat({
                name,
                value: selCmpt.project
            });
    }
};
export default project;
//# sourceMappingURL=project.js.map