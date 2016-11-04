import {Formula} from '../../transform';
import {extend, vals, hash, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

export namespace formula {
  function parse(model: Model): Dict<Formula> {
    return (model.calculate() || []).reduce(function(formulaComponent, formula) {
      formulaComponent[hash(formula)] = formula;
      return formulaComponent;
    }, {} as Dict<Formula>);
  }

  export const parseUnit: (model: Model) => Dict<Formula> = parse;

  export function parseFacet(model: FacetModel): Dict<Formula> {
    let formulaComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(formulaComponent, childDataComponent.calculate);
      delete childDataComponent.calculate;
    }
    return formulaComponent;
  }

  export function parseLayer(model: LayerModel): Dict<Formula> {
    let formulaComponent = parse(model);
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (!childDataComponent.source && childDataComponent.calculate) {
        extend(formulaComponent || {}, childDataComponent.calculate);
        delete childDataComponent.calculate;
      }
    });
    return formulaComponent;
  }

  export function assemble(component: Dict<Formula>) {
    return vals(component).reduce(function(transform: any, formula: any) {
      transform.push(extend({ type: 'formula' }, formula));
      return transform;
    }, []);
  }
}
