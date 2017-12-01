"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            var expr = filter_1.expression(null, { field: 'color', equal: 'red' });
            chai_1.assert.equal(expr, 'datum["color"]==="red"');
        });
        it('should return a correct expression for an EqualFilter with datetime object', function () {
            var expr = filter_1.expression(null, {
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'datum["date"]===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with time unit and datetime object', function () {
            var expr = filter_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: {
                    month: 'January'
                }
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an EqualFilter with datetime ojbect', function () {
            var expr = filter_1.expression(null, {
                timeUnit: timeunit_1.TimeUnit.MONTH,
                field: 'date',
                equal: 'January'
            });
            chai_1.assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
        });
        it('should return a correct expression for an InFilter', function () {
            var expr = filter_1.expression(null, { field: 'color', oneOf: ['red', 'yellow'] });
            chai_1.assert.equal(expr, 'indexof(["red","yellow"], datum["color"]) !== -1');
        });
        it('should return a correct expression for a RangeFilter', function () {
            var expr = filter_1.expression(null, { field: 'x', range: [0, 5] });
            chai_1.assert.equal(expr, 'inrange(datum["x"], [0, 5])');
        });
        it('should return a correct expression for a RangeFilter with no lower bound', function () {
            var expr = filter_1.expression(null, { field: 'x', range: [null, 5] });
            chai_1.assert.equal(expr, 'datum["x"] <= 5');
        });
        it('should return a correct expression for a RangeFilter with no upper bound', function () {
            var expr = filter_1.expression(null, { field: 'x', range: [0, null] });
            chai_1.assert.equal(expr, 'datum["x"] >= 0');
        });
        it('should return true for a RangeFilter with no bound', function () {
            var expr = filter_1.expression(null, { field: 'x', range: [null, null] });
            chai_1.assert.equal(expr, 'true');
        });
        it('should return a correct expression for an expression filter', function () {
            var expr = filter_1.expression(null, 'datum["x"]===5');
            chai_1.assert.equal(expr, 'datum["x"]===5');
        });
    });
    it('generates expressions for composed filters', function () {
        var expr = filter_1.expression(null, { not: { field: 'color', equal: 'red' } });
        chai_1.assert.equal(expr, '!(datum["color"]==="red")');
        expr = filter_1.expression(null, { and: [
                { field: 'color', equal: 'red' },
                { field: 'x', range: [0, 5] }
            ] });
        chai_1.assert.equal(expr, '(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');
        expr = filter_1.expression(null, { and: [
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
            var expr = filter_1.fieldFilterExpression({ field: 'x', range: [0, 5] }, false);
            chai_1.assert.equal(expr, 'datum["x"] >= 0 && datum["x"] <= 5');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2ZpbHRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLHdDQUE2RztBQUM3Ryw0Q0FBeUM7QUFFekMsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixJQUFNLFdBQVcsR0FBRyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQ25ELElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUMsQ0FBQztJQUMvRCxJQUFNLFdBQVcsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDaEQsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7SUFFcEMsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07Z0JBQ3BELGFBQU0sQ0FBQyxPQUFPLENBQUMsc0JBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLGFBQU0sQ0FBQyxNQUFNLENBQUMsc0JBQWEsQ0FB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LENBQUMsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQztJQUdILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxJQUFJLEdBQUcsOEJBQXFCLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtleHByZXNzaW9uLCBmaWVsZEZpbHRlckV4cHJlc3Npb24sIGlzRXF1YWxGaWx0ZXIsIGlzT25lT2ZGaWx0ZXIsIGlzUmFuZ2VGaWx0ZXJ9IGZyb20gJy4uL3NyYy9maWx0ZXInO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vc3JjL3RpbWV1bml0JztcblxuZGVzY3JpYmUoJ2ZpbHRlcicsICgpID0+IHtcbiAgY29uc3QgZXF1YWxGaWx0ZXIgPSB7ZmllbGQ6ICdjb2xvcicsIGVxdWFsOiAncmVkJ307XG4gIGNvbnN0IG9uZU9mRmlsdGVyID0ge2ZpZWxkOiAnY29sb3InLCBvbmVPZjogWydyZWQnLCAneWVsbG93J119O1xuICBjb25zdCByYW5nZUZpbHRlciA9IHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfTtcbiAgY29uc3QgZXhwckZpbHRlciA9ICdkYXR1bVtcInhcIl09PT01JztcblxuICBkZXNjcmliZSgnaXNFcXVhbEZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhbiBlcXVhbCBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRXF1YWxGaWx0ZXIoZXF1YWxGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW29uZU9mRmlsdGVyLCByYW5nZUZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRXF1YWxGaWx0ZXIoZmlsdGVyKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzT25lT2ZGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYW4gaW4gZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc09uZU9mRmlsdGVyKG9uZU9mRmlsdGVyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3Igb3RoZXIgZmlsdGVycycsICgpID0+IHtcbiAgICAgIFtlcXVhbEZpbHRlciwgcmFuZ2VGaWx0ZXIsIGV4cHJGaWx0ZXJdLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc09uZU9mRmlsdGVyKGZpbHRlcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc1JhbmdlRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGEgcmFuZ2UgZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1JhbmdlRmlsdGVyKHJhbmdlRmlsdGVyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3Igb3RoZXIgZmlsdGVycycsICgpID0+IHtcbiAgICAgIFtvbmVPZkZpbHRlciwgZXF1YWxGaWx0ZXIsIGV4cHJGaWx0ZXJdLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1JhbmdlRmlsdGVyKGZpbHRlcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdleHByZXNzaW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBFcXVhbEZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wiY29sb3JcIl09PT1cInJlZFwiJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXIgd2l0aCBkYXRldGltZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgIGVxdWFsOiB7XG4gICAgICAgICAgbW9udGg6ICdKYW51YXJ5J1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJkYXRlXCJdPT09dGltZShkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBFcXVhbEZpbHRlciB3aXRoIHRpbWUgdW5pdCBhbmQgZGF0ZXRpbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICB0aW1lVW5pdDogVGltZVVuaXQuTU9OVEgsXG4gICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgIGVxdWFsOiB7XG4gICAgICAgICAgbW9udGg6ICdKYW51YXJ5J1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndGltZShkYXRldGltZSgwLCBtb250aChkYXR1bVtcImRhdGVcIl0pLCAxLCAwLCAwLCAwLCAwKSk9PT10aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyIHdpdGggZGF0ZXRpbWUgb2piZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICB0aW1lVW5pdDogVGltZVVuaXQuTU9OVEgsXG4gICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgIGVxdWFsOiAnSmFudWFyeSdcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd0aW1lKGRhdGV0aW1lKDAsIG1vbnRoKGRhdHVtW1wiZGF0ZVwiXSksIDEsIDAsIDAsIDAsIDApKT09PXRpbWUoZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gSW5GaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICdjb2xvcicsIG9uZU9mOiBbJ3JlZCcsICd5ZWxsb3cnXX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdpbmRleG9mKFtcInJlZFwiLFwieWVsbG93XCJdLCBkYXR1bVtcImNvbG9yXCJdKSAhPT0gLTEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhIFJhbmdlRmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnaW5yYW5nZShkYXR1bVtcInhcIl0sIFswLCA1XSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhIFJhbmdlRmlsdGVyIHdpdGggbm8gbG93ZXIgYm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFtudWxsLCA1XX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0gPD0gNScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGEgUmFuZ2VGaWx0ZXIgd2l0aCBubyB1cHBlciBib3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIG51bGxdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXSA+PSAwJyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGEgUmFuZ2VGaWx0ZXIgd2l0aCBubyBib3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogW251bGwsIG51bGxdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RydWUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBleHByZXNzaW9uIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsICdkYXR1bVtcInhcIl09PT01Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXT09PTUnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2dlbmVyYXRlcyBleHByZXNzaW9ucyBmb3IgY29tcG9zZWQgZmlsdGVycycsICgpID0+IHtcbiAgICBsZXQgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge25vdDoge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9fSk7XG4gICAgYXNzZXJ0LmVxdWFsKGV4cHIsICchKGRhdHVtW1wiY29sb3JcIl09PT1cInJlZFwiKScpO1xuXG4gICAgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2FuZDogW1xuICAgICAge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9LFxuICAgICAge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19XG4gICAgXX0pO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHIsICcoZGF0dW1bXCJjb2xvclwiXT09PVwicmVkXCIpICYmIChpbnJhbmdlKGRhdHVtW1wieFwiXSwgWzAsIDVdKSknKTtcblxuICAgIGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHthbmQ6IFtcbiAgICAgIHtmaWVsZDogJ2NvbG9yJywgb25lT2Y6IFsncmVkJywgJ3llbGxvdyddfSxcbiAgICAgIHtvcjogW1xuICAgICAgICB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCBudWxsXX0sXG4gICAgICAgICdkYXR1bS5wcmljZSA+IDEwJyxcbiAgICAgICAge25vdDogJ2RhdHVtW1wieFwiXT09PTUnfVxuICAgICAgXX1cbiAgICBdfSk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwciwgJyhpbmRleG9mKFtcInJlZFwiLFwieWVsbG93XCJdLCBkYXR1bVtcImNvbG9yXCJdKSAhPT0gLTEpICYmICcgK1xuICAgICAgJygoZGF0dW1bXCJ4XCJdID49IDApIHx8IChkYXR1bS5wcmljZSA+IDEwKSB8fCAoIShkYXR1bVtcInhcIl09PT01KSkpJyk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2ZpZWxkRmlsdGVyRXhwcmVzc2lvbicsICgpID0+IHtcbiAgICBpdCgnZ2VuZXJhdGVzIGEgcmFuZ2UgcHJlZGljYXRlIHVzaW5nIGluZXF1YWxpdGllcyB3aGVuIHVzZUluUmFuZ2U9ZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZmllbGRGaWx0ZXJFeHByZXNzaW9uKHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfSwgZmFsc2UpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0gPj0gMCAmJiBkYXR1bVtcInhcIl0gPD0gNScpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19