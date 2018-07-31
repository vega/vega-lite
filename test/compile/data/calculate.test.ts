/* tslint:disable:quotemark */
import {CalculateNode, getDependentFields} from '../../../src/compile/data/calculate';
import {ModelWithField} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';

function assembleFromSortArray(model: ModelWithField) {
  const node = CalculateNode.parseAllForSortIndex(null, model) as CalculateNode;
  return node.assemble();
}

describe('compile/data/calculate', () => {
  describe('makeAllForSortIndex', () => {
    it('produces correct formula transform', () => {
      const model = parseUnitModel({
        data: {
          values: [{a: 'A', b: 28}, {a: 'B', b: 55}, {a: 'C', b: 43}]
        },
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal', sort: ['B', 'A', 'C']},
          y: {field: 'b', type: 'quantitative'}
        }
      });
      const nodes = assembleFromSortArray(model);
      expect(nodes).toEqual({
        type: 'formula',
        expr: 'datum["a"]==="B" ? 0 : datum["a"]==="A" ? 1 : datum["a"]==="C" ? 2 : 3',
        as: 'x_a_sort_index'
      });
    });
  });

  describe('getDependentFields', () => {
    it('calcuates right dependent fields for simple expression', () => {
      expect(getDependentFields('datum.x + datum.y')).toEqual({x: true, y: true});
    });

    it('calcuates right dependent fields for compres expression', () => {
      expect(getDependentFields('toString(datum.x) + 12')).toEqual({x: true});
    });

    it('calculates right dependent fields for nested field', () => {
      expect(getDependentFields('datum.x.y')).toEqual({x: true, 'x.y': true});
      expect(getDependentFields('datum["x.y"]')).toEqual({'x.y': true});
    });
  });
});
