import {TopLevelExtendedSpec} from '../src/spec';
import {Type} from '../src/type';

export type TestSpec = 'unit' | 'repeat' | 'facet';

export const values = [
  {a: 0, b: 28, c: 0}, {a: 0, b: 55, c: 1}, {a: 0, b: 23, c: 2},
  {a: 1, b: 43, c: 0}, {a: 1, b: 91, c: 1}, {a: 1, b: 54, c: 2},
  {a: 2, b: 81, c: 0}, {a: 2, b: 53, c: 1}, {a: 2, b: 76, c: 2},
  {a: 3, b: 19, c: 0}, {a: 3, b: 87, c: 1}, {a: 3, b: 12, c: 2},
  {a: 4, b: 52, c: 0}, {a: 4, b: 48, c: 1}, {a: 4, b: 35, c: 2},
  {a: 5, b: 24, c: 0}, {a: 5, b: 49, c: 1}, {a: 5, b: 48, c: 2},
  {a: 6, b: 87, c: 0}, {a: 6, b: 66, c: 1}, {a: 6, b: 23, c: 2},
  {a: 7, b: 17, c: 0}, {a: 7, b: 27, c: 1}, {a: 7, b: 39, c: 2},
  {a: 8, b: 68, c: 0}, {a: 8, b: 16, c: 1}, {a: 8, b: 67, c: 2},
  {a: 9, b: 49, c: 0}, {a: 9, b: 15, c: 1}, {a: 9, b: 48, 'c': 2}
];

export function unit(xdef?: any, ydef?: any, cdef?: any): TopLevelExtendedSpec {
  return {
    mark: 'circle',
    encoding: {
      x: {field: 'a', type: 'quantitative', ...xdef},
      y: {field: 'b',type: 'quantitative', ...ydef},
      color: {field: 'c', type: 'nominal', ...cdef}
    }
  };
}

export function spec(type: TestSpec, data: object[], unit: TopLevelExtendedSpec, selection: any) {
  return {
    data: {values: data},

    ...(type === 'unit' ? {...unit, selection} : {}),
    ...(type === 'facet' ? {
      facet: {row: {field: 'c', type: 'nominal'}},
      spec: {...unit, selection}
    } : {}),
    ...(type === 'repeat' ? {
      repeat: {row: ['d', 'e', 'f']},
      spec: {...unit, selection}
    } : {})
  };
}

export function embed(browser: WebdriverIO.Client<void>, type: TestSpec, data: object[], unitSpec: TopLevelExtendedSpec, selection: any) {
  browser.execute((_) => window['embed'](_), spec(type, data || values, unitSpec || unit(), selection));
}
