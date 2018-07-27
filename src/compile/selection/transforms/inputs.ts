import {stringValue} from 'vega-util';
import {accessPathWithDatum, varName} from '../../../util';
import {TUPLE} from '../selection';
import nearest from './nearest';
import {TransformCompiler} from './transforms';

const inputBindings: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.type === 'single' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind !== 'scales';
  },

  topLevelSignals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const proj = selCmpt.project;
    const bind = selCmpt.bind;
    const datum = nearest.has(selCmpt) ? '(item().isVoronoi ? datum.datum : datum)' : 'datum';

    proj.forEach(p => {
      const sgname = varName(`${name}_${p.field}`);
      const hasSignal = signals.filter(s => s.name === sgname);
      if (!hasSignal.length) {
        signals.unshift({
          name: sgname,
          value: '',
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
    const fields = proj.map(p => stringValue(p.field)).join(', ');
    const values = proj.map(p => varName(`${name}_${p.field}`));

    if (values.length) {
      signal.update = `${values.join(' && ')} ? {fields: [${fields}], values: [${values.join(', ')}]} : null`;
    }

    delete signal.value;
    delete signal.on;

    return signals;
  }
};

export default inputBindings;
