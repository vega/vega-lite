import {isArray} from 'vega-util';
import {Channel} from '../../channel';
import * as log from '../../log';
import {isSelectionDomain} from '../../scale';
import {keys, stringValue} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, isVgRangeStep, isVgSignalRef, VgDataRef, VgRange, VgScale} from '../../vega.schema';
import {Model} from '../model';
import {isRawSelectionDomain, selectionScaleDomain} from '../selection/selection';

export function assembleScaleForModelAndChildren(model: Model) {
  return model.children.reduce((scales, child) => {
    return scales.concat(child.assembleScales());
  }, assembleScalesForModel(model));
}

export function assembleScalesForModel(model: Model): VgScale[] {
    return keys(model.component.scales).reduce((scales: VgScale[], channel: Channel) => {
      const scaleComponent= model.component.scales[channel];
      if (scaleComponent.merged) {
        // Skipped merged scales
        return scales;
      }

      // We need to cast here as combine returns Partial<VgScale> by default.
      const scale = scaleComponent.combine(['name', 'type', 'domain', 'domainRaw', 'range']) as VgScale;
      scale.range = assembleScaleRange(scale.range, scale.name, model, channel);

      const domainRaw = scaleComponent.get('domainRaw');
      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        scale.domainRaw = selectionScaleDomain(model, domainRaw);
      }

      // Correct references to data as the original domain's data was determined
      // in parseScale, which happens before parseData. Thus the original data
      // reference can be incorrect.
      const domain = scaleComponent.get('domain');
      if (isDataRefDomain(domain) || isFieldRefUnionDomain(domain)) {
        domain.data = model.lookupDataSource(domain.data);
        scales.push(scale);
      } else if (isDataRefUnionedDomain(domain)) {
        domain.fields = domain.fields.map((f: VgDataRef) => {
          return {
            ...f,
            data: model.lookupDataSource(f.data)
          };
        });
        scales.push(scale);
      } else if (isSignalRefDomain(domain) || isArray(domain)) {
        scales.push(scale);
      } else {
        throw new Error('invalid scale domain');
      }
      return scales;
    }, []);
}

export function assembleScaleRange(scaleRange: VgRange, scaleName: string, model: Model, channel: Channel) {
  // add signals to x/y range
  if (channel === 'x' || channel === 'y') {
    if (isVgRangeStep(scaleRange)) {
      // For x/y range step, use a signal created in layout assemble instead of a constant range step.
      return {
        step: {signal: scaleName + '_step'}
      };
    } else if (isArray(scaleRange) && scaleRange.length === 2) {
      const r0 = scaleRange[0];
      const r1 = scaleRange[1];
      if (r0 === 0 && isVgSignalRef(r1)) {
        // Replace width signal just in case it is renamed.
        return [0, {signal: model.getSizeName(r1.signal)}];
      } else if (isVgSignalRef(r0) && r1 === 0) {
        // Replace height signal just in case it is renamed.
        return [{signal: model.getSizeName(r0.signal)}, 0];
      }
    }
  }
  return scaleRange;
}
