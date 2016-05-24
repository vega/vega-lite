import {Channel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {TEMPORAL} from '../../type';
import {extend, vals, Dict} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';
import {parseExpression} from './../time';

import {DataComponent} from './data';


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

  /**
   * Merge up time unit. Since the map keys describes the field and the expression, we can just extend.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    childDataComponents.forEach((data) => {
      extend(dataComponent.timeUnit, data.timeUnit);
      delete data.timeUnit;
    });
  }

  export const parseUnit = parse;

  export function assemble(component: DataComponent) {
    // just join the values, which are already transforms
    return vals(component.timeUnit);
  }
}
