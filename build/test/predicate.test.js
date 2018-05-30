"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var predicate_1 = require("../src/predicate");
var timeunit_1 = require("../src/timeunit");
describe('filter', function () {
    var equalFilter = { field: 'color', equal: 'red' };
    var oneOfFilter = { field: 'color', oneOf: ['red', 'yellow'] };
    var rangeFilter = { field: 'x', range: [0, 5] };
    var exprFilter = 'datum["x"]===5';
    var lessThanEqualsFilter = { field: 'x', lte: 'z' };
    describe('isEqualFilter', function () {
        it('should return true for an equal filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldEqualPredicate(equalFilter));
        });
        it('should return false for other filters', function () {
            [oneOfFilter, rangeFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldEqualPredicate(filter));
            });
        });
    });
    describe('islessThanEqualsFilter', function () {
        it('should return true for less than equals to filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldLTEPredicate(lessThanEqualsFilter));
        });
        it('should return false for other filters', function () {
            [equalFilter, oneOfFilter, rangeFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldLTEPredicate(filter));
            });
        });
    });
    describe('isOneOfFilter', function () {
        it('should return true for an in filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldOneOfPredicate(oneOfFilter));
        });
        it('should return false for other filters', function () {
            [equalFilter, rangeFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldOneOfPredicate(filter));
            });
        });
    });
    describe('isRangeFilter', function () {
        it('should return true for a range filter', function () {
            chai_1.assert.isTrue(predicate_1.isFieldRangePredicate(rangeFilter));
        });
        it('should return false for other filters', function () {
            [oneOfFilter, equalFilter, exprFilter].forEach(function (filter) {
                chai_1.assert.isFalse(predicate_1.isFieldRangePredicate(filter));
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
        expr = predicate_1.expression(null, { and: [
                { field: 'color', equal: 'red' },
                { field: 'x', range: [0, 5] }
            ] });
        chai_1.assert.equal(expr, '(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');
        expr = predicate_1.expression(null, { and: [
                { field: 'color', oneOf: ['red', 'yellow'] },
                { or: [
                        { field: 'x', range: [0, null] },
                        'datum.price > 10',
                        { not: 'datum["x"]===5' }
                    ] }
            ] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBRTVCLDhDQUE2SjtBQUM3Siw0Q0FBeUM7QUFFekMsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixJQUFNLFdBQVcsR0FBRyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQ25ELElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUMsQ0FBQztJQUMvRCxJQUFNLFdBQVcsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDaEQsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7SUFDcEMsSUFBTSxvQkFBb0IsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDO0lBRXBELFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1lBQzNDLGFBQU0sQ0FBQyxNQUFNLENBQUMsaUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtnQkFDcEQsYUFBTSxDQUFDLE9BQU8sQ0FBQyxpQ0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFB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Q0FBQyxFQUFDO3dCQUM5QixrQkFBa0I7d0JBQ2xCLEVBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFDO3FCQUN4QixFQUFDO2FBQ0gsRUFBQyxDQUFDLENBQUM7UUFFSixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSx3REFBd0Q7WUFDekUsa0VBQWtFLENBQUMsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQztJQUdILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxJQUFJLEdBQUcsaUNBQXFCLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge2V4cHJlc3Npb24sIGZpZWxkRmlsdGVyRXhwcmVzc2lvbiwgaXNGaWVsZEVxdWFsUHJlZGljYXRlLCBpc0ZpZWxkTFRFUHJlZGljYXRlLCBpc0ZpZWxkT25lT2ZQcmVkaWNhdGUsIGlzRmllbGRSYW5nZVByZWRpY2F0ZX0gZnJvbSAnLi4vc3JjL3ByZWRpY2F0ZSc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi9zcmMvdGltZXVuaXQnO1xuXG5kZXNjcmliZSgnZmlsdGVyJywgKCkgPT4ge1xuICBjb25zdCBlcXVhbEZpbHRlciA9IHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfTtcbiAgY29uc3Qgb25lT2ZGaWx0ZXIgPSB7ZmllbGQ6ICdjb2xvcicsIG9uZU9mOiBbJ3JlZCcsICd5ZWxsb3cnXX07XG4gIGNvbnN0IHJhbmdlRmlsdGVyID0ge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19O1xuICBjb25zdCBleHByRmlsdGVyID0gJ2RhdHVtW1wieFwiXT09PTUnO1xuICBjb25zdCBsZXNzVGhhbkVxdWFsc0ZpbHRlciA9IHtmaWVsZDogJ3gnLCBsdGU6ICd6J307XG5cbiAgZGVzY3JpYmUoJ2lzRXF1YWxGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYW4gZXF1YWwgZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZXF1YWxGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW29uZU9mRmlsdGVyLCByYW5nZUZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRFcXVhbFByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNsZXNzVGhhbkVxdWFsc0ZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBsZXNzIHRoYW4gZXF1YWxzIHRvIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNGaWVsZExURVByZWRpY2F0ZShsZXNzVGhhbkVxdWFsc0ZpbHRlcikpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgZm9yIG90aGVyIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgICBbZXF1YWxGaWx0ZXIsIG9uZU9mRmlsdGVyLCByYW5nZUZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRMVEVQcmVkaWNhdGUoZmlsdGVyKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzT25lT2ZGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYW4gaW4gZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkT25lT2ZQcmVkaWNhdGUob25lT2ZGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW2VxdWFsRmlsdGVyLCByYW5nZUZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRPbmVPZlByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNSYW5nZUZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhIHJhbmdlIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNGaWVsZFJhbmdlUHJlZGljYXRlKHJhbmdlRmlsdGVyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3Igb3RoZXIgZmlsdGVycycsICgpID0+IHtcbiAgICAgIFtvbmVPZkZpbHRlciwgZXF1YWxGaWx0ZXIsIGV4cHJGaWx0ZXJdLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUoZmlsdGVyKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2V4cHJlc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJjb2xvclwiXT09PVwicmVkXCInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgbGVzc1RoYW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgbHQ6IDF9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdPDEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgZ3JlYXRlclRoYW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgZ3Q6ICdhYXJkdmFyayd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdPlwiYWFyZHZhcmtcIicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBleHByZXNzaW9uIGZvciBsZXNzVGhhbkVxdWFscycsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCBsdGU6ICd6eXp6eXZhJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl08PVwienl6enl2YVwiJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGdyZWF0ZXJUaGFuRXF1YWxzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIGd0ZTogMX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0+PTEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBFcXVhbEZpbHRlciB3aXRoIGRhdGV0aW1lIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZXF1YWw6IHtcbiAgICAgICAgICBtb250aDogJ0phbnVhcnknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcImRhdGVcIl09PT10aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyIHdpdGggdGltZSB1bml0IGFuZCBkYXRldGltZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIHRpbWVVbml0OiBUaW1lVW5pdC5NT05USCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZXF1YWw6IHtcbiAgICAgICAgICBtb250aDogJ0phbnVhcnknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd0aW1lKGRhdGV0aW1lKDAsIG1vbnRoKGRhdHVtW1wiZGF0ZVwiXSksIDEsIDAsIDAsIDAsIDApKT09PXRpbWUoZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXIgd2l0aCBkYXRldGltZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIHRpbWVVbml0OiBUaW1lVW5pdC5NT05USCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZXF1YWw6ICdKYW51YXJ5J1xuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RpbWUoZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJkYXRlXCJdKSwgMSwgMCwgMCwgMCwgMCkpPT09dGltZShkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIGxlc3NUaGFuRmlsdGVyIHdpdGggZGF0ZXRpbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBsdDoge1xuICAgICAgICAgIG1vbnRoOiAnRmVicnVhcnknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcImRhdGVcIl08dGltZShkYXRldGltZSgwLCAxLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBncmVhdGVyVGhhbkZpbHRlciB3aXRoIHRpbWUgdW5pdCBhbmQgZGF0ZXRpbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICB0aW1lVW5pdDogVGltZVVuaXQuTU9OVEgsXG4gICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgIGd0OiB7XG4gICAgICAgICAgbW9udGg6ICdKYW51YXJ5J1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndGltZShkYXRldGltZSgwLCBtb250aChkYXR1bVtcImRhdGVcIl0pLCAxLCAwLCAwLCAwLCAwKSk+dGltZShkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBncmVhdGVyVGhhbkVxdWFsc0ZpbHRlciB3aXRoIGRhdGV0aW1lIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRILFxuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBndGU6ICdKYW51YXJ5J1xuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RpbWUoZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJkYXRlXCJdKSwgMSwgMCwgMCwgMCwgMCkpPj10aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEluRmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAnY29sb3InLCBvbmVPZjogWydyZWQnLCAneWVsbG93J119KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnaW5kZXhvZihbXCJyZWRcIixcInllbGxvd1wiXSwgZGF0dW1bXCJjb2xvclwiXSkgIT09IC0xJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYSBSYW5nZUZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2lucmFuZ2UoZGF0dW1bXCJ4XCJdLCBbMCwgNV0pJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYSBSYW5nZUZpbHRlciB3aXRoIG5vIGxvd2VyIGJvdW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIHJhbmdlOiBbbnVsbCwgNV19KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdIDw9IDUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhIFJhbmdlRmlsdGVyIHdpdGggbm8gdXBwZXIgYm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCBudWxsXX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0gPj0gMCcpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhIFJhbmdlRmlsdGVyIHdpdGggbm8gYm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFtudWxsLCBudWxsXX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd0cnVlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gZXhwcmVzc2lvbiBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCAnZGF0dW1bXCJ4XCJdPT09NScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl09PT01Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdnZW5lcmF0ZXMgZXhwcmVzc2lvbnMgZm9yIGNvbXBvc2VkIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgbGV0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtub3Q6IHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfX0pO1xuICAgIGFzc2VydC5lcXVhbChleHByLCAnIShkYXR1bVtcImNvbG9yXCJdPT09XCJyZWRcIiknKTtcblxuICAgIGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHthbmQ6IFtcbiAgICAgIHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfSxcbiAgICAgIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfVxuICAgIF19KTtcblxuICAgIGFzc2VydC5lcXVhbChleHByLCAnKGRhdHVtW1wiY29sb3JcIl09PT1cInJlZFwiKSAmJiAoaW5yYW5nZShkYXR1bVtcInhcIl0sIFswLCA1XSkpJyk7XG5cbiAgICBleHByID0gZXhwcmVzc2lvbihudWxsLCB7YW5kOiBbXG4gICAgICB7ZmllbGQ6ICdjb2xvcicsIG9uZU9mOiBbJ3JlZCcsICd5ZWxsb3cnXX0sXG4gICAgICB7b3I6IFtcbiAgICAgICAge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgbnVsbF19LFxuICAgICAgICAnZGF0dW0ucHJpY2UgPiAxMCcsXG4gICAgICAgIHtub3Q6ICdkYXR1bVtcInhcIl09PT01J31cbiAgICAgIF19XG4gICAgXX0pO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHIsICcoaW5kZXhvZihbXCJyZWRcIixcInllbGxvd1wiXSwgZGF0dW1bXCJjb2xvclwiXSkgIT09IC0xKSAmJiAnICtcbiAgICAgICcoKGRhdHVtW1wieFwiXSA+PSAwKSB8fCAoZGF0dW0ucHJpY2UgPiAxMCkgfHwgKCEoZGF0dW1bXCJ4XCJdPT09NSkpKScpO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCdmaWVsZEZpbHRlckV4cHJlc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ2dlbmVyYXRlcyBhIHJhbmdlIHByZWRpY2F0ZSB1c2luZyBpbmVxdWFsaXRpZXMgd2hlbiB1c2VJblJhbmdlPWZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGZpZWxkRmlsdGVyRXhwcmVzc2lvbih7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCA1XX0sIGZhbHNlKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdID49IDAgJiYgZGF0dW1bXCJ4XCJdIDw9IDUnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==