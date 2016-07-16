import {DateTime, dateTimeExpr, isDateTime} from '../../datetime';
import {field} from '../../fielddef';
import {isEqualFilter, isInFilter, isRangeFilter, Filter} from '../../filter';
import {TimeUnit, fieldExpr as timeUnitFieldExpr, isSingleTimeUnit} from '../../timeunit';
import {isArray, isString} from '../../util';

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
  function valueExpr(v: any, timeUnit: TimeUnit) {
    if (isDateTime(v)) {
      const expr = dateTimeExpr(v, true);
      return 'time(' + expr + ')';
    }
    if (isSingleTimeUnit(timeUnit)) {
      const datetime: DateTime = {};
      datetime[timeUnit] = v;
      const expr = dateTimeExpr(datetime, true);
      return 'time(' + expr + ')';
    }
    return JSON.stringify(v);
  }

  export function getFilterExpression(filter: Filter | string) {
    let filterString = '';
    if (isString(filter)) {
      return filter as string;
    } else { // Filter Object
      const fieldExpr = filter.timeUnit ?
        // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
          // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
          // TODO: support utc
        ('time(' + timeUnitFieldExpr(filter.timeUnit, filter.field) + ')') :
        field(filter, {datum: true});

      if (isEqualFilter(filter)) {
        filterString = fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
      } else if (isInFilter(filter)) {
        filterString = 'indexof([' +
          filter.in.map((v) => valueExpr(v, filter.timeUnit)).join(',') +
          '], ' + fieldExpr + ') !== -1';
      } else if (isRangeFilter(filter)) {
        filterString = 'inrange(' + fieldExpr + ', ' +
          valueExpr(filter.range[0], filter.timeUnit) + ', ' +
          valueExpr(filter.range[1], filter.timeUnit) + ')';
      }
    }
    return filterString;
  }

  export function parse(model: Model): string {
    const filter = model.transform().filter;
    if (isArray(filter)) {
      return '(' + filter.map((f) => getFilterExpression(f)).join(') && (') + ')';
    } else if (filter) {
      return getFilterExpression(filter);
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
