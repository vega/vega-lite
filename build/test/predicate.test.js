import { assert } from 'chai';
import { expression, fieldFilterExpression, isFieldEqualPredicate, isFieldOneOfPredicate, isFieldRangePredicate } from '../src/predicate';
import { TimeUnit } from '../src/timeunit';
describe('filter', function () {
    var equalFilter = { field: 'color', equal: 'red' };
    var oneOfFilter = { field: 'color', oneOf: ['red', 'yellow'] };
    var rangeFilter = { field: 'x', range: [0, 5] };
    var exprFilter = 'datum["x"]===5';
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
        it('should return a correct expression for an EqualFilter with datetime ojbect', function () {
            var expr = expression(null, {
                timeUnit: TimeUnit.MONTH,
                field: 'date',
                equal: 'January'
            });
            assert.equal(expr, 'time(datetime(0, month(datum["date"]), 1, 0, 0, 0, 0))===time(datetime(0, 0, 1, 0, 0, 0, 0))');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFDLFVBQVUsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3hJLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7SUFDbkQsSUFBTSxXQUFXLEdBQUcsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQyxDQUFDO0lBQy9ELElBQU0sV0FBVyxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUNoRCxJQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztJQUVwQyxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07Z0JBQ3BELE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoRCxD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QzlCLGtCQUFrQjt3QkFDbEIsRUFBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUM7cUJBQ3hCLEVBQUM7YUFDSCxFQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHdEQUF3RDtZQUN6RSxrRUFBa0UsQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBR0gsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxzRUFBc0UsRUFBRTtZQUN6RSxJQUFNLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7ZXhwcmVzc2lvbiwgZmllbGRGaWx0ZXJFeHByZXNzaW9uLCBpc0ZpZWxkRXF1YWxQcmVkaWNhdGUsIGlzRmllbGRPbmVPZlByZWRpY2F0ZSwgaXNGaWVsZFJhbmdlUHJlZGljYXRlfSBmcm9tICcuLi9zcmMvcHJlZGljYXRlJztcbmltcG9ydCB7VGltZVVuaXR9IGZyb20gJy4uL3NyYy90aW1ldW5pdCc7XG5cbmRlc2NyaWJlKCdmaWx0ZXInLCAoKSA9PiB7XG4gIGNvbnN0IGVxdWFsRmlsdGVyID0ge2ZpZWxkOiAnY29sb3InLCBlcXVhbDogJ3JlZCd9O1xuICBjb25zdCBvbmVPZkZpbHRlciA9IHtmaWVsZDogJ2NvbG9yJywgb25lT2Y6IFsncmVkJywgJ3llbGxvdyddfTtcbiAgY29uc3QgcmFuZ2VGaWx0ZXIgPSB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCA1XX07XG4gIGNvbnN0IGV4cHJGaWx0ZXIgPSAnZGF0dW1bXCJ4XCJdPT09NSc7XG5cbiAgZGVzY3JpYmUoJ2lzRXF1YWxGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYW4gZXF1YWwgZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZXF1YWxGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW29uZU9mRmlsdGVyLCByYW5nZUZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRFcXVhbFByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNPbmVPZkZpbHRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhbiBpbiBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRmllbGRPbmVPZlByZWRpY2F0ZShvbmVPZkZpbHRlcikpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgZm9yIG90aGVyIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgICBbZXF1YWxGaWx0ZXIsIHJhbmdlRmlsdGVyLCBleHByRmlsdGVyXS5mb3JFYWNoKChmaWx0ZXIpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNGaWVsZE9uZU9mUHJlZGljYXRlKGZpbHRlcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc1JhbmdlRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGEgcmFuZ2UgZmlsdGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUocmFuZ2VGaWx0ZXIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBvdGhlciBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgW29uZU9mRmlsdGVyLCBlcXVhbEZpbHRlciwgZXhwckZpbHRlcl0uZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRmllbGRSYW5nZVByZWRpY2F0ZShmaWx0ZXIpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZXhwcmVzc2lvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICdjb2xvcicsIGVxdWFsOiAncmVkJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcImNvbG9yXCJdPT09XCJyZWRcIicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEVxdWFsRmlsdGVyIHdpdGggZGF0ZXRpbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge1xuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBlcXVhbDoge1xuICAgICAgICAgIG1vbnRoOiAnSmFudWFyeSdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdHVtW1wiZGF0ZVwiXT09PXRpbWUoZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gRXF1YWxGaWx0ZXIgd2l0aCB0aW1lIHVuaXQgYW5kIGRhdGV0aW1lIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRILFxuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBlcXVhbDoge1xuICAgICAgICAgIG1vbnRoOiAnSmFudWFyeSdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ3RpbWUoZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJkYXRlXCJdKSwgMSwgMCwgMCwgMCwgMCkpPT09dGltZShkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhbiBFcXVhbEZpbHRlciB3aXRoIGRhdGV0aW1lIG9qYmVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtcbiAgICAgICAgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRILFxuICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICBlcXVhbDogJ0phbnVhcnknXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndGltZShkYXRldGltZSgwLCBtb250aChkYXR1bVtcImRhdGVcIl0pLCAxLCAwLCAwLCAwLCAwKSk9PT10aW1lKGRhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIGFuIEluRmlsdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAnY29sb3InLCBvbmVPZjogWydyZWQnLCAneWVsbG93J119KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnaW5kZXhvZihbXCJyZWRcIixcInllbGxvd1wiXSwgZGF0dW1bXCJjb2xvclwiXSkgIT09IC0xJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYSBSYW5nZUZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2lucmFuZ2UoZGF0dW1bXCJ4XCJdLCBbMCwgNV0pJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYSBSYW5nZUZpbHRlciB3aXRoIG5vIGxvd2VyIGJvdW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGV4cHJlc3Npb24obnVsbCwge2ZpZWxkOiAneCcsIHJhbmdlOiBbbnVsbCwgNV19KTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdIDw9IDUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBleHByZXNzaW9uIGZvciBhIFJhbmdlRmlsdGVyIHdpdGggbm8gdXBwZXIgYm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCBudWxsXX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl0gPj0gMCcpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhIFJhbmdlRmlsdGVyIHdpdGggbm8gYm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCB7ZmllbGQ6ICd4JywgcmFuZ2U6IFtudWxsLCBudWxsXX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd0cnVlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgZXhwcmVzc2lvbiBmb3IgYW4gZXhwcmVzc2lvbiBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZXhwcmVzc2lvbihudWxsLCAnZGF0dW1bXCJ4XCJdPT09NScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXR1bVtcInhcIl09PT01Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdnZW5lcmF0ZXMgZXhwcmVzc2lvbnMgZm9yIGNvbXBvc2VkIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgbGV0IGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHtub3Q6IHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfX0pO1xuICAgIGFzc2VydC5lcXVhbChleHByLCAnIShkYXR1bVtcImNvbG9yXCJdPT09XCJyZWRcIiknKTtcblxuICAgIGV4cHIgPSBleHByZXNzaW9uKG51bGwsIHthbmQ6IFtcbiAgICAgIHtmaWVsZDogJ2NvbG9yJywgZXF1YWw6ICdyZWQnfSxcbiAgICAgIHtmaWVsZDogJ3gnLCByYW5nZTogWzAsIDVdfVxuICAgIF19KTtcblxuICAgIGFzc2VydC5lcXVhbChleHByLCAnKGRhdHVtW1wiY29sb3JcIl09PT1cInJlZFwiKSAmJiAoaW5yYW5nZShkYXR1bVtcInhcIl0sIFswLCA1XSkpJyk7XG5cbiAgICBleHByID0gZXhwcmVzc2lvbihudWxsLCB7YW5kOiBbXG4gICAgICB7ZmllbGQ6ICdjb2xvcicsIG9uZU9mOiBbJ3JlZCcsICd5ZWxsb3cnXX0sXG4gICAgICB7b3I6IFtcbiAgICAgICAge2ZpZWxkOiAneCcsIHJhbmdlOiBbMCwgbnVsbF19LFxuICAgICAgICAnZGF0dW0ucHJpY2UgPiAxMCcsXG4gICAgICAgIHtub3Q6ICdkYXR1bVtcInhcIl09PT01J31cbiAgICAgIF19XG4gICAgXX0pO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHIsICcoaW5kZXhvZihbXCJyZWRcIixcInllbGxvd1wiXSwgZGF0dW1bXCJjb2xvclwiXSkgIT09IC0xKSAmJiAnICtcbiAgICAgICcoKGRhdHVtW1wieFwiXSA+PSAwKSB8fCAoZGF0dW0ucHJpY2UgPiAxMCkgfHwgKCEoZGF0dW1bXCJ4XCJdPT09NSkpKScpO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCdmaWVsZEZpbHRlckV4cHJlc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ2dlbmVyYXRlcyBhIHJhbmdlIHByZWRpY2F0ZSB1c2luZyBpbmVxdWFsaXRpZXMgd2hlbiB1c2VJblJhbmdlPWZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGZpZWxkRmlsdGVyRXhwcmVzc2lvbih7ZmllbGQ6ICd4JywgcmFuZ2U6IFswLCA1XX0sIGZhbHNlKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0dW1bXCJ4XCJdID49IDAgJiYgZGF0dW1bXCJ4XCJdIDw9IDUnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==