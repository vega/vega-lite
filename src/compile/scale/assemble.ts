import {isArray} from 'vega-util';
import * as log from '../../log';
import {isSelectionDomain} from '../../scale';
import {stringValue, vals} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, VgDataRef} from '../../vega.schema';
import {Model} from '../model';
import {isRawSelectionDomain, scaleDomain} from '../selection/selection';

export function assembleScale(model: Model) {
    return vals(model.component.scales).map(scale => {
      // Correct any raw selection domains.
      if (scale.domainRaw && isRawSelectionDomain(scale.domainRaw)) {
        scale.domainRaw = scaleDomain(model, scale.domainRaw);
      }

      // Correct references to data
      const domain = scale.domain;
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
