import {SelectionComponent} from '..';
import {LEGEND, TUPLE} from '..';
import {SelectionDef} from '../../../selection';
import {TransformCompiler} from './transforms';

const legend: TransformCompiler = {
  has: (selDef: SelectionComponent | SelectionDef) => {
    const def = selDef as SelectionDef;
    return def.fields !== undefined && selDef.type !== 'interval' && selDef.legend;
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const signal = signals.filter(s => s.name === name + TUPLE)[0];

    // Disable main update when clicked on legend marks
    signal.on[0].update = `item().mark.name !== 'symbols${LEGEND}' && item().mark.name !== 'labels${LEGEND}' && ${
      signal.on[0].update
    }`;
    signal.on.push({
      events: `@symbols${LEGEND}:click, @labels${LEGEND}:click`,
      update: `{unit: "", fields: ${name}_tuple_fields, values: [datum.value]}`
    });

    return signals;
  }
};

export default legend;
