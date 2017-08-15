import {SingleDefChannel} from '../../../channel';
import * as log from '../../../log';
import {SelectionDef} from '../../../selection';
import {keys} from '../../../util';
import {TimeUnitComponent, TimeUnitNode} from '../../data/timeunit';
import {TransformCompiler} from './transforms';

const project:TransformCompiler = {
  has: function(selDef: SelectionDef) {
    return selDef.fields !== undefined || selDef.encodings !== undefined;
  },

  parse: function(model, selDef, selCmpt) {
    const channels = {};
    const timeUnits: {[key: string]: TimeUnitComponent} = {};

    // TODO: find a possible channel mapping for these fields.
    (selDef.fields || []).forEach((field) => channels[field] = null);

    (selDef.encodings || []).forEach((channel: SingleDefChannel) => {
      const fieldDef = model.fieldDef(channel);
      if (fieldDef) {
        if (fieldDef.timeUnit) {
          const tuField = model.field(channel);
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
        } else {
          channels[fieldDef.field] = channel;
        }
      } else {
        log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
      }
    });

    const projection = selCmpt.project || (selCmpt.project = []);
    for (const field in channels) {
      if (channels.hasOwnProperty(field)) {
        projection.push({field: field, channel: channels[field]});
      }
    }

    const fields = selCmpt.fields || (selCmpt.fields = {});
    projection.filter((p) => p.channel).forEach((p) => fields[p.channel] = p.field);

    if (keys(timeUnits).length) {
      selCmpt.timeUnit = new TimeUnitNode(timeUnits);
    }
  }
};

export {project as default};
