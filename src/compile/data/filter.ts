import {DateTime, dateTimeExpr, isDateTime} from '../../datetime';
import {field} from '../../fielddef';
import {isEqualFilter, isInFilter, isRangeFilter, Filter} from '../../filter';
import {TimeUnit, fieldExpr as timeUnitFieldExpr, isSingleTimeUnit} from '../../timeunit';
import {isArray, isString, allSame} from '../../util';

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
        return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
      } else if (isInFilter(filter)) {
        return 'indexof([' +
          filter.in.map((v) => valueExpr(v, filter.timeUnit)).join(',') +
          '], ' + fieldExpr + ') !== -1';
      } else if (isRangeFilter(filter)) {
        const lower = filter.range[0];
        const upper = filter.range[1];

        if (lower !== null &&  upper !== null) {
          return 'inrange(' + fieldExpr + ', ' +
            valueExpr(lower, filter.timeUnit) + ', ' +
            valueExpr(upper, filter.timeUnit) + ')';
        } else if (lower !== null) {
          return fieldExpr + ' >= ' + lower;
        } else if (upper !== null) {
          return fieldExpr + ' <= ' + upper;
        }
      }
    }
    return undefined;
  }

  export function parse(model: Model): string {
    const filter = model.transform().filter;
    if (isArray(filter)) {
      return '(' +
        filter.map((f) => getFilterExpression(f))
          .filter((f) => f !==undefined)
          .join(') && (') +
        ')';
    } else if (filter) {
      return getFilterExpression(filter);
    }
    return undefined;
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
