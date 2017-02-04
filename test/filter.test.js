"use strict";
var chai_1 = require("chai");
var filter_1 = require("../src/filter");
var timeunit_1 = require("../src/timeunit");
describe('filter', function () {
    var equalFilter = { field: 'color', equal: 'red' };
    var oneOfFilter = { field: 'color', oneOf: ['red', 'yellow'] };
    var rangeFilter = { field: 'x', range: [0, 5] };
    var exprFilter = 'datum["x"]===5';
    describe('isEqualFilter', function () {
        it('should return true for an equal filter', function () {
            chai_1.assert.isTrue(filter_1.isEqualFilter(equalFilter));
        });
        it('should return false for other filters', function () {
            [oneOfFilter, rangeFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(filter_1.isEqualFilter(filter));
            });
        });
    });
    describe('isOneOfFilter', function () {
        it('should return true for an in filter', function () {
            chai_1.assert.isTrue(filter_1.isOneOfFilter(oneOfFilter));
        });
        it('should return false for other filters', function () {
            [equalFilter, rangeFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(filter_1.isOneOfFilter(filter));
            });
        });
    });
    describe('isRangeFilter', function () {
        it('should return true for a range filter', function () {
            chai_1.assert.isTrue(filter_1.isRangeFilter(rangeFilter));
        });
        it('should return false for other filters', function () {
            [oneOfFilter, equalFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(filter_1.isRangeFilter(filter));
            });
        });
    });
    describe('expression', function () {
        it('should return a correct expression for an EqualFilter', function () {
            var expr = filter_1.expression({ field: 'color', equal: 'red' });
            chai_1.assert.equal(expr, 'datum["color"]==="red"');
        });
        it('should return a correct expression for an EqualFilter with datetime object', function () {
            var expr = filter_1.expression({
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'datum["date"]===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with time unit and datetime object', function () {
            var expr = filter_1.expression({
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with datetime ojbect', function () {
            var expr = filter_1.expression({
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: 'January'
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an InFilter', function () {
            var expr = filter_1.expression({ field: 'color', oneOf: ['red', 'yellow'] });
            chai_1.assert.equal(expr, 'indexof(["red","yellow"], datum["color"]) !== -1');
        });
        it('should return a correct expression for a RangeFilter', function () {
            var expr = filter_1.expression({ field: 'x', range: [0, 5] });
            chai_1.assert.equal(expr, 'inrange(datum["x"], 0, 5)');
        });
        it('should return a correct expression for a RangeFilter with no lower bound', function () {
            var expr = filter_1.expression({ field: 'x', range: [null, 5] });
            chai_1.assert.equal(expr, 'datum["x"] <= 5');
        });
        it('should return a correct expression for a RangeFilter with no upper bound', function () {
            var expr = filter_1.expression({ field: 'x', range: [0, null] });
            chai_1.assert.equal(expr, 'datum["x"] >= 0');
        });
        it('should return undefined for a RangeFilter with no bound', function () {
            var expr = filter_1.expression({ field: 'x', range: [null, null] });
            chai_1.assert.equal(expr, undefined);
        });
        it('should return a correct expression for an expression filter', function () {
            var expr = filter_1.expression('datum["x"]===5');
            chai_1.assert.equal(expr, 'datum["x"]===5');
        });
    });
});
//# sourceMappingURL=filter.test.js.map