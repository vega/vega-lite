import {TransformCompiler} from './';
import {stringValue} from '../../../util';
import {warn} from '../../../log';

const inputBindings:TransformCompiler = {
  has: function(sel) {
    return sel.bind && sel.bind !== 'scales';
  },

  topLevelSignals: function(model, sel, signals) {
    let name = sel.name, proj = sel.project, bind = sel.bind;
    if (sel.type !== 'single' || sel.resolve !== 'single') {
      warn('Only "single" selections resolved to "single" can be bound to input widgets.');
      return signals;
    }

    let datum = '(item().isVoronoi ? datum.datum : datum)';
    proj.forEach(function(p) {
      signals.unshift({
        name: name + id(p.field),
        value: '',
        on: [{
          events: sel.events,
          update: datum + '[' + stringValue(p.field) + ']'
        }],
        bind: bind[p.field] || bind[p.encoding] || bind
      });
    });

    return signals;
  },

  signals: function(model, sel, signals) {
    if (sel.type !== 'single' || sel.resolve !== 'single') {
      return signals;
    }

    let name = sel.name, proj = sel.project,
        signal = signals.filter((s) => s.name === name)[0];

    signal.update = '{fields: [' +
      proj.map((p) => stringValue(p.field)).join(', ') +
      '], values: [' +
      proj.map((p) => name + id(p.field)).join(', ') +
      ']}';
    delete signal.value;
    delete signal.on;

    return signals;
  }
};

export {inputBindings as default};

function id(str: string) {
  return '_' + str.replace(/\W/g, '_');
}
