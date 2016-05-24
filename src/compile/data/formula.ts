import {Formula} from '../../transform';
import {extend, vals, hash, Dict, forEach} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';


export namespace formula {
  function parse(model: Model): Dict<Formula> {
    return (model.transform().calculate || []).reduce(function(formulaComponent, formula) {
      // index by the field that is created so that we make sure that we don't write it multiple times
      formulaComponent[formula.field] = formula;
      return formulaComponent;
    }, {} as Dict<Formula>);
  }

  export const parseUnit = parse;

  /**
   * Merge the formulas from the parent and all components into parent.
   *
   * Returns whether all formulas could be merged.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    let allMerged = true;

    childDataComponents.reduce((collector, data) => {
      forEach(data.calculate, (formula, field) => {
        if (!(field in collector)) {
          collector[field] = formula;
          delete data.calculate[field];
        } else {
          if (formula.expr !== collector[field]) {
            allMerged = false;
            // don't delete formula in child because we have a conflict
          } else {
            delete data.calculate[field];
          }
        }
      });
      return collector;
    }, dataComponent.calculate);

    return allMerged;
  }

  export function assemble(component: DataComponent) {
    return vals(component.calculate).reduce(function(transform, formula) {
      transform.push(extend({ type: 'formula' }, formula));
      return transform;
    }, []);
  }
}
