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
    return bin_1.BinNode.makeBinFromTransform(model, t).assemble();
}
describe('compile/data/bin', function () {
    it('should add bin transform and correctly apply bin with custom extent', function () {
        var model = util_1.parseUnitModel({
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
            as: ['bin_extent_0,100_maxbins_10_Acceleration_start', 'bin_extent_0,100_maxbins_10_Acceleration_end'],
            maxbins: 10,
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_10_Acceleration_bins",
        });
    });
    it('should add bin transform and correctly apply bin for binned field without custom extent', function () {
        var model = util_1.parseUnitModel({
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
            as: ['bin_maxbins_10_Acceleration_start', 'bin_maxbins_10_Acceleration_end'],
            maxbins: 10,
            signal: 'bin_maxbins_10_Acceleration_bins',
            extent: { signal: 'bin_maxbins_10_Acceleration_extent' }
        });
    });
    it('should apply the bin transform only once for a binned field encoded in multiple channels', function () {
        var model = util_1.parseUnitModel({
            data: { url: "data/movies.json" },
            mark: "circle",
            encoding: {
                x: {
                    bin: true,
                    field: "Rotten_Tomatoes_Rating",
                    type: "q"
                },
                color: {
                    bin: { "maxbins": 10 },
                    field: "Rotten_Tomatoes_Rating",
                    type: "q"
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
            as: ['bin_maxbins_10_Rotten_Tomatoes_Rating_start',
                'bin_maxbins_10_Rotten_Tomatoes_Rating_end'],
            signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
            maxbins: 10,
            extent: { signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent' }
        });
        chai_1.assert.deepEqual(transform[2], {
            type: 'formula',
            as: 'bin_maxbins_10_Rotten_Tomatoes_Rating_range',
            expr: 'format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_start"], \'s\') + \' - \' + format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_end"], \'s\')'
        });
    });
    it('should add bin transform from transform arrat and correctly apply bin with custom extent', function () {
        var t = {
            bin: { extent: [0, 100] },
            field: 'Acceleration',
            as: 'Bin_Transform'
        };
        var model = util_1.parseUnitModel({
            data: { url: "data/movies.json" },
            mark: "circle",
            transform: [t],
            encoding: {
                x: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "q"
                },
                color: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "q"
                }
            }
        });
        chai_1.assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            "maxbins": 10,
            as: ['bin_extent_0,100_Acceleration_start', 'bin_extent_0,100_Acceleration_end'],
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_10_Acceleration_bins",
        });
    });
    it('should add bin transform from transform arrat and correctly apply bin with custom extent', function () {
        var t = { bin: { extent: [0, 100], maxbins: 20 },
            field: 'Acceleration', as: 'Bin_Transform' };
        var model = util_1.parseUnitModel({
            data: { url: "data/movies.json" },
            mark: "circle",
            transform: [t],
            encoding: {
                x: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "q"
                },
                color: {
                    field: "Rotten_Tomatoes_Rating",
                    type: "q"
                }
            }
        });
        chai_1.assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            "maxbins": 20,
            as: ['bin_extent_0,100_maxbins_20_Acceleration_start', 'bin_extent_0,100_maxbins_20_Acceleration_end'],
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_20_Acceleration_bins",
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIscURBQXNEO0FBSXRELG1DQUEwQztBQUUxQyw4QkFBOEIsS0FBcUI7SUFDakQsTUFBTSxDQUFDLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN2RCxDQUFDO0FBRUQsK0JBQStCLEtBQVksRUFBRSxDQUFlO0lBQzFELE1BQU0sQ0FBQyxhQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzNELENBQUM7QUFFRCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsRUFBRSxDQUFDLHFFQUFxRSxFQUFFO1FBQ3hFLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFO29CQUNELEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBQztvQkFDdkIsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBYyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1RCxJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLEVBQUUsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLDhDQUE4QyxDQUFDO1lBQ3RHLE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNoQixNQUFNLEVBQUUsK0NB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