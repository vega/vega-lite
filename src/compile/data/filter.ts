import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';


export namespace filter {
  function parse(model: Model): string {
    return model.transform().filter;
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let filterComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source but has filter, then merge
    if (!childDataComponent.source && childDataComponent.filter) {
      // merge by adding &&
      filterComponent =
        (filterComponent ? filterComponent + ' && ' : '') +
        childDataComponent.filter;
      delete childDataComponent.filter;
    }
    return filterComponent;
  }

  export function assemble(component: DataComponent) {
    const filter = component.filter;
    return filter ? [{
      type: 'filter',
      test: filter
    }] : [];
  }
}
