import {Channel} from '../../../channel';
import {SelectionSpec} from '../../../selection';
import {TransformCompiler} from './';

const project:TransformCompiler = {
  has: function(sel: SelectionSpec) {
    return sel.fields !== undefined || sel.encodings !== undefined;
  },

  parse: function(model, def, sel) {
    let fields = {};
    // TODO: find a possible channel mapping for these fields.
    (def.fields || []).forEach((f) => fields[f] = null);
    (def.encodings || []).forEach((e: Channel) => fields[model.field(e)] = e);

    let projection = sel.project || (sel.project = []);
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        projection.push({field: field, encoding: fields[field]});
      }
    }
  }
};

export {project as default};
