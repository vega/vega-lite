import {field} from '../../fielddef';
import {isEqualFilter, isInFilter, isRangeFilter, Filter} from '../../filter';
import {allSame, isArray} from '../../util';
import {Model} from '../model';

import {DataComponent} from './data';


export namespace filter {
  const s = JSON.stringify;

  export function getFilterExpression(filter: Filter | string) {
    let filterString = '';
    if (isEqualFilter(filter)) {
      // Using field method so we get support for aggregate, timeUnit and bin for free in the future
      filterString = field(filter, {datum: true}) + '===' + s(filter.equal);
    } else if (isInFilter(filter)) {
      filterString = 'indexof(' + s(filter.in) + ', ' + field(filter, {datum: true}) + ') !== -1';
    } else if (isRangeFilter(filter)) {
      filterString = 'inrange(' + field(filter, {datum: true}) + ', ' + s(filter.range[0]) + ', ' + s(filter.range[1]) + ')';
    } else {
      return filter as string;
    }

    return filterString;
  }

  export function parse(model: Model): string {
    const filter = model.transform().filter;
    if (isArray(filter)) {
      return '(' + filter.map((f) => getFilterExpression(f)).join(') && (') + ')';
    } else {
      return getFilterExpression(filter);
    }
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
      let filters = [];
      if (dataComponent.filter) {
        filters.push(dataComponent.filter);
      }
      if (childDataComponents[0].filter) {
        filters.push(childDataComponents[0].filter);
      }
      dataComponent.filter = filters.join('&&');
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
