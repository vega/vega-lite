"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var encode = require("../../../src/compile/axis/encode");
var encode_1 = require("../../../src/compile/axis/encode");
var util_1 = require("../../util");
describe('compile/axis', function () {
    describe('encode.labels()', function () {
        it('should not rotate label for temporal field by default', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            chai_1.assert.isUndefined(labels.angle);
        });
        it('should do not rotate label for temporal field if labelAngle is specified in axis config', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                },
                config: { axisX: { labelAngle: 90 } }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            chai_1.assert.isUndefined(labels.angle);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "yearquartermonth" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            chai_1.assert.equal(labels.text.signal, expected);
        });
    });
    describe('labelAlign', function () {
        it('is left for bottom axis with positive angle', function () {
            chai_1.assert.equal(encode_1.labelAlign(90, 'bottom'), 'left');
            chai_1.assert.equal(encode_1.labelAlign(45, 'bottom'), 'left');
        });
        it('is right for bottom axis with negative angle', function () {
            chai_1.assert.equal(encode_1.labelAlign(-90, 'bottom'), 'right');
            chai_1.assert.equal(encode_1.labelAlign(-45, 'bottom'), 'right');
        });
        it('is left for top axis with positive angle', function () {
            chai_1.assert.equal(encode_1.labelAlign(90, 'top'), 'right');
            chai_1.assert.equal(encode_1.labelAlign(45, 'top'), 'right');
        });
        it('is left for top axis with negative angle', function () {
            chai_1.assert.equal(encode_1.labelAlign(-90, 'top'), 'left');
            chai_1.assert.equal(encode_1.labelAlign(-45, 'top'), 'left');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvYXhpcy9lbmNvZGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIseURBQTJEO0FBQzNELDJEQUE0RDtBQUM1RCxtQ0FBbUQ7QUFHbkQsUUFBUSxDQUFDLGNBQWMsRUFBRTtJQUN2QixRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JEO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN2RCxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5RkFBeUYsRUFBRTtZQUM1RixJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDtnQkFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxVQUFVLEVBQUUsRUFBRSxFQUFDLEVBQUM7YUFDbEMsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxNQUFNLEdBQUcsTUFB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LENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9lbmNvZGUnO1xuaW1wb3J0IHtsYWJlbEFsaWdufSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2VuY29kZSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuXG5kZXNjcmliZSgnY29tcGlsZS9heGlzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZW5jb2RlLmxhYmVscygpJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgbm90IHJvdGF0ZSBsYWJlbCBmb3IgdGVtcG9yYWwgZmllbGQgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcIm1vbnRoXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbGFiZWxzID0gZW5jb2RlLmxhYmVscyhtb2RlbCwgJ3gnLCB7fSwgJ2JvdHRvbScpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGxhYmVscy5hbmdsZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRvIG5vdCByb3RhdGUgbGFiZWwgZm9yIHRlbXBvcmFsIGZpZWxkIGlmIGxhYmVsQW5nbGUgaXMgc3BlY2lmaWVkIGluIGF4aXMgY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwidGVtcG9yYWxcIiwgdGltZVVuaXQ6IFwibW9udGhcIn1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7YXhpc1g6IHtsYWJlbEFuZ2xlOiA5MH19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGxhYmVscyA9IGVuY29kZS5sYWJlbHMobW9kZWwsICd4Jywge30sICdib3R0b20nKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChsYWJlbHMuYW5nbGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdGV4dC5zaWduYWwgZm9yIHF1YXJ0ZXIgdGltZVVuaXRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcInF1YXJ0ZXJcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBsYWJlbHMgPSBlbmNvZGUubGFiZWxzKG1vZGVsLCAneCcsIHt9LCAnYm90dG9tJyk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiJ1EnICsgcXVhcnRlcihkYXR1bS52YWx1ZSlcIjtcbiAgICAgIGFzc2VydC5lcXVhbChsYWJlbHMudGV4dC5zaWduYWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHRleHQuc2lnbmFsIGZvciB5ZWFycXVhcnRlcm1vbnRoIHRpbWVVbml0cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLCB0aW1lVW5pdDogXCJ5ZWFycXVhcnRlcm1vbnRoXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbGFiZWxzID0gZW5jb2RlLmxhYmVscyhtb2RlbCwgJ3gnLCB7fSwgJ2JvdHRvbScpO1xuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBcIidRJyArIHF1YXJ0ZXIoZGF0dW0udmFsdWUpICsgJyAnICsgdGltZUZvcm1hdChkYXR1bS52YWx1ZSwgJyViICVZJylcIjtcbiAgICAgIGFzc2VydC5lcXVhbChsYWJlbHMudGV4dC5zaWduYWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xhYmVsQWxpZ24nLCAoKSA9PiB7XG4gICAgaXQoJ2lzIGxlZnQgZm9yIGJvdHRvbSBheGlzIHdpdGggcG9zaXRpdmUgYW5nbGUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbig5MCwgJ2JvdHRvbScpLCAnbGVmdCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oNDUsICdib3R0b20nKSwgJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdpcyByaWdodCBmb3IgYm90dG9tIGF4aXMgd2l0aCBuZWdhdGl2ZSBhbmdsZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKC05MCwgJ2JvdHRvbScpLCAncmlnaHQnKTtcbiAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKC00NSwgJ2JvdHRvbScpLCAncmlnaHQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdpcyBsZWZ0IGZvciB0b3AgYXhpcyB3aXRoIHBvc2l0aXZlIGFuZ2xlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oOTAsICd0b3AnKSwgJ3JpZ2h0Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbig0NSwgJ3RvcCcpLCAncmlnaHQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdpcyBsZWZ0IGZvciB0b3AgYXhpcyB3aXRoIG5lZ2F0aXZlIGFuZ2xlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oLTkwLCAndG9wJyksICdsZWZ0Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigtNDUsICd0b3AnKSwgJ2xlZnQnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==