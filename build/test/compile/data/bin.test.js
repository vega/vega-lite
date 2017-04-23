/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../../../src/compile/data/bin");
var util_1 = require("../../util");
function assemble(model) {
    return bin_1.BinNode.make(model).assemble();
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
        chai_1.assert.deepEqual(assemble(model)[0], {
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
        var transform = assemble(model);
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
        var transform = assemble(model);
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIscURBQXNEO0FBR3RELG1DQUEwQztBQUUxQyxrQkFBa0IsS0FBcUI7SUFDckMsTUFBTSxDQUFDLGFBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDeEMsQ0FBQztBQUVELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQixFQUFFLENBQUMscUVBQXFFLEVBQUU7UUFDeEUsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztZQUMzQixJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUU7b0JBQ0QsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO29CQUN2QixPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFLGNBQWM7aUJBQ3ZCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFjLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoRCxJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLEVBQUUsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLDhDQUE4QyxDQUFDO1lBQ3RHLE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNoQixNQUFNLEVBQUUsK0NBQStDO1NBQ3hELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFFLHlGQUF5RixFQUFFO1FBQzdGLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsSUFBSSxFQUFFLE9BQU87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