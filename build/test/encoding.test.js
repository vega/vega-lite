import { assert } from 'chai';
import { defaultConfig } from '../src/config';
import { extractTransformsFromEncoding, normalizeEncoding } from '../src/encoding';
import { isPositionFieldDef } from '../src/fielddef';
import * as log from '../src/log';
describe('encoding', function () {
    describe('normalizeEncoding', function () {
        it('should drop color channel if fill is specified', log.wrap(function (logger) {
            var encoding = normalizeEncoding({
                color: { field: 'a', type: 'quantitative' },
                fill: { field: 'b', type: 'quantitative' }
            }, 'rule');
            assert.deepEqual(encoding, {
                fill: { field: 'b', type: 'quantitative' }
            });
            assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('should drop color channel if stroke is specified', log.wrap(function (logger) {
            var encoding = normalizeEncoding({
                color: { field: 'a', type: 'quantitative' },
                stroke: { field: 'b', type: 'quantitative' }
            }, 'rule');
            assert.deepEqual(encoding, {
                stroke: { field: 'b', type: 'quantitative' }
            });
            assert.equal(logger.warns[0], log.message.droppingColor('encoding', { stroke: true }));
        }));
    });
    describe('extractTransformsFromEncoding', function () {
        it('should indlude axis in extracted encoding', function () {
            var encoding = extractTransformsFromEncoding({
                x: { field: 'dose', type: 'ordinal', axis: { labelAngle: 15 } },
                y: { field: 'response', type: 'quantitative' }
            }, defaultConfig).encoding;
            var x = encoding.x;
            expect(x).toBeDefined();
            if (isPositionFieldDef(x)) {
                expect(x.axis).toBeDefined();
                expect(x.axis.labelAngle).toEqual(15);
            }
            else {
                assert.fail(null, null, 'encoding x is not PositionFieldDef');
            }
        });
        it('should extract time unit from encoding field definition and add axis format', function () {
            var output = extractTransformsFromEncoding(normalizeEncoding({
                x: { timeUnit: 'yearmonthdatehoursminutes', field: 'a', type: 'temporal' },
                y: { field: 'b', type: 'quantitative' }
            }, 'line'), defaultConfig);
            expect(output).toEqual({
                bins: [],
                timeUnits: [{ timeUnit: 'yearmonthdatehoursminutes', field: 'a', as: 'yearmonthdatehoursminutes_a' }],
                aggregate: [],
                groupby: ['yearmonthdatehoursminutes_a', 'b'],
                encoding: {
                    x: {
                        field: 'yearmonthdatehoursminutes_a',
                        type: 'temporal',
                        title: 'a (year-month-date-hours-minutes)',
                        axis: { format: '%b %d, %Y %H:%M' }
                    },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
        });
        it('should extract aggregates from encoding', function () {
            var output = extractTransformsFromEncoding(normalizeEncoding({
                x: { field: 'a', type: 'quantitative' },
                y: {
                    aggregate: 'max',
                    field: 'b',
                    type: 'quantitative'
                }
            }, 'line'), defaultConfig);
            assert.deepEqual(output, {
                bins: [],
                timeUnits: [],
                aggregate: [{ op: 'max', field: 'b', as: 'max_b' }],
                groupby: ['a'],
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: {
                        field: 'max_b',
                        type: 'quantitative',
                        title: 'Max of b'
                    }
                }
            });
        });
        it('should extract binning from encoding', function () {
            var output = extractTransformsFromEncoding(normalizeEncoding({
                x: { field: 'a', type: 'ordinal', bin: true },
                y: { type: 'quantitative', aggregate: 'count' }
            }, 'bar'), defaultConfig);
            assert.deepEqual(output, {
                bins: [{ bin: { maxbins: 10 }, field: 'a', as: 'bin_maxbins_10_a' }],
                timeUnits: [],
                aggregate: [{ op: 'count', as: 'count_*' }],
                groupby: ['bin_maxbins_10_a_end', 'bin_maxbins_10_a_range', 'bin_maxbins_10_a'],
                encoding: {
                    x: { field: 'bin_maxbins_10_a', type: 'quantitative', title: 'a (binned)', bin: 'binned' },
                    x2: { field: 'bin_maxbins_10_a_end', type: 'quantitative' },
                    y: { field: 'count_*', type: 'quantitative', title: 'Number of Records' }
                }
            });
        });
        it('should preserve auxiliary properties (i.e. axis) in encoding', function () {
            var output = extractTransformsFromEncoding(normalizeEncoding({
                x: { field: 'a', type: 'quantitative' },
                y: {
                    aggregate: 'mean',
                    field: 'b',
                    type: 'quantitative',
                    title: 'foo',
                    axis: { title: 'foo', format: '.2e' }
                }
            }, 'line'), defaultConfig);
            expect(output).toEqual({
                bins: [],
                timeUnits: [],
                aggregate: [{ op: 'mean', field: 'b', as: 'mean_b' }],
                groupby: ['a'],
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: {
                        field: 'mean_b',
                        type: 'quantitative',
                        title: 'foo',
                        axis: { title: 'foo', format: '.2e' }
                    }
                }
            });
        });
    });
});
//# sourceMappingURL=encoding.test.js.map