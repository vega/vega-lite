"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var datetime_1 = require("../src/datetime");
var log = tslib_1.__importStar(require("../src/log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZGF0ZXRpbWUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFDNUIsNENBQTZDO0FBQzdDLHNEQUFrQztBQUVsQyxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ25CLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQ2pGLElBQU0sQ0FBQyxHQUFHO2dCQUNSLElBQUksRUFBRSxJQUFJO2dCQUNWLEdBQUcsRUFBRSxRQUFRO2FBQ2QsQ0FBQztZQUNGLElBQU0sSUFBSSxHQUFHLHVCQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGtDQUFrQyxDQUFDLENBQUM7WUFDdkQsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLElBQUksR0FBRyx1QkFBWSxDQUFDO2dCQUN4QixPQUFPLEVBQUUsQ0FBQzthQUNYLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDVCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQzVELGFBQU0sQ0FBQyxLQUFLLENBQUMsdUJBQVksQ0FBQztnQkFDeEIsT0FBTyxFQUFFLENBQUM7YUFDWCxFQUFFLElBQUks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QUFJLENBQUMsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ2hELGFBQU0sQ0FBQyxLQUFLLENBQUMsdUJBQVksQ0FBQztnQkFDeEIsR0FBRyxFQUFFLEtBQUs7YUFDWCxFQUFFLElBQUksQ0FBQyxFQUFFLG9DQUFvQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsYUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDWix1QkFBWSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7WUFDbEQsSUFBTSxDQUFDLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsR0FBRyxFQUFFLElBQUk7YUFDVixDQUFDO1lBQ0YsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILG9FQUFvRTtJQUN0RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtkYXRlVGltZUV4cHJ9IGZyb20gJy4uL3NyYy9kYXRldGltZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vc3JjL2xvZyc7XG5cbmRlc2NyaWJlKCdkYXRldGltZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2RhdGVUaW1lRXhwcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRyb3AgZGF5IGlmIGRheSBpcyBjb21iaW5lZCB3aXRoIHllYXIvbW9udGgvZGF0ZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZCA9IHtcbiAgICAgICAgeWVhcjogMjAwNyxcbiAgICAgICAgZGF5OiAnbW9uZGF5J1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGV4cHIgPSBkYXRlVGltZUV4cHIoZCwgdHJ1ZSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdGV0aW1lKDIwMDcsIDAsIDEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRyb3BwZWREYXkoZCkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgbm9ybWFsaXplIG51bWVyaWMgcXVhcnRlciBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHByID0gZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgcXVhcnRlcjogMlxuICAgICAgfSwgdHJ1ZSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZXhwciwgJ2RhdGV0aW1lKDAsIDEqMywgMSwgMCwgMCwgMCwgMCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbG9nIHdhcm5pbmcgZm9yIHF1YXJ0ZXIgPiA0JywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgcXVhcnRlcjogNVxuICAgICAgfSwgdHJ1ZSksICdkYXRldGltZSgwLCA0KjMsIDEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmludmFsaWRUaW1lVW5pdCgncXVhcnRlcicsIDUpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIGZvciBpbnZhbGlkIHF1YXJ0ZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgICAgZGF0ZVRpbWVFeHByKHtxdWFydGVyOiAnUSd9LCB0cnVlKTtcbiAgICAgIH0sIEVycm9yLCBsb2cubWVzc2FnZS5pbnZhbGlkVGltZVVuaXQoJ3F1YXJ0ZXInLCAnUScpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm9ybWFsaXplIG51bWVyaWMgbW9udGggY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IGRhdGVUaW1lRXhwcih7XG4gICAgICAgIG1vbnRoOiAxXG4gICAgICB9LCB0cnVlKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAnZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm9ybWFsaXplIG1vbnRoIG5hbWUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIG1vbnRoOiAnSmFudWFyeSdcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMCwgMCwgMSwgMCwgMCwgMCwgMCknKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRlVGltZUV4cHIoe1xuICAgICAgICBtb250aDogJ2phbnVhcnknXG4gICAgICB9LCB0cnVlKSwgJ2RhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgbW9udGg6ICdKYW4nXG4gICAgICB9LCB0cnVlKSwgJ2RhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgbW9udGg6ICdqYW4nXG4gICAgICB9LCB0cnVlKSwgJ2RhdGV0aW1lKDAsIDAsIDEsIDAsIDAsIDAsIDApJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIGZvciBpbnZhbGlkIG1vbnRoJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICAgIGRhdGVUaW1lRXhwcih7bW9udGg6ICdKJ30sIHRydWUpO1xuICAgICAgfSwgRXJyb3IsIGxvZy5tZXNzYWdlLmludmFsaWRUaW1lVW5pdCgnbW9udGgnLCAnSicpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm9ybWFsaXplIG51bWVyaWMgZGF5IChvZiB3ZWVrKSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0ZVRpbWVFeHByKHtcbiAgICAgICAgZGF5OiAwXG4gICAgICB9LCB0cnVlKSwgJ2RhdGV0aW1lKDIwMDYsIDAsIDArMSwgMCwgMCwgMCwgMCknKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRlVGltZUV4cHIoe1xuICAgICAgICBkYXk6IDdcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMjAwNiwgMCwgMCsxLCAwLCAwLCAwLCAwKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgZGF5IG5hbWUgY29ycmVjdGx5IGFuZCB1c2UgeWVhciAyMDA2IHRvIGVuc3VyZSBjb3JyZWN0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIGRheTogJ1N1bmRheSdcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMjAwNiwgMCwgMCsxLCAwLCAwLCAwLCAwKScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIGRheTogJ3N1bmRheSdcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMjAwNiwgMCwgMCsxLCAwLCAwLCAwLCAwKScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIGRheTogJ1N1bidcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMjAwNiwgMCwgMCsxLCAwLCAwLCAwLCAwKScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGVUaW1lRXhwcih7XG4gICAgICAgIGRheTogJ3N1bidcbiAgICAgIH0sIHRydWUpLCAnZGF0ZXRpbWUoMjAwNiwgMCwgMCsxLCAwLCAwLCAwLCAwKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciBmb3IgaW52YWxpZCBkYXknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgICAgZGF0ZVRpbWVFeHByKHtkYXk6ICdTJ30sIHRydWUpO1xuICAgICAgfSwgRXJyb3IsIGxvZy5tZXNzYWdlLmludmFsaWRUaW1lVW5pdCgnZGF5JywgJ1MnKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB1dGMgZXhwcmVzc2lvbiBpZiB1dGMgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZCA9IHtcbiAgICAgICAgeWVhcjogMjAwNyxcbiAgICAgICAgZGF5OiAnbW9uZGF5JyxcbiAgICAgICAgdXRjOiB0cnVlXG4gICAgICB9O1xuICAgICAgY29uc3QgZXhwciA9IGRhdGVUaW1lRXhwcihkLCB0cnVlKTtcbiAgICAgIGFzc2VydC5lcXVhbChleHByLCAndXRjKDIwMDcsIDAsIDEsIDAsIDAsIDAsIDApJyk7XG4gICAgfSk7XG5cbiAgICAvLyBOb3RlOiBPdGhlciBwYXJ0IG9mIGNvdmVyYWdlIGhhbmRsZWQgYnkgdGltZVVuaXQuZmllbGRFeHByJ3MgdGVzdFxuICB9KTtcbn0pO1xuIl19