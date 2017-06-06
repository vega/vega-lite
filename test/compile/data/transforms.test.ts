/* tslint:disable:quotemark */

import {assert} from 'chai';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {BinNode} from '../../../src/compile/data/bin';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {NullFilterNode} from '../../../src/compile/data/nullfilter';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {CalculateNode, FilterNode, LookupNode, parseTransformArray} from '../../../src/compile/data/transforms';
import {ModelWithField} from '../../../src/compile/model';
import * as log from '../../../src/log';
import {TimeUnit} from '../../../src/timeunit';
import {Dict, extend, StringSet} from '../../../src/util';
import {VgLookupTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/data/transforms', () => {
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
        transform: [{bin: true, field: 'field', as: 'a'}, {timeUnit: 'month', field: 'field', as: 'b'}],
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
        transform: [{bin: true, field: 'field', as: 'a'}, {summarize: [{aggregate: 'count', field: 'f', as: 'b'}, {aggregate: 'sum', field: 'f', as: 'c'}], groupby: ['field']}],
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const result = parseTransformArray(model);
      assert.isTrue(result.first instanceof BinNode);
      assert.isTrue(result.last instanceof AggregateNode);
    });
  });

  describe('filter', function() {
    it('should create parse for filtered fields', () => {
      const model = parseUnitModel({
        "data": {"url": "a.json"},
        "transform": [
          {"filter": {"field": "a", "equal": {year: 2000}}},
          {"filter": {"field": "b", "oneOf": ["a", "b"]}},
          {"filter": {"field": "c", "range": [{year: 2000}, {year: 2001}]}},
          {"filter": {"field": "d", "range": [1,2]}}
        ],
        "mark": "point",
        encoding: {}
      });

      let parse: Dict<string> = {};

      // extract the parse from the parse nodes that were generated along with the filter nodes
      let {first: node} = parseTransformArray(model);
      while (node.numChildren() > 0) {
        if (node instanceof ParseNode) {
          parse = extend(parse, node.parse);
        }
        assert.equal(node.numChildren(), 1);
        node = node.children[0];
      }

      assert.deepEqual(parse, {
        a: 'date',
        b: 'string',
        c: 'date',
        d: 'number'
      });
    });
  });

  describe('lookup', function() {
    it('should parse lookup from array', function () {
      const model = parseUnitModel({
        "data": {"url": "data/lookup_groups.csv"},
        "transform": [{
          "lookup": "person",
          "from": {
            "data": {"url": "data/lookup_people.csv"},
            "key": "name",
            "fields": ["age", "height"]
          }
        }],
        "mark": "bar",
        "encoding": {}
      });

      const t = parseTransformArray(model);
      assert.deepEqual<VgLookupTransform>((t.first as LookupNode).assemble(), {
        type: 'lookup',
        from: 'lookup_0',
        key: 'name',
        fields: ['person'],
        values: ['age', 'height']
      });
    });

    it('should create node for flat lookup', function () {
      const lookup = new LookupNode({
          "lookup": "person",
          "from": {
            "data": {"url": "data/lookup_people.csv"},
            "key": "name",
            "fields": ["age", "height"]
          }
        }, 'lookup_0');

      assert.deepEqual<VgLookupTransform>(lookup.assemble(), {
        type: 'lookup',
        from: 'lookup_0',
        key: 'name',
        fields: ['person'],
        values: ['age', 'height']
      });
    });

    it('should create node for nested lookup', function () {
      const lookup = new LookupNode({
          "lookup": "person",
          "from": {
            "data": {"url": "data/lookup_people.csv"},
            "key": "name"
          },
          "as": "foo"
        }, 'lookup_0');

      assert.deepEqual<VgLookupTransform>(lookup.assemble(), {
        type: 'lookup',
        from: 'lookup_0',
        key: 'name',
        fields: ['person'],
        as: ['foo']
      });
    });

    it('should warn if fields are not specified and as is missing', function () {
      log.runLocalLogger((localLogger) => {
        const lookup = new LookupNode({
            "lookup": "person",
            "from": {
              "data": {"url": "data/lookup_people.csv"},
              "key": "name"
            }
          }, 'lookup_0');
        lookup.assemble();

        assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
      });
    });
  });
});
