import {DataComponentCompiler} from './base';

import {field, FieldDef} from '../../fielddef';
import {fieldExpr} from '../../timeunit';
import {TEMPORAL} from '../../type';
import {extend, vals, Dict} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model} from '../model';

function parse(model: Model): Dict<VgFormulaTransform> {
  return model.reduce(function(timeUnitComponent: Dict<VgFormulaTransform>, fieldDef: FieldDef) {
    if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {

      const hash = field(fieldDef);

      timeUnitComponent[hash] = {
        type: 'formula',
        as: field(fieldDef),
        expr: fieldExpr(fieldDef.timeUnit, fieldDef.field)
      };
    }
    return timeUnitComponent;
  }, {});
}

export const timeUnit: DataComponentCompiler<Dict<VgFormulaTransform>> = {
  parseUnit: parse,

  parseFacet: function (model: FacetModel) {
    let timeUnitComponent = parse(model);

    const childDataComponent = model.child.component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(timeUnitComponent, childDataComponent.timeUnit);
      delete childDataComponent.timeUnit;
    }
    return timeUnitComponent;
  },

  parseLayer: function(model: LayerModel) {
    let timeUnitComponent = parse(model);
    model.children.forEach((child) => {
      const childDataComponent = child.component.data;
      if (!childDataComponent.source) {
        extend(timeUnitComponent, childDataComponent.timeUnit);
        delete childDataComponent.timeUnit;
      }
    });
    return timeUnitComponent;
  },
  assemble: function(component: Dict<VgFormulaTransform>) {
    // just join the values, which are already transforms
    return vals(component);
  }
};
