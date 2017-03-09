"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var datetime_1 = require("../src/datetime");
var log = require("../src/log");
describe('datetime', function () {
    describe('dateTimeExpr', function () {
        it('should drop day if day is combined with year/month/date', function () {
            log.runLocalLogger(function (localLogger) {
                var d = {
                    year: 2007,
                    day: 'monday'
                };
                var expr = datetime_1.dateTimeExpr(d, true);
                chai_1.assert.equal(expr, 'datetime(2007, 0, 1, 0, 0, 0, 0)');
                chai_1.assert.equal(localLogger.warns[0], log.message.droppedDay(d));
            });
        });
        it('should normalize numeric quarter correctly', function () {
            var expr = datetime_1.dateTimeExpr({
                quarter: 2
            }, true);
            chai_1.assert.equal(expr, 'datetime(0, 1*3, 1, 0, 0, 0, 0)');
        });
        it('should log warning for quarter > 4', function () {
            log.runLocalLogger(function (localLogger) {
                chai_1.assert.equal(datetime_1.dateTimeExpr({
                    quarter: 5
                }, true), 'datetime(0, 4*3, 1, 0, 0, 0, 0)');
                chai_1.assert.equal(localLogger.warns[0], log.message.invalidTimeUnit('quarter', 5));
            });
        });
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
        // Note: Other part of coverage handled by timeUnit.fieldExpr's test
    });
    describe('timestamp', function () {
        it('should produce correct timestamp', function () {
            chai_1.assert.equal(datetime_1.timestamp({
                year: 1234,
                month: 'June',
                date: 6,
                hours: 7,
                minutes: 8,
                seconds: 9,
                milliseconds: 123
            }, true), new Date(1234, 5, 6, 7, 8, 9, 123).getTime());
        });
        it('should produce correct timestamp for quarter', function () {
            chai_1.assert.equal(datetime_1.timestamp({
                year: 1234,
                quarter: 3,
            }, true), new Date(1234, 6, 1).getTime());
        });
        it('should produce correct timestamp for day', function () {
            chai_1.assert.equal(datetime_1.timestamp({
                day: 'monday'
            }, true), new Date(2006, 0, 2).getTime());
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZGF0ZXRpbWUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1Qiw0Q0FBd0Q7QUFDeEQsZ0NBQWtDO0FBRWxDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDbkIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMseURBQXlELEVBQUU7WUFDNUQsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLElBQU0sQ0FBQyxHQUFHO29CQUNSLElBQUksRUFBRSxJQUFJO29CQUNWLEdBQUcsRUFBRSxRQUFRO2lCQUNkLENBQUM7Z0JBQ0YsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGtDQUFrQyxDQUFDLENBQUM7Z0JBQ3ZELGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQztnQkFDeEIsT0FBTyxFQUFFLENBQUM7YUFDWCxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQUMsV0FBVztnQkFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBWSxDQUFDO29CQUN4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