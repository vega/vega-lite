/* tslint:disable:quotemark */
import {assert} from 'chai';

import {filter} from '../../../src/compile/data/filter';
import {parseUnitModel} from '../../util';

describe('compile/data/filter', () => {
  describe('parseUnit', () => {
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
        },
        mark: 'point',
        encoding: {}
      });
      const expr = filter.parseUnit(model);
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
        },
        mark: 'point',
        encoding: {}
      });
      const expr = filter.parseUnit(model);
      assert.equal(expr, 'datum["x"]===5');
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
