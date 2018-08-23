import { assert } from 'chai';
import { expression, fieldFilterExpression, isFieldEqualPredicate, isFieldLTEPredicate, isFieldOneOfPredicate, isFieldRangePredicate, isFieldValidPredicate } from '../src/predicate';
import { TimeUnit } from '../src/timeunit';
import { without } from '../src/util';
describe('filter', function () {
    var equalFilter = { field: 'color', equal: 'red' };
    var oneOfFilter = { field: 'color', oneOf: ['red', 'yellow'] };
    var rangeFilter = { field: 'x', range: [0, 5] };
    var exprFilter = 'datum["x"]===5';
    var lessThanEqualsFilter = { field: 'x', lte: 'z' };
    var validFilter = { field: 'x', valid: true };
    var allFilters = [
        equalFilter,
        lessThanEqualsFilter,
        oneOfFilter,
        rangeFilter,
        validFilter,
        exprFilter
    ];
    describe('isEqualFilter', function () {
        it('should return true for an equal filter', function () {
            assert.isTrue(isFieldEqualPredicate(equalFilter));
        });
        it('should return false for other filters', function () {
            without(allFilters, [equalFilter]).forEach(function (filter) {
                assert.isFalse(isFieldEqualPredicate(filter));
            });
        });
    });
    describe('islessThanEqualsFilter', function () {
        it('should return true for less than equals to filter', function () {
            assert.isTrue(isFieldLTEPredicate(lessThanEqualsFilter));
        });
        it('should return false for other filters', function () {
            without(allFilters, [lessThanEqualsFilter]).forEach(function (filter) {
                assert.isFalse(isFieldLTEPredicate(filter));
            });
        });
    });
    describe('isOneOfFilter', function () {
        it('should return true for an in filter', function () {
            assert.isTrue(isFieldOneOfPredicate(oneOfFilter));
        });
        it('should return false for other filters', function () {
            without(allFilters, [oneOfFilter]).forEach(function (filter) {
                assert.isFalse(isFieldOneOfPredicate(filter));
            });
        });
    });
    describe('isRangeFilter', function () {
        it('should return true for a range filter', function () {
            assert.isTrue(isFieldRangePredicate(rangeFilter));
        });
        it('should return false for other filters', function () {
            without(allFilters, [rangeFilter]).forEach(function (filter) {
                assert.isFalse(isFieldRangePredicate(filter));
            });
        });
    });
    describe('isValidFilter', function () {
        it('should return true for a valid filter', function () {
            assert.isTrue(isFieldValidPredicate(validFilter));
        });
        it('should return false for other filters', function () {
            without(allFilters, [validFilter]).forEach(function (filter) {
                assert.isFalse(isFieldValidPredicate(filter));
            });
        });
    });
    describe('expression', function () {
        it('should return a correct expression for an EqualFilter', function () {
            var expr = expression(null, { field: 'color', equal: 'red' });
            assert.equal(expr, 'datum["color"]==="red"');
        });
        it('should return correct expression for lessThan', function () {
            var expr = expression(null, { field: 'x', lt: 1 });
            assert.equal(expr, 'datum["x"]<1');
        });
        it('should return correct expression for greaterThan', function () {
            var expr = expression(null, { field: 'x', gt: 'aardvark' });
            assert.equal(expr, 'datum["x"]>"aardvark"');
        });
        it('should return correct expression for lessThanEquals', function () {
            var expr = expression(null, { field: 'x', lte: 'zyzzyva' });
            assert.equal(expr, 'datum["x"]<="zyzzyva"');
        });
        it('should return correct expression for greaterThanEquals', function () {
            var expr = expression(null, { field: 'x', gte: 1 });
            assert.equal(expr, 'datum["x"]>=1');
        });
        it('should return correct expression for valid', function () {
            var expr = expression(null, { field: 'x', valid: true });
            assert.equal(expr, 'datum["x"]!==null&&!isNaN(datum["x"])');
        });
        it('should return a correct expression for an EqualFilter with datetime object', function () {
            var expr = expression(null, {
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            assert.equal(expr, 'datum["date"]===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with time unit and datetime object', function () {
            var expr = expression(null, {
                timeUnit: TimeUnit.MONTH,
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with datetime object', function () {
            var expr = expression(null, {
                timeUnit: TimeUnit.MONTH,
                field: 'date',
                equal: 'January'
            });
            assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an lessThanFilter with datetime object', function () {
            var expr = expression(null, {
                field: 'date',
                lt: {
                    month: 'February'
                }
            });
            assert.equal(expr, 'datum["date"]<time(datetime(0, 1, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an greaterThanFilter with time unit and datetime object', function () {
            var expr = expression(null, {
                timeUnit: TimeUnit.MONTH,
                field: 'date',
                gt: {
                    month: 'January'
                }
            });
            assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))>time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an greaterThanEqualsFilter with datetime object', function () {
            var expr = expression(null, {
                timeUnit: TimeUnit.MONTH,
                field: 'date',
                gte: 'January'
            });
            assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))>=time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an InFilter', function () {
            var expr = expression(null, { field: 'color', oneOf: ['red', 'yellow'] });
            assert.equal(expr, 'indexof(["red","yellow"], datum["color"]) !== -1');
        });
        it('should return a correct expression for a RangeFilter', function () {
            var expr = expression(null, { field: 'x', range: [0, 5] });
            assert.equal(expr, 'inrange(datum["x"], [0, 5])');
        });
        it('should return a correct expression for a RangeFilter with no lower bound', function () {
            var expr = expression(null, { field: 'x', range: [null, 5] });
            assert.equal(expr, 'datum["x"] <= 5');
        });
        it('should return a correct expression for a RangeFilter with no upper bound', function () {
            var expr = expression(null, { field: 'x', range: [0, null] });
            assert.equal(expr, 'datum["x"] >= 0');
        });
        it('should return true for a RangeFilter with no bound', function () {
            var expr = expression(null, { field: 'x', range: [null, null] });
            assert.equal(expr, 'true');
        });
        it('should return a correct expression for an expression filter', function () {
            var expr = expression(null, 'datum["x"]===5');
            assert.equal(expr, 'datum["x"]===5');
        });
    });
    it('generates expressions for composed filters', function () {
        var expr = expression(null, { not: { field: 'color', equal: 'red' } });
        assert.equal(expr, '!(datum["color"]==="red")');
        expr = expression(null, {
            and: [{ field: 'color', equal: 'red' }, { field: 'x', range: [0, 5] }]
        });
        assert.equal(expr, '(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');
        expr = expression(null, {
            and: [
                { field: 'color', oneOf: ['red', 'yellow'] },
                {
                    or: [{ field: 'x', range: [0, null] }, 'datum.price > 10', { not: 'datum["x"]===5' }]
                }
            ]
        });
        assert.equal(expr, '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
            '((datum["x"] >= 0) || (datum.price > 10) || (!(datum["x"]===5)))');
    });
    describe('fieldFilterExpression', function () {
        it('generates a range predicate using inequalities when useInRange=false', function () {
            var expr = fieldFilterExpression({ field: 'x', range: [0, 5] }, false);
            assert.equal(expr, 'datum["x"] >= 0 && datum["x"] <= 5');
        });
    });
});
//# sourceMappingURL=predicate.test.js.map