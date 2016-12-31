import {Channel} from '../../../channel';
import {TransformCompiler} from './';

const project:TransformCompiler = {
  has: function(sel) {
    return sel.project !== undefined && sel.project !== false;
  },

  parse: function(model, def, sel) {
    sel.project = (sel.project.fields || [])
      .map(function(f: string) { return {field: f}; })
      .concat((sel.project.encodings || [])
        .map(function(c: Channel) { return {encoding: c, field: model.field(c)}; }));
  }
};

export {project as default};
