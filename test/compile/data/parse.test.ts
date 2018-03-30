/* tslint:disable:quotemark */

import {assert} from 'chai';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {BinNode} from '../../../src/compile/data/bin';
import {CalculateNode} from '../../../src/compile/data/calculate';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {FilterNode} from '../../../src/compile/data/filter';
import {parseTransformArray} from '../../../src/compile/data/parse';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';
import {parseUnitModel} from '../../util';

describe('compile/data/parse', () => {
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

      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof CalculateNode);
      assert.isTrue(result instanceof FilterNode);
    });

    it('should return a BinNode node and a TimeUnitNode', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [{bin: true, field: 'field', as: 'a'}, {timeUnit: 'month', field: 'field', as: 'b'}],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof BinNode);
      assert.isTrue(result instanceof TimeUnitNode);
    });

    it('should return a BinNode and a AggregateNode', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [{bin: true, field: 'field', as: 'a'}, {aggregate: [{op: 'count', field: 'f', as: 'b'}, {op: 'sum', field: 'f', as: 'c'}], groupby: ['field']}],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof BinNode);
      assert.isTrue(result instanceof AggregateNode);
    });

    it ('should return a WindowTransform Node', () => {
      const transform: Transform = {
        window: [
          {
            op: 'count',
            field: 'f',
            as: 'b',
          }
        ],
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [
          transform
        ],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });
    it ('should return a WindowTransform Node with optional properties', () => {
      const transform: Transform = {
        window: [
          {
            op: 'row_number',
            as: 'ordered_row_number',
          },
        ],
        ignorePeers: false,
        sort:  [
          {
            field:'f',
            order:'ascending'
          }
        ]
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [
          transform
        ],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });

    it ('should return a WindowTransform Node', () => {
      const transform: Transform = {
        window: [
          {
            op: 'count',
            field: 'f',
            as: 'b',
          }
        ],
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [
          transform
        ],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });
    it ('should return a WindowTransform Node with optional properties', () => {
      const transform: Transform = {
        window: [
          {
            op: 'row_number',
            as: 'ordered_row_number',
          },
        ],
        ignorePeers: false,
        sort: [
            {
              field:'f',
              order:'ascending'
            }
          ]
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [
          transform
        ],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model);
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });
  });
});
