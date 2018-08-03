"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var predicate_1 = require("../src/predicate");
var timeunit_1 = require("../src/timeunit");
var util_1 = require("../src/util");
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
            chai_1.assert.isTrue(predicate_1.isFieldEqualPredicate(equalFilter));
        });
        it('should return false for other filters', function () {
            util_1.without(allFilters, [equalFilter]).forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldEqualPredicate(filter));
            });
        });
    });
    describe('islessThanEqualsFilter', function () {
        it('should return true for less than equals to filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldLTEPredicate(lessThanEqualsFilter));
        });
        it('should return false for other filters', function () {
            util_1.without(allFilters, [lessThanEqualsFilter]).forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldLTEPredicate(filter));
            });
        });
    });
    describe('isOneOfFilter', function () {
        it('should return true for an in filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldOneOfPredicate(oneOfFilter));
        });
        it('should return false for other filters', function () {
            util_1.without(allFilters, [oneOfFilter]).forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldOneOfPredicate(filter));
            });
        });
    });
    describe('isRangeFilter', function () {
        it('should return true for a range filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldRangePredicate(rangeFilter));
        });
        it('should return false for other filters', function () {
            util_1.without(allFilters, [rangeFilter]).forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldRangePredicate(filter));
            });
        });
    });
    describe('isValidFilter', function () {
        it('should return true for a valid filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldValidPredicate(validFilter));
        });
        it('should return false for other filters', function () {
            util_1.without(allFilters, [validFilter]).forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldValidPredicate(filter));
            });
        });
    });
    describe('expression', function () {
        it('should return a correct expression for an EqualFilter', function () {
            var expr = predicate_1.expression(null, { field: 'color', equal: 'red' });
            chai_1.assert.equal(expr, 'datum["color"]==="red"');
        });
        it('should return correct expression for lessThan', function () {
            var expr = predicate_1.expression(null, { field: 'x', lt: 1 });
            chai_1.assert.equal(expr, 'datum["x"]<1');
        });
        it('should return correct expression for greaterThan', function () {
            var expr = predicate_1.expression(null, { field: 'x', gt: 'aardvark' });
            chai_1.assert.equal(expr, 'datum["x"]>"aardvark"');
        });
        it('should return correct expression for lessThanEquals', function () {
            var expr = predicate_1.expression(null, { field: 'x', lte: 'zyzzyva' });
            chai_1.assert.equal(expr, 'datum["x"]<="zyzzyva"');
        });
        it('should return correct expression for greaterThanEquals', function () {
            var expr = predicate_1.expression(null, { field: 'x', gte: 1 });
            chai_1.assert.equal(expr, 'datum["x"]>=1');
        });
        it('should return correct expression for valid', function () {
            var expr = predicate_1.expression(null, { field: 'x', valid: true });
            chai_1.assert.equal(expr, 'datum["x"]!==null&&!isNaN(datum["x"])');
        });
        it('should return a correct expression for an EqualFilter with datetime object', function () {
            var expr = predicate_1.expression(null, {
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'datum["date"]===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with time unit and datetime object', function () {
            var expr = predicate_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with datetime object', function () {
            var expr = predicate_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: 'January'
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an lessThanFilter with datetime object', function () {
            var expr = predicate_1.expression(null, {
                field: 'date',
                lt: {
                    month: 'February'
                }
            });
            chai_1.assert.equal(expr, 'datum["date"]<time(datetime(0, 1, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an greaterThanFilter with time unit and datetime object', function () {
            var expr = predicate_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                gt: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))>time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an greaterThanEqualsFilter with datetime object', function () {
            var expr = predicate_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                gte: 'January'
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))>=time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an InFilter', function () {
            var expr = predicate_1.expression(null, { field: 'color', oneOf: ['red', 'yellow'] });
            chai_1.assert.equal(expr, 'indexof(["red","yellow"], datum["color"]) !== -1');
        });
        it('should return a correct expression for a RangeFilter', function () {
            var expr = predicate_1.expression(null, { field: 'x', range: [0, 5] });
            chai_1.assert.equal(expr, 'inrange(datum["x"], [0, 5])');
        });
        it('should return a correct expression for a RangeFilter with no lower bound', function () {
            var expr = predicate_1.expression(null, { field: 'x', range: [null, 5] });
            chai_1.assert.equal(expr, 'datum["x"] <= 5');
        });
        it('should return a correct expression for a RangeFilter with no upper bound', function () {
            var expr = predicate_1.expression(null, { field: 'x', range: [0, null] });
            chai_1.assert.equal(expr, 'datum["x"] >= 0');
        });
        it('should return true for a RangeFilter with no bound', function () {
            var expr = predicate_1.expression(null, { field: 'x', range: [null, null] });
            chai_1.assert.equal(expr, 'true');
        });
        it('should return a correct expression for an expression filter', function () {
            var expr = predicate_1.expression(null, 'datum["x"]===5');
            chai_1.assert.equal(expr, 'datum["x"]===5');
        });
    });
    it('generates expressions for composed filters', function () {
        var expr = predicate_1.expression(null, { not: { field: 'color', equal: 'red' } });
        chai_1.assert.equal(expr, '!(datum["color"]==="red")');
        expr = predicate_1.expression(null, {
            and: [{ field: 'color', equal: 'red' }, { field: 'x', range: [0, 5] }]
        });
        chai_1.assert.equal(expr, '(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');
        expr = predicate_1.expression(null, {
            and: [
                { field: 'color', oneOf: ['red', 'yellow'] },
                {
                    or: [{ field: 'x', range: [0, null] }, 'datum.price > 10', { not: 'datum["x"]===5' }]
                }
            ]
        });
        chai_1.assert.equal(expr, '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
            '((datum["x"] >= 0) || (datum.price > 10) || (!(datum["x"]===5)))');
    });
    describe('fieldFilterExpression', function () {
        it('generates a range predicate using inequalities when useInRange=false', function () {
            var expr = predicate_1.fieldFilterExpression({ field: 'x', range: [0, 5] }, false);
            chai_1.assert.equal(expr, 'datum["x"] >= 0 && datum["x"] <= 5');
        });
    });
});
//# sourceMappingURL=predicate.test.js.map