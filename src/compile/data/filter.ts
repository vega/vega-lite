import {field} from '../../fielddef';
import {isEqualFilter, isInFilter, isRangeFilter, Filter} from '../../filter';
import {isArray} from '../../util';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model} from '../model';

import {DataComponent} from './data';


export namespace filter {
  const s = JSON.stringify;

  export function getFilterExpression(filter: Filter | string) {
    if (isEqualFilter(filter)) {
      // Using field method so we get support for aggregate, timeUnit and bin for free in the future
      return field(filter, {datum: true}) + '===' + s(filter.equal);
    } else if (isInFilter(filter)) {
      return 'indexof(' + s(filter.in) + ', ' + field(filter, {datum: true}) + ') !== -1';
    } else if (isRangeFilter(filter)) {
      return 'inrange(' + field(filter, {datum: true}) + ', ' + s(filter.range[0]) + ', ' + s(filter.range[1]) + ')';
    }
    return filter as string;
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

  export function parseLayer(model: LayerModel) {
    // Note that this `filter.parseLayer` method is called before `source.parseLayer`
    let filterComponent = parse(model);
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && childDataComponent.filter && childDataComponent.filter === filterComponent) {
        // same filter in child so we can just delete it
        delete childDataComponent.filter;
      }
    });
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
