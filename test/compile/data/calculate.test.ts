import {CalculateNode} from '../../../src/compile/data/calculate';
import {ModelWithField} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';
import {DataFlowNode} from './../../../src/compile/data/dataflow';

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
      expect(nodes).toEqual([
        {
          type: 'formula',
          expr: 'datum["a"]==="B" ? 0 : datum["a"]==="A" ? 1 : datum["a"]==="C" ? 2 : 3',
          as: 'x_a_sort_index'
        }
      ]);
    });
  });

  describe('dependentFields and producedFields', () => {
    it('returns the right fields', () => {
      const node = CalculateNode.makeFromTransform(null, {
        calculate: 'datum.foo + 2',
        as: 'bar'
      });

      expect(node.dependentFields()).toEqual(new Set(['foo']));
      expect(node.producedFields()).toEqual(new Set(['bar']));
    });

    it('returns the right fields for multiple calculates', () => {
      const node = new CalculateNode(null, {
        bar: {
          calculate: 'datum.foo + 2',
          as: 'bar'
        },
        baz: {
          calculate: 'datum.a + datum.b',
          as: 'baz'
        }
      });

      expect(node.dependentFields()).toEqual(new Set(['foo', 'a', 'b']));
      expect(node.producedFields()).toEqual(new Set(['bar', 'baz']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
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
      const node = CalculateNode.parseAllForSortIndex(null, model) as CalculateNode;
      expect(node.hash()).toEqual(
        'Calculate {"x_a_sort_index":{"as":"x_a_sort_index","calculate":"datum[\\"a\\"]===\\"B\\" ? 0 : datum[\\"a\\"]===\\"A\\" ? 1 : datum[\\"a\\"]===\\"C\\" ? 2 : 3"}}'
      );
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new DataFlowNode(null);
      const calculate = new CalculateNode(parent, {bar: {calculate: 'foo', as: 'bar'}});
      expect(calculate.clone().parent).toBeNull();
    });
  });
});
