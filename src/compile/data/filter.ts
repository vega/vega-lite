import {expression} from '../../filter';
import {isArray} from '../../util';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model} from '../model';

import {DataComponent} from './data';

export namespace filter {
  /**
   * @param v value to be converted into Vega Expression
   * @param timeUnit
   * @return Vega Expression of the value v. This could be one of:
   * - a timestamp value of datetime object
   * - a timestamp value of casted single time unit value
   * - stringified value
   */

  export function parse(model: Model): string {
    const filter = model.transform().filter;
    if (isArray(filter)) {
      return '(' +
        filter.map((f) => expression(f))
          .filter((f) => f !==undefined)
          .join(') && (') +
        ')';
    } else if (filter) {
      return expression(filter);
    }
    return undefined;
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
