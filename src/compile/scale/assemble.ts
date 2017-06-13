import {isArray} from 'vega-util';
import * as log from '../../log';
import {isSelectionDomain} from '../../scale';
import {stringValue, vals} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, VgDataRef, VgScale} from '../../vega.schema';
import {Model} from '../model';
import {isRawSelectionDomain, scaleDomain} from '../selection/selection';

export function assembleScale(model: Model): VgScale[] {
    return vals(model.component.scales).map(scaleComponent => {
      // We need to cast here as combine returns Partial<VgScale> by default.
      const scale = scaleComponent.combine(['name', 'type', 'domain', 'domainRaw', 'range']) as VgScale;

      const domainRaw = scaleComponent.get('domainRaw');
      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        scale.domainRaw = scaleDomain(model, domainRaw);
      }

      // Correct references to data as the original domain's data was determined
      // in parseScale, which happens before parseData. Thus the original data
      // reference can be incorrect.
      const domain = scaleComponent.get('domain');
      if (isDataRefDomain(domain) || isFieldRefUnionDomain(domain)) {
        domain.data = model.lookupDataSource(domain.data);
        return scale;
      } else if (isDataRefUnionedDomain(domain)) {
        domain.fields = domain.fields.map((f: VgDataRef) => {
          return {
            ...f,
            data: model.lookupDataSource(f.data)
          };
        });
        return scale;
      } else if (isSignalRefDomain(domain) || isArray(domain)) {
        return scale;
      } else {
        throw new Error('invalid scale domain');
      }
    });
}
