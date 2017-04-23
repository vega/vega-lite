import {isArray} from 'vega-util';
import * as log from '../../log';
import {isSelectionDomain} from '../../scale';
import {stringValue, vals} from '../../util';
import {isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRefDomain, VgDataRef} from '../../vega.schema';
import {Model} from '../model';

const SELECTION_OPS = {
  global: 'union', independent: 'intersect',
  union: 'union', union_others: 'union',
  intersect: 'intersect', intersect_others: 'intersect'
};

export function assembleScale(model: Model) {
    return vals(model.component.scales).map(scale => {
      // As selections are parsed _after_ scales, we can only shim in a domainRaw
      // in the output Vega during assembly. FIXME: This should be moved to
      // selection.ts, but any reference to it throws an error. Possible circular dependency?
      const raw = scale.domainRaw;
      if (raw && raw.selection) {
        raw.field = raw.field || null;
        raw.encoding = raw.encoding || null;
        const selName = raw.selection;
        let selCmpt = model.component.selection && model.component.selection[selName];
        if (selCmpt) {
          log.warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
        } else {
          selCmpt = model.getComponent('selection', selName);
          scale.domainRaw = {
            signal: (selCmpt.type === 'interval' ? 'vlIntervalDomain' : 'vlPointDomain') +
            `(${stringValue(selCmpt.name + '_store')}, ${stringValue(raw.encoding)}, ${stringValue(raw.field)}, ` +
            `${stringValue(SELECTION_OPS[selCmpt.resolve])})`
          };
        }
      }

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
