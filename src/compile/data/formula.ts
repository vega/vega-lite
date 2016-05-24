import {Formula} from '../../transform';
import {extend, vals, hash, Dict} from '../../util';

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

  export function assemble(component: DataComponent) {
    return vals(component.calculate).reduce(function(transform, formula) {
      transform.push(extend({ type: 'formula' }, formula));
      return transform;
    }, []);
  }
}
