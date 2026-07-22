import {CalculateNode} from '../../../src/compile/data/calculate.js';
import {ModelWithField} from '../../../src/compile/model.js';
import {parseUnitModel} from '../../util.js';
import {PlaceholderDataFlowNode} from './util.js';

function assembleFromSortArray(model: ModelWithField) {
  const node = CalculateNode.parseAllForSortIndex(null, model) as CalculateNode;
  return node.assemble();
}

describe('compile/data/calculate', () => {
  describe('makeAllForSortIndex', () => {
    it('produces correct formula transform', () => {
      const model = parseUnitModel({
        data: {
          values: [
            {a: 'A', b: 28},
            {a: 'B', b: 55},
            {a: 'C', b: 43},
          ],
        },
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal', sort: ['B', 'A', 'C']},
          y: {field: 'b', type: 'quantitative'},
        },
      });
      const nodes = assembleFromSortArray(model);
      expect(nodes).toEqual({
        type: 'formula',
        expr: 'datum["a"]==="B" ? 0 : datum["a"]==="A" ? 1 : datum["a"]==="C" ? 2 : 3',
        as: 'x_a_sort_index',
      });
    });

    it('produces formula transform for order field sort array', () => {
      const model = parseUnitModel({
        data: {
          values: [
            {a: 'A', b: 28},
            {a: 'B', b: 55},
            {a: 'C', b: 43},
          ],
        },
        mark: 'line',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'},
          order: {field: 'a', type: 'nominal', sort: ['B', 'A', 'C']},
        },
      });
      const nodes = assembleFromSortArray(model);
      expect(nodes).toEqual({
        type: 'formula',
        expr: 'datum["a"]==="B" ? 0 : datum["a"]==="A" ? 1 : datum["a"]==="C" ? 2 : 3',
        as: 'order_a_0_sort_index',
      });
    });

    it('produces unique formula fields for multiple order sort arrays', () => {
      const model = parseUnitModel({
        data: {
          values: [
            {a: 'A', b: 28, c: 'foo'},
            {a: 'B', b: 55, c: 'bar'},
            {a: 'C', b: 43, c: 'baz'},
          ],
        },
        mark: 'line',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'},
          order: [
            {field: 'a', type: 'nominal', sort: ['B', 'A', 'C']},
            {field: 'c', type: 'nominal', sort: ['baz', 'bar', 'foo']},
          ],
        },
      });
      const node = CalculateNode.parseAllForSortIndex(null, model) as CalculateNode;
      expect(node.assemble()).toEqual({
        type: 'formula',
        expr: 'datum["c"]==="baz" ? 0 : datum["c"]==="bar" ? 1 : datum["c"]==="foo" ? 2 : 3',
        as: 'order_c_1_sort_index',
      });
      expect((node.parent as CalculateNode).assemble()).toEqual({
        type: 'formula',
        expr: 'datum["a"]==="B" ? 0 : datum["a"]==="A" ? 1 : datum["a"]==="C" ? 2 : 3',
        as: 'order_a_0_sort_index',
      });
    });
  });

  describe('dependentFields and producedFields', () => {
    it('returns the right fields', () => {
      const node = new CalculateNode(null, {
        calculate: 'datum.foo + 2',
        as: 'bar',
      });

      expect(node.dependentFields()).toEqual(new Set(['foo']));
      expect(node.producedFields()).toEqual(new Set(['bar']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const model = parseUnitModel({
        data: {
          values: [
            {a: 'A', b: 28},
            {a: 'B', b: 55},
            {a: 'C', b: 43},
          ],
        },
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal', sort: ['B', 'A', 'C']},
          y: {field: 'b', type: 'quantitative'},
        },
      });
      const node = CalculateNode.parseAllForSortIndex(null, model) as CalculateNode;
      expect(node.hash()).toBe(
        'Calculate {"as":"x_a_sort_index","calculate":"datum[\\"a\\"]===\\"B\\" ? 0 : datum[\\"a\\"]===\\"A\\" ? 1 : datum[\\"a\\"]===\\"C\\" ? 2 : 3"}',
      );
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const calculate = new CalculateNode(parent, {calculate: 'foo', as: 'bar'});
      expect(calculate.clone().parent).toBeNull();
    });
  });
});
