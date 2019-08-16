import {TransformCompiler} from './transforms';
import {UnitModel} from '../../unit';
import {NonPositionScaleChannel} from '../../../channel';
import {LegendComponent} from '../../legend/component';
import {forEachSelection, SelectionComponent, STORE} from '..';
import {isObject, stringValue} from 'vega-util';
import {OnEvent} from 'vega';
import toggleTx from './toggle';

const legendBindings: TransformCompiler = {
  has: selCmpt => selCmpt.type !== 'interval' && selCmpt.legends !== false,

  topLevelSignals: (model, selCmpt: SelectionComponent<'single' | 'multi'>, sg) => {
    const name = selCmpt.name;
    if (!isObject(selCmpt.legends)) return sg;
    if (sg.some(s => s.name.indexOf(`${name}_legend`) >= 0)) return sg;

    const hasToggle = toggleTx.has(selCmpt);
    const toggle = selCmpt.toggle;
    const store = stringValue(name + STORE);

    const on: OnEvent[] = [];

    for (const field of Object.keys(selCmpt.legends)) {
      const {signals, ...proj} = selCmpt.legends[field];
      const prefix = `${field}_legend`;
      const events = `@${prefix}_symbols:click, @${prefix}_labels:click`;
      const tpl = `{unit: "${prefix}", fields: [${JSON.stringify(proj)}], values: [datum.value], legend: true}`;

      if (hasToggle) {
        // Taken from toggleTx.modifyExpr
        on.push({
          events,
          update:
            `modify(${store}, ` +
            `${toggle} ? null : ${tpl}, ` +
            (selCmpt.resolve === 'global'
              ? `${toggle} ? null : true, `
              : `${toggle} ? null : {unit: ${stringValue(prefix)}}, `) +
            `${toggle} ? ${tpl} : null)`,
          force: true
        });
      } else {
        // Taken from single/multi compiler.
        on.push({
          events,
          update:
            `modify(${store}, ${tpl}, ` +
            (selCmpt.resolve === 'global'
              ? selCmpt.type === 'single'
                ? 'true)'
                : 'null)'
              : `{unit: ${stringValue(prefix)}})`),
          force: true
        });
      }
    }

    // An event stream to clear out any legend selections made. To respect the
    // resolution scheme, we treat all legends as a single, separate view.
    on.push({
      events: 'click',
      update:
        `!event.item || !datum ? modify(${store}, null, ` +
        (selCmpt.resolve === 'global' ? (hasToggle ? `${toggle} ? null : true)` : 'true)') : '{legend: true})') +
        ': null'
    });

    return sg.concat({name: `${name}_legend`, on});
  }
};

export default legendBindings;

export function parseInteractiveLegend(
  model: UnitModel,
  channel: NonPositionScaleChannel,
  legendCmpt: LegendComponent
) {
  const field = model.fieldDef(channel).field;
  forEachSelection(model, selCmpt => {
    const proj = selCmpt.project.hasField[field] || selCmpt.project.hasChannel[channel];
    if (proj && legendBindings.has(selCmpt)) {
      const legendSelections = legendCmpt.get('selections') || [];
      legendSelections.push(selCmpt);
      legendCmpt.set('selections', legendSelections, false);
      selCmpt.legends = isObject(selCmpt.legends) ? selCmpt.legends : {};
      selCmpt.legends[field] = proj;
    }
  });
}
