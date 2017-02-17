import {TransformCompiler} from './transforms';
import {stringValue} from '../../../util';
import {warn} from '../../../log';

const inputBindings:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.bind && selCmpt.bind !== 'scales';
  },

  topLevelSignals: function(model, selCmpt, signals) {
    let name = selCmpt.name, proj = selCmpt.project, bind = selCmpt.bind;
    if (selCmpt.type !== 'single' || selCmpt.resolve !== 'single') {
      warn('Only "single" selections resolved to "single" can be bound to input widgets.');
      return signals;
    }

    let datum = '(item().isVoronoi ? datum.datum : datum)';
    proj.forEach(function(p) {
      signals.unshift({
        name: name + id(p.field),
        value: '',
        on: [{
          events: selCmpt.events,
          update: `${datum}[${stringValue(p.field)}]`
        }],
        bind: bind[p.field] || bind[p.encoding] || bind
      });
    });

    return signals;
  },

  signals: function(model, selCmpt, signals) {
    if (selCmpt.type !== 'single' || selCmpt.resolve !== 'single') {
      return signals;
    }

    let name = selCmpt.name, proj = selCmpt.project,
        signal = signals.filter((s) => s.name === name)[0],
        fields = proj.map((p) => stringValue(p.field)).join(', '),
        values = proj.map((p) => name + id(p.field)).join(', ');

    signal.update = `{fields: [${fields}], values: [${values}]}`;
    delete signal.value;
    delete signal.on;

    return signals;
  }
};

export {inputBindings as default};

function id(str: string) {
  return '_' + str.replace(/\W/g, '_');
}
