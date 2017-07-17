import {isArray} from 'vega-util';
import * as log from '../../log';
import {isSelectionDomain} from '../../scale';
import {keys, stringValue} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, isVgRangeStep, VgDataRef, VgScale} from '../../vega.schema';
import {Model} from '../model';
import {isRawSelectionDomain, selectionScaleDomain} from '../selection/selection';


export function assembleScale(model: Model): VgScale[] {
    return keys(model.component.scales).reduce((scales: VgScale[], channel) => {
      const scaleComponent= model.component.scales[channel];
      if (scaleComponent.merged) {
        // Skipped merged scales
        return scales;
      }

      // We need to cast here as combine returns Partial<VgScale> by default.
      const scale = scaleComponent.combine(['name', 'type', 'domain', 'domainRaw', 'range']) as VgScale;


      // add signals to x/y range
      if (channel === 'x' || channel === 'y') {
        if (isVgRangeStep(scale.range)) {
          // For x/y range step, use a signal created in layout assemble instead of a constant range step.
          scale.range = {
            step: {signal: scale.name + '_step'}
          };
        }
      }

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
