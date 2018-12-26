import {SignalRef} from 'vega';
import {isArray} from 'vega-util';
import {Channel, ScaleChannel} from '../../channel';
import {globalWholeWordRegExp, keys} from '../../util';
import {isVgRangeStep, VgRange, VgScale} from '../../vega.schema';
import {isConcatModel, isLayerModel, isRepeatModel, Model} from '../model';
import {isRawSelectionDomain, selectionScaleDomain} from '../selection/selection';
import {SignalRefComponent} from '../signal';
import {assembleDomain} from './domain';

export function assembleScales(model: Model): VgScale[] {
  if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
    // For concat / layer / repeat, include scales of children too
    return model.children.reduce((scales, child) => {
      return scales.concat(assembleScales(child));
    }, assembleScalesForModel(model));
  } else {
    // For facet, child scales would not be included in the parent's scope.
    // For unit, there is no child.
    return assembleScalesForModel(model);
  }
}

export function assembleScalesForModel(model: Model): VgScale[] {
  return keys(model.component.scales).reduce(
    (scales: VgScale[], channel: ScaleChannel) => {
      const scaleComponent = model.component.scales[channel];
      if (scaleComponent.merged) {
        // Skipped merged scales
        return scales;
      }

      const scale = scaleComponent.combine();

      // need to separate const and non const object destruction
      let {domainRaw} = scale;
      const {name, type, domainRaw: _d, range: _r, ...otherScaleProps} = scale;

      const range = assembleScaleRange(scale.range, name, model, channel);

      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        domainRaw = selectionScaleDomain(model, domainRaw);
      }

      scales.push({
        name,
        type,
        domain: assembleDomain(model, channel),
        ...(domainRaw ? {domainRaw} : {}),
        range: range,
        ...otherScaleProps
      });

      return scales;
    },
    [] as VgScale[]
  );
}
function assembleExprSignal(scaleRange: SignalRefComponent, model: Model) {
  let signal = scaleRange.expr;
  for (const signalName of scaleRange.signalNames) {
    const newName = model.getSignalName(signalName);
    if (newName !== signalName) {
      // replace the signal name

      const regEx = globalWholeWordRegExp(signalName);

      signal = signal.replace(regEx, newName);
    }
  }
  return {signal};
}

export function assembleScaleRange(
  scaleRange: VgRange<SignalRefComponent>,
  scaleName: string,
  model: Model,
  channel: Channel
): VgRange<SignalRef> {
  if (scaleRange instanceof SignalRefComponent) {
    return assembleExprSignal(scaleRange, model);
  } else if (isArray(scaleRange)) {
    return scaleRange.map(val => {
      if (val instanceof SignalRefComponent) {
        return assembleExprSignal(val, model);
      }
      return val;
    });
  } else {
    // add signals to x/y range
    if (channel === 'x' || channel === 'y') {
      if (isVgRangeStep(scaleRange)) {
        // For x/y range step, use a signal created in layout assemble instead of a constant range step.
        return {
          step: {signal: scaleName + '_step'}
        };
      }
    }
    return scaleRange;
  }
}
