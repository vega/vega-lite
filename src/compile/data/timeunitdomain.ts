import {Channel} from '../../channel';
import {dateTimeExpr, DateTimeExpr} from '../../datetime';
import {FieldDef} from '../../fielddef';
import {TimeUnit, rawDomain} from '../../timeunit';
import {TEMPORAL} from '../../type';
import {extend, keys, StringSet} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {Model} from './../model';

import {DataComponent} from './data';

// should be similar to timeUnit
export namespace timeUnitDomain {
  function parse(model: Model): StringSet {
    return model.reduce(function(timeUnitDomainMap, fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {
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
    // merge since both child and facet can define time unit

    const tuDomainComponent = parse(model);
    const childDataComponent = model.child().component.data;

    extend(tuDomainComponent, childDataComponent.timeUnitDomain);
    delete childDataComponent.timeUnitDomain;

    return tuDomainComponent;
  }

  export function merge(dataComponent: DataComponent, children: Model[]) {
    children.forEach((child) => {
      extend(dataComponent.timeUnitDomain, child.component.data.timeUnitDomain);
      delete child.component.data.timeUnitDomain;
    });
  }

  export function assemble(component: DataComponent): VgData[] {
    return keys(component.timeUnitDomain).reduce(function(timeUnitData, tu: any) {
      const timeUnit: TimeUnit = tu; // cast string back to enum
      const domain = rawDomain(timeUnit, null); // FIXME fix rawDomain signature
      if (domain) {
        let datetime: DateTimeExpr = {};
        datetime[timeUnit] = 'datum.data';

        timeUnitData.push({
          name: timeUnit,
          values: domain,
          transform: [{
            type: 'formula',
            field: 'date',
            expr: dateTimeExpr(datetime)
          }]
        });
      }
      return timeUnitData;
    }, []);
  }
}
