"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../../../src/compile/data/bin");
var util_1 = require("../../util");
function assembleFromEncoding(model) {
    return bin_1.BinNode.makeFromEncoding(null, model).assemble();
}
function assembleFromTransform(model, t) {
    return bin_1.BinNode.makeFromTransform(null, t, model).assemble();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIscURBQXNEO0FBSXRELG1DQUFtRDtBQUVuRCw4QkFBOEIsS0FBcUI7SUFDakQsT0FBTyxhQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFELENBQUM7QUFFRCwrQkFBK0IsS0FBWSxFQUFFLENBQWU7SUFDMUQsT0FBTyxhQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM5RCxDQUFDO0FBRUQsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLEVBQUUsQ0FBQyxxRUFBcUUsRUFBRTtRQUN4RSxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztZQUNwQyxJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUU7b0JBQ0QsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFDO29CQUN2QixPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFLGNBQWM7aUJBQ3ZCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFjLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVELElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLGNBQWM7WUFDckIsRUFBRSxFQUFFLENBQUMsMENBQTBDLEVBQUUsOENBQThDLENBQUM7WUFDaEcsT0FBTyxFQUFFLEVBQUU7WUFDWCxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQ2hCLE1BQU0sRUFBRSwrQ0FBK0M7U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUUseUZBQXlGLEVBQUU7UUFDN0YsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7WUFDcEMsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFO29CQUNELEdBQUcsRUFBRSxJQUFJO29CQUNULE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sU0FBUyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxhQUFNLENBQUMsU0FBUyxDQUFjLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxQyxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSxjQUFjO1lBQ3JCLE1BQU0sRUFBRSxvQ0FBb0M7U0FDN0MsQ0FBQyxDQUFDO1FBQ0gsYUFBTSxDQUFDLFNBQVMsQ0FBYyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixFQUFFLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxpQ0FBaUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxrQ0FBa0M7WUFDMUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLG9DQUFvQyxFQUFDO1NBQ3ZELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBGQUEwRixFQUFFO1FBQzdGLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1lBQ3BDLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBQztZQUMvQixJQUFJLEVBQUUsUUFBUTtZQUNkLFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUU7b0JBQ0QsR0FBRyxFQUFFLElBQUk7b0JBQ1QsS0FBSyxFQUFFLHdCQUF3QjtvQkFDL0IsSUFBSSxFQUFFLGNBQWM7aUJBQ3JCO2dCQUNELEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsRUFBRSxFQUFDO29CQUNwQixLQUFLLEVBQUUsd0JBQXdCO29CQUMvQixJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sU0FBUyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxhQUFNLENBQUMsU0FBUyxDQUFjLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxQyxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSx3QkFBd0I7WUFDL0IsTUFBTSxFQUFFLDhDQUE4QztTQUN2RCxDQUFDLENBQUM7UUFDSCxhQUFNLENBQUMsU0FBUyxDQUFjLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxQyxJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSx3QkFBd0I7WUFDL0IsRUFBRSxFQUNGLENBQUUsdUNBQXVDO2dCQUN2QywyQ0FBMkMsQ0FBRTtZQUMvQyxNQUFNLEVBQUUsNENBQTRDO1lBQ3BELE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLDhDQUE4QyxFQUFDO1NBQ2pFLENBQUMsQ0FBQztRQUNILGFBQU0sQ0FBQyxTQUFTLENBQWMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFDLElBQUksRUFBRSxTQUFTO1lBQ2YsRUFBRSxFQUFFLDZDQUE2QztZQUNqRCxJQUFJLEVBQUUsaVJBQWlRO1NBQ3hRLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBGQUEwRixFQUFFO1FBQzdGLElBQU0sQ0FBQyxHQUFpQjtZQUN0QixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7WUFDdkIsS0FBSyxFQUFFLGNBQWM7WUFDckIsRUFBRSxFQUFFLHFCQUFxQjtTQUMxQixDQUFDO1FBRUYsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7WUFDcEMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFDO1lBQy9CLElBQUksRUFBRSxRQUFRO1lBQ2QsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2QsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRTtvQkFDRCxLQUFLLEVBQUUsd0JBQXdCO29CQUMvQixJQUFJLEVBQUUsY0FBYztpQkFDckI7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRSx3QkFBd0I7b0JBQy9CLElBQUksRUFBRSxjQUFjO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBYyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEUsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixTQUFTLEVBQUUsRUFBRTtZQUNiLEVBQUUsRUFBRSxDQUFDLHFCQUFxQixFQUFFLHlCQUF5QixDQUFDO1lBQ3RELE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDaEIsTUFBTSxFQUFFLCtDQUErQztTQUN4RCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwRkFBMEYsRUFBRTtRQUM3RixJQUFNLENBQUMsR0FBaUI7WUFDdEIsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUM7WUFDcEMsS0FBSyxFQUFFLGNBQWM7WUFDckIsRUFBRSxFQUFFLHFCQUFxQjtTQUMxQixDQUFDO1FBRUYsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7WUFDcEMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFDO1lBQy9CLElBQUksRUFBRSxRQUFRO1lBQ2QsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2QsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRTtvQkFDRCxLQUFLLEVBQUUsd0JBQXdCO29CQUMvQixJQUFJLEVBQUUsY0FBYztpQkFDckI7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRSx3QkFBd0I7b0JBQy9CLElBQUksRUFBRSxjQUFjO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBYyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEUsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixTQUFTLEVBQUUsRUFBRTtZQUNiLEVBQUUsRUFBRSxDQUFDLHFCQUFxQixFQUFFLHlCQUF5QixDQUFDO1lBQ3RELE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDaEIsTUFBTSxFQUFFLCtDQUErQztTQUN4RCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtCaW5Ob2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Jpbic7XG5pbXBvcnQge01vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0IHtCaW5UcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy90cmFuc2Zvcm0nO1xuaW1wb3J0IHtWZ1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBhc3NlbWJsZUZyb21FbmNvZGluZyhtb2RlbDogTW9kZWxXaXRoRmllbGQpIHtcbiAgcmV0dXJuIEJpbk5vZGUubWFrZUZyb21FbmNvZGluZyhudWxsLCBtb2RlbCkuYXNzZW1ibGUoKTtcbn1cblxuZnVuY3Rpb24gYXNzZW1ibGVGcm9tVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCwgdDogQmluVHJhbnNmb3JtKSB7XG4gIHJldHVybiBCaW5Ob2RlLm1ha2VGcm9tVHJhbnNmb3JtKG51bGwsIHQsIG1vZGVsKS5hc3NlbWJsZSgpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2JpbicsIGZ1bmN0aW9uKCkge1xuICBpdCgnc2hvdWxkIGFkZCBiaW4gdHJhbnNmb3JtIGFuZCBjb3JyZWN0bHkgYXBwbHkgYmluIHdpdGggY3VzdG9tIGV4dGVudCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHk6IHtcbiAgICAgICAgICBiaW46IHtleHRlbnQ6IFswLCAxMDBdfSxcbiAgICAgICAgICAnZmllbGQnOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAndHlwZSc6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsKVswXSwge1xuICAgICAgdHlwZTogJ2JpbicsXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBhczogWydiaW5fZXh0ZW50XzBfMTAwX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uJywgJ2Jpbl9leHRlbnRfMF8xMDBfbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fZW5kJ10sXG4gICAgICBtYXhiaW5zOiAxMCxcbiAgICAgIGV4dGVudDogWzAsIDEwMF0sXG4gICAgICBzaWduYWw6IFwiYmluX2V4dGVudF8wXzEwMF9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9iaW5zXCIsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0ICgnc2hvdWxkIGFkZCBiaW4gdHJhbnNmb3JtIGFuZCBjb3JyZWN0bHkgYXBwbHkgYmluIGZvciBiaW5uZWQgZmllbGQgd2l0aG91dCBjdXN0b20gZXh0ZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHk6IHtcbiAgICAgICAgICBiaW46IHRydWUsXG4gICAgICAgICAgJ2ZpZWxkJzogJ0FjY2VsZXJhdGlvbicsXG4gICAgICAgICAgJ3R5cGUnOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gYXNzZW1ibGVGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgIGFzc2VydC5kZWVwRXF1YWwodHJhbnNmb3JtLmxlbmd0aCwgMik7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4odHJhbnNmb3JtWzBdLCB7XG4gICAgICB0eXBlOiAnZXh0ZW50JyxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIHNpZ25hbDogJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9leHRlbnQnXG4gICAgfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4odHJhbnNmb3JtWzFdLCB7XG4gICAgICB0eXBlOiAnYmluJyxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIGFzOiBbJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbicsICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fZW5kJ10sXG4gICAgICBtYXhiaW5zOiAxMCxcbiAgICAgIHNpZ25hbDogJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9iaW5zJyxcbiAgICAgIGV4dGVudDoge3NpZ25hbDogJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9leHRlbnQnfVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFwcGx5IHRoZSBiaW4gdHJhbnNmb3JtIG9ubHkgb25jZSBmb3IgYSBiaW5uZWQgZmllbGQgZW5jb2RlZCBpbiBtdWx0aXBsZSBjaGFubmVscycsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIGRhdGE6IHt1cmw6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgIG1hcms6IFwiY2lyY2xlXCIsXG4gICAgICBlbmNvZGluZzoge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgYmluOiB0cnVlLFxuICAgICAgICAgIGZpZWxkOiBcIlJvdHRlbl9Ub21hdG9lc19SYXRpbmdcIixcbiAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgYmluOiB7XCJtYXhiaW5zXCI6IDEwfSxcbiAgICAgICAgICBmaWVsZDogXCJSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCIsXG4gICAgICAgICAgdHlwZTogXCJvcmRpbmFsXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHRyYW5zZm9ybS5sZW5ndGgsIDMpO1xuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KHRyYW5zZm9ybVswXSwge1xuICAgICAgdHlwZTogJ2V4dGVudCcsXG4gICAgICBmaWVsZDogJ1JvdHRlbl9Ub21hdG9lc19SYXRpbmcnLFxuICAgICAgc2lnbmFsOiAnYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ19leHRlbnQnXG4gICAgfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4odHJhbnNmb3JtWzFdLCB7XG4gICAgICB0eXBlOiAnYmluJyxcbiAgICAgIGZpZWxkOiAnUm90dGVuX1RvbWF0b2VzX1JhdGluZycsXG4gICAgICBhczpcbiAgICAgIFsgJ2Jpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmcnLFxuICAgICAgICAnYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ19lbmQnIF0sXG4gICAgICBzaWduYWw6ICdiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nX2JpbnMnLFxuICAgICAgbWF4YmluczogMTAsXG4gICAgICBleHRlbnQ6IHtzaWduYWw6ICdiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nX2V4dGVudCd9XG4gICAgfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4odHJhbnNmb3JtWzJdLCB7XG4gICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICBhczogJ2Jpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdfcmFuZ2UnLFxuICAgICAgZXhwcjogYGRhdHVtW1wiYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiXSA9PT0gbnVsbCB8fCBpc05hTihkYXR1bVtcImJpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdcIl0pID8gXCJudWxsXCIgOiBmb3JtYXQoZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCJdLCBcIlwiKSArIFwiIC0gXCIgKyBmb3JtYXQoZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nX2VuZFwiXSwgXCJcIilgXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIGJpbiB0cmFuc2Zvcm0gZnJvbSB0cmFuc2Zvcm0gYXJyYXkgYW5kIGNvcnJlY3RseSBhcHBseSBiaW4gd2l0aCBjdXN0b20gZXh0ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdDogQmluVHJhbnNmb3JtID0ge1xuICAgICAgYmluOiB7ZXh0ZW50OiBbMCwgMTAwXX0sXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBhczogJ2Jpbm5lZF9hY2NlbGVyYXRpb24nXG4gICAgfTtcblxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgZGF0YToge3VybDogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgbWFyazogXCJjaXJjbGVcIixcbiAgICAgIHRyYW5zZm9ybTogW3RdLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIGZpZWxkOiBcIlJvdHRlbl9Ub21hdG9lc19SYXRpbmdcIixcbiAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgZmllbGQ6IFwiUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiLFxuICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4oYXNzZW1ibGVGcm9tVHJhbnNmb3JtKG1vZGVsLCB0KVswXSwge1xuICAgICAgdHlwZTogJ2JpbicsXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBcIm1heGJpbnNcIjogMTAsXG4gICAgICBhczogWydiaW5uZWRfYWNjZWxlcmF0aW9uJywgJ2Jpbm5lZF9hY2NlbGVyYXRpb25fZW5kJ10sXG4gICAgICBleHRlbnQ6IFswLCAxMDBdLFxuICAgICAgc2lnbmFsOiBcImJpbl9leHRlbnRfMF8xMDBfbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fYmluc1wiLFxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBiaW4gdHJhbnNmb3JtIGZyb20gdHJhbnNmb3JtIGFycmF5IGFuZCBjb3JyZWN0bHkgYXBwbHkgYmluIHdpdGggY3VzdG9tIGV4dGVudCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHQ6IEJpblRyYW5zZm9ybSA9IHtcbiAgICAgIGJpbjoge2V4dGVudDogWzAsIDEwMF0sIG1heGJpbnM6IDIwfSxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIGFzOiAnYmlubmVkX2FjY2VsZXJhdGlvbidcbiAgICB9O1xuXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBkYXRhOiB7dXJsOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICBtYXJrOiBcImNpcmNsZVwiLFxuICAgICAgdHJhbnNmb3JtOiBbdF0sXG4gICAgICBlbmNvZGluZzoge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgZmllbGQ6IFwiUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiLFxuICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBmaWVsZDogXCJSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCIsXG4gICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPihhc3NlbWJsZUZyb21UcmFuc2Zvcm0obW9kZWwsIHQpWzBdLCB7XG4gICAgICB0eXBlOiAnYmluJyxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIFwibWF4Ymluc1wiOiAyMCxcbiAgICAgIGFzOiBbJ2Jpbm5lZF9hY2NlbGVyYXRpb24nLCAnYmlubmVkX2FjY2VsZXJhdGlvbl9lbmQnXSxcbiAgICAgIGV4dGVudDogWzAsIDEwMF0sXG4gICAgICBzaWduYWw6IFwiYmluX2V4dGVudF8wXzEwMF9tYXhiaW5zXzIwX0FjY2VsZXJhdGlvbl9iaW5zXCIsXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=