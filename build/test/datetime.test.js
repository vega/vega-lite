"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var datetime_1 = require("../src/datetime");
var log = require("../src/log");
describe('datetime', function () {
    describe('dateTimeExpr', function () {
        it('should drop day if day is combined with year/month/date', log.wrap(function (localLogger) {
            var d = {
                year: 2007,
                day: 'monday'
            };
            var expr = datetime_1.dateTimeExpr(d, true);
            chai_1.assert.equal(expr, 'datetime(2007, 0, 1, 0, 0, 0, 0)');
            chai_1.assert.equal(localLogger.warns[0], log.message.droppedDay(d));
        }));
        it('should normalize numeric quarter correctly', function () {
            var expr = datetime_1.dateTimeExpr({
                quarter: 2
            }, true);
            chai_1.assert.equal(expr, 'datetime(0, 1*3, 1, 0, 0, 0, 0)');
        });
        it('should log warning for quarter > 4', log.wrap(function (localLogger) {
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                quarter: 5
            }, true), 'datetime(0, 4*3, 1, 0, 0, 0, 0)');
            chai_1.assert.equal(localLogger.warns[0], log.message.invalidTimeUnit('quarter', 5));
        }));
        it('should throw error for invalid quarter', function () {
            chai_1.assert.throws(function () {
                datetime_1.dateTimeExpr({ quarter: 'Q' }, true);
            }, Error, log.message.invalidTimeUnit('quarter', 'Q'));
        });
        it('should normalize numeric month correctly', function () {
            var expr = datetime_1.dateTimeExpr({
                month: 1
            }, true);
            chai_1.assert.equal(expr, 'datetime(0, 0, 1, 0, 0, 0, 0)');
        });
        it('should normalize month name correctly', function () {
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                month: 'January'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                month: 'january'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                month: 'Jan'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                month: 'jan'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
        });
        it('should throw error for invalid month', function () {
            chai_1.assert.throws(function () {
                datetime_1.dateTimeExpr({ month: 'J' }, true);
            }, Error, log.message.invalidTimeUnit('month', 'J'));
        });
        it('should normalize numeric day (of week) correctly', function () {
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                day: 0
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                day: 7
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
        });
        it('should normalize day name correctly and use year 2006 to ensure correct', function () {
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                day: 'Sunday'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                day: 'sunday'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                day: 'Sun'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            chai_1.assert.equal(datetime_1.dateTimeExpr({
                day: 'sun'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
        });
        it('should throw error for invalid day', function () {
            chai_1.assert.throws(function () {
                datetime_1.dateTimeExpr({ day: 'S' }, true);
            }, Error, log.message.invalidTimeUnit('day', 'S'));
        });
        it('should use utc expression if utc is specified', function () {
            var d = {
                year: 2007,
                day: 'monday',
                utc: true
            };
            var expr = datetime_1.dateTimeExpr(d, true);
            chai_1.assert.equal(expr, 'utc(2007, 0, 1, 0, 0, 0, 0)');
        });
        // Note: Other part of coverage handled by timeUnit.fieldExpr's test
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZGF0ZXRpbWUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1Qiw0Q0FBNkM7QUFDN0MsZ0NBQWtDO0FBRWxDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDbkIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMseURBQXlELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDakYsSUFBTSxDQUFDLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsR0FBRyxFQUFFLFFBQVE7YUFDZCxDQUFDO1lBQ0YsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztZQUN2RCxhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sSUFBSSxHQUFHLHVCQUFZLENBQUM7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDO2FBQ1gsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNULGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGlDQUFpQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDNUQsYUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBWSxDQUFDO2dCQUN4QixPQUFPLEVBQUUsQ0FBQzthQUNYLEVBQUUsSUFBSSxD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QUksQ0FBQyxFQUFFLG9DQUFvQyxDQUFDLENBQUM7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBWSxDQUFDO2dCQUN4QixHQUFHLEVBQUUsS0FBSzthQUNYLEVBQUUsSUFBSSxDQUFDLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxhQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNaLHVCQUFZLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxJQUFNLENBQUMsR0FBRztnQkFDUixJQUFJLEVBQUUsSUFBSTtnQkFDVixHQUFHLEVBQUUsUUFBUTtnQkFDYixHQUFHLEVBQUUsSUFBSTthQUNWLENBQUM7WUFDRixJQUFNLElBQUksR0FBRyx1QkFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsb0VBQW9FO0lBQ3RFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2RhdGVUaW1lRXhwcn0gZnJvbSAnLi4vc3JjL2RhdGV0aW1lJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9zcmMvbG9nJztcblxuZGVzY3JpYmUoJ2RhdGV0aW1lJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZGF0ZVRpbWVFeHByJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZHJvcCBkYXkgaWYgZGF5IGlzIGNvbWJpbmVkIHdpdGggeWVhci9tb250aC9kYXRlJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBkID0ge1xuICAgICAgICB5ZWFyOiAyMDA3LFxuICAgICAgICBkYXk6ICdtb25kYXknXG4gICAgICB9O1xuICAgICAgY29uc3QgZXhwciA9IGRhdGVUaW1lRXhwcihkLCB0cnVlKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0ZXRpbWUoMjAwNywgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZHJvcHBlZERheShkKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgbnVtZXJpYyBxdWFydGVyIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBkYXRlVGltZUV4cHIoe1xuICAgICAgICBxdWFydGVyOiAyXG4gICAgICB9LCB0cnVlKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0ZXRpbWUoMCwgMSozLCAxLCAwLCAwLCAwLCAwKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBsb2cgd2FybmluZyBmb3IgcXVhcnRlciA+IDQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRlVGltZUV4cHIoe1xuICAgICAgICBxdWFydGVyOiA1XG4gICAgICB9LCB0cnVlKSwgJ2RhdGV0aW1lKDAsIDQqMywgMSwgMCwgMCwgMCwgMCknKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuaW52YWxpZFRpbWVVbml0KCdxdWFydGVyJywgNSkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgZXJyb3IgZm9yIGludmFsaWQgcXVhcnRlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBkYXRlVGltZUV4cHIoe3F1YXJ0ZXI6ICdRJ30sIHRydWUpO1xuICAgICAgfSwgRXJyb3IsIGxvZy5tZXNzYWdlLmludmFsaWRUaW1lVW5pdCgncXVhcnRlcicsICdRJykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgbnVtZXJpYyBtb250aCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgbW9udGg6IDFcbiAgICAgIH0sIHRydWUpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICdkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgbW9udGggbmFtZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgbW9udGg6ICdKYW51YXJ5J1xuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgwLCAwLCAxLCAwLCAwLCAwLCAwKScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIG1vbnRoOiAnamFudWFyeSdcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRlVGltZUV4cHIoe1xuICAgICAgICBtb250aDogJ0phbidcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRlVGltZUV4cHIoe1xuICAgICAgICBtb250aDogJ2phbidcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgZXJyb3IgZm9yIGludmFsaWQgbW9udGgnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgICAgZGF0ZVRpbWVFeHByKHttb250aDogJ0onfSwgdHJ1ZSk7XG4gICAgICB9LCBFcnJvciwgbG9nLm1lc3NhZ2UuaW52YWxpZFRpbWVVbml0KCdtb250aCcsICdKJykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgbnVtZXJpYyBkYXkgKG9mIHdlZWspIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRlVGltZUV4cHIoe1xuICAgICAgICBkYXk6IDBcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMjAwNiwgMCwgMCsxLCAwLCAwLCAwLCAwKScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIGRheTogN1xuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgyMDA2LCAwLCAwKzEsIDAsIDAsIDAsIDApJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vcm1hbGl6ZSBkYXkgbmFtZSBjb3JyZWN0bHkgYW5kIHVzZSB5ZWFyIDIwMDYgdG8gZW5zdXJlIGNvcnJlY3QnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgZGF5OiAnU3VuZGF5J1xuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgyMDA2LCAwLCAwKzEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgZGF5OiAnc3VuZGF5J1xuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgyMDA2LCAwLCAwKzEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgZGF5OiAnU3VuJ1xuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgyMDA2LCAwLCAwKzEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgZGF5OiAnc3VuJ1xuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgyMDA2LCAwLCAwKzEsIDAsIDAsIDAsIDApJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIGZvciBpbnZhbGlkIGRheScsICgpID0+IHtcbiAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBkYXRlVGltZUV4cHIoe2RheTogJ1MnfSwgdHJ1ZSk7XG4gICAgICB9LCBFcnJvciwgbG9nLm1lc3NhZ2UuaW52YWxpZFRpbWVVbml0KCdkYXknLCAnUycpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHV0YyBleHByZXNzaW9uIGlmIHV0YyBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkID0ge1xuICAgICAgICB5ZWFyOiAyMDA3LFxuICAgICAgICBkYXk6ICdtb25kYXknLFxuICAgICAgICB1dGM6IHRydWVcbiAgICAgIH07XG4gICAgICBjb25zdCBleHByID0gZGF0ZVRpbWVFeHByKGQsIHRydWUpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGV4cHIsICd1dGMoMjAwNywgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICB9KTtcblxuICAgIC8vIE5vdGU6IE90aGVyIHBhcnQgb2YgY292ZXJhZ2UgaGFuZGxlZCBieSB0aW1lVW5pdC5maWVsZEV4cHIncyB0ZXN0XG4gIH0pO1xufSk7XG4iXX0=