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
                    'field': 'Acceleration',
                    'type': 'quantitative'
                }
            }
        });
        assert.deepEqual(assembleFromEncoding(model)[0], {
            type: 'bin',
            field: 'Acceleration',
            as: ['bin_extent_0_100_maxbins_10_Acceleration', 'bin_extent_0_100_maxbins_10_Acceleration_end'],
            maxbins: 10,
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_10_Acceleration_bins",
        });
    });
    it('should add bin transform and correctly apply bin for binned field without custom extent', function () {
        var model = parseUnitModelWithScale({
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
        assert.deepEqual(transform.length, 3);
        assert.deepEqual(transform[0], {
            type: 'extent',
            field: 'Rotten_Tomatoes_Rating',
            signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
        });
        assert.deepEqual(transform[1], {
            type: 'bin',
            field: 'Rotten_Tomatoes_Rating',
            as: ['bin_maxbins_10_Rotten_Tomatoes_Rating',
                'bin_maxbins_10_Rotten_Tomatoes_Rating_end'],
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
        assert.deepEqual(assembleFromTransform(model, t)[0], {
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
        var model = parseUnitModelWithScale({
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
        assert.deepEqual(assembleFromTransform(model, t)[0], {
            type: 'bin',
            field: 'Acceleration',
            "maxbins": 20,
            as: ['binned_acceleration', 'binned_acceleration_end'],
            extent: [0, 100],
            signal: "bin_extent_0_100_maxbins_20_Acceleration_bins",
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU1QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFJdEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRW5ELDhCQUE4QixLQUFxQjtJQUNqRCxPQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDMUQsQ0FBQztBQUVELCtCQUErQixLQUFZLEVBQUUsQ0FBZTtJQUMxRCxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzlELENBQUM7QUFFRCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsRUFBRSxDQUFDLHFFQUFxRSxFQUFFO1FBQ3hFLElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO1lBQ3BDLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRTtvQkFDRCxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxTQUFTLENBQWMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixFQUFFLEVBQUUsQ0FBQywwQ0FBMEMs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RUFBQztZQUNwQyxLQUFLLEVBQUUsY0FBYztZQUNyQixFQUFFLEVBQUUscUJBQXFCO1NBQzFCLENBQUM7UUFFRixJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztZQUNwQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUM7WUFDL0IsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZCxRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFO29CQUNELEtBQUssRUFBRSx3QkFBd0I7b0JBQy9CLElBQUksRUFBRSxjQUFjO2lCQUNyQjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLHdCQUF3QjtvQkFDL0IsSUFBSSxFQUFFLGNBQWM7aUJBQ3JCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsU0FBUyxDQUFjLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoRSxJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFNBQVMsRUFBRSxFQUFFO1lBQ2IsRUFBRSxFQUFFLENBQUMscUJBQXFCLEVBQUUseUJBQXlCLENBQUM7WUFDdEQsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNoQixNQUFNLEVBQUUsK0NBQStDO1NBQ3hELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYmluJztcbmltcG9ydCB7TW9kZWwsIE1vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQge0JpblRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge1ZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICByZXR1cm4gQmluTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKS5hc3NlbWJsZSgpO1xufVxuXG5mdW5jdGlvbiBhc3NlbWJsZUZyb21UcmFuc2Zvcm0obW9kZWw6IE1vZGVsLCB0OiBCaW5UcmFuc2Zvcm0pIHtcbiAgcmV0dXJuIEJpbk5vZGUubWFrZUZyb21UcmFuc2Zvcm0obnVsbCwgdCwgbW9kZWwpLmFzc2VtYmxlKCk7XG59XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvYmluJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgYWRkIGJpbiB0cmFuc2Zvcm0gYW5kIGNvcnJlY3RseSBhcHBseSBiaW4gd2l0aCBjdXN0b20gZXh0ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeToge1xuICAgICAgICAgIGJpbjoge2V4dGVudDogWzAsIDEwMF19LFxuICAgICAgICAgICdmaWVsZCc6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgICAgICd0eXBlJzogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4oYXNzZW1ibGVGcm9tRW5jb2RpbmcobW9kZWwpWzBdLCB7XG4gICAgICB0eXBlOiAnYmluJyxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIGFzOiBbJ2Jpbl9leHRlbnRfMF8xMDBfbWF4Ymluc18xMF9BY2NlbGVyYXRpb24nLCAnYmluX2V4dGVudF8wXzEwMF9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9lbmQnXSxcbiAgICAgIG1heGJpbnM6IDEwLFxuICAgICAgZXh0ZW50OiBbMCwgMTAwXSxcbiAgICAgIHNpZ25hbDogXCJiaW5fZXh0ZW50XzBfMTAwX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2JpbnNcIixcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQgKCdzaG91bGQgYWRkIGJpbiB0cmFuc2Zvcm0gYW5kIGNvcnJlY3RseSBhcHBseSBiaW4gZm9yIGJpbm5lZCBmaWVsZCB3aXRob3V0IGN1c3RvbSBleHRlbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeToge1xuICAgICAgICAgIGJpbjogdHJ1ZSxcbiAgICAgICAgICAnZmllbGQnOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAndHlwZSc6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBhc3NlbWJsZUZyb21FbmNvZGluZyhtb2RlbCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbCh0cmFuc2Zvcm0ubGVuZ3RoLCAyKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPih0cmFuc2Zvcm1bMF0sIHtcbiAgICAgIHR5cGU6ICdleHRlbnQnLFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgc2lnbmFsOiAnYmluX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2V4dGVudCdcbiAgICB9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPih0cmFuc2Zvcm1bMV0sIHtcbiAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgYXM6IFsnYmluX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uJywgJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9lbmQnXSxcbiAgICAgIG1heGJpbnM6IDEwLFxuICAgICAgc2lnbmFsOiAnYmluX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2JpbnMnLFxuICAgICAgZXh0ZW50OiB7c2lnbmFsOiAnYmluX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2V4dGVudCd9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYXBwbHkgdGhlIGJpbiB0cmFuc2Zvcm0gb25seSBvbmNlIGZvciBhIGJpbm5lZCBmaWVsZCBlbmNvZGVkIGluIG11bHRpcGxlIGNoYW5uZWxzJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgZGF0YToge3VybDogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgbWFyazogXCJjaXJjbGVcIixcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHg6IHtcbiAgICAgICAgICBiaW46IHRydWUsXG4gICAgICAgICAgZmllbGQ6IFwiUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiLFxuICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBiaW46IHtcIm1heGJpbnNcIjogMTB9LFxuICAgICAgICAgIGZpZWxkOiBcIlJvdHRlbl9Ub21hdG9lc19SYXRpbmdcIixcbiAgICAgICAgICB0eXBlOiBcIm9yZGluYWxcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gYXNzZW1ibGVGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgIGFzc2VydC5kZWVwRXF1YWwodHJhbnNmb3JtLmxlbmd0aCwgMyk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4odHJhbnNmb3JtWzBdLCB7XG4gICAgICB0eXBlOiAnZXh0ZW50JyxcbiAgICAgIGZpZWxkOiAnUm90dGVuX1RvbWF0b2VzX1JhdGluZycsXG4gICAgICBzaWduYWw6ICdiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nX2V4dGVudCdcbiAgICB9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPih0cmFuc2Zvcm1bMV0sIHtcbiAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgZmllbGQ6ICdSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nJyxcbiAgICAgIGFzOlxuICAgICAgWyAnYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZycsXG4gICAgICAgICdiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nX2VuZCcgXSxcbiAgICAgIHNpZ25hbDogJ2Jpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdfYmlucycsXG4gICAgICBtYXhiaW5zOiAxMCxcbiAgICAgIGV4dGVudDoge3NpZ25hbDogJ2Jpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdfZXh0ZW50J31cbiAgICB9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPih0cmFuc2Zvcm1bMl0sIHtcbiAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgIGFzOiAnYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ19yYW5nZScsXG4gICAgICBleHByOiBgZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCJdID09PSBudWxsIHx8IGlzTmFOKGRhdHVtW1wiYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiXSkgPyBcIm51bGxcIiA6IGZvcm1hdChkYXR1bVtcImJpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdcIl0sIFwiXCIpICsgXCIgLSBcIiArIGZvcm1hdChkYXR1bVtcImJpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdfZW5kXCJdLCBcIlwiKWBcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgYmluIHRyYW5zZm9ybSBmcm9tIHRyYW5zZm9ybSBhcnJheSBhbmQgY29ycmVjdGx5IGFwcGx5IGJpbiB3aXRoIGN1c3RvbSBleHRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0OiBCaW5UcmFuc2Zvcm0gPSB7XG4gICAgICBiaW46IHtleHRlbnQ6IFswLCAxMDBdfSxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIGFzOiAnYmlubmVkX2FjY2VsZXJhdGlvbidcbiAgICB9O1xuXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBkYXRhOiB7dXJsOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICBtYXJrOiBcImNpcmNsZVwiLFxuICAgICAgdHJhbnNmb3JtOiBbdF0sXG4gICAgICBlbmNvZGluZzoge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgZmllbGQ6IFwiUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiLFxuICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBmaWVsZDogXCJSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCIsXG4gICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPihhc3NlbWJsZUZyb21UcmFuc2Zvcm0obW9kZWwsIHQpWzBdLCB7XG4gICAgICB0eXBlOiAnYmluJyxcbiAgICAgIGZpZWxkOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgIFwibWF4Ymluc1wiOiAxMCxcbiAgICAgIGFzOiBbJ2Jpbm5lZF9hY2NlbGVyYXRpb24nLCAnYmlubmVkX2FjY2VsZXJhdGlvbl9lbmQnXSxcbiAgICAgIGV4dGVudDogWzAsIDEwMF0sXG4gICAgICBzaWduYWw6IFwiYmluX2V4dGVudF8wXzEwMF9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9iaW5zXCIsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWRkIGJpbiB0cmFuc2Zvcm0gZnJvbSB0cmFuc2Zvcm0gYXJyYXkgYW5kIGNvcnJlY3RseSBhcHBseSBiaW4gd2l0aCBjdXN0b20gZXh0ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdDogQmluVHJhbnNmb3JtID0ge1xuICAgICAgYmluOiB7ZXh0ZW50OiBbMCwgMTAwXSwgbWF4YmluczogMjB9LFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgYXM6ICdiaW5uZWRfYWNjZWxlcmF0aW9uJ1xuICAgIH07XG5cbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIGRhdGE6IHt1cmw6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgIG1hcms6IFwiY2lyY2xlXCIsXG4gICAgICB0cmFuc2Zvcm06IFt0XSxcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHg6IHtcbiAgICAgICAgICBmaWVsZDogXCJSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCIsXG4gICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICB9LFxuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGZpZWxkOiBcIlJvdHRlbl9Ub21hdG9lc19SYXRpbmdcIixcbiAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KGFzc2VtYmxlRnJvbVRyYW5zZm9ybShtb2RlbCwgdClbMF0sIHtcbiAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgXCJtYXhiaW5zXCI6IDIwLFxuICAgICAgYXM6IFsnYmlubmVkX2FjY2VsZXJhdGlvbicsICdiaW5uZWRfYWNjZWxlcmF0aW9uX2VuZCddLFxuICAgICAgZXh0ZW50OiBbMCwgMTAwXSxcbiAgICAgIHNpZ25hbDogXCJiaW5fZXh0ZW50XzBfMTAwX21heGJpbnNfMjBfQWNjZWxlcmF0aW9uX2JpbnNcIixcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==