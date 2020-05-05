import {expression} from '../src/compile/predicate';
import {
  fieldFilterExpression,
  FieldValidPredicate,
  isFieldEqualPredicate,
  isFieldLTEPredicate,
  isFieldOneOfPredicate,
  isFieldRangePredicate,
  isFieldValidPredicate,
  Predicate
} from '../src/predicate';
import {without} from './util';

describe('filter', () => {
  const equalFilter = {field: 'color', equal: 'red'};
  const oneOfFilter = {field: 'color', oneOf: ['red', 'yellow']};
  const rangeFilter = {field: 'x', range: [0, 5]};
  const rangeSignalFilter = {field: 'x', range: {signal: 'range'}};
  const exprFilter = 'datum["x"]===5';
  const lessThanEqualsFilter = {field: 'x', lte: 'z'};
  const validFilter: FieldValidPredicate = {field: 'x', valid: true};

  const allFilters: Predicate[] = [
    equalFilter,
    lessThanEqualsFilter,
    oneOfFilter,
    rangeFilter,
    validFilter,
    exprFilter
  ];

  describe('isEqualFilter', () => {
    it('should return true for an equal filter', () => {
      expect(isFieldEqualPredicate(equalFilter)).toBe(true);
    });

    it('should return false for other filters', () => {
      without(allFilters, [equalFilter]).forEach(filter => {
        expect(isFieldEqualPredicate(filter)).toBe(false);
      });
    });
  });

  describe('islessThanEqualsFilter', () => {
    it('should return true for less than equals to filter', () => {
      expect(isFieldLTEPredicate(lessThanEqualsFilter)).toBe(true);
    });

    it('should return false for other filters', () => {
      without(allFilters, [lessThanEqualsFilter]).forEach(filter => {
        expect(isFieldLTEPredicate(filter)).toBe(false);
      });
    });
  });

  describe('isOneOfFilter', () => {
    it('should return true for an in filter', () => {
      expect(isFieldOneOfPredicate(oneOfFilter)).toBe(true);
    });

    it('should return false for other filters', () => {
      without(allFilters, [oneOfFilter]).forEach(filter => {
        expect(isFieldOneOfPredicate(filter)).toBe(false);
      });
    });
  });

  describe('isRangeFilter', () => {
    it('should return true for a range filter', () => {
      expect(isFieldRangePredicate(rangeFilter)).toBe(true);
    });

    it('should return true for a range predicate with range signal', () => {
      expect(isFieldRangePredicate(rangeSignalFilter)).toBe(true);
    });

    it('should return false for other filters', () => {
      without(allFilters, [rangeFilter]).forEach(filter => {
        expect(isFieldRangePredicate(filter)).toBe(false);
      });
    });
  });

  describe('isValidFilter', () => {
    it('should return true for a valid filter', () => {
      expect(isFieldValidPredicate(validFilter)).toBe(true);
    });

    it('should return false for other filters', () => {
      without(allFilters, [validFilter]).forEach(filter => {
        expect(isFieldValidPredicate(filter)).toBe(false);
      });
    });
  });

  describe('expression', () => {
    it('should return a correct expression for an EqualFilter', () => {
      const expr = expression(null, {field: 'color', equal: 'red'});
      expect(expr).toBe('datum["color"]==="red"');
    });

    it('should return correct expression for lessThan', () => {
      const expr = expression(null, {field: 'x', lt: 1});
      expect(expr).toBe('datum["x"]<1');
    });

    it('should return correct expression for greaterThan', () => {
      const expr = expression(null, {field: 'x', gt: 'aardvark'});
      expect(expr).toBe('datum["x"]>"aardvark"');
    });

    it('should return correct expression for lessThanEquals', () => {
      const expr = expression(null, {field: 'x', lte: 'zyzzyva'});
      expect(expr).toBe('datum["x"]<="zyzzyva"');
    });

    it('should return correct expression for greaterThanEquals', () => {
      const expr = expression(null, {field: 'x', gte: 1});
      expect(expr).toBe('datum["x"]>=1');
    });

    it('should return correct expression for valid', () => {
      const expr = expression(null, {field: 'x', valid: true});
      expect(expr).toBe('isValid(datum["x"]) && isFinite(+datum["x"])');
    });

    it('should return a correct expression for an EqualFilter with datetime object', () => {
      const expr = expression(null, {
        field: 'date',
        equal: {
          month: 'January'
        }
      });
      expect(expr).toBe('datum["date"]===time(datetime(2012, 0, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an EqualFilter with time unit and datetime object', () => {
      const expr = expression(null, {
        timeUnit: 'month',
        field: 'date',
        equal: {
          month: 'January'
        }
      });
      expect(expr).toEqual(
        'time(datetime(2012, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(2012, 0, 1, 0, 0, 0, 0))'
      );
    });

    it('should return a correct expression for an EqualFilter with datetime object with flat value', () => {
      const expr = expression(null, {
        timeUnit: 'month',
        field: 'date',
        equal: 'January'
      });
      expect(expr).toEqual(
        'time(datetime(2012, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(2012, 0, 1, 0, 0, 0, 0))'
      );
    });

    it('should return a correct expression for an lessThanFilter with datetime object', () => {
      const expr = expression(null, {
        field: 'date',
        lt: {
          month: 'February'
        }
      });
      expect(expr).toBe('datum["date"]<time(datetime(2012, 1, 1, 0, 0, 0, 0))');
    });

    it('should return a correct expression for an greaterThanFilter with time unit and datetime object', () => {
      const expr = expression(null, {
        timeUnit: 'month',
        field: 'date',
        gt: {
          month: 'January'
        }
      });
      expect(expr).toEqual(
        'time(datetime(2012, month(datum["date"]), 1, 0, 0, 0, 0))>time(datetime(2012, 0, 1, 0, 0, 0, 0))'
      );
    });

    it('should return a correct expression for an greaterThanEqualsFilter with datetime object', () => {
      const expr = expression(null, {
        timeUnit: 'month',
        field: 'date',
        gte: 'January'
      });
      expect(expr).toEqual(
        'time(datetime(2012, month(datum["date"]), 1, 0, 0, 0, 0))>=time(datetime(2012, 0, 1, 0, 0, 0, 0))'
      );
    });

    it('should return a correct expression for an InFilter', () => {
      const expr = expression(null, {field: 'color', oneOf: ['red', 'yellow']});
      expect(expr).toBe('indexof(["red","yellow"], datum["color"]) !== -1');
    });

    it('should return a correct expression for a RangeFilter', () => {
      const expr = expression(null, {field: 'x', range: [0, 5]});
      expect(expr).toBe('inrange(datum["x"], [0, 5])');
    });

    it('should return a correct expression for a RangeFilter with signal range', () => {
      const expr = expression(null, {field: 'x', range: {signal: 'r'}});
      expect(expr).toBe('inrange(datum["x"], [r[0], r[1]])');
    });

    it('should return a correct expression for a RangeFilter with no lower bound', () => {
      const expr = expression(null, {field: 'x', range: [null, 5]});
      expect(expr).toBe('datum["x"] <= 5');
    });

    it('should return a correct expression for a RangeFilter with no upper bound', () => {
      const expr = expression(null, {field: 'x', range: [0, null]});
      expect(expr).toBe('datum["x"] >= 0');
    });

    it('should return true for a RangeFilter with no bound', () => {
      const expr = expression(null, {field: 'x', range: [null, null]});
      expect(expr).toBe('true');
    });

    it('should return a correct expression for an expression filter', () => {
      const expr = expression(null, 'datum["x"]===5');
      expect(expr).toBe('datum["x"]===5');
    });
  });

  it('generates expressions for composed filters', () => {
    let expr = expression(null, {not: {field: 'color', equal: 'red'}});
    expect(expr).toBe('!(datum["color"]==="red")');

    expr = expression(null, {
      and: [
        {field: 'color', equal: 'red'},
        {field: 'x', range: [0, 5]}
      ]
    });

    expect(expr).toBe('(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');

    expr = expression(null, {
      and: [
        {field: 'color', oneOf: ['red', 'yellow']},
        {
          or: [{field: 'x', range: [0, null]}, 'datum.price > 10', {not: 'datum["x"]===5'}]
        }
      ]
    });

    expect(expr).toEqual(
      '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
        '((datum["x"] >= 0) || (datum.price > 10) || (!(datum["x"]===5)))'
    );
  });

  describe('fieldFilterExpression', () => {
    it('generates a range predicate using inequalities when useInRange=false', () => {
      const expr = fieldFilterExpression({field: 'x', range: [0, 5]}, false);
      expect(expr).toBe('datum["x"] >= 0 && datum["x"] <= 5');
    });
  });
});
