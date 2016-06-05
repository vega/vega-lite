import {Formula} from '../../transform';
import {extend, vals, Dict, forEach} from '../../util';

import {Model} from './../model';

import {DataComponent} from './data';


export namespace calculate {
  function parse(model: Model): Dict<Formula> {
    return (model.transform().calculate || []).reduce(function(calculateComponent, formula) {
      // index by the field that is created so that we make sure that we don't write it multiple times
      calculateComponent[formula.field] = formula;
      return calculateComponent;
    }, {} as Dict<Formula>);
  }

  export const parseUnit = parse;

  // children have no transform so no need to merge anything up
  export const parseFacet = parse;

  /**
   * Merge the formulas from the parent and all components into parent.
   *
   * Returns whether all formulas could be merged.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    let allMerged = true;

    childDataComponents.reduce((collector, childData) => {
      forEach(childData.calculate, (formula, field) => {
        if (!(field in collector)) {
          collector[field] = formula;
          delete childData.calculate[field];
        } else {
          if (formula.expr !== collector[field]) {
            allMerged = false;
            // don't delete formula in child because we have a conflict
          } else {
            delete childData.calculate[field];
          }
        }
      });
      return collector;
    }, dataComponent.calculate);

    return allMerged;
  }

  export function assemble(component: DataComponent) {
    return vals(component.calculate).reduce(function(transform, calculate) {
      transform.push(extend({ type: 'formula' }, calculate));
      return transform;
    }, []);
  }
}
