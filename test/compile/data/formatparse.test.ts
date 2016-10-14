/* tslint:disable:quotemark */
import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import {formatParse} from '../../../src/compile/data/formatparse';

describe('compile/data/formatparse', () => {
  describe('parse', () => {
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
  });

  it('should return a correct parse for filtered fields', () => {
    const model = parseUnitModel({
      "data": {"url": "a.json"},
      "mark": "point",
      "transform": {
        "filter": [
          {"field": "a", "equal": {year: 2000}},
          {"field": "b", "oneOf": ["a", "b"]},
          {"field": "c", "range": [{year: 2000}, {year: 2001}]},
          {"field": "d", "range": [1,2]}
        ]
      }
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
});
