import {UnitModel} from './../../unit';
import {SelectionSpec, SelectionComponent} from '../../../selection';
import {Channel} from '../../../channel';
import {TransformCompiler} from './';

const project:TransformCompiler = {
  parse: function(model: UnitModel, def: SelectionSpec, sel: SelectionComponent) {
    sel.project = (sel.project.fields || [])
      .map(function(f: string) { return {field: f}; })
      .concat((sel.project.encodings || [])
        .map(function(c: Channel) { return {encoding: c, field: model.field(c)}; }));
  }
};

export {project as default};
