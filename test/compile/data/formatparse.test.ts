/* tslint:disable:quotemark */
import {assert} from 'chai';

import {ParseNode} from '../../../src/compile/data/formatparse';
import {Model} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';

function parse(model: Model) {
  return ParseNode.make(model).parse;
}

describe('compile/data/formatparse', () => {
  describe('parseUnit', () => {
    it('should return a correct parse for encoding mapping', () => {
      const model = parseUnitModel({
        "data": {"url": "a.json"},
        "mark": "point",
        "encoding": {
          "x": {"field": "a", "type": "quantitative"},
          "y": {"field": "b", "type": "temporal"},
          "color": {"field": "c", "type": "ordinal"},
          "shape": {"field": "d", "type": "nominal"}
        }
      });

      assert.deepEqual(parse(model), {
        a: 'number',
        b: 'date'
      });
    });

    it('should return a correct parse for filtered fields', () => {
      const model = parseUnitModel({
        "data": {"url": "a.json"},
        "transform": [{
          "filter": [
            {"field": "a", "equal": {year: 2000}},
            {"field": "b", "oneOf": ["a", "b"]},
            {"field": "c", "range": [{year: 2000}, {year: 2001}]},
            {"field": "d", "range": [1,2]}
          ]
        }],
        "mark": "point",
        encoding: {}
      });

      assert.deepEqual(parse(model), {
        a: 'date',
        b: 'string',
        c: 'date',
        d: 'number'
      });
    });

    it('should return a correct customized parse.', () => {
      const model = parseUnitModel({
        "data": {"url": "a.json", "format": {"parse": {"c": "number", "d": "date"}}},
        "mark": "point",
        "encoding": {
          "x": {"field": "a", "type": "quantitative"},
          "y": {"field": "b", "type": "temporal"},
          "color": {"field": "c", "type": "ordinal"},
          "shape": {"field": "c", "type": "nominal"}
        }
      });

      assert.deepEqual(parse(model), {
        a: 'number',
        b: 'date',
        c: 'number',
        d: 'date'
      });
    });

    it('should include parse for all applicable fields, and exclude calculated fields', function() {
      const model = parseUnitModel({
        transform: [{calculate: 'datum["b"] * 2', as: 'b2'}],
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal"},
          y: {field: 'b', type: "quantitative"},
          color: {field: '*', type: "quantitative", aggregate: 'count'},
          size: {field: 'b2', type: "quantitative"},
        }
      });

      assert.deepEqual(parse(model), {
        'a': 'date',
        'b': 'number'
      });
    });
  });

  describe('assembleTransforms', function() {
    it('should assemble correct parse expressions', function() {
      const p = new ParseNode({
        n: 'number',
        b: 'boolean',
        s: 'string',
        d1: 'date',
        d2: 'date:"%y"'
      });

      assert.deepEqual(p.assembleTransforms(), [
        {type: 'formula', expr: 'toNumber(datum["n"])', as: 'n'},
        {type: 'formula', expr: 'toBoolean(datum["b"])', as: 'b'},
        {type: 'formula', expr: 'toString(datum["s"])', as: 's'},
        {type: 'formula', expr: 'toDate(datum["d1"])', as: 'd1'},
        {type: 'formula', expr: 'timeParse(datum["d2"],"%y")', as: 'd2'}
      ]);
    });
  });
});
