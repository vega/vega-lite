import {Model} from './../model';
import {allSame} from '../../util';

import {DataComponent} from './data';


export namespace filter {
  function parse(model: Model): string {
    return model.transform().filter;
  }

  export const parseUnit = parse;

  // children have no transform so nothing to merge up
  export const parseFacet = parse;

  /**
   * Combines the filter in the data component if all child data components define the same filter.
   */
  export function mergeIfEqual(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    const sameFilter = allSame(childDataComponents, (childData) => childData.filter);

    if (sameFilter) {
      // combine filter at parent
      dataComponent.filter = (dataComponent.filter ? dataComponent.filter + '&&' : '') + (childDataComponents[0].filter || '');
      childDataComponents.forEach((childData) => {
        delete childData.filter;
      });
    }

    return sameFilter;
  }

  export function assemble(component: DataComponent) {
    const filter = component.filter;
    return filter ? [{
      type: 'filter',
      test: filter
    }] : [];
  }
}
