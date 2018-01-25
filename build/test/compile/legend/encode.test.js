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
            }), channel_1.COLOR, 'symbol');
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
            }), channel_1.COLOR, 'symbol');
            chai_1.assert.deepEqual(symbol.shape.value, 'square');
        });
        it('should have default opacity', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" }
                }
            }), channel_1.COLOR, 'symbol');
            chai_1.assert.deepEqual(symbol.opacity.value, 0.7); // default opacity is 0.7.
        });
        it('should return the maximum value when there is a condition', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    opacity: {
                        condition: { selection: "brush", value: 1 },
                        value: 0
                    }
                }
            }), channel_1.COLOR, 'symbol');
            chai_1.assert.deepEqual(symbol.opacity.value, 1);
        });
    });
    describe('encode.gradient', function () {
        it('should have default opacity', function () {
            var gradient = encode.gradient({ field: 'a', type: 'quantitative' }, {}, util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative" }
                }
            }), channel_1.COLOR, 'gradient');
            chai_1.assert.deepEqual(gradient.opacity.value, 0.7); // default opacity is 0.7.
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
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR, 'gradient');
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
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR, 'gradient');
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.deepEqual(label.text.signal, expected);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGVnZW5kL2VuY29kZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBMkM7QUFDM0MsMkRBQTZEO0FBQzdELGtEQUErQztBQUMvQywwQ0FBMkM7QUFDM0MsbUNBQW1EO0FBRW5ELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBRTFELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsOEJBQXVCLENBQUM7Z0JBQ3JGLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7b0JBQ2hDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDckM7YUFDRixDQUFDLEVBQUUsZUFBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JCLGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLElBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sSUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1QyxhQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxJQUFFLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0VBQWtFLEVBQUU7WUFF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RSxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNwRSxJQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQztZQUM5QyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NPTE9SfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZSc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi8uLi8uLi9zcmMvdGltZXVuaXQnO1xuaW1wb3J0IHtURU1QT1JBTH0gZnJvbSAnLi4vLi4vLi4vc3JjL3R5cGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xlZ2VuZCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnZW5jb2RlLnN5bWJvbHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIGZpbGwsIHN0cm9rZURhc2gsIG9yIHN0cm9rZURhc2hPZmZzZXQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgY29uc3Qgc3ltYm9sID0gZW5jb2RlLnN5bWJvbHMoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sIHt9LCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KSwgQ09MT1IsICdzeW1ib2wnKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKChzeW1ib2x8fHt9KS5maWxsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKChzeW1ib2x8fHt9KS5zdHJva2VEYXNoKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKChzeW1ib2x8fHt9KS5zdHJva2VEYXNoT2Zmc2V0KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHNwZWNpZmljIHN5bWJvbHMuc2hhcGUudmFsdWUgaWYgdXNlciBoYXMgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGNvbnN0IHN5bWJvbCA9IGVuY29kZS5zeW1ib2xzKHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCB7fSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgc2hhcGU6IHt2YWx1ZTogXCJzcXVhcmVcIn19XG4gICAgICAgIH0pLCBDT0xPUiwgJ3N5bWJvbCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHN5bWJvbC5zaGFwZS52YWx1ZSwgJ3NxdWFyZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlZmF1bHQgb3BhY2l0eScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBjb25zdCBzeW1ib2wgPSBlbmNvZGUuc3ltYm9scyh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwge30sIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifX1cbiAgICAgICAgfSksIENPTE9SLCAnc3ltYm9sJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3ltYm9sLm9wYWNpdHkudmFsdWUsIDAuNyk7IC8vIGRlZmF1bHQgb3BhY2l0eSBpcyAwLjcuXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbWF4aW11bSB2YWx1ZSB3aGVuIHRoZXJlIGlzIGEgY29uZGl0aW9uJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGNvbnN0IHN5bWJvbCA9IGVuY29kZS5zeW1ib2xzKHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCB7fSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246IFwiYnJ1c2hcIiwgdmFsdWU6IDF9LFxuICAgICAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICAgICAgfX1cbiAgICAgICAgfSksIENPTE9SLCAnc3ltYm9sJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3ltYm9sLm9wYWNpdHkudmFsdWUsIDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZW5jb2RlLmdyYWRpZW50JywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlZmF1bHQgb3BhY2l0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSBlbmNvZGUuZ3JhZGllbnQoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwge30sIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9fVxuICAgICAgICB9KSwgQ09MT1IsICdncmFkaWVudCcpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdyYWRpZW50Lm9wYWNpdHkudmFsdWUsIDAuNyk7IC8vIGRlZmF1bHQgb3BhY2l0eSBpcyAwLjcuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlbmNvZGUubGFiZWxzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBleHByZXNzaW9uIGZvciB0aGUgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRIJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLCB0aW1lVW5pdDogXCJtb250aFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdhJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5NT05USH07XG4gICAgICBjb25zdCBsYWJlbCA9IGVuY29kZS5sYWJlbHMoZmllbGREZWYsIHt9LCBtb2RlbCwgQ09MT1IsICdncmFkaWVudCcpO1xuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBgdGltZUZvcm1hdChkYXR1bS52YWx1ZSwgJyViJylgO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbC50ZXh0LnNpZ25hbCwgZXhwZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBleHByZXNzaW9uIGZvciB0aGUgdGltZVVuaXQ6IFRpbWVVbml0LlFVQVJURVInLCBmdW5jdGlvbigpIHtcblxuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcInF1YXJ0ZXJcIn19XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdhJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5RVUFSVEVSfTtcbiAgICAgIGNvbnN0IGxhYmVsID0gZW5jb2RlLmxhYmVscyhmaWVsZERlZiwge30sIG1vZGVsLCBDT0xPUiwgJ2dyYWRpZW50Jyk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IGAnUScgKyBxdWFydGVyKGRhdHVtLnZhbHVlKWA7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsLnRleHQuc2lnbmFsLCBleHBlY3RlZCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=