/* tslint:disable:quotemark */
import { assert } from 'chai';
import { BinNode } from '../../../src/compile/data/bin';
import { parseUnitModelWithScale } from '../../util';
function assembleFromEncoding(model) {
    return BinNode.makeFromEncoding(null, model).assemble();
}
function assembleFromTransform(model, t) {
    return BinNode.makeFromTransform(null, t, model).assemble();
}
describe('compile/data/bin', function () {
    it('should add bin transform and correctly apply bin with custom extent', function () {
        var model = parseUnitModelWithScale({
            mark: 'point',
            encoding: {
                y: {
                    bin: { extent: [0, 100] },
                    field: 'Acceleration',
                    type: 'quantitative'
                }
            }
        });
        assert.deepEqual(assembleFromEncoding(model)[0], {
            type: 'bin',
            field: 'Acceleration',
            as: ['bin_extent_0_100_maxbins_10_Acceleration', 'bin_extent_0_100_maxbins_10_Acceleration_end'],
            maxbins: 10,
            extent: [0, 100],
            signal: 'bin_extent_0_100_maxbins_10_Acceleration_bins'
        });
    });
    it('should add bin transform and correctly apply bin for binned field without custom extent', function () {
        var model = parseUnitModelWithScale({
            mark: 'point',
            encoding: {
                y: {
                    bin: true,
                    field: 'Acceleration',
                    type: 'quantitative'
                }
            }
        });
        var transform = assembleFromEncoding(model);
        assert.deepEqual(transform.length, 2);
        assert.deepEqual(transform[0], {
            type: 'extent',
            field: 'Acceleration',
            signal: 'bin_maxbins_10_Acceleration_extent'
        });
        assert.deepEqual(transform[1], {
            type: 'bin',
            field: 'Acceleration',
            as: ['bin_maxbins_10_Acceleration', 'bin_maxbins_10_Acceleration_end'],
            maxbins: 10,
            signal: 'bin_maxbins_10_Acceleration_bins',
            extent: { signal: 'bin_maxbins_10_Acceleration_extent' }
        });
    });
    it('should apply the bin transform only once for a binned field encoded in multiple channels', function () {
        var model = parseUnitModelWithScale({
            data: { url: 'data/movies.json' },
            mark: 'circle',
            encoding: {
                x: {
                    bin: true,
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                },
                color: {
                    bin: { maxbins: 10 },
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'ordinal'
                }
            }
        });
        var transform = assembleFromEncoding(model);
        assert.deepEqual(transform.length, 3);
        assert.deepEqual(transform[0], {
            type: 'extent',
            field: 'Rotten_Tomatoes_Rating',
            signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
        });
        assert.deepEqual(transform[1], {
            type: 'bin',
            field: 'Rotten_Tomatoes_Rating',
            as: ['bin_maxbins_10_Rotten_Tomatoes_Rating', 'bin_maxbins_10_Rotten_Tomatoes_Rating_end'],
            signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
            maxbins: 10,
            extent: { signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent' }
        });
        assert.deepEqual(transform[2], {
            type: 'formula',
            as: 'bin_maxbins_10_Rotten_Tomatoes_Rating_range',
            expr: "datum[\"bin_maxbins_10_Rotten_Tomatoes_Rating\"] === null || isNaN(datum[\"bin_maxbins_10_Rotten_Tomatoes_Rating\"]) ? \"null\" : format(datum[\"bin_maxbins_10_Rotten_Tomatoes_Rating\"], \"\") + \" - \" + format(datum[\"bin_maxbins_10_Rotten_Tomatoes_Rating_end\"], \"\")"
        });
    });
    it('should add bin transform from transform array and correctly apply bin with custom extent', function () {
        var t = {
            bin: { extent: [0, 100] },
            field: 'Acceleration',
            as: 'binned_acceleration'
        };
        var model = parseUnitModelWithScale({
            data: { url: 'data/movies.json' },
            mark: 'circle',
            transform: [t],
            encoding: {
                x: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                },
                color: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                }
            }
        });
        assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            maxbins: 10,
            as: ['binned_acceleration', 'binned_acceleration_end'],
            extent: [0, 100],
            signal: 'bin_extent_0_100_maxbins_10_Acceleration_bins'
        });
    });
    it('should add bin transform from transform array and correctly apply bin with custom extent', function () {
        var t = {
            bin: { extent: [0, 100], maxbins: 20 },
            field: 'Acceleration',
            as: 'binned_acceleration'
        };
        var model = parseUnitModelWithScale({
            data: { url: 'data/movies.json' },
            mark: 'circle',
            transform: [t],
            encoding: {
                x: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                },
                color: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                }
            }
        });
        assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            maxbins: 20,
            as: ['binned_acceleration', 'binned_acceleration_end'],
            extent: [0, 100],
            signal: 'bin_extent_0_100_maxbins_20_Acceleration_bins'
        });
    });
    it('should add bin transform from transform array with anchor property', function () {
        var t = {
            bin: { extent: [0, 100], anchor: 6 },
            field: 'Acceleration',
            as: 'binned_acceleration'
        };
        var model = parseUnitModelWithScale({
            data: { url: 'data/movies.json' },
            mark: 'circle',
            transform: [t],
            encoding: {
                x: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                },
                color: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                }
            }
        });
        assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            anchor: 6,
            maxbins: 10,
            as: ['binned_acceleration', 'binned_acceleration_end'],
            extent: [0, 100],
            signal: 'bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins'
        });
    });
    it('should add bin transform from transform array with array as', function () {
        var t = {
            bin: { extent: [0, 100], anchor: 6 },
            field: 'Acceleration',
            as: ['binned_acceleration_start', 'binned_acceleration_stop']
        };
        var model = parseUnitModelWithScale({
            data: { url: 'data/movies.json' },
            mark: 'circle',
            transform: [t],
            encoding: {
                x: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                },
                color: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                }
            }
        });
        assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            anchor: 6,
            maxbins: 10,
            as: ['binned_acceleration_start', 'binned_acceleration_stop'],
            extent: [0, 100],
            signal: 'bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins'
        });
    });
    it('should generate the correct hash', function () {
        var t = {
            bin: { extent: [0, 100], anchor: 6 },
            field: 'Acceleration',
            as: ['binned_acceleration_start', 'binned_acceleration_stop']
        };
        var model = parseUnitModelWithScale({
            data: { url: 'data/movies.json' },
            mark: 'circle',
            transform: [t],
            encoding: {
                x: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                },
                color: {
                    field: 'Rotten_Tomatoes_Rating',
                    type: 'quantitative'
                }
            }
        });
        var binNode = BinNode.makeFromTransform(null, t, model);
        assert.deepEqual(binNode.hash(), 'Bin 1594083826');
    });
});
//# sourceMappingURL=bin.test.js.map