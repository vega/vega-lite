"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../../../src/compile/data/bin");
var util_1 = require("../../util");
function assembleFromEncoding(model) {
    return bin_1.BinNode.makeBinFromEncoding(model).assemble();
}
function assembleFromTransform(model, t) {
    return bin_1.BinNode.makeFromTransform(t, { model: model }).assemble();
}
describe('compile/data/bin', function () {
    it('should add bin transform and correctly apply bin with custom extent', function () {
        var model = util_1.parseUnitModelWithScale({
            mark: 'point',
            encoding: {
                y: {
                    bin: { extent: [0, 100] },
                    'field': 'Acceleration',
                    'type': 'quantitative'
                }
            }
        });
        chai_1.assert.deepEqual(assembleFromEncoding(model)[0], {
            type: 'bin',
            field: 'Acceleration',
            as: ['bin_extent_0_100_maxbins_10_Acceleration', 'bin_extent_0_100_maxbins_10_Acceleration_end'],
            maxbins: 10,
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_10_Acceleration_bins",
        });
    });
    it('should add bin transform and correctly apply bin for binned field without custom extent', function () {
        var model = util_1.parseUnitModelWithScale({
            mark: 'point',
            encoding: {
                y: {
                    bin: true,
                    'field': 'Acceleration',
                    'type': 'quantitative'
                }
            }
        });
        var transform = assembleFromEncoding(model);
        chai_1.assert.deepEqual(transform.length, 2);
        chai_1.assert.deepEqual(transform[0], {
            type: 'extent',
            field: 'Acceleration',
            signal: 'bin_maxbins_10_Acceleration_extent'
        });
        chai_1.assert.deepEqual(transform[1], {
            type: 'bin',
            field: 'Acceleration',
            as: ['bin_maxbins_10_Acceleration', 'bin_maxbins_10_Acceleration_end'],
            maxbins: 10,
            signal: 'bin_maxbins_10_Acceleration_bins',
            extent: { signal: 'bin_maxbins_10_Acceleration_extent' }
        });
    });
    it('should apply the bin transform only once for a binned field encoded in multiple channels', function () {
        var model = util_1.parseUnitModelWithScale({
            data: { url: "data/movies.json" },
            mark: "circle",
            encoding: {
                x: {
                    bin: true,
                    field: "Rotten_Tomatoes_Rating",
                    type: "quantitative"
                },
                color: {
                    bin: { "maxbins": 10 },
                    field: "Rotten_Tomatoes_Rating",
                    type: "ordinal"
                }
            }
        });
        var transform = assembleFromEncoding(model);
        chai_1.assert.deepEqual(transform.length, 3);
        chai_1.assert.deepEqual(transform[0], {
            type: 'extent',
            field: 'Rotten_Tomatoes_Rating',
            signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
        });
        chai_1.assert.deepEqual(transform[1], {
            type: 'bin',
            field: 'Rotten_Tomatoes_Rating',
            as: ['bin_maxbins_10_Rotten_Tomatoes_Rating',
                'bin_maxbins_10_Rotten_Tomatoes_Rating_end'],
            signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
            maxbins: 10,
            extent: { signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent' }
        });
        chai_1.assert.deepEqual(transform[2], {
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
        var model = util_1.parseUnitModelWithScale({
            data: { url: "data/movies.json" },
            mark: "circle",
            transform: [t],
            encoding: {
                x: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "quantitative"
                },
                color: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "quantitative"
                }
            }
        });
        chai_1.assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            "maxbins": 10,
            as: ['binned_acceleration', 'binned_acceleration_end'],
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_10_Acceleration_bins",
        });
    });
    it('should add bin transform from transform array and correctly apply bin with custom extent', function () {
        var t = {
            bin: { extent: [0, 100], maxbins: 20 },
            field: 'Acceleration',
            as: 'binned_acceleration'
        };
        var model = util_1.parseUnitModelWithScale({
            data: { url: "data/movies.json" },
            mark: "circle",
            transform: [t],
            encoding: {
                x: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "quantitative"
                },
                color: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "quantitative"
                }
            }
        });
        chai_1.assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            "maxbins": 20,
            as: ['binned_acceleration', 'binned_acceleration_end'],
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_20_Acceleration_bins",
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIscURBQXNEO0FBSXRELG1DQUFtRDtBQUVuRCw4QkFBOEIsS0FBcUI7SUFDakQsTUFBTSxDQUFDLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN2RCxDQUFDO0FBRUQsK0JBQStCLEtBQVksRUFBRSxDQUFlO0lBQzFELE1BQU0sQ0FBQyxhQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFELENBQUM7QUFFRCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsRUFBRSxDQUFDLHFFQUFxRSxFQUFFO1FBQ3hFLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1lBQ3BDLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRTtvQkFDRCxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQWMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixFQUFFLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSw4Q0FBOEMsQ0FBQztZQUNoRyxPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7WUFD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