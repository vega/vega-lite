"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var encode = require("../../../src/compile/legend/encode");
var timeunit_1 = require("../../../src/timeunit");
var type_1 = require("../../../src/type");
var util_1 = require("../../util");
describe('compile/legend', function () {
    describe('encode.symbols', function () {
        it('should not have fill, strokeDash, or strokeDashOffset', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                }
            }), channel_1.COLOR);
            chai_1.assert.isUndefined((symbol || {}).fill);
            chai_1.assert.isUndefined((symbol || {}).strokeDash);
            chai_1.assert.isUndefined((symbol || {}).strokeDashOffset);
        });
        it('should return specific symbols.shape.value if user has specified', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    shape: { value: "square" }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.shape.value, 'square');
        });
    });
    describe('encode.labels', function () {
        it('should return correct expression for the timeUnit: TimeUnit.MONTH', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var fieldDef = { field: 'a', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.MONTH };
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR);
            var expected = "timeFormat(datum.value, '%b')";
            chai_1.assert.deepEqual(label.text.signal, expected);
        });
        it('should return correct expression for the timeUnit: TimeUnit.QUARTER', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var fieldDef = { field: 'a', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.QUARTER };
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR);
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.deepEqual(label.text.signal, expected);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGVnZW5kL2VuY29kZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBMkM7QUFDM0MsMkRBQTZEO0FBQzdELGtEQUErQztBQUMvQywwQ0FBMkM7QUFDM0MsbUNBQW1EO0FBRW5ELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsOEJBQXVCLENBQUM7Z0JBQ3JGLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7b0JBQ2hDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDckM7YUFDRixDQUFDLEVBQUUsZUFBSyxDQUFDLENBQUM7WUFDWCxhQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxJQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLElBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sSUFBRSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtFQUFrRSxFQUFFO1lBQ3JFLElBQU0sTUFB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