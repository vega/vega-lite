import {assert} from 'chai';

import {
  expression,
  fieldFilterExpression,
  isFieldEqualPredicate,
  isFieldLTEPredicate,
  isFieldOneOfPredicate,
  isFieldRangePredicate
} from '../src/predicate';
import {TimeUnit} from '../src/timeunit';

describe('filter', () => {
  const equalFilter = {field: 'color', equal: 'red'};
  const oneOfFilter = {field: 'color', oneOf: ['red', 'yellow']};
  const rangeFilter = {field: 'x', range: [0, 5]};
  const exprFilter = 'datum["x"]===5';
  const lessThanEqualsFilter = {field: 'x', lte: 'z'};

  describe('isEqualFilter', () => {
    it('should return true for an equal filter', () => {
      assert.isTrue(isFieldEqualPredicate(equalFilter));
    });

    it('should return false for other filters', () => {
      [oneOfFilter, rangeFilter, exprFilter].forEach(filter => {
        assert.isFalse(isFieldEqualPredicate(filter));
      });
    });
  });

  describe('islessThanEqualsFilter', () => {
    it('should return true for less than equals to filter', () => {
      assert.isTrue(isFieldLTEPredicate(lessThanEqualsFilter));
    });

    it('should return false for other filters', () => {
      [equalFilter, oneOfFilter, rangeFilter, exprFilter].forEach(filter => {
        assert.isFalse(isFieldLTEPredicate(filter));
      });
    });
  });

  describe('isOneOfFilter', () => {
    it('should return true for an in filter', () => {
      assert.isTrue(isFieldOneOfPredicate(oneOfFilter));
    });

    it('should return false for other filters', () => {
      [equalFilter, rangeFilter, exprFilter].forEach(filter => {
        assert.isFalse(isFieldOneOfPredicate(filter));
      });
    });
  });

  describe('isRangeFilter', () => {
    it('should return true for a range filter', () => {
      assert.isTrue(isFieldRangePredicate(rangeFilter));
    });

    it('should return false for other filters', () => {
      [oneOfFilter, equalFilter, exprFilter].forEach(filter => {
        assert.isFalse(isFieldRangePredicate(filter));
      });
    });
  });

  describe('expression', () => {
    it('should return a correct expression for an EqualFilter', () => {
      const expr = expression(null, {field: 'color', equal: 'red'});
      assert.equal(expr, 'datum["color"]==="red"');
    });

    it('should return correct expression for lessThan', () => {
      const expr = expression(null, {field: 'x', lt: 1});
      assert.equal(expr, 'datum["x"]<1');
    });

    it('should return correct expression for greaterThan', () => {
      const expr = expression(null, {field: 'x', gt: 'aardvark'});
      assert.equal(expr, 'datum["x"]>"aardvark"');
    });

    it('should return correct expression for lessThanEquals', () => {
      const expr = expression(null, {field: 'x', lte: 'zyzzyva'});
      assert.equal(expr, 'datum["x"]<="zyzzyva"');
    });

    it('should return correct expression for greaterThanEquals', () => {
      const expr = expression(null, {field: 'x', gte: 1});
      assert.equal(expr, 'datum["x"]>=1');
    });

    it('should return a correct expression for an EqualFilter with datetime object', () => {
      const expr = expression(null, {
        field: 'date',
        equal: {
          month: 'January'
        }
      });
      assert.equal(expr, 'datum["date"]===time(datetime(0, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an EqualFilter with time unit and datetime object', () => {
      const expr = expression(null, {
        timeUnit: TimeUnit.MONTH,
        field: 'date',
        equal: {
          month: 'January'
        }
      });
      assert.equal(
        expr,
        'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))'
      );
    });

    it('should return a correct expression for an EqualFilter with datetime object', () => {
      const expr = expression(null, {
        timeUnit: TimeUnit.MONTH,
        field: 'date',
        equal: 'January'
      });
      assert.equal(
        expr,
        'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))'
      );
    });

    it('should return a correct expression for an lessThanFilter with datetime object', () => {
      const expr = expression(null, {
        field: 'date',
        lt: {
          month: 'February'
        }
      });
      assert.equal(expr, 'datum["date"]<time(datetime(0, 1, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an greaterThanFilter with time unit and datetime object', () => {
      const expr = expression(null, {
        timeUnit: TimeUnit.MONTH,
        field: 'date',
        gt: {
          month: 'January'
        }
      });
      assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))>time(datetime(0, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an greaterThanEqualsFilter with datetime object', () => {
      const expr = expression(null, {
        timeUnit: TimeUnit.MONTH,
        field: 'date',
        gte: 'January'
      });
      assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))>=time(datetime(0, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an InFilter', () => {
      const expr = expression(null, {field: 'color', oneOf: ['red', 'yellow']});
      assert.equal(expr, 'indexof(["red","yellow"], datum["color"]) !== -1');
    });

    it('should return a correct expression for a RangeFilter', () => {
      const expr = expression(null, {field: 'x', range: [0, 5]});
      assert.equal(expr, 'inrange(datum["x"], [0, 5])');
    });

    it('should return a correct expression for a RangeFilter with no lower bound', () => {
      const expr = expression(null, {field: 'x', range: [null, 5]});
      assert.equal(expr, 'datum["x"] <= 5');
    });

    it('should return a correct expression for a RangeFilter with no upper bound', () => {
      const expr = expression(null, {field: 'x', range: [0, null]});
      assert.equal(expr, 'datum["x"] >= 0');
    });

    it('should return true for a RangeFilter with no bound', () => {
      const expr = expression(null, {field: 'x', range: [null, null]});
      assert.equal(expr, 'true');
    });

    it('should return a correct expression for an expression filter', () => {
      const expr = expression(null, 'datum["x"]===5');
      assert.equal(expr, 'datum["x"]===5');
    });
  });

  it('generates expressions for composed filters', () => {
    let expr = expression(null, {not: {field: 'color', equal: 'red'}});
    assert.equal(expr, '!(datum["color"]==="red")');

    expr = expression(null, {
      and: [{field: 'color', equal: 'red'}, {field: 'x', range: [0, 5]}]
    });

    assert.equal(expr, '(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');

    expr = expression(null, {
      and: [
        {field: 'color', oneOf: ['red', 'yellow']},
        {
          or: [{field: 'x', range: [0, null]}, 'datum.price > 10', {not: 'datum["x"]===5'}]
        }
      ]
    });

    assert.equal(
      expr,
      '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
        '((datum["x"] >= 0) || (datum.price > 10) || (!(datum["x"]===5)))'
    );
  });

  describe('fieldFilterExpression', () => {
    it('generates a range predicate using inequalities when useInRange=false', () => {
      const expr = fieldFilterExpression({field: 'x', range: [0, 5]}, false);
      assert.equal(expr, 'datum["x"] >= 0 && datum["x"] <= 5');
    });
  });
});
