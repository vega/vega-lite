"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../src/aggregate");
var fielddef_1 = require("../src/fielddef");
var log = require("../src/log");
var timeunit_1 = require("../src/timeunit");
var type_1 = require("../src/type");
describe('fieldDef', function () {
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
                ['row', 'column'].forEach(function (channel) {
                    chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                });
            });
            it('is compatible with discrete field', function () {
                ['row', 'column'].forEach(function (channel) {
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                });
            });
        });
        describe('x/y/color/text/detail', function () {
            it('is compatible with continuous field', function () {
                ['x', 'y', 'color', 'text', 'detail'].forEach(function (channel) {
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                });
            });
            it('is compatible with discrete field', function () {
                ['x', 'y', 'color', 'text', 'detail'].forEach(function (channel) {
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                });
            });
        });
        describe('opacity/size/x2/y2', function () {
            it('is compatible with continuous field', function () {
                ['opacity', 'size', 'x2', 'y2'].forEach(function (channel) {
                    chai_1.assert(fielddef_1.channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                });
            });
            it('is compatible with binned field', function () {
                ['opacity', 'size', 'x2', 'y2'].forEach(function (channel) {
                    chai_1.assert(fielddef_1.channelCompatibility({ bin: true, field: 'a', type: 'quantitative' }, channel).compatible);
                });
            });
            it('is incompatible with discrete field', function () {
                ['opacity', 'size', 'x2', 'y2'].forEach(function (channel) {
                    chai_1.assert(!fielddef_1.channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZmllbGRkZWYudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1Qiw4Q0FBOEM7QUFFOUMsNENBQTBHO0FBQzFHLGdDQUFrQztBQUNsQyw0Q0FBeUM7QUFDekMsb0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDbkIsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBVyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFxQixFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLGFBQU0sQ0FBQyxLQUFLLENBQUMsc0JBQVcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBcUIsRUFBRSxHQUFHLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM5RixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxHQUFHLENBQUMsQ0FBWSxVQUFtRCxFQUFuRCxLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYyxFQUFuRCxjQUFtRCxFQUFuRCxJQUFtRDtnQkFBOUQsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbkY7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxt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