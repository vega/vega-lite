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
            var fieldDef = { aggregate: 'boxplot', field: 'a', type: 'quantitative' };
            chai_1.assert.deepEqual(fielddef_1.normalize(fieldDef, 'x'), { field: 'a', type: 'quantitative' });
            chai_1.assert.equal(localLogger.warns[0], log.message.invalidAggregate('boxplot'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZmllbGRkZWYudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1Qiw4Q0FBOEM7QUFFOUMsNENBQW1IO0FBQ25ILGdDQUFrQztBQUNsQyw0Q0FBeUM7QUFDekMsb0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDbkIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUUsd0JBQXdCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLGVBQWUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBVyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFxQixFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLGFBQU0sQ0FBQyxLQUFLLENBQUMsc0JBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBcUIsRUFBRSxHQUFHLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM5RixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxLQUFnQixVQUFtRCxFQUFuRCxLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9B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LENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxJQUFNLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGVBQVEsRUFBRSxRQUFRLEVBQUUsbUJBQVEsQ0FBQyxHQUFHLEVBQUMsQ0FBQztZQUN0RSxhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLElBQU0sUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFFLFFBQVEsRUFBRSxtQkFBUSxDQUFDLFdBQVcsRUFBQyxDQUFDO1lBQzlFLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGVBQVEsRUFBQyxDQUFDO1lBQzlDLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0NPVU5USU5HX09QU30gZnJvbSAnLi4vc3JjL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0NoYW5uZWx9IGZyb20gJy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7Y2hhbm5lbENvbXBhdGliaWxpdHksIENoYW5uZWxEZWYsIGRlZmF1bHRUeXBlLCBGaWVsZERlZiwgbm9ybWFsaXplLCB0aXRsZSwgdmdGaWVsZH0gZnJvbSAnLi4vc3JjL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9zcmMvbG9nJztcbmltcG9ydCB7VGltZVVuaXR9IGZyb20gJy4uL3NyYy90aW1ldW5pdCc7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3NyYy90eXBlJztcblxuZGVzY3JpYmUoJ2ZpZWxkRGVmJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZmllbGQoKScsICgpID0+IHtcbiAgICBpdCAoJ3Nob3VsZCBjb25zdHJ1Y3QgcGF0aHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHZnRmllbGQoe2ZpZWxkOiAnZm9vLmJhclxcXFwuYmF6J30sIHtleHByOiAnZGF0dW0nfSksICdkYXR1bVtcImZvb1wiXVtcImJhci5iYXpcIl0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlZmF1bHRUeXBlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGVtcG9yYWwgaWYgdGhlcmUgaXMgdGltZVVuaXQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe3RpbWVVbml0OiAnbW9udGgnLCBmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+LCAneCcpLCAndGVtcG9yYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHF1YW50aXRhdGl2ZSBpZiB0aGVyZSBpcyBiaW4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe2JpbjogdHJ1ZSwgZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPiwgJ3gnKSwgJ3F1YW50aXRhdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gcXVhbnRpdGF0aXZlIGZvciBhIGNoYW5uZWwgdGhhdCBzdXBwb3J0cyBtZWFzdXJlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5JywgJ3NpemUnLCAnb3BhY2l0eScsICdvcmRlciddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe2ZpZWxkOiAnYSd9IGFzIEZpZWxkRGVmPHN0cmluZz4sIGMpLCAncXVhbnRpdGF0aXZlJywgYyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub21pbmFsIGZvciBhIGNoYW5uZWwgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IG1lYXN1cmUnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWydjb2xvcicsICdzaGFwZScsICdyb3cnLCAnY29sdW1uJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChkZWZhdWx0VHlwZSh7ZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPiwgYyksICdub21pbmFsJywgYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdub3JtYWxpemUoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgcHJpbWl0aXZlIHR5cGUgdG8gdmFsdWUgZGVmJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKDUgYXMgYW55LCAneCcpLCB7dmFsdWU6IDV9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJucy5sZW5ndGgsIDEpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpZWxkRGVmIHdpdGggZnVsbCB0eXBlIG5hbWUuJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4gPSB7ZmllbGQ6ICdhJywgdHlwZTogJ3EnIGFzIGFueX07XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKGZpZWxkRGVmLCAneCcpLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdub3JtYWxpemVzIHllYXJtb250aGRheSB0byBiZWNvbWUgeWVhcm1vbnRoZGF0ZS4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+ID0ge1xuICAgICAgICB0aW1lVW5pdDogJ3llYXJtb250aGRheScgYXMgVGltZVVuaXQsICAvLyBOZWVkIHRvIGNhc3QgaGVyZSBhcyB0aGlzIGlzIGludGVudGlvbmFsbHkgd3JvbmdcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgdHlwZTogJ3RlbXBvcmFsJ1xuICAgICAgfTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHt0aW1lVW5pdDogJ3llYXJtb250aGRhdGUnLCBmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRheVJlcGxhY2VkV2l0aERhdGUoJ3llYXJtb250aGRheScpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2Ugb3RoZXIgdHlwZSB3aXRoIHF1YW50aXRhdGl2ZSBmb3IgYSBmaWVsZCB3aXRoIGNvdW50aW5nIGFnZ3JlZ2F0ZS4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYWdncmVnYXRlIG9mIENPVU5USU5HX09QUykge1xuICAgICAgICBjb25zdCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiA9IHthZ2dyZWdhdGUsIGZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ307XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHthZ2dyZWdhdGUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnMubGVuZ3RoLCA0KTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmaWVsZERlZiB3aXRoIGRlZmF1bHQgdHlwZSBhbmQgdGhyb3cgd2FybmluZyBpZiB0eXBlIGlzIG1pc3NpbmcuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKHVuZGVmaW5lZCwgJ3gnLCAncXVhbnRpdGF0aXZlJykpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBpbnZhbGlkIGFnZ3JlZ2F0ZSBvcHMgYW5kIHRocm93IHdhcm5pbmcuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiA9IHthZ2dyZWdhdGU6ICdib3hwbG90JywgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmludmFsaWRBZ2dyZWdhdGUoJ2JveHBsb3QnKSk7XG4gICAgfSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hhbm5lbENvbXBhdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3Jvdy9jb2x1bW4nLCAoKSA9PiB7XG4gICAgICBpdCgnaXMgaW5jb21wYXRpYmxlIHdpdGggY29udGludW91cyBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsncm93JywgJ2NvbHVtbiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydCghY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBkaXNjcmV0ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsncm93JywgJ2NvbHVtbiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3gveS9jb2xvci90ZXh0L2RldGFpbCcsICgpID0+IHtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggY29udGludW91cyBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5JywgJ2NvbG9yJywgJ3RleHQnLCAnZGV0YWlsJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggZGlzY3JldGUgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneScsICdjb2xvcicsICd0ZXh0JywgJ2RldGFpbCddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29wYWNpdHkvc2l6ZS94Mi95MicsICgpID0+IHtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggY29udGludW91cyBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsnb3BhY2l0eScsICdzaXplJywgJ3gyJywgJ3kyJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBiaW5uZWQgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ29wYWNpdHknLCAnc2l6ZScsICd4MicsICd5MiddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7YmluOiB0cnVlLCBmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIGNoYW5uZWwpLmNvbXBhdGlibGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIGRpc2NyZXRlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydvcGFjaXR5JywgJ3NpemUnLCAneDInLCAneTInXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2hhcGUnLCAoKSA9PiB7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIG5vbWluYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgJ3NoYXBlJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBvcmRpbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9LCAnc2hhcGUnKS5jb21wYXRpYmxlKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIHF1YW50aXRhdGl2ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCAnc2hhcGUnKS5jb21wYXRpYmxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29yZGVyJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGluY29tcGF0aWJsZSB3aXRoIG5vbWluYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sICdvcmRlcicpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIG9yZGluYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydChjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSwgJ29yZGVyJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBjb21wYXRpYmxlIHdpdGggcXVhbnRpdGF0aXZlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ29yZGVyJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3RpdGxlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgYWdncmVnYXRlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKHtmaWVsZDogJ2YnLCBhZ2dyZWdhdGU6ICdtZWFuJ30sIHt9KSwgJ01lYW4gb2YgZicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgY291bnQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwodGl0bGUoe2FnZ3JlZ2F0ZTogJ2NvdW50J30sIHtjb3VudFRpdGxlOiAnYmF6ISd9KSwgJ2JheiEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIGJpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFFVQU5USVRBVElWRSwgYmluOiB0cnVlfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChiaW5uZWQpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciBiaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBRVUFOVElUQVRJVkUsIGJpbjogdHJ1ZX07XG4gICAgICBhc3NlcnQuZXF1YWwodGl0bGUoZmllbGREZWYse2ZpZWxkVGl0bGU6ICdmdW5jdGlvbmFsJ30pLCAnQklOKGYpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuTU9OVEh9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YgKG1vbnRoKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgdGltZVVuaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBURU1QT1JBTCwgdGltZVVuaXQ6IFRpbWVVbml0LllFQVJNT05USERBVEV9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YgKHllYXItbW9udGgtZGF0ZSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHRpbWVVbml0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5EQVl9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YgKGRheSknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHRpbWVVbml0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5ZRUFSUVVBUlRFUn07XG4gICAgICBhc3NlcnQuZXF1YWwodGl0bGUoZmllbGREZWYse30pLCAnZiAoeWVhci1xdWFydGVyKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgcmF3IGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogVEVNUE9SQUx9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==