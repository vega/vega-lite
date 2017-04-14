import {Channel} from '../../../channel';
import {SelectionDef} from '../../../selection';
import {TransformCompiler} from './transforms';

const project:TransformCompiler = {
  has: function(selDef: SelectionDef) {
    return selDef.fields !== undefined || selDef.encodings !== undefined;
  },

  parse: function(model, selDef, selCmpt) {
    const fields = {};
    // TODO: find a possible channel mapping for these fields.
    (selDef.fields || []).forEach((f) => fields[f] = null);
    (selDef.encodings || []).forEach((e: Channel) => fields[model.field(e)] = e);

    const projection = selCmpt.project || (selCmpt.project = []);
    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        projection.push({field: field, encoding: fields[field]});
      }
    }
  }
};

export {project as default};
