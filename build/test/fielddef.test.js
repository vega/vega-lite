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
            chai_1.assert.equal(fielddef_1.title({ field: 'f', type: type_1.QUANTITATIVE, aggregate: 'mean' }, {}), 'Mean of f');
        });
        it('should return correct title for count', function () {
            chai_1.assert.equal(fielddef_1.title({ field: '*', type: type_1.QUANTITATIVE, aggregate: 'count' }, { countTitle: 'baz!' }), 'baz!');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZmllbGRkZWYudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1Qiw4Q0FBOEM7QUFFOUMsNENBQW1IO0FBQ25ILGdDQUFrQztBQUNsQyw0Q0FBeUM7QUFDekMsb0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDbkIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUUsd0JBQXdCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLGVBQWUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBVyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFxQixFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLGFBQU0sQ0FBQyxLQUFLLENBQUMsc0JBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBcUIsRUFBRSxHQUFHLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM5RixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxHQUFHLENBQUMsQ0FBWSxVQUFtRCxFQUFuRCxLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FB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cm9tICdjaGFpJztcblxuaW1wb3J0IHtDT1VOVElOR19PUFN9IGZyb20gJy4uL3NyYy9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtDaGFubmVsfSBmcm9tICcuLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2NoYW5uZWxDb21wYXRpYmlsaXR5LCBDaGFubmVsRGVmLCBkZWZhdWx0VHlwZSwgRmllbGREZWYsIG5vcm1hbGl6ZSwgdGl0bGUsIHZnRmllbGR9IGZyb20gJy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vc3JjL2xvZyc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi9zcmMvdGltZXVuaXQnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuLi9zcmMvdHlwZSc7XG5cbmRlc2NyaWJlKCdmaWVsZERlZicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2ZpZWxkKCknLCAoKSA9PiB7XG4gICAgaXQgKCdzaG91bGQgY29uc3RydWN0IHBhdGhzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh2Z0ZpZWxkKHtmaWVsZDogJ2Zvby5iYXJcXFxcLmJheid9LCB7ZXhwcjogJ2RhdHVtJ30pLCAnZGF0dW1bXCJmb29cIl1bXCJiYXIuYmF6XCJdJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZWZhdWx0VHlwZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRlbXBvcmFsIGlmIHRoZXJlIGlzIHRpbWVVbml0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRUeXBlKHt0aW1lVW5pdDogJ21vbnRoJywgZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPiwgJ3gnKSwgJ3RlbXBvcmFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBxdWFudGl0YXRpdmUgaWYgdGhlcmUgaXMgYmluJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRUeXBlKHtiaW46IHRydWUsIGZpZWxkOiAnYSd9IGFzIEZpZWxkRGVmPHN0cmluZz4sICd4JyksICdxdWFudGl0YXRpdmUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHF1YW50aXRhdGl2ZSBmb3IgYSBjaGFubmVsIHRoYXQgc3VwcG9ydHMgbWVhc3VyZScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneScsICdzaXplJywgJ29wYWNpdHknLCAnb3JkZXInXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRUeXBlKHtmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+LCBjKSwgJ3F1YW50aXRhdGl2ZScsIGMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm9taW5hbCBmb3IgYSBjaGFubmVsIHRoYXQgZG9lcyBub3Qgc3VwcG9ydCBtZWFzdXJlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsnY29sb3InLCAnc2hhcGUnLCAncm93JywgJ2NvbHVtbiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe2ZpZWxkOiAnYSd9IGFzIEZpZWxkRGVmPHN0cmluZz4sIGMpLCAnbm9taW5hbCcsIGMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbm9ybWFsaXplKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHByaW1pdGl2ZSB0eXBlIHRvIHZhbHVlIGRlZicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZSg1IGFzIGFueSwgJ3gnKSwge3ZhbHVlOiA1fSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnMubGVuZ3RoLCAxKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmaWVsZERlZiB3aXRoIGZ1bGwgdHlwZSBuYW1lLicsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+ID0ge2ZpZWxkOiAnYScsIHR5cGU6ICdxJyBhcyBhbnl9O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbm9ybWFsaXplcyB5ZWFybW9udGhkYXkgdG8gYmVjb21lIHllYXJtb250aGRhdGUuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiA9IHtcbiAgICAgICAgdGltZVVuaXQ6ICd5ZWFybW9udGhkYXknIGFzIFRpbWVVbml0LCAgLy8gTmVlZCB0byBjYXN0IGhlcmUgYXMgdGhpcyBpcyBpbnRlbnRpb25hbGx5IHdyb25nXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHR5cGU6ICd0ZW1wb3JhbCdcbiAgICAgIH07XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKGZpZWxkRGVmLCAneCcpLCB7dGltZVVuaXQ6ICd5ZWFybW9udGhkYXRlJywgZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kYXlSZXBsYWNlZFdpdGhEYXRlKCd5ZWFybW9udGhkYXknKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIG90aGVyIHR5cGUgd2l0aCBxdWFudGl0YXRpdmUgZm9yIGEgZmllbGQgd2l0aCBjb3VudGluZyBhZ2dyZWdhdGUuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGFnZ3JlZ2F0ZSBvZiBDT1VOVElOR19PUFMpIHtcbiAgICAgICAgY29uc3QgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4gPSB7YWdncmVnYXRlLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9O1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKGZpZWxkRGVmLCAneCcpLCB7YWdncmVnYXRlLCBmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30pO1xuICAgICAgfVxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zLmxlbmd0aCwgNCk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmllbGREZWYgd2l0aCBkZWZhdWx0IHR5cGUgYW5kIHRocm93IHdhcm5pbmcgaWYgdHlwZSBpcyBtaXNzaW5nLicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPjtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5lbXB0eU9ySW52YWxpZEZpZWxkVHlwZSh1bmRlZmluZWQsICd4JywgJ3F1YW50aXRhdGl2ZScpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgaW52YWxpZCBhZ2dyZWdhdGUgb3BzIGFuZCB0aHJvdyB3YXJuaW5nLicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4gPSB7YWdncmVnYXRlOiAnYm94LXBsb3QnLCBmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ307XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKGZpZWxkRGVmLCAneCcpLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuaW52YWxpZEFnZ3JlZ2F0ZSgnYm94LXBsb3QnKSk7XG4gICAgfSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hhbm5lbENvbXBhdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3Jvdy9jb2x1bW4nLCAoKSA9PiB7XG4gICAgICBpdCgnaXMgaW5jb21wYXRpYmxlIHdpdGggY29udGludW91cyBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsncm93JywgJ2NvbHVtbiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydCghY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBkaXNjcmV0ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsncm93JywgJ2NvbHVtbiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3gveS9jb2xvci90ZXh0L2RldGFpbCcsICgpID0+IHtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggY29udGludW91cyBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5JywgJ2NvbG9yJywgJ3RleHQnLCAnZGV0YWlsJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggZGlzY3JldGUgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneScsICdjb2xvcicsICd0ZXh0JywgJ2RldGFpbCddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29wYWNpdHkvc2l6ZS94Mi95MicsICgpID0+IHtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggY29udGludW91cyBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsnb3BhY2l0eScsICdzaXplJywgJ3gyJywgJ3kyJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBiaW5uZWQgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ29wYWNpdHknLCAnc2l6ZScsICd4MicsICd5MiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7YmluOiB0cnVlLCBmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIGRpc2NyZXRlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydvcGFjaXR5JywgJ3NpemUnLCAneDInLCAneTInXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2hhcGUnLCAoKSA9PiB7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIG5vbWluYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgJ3NoYXBlJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBvcmRpbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9LCAnc2hhcGUnKS5jb21wYXRpYmxlKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIHF1YW50aXRhdGl2ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCAnc2hhcGUnKS5jb21wYXRpYmxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29yZGVyJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIG5vbWluYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sICdvcmRlcicpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIG9yZGluYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSwgJ29yZGVyJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggcXVhbnRpdGF0aXZlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ29yZGVyJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3RpdGxlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgYWdncmVnYXRlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKHtmaWVsZDogJ2YnLCB0eXBlOiBRVUFOVElUQVRJVkUsIGFnZ3JlZ2F0ZTogJ21lYW4nfSwge30pLCAnTWVhbiBvZiBmJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciBjb3VudCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZSh7ZmllbGQ6ICcqJywgdHlwZTogUVVBTlRJVEFUSVZFLCBhZ2dyZWdhdGU6ICdjb3VudCd9LCB7Y291bnRUaXRsZTogJ2JheiEnfSksICdiYXohJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciBiaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBRVUFOVElUQVRJVkUsIGJpbjogdHJ1ZX07XG4gICAgICBhc3NlcnQuZXF1YWwodGl0bGUoZmllbGREZWYse30pLCAnZiAoYmlubmVkKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgYmluJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogUVVBTlRJVEFUSVZFLCBiaW46IHRydWV9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHtmaWVsZFRpdGxlOiAnZnVuY3Rpb25hbCd9KSwgJ0JJTihmKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgdGltZVVuaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBURU1QT1JBTCwgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRIfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChtb250aCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHRpbWVVbml0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5ZRUFSTU9OVEhEQVRFfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmICh5ZWFyLW1vbnRoLWRhdGUpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuREFZfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChkYXkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuWUVBUlFVQVJURVJ9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YgKHllYXItcXVhcnRlciknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHJhdyBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=