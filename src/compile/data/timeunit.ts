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

        const hash = field(fieldDef);

        timeUnitComponent[hash] = {
          type: 'formula',
          field: field(fieldDef),
          expr: parseExpression(fieldDef.timeUnit, ref)
        };
      }
      return timeUnitComponent;
    }, {});
  }

  export const parseUnit = parse;

  export function assemble(component: DataComponent) {
    // just join the values, which are already transforms
    return vals(component.timeUnit);
  }
}
