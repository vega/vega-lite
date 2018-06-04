"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var aggregate_1 = require("../src/aggregate");
var fielddef_1 = require("../src/fielddef");
var log = tslib_1.__importStar(require("../src/log"));
var timeunit_1 = require("../src/timeunit");
var type_1 = require("../src/type");
describe('fieldDef', function () {
    describe('vgField()', function () {
        it('should access flattened fields', function () {
            chai_1.assert.deepEqual(fielddef_1.vgField({ field: 'foo.bar\\.baz' }), 'foo\\.bar\\.baz');
        });
        it('should access flattened fields in expression', function () {
            chai_1.assert.deepEqual(fielddef_1.vgField({ field: 'foo.bar\\.baz' }, { expr: 'datum' }), 'datum["foo.bar.baz"]');
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
            it('is incompatible with nominal field', function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZmllbGRkZWYudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFFNUIsOENBQThDO0FBRTlDLDRDQUFtSDtBQUNuSCxzREFBa0M7QUFDbEMsNENBQXlDO0FBQ3pDLG9DQUFtRDtBQUVuRCxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ25CLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFFLGdDQUFnQyxFQUFFO1lBQ3BDLGFBQU0sQ0FBQyxTQUFTLENBQUMsa0JBQU8sQ0FBQyxFQUFDLEtBQUssRUFBRSxlQUFlLEVBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDekUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUUsOENBQThDLEVBQUU7WUFDbEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLGVBQWUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBVyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFxQixFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLGFBQU0sQ0FBQyxLQUFLLENBQUMsc0JBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBcUIsRUFBRSxHQUFHLENBQUMsRUFBRSxj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Q29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Q09VTlRJTkdfT1BTfSBmcm9tICcuLi9zcmMvYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtjaGFubmVsQ29tcGF0aWJpbGl0eSwgQ2hhbm5lbERlZiwgZGVmYXVsdFR5cGUsIEZpZWxkRGVmLCBub3JtYWxpemUsIHRpdGxlLCB2Z0ZpZWxkfSBmcm9tICcuLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vc3JjL3RpbWV1bml0JztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vc3JjL3R5cGUnO1xuXG5kZXNjcmliZSgnZmllbGREZWYnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCd2Z0ZpZWxkKCknLCAoKSA9PiB7XG4gICAgaXQgKCdzaG91bGQgYWNjZXNzIGZsYXR0ZW5lZCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHZnRmllbGQoe2ZpZWxkOiAnZm9vLmJhclxcXFwuYmF6J30pLCAnZm9vXFxcXC5iYXJcXFxcLmJheicpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYWNjZXNzIGZsYXR0ZW5lZCBmaWVsZHMgaW4gZXhwcmVzc2lvbicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodmdGaWVsZCh7ZmllbGQ6ICdmb28uYmFyXFxcXC5iYXonfSwge2V4cHI6ICdkYXR1bSd9KSwgJ2RhdHVtW1wiZm9vLmJhci5iYXpcIl0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlZmF1bHRUeXBlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGVtcG9yYWwgaWYgdGhlcmUgaXMgdGltZVVuaXQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe3RpbWVVbml0OiAnbW9udGgnLCBmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+LCAneCcpLCAndGVtcG9yYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHF1YW50aXRhdGl2ZSBpZiB0aGVyZSBpcyBiaW4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe2JpbjogdHJ1ZSwgZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPiwgJ3gnKSwgJ3F1YW50aXRhdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gcXVhbnRpdGF0aXZlIGZvciBhIGNoYW5uZWwgdGhhdCBzdXBwb3J0cyBtZWFzdXJlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5JywgJ3NpemUnLCAnb3BhY2l0eScsICdvcmRlciddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFR5cGUoe2ZpZWxkOiAnYSd9IGFzIEZpZWxkRGVmPHN0cmluZz4sIGMpLCAncXVhbnRpdGF0aXZlJywgYyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub21pbmFsIGZvciBhIGNoYW5uZWwgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IG1lYXN1cmUnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWydjb2xvcicsICdzaGFwZScsICdyb3cnLCAnY29sdW1uJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChkZWZhdWx0VHlwZSh7ZmllbGQ6ICdhJ30gYXMgRmllbGREZWY8c3RyaW5nPiwgYyksICdub21pbmFsJywgYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdub3JtYWxpemUoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgcHJpbWl0aXZlIHR5cGUgdG8gdmFsdWUgZGVmJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKDUgYXMgYW55LCAneCcpLCB7dmFsdWU6IDV9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJucy5sZW5ndGgsIDEpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpZWxkRGVmIHdpdGggZnVsbCB0eXBlIG5hbWUuJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4gPSB7ZmllbGQ6ICdhJywgdHlwZTogJ3EnIGFzIGFueX07XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPENoYW5uZWxEZWY8c3RyaW5nPj4obm9ybWFsaXplKGZpZWxkRGVmLCAneCcpLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdub3JtYWxpemVzIHllYXJtb250aGRheSB0byBiZWNvbWUgeWVhcm1vbnRoZGF0ZS4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+ID0ge1xuICAgICAgICB0aW1lVW5pdDogJ3llYXJtb250aGRheScgYXMgVGltZVVuaXQsICAvLyBOZWVkIHRvIGNhc3QgaGVyZSBhcyB0aGlzIGlzIGludGVudGlvbmFsbHkgd3JvbmdcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgdHlwZTogJ3RlbXBvcmFsJ1xuICAgICAgfTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHt0aW1lVW5pdDogJ3llYXJtb250aGRhdGUnLCBmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRheVJlcGxhY2VkV2l0aERhdGUoJ3llYXJtb250aGRheScpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2Ugb3RoZXIgdHlwZSB3aXRoIHF1YW50aXRhdGl2ZSBmb3IgYSBmaWVsZCB3aXRoIGNvdW50aW5nIGFnZ3JlZ2F0ZS4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYWdncmVnYXRlIG9mIENPVU5USU5HX09QUykge1xuICAgICAgICBjb25zdCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiA9IHthZ2dyZWdhdGUsIGZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ307XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHthZ2dyZWdhdGUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnMubGVuZ3RoLCA0KTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmaWVsZERlZiB3aXRoIGRlZmF1bHQgdHlwZSBhbmQgdGhyb3cgd2FybmluZyBpZiB0eXBlIGlzIG1pc3NpbmcuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2EnfSBhcyBGaWVsZERlZjxzdHJpbmc+O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxDaGFubmVsRGVmPHN0cmluZz4+KG5vcm1hbGl6ZShmaWVsZERlZiwgJ3gnKSwge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKHVuZGVmaW5lZCwgJ3gnLCAncXVhbnRpdGF0aXZlJykpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBpbnZhbGlkIGFnZ3JlZ2F0ZSBvcHMgYW5kIHRocm93IHdhcm5pbmcuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiA9IHthZ2dyZWdhdGU6ICdib3gtcGxvdCcsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8Q2hhbm5lbERlZjxzdHJpbmc+Pihub3JtYWxpemUoZmllbGREZWYsICd4JyksIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5pbnZhbGlkQWdncmVnYXRlKCdib3gtcGxvdCcpKTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjaGFubmVsQ29tcGF0YWJpbGl0eScsICgpID0+IHtcbiAgICBkZXNjcmliZSgncm93L2NvbHVtbicsICgpID0+IHtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBjb250aW51b3VzIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydyb3cnLCAnY29sdW1uJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIGRpc2NyZXRlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydyb3cnLCAnY29sdW1uJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgneC95L2NvbG9yL3RleHQvZGV0YWlsJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBjb250aW51b3VzIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knLCAnY29sb3InLCAndGV4dCcsICdkZXRhaWwnXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBkaXNjcmV0ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5JywgJ2NvbG9yJywgJ3RleHQnLCAnZGV0YWlsJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCBjaGFubmVsKS5jb21wYXRpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3BhY2l0eS9zaXplL3gyL3kyJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBjb250aW51b3VzIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydvcGFjaXR5JywgJ3NpemUnLCAneDInLCAneTInXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIGJpbm5lZCBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsnb3BhY2l0eScsICdzaXplJywgJ3gyJywgJ3kyJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtiaW46IHRydWUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnaXMgaW5jb21wYXRpYmxlIHdpdGggbm9taW5hbCBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsnb3BhY2l0eScsICdzaXplJywgJ3gyJywgJ3kyJ10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSwgY2hhbm5lbCkuY29tcGF0aWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NoYXBlJywgKCkgPT4ge1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBub21pbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sICdzaGFwZScpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaXMgaW5jb21wYXRpYmxlIHdpdGggb3JkaW5hbCBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsQ29tcGF0aWJpbGl0eSh7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSwgJ3NoYXBlJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBxdWFudGl0YXRpdmUgZmllbGQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ3NoYXBlJykuY29tcGF0aWJsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcmRlcicsICgpID0+IHtcbiAgICAgIGl0KCdpcyBpbmNvbXBhdGlibGUgd2l0aCBub21pbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LCAnb3JkZXInKS5jb21wYXRpYmxlKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2lzIGNvbXBhdGlibGUgd2l0aCBvcmRpbmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQoY2hhbm5lbENvbXBhdGliaWxpdHkoe2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sICdvcmRlcicpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaXMgY29tcGF0aWJsZSB3aXRoIHF1YW50aXRhdGl2ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0KGNoYW5uZWxDb21wYXRpYmlsaXR5KHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sICdvcmRlcicpLmNvbXBhdGlibGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0aXRsZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIGFnZ3JlZ2F0ZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZSh7ZmllbGQ6ICdmJywgYWdncmVnYXRlOiAnbWVhbid9LCB7fSksICdNZWFuIG9mIGYnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIGNvdW50JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKHthZ2dyZWdhdGU6ICdjb3VudCd9LCB7Y291bnRUaXRsZTogJ2JheiEnfSksICdiYXohJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciBiaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBRVUFOVElUQVRJVkUsIGJpbjogdHJ1ZX07XG4gICAgICBhc3NlcnQuZXF1YWwodGl0bGUoZmllbGREZWYse30pLCAnZiAoYmlubmVkKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgYmluJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogUVVBTlRJVEFUSVZFLCBiaW46IHRydWV9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHtmaWVsZFRpdGxlOiAnZnVuY3Rpb25hbCd9KSwgJ0JJTihmKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBmb3IgdGltZVVuaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHtmaWVsZDogJ2YnLCB0eXBlOiBURU1QT1JBTCwgdGltZVVuaXQ6IFRpbWVVbml0Lk1PTlRIfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChtb250aCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHRpbWVVbml0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB7ZmllbGQ6ICdmJywgdHlwZTogVEVNUE9SQUwsIHRpbWVVbml0OiBUaW1lVW5pdC5ZRUFSTU9OVEhEQVRFfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmICh5ZWFyLW1vbnRoLWRhdGUpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuREFZfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmIChkYXkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciB0aW1lVW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMLCB0aW1lVW5pdDogVGltZVVuaXQuWUVBUlFVQVJURVJ9O1xuICAgICAgYXNzZXJ0LmVxdWFsKHRpdGxlKGZpZWxkRGVmLHt9KSwgJ2YgKHllYXItcXVhcnRlciknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGl0bGUgZm9yIHJhdyBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0ge2ZpZWxkOiAnZicsIHR5cGU6IFRFTVBPUkFMfTtcbiAgICAgIGFzc2VydC5lcXVhbCh0aXRsZShmaWVsZERlZix7fSksICdmJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=