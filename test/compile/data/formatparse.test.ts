/* tslint:disable:quotemark */
import {assert} from 'chai';

import {formatParse} from '../../../src/compile/data/formatparse';
import {parseUnitModel} from '../../util';

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
      const parseComponent = formatParse.parseUnit(model);
      assert.deepEqual(parseComponent,{
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
      const parseComponent = formatParse.parseUnit(model);
      assert.deepEqual(parseComponent,{
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
      const parseComponent = formatParse.parseUnit(model);
      assert.deepEqual(parseComponent,{
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

      const formatParseComponent = formatParse.parseUnit(model);
      assert.deepEqual(formatParseComponent, {
        'a': 'date',
        'b': 'number'
      });
    });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    // TODO: write test
  });

  describe('assemble', function() {
    // TODO: write test
  });
});
