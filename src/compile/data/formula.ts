import {DataComponentCompiler} from './base';

import {Formula} from '../../transform';
import {extend, vals, hash, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

function parse(model: Model): Dict<Formula> {
  return (model.calculate() || []).reduce(function(formulaComponent, formula) {
    formulaComponent[hash(formula)] = formula;
    return formulaComponent;
  }, {});
}

export const formula: DataComponentCompiler<Dict<Formula>> = {
  parseUnit: parse,

  parseFacet: function(model: FacetModel): Dict<Formula> {
    let formulaComponent = parse(model);

    const childDataComponent = model.child.component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(formulaComponent, childDataComponent.calculate);
      delete childDataComponent.calculate;
    }
    return formulaComponent;
  },

  parseLayer: function(model: LayerModel): Dict<Formula> {
    let formulaComponent = parse(model);
    model.children.forEach((child) => {
      const childDataComponent = child.component.data;
      if (!childDataComponent.source && childDataComponent.calculate) {
        extend(formulaComponent || {}, childDataComponent.calculate);
        delete childDataComponent.calculate;
      }
    });
    return formulaComponent;
  },

  assemble: function(component: Dict<Formula>) {
    return vals(component).reduce(function(transform: any, f: any) {
      transform.push(extend({type: 'formula'}, f));
      return transform;
    }, []);
  }
};
