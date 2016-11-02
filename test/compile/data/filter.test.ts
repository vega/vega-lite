/* tslint:disable:quotemark */
import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import {filter} from '../../../src/compile/data/filter';

describe('compile/data/filter', () => {
  describe('parse', () => {
    it('should return a correct expression for an array of filter', () => {
      const model = parseUnitModel({
        "data": {"values": []},
        "transform": {
          "filter": [
            {field: 'color', equal: 'red'},
            {field: 'color', oneOf: ['red', 'yellow']},
            {field: 'x', range: [0, 5]},
            'datum["x"]===5',
            {field: 'x', range: [null, null]},
          ]
        }
      });
      const expr = filter.parse(model);
      assert.equal(expr, '(datum["color"]==="red") && ' +
        '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
        '(inrange(datum["x"], 0, 5)) && ' +
        '(datum["x"]===5)');
    });


    it('should return a correct expression for a single filter', () => {
      const model = parseUnitModel({
        "data": {"values": []},
        "transform": {
          "filter": 'datum["x"]===5'
        }
      });
      const expr = filter.parse(model);
      assert.equal(expr, 'datum["x"]===5');
    });

  });
});
