/* tslint:disable:quotemark */
import {assert} from 'chai';
import {AncestorParse} from '../../../src/compile/data';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {BinNode} from '../../../src/compile/data/bin';
import {CalculateNode} from '../../../src/compile/data/calculate';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {FilterNode} from '../../../src/compile/data/filter';
import {FlattenTransformNode} from '../../../src/compile/data/flatten';
import {FoldTransformNode} from '../../../src/compile/data/fold';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {ImputeNode} from '../../../src/compile/data/impute';
import {findSource, parseTransformArray} from '../../../src/compile/data/parse';
import {SampleTransformNode} from '../../../src/compile/data/sample';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';
import {parseUnitModel} from '../../util';
import {SourceNode} from './../../../src/compile/data/source';

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
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof CalculateNode);
      assert.isTrue(result instanceof FilterNode);
    });

    it('should add a parse node for filter transforms with time unit', () => {
      const model = parseUnitModel({
        data: {url: 'a.json'},
        transform: [
          {
            filter: {
              not: {
                and: [
                  {
                    or: [
                      {
                        timeUnit: 'year',
                        field: 'date',
                        equal: 2005
                      },
                      'datum.a > 5'
                    ]
                  }
                ]
              }
            }
          }
        ],
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'temporal'},
          color: {field: 'c', type: 'ordinal'},
          shape: {field: 'd', type: 'nominal'}
        }
      });

      const root = new DataFlowNode(null);
      const parse = new AncestorParse();
      const result = parseTransformArray(root, model, parse);

      assert.isTrue(root.children[0] instanceof ParseNode);
      assert.isTrue(result instanceof FilterNode);
      assert.deepEqual((root.children[0] as ParseNode).parse, {
        date: 'date'
      });
      assert.deepEqual(parse.combine(), {date: 'date'});
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
      const parse = new AncestorParse();
      const result = parseTransformArray(root, model, parse);
      expect(root.children[0] instanceof BinNode);
      expect(result instanceof TimeUnitNode);
      expect(parse.combine()).toEqual({a: 'number', a_end: 'number', b: 'date', field: 'date'});
    });

    it('should return a BinNode and a AggregateNode', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [
          {bin: true, field: 'field', as: 'a'},
          {aggregate: [{op: 'count', field: 'f', as: 'b'}, {op: 'sum', field: 'f', as: 'c'}], groupby: ['field']}
        ],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof BinNode);
      assert.isTrue(result instanceof AggregateNode);
    });

    it('should return a ImputeTransform Node', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [{impute: 'x', key: 'y', method: 'mean'}],
        encoding: {
          x: {field: 'a', type: 'temporal'},
          y: {field: 'b', type: 'quantitative'}
        }
      });
      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof ImputeNode);
      assert.isTrue(result instanceof ImputeNode);
    });
    it('should return a WindowTransform Node', () => {
      const transform: Transform = {
        window: [
          {
            op: 'count',
            field: 'f',
            as: 'b'
          }
        ]
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });
    it('should return a WindowTransform Node with optional properties', () => {
      const transform: Transform = {
        window: [
          {
            op: 'row_number',
            as: 'ordered_row_number'
          }
        ],
        ignorePeers: false,
        sort: [
          {
            field: 'f',
            order: 'ascending'
          }
        ]
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });

    it('should return a WindowTransform Node', () => {
      const transform: Transform = {
        window: [
          {
            op: 'count',
            field: 'f',
            as: 'b'
          }
        ]
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });
    it('should return a WindowTransform Node with optional properties', () => {
      const transform: Transform = {
        window: [
          {
            op: 'row_number',
            as: 'ordered_row_number'
          }
        ],
        ignorePeers: false,
        sort: [
          {
            field: 'f',
            order: 'ascending'
          }
        ]
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const root = new DataFlowNode(null);
      parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof WindowTransformNode);
    });

    it('should return a FoldTransformNode', () => {
      const transform: Transform = {
        fold: ['a', 'b'],
        as: ['A', 'B']
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'A', type: 'temporal'},
          y: {field: 'B', type: 'quantitative'}
        }
      });
      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof FoldTransformNode);
      assert.isTrue(result instanceof FoldTransformNode);
    });

    it('should return a FlattenTransformNode', () => {
      const transform: Transform = {
        flatten: ['a', 'b']
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'a', type: 'temporal'},
          y: {field: 'b', type: 'quantitative'}
        }
      });
      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof FlattenTransformNode);
      assert.isTrue(result instanceof FlattenTransformNode);
    });

    it('should return a SampleTransformNode', () => {
      const transform: Transform = {
        sample: 1000
      };
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'A', type: 'temporal'},
          y: {field: 'B', type: 'quantitative'}
        }
      });
      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof SampleTransformNode);
      assert.isTrue(result instanceof SampleTransformNode);
    });

    it('should return a 3 Transforms from an Impute', () => {
      const transform: Transform = {
        impute: 'y',
        key: 'x',
        method: 'max',
        groupby: ['a', 'b'],
        frame: [-2, 2]
      };

      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        transform: [transform],
        encoding: {
          x: {field: 'x', type: 'quantitative'},
          y: {field: 'y', type: 'quantitative'},
          color: {field: 'c', type: 'nominal'}
        }
      });
      const root = new DataFlowNode(null);
      const result = parseTransformArray(root, model, new AncestorParse());
      assert.isTrue(root.children[0] instanceof ImputeNode);
      assert.isTrue(result instanceof ImputeNode);
    });
  });

  describe('findSource', () => {
    const values = new SourceNode({values: [1, 2, 3]});
    const named = new SourceNode({name: 'foo'});
    const url = new SourceNode({url: 'foo.csv'});

    it('should find named source', () => {
      const actual = findSource({name: 'foo'}, [values, named, url]);
      expect(actual).toBe(named);
    });

    it('should find value source', () => {
      const actual = findSource({values: [1, 2, 3]}, [values, named, url]);
      expect(actual).toBe(values);
    });

    it('should find url source', () => {
      const actual = findSource({url: 'foo.csv'}, [values, named, url]);
      expect(actual).toBe(url);
    });

    it('should not find new data source', () => {
      const actual = findSource({url: 'bar.csv'}, [values, named, url]);
      expect(actual).toBeNull();
    });
  });
});
