import {SelectionComponent} from '..';
import {TUPLE} from '..';
import {SelectionDef} from '../../../selection';
// import {varName} from '../../../util';
// import {TUPLE_FIELDS} from './project';
import {TransformCompiler} from './transforms';

const legend: TransformCompiler = {
  has: (selDef: SelectionComponent | SelectionDef) => {
    const def = selDef as SelectionDef;
    return def.fields !== undefined && selDef.type !== 'interval' && selDef.legend;
  },

  parse: (model, selDef, selCmpt) => {
    console.log('This works TADAAA');
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const signal = signals.filter(s => s.name === name + TUPLE)[0];

    // Disable main update when clicked on legend marks
    signal.on[0].update = `item().mark.name !== 'symbols_legend' && item().mark.name !== 'labels_legend' && ${
      signal.on[0].update
    }`;
    signal.on.push({
      events: '@symbols_legend:click, @labels_legend:click',
      update: '{unit: "", fields: CylYr_tuple_fields, values: [datum.value]}'
    });

    return signals;
  }
};

export default legend;
