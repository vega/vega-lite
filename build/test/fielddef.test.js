"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../src/aggregate");
var fielddef_1 = require("../src/fielddef");
var log = require("../src/log");
var timeunit_1 = require("../src/timeunit");
var type_1 = require("../src/type");
describe('fieldDef', function () {
    describe('field()', function () {
        it('should construct paths', function () {
            chai_1.assert.deepEqual(fielddef_1.vgField({ field: 'foo.bar\\.baz' }, { expr: 'datum' }), 'datum["foo"]["bar.baz"]');
        });
    });
    describe('defaultType()', function () {
        it('should return temporal if there is timeUnit', function () {
            chai_1.assert.equal(fielddef_1.defaultType({ timeUnit: 'month', field: 'a' }, 'x'), 'temporal');
        });
        it('should return quantitative if there is bin', function () {
            chai_1.assert.equal(fielddef_1.defaultType({ bin: true, field: 'a' }, 'x'), 'quantitative');
        });
        it('should return quantitative for a channel that supports measure', function () {
            for (var _i = 0, _a = ['x', 'y', 'size', 'opacity', 'order']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(fielddef_1.defaultType({ field: 'a' }, c), 'quantitative', c);
            }
        });
        it('should return nominal for a channel that does not support measure', function () {
            for (var _i = 0, _a = ['color', 'shape', 'row', 'column']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(fielddef_1.defaultType({ field: 'a' }, c), 'nominal', c);
            }
        });
    });
    describe('normalize()', function () {
        it('should convert primitive type to value def', log.wrap(function (localLogger) {
            chai_1.assert.deepEqual(fielddef_1.normalize(5, 'x'), { value: 5 });
            chai_1.assert.equal(localLogger.warns.length, 1);
        }));
        it('should return fieldDef with full type name.', function () {
            var fieldDef = { field: 'a', type: 'q' };
            chai_1.assert.deepEqual(fielddef_1.normalize(fieldDef, 'x'), { field: 'a', type: 'quantitative' });
        });
        it('normalizes yearmonthday to become yearmonthdate.', log.wrap(function (localLogger) {
            var fieldDef = {
                timeUnit: 'yearmonthday',
                field: 'a',
                type: 'temporal'
            };
            chai_1.assert.deepEqual(fielddef_1.normalize(fieldDef, 'x'), { timeUnit: 'yearmonthdate', field: 'a', type: 'temporal' });
            chai_1.assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
        }));
        it('should replace other type with quantitative for a field with counting aggregate.', log.wrap(function (localLogger) {
            for (var _i = 0, COUNTING_OPS_1 = aggregate_1.COUNTING_OPS; _i < COUNTING_OPS_1.length; _i++) {
                var aggregate = COUNTING_OPS_1[_i];
                var fieldDef = { aggregate: aggregate, field: 'a', type: 'nominal' };
                chai_1.assert.deepEqual(fielddef_1.normalize(fieldDef, 'x'), { aggregate: aggregate, field: 'a', type: 'quantitative' });
            }
            chai_1.assert.equal(localLogger.warns.length, 4);
        }));
        it('should return fieldDef with default type and throw warning if type is missing.', log.wrap(function (localLogger) {
            var fieldDef = { field: 'a' };
            chai_1.assert.deepEqual(fielddef_1.normalize(fieldDef, 'x'), { field: 'a', type: 'quantitative' });
            chai_1.assert.equal(localLogger.warns[0], log.message.emptyOrInvalidFieldType(undefined, 'x', 'quantitative'));
        }));
        it('should drop invalid aggregate ops and throw warning.', log.wrap(function (localLogger) {
            var fieldDef = { aggregate: 'box-plot', field: 'a', type: 'quantitative' };
            chai_1.assert.deepEqual(fielddef_1.normalize(fieldDef, 'x'), { field: 'a', type: 'quantitative' });
            chai_1.assert.equal(localLogger.warns[0], log.message.invalidAggregate('box-plot'));
        }));
    });
    describe('channelCompatability', function () {
        describe('row/column', function () {
            it('is incompatible with continuous field', function () {
                for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is compatible with discrete field', function () {
                for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                }
            });
        });
        describe('x/y/color/text/detail', function () {
            it('is compatible with continuous field', function () {
                for (var _i = 0, _a = ['x', 'y', 'color', 'text', 'detail']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is compatible with discrete field', function () {
                for (var _i = 0, _a = ['x', 'y', 'color', 'text', 'detail']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                }
            });
        });
        describe('opacity/size/x2/y2', function () {
            it('is compatible with continuous field', function () {
                for (var _i = 0, _a = ['opacity', 'size', 'x2', 'y2']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is compatible with binned field', function () {
                for (var _i = 0, _a = ['opacity', 'size', 'x2', 'y2']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(fielddef_1.channelCompatibility({ bin: true, field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is incompatible with discrete field', function () {
                for (var _i = 0, _a = ['opacity', 'size', 'x2', 'y2']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                }
            });
        });
        describe('shape', function () {
            it('is compatible with nominal field', function () {
                chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, 'shape').compatible);
            });
            it('is incompatible with ordinal field', function () {
                chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'ordinal' }, 'shape').compatible);
            });
            it('is incompatible with quantitative field', function () {
                chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, 'shape').compatible);
            });
        });
        describe('order', function () {
            it('is incompatible with nominal field', function () {
                chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, 'order').compatible);
            });
            it('is compatible with ordinal field', function () {
                chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'ordinal' }, 'order').compatible);
            });
            it('is compatible with quantitative field', function () {
                chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, 'order').compatible);
            });
        });
    });
    describe('title()', function () {
        it('should return correct title for aggregate', function () {
            chai_1.assert.equal(fielddef_1.title({ field: 'f', aggregate: 'mean' }, {}), 'Mean of f');
        });
        it('should return correct title for count', function () {
            chai_1.assert.equal(fielddef_1.title({ aggregate: 'count' }, { countTitle: 'baz!' }), 'baz!');
        });
        it('should return correct title for bin', function () {
            var fieldDef = { field: 'f', type: type_1.QUANTITATIVE, bin: true };
            chai_1.assert.equal(fielddef_1.title(fieldDef, {}), 'f (binned)');
        });
        it('should return correct title for bin', function () {
            var fieldDef = { field: 'f', type: type_1.QUANTITATIVE, bin: true };
            chai_1.assert.equal(fielddef_1.title(fieldDef, { fieldTitle: 'functional' }), 'BIN(f)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.MONTH };
            chai_1.assert.equal(fielddef_1.title(fieldDef, {}), 'f (month)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.YEARMONTHDATE };
            chai_1.assert.equal(fielddef_1.title(fieldDef, {}), 'f (year-month-date)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.DAY };
            chai_1.assert.equal(fielddef_1.title(fieldDef, {}), 'f (day)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.YEARQUARTER };
            chai_1.assert.equal(fielddef_1.title(fieldDef, {}), 'f (year-quarter)');
        });
        it('should return correct title for raw field', function () {
            var fieldDef = { field: 'f', type: type_1.TEMPORAL };
            chai_1.assert.equal(fielddef_1.title(fieldDef, {}), 'f');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZmllbGRkZWYudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1Qiw4Q0FBOEM7QUFFOUMsNENBQW1IO0FBQ25ILGdDQUFrQztBQUNsQyw0Q0FBeUM7QUFDekMsb0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDbkIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUUsd0JBQXdCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLGVBQWUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBVyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFxQixFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLGFBQU0sQ0FBQyxLQUFLLENBQUMsc0JBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBcUIsRUFBRSxHQUFHLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM5RixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxHQUFHLENBQUMsQ0FBWSxVQUFtRCxFQUFuRCxLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FB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QUFDLENBQUM7WUFDaEYsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLElBQU0sUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFFLFFBQVEsRUFBRSxtQkFBUSxDQUFDLEdBQUcsRUFBQyxDQUFDO1lBQ3RFLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBTSxRQUFRLEdBQUcsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFRLEVBQUUsUUFBUSxFQUFFLG1CQUFRLENBQUMsV0FBVyxFQUFDLENBQUM7WUFDOUUsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLElBQU0sUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFDLENBQUM7WUFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Q09VTlRJTkdfT1BTfSBmcm9tICcuLi9zcmMvYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtjaGFubmVsQ29tcGF0aWJpbGl0eSwgQ2hhbm5lbERlZiwgZGVmYXVsdFR5cGUsIEZpZWxkRGVmLCBub3JtYWxpemUsIHRpdGxlLCB2Z0ZpZWxkfSBmcm9tICcuLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vc3JjL3RpbWV1bml0JztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vc3JjL3R5cGUnO1xuXG5kZXNjcmliZSgnZmllbGREZWYnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdmaWVsZCgpJywgKCkgPT4ge1xuICAgIGl0ICgnc2hvdWxkIGNvbnN0cnVjdCBwYXRocycsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodmdGaWVsZCh7ZmllbGQ6ICdmb28uYmFyXFxcXC5iYXonfSwge2V4cHI6ICdkYXR1bSd9KSwgJ2RhdHVtW1wiZm9vXCJdW1wiYmFyLmJhelwiXScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGVmYXVsdFR5cGUoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0ZW1wb3JhbCBpZiB0aGVyZSBpcyB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChkZWZhdWx0VHlwZSh7dGltZVVuaXQ6ICdtb250aCcsIGZpZWxkOiAnYSd9IGFzIEZpZWxkRGVmPHN0cmluZz4sICd4JyksICd0ZW1wb3JhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gcXVhbnRpdGF0aXZlIGlmIHRoZXJlIGlzIGJpbicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChkZWZhdWx0VHlwZSh7YmluOiB0cnVlLCBmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+LCAneCcpLCAncXVhbnRpdGF0aXZlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBxdWFudGl0YXRpdmUgZm9yIGEgY2hhbm5lbCB0aGF0IHN1cHBvcnRzIG1lYXN1cmUnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knLCAnc2l6ZScsICdvcGFjaXR5JywgJ29yZGVyJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChkZWZhdWx0VHlwZSh7ZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPiwgYyksICdxdWFudGl0YXRpdmUnLCBjKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vbWluYWwgZm9yIGEgY2hhbm5lbCB0aGF0IGRvZXMgbm90IHN1cHBvcnQgbWVhc3VyZScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ2NvbG9yJywgJ3NoYXBlJywgJ3JvdycsICdjb2x1bW4nXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRUeXBlKHtmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+LCBjKSwgJ25vbWluYWwnLCBjKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vcm1hbGl6ZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29udmVydCBwcmltaXRpdmUgdHlwZSB0byB2YWx1ZSBkZWYnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoNSBhcyBhbnksICd4JyksIHt2YWx1ZTogNX0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zLmxlbmd0aCwgMSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmllbGREZWYgd2l0aCBmdWxsIHR5cGUgbmFtZS4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiA9IHtmaWVsZDogJ2EnLCB0eXBlOiAncScgYXMgYW55fTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ25vcm1hbGl6ZXMgeWVhcm1vbnRoZGF5IHRvIGJlY29tZSB5ZWFybW9udGhkYXRlLicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4gPSB7XG4gICAgICAgIHRpbWVVbml0OiAneWVhcm1vbnRoZGF5JyBhcyBUaW1lVW5pdCwgIC8vIE5lZWQgdG8gY2FzdCBoZXJlIGFzIHRoaXMgaXMgaW50ZW50aW9uYWxseSB3cm9uZ1xuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICB0eXBlOiAndGVtcG9yYWwnXG4gICAgICB9O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge3RpbWVVbml0OiAneWVhcm1vbnRoZGF0ZScsIGZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZGF5UmVwbGFjZWRXaXRoRGF0ZSgneWVhcm1vbnRoZGF5JykpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmVwbGFjZSBvdGhlciB0eXBlIHdpdGggcXVhbnRpdGF0aXZlIGZvciBhIGZpZWxkIHdpdGggY291bnRpbmcgYWdncmVnYXRlLicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgZm9yIChjb25zdCBhZ2dyZWdhdGUgb2YgQ09VTlRJTkdfT1BTKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+ID0ge2FnZ3JlZ2F0ZSwgZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge2FnZ3JlZ2F0ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICAgIH1cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJucy5sZW5ndGgsIDQpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpZWxkRGVmIHdpdGggZGVmYXVsdCB0eXBlIGFuZCB0aHJvdyB3YXJuaW5nIGlmIHR5cGUgaXMgbWlzc2luZy4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnYSd9IGFzIEZpZWxkRGVmPHN0cmluZz47XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKGZpZWxkRGVmLCAneCcpLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZW1wdHlPckludmFsaWRGaWVsZFR5cGUodW5kZWZpbmVkLCAneCcsICdxdWFudGl0YXRpdmUnKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGludmFsaWQgYWdncmVnYXRlIG9wcyBhbmQgdGhyb3cgd2FybmluZy4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+ID0ge2FnZ3JlZ2F0ZTogJ2JveC1wbG90JywgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmludmFsaWRBZ2dyZWdhdGUoJ2JveC1wbG90JykpO1xuICAgIH0pKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NoYW5uZWxDb21wYXRhYmlsaXR5JywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdyb3cvY29sdW1uJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIGNvbnRpbnVvdXMgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3JvdycsICdjb2x1bW4nXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggZGlzY3JldGUgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3JvdycsICdjb2x1bW4nXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd4L3kvY29sb3IvdGV4dC9kZXRhaWwnLCAoKSA9PiB7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIGNvbnRpbnVvdXMgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneScsICdjb2xvcicsICd0ZXh0JywgJ2RldGFpbCddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIGRpc2NyZXRlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knLCAnY29sb3InLCAndGV4dCcsICdkZXRhaWwnXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcGFjaXR5L3NpemUveDIveTInLCAoKSA9PiB7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIGNvbnRpbnVvdXMgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ29wYWNpdHknLCAnc2l6ZScsICd4MicsICd5MiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggYmlubmVkIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydvcGFjaXR5JywgJ3NpemUnLCAneDInLCAneTInXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2JpbjogdHJ1ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBkaXNjcmV0ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsnb3BhY2l0eScsICdzaXplJywgJ3gyJywgJ3kyJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NoYXBlJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBub21pbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sICdzaGFwZScpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaXMgaW5jb21wYXRpYmxlIHdpdGggb3JkaW5hbCBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSwgJ3NoYXBlJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBxdWFudGl0YXRpdmUgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ3NoYXBlJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcmRlcicsICgpID0+IHtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBub21pbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCAnb3JkZXInKS5jb21wYXRpYmxlKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBvcmRpbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sICdvcmRlcicpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIHF1YW50aXRhdGl2ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sICdvcmRlcicpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0aXRsZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIGFnZ3JlZ2F0ZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZSh7ZmllbGQ6ICdmJywgYWdncmVnYXRlOiAnbWVhbid9LCB7fSksICdNZWFuIG9mIGYnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIGNvdW50JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKHthZ2dyZWdhdGU6ICdjb3VudCd9LCB7Y291bnRUaXRsZTogJ2JheiEnfSksICdiYXohJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciBiaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBRVUFOVElUQVRJVkUsIGJpbjogdHJ1ZX07XG4gICAgICBhc3NlcnQuZXF1YWwodGl0bGUoZmllbGREZWYse30pLCAnZiAoYmlubmVkKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgYmluJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogUVVBTlRJVEFUSVZFLCBiaW46IHRydWV9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHtmaWVsZFRpdGxlOiAnZnVuY3Rpb25hbCd9KSwgJ0JJTihmKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgdGltZVVuaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBURU1QT1JBTCwgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRIfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChtb250aCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHRpbWVVbml0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5ZRUFSTU9OVEhEQVRFfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmICh5ZWFyLW1vbnRoLWRhdGUpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuREFZfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChkYXkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuWUVBUlFVQVJURVJ9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YgKHllYXItcXVhcnRlciknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHJhdyBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=