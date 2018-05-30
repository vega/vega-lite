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
            chai_1.assert.deepEqual(symbol.fill, { value: 'transparent' });
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
            chai_1.assert.deepEqual(symbol.shape['value'], 'square');
        });
        it('should have default opacity', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" }
                }
            }), channel_1.COLOR, 'symbol');
            chai_1.assert.deepEqual(symbol.opacity['value'], 0.7); // default opacity is 0.7.
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
            chai_1.assert.deepEqual(symbol.opacity['value'], 1);
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
            chai_1.assert.deepEqual(gradient.opacity['value'], 0.7); // default opacity is 0.7.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGVnZW5kL2VuY29kZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBMkM7QUFDM0MsMkRBQTZEO0FBQzdELGtEQUErQztBQUMvQywwQ0FBMkM7QUFDM0MsbUNBQW1EO0FBRW5ELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBRTFELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsOEJBQXVCLENBQUM7Z0JBQ3JGLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7b0JBQ2hDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDckM7YUFDRixDQUFDLEVBQUUsZUFBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JCLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1lBQ3RELGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLElBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sSUFBRSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtFQUFr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bUJBQVEsQ0FBQyxPQUFPLEVBQUMsQ0FBQztZQUMxRSxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNwRSxJQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQztZQUM5QyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NPTE9SfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZSc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi8uLi8uLi9zcmMvdGltZXVuaXQnO1xuaW1wb3J0IHtURU1QT1JBTH0gZnJvbSAnLi4vLi4vLi4vc3JjL3R5cGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xlZ2VuZCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnZW5jb2RlLnN5bWJvbHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIGZpbGwsIHN0cm9rZURhc2gsIG9yIHN0cm9rZURhc2hPZmZzZXQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgY29uc3Qgc3ltYm9sID0gZW5jb2RlLnN5bWJvbHMoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sIHt9LCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KSwgQ09MT1IsICdzeW1ib2wnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzeW1ib2wuZmlsbCwge3ZhbHVlOiAndHJhbnNwYXJlbnQnfSk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZCgoc3ltYm9sfHx7fSkuc3Ryb2tlRGFzaCk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZCgoc3ltYm9sfHx7fSkuc3Ryb2tlRGFzaE9mZnNldCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBzcGVjaWZpYyBzeW1ib2xzLnNoYXBlLnZhbHVlIGlmIHVzZXIgaGFzIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBjb25zdCBzeW1ib2wgPSBlbmNvZGUuc3ltYm9scyh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwge30sIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIHNoYXBlOiB7dmFsdWU6IFwic3F1YXJlXCJ9fVxuICAgICAgICB9KSwgQ09MT1IsICdzeW1ib2wnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzeW1ib2wuc2hhcGVbJ3ZhbHVlJ10sICdzcXVhcmUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZhdWx0IG9wYWNpdHknLCBmdW5jdGlvbigpIHtcblxuICAgICAgY29uc3Qgc3ltYm9sID0gZW5jb2RlLnN5bWJvbHMoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sIHt9LCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn19XG4gICAgICAgIH0pLCBDT0xPUiwgJ3N5bWJvbCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzeW1ib2wub3BhY2l0eVsndmFsdWUnXSwgMC43KTsgLy8gZGVmYXVsdCBvcGFjaXR5IGlzIDAuNy5cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBtYXhpbXVtIHZhbHVlIHdoZW4gdGhlcmUgaXMgYSBjb25kaXRpb24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgY29uc3Qgc3ltYm9sID0gZW5jb2RlLnN5bWJvbHMoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sIHt9LCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgIGNvbmRpdGlvbjoge3NlbGVjdGlvbjogXCJicnVzaFwiLCB2YWx1ZTogMX0sXG4gICAgICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgICB9fVxuICAgICAgICB9KSwgQ09MT1IsICdzeW1ib2wnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzeW1ib2wub3BhY2l0eVsndmFsdWUnXSwgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlbmNvZGUuZ3JhZGllbnQnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmYXVsdCBvcGFjaXR5JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBncmFkaWVudCA9IGVuY29kZS5ncmFkaWVudCh7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCB7fSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn19XG4gICAgICAgIH0pLCBDT0xPUiwgJ2dyYWRpZW50Jyk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ3JhZGllbnQub3BhY2l0eVsndmFsdWUnXSwgMC43KTsgLy8gZGVmYXVsdCBvcGFjaXR5IGlzIDAuNy5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2VuY29kZS5sYWJlbHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIHRoZSB0aW1lVW5pdDogVGltZVVuaXQuTU9OVEgnLCBmdW5jdGlvbigpIHtcblxuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcIm1vbnRoXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2EnLCB0eXBlOiBURU1QT1JBTCwgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRIfTtcbiAgICAgIGNvbnN0IGxhYmVsID0gZW5jb2RlLmxhYmVscyhmaWVsZERlZiwge30sIG1vZGVsLCBDT0xPUiwgJ2dyYWRpZW50Jyk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IGB0aW1lRm9ybWF0KGRhdHVtLnZhbHVlLCAnJWInKWA7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsLnRleHQuc2lnbmFsLCBleHBlY3RlZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGV4cHJlc3Npb24gZm9yIHRoZSB0aW1lVW5pdDogVGltZVVuaXQuUVVBUlRFUicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwidGVtcG9yYWxcIiwgdGltZVVuaXQ6IFwicXVhcnRlclwifX1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2EnLCB0eXBlOiBURU1QT1JBTCwgdGltZVVuaXQ6IFRpbWVVbml0LlFVQVJURVJ9O1xuICAgICAgY29uc3QgbGFiZWwgPSBlbmNvZGUubGFiZWxzKGZpZWxkRGVmLCB7fSwgbW9kZWwsIENPTE9SLCAnZ3JhZGllbnQnKTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gYCdRJyArIHF1YXJ0ZXIoZGF0dW0udmFsdWUpYDtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWwudGV4dC5zaWduYWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==