import { assert } from 'chai';
import { COUNTING_OPS } from '../src/aggregate';
import { CHANNELS } from '../src/channel';
import { channelCompatibility, defaultTitle, defaultType, normalize, vgField } from '../src/fielddef';
import * as log from '../src/log';
import { TimeUnit } from '../src/timeunit';
import { QUANTITATIVE, TEMPORAL } from '../src/type';
describe('fieldDef', function () {
    describe('vgField()', function () {
        it('should access flattened fields', function () {
            assert.deepEqual(vgField({ field: 'foo.bar\\.baz' }), 'foo\\.bar\\.baz');
        });
        it('should access flattened fields in expression', function () {
            assert.deepEqual(vgField({ field: 'foo.bar\\.baz' }, { expr: 'datum' }), 'datum["foo.bar.baz"]');
        });
    });
    describe('defaultType()', function () {
        it('should return temporal if there is timeUnit', function () {
            assert.equal(defaultType({ timeUnit: 'month', field: 'a' }, 'x'), 'temporal');
        });
        it('should return quantitative if there is bin', function () {
            assert.equal(defaultType({ bin: true, field: 'a' }, 'x'), 'quantitative');
        });
        it('should return quantitative for a channel that supports measure', function () {
            for (var _i = 0, _a = ['x', 'y', 'size', 'opacity', 'order']; _i < _a.length; _i++) {
                var c = _a[_i];
                assert.equal(defaultType({ field: 'a' }, c), 'quantitative', c);
            }
        });
        it('should return nominal for a channel that does not support measure', function () {
            for (var _i = 0, _a = ['color', 'shape', 'row', 'column']; _i < _a.length; _i++) {
                var c = _a[_i];
                assert.equal(defaultType({ field: 'a' }, c), 'nominal', c);
            }
        });
    });
    describe('normalize()', function () {
        it('should convert primitive type to value def', log.wrap(function (localLogger) {
            assert.deepEqual(normalize(5, 'x'), { value: 5 });
            assert.equal(localLogger.warns.length, 1);
        }));
        it('should return fieldDef with full type name.', function () {
            var fieldDef = { field: 'a', type: 'q' };
            assert.deepEqual(normalize(fieldDef, 'x'), { field: 'a', type: 'quantitative' });
        });
        it('normalizes yearmonthday to become yearmonthdate.', log.wrap(function (localLogger) {
            var fieldDef = {
                timeUnit: 'yearmonthday',
                field: 'a',
                type: 'temporal'
            };
            assert.deepEqual(normalize(fieldDef, 'x'), {
                timeUnit: 'yearmonthdate',
                field: 'a',
                type: 'temporal'
            });
            assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
        }));
        it('should replace other type with quantitative for a field with counting aggregate.', log.wrap(function (localLogger) {
            for (var _i = 0, COUNTING_OPS_1 = COUNTING_OPS; _i < COUNTING_OPS_1.length; _i++) {
                var aggregate = COUNTING_OPS_1[_i];
                var fieldDef = { aggregate: aggregate, field: 'a', type: 'nominal' };
                assert.deepEqual(normalize(fieldDef, 'x'), { aggregate: aggregate, field: 'a', type: 'quantitative' });
            }
            assert.equal(localLogger.warns.length, 4);
        }));
        it('should return fieldDef with default type and throw warning if type is missing.', log.wrap(function (localLogger) {
            var fieldDef = { field: 'a' };
            expect(normalize(fieldDef, 'x')).toEqual({ field: 'a', type: 'quantitative' });
            expect(localLogger.warns[0]).toEqual(log.message.emptyOrInvalidFieldType(undefined, 'x', 'quantitative'));
        }));
        it('should drop invalid aggregate ops and throw warning.', log.wrap(function (localLogger) {
            var fieldDef = { aggregate: 'boxplot', field: 'a', type: 'quantitative' };
            assert.deepEqual(normalize(fieldDef, 'x'), { field: 'a', type: 'quantitative' });
            assert.equal(localLogger.warns[0], log.message.invalidAggregate('boxplot'));
        }));
    });
    describe('channelCompatability', function () {
        describe('row/column', function () {
            it('is incompatible with continuous field', function () {
                for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(!channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is compatible with discrete field', function () {
                for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                }
            });
        });
        describe('x/y/color/text/detail', function () {
            it('is compatible with continuous field', function () {
                for (var _i = 0, _a = ['x', 'y', 'color', 'text', 'detail']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is compatible with discrete field', function () {
                for (var _i = 0, _a = ['x', 'y', 'color', 'text', 'detail']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                }
            });
        });
        describe('opacity/size/x2/y2', function () {
            it('is compatible with continuous field', function () {
                for (var _i = 0, _a = ['opacity', 'size', 'x2', 'y2']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(channelCompatibility({ field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is compatible with binned field', function () {
                for (var _i = 0, _a = ['opacity', 'size', 'x2', 'y2']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(channelCompatibility({ bin: true, field: 'a', type: 'quantitative' }, channel).compatible);
                }
            });
            it('is incompatible with nominal field', function () {
                for (var _i = 0, _a = ['opacity', 'size', 'x2', 'y2']; _i < _a.length; _i++) {
                    var channel = _a[_i];
                    assert(!channelCompatibility({ field: 'a', type: 'nominal' }, channel).compatible);
                }
            });
        });
        describe('shape', function () {
            it('is compatible with nominal field', function () {
                assert(channelCompatibility({ field: 'a', type: 'nominal' }, 'shape').compatible);
            });
            it('is compatible with ordinal field', function () {
                assert(channelCompatibility({ field: 'a', type: 'ordinal' }, 'shape').compatible);
            });
            it('is incompatible with quantitative field', function () {
                assert(!channelCompatibility({ field: 'a', type: 'quantitative' }, 'shape').compatible);
            });
            it('is the only channel that is incompatible with geojson field', function () {
                for (var _i = 0, CHANNELS_1 = CHANNELS; _i < CHANNELS_1.length; _i++) {
                    var channel = CHANNELS_1[_i];
                    assert(channelCompatibility({ field: 'a', type: 'geojson' }, channel).compatible === (channel === 'shape'));
                }
            });
        });
        describe('order', function () {
            it('is incompatible with nominal field', function () {
                assert(!channelCompatibility({ field: 'a', type: 'nominal' }, 'order').compatible);
            });
            it('is compatible with ordinal field', function () {
                assert(channelCompatibility({ field: 'a', type: 'ordinal' }, 'order').compatible);
            });
            it('is compatible with quantitative field', function () {
                assert(channelCompatibility({ field: 'a', type: 'quantitative' }, 'order').compatible);
            });
        });
    });
    describe('defaultTitle()', function () {
        it('should return correct title for aggregate', function () {
            assert.equal(defaultTitle({ field: 'f', aggregate: 'mean' }, {}), 'Mean of f');
        });
        it('should return correct title for count', function () {
            assert.equal(defaultTitle({ aggregate: 'count' }, { countTitle: 'baz!' }), 'baz!');
        });
        it('should return correct title for bin', function () {
            var fieldDef = { field: 'f', type: QUANTITATIVE, bin: true };
            assert.equal(defaultTitle(fieldDef, {}), 'f (binned)');
        });
        it('should return correct title for bin', function () {
            var fieldDef = { field: 'f', type: QUANTITATIVE, bin: true };
            assert.equal(defaultTitle(fieldDef, { fieldTitle: 'functional' }), 'BIN(f)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: TEMPORAL, timeUnit: TimeUnit.MONTH };
            assert.equal(defaultTitle(fieldDef, {}), 'f (month)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: TEMPORAL, timeUnit: TimeUnit.YEARMONTHDATE };
            assert.equal(defaultTitle(fieldDef, {}), 'f (year-month-date)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: TEMPORAL, timeUnit: TimeUnit.DAY };
            assert.equal(defaultTitle(fieldDef, {}), 'f (day)');
        });
        it('should return correct title for timeUnit', function () {
            var fieldDef = { field: 'f', type: TEMPORAL, timeUnit: TimeUnit.YEARQUARTER };
            assert.equal(defaultTitle(fieldDef, {}), 'f (year-quarter)');
        });
        it('should return correct title for raw field', function () {
            var fieldDef = { field: 'f', type: TEMPORAL };
            assert.equal(defaultTitle(fieldDef, {}), 'f');
        });
    });
});
//# sourceMappingURL=fielddef.test.js.map