import {SelectionComponent} from '..';
import {LEGEND, TUPLE} from '..';
import {SelectionDef} from '../../../selection';
import {selectionOnChannel} from '../../legend/parse';
import {TransformCompiler} from './transforms';

const legend: TransformCompiler = {
  has: (selDef: SelectionComponent | SelectionDef) => {
    const def = selDef as SelectionDef;
    // return def.fields !== undefined && selDef.type !== 'interval' && selDef.legend;
    return def.fields !== undefined && selDef.type !== 'interval' && containsInteractiveLegendChannels(def);
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const signal = signals.filter(s => s.name === name + TUPLE)[0];
    // Disable update when clicked on legend marks
    // Todo: declare proper types
    const legendExpression = selectionOnChannel.reduce((expression: string, e: any) => {
      return (
        expression +
        `item().mark.name !== 'symbols_${e.selection}${LEGEND}' && item().mark.name !== 'labels_${
          e.selection
        }${LEGEND}' && `
      );
    }, '');
    signal.on[0].update = legendExpression + signal.on[0].update;
    signal.on.push({
      events: `@symbols_${name}${LEGEND}:click, @labels_${name}${LEGEND}:click`,
      update: `{unit: "", fields: ${name}_tuple_fields, values: [datum.value]}`
    });

    return signals;
  }
};

export default legend;

function containsInteractiveLegendChannels(selDef: SelectionComponent | SelectionDef) {
  for (const obj of selectionOnChannel) {
    if (obj.selection === selDef['name'] && obj.field === selDef['fields'][0]) {
      return true;
    }
  }
  return false;
}
