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
        it('should return a correct expression for an EqualFilter with datetime ojbect', function () {
            var expr = predicate_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: 'January'
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBRTVCLDhDQUF3STtBQUN4SSw0Q0FBeUM7QUFFekMsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixJQUFNLFdBQVcsR0FBRyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQ25ELElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUMsQ0FBQztJQUMvRCxJQUFNLFdBQVcsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDaEQsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7SUFFcEMsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxpQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2dCQUNwRCxhQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxp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WUFDekUsa0VBQWtFLENBQUMsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQztJQUdILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxJQUFJLEdBQUcsaUNBQXFCLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge2V4cHJlc3Npb24sIGZpZWxkRmlsdGVyRXhwcmVzc2lvbiwgaXNGaWVsZEVxdWFsUHJlZGljYXRlLCBpc0ZpZWxkT25lT2ZQcmVkaWNhdGUsIGlzRmllbGRSYW5nZVByZWRpY2F0ZX0gZnJvbSAnLi4vc3JjL3ByZWRpY2F0ZSc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi9zcmMvdGltZXVuaXQnO1xuXG5kZXNjcmliZSgnZmlsdGVyJywgKCkgPT4ge1xuICBjb25zdCBlcXVhbEZpbHRlciA9IHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfTtcbiAgY29uc3Qgb25lT2ZGaWx0ZXIgPSB7ZmllbGQ6ICdjb2xvcicsIG9uZU9mOiBbJ3JlZCcsICd5ZWxsb3cnXX07XG4gIGNvbnN0IHJhbmdlRmlsdGVyID0ge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19O1xuICBjb25zdCBleHByRmlsdGVyID0gJ2RhdHVtW1wieFwiXT09PTUnO1xuXG4gIGRlc2NyaWJlKCdpc0VxdWFsRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGFuIGVxdWFsIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNGaWVsZEVxdWFsUHJlZGljYXRlKGVxdWFsRmlsdGVyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3Igb3RoZXIgZmlsdGVycycsICgpID0+IHtcbiAgICAgIFtvbmVPZkZpbHRlciwgcmFuZ2VGaWx0ZXIsIGV4cHJGaWx0ZXJdLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZmlsdGVyKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzT25lT2ZGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYW4gaW4gZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkT25lT2ZQcmVkaWNhdGUob25lT2ZGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW2VxdWFsRmlsdGVyLCByYW5nZUZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRPbmVPZlByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNSYW5nZUZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhIHJhbmdlIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNGaWVsZFJhbmdlUHJlZGljYXRlKHJhbmdlRmlsdGVyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3Igb3RoZXIgZmlsdGVycycsICgpID0+IHtcbiAgICAgIFtvbmVPZkZpbHRlciwgZXF1YWxGaWx0ZXIsIGV4cHJGaWx0ZXJdLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUoZmlsdGVyKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2V4cHJlc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJjb2xvclwiXT09PVwicmVkXCInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBFcXVhbEZpbHRlciB3aXRoIGRhdGV0aW1lIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZXF1YWw6IHtcbiAgICAgICAgICBtb250aDogJ0phbnVhcnknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcImRhdGVcIl09PT10aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyIHdpdGggdGltZSB1bml0IGFuZCBkYXRldGltZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIHRpbWVVbml0OiBUaW1lVW5pdC5NT05USCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZXF1YWw6IHtcbiAgICAgICAgICBtb250aDogJ0phbnVhcnknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd0aW1lKGRhdGV0aW1lKDAsIG1vbnRoKGRhdHVtW1wiZGF0ZVwiXSksIDEsIDAsIDAsIDAsIDApKT09PXRpbWUoZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXIgd2l0aCBkYXRldGltZSBvamJlY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIHRpbWVVbml0OiBUaW1lVW5pdC5NT05USCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZXF1YWw6ICdKYW51YXJ5J1xuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RpbWUoZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJkYXRlXCJdKSwgMSwgMCwgMCwgMCwgMCkpPT09dGltZShkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBJbkZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ2NvbG9yJywgb25lT2Y6IFsncmVkJywgJ3llbGxvdyddfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2luZGV4b2YoW1wicmVkXCIsXCJ5ZWxsb3dcIl0sIGRhdHVtW1wiY29sb3JcIl0pICE9PSAtMScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGEgUmFuZ2VGaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCA1XX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdpbnJhbmdlKGRhdHVtW1wieFwiXSwgWzAsIDVdKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGEgUmFuZ2VGaWx0ZXIgd2l0aCBubyBsb3dlciBib3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogW251bGwsIDVdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXSA8PSA1Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYSBSYW5nZUZpbHRlciB3aXRoIG5vIHVwcGVyIGJvdW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgbnVsbF19KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdID49IDAnKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYSBSYW5nZUZpbHRlciB3aXRoIG5vIGJvdW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIHJhbmdlOiBbbnVsbCwgbnVsbF19KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndHJ1ZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIGV4cHJlc3Npb24gZmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwgJ2RhdHVtW1wieFwiXT09PTUnKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdPT09NScpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZ2VuZXJhdGVzIGV4cHJlc3Npb25zIGZvciBjb21wb3NlZCBmaWx0ZXJzJywgKCkgPT4ge1xuICAgIGxldCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7bm90OiB7ZmllbGQ6ICdjb2xvcicsIGVxdWFsOiAncmVkJ319KTtcbiAgICBhc3NlcnQuZXF1YWwoZXhwciwgJyEoZGF0dW1bXCJjb2xvclwiXT09PVwicmVkXCIpJyk7XG5cbiAgICBleHByID0gZXhwcmVzc2lvbihudWxsLCB7YW5kOiBbXG4gICAgICB7ZmllbGQ6ICdjb2xvcicsIGVxdWFsOiAncmVkJ30sXG4gICAgICB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCA1XX1cbiAgICBdfSk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwciwgJyhkYXR1bVtcImNvbG9yXCJdPT09XCJyZWRcIikgJiYgKGlucmFuZ2UoZGF0dW1bXCJ4XCJdLCBbMCwgNV0pKScpO1xuXG4gICAgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2FuZDogW1xuICAgICAge2ZpZWxkOiAnY29sb3InLCBvbmVPZjogWydyZWQnLCAneWVsbG93J119LFxuICAgICAge29yOiBbXG4gICAgICAgIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIG51bGxdfSxcbiAgICAgICAgJ2RhdHVtLnByaWNlID4gMTAnLFxuICAgICAgICB7bm90OiAnZGF0dW1bXCJ4XCJdPT09NSd9XG4gICAgICBdfVxuICAgIF19KTtcblxuICAgIGFzc2VydC5lcXVhbChleHByLCAnKGluZGV4b2YoW1wicmVkXCIsXCJ5ZWxsb3dcIl0sIGRhdHVtW1wiY29sb3JcIl0pICE9PSAtMSkgJiYgJyArXG4gICAgICAnKChkYXR1bVtcInhcIl0gPj0gMCkgfHwgKGRhdHVtLnByaWNlID4gMTApIHx8ICghKGRhdHVtW1wieFwiXT09PTUpKSknKTtcbiAgfSk7XG5cblxuICBkZXNjcmliZSgnZmllbGRGaWx0ZXJFeHByZXNzaW9uJywgKCkgPT4ge1xuICAgIGl0KCdnZW5lcmF0ZXMgYSByYW5nZSBwcmVkaWNhdGUgdXNpbmcgaW5lcXVhbGl0aWVzIHdoZW4gdXNlSW5SYW5nZT1mYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBmaWVsZEZpbHRlckV4cHJlc3Npb24oe2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19LCBmYWxzZSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXSA+PSAwICYmIGRhdHVtW1wieFwiXSA8PSA1Jyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=