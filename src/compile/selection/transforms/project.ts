import {SingleDefChannel} from '../../../channel';
import * as log from '../../../log';
import {SelectionDef} from '../../../selection';
import {keys} from '../../../util';
import {TimeUnitComponent, TimeUnitNode} from '../../data/timeunit';
import {ProjectSelectionComponent, SelectionComponent} from '../selection';
import {TransformCompiler} from './transforms';

const project: TransformCompiler = {
  has: (selDef: SelectionComponent | SelectionDef) => {
    const def = selDef as SelectionDef;
    return def.fields !== undefined || def.encodings !== undefined;
  },

  parse: (model, selDef, selCmpt) => {
    const timeUnits: {[field: string]: TimeUnitComponent} = {};
    const f: {[field: string]: ProjectSelectionComponent} = {};
    const p = selCmpt.project || (selCmpt.project = []);
    selCmpt.fields = {};

    // TODO: find a possible channel mapping for these fields.
    if (selDef.fields) {
      p.push.apply(p, selDef.fields.map(field => ({field})));
    }

    (selDef.encodings || []).forEach((channel: SingleDefChannel) => {
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
          p.push(f[field] = {field, channel});
        }

        selCmpt.fields[channel] = field;
      } else {
        log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
      }
    });

    if (keys(timeUnits).length) {
      selCmpt.timeUnit = new TimeUnitNode(null, timeUnits);
    }
  }
};

export default project;
