import { assert } from 'chai';
import { expression, fieldFilterExpression, isFieldEqualPredicate, isFieldLTEPredicate, isFieldOneOfPredicate, isFieldRangePredicate } from '../src/predicate';
import { TimeUnit } from '../src/timeunit';
describe('filter', function () {
    var equalFilter = { field: 'color', equal: 'red' };
    var oneOfFilter = { field: 'color', oneOf: ['red', 'yellow'] };
    var rangeFilter = { field: 'x', range: [0, 5] };
    var exprFilter = 'datum["x"]===5';
    var lessThanEqualsFilter = { field: 'x', lte: 'z' };
    describe('isEqualFilter', function () {
        it('should return true for an equal filter', function () {
            assert.isTrue(isFieldEqualPredicate(equalFilter));
        });
        it('should return false for other filters', function () {
            [oneOfFilter, rangeFilter, exprFilter].forEach(function (filter) {
                assert.isFalse(isFieldEqualPredicate(filter));
            });
        });
    });
    describe('islessThanEqualsFilter', function () {
        it('should return true for less than equals to filter', function () {
            assert.isTrue(isFieldLTEPredicate(lessThanEqualsFilter));
        });
        it('should return false for other filters', function () {
            [equalFilter, oneOfFilter, rangeFilter, exprFilter].forEach(function (filter) {
                assert.isFalse(isFieldLTEPredicate(filter));
            });
        });
    });
    describe('isOneOfFilter', function () {
        it('should return true for an in filter', function () {
            assert.isTrue(isFieldOneOfPredicate(oneOfFilter));
        });
        it('should return false for other filters', function () {
            [equalFilter, rangeFilter, exprFilter].forEach(function (filter) {
                assert.isFalse(isFieldOneOfPredicate(filter));
            });
        });
    });
    describe('isRangeFilter', function () {
        it('should return true for a range filter', function () {
            assert.isTrue(isFieldRangePredicate(rangeFilter));
        });
        it('should return false for other filters', function () {
            [oneOfFilter, equalFilter, exprFilter].forEach(function (filter) {
                assert.isFalse(isFieldRangePredicate(filter));
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
        expr = expression(null, { and: [
                { field: 'color', equal: 'red' },
                { field: 'x', range: [0, 5] }
            ] });
        assert.equal(expr, '(datum["color"]==="red") && (inrange(datum["x"], [0, 5]))');
        expr = expression(null, { and: [
                { field: 'color', oneOf: ['red', 'yellow'] },
                { or: [
                        { field: 'x', range: [0, null] },
                        'datum.price > 10',
                        { not: 'datum["x"]===5' }
                    ] }
            ] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFDLFVBQVUsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzdKLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7SUFDbkQsSUFBTSxXQUFXLEdBQUcsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQyxDQUFDO0lBQy9ELElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUNoRCxJQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztJQUNwQyxJQUFNLG9CQUFvQixHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUM7SUFFcEQsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxP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QUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUM7Z0JBQzFDLEVBQUMsRUFBRSxFQUFFO3dCQUNILEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUM7d0JBQzlCLGtCQUFrQjt3QkFDbEIsRUFBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUM7cUJBQ3hCLEVBQUM7YUFDSCxFQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHdEQUF3RDtZQUN6RSxrRUFBa0UsQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBR0gsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxzRUFBc0UsRUFBRTtZQUN6RSxJQUFNLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7ZXhwcmVzc2lvbiwgZmllbGRGaWx0ZXJFeHByZXNzaW9uLCBpc0ZpZWxkRXF1YWxQcmVkaWNhdGUsIGlzRmllbGRMVEVQcmVkaWNhdGUsIGlzRmllbGRPbmVPZlByZWRpY2F0ZSwgaXNGaWVsZFJhbmdlUHJlZGljYXRlfSBmcm9tICcuLi9zcmMvcHJlZGljYXRlJztcbmltcG9ydCB7VGltZVVuaXR9IGZyb20gJy4uL3NyYy90aW1ldW5pdCc7XG5cbmRlc2NyaWJlKCdmaWx0ZXInLCAoKSA9PiB7XG4gIGNvbnN0IGVxdWFsRmlsdGVyID0ge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9O1xuICBjb25zdCBvbmVPZkZpbHRlciA9IHtmaWVsZDogJ2NvbG9yJywgb25lT2Y6IFsncmVkJywgJ3llbGxvdyddfTtcbiAgY29uc3QgcmFuZ2VGaWx0ZXIgPSB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCA1XX07XG4gIGNvbnN0IGV4cHJGaWx0ZXIgPSAnZGF0dW1bXCJ4XCJdPT09NSc7XG4gIGNvbnN0IGxlc3NUaGFuRXF1YWxzRmlsdGVyID0ge2ZpZWxkOiAneCcsIGx0ZTogJ3onfTtcblxuICBkZXNjcmliZSgnaXNFcXVhbEZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhbiBlcXVhbCBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRmllbGRFcXVhbFByZWRpY2F0ZShlcXVhbEZpbHRlcikpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgZm9yIG90aGVyIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgICBbb25lT2ZGaWx0ZXIsIHJhbmdlRmlsdGVyLCBleHByRmlsdGVyXS5mb3JFYWNoKChmaWx0ZXIpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNGaWVsZEVxdWFsUHJlZGljYXRlKGZpbHRlcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc2xlc3NUaGFuRXF1YWxzRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGxlc3MgdGhhbiBlcXVhbHMgdG8gZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkTFRFUHJlZGljYXRlKGxlc3NUaGFuRXF1YWxzRmlsdGVyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3Igb3RoZXIgZmlsdGVycycsICgpID0+IHtcbiAgICAgIFtlcXVhbEZpbHRlciwgb25lT2ZGaWx0ZXIsIHJhbmdlRmlsdGVyLCBleHByRmlsdGVyXS5mb3JFYWNoKChmaWx0ZXIpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNGaWVsZExURVByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNPbmVPZkZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhbiBpbiBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRmllbGRPbmVPZlByZWRpY2F0ZShvbmVPZkZpbHRlcikpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgZm9yIG90aGVyIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgICBbZXF1YWxGaWx0ZXIsIHJhbmdlRmlsdGVyLCBleHByRmlsdGVyXS5mb3JFYWNoKChmaWx0ZXIpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNGaWVsZE9uZU9mUHJlZGljYXRlKGZpbHRlcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc1JhbmdlRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGEgcmFuZ2UgZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUocmFuZ2VGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW29uZU9mRmlsdGVyLCBlcXVhbEZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRSYW5nZVByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZXhwcmVzc2lvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICdjb2xvcicsIGVxdWFsOiAncmVkJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcImNvbG9yXCJdPT09XCJyZWRcIicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBleHByZXNzaW9uIGZvciBsZXNzVGhhbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCBsdDogMX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl08MScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBleHByZXNzaW9uIGZvciBncmVhdGVyVGhhbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCBndDogJ2FhcmR2YXJrJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0+XCJhYXJkdmFya1wiJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGxlc3NUaGFuRXF1YWxzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIGx0ZTogJ3p5enp5dmEnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXTw9XCJ6eXp6eXZhXCInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgZ3JlYXRlclRoYW5FcXVhbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgZ3RlOiAxfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXT49MScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyIHdpdGggZGF0ZXRpbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBlcXVhbDoge1xuICAgICAgICAgIG1vbnRoOiAnSmFudWFyeSdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wiZGF0ZVwiXT09PXRpbWUoZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXIgd2l0aCB0aW1lIHVuaXQgYW5kIGRhdGV0aW1lIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRILFxuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBlcXVhbDoge1xuICAgICAgICAgIG1vbnRoOiAnSmFudWFyeSdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RpbWUoZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJkYXRlXCJdKSwgMSwgMCwgMCwgMCwgMCkpPT09dGltZShkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBFcXVhbEZpbHRlciB3aXRoIGRhdGV0aW1lIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRILFxuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBlcXVhbDogJ0phbnVhcnknXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndGltZShkYXRldGltZSgwLCBtb250aChkYXR1bVtcImRhdGVcIl0pLCAxLCAwLCAwLCAwLCAwKSk9PT10aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gbGVzc1RoYW5GaWx0ZXIgd2l0aCBkYXRldGltZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgIGx0OiB7XG4gICAgICAgICAgbW9udGg6ICdGZWJydWFyeSdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wiZGF0ZVwiXTx0aW1lKGRhdGV0aW1lKDAsIDEsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIGdyZWF0ZXJUaGFuRmlsdGVyIHdpdGggdGltZSB1bml0IGFuZCBkYXRldGltZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7XG4gICAgICAgIHRpbWVVbml0OiBUaW1lVW5pdC5NT05USCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgZ3Q6IHtcbiAgICAgICAgICBtb250aDogJ0phbnVhcnknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd0aW1lKGRhdGV0aW1lKDAsIG1vbnRoKGRhdHVtW1wiZGF0ZVwiXSksIDEsIDAsIDAsIDAsIDApKT50aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIGdyZWF0ZXJUaGFuRXF1YWxzRmlsdGVyIHdpdGggZGF0ZXRpbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICB0aW1lVW5pdDogVGltZVVuaXQuTU9OVEgsXG4gICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgIGd0ZTogJ0phbnVhcnknXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndGltZShkYXRldGltZSgwLCBtb250aChkYXR1bVtcImRhdGVcIl0pLCAxLCAwLCAwLCAwLCAwKSk+PXRpbWUoZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gSW5GaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICdjb2xvcicsIG9uZU9mOiBbJ3JlZCcsICd5ZWxsb3cnXX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdpbmRleG9mKFtcInJlZFwiLFwieWVsbG93XCJdLCBkYXR1bVtcImNvbG9yXCJdKSAhPT0gLTEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhIFJhbmdlRmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnaW5yYW5nZShkYXR1bVtcInhcIl0sIFswLCA1XSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhIFJhbmdlRmlsdGVyIHdpdGggbm8gbG93ZXIgYm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFtudWxsLCA1XX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0gPD0gNScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGEgUmFuZ2VGaWx0ZXIgd2l0aCBubyB1cHBlciBib3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIG51bGxdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXSA+PSAwJyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGEgUmFuZ2VGaWx0ZXIgd2l0aCBubyBib3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogW251bGwsIG51bGxdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RydWUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBleHByZXNzaW9uIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsICdkYXR1bVtcInhcIl09PT01Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wieFwiXT09PTUnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2dlbmVyYXRlcyBleHByZXNzaW9ucyBmb3IgY29tcG9zZWQgZmlsdGVycycsICgpID0+IHtcbiAgICBsZXQgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge25vdDoge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9fSk7XG4gICAgYXNzZXJ0LmVxdWFsKGV4cHIsICchKGRhdHVtW1wiY29sb3JcIl09PT1cInJlZFwiKScpO1xuXG4gICAgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2FuZDogW1xuICAgICAge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9LFxuICAgICAge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgNV19XG4gICAgXX0pO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHIsICcoZGF0dW1bXCJjb2xvclwiXT09PVwicmVkXCIpICYmIChpbnJhbmdlKGRhdHVtW1wieFwiXSwgWzAsIDVdKSknKTtcblxuICAgIGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHthbmQ6IFtcbiAgICAgIHtmaWVsZDogJ2NvbG9yJywgb25lT2Y6IFsncmVkJywgJ3llbGxvdyddfSxcbiAgICAgIHtvcjogW1xuICAgICAgICB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCBudWxsXX0sXG4gICAgICAgICdkYXR1bS5wcmljZSA+IDEwJyxcbiAgICAgICAge25vdDogJ2RhdHVtW1wieFwiXT09PTUnfVxuICAgICAgXX1cbiAgICBdfSk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwciwgJyhpbmRleG9mKFtcInJlZFwiLFwieWVsbG93XCJdLCBkYXR1bVtcImNvbG9yXCJdKSAhPT0gLTEpICYmICcgK1xuICAgICAgJygoZGF0dW1bXCJ4XCJdID49IDApIHx8IChkYXR1bS5wcmljZSA+IDEwKSB8fCAoIShkYXR1bVtcInhcIl09PT01KSkpJyk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2ZpZWxkRmlsdGVyRXhwcmVzc2lvbicsICgpID0+IHtcbiAgICBpdCgnZ2VuZXJhdGVzIGEgcmFuZ2UgcHJlZGljYXRlIHVzaW5nIGluZXF1YWxpdGllcyB3aGVuIHVzZUluUmFuZ2U9ZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZmllbGRGaWx0ZXJFeHByZXNzaW9uKHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfSwgZmFsc2UpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0gPj0gMCAmJiBkYXR1bVtcInhcIl0gPD0gNScpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19