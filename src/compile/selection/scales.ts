import {stringValue} from 'vega-util';
import {VL_SELECTION_RESOLVE} from './index.js';
import {isScaleChannel, ScaleChannel} from '../../channel.js';
import * as log from '../../log/index.js';
import {hasContinuousDomain} from '../../scale.js';
import {isLayerModel, Model} from '../model.js';
import {UnitModel} from '../unit.js';
import {SelectionProjection} from './project.js';
import {SelectionCompiler} from './index.js';
import {replacePathInField} from '../../util.js';
import {NewSignal} from 'vega';

const scaleBindings: SelectionCompiler<'interval'> = {
  defined: (selCmpt) => {
    return selCmpt.type === 'interval' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind === 'scales';
  },

  parse: (model, selCmpt) => {
    const bound: SelectionProjection[] = (selCmpt.scales = []);

    for (const proj of selCmpt.project.items) {
      const channel = proj.channel;

      if (!isScaleChannel(channel)) {
        continue;
      }

      const scale = model.getScaleComponent(channel);
      const scaleType = scale ? scale.get('type') : undefined;

      if (scaleType == 'sequential') {
        log.warn(log.message.SEQUENTIAL_SCALE_DEPRECATED);
      }

      if (!scale || !hasContinuousDomain(scaleType)) {
        log.warn(log.message.SCALE_BINDINGS_CONTINUOUS);
        continue;
      }

      scale.set('selectionExtent', {param: selCmpt.name, field: proj.field}, true);
      bound.push(proj);
    }
  },

  topLevelSignals: (model, selCmpt, signals) => {
    const bound = selCmpt.scales.filter((proj) => signals.filter((s) => s.name === proj.signals.data).length === 0);

    // Top-level signals are only needed for multiview displays and if this
    // view's top-level signals haven't already been generated.
    if (!model.parent || isTopLevelLayer(model) || bound.length === 0) {
      return signals;
    }

    // vlSelectionResolve does not account for the behavior of bound scales in
    // multiview displays. Each unit view adds a tuple to the store, but the
    // state of the selection is the unit selection most recently updated. This
    // state is captured by the top-level signals that we insert and "push
    // outer" to from within the units. We need to reassemble this state into
    // the top-level named signal, except no single selCmpt has a global view.
    const namedSg: NewSignal = signals.find((s) => s.name === selCmpt.name);
    let update = namedSg.update;
    if (update.includes(VL_SELECTION_RESOLVE)) {
      namedSg.update = `{${bound
        .map((proj) => `${stringValue(replacePathInField(proj.field))}: ${proj.signals.data}`)
        .join(', ')}}`;
    } else {
      for (const proj of bound) {
        const mapping = `${stringValue(replacePathInField(proj.field))}: ${proj.signals.data}`;
        if (!update.includes(mapping)) {
          update = `${update.substring(0, update.length - 1)}, ${mapping}}`;
        }
      }
      namedSg.update = update;
    }

    return signals.concat(bound.map((proj) => ({name: proj.signals.data})));
  },

  signals: (model, selCmpt, signals) => {
    // Nested signals need only push to top-level signals with multiview displays.
    if (model.parent && !isTopLevelLayer(model)) {
      for (const proj of selCmpt.scales) {
        const signal: any = signals.find((s) => s.name === proj.signals.data);
        signal.push = 'outer';
        delete signal.value;
        delete signal.update;
      }
    }

    return signals;
  },
};

export default scaleBindings;

export function domain(model: UnitModel, channel: ScaleChannel) {
  const scale = stringValue(model.scaleName(channel));
  return `domain(${scale})`;
}

function isTopLevelLayer(model: Model): boolean {
  return model.parent && isLayerModel(model.parent) && (!model.parent.parent || isTopLevelLayer(model.parent.parent));
}
