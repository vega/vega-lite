/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import {TimeUnit} from '../../../src/timeunit';
import {filter} from '../../../src/compile/data/filter';

describe('compile/data/filter', () => {
  describe('getFilterExpression', () => {
    it('should return a correct expression for an EqualFilter', () => {
      const expr = filter.getFilterExpression({field: 'color', equal: 'red'});
      assert.equal(expr, 'datum.color==="red"');
    });

    it('should return a correct expression for an EqualFilter with datetime object', () => {
      const expr = filter.getFilterExpression({
        field: 'date',
        equal: {
          month: 'January'
        }
      });
      assert.equal(expr, 'datum.date===time(datetime(0, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an EqualFilter with time unit and datetime object', () => {
      const expr = filter.getFilterExpression({
        timeUnit: TimeUnit.MONTH,
        field: 'date',
        equal: {
          month: 'January'
        }
      });
      assert.equal(expr, 'time(datetime(0, month(datum.date), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an EqualFilter with datetime ojbect', () => {
      const expr = filter.getFilterExpression({
        timeUnit: TimeUnit.MONTH,
        field: 'date',
        equal: 'January'
      });
      assert.equal(expr, 'time(datetime(0, month(datum.date), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an InFilter', () => {
      const expr = filter.getFilterExpression({field: 'color', in: ['red', 'yellow']});
      assert.equal(expr, 'indexof(["red","yellow"], datum.color) !== -1');
    });

    it('should return a correct expression for a RangeFilter', () => {
      const expr = filter.getFilterExpression({field: 'x', range: [0, 5]});
      assert.equal(expr, 'inrange(datum.x, 0, 5)');
    });

    it('should return a correct expression for a RangeFilter with no lower bound', () => {
      const expr = filter.getFilterExpression({field: 'x', range: [null, 5]});
      assert.equal(expr, 'datum.x <= 5');
    });

    it('should return a correct expression for a RangeFilter with no upper bound', () => {
      const expr = filter.getFilterExpression({field: 'x', range: [0, null]});
      assert.equal(expr, 'datum.x >= 0');
    });


    it('should return undefined for a RangeFilter with no bound', () => {
      const expr = filter.getFilterExpression({field: 'x', range: [null, null]});
      assert.equal(expr, undefined);
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
            {field: 'color', equal: 'red'},
            {field: 'color', in: ['red', 'yellow']},
            {field: 'x', range: [0, 5]},
            'datum.x===5',
            {field: 'x', range: [null, null]},
          ]
        }
      });
      const expr = filter.parse(model);
      assert.equal(expr, '(datum.color==="red") && ' +
        '(indexof(["red","yellow"], datum.color) !== -1) && ' +
        '(inrange(datum.x, 0, 5)) && ' +
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
