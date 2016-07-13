/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {filter} from '../../../src/compile/data/filter';

describe('compile/data/filter', () => {
  describe('getFilterExpression', () => {
    it('should return a correct expression for an EqualFilter', () => {
      const expr = filter.getFilterExpression({field: 'color', equal: 'red'});
      assert.equal(expr, 'datum.color==="red"');
    });

    it('should return a correct expression for an EqualFilter with negate', () => {
      const expr = filter.getFilterExpression({field: 'color', equal: 'red', negate: true});
      assert.equal(expr, '!(datum.color==="red")');
    });

    it('should return a correct expression for an InFilter', () => {
      const expr = filter.getFilterExpression({field: 'color', in: ['red', 'yellow']});
      assert.equal(expr, 'indexof(["red","yellow"], datum.color) !== -1');
    });

    it('should return a correct expression for an InFilter with negate', () => {
      const expr = filter.getFilterExpression({field: 'color', in: ['red', 'yellow'], negate: true});
      assert.equal(expr, '!(indexof(["red","yellow"], datum.color) !== -1)');
    });

    it('should return a correct expression for a RangeFilter', () => {
      const expr = filter.getFilterExpression({field: 'x', range: [0, 5]});
      assert.equal(expr, 'inrange(datum.x, 0, 5)');
    });

    it('should return a correct expression for a RangeFilter with negate', () => {
      const expr = filter.getFilterExpression({field: 'x', range: [0, 5], negate: true});
      assert.equal(expr, '!(inrange(datum.x, 0, 5))');
    });

    it('should return a correct expression for a RangeFilter having gt', () => {
      const expr = filter.getFilterExpression({field: 'x', gt: 0});
      assert.equal(expr, 'datum.x > 0');
    });

    it('should return a correct expression for a RangeFilter having lte', () => {
      const expr = filter.getFilterExpression({field: 'x', lte: 0});
      assert.equal(expr, 'datum.x <= 0');
    });

    it('should return a correct expression for a RangeFilter having combination of gte and lt', () => {
      const expr = filter.getFilterExpression({field: 'x', gte: 0, lt: 10});
      assert.equal(expr, 'datum.x >= 0 && datum.x < 10');
    });

    it('should return a correct expression for a RangeFilter having combination of gte and lt with negate', () => {
      const expr = filter.getFilterExpression({field: 'x', gte: 0, lt: 10, negate: true});
      assert.equal(expr, '!(datum.x >= 0 && datum.x < 10)');
    });

    it('should return a correct expression for an expression filter', () => {
      const expr = filter.getFilterExpression('datum.x===5');
      assert.equal(expr, 'datum.x===5');
    });
  });


  describe('parse', () => {
    it('should return a correct expression for an array of filter', () => {
      const model = parseUnitModel({
        "data": {"value": []},
        "transform": {
          "filter": [
            {field: 'color', equal: 'red', negate: true},
            {field: 'color', in: ['red', 'yellow']},
            {field: 'x', range: [0, 5]},
            {field: 'y', gt: 0, lte: 10 },
            'datum.x===5'
          ]
        }
      });
      const expr = filter.parse(model);
      assert.equal(expr, '(!(datum.color==="red")) && ' +
        '(indexof(["red","yellow"], datum.color) !== -1) && ' +
        '(inrange(datum.x, 0, 5)) && ' +
        '(datum.y > 0 && datum.y <= 10) && ' +
        '(datum.x===5)');
    });


    it('should return a correct expression for a single filter', () => {
      const model = parseUnitModel({
        "data": {"value": []},
        "transform": {
          "filter": 'datum.x===5'
        }
      });
      const expr = filter.parse(model);
      assert.equal(expr, 'datum.x===5');
    });

  });
});
