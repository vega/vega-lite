import {isArray} from 'vega-util';
import {vals} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, VgDataRef} from '../../vega.schema';
import {Model} from '../model';

export function assembleScale(model: Model) {
    return vals(model.component.scales).map(scale => {
      // correct references to data
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
