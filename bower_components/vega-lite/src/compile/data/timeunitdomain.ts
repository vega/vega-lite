import {Channel} from '../../channel';
import {FieldDef} from '../../fielddef';
import {TimeUnit} from '../../timeunit';
import {extend, keys, StringSet} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';
import {parseExpression, rawDomain} from './../time';

import {DataComponent} from './data';


export namespace timeUnitDomain {
  function parse(model: Model): StringSet {
    return model.reduce(function(timeUnitDomainMap, fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.timeUnit) {
        const domain = rawDomain(fieldDef.timeUnit, channel);
        if (domain) {
          timeUnitDomainMap[fieldDef.timeUnit] = true;
        }
      }
      return timeUnitDomainMap;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    // always merge with child
    return extend(parse(model), model.child().component.data.timeUnitDomain);
  }

  export function parseLayer(model: LayerModel) {
    // always merge with children
    return extend(parse(model), model.children().forEach((child) => {
      return child.component.data.timeUnitDomain;
    }));
  }

  export function assemble(component: DataComponent): VgData[] {
    return keys(component.timeUnitDomain).reduce(function(timeUnitData, tu: any) {
      const timeUnit: TimeUnit = tu; // cast string back to enum
      const domain = rawDomain(timeUnit, null); // FIXME fix rawDomain signature
      if (domain) {
        timeUnitData.push({
          name: timeUnit,
          values: domain,
          transform: [{
            type: 'formula',
            field: 'date',
            expr: parseExpression(timeUnit, 'datum.data', true)
          }]
        });
      }
      return timeUnitData;
    }, []);
  }
}
