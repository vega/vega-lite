import {Channel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {TEMPORAL} from '../../type';
import {extend, vals, Dict} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {Model} from './../model';
import {parseExpression} from './../time';

import {DataComponent} from './data';


// should be similar to timeUnitDomain
export namespace timeUnit {
  function parse(model: Model): Dict<VgTransform> {
    return model.reduce(function(timeUnitComponent, fieldDef: FieldDef, channel: Channel) {
      const ref = field(fieldDef, { nofn: true, datum: true });
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {

        const f = field(fieldDef);
        timeUnitComponent[f] = {
          type: 'formula',
          field: f,
          expr: parseExpression(fieldDef.timeUnit, ref)
        };
      }
      return timeUnitComponent;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    // merge since both child an facet can define time unit
    let timeUnitComponent = parse(model);

    const childDataComponent = model.child().component.data;
    extend(timeUnitComponent, childDataComponent.timeUnit);
    delete childDataComponent.timeUnit;

    return timeUnitComponent;
  }

  /**
   * Merge up time unit. Since the map keys describes the field and the expression, we can just extend.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    childDataComponents.forEach((childData) => {
      extend(dataComponent.timeUnit, childData.timeUnit);
      delete childData.timeUnit;
    });
  }

  export function assemble(component: DataComponent) {
    // just join the values, which are already transforms
    return vals(component.timeUnit);
  }
}
