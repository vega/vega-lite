import {extend, vals, flatten, hash, Dict} from '../../util';
import {Lookup} from '../../transform';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';

export namespace lookup {
  function parse(model: Model): Dict<Lookup> {
    return model.transform().lookup || {};
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let lookupComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(lookupComponent, childDataComponent.lookup);
      delete childDataComponent.lookup;
    }
    return lookupComponent;
  }

  export function parseLayer(model: LayerModel) {
    let lookupComponent = parse(model);

    model.children().forEach((child) => {
      const childDataComponent = child.component.data;

      // If child doesn't have its own data source, then merge
      if (!childDataComponent.source) {
        extend(lookupComponent, childDataComponent.lookup);
        delete childDataComponent.lookup;
      }
    });

    return lookupComponent;
  }

  // export function assemble(component: DataComponent) {
  //   return flatten(vals(component.lookup));
  // }
}
