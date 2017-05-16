import {assert} from 'chai';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {BinNode} from '../../../src/compile/data/bin';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {CalculateNode, FilterNode, parseTransformArray} from '../../../src/compile/data/transforms';
import {TimeUnit} from '../../../src/timeunit';
import {parseUnitModel} from '../../util';
describe('compile/data/transform', () => {
  describe('parseTransformArray()', () => {
    it('should return a CalculateNode and a FilterNode', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [{calculate: 'calculate', as: 'as'}, {filter: 'filter'}],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const result = parseTransformArray(model);
      assert.isTrue(result.first instanceof CalculateNode);
      assert.isTrue(result.last instanceof FilterNode);
    });

    it('should return a BinNode node and a TimeUnitNode', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [{bin: true, field: 'field', as: 'as'}, {timeUnit: 'month', field: 'field', as: 'as'}],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const result = parseTransformArray(model);
      assert.isTrue(result.first instanceof BinNode);
      assert.isTrue(result.last instanceof TimeUnitNode);
    });

    it('should return a BinNode and a AggregateNode', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [{bin: true, field: 'field', as: 'as'}, {summarize: [{aggregate: 'count', field: 'f', as: 'a'}, {aggregate: 'sum', field: 'f', as: 'a'}], groupby: ['field']}],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const result = parseTransformArray(model);
      assert.isTrue(result.first instanceof BinNode);
      assert.isTrue(result.last instanceof AggregateNode);
    });
  });
});
