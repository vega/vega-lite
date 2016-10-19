import {Channel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {fieldExpr} from '../../timeunit';
import {TEMPORAL} from '../../type';
import {extend, vals, Dict} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model} from '../model';

import {DataComponent} from './data';

export namespace timeUnit {
  function parse(model: Model): Dict<VgTransform> {
    return model.reduce(function(timeUnitComponent, fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {

        const hash = field(fieldDef);

        timeUnitComponent[hash] = {
          type: 'formula',
          field: field(fieldDef),
          expr: fieldExpr(fieldDef.timeUnit, fieldDef.field)
        };
      }
      return timeUnitComponent;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let timeUnitComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(timeUnitComponent, childDataComponent.timeUnit);
      delete childDataComponent.timeUnit;
    }
    return timeUnitComponent;
  }

  export function parseLayer(model: LayerModel) {
    let timeUnitComponent = parse(model);
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (!childDataComponent.source) {
        extend(timeUnitComponent, childDataComponent.timeUnit);
        delete childDataComponent.timeUnit;
      }
    });
    return timeUnitComponent;
  }

  export function assemble(component: DataComponent) {
    // just join the values, which are already transforms
    return vals(component.timeUnit);
  }
}
