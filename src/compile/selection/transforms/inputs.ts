import {TUPLE} from '..';
import {accessPathWithDatum, varName} from '../../../util';
import {assembleInit} from '../assemble';
import nearest from './nearest';
import {TUPLE_FIELDS} from './project';
import {TransformCompiler} from './transforms';

const inputBindings: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.type === 'single' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind !== 'scales';
  },

  topLevelSignals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const proj = selCmpt.project;
    const bind = selCmpt.bind;
    const init = selCmpt.init && selCmpt.init[0]; // Can only exist on single selections (one initial value).
    const datum = nearest.has(selCmpt) ? '(item().isVoronoi ? datum.datum : datum)' : 'datum';

    proj.items.forEach((p, i) => {
      const sgname = varName(`${name}_${p.field}`);
      const hasSignal = signals.filter(s => s.name === sgname);
      if (!hasSignal.length) {
        signals.unshift({
          name: sgname,
          ...(init ? {init: assembleInit(init[i])} : {value: null}),
          on: [
            {
              events: selCmpt.events,
              update: `datum && item().mark.marktype !== 'group' ? ${accessPathWithDatum(p.field, datum)} : null`
            }
          ],
          bind: bind[p.field] || bind[p.channel] || bind
        });
      }
    });

    return signals;
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const proj = selCmpt.project;
    const signal = signals.filter(s => s.name === name + TUPLE)[0];
    const fields = name + TUPLE_FIELDS;
    const values = proj.items.map(p => varName(`${name}_${p.field}`));
    const valid = values.map(v => `${v} !== null`).join(' && ');

    if (values.length) {
      signal.update = `${valid} ? {fields: ${fields}, values: [${values.join(', ')}]} : null`;
    }

    delete signal.value;
    delete signal.on;

    return signals;
  }
};

export default inputBindings;
