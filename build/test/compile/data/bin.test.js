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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIscURBQXNEO0FBSXRELG1DQUFtRDtBQUVuRCw4QkFBOEIsS0FBcUI7SUFDakQsTUFBTSxDQUFDLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN2RCxDQUFDO0FBRUQsK0JBQStCLEtBQVksRUFBRSxDQUFlO0lBQzFELE1BQU0sQ0FBQyxhQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFELENBQUM7QUFFRCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsRUFBRSxDQUFDLHFFQUFxRSxFQUFFO1FBQ3hFLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1lBQ3BDLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRTtvQkFDRCxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQWMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixFQUFFLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSw4Q0FBOEMsQ0FBQztZQUNoRyxPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7WUFD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QkFBdUIsQ0FBQztZQUNwQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUM7WUFDL0IsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZCxRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFO29CQUNELEtBQUssRUFBRSx3QkFBd0I7b0JBQy9CLElBQUksRUFBRSxjQUFjO2lCQUNyQjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLHdCQUF3QjtvQkFDL0IsSUFBSSxFQUFFLGNBQWM7aUJBQ3JCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFjLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoRSxJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFNBQVMsRUFBRSxFQUFFO1lBQ2IsRUFBRSxFQUFFLENBQUMscUJBQXFCLEVBQUUseUJBQXlCLENBQUM7WUFDdEQsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNoQixNQUFNLEVBQUUsK0NBQStDO1NBQ3hELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYmluJztcbmltcG9ydCB7TW9kZWwsIE1vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQge0JpblRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge1ZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICByZXR1cm4gQmluTm9kZS5tYWtlQmluRnJvbUVuY29kaW5nKG1vZGVsKS5hc3NlbWJsZSgpO1xufVxuXG5mdW5jdGlvbiBhc3NlbWJsZUZyb21UcmFuc2Zvcm0obW9kZWw6IE1vZGVsLCB0OiBCaW5UcmFuc2Zvcm0pIHtcbiAgcmV0dXJuIEJpbk5vZGUubWFrZUZyb21UcmFuc2Zvcm0odCwge21vZGVsfSkuYXNzZW1ibGUoKTtcbn1cblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9iaW4nLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCBhZGQgYmluIHRyYW5zZm9ybSBhbmQgY29ycmVjdGx5IGFwcGx5IGJpbiB3aXRoIGN1c3RvbSBleHRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICBlbmNvZGluZzoge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgYmluOiB7ZXh0ZW50OiBbMCwgMTAwXX0sXG4gICAgICAgICAgJ2ZpZWxkJzogJ0FjY2VsZXJhdGlvbicsXG4gICAgICAgICAgJ3R5cGUnOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPihhc3NlbWJsZUZyb21FbmNvZGluZyhtb2RlbClbMF0sIHtcbiAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgYXM6IFsnYmluX2V4dGVudF8wXzEwMF9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbicsICdiaW5fZXh0ZW50XzBfMTAwX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2VuZCddLFxuICAgICAgbWF4YmluczogMTAsXG4gICAgICBleHRlbnQ6IFswLCAxMDBdLFxuICAgICAgc2lnbmFsOiBcImJpbl9leHRlbnRfMF8xMDBfbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fYmluc1wiLFxuICAgIH0pO1xuICB9KTtcblxuICBpdCAoJ3Nob3VsZCBhZGQgYmluIHRyYW5zZm9ybSBhbmQgY29ycmVjdGx5IGFwcGx5IGJpbiBmb3IgYmlubmVkIGZpZWxkIHdpdGhvdXQgY3VzdG9tIGV4dGVudCcsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICBlbmNvZGluZzoge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgYmluOiB0cnVlLFxuICAgICAgICAgICdmaWVsZCc6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgICAgICd0eXBlJzogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHRyYW5zZm9ybS5sZW5ndGgsIDIpO1xuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KHRyYW5zZm9ybVswXSwge1xuICAgICAgdHlwZTogJ2V4dGVudCcsXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBzaWduYWw6ICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fZXh0ZW50J1xuICAgIH0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KHRyYW5zZm9ybVsxXSwge1xuICAgICAgdHlwZTogJ2JpbicsXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBhczogWydiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb24nLCAnYmluX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2VuZCddLFxuICAgICAgbWF4YmluczogMTAsXG4gICAgICBzaWduYWw6ICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fYmlucycsXG4gICAgICBleHRlbnQ6IHtzaWduYWw6ICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fZXh0ZW50J31cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhcHBseSB0aGUgYmluIHRyYW5zZm9ybSBvbmx5IG9uY2UgZm9yIGEgYmlubmVkIGZpZWxkIGVuY29kZWQgaW4gbXVsdGlwbGUgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBkYXRhOiB7dXJsOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICBtYXJrOiBcImNpcmNsZVwiLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIGJpbjogdHJ1ZSxcbiAgICAgICAgICBmaWVsZDogXCJSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCIsXG4gICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICB9LFxuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGJpbjoge1wibWF4Ymluc1wiOiAxMH0sXG4gICAgICAgICAgZmllbGQ6IFwiUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiLFxuICAgICAgICAgIHR5cGU6IFwib3JkaW5hbFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBhc3NlbWJsZUZyb21FbmNvZGluZyhtb2RlbCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbCh0cmFuc2Zvcm0ubGVuZ3RoLCAzKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtPih0cmFuc2Zvcm1bMF0sIHtcbiAgICAgIHR5cGU6ICdleHRlbnQnLFxuICAgICAgZmllbGQ6ICdSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nJyxcbiAgICAgIHNpZ25hbDogJ2Jpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdfZXh0ZW50J1xuICAgIH0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KHRyYW5zZm9ybVsxXSwge1xuICAgICAgdHlwZTogJ2JpbicsXG4gICAgICBmaWVsZDogJ1JvdHRlbl9Ub21hdG9lc19SYXRpbmcnLFxuICAgICAgYXM6XG4gICAgICBbICdiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nJyxcbiAgICAgICAgJ2Jpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdfZW5kJyBdLFxuICAgICAgc2lnbmFsOiAnYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ19iaW5zJyxcbiAgICAgIG1heGJpbnM6IDEwLFxuICAgICAgZXh0ZW50OiB7c2lnbmFsOiAnYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ19leHRlbnQnfVxuICAgIH0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KHRyYW5zZm9ybVsyXSwge1xuICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgYXM6ICdiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nX3JhbmdlJyxcbiAgICAgIGV4cHI6IGBkYXR1bVtcImJpbl9tYXhiaW5zXzEwX1JvdHRlbl9Ub21hdG9lc19SYXRpbmdcIl0gPT09IG51bGwgfHwgaXNOYU4oZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9Sb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCJdKSA/IFwibnVsbFwiIDogZm9ybWF0KGRhdHVtW1wiYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiXSwgXCJcIikgKyBcIiAtIFwiICsgZm9ybWF0KGRhdHVtW1wiYmluX21heGJpbnNfMTBfUm90dGVuX1RvbWF0b2VzX1JhdGluZ19lbmRcIl0sIFwiXCIpYFxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFkZCBiaW4gdHJhbnNmb3JtIGZyb20gdHJhbnNmb3JtIGFycmF5IGFuZCBjb3JyZWN0bHkgYXBwbHkgYmluIHdpdGggY3VzdG9tIGV4dGVudCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHQ6IEJpblRyYW5zZm9ybSA9IHtcbiAgICAgIGJpbjoge2V4dGVudDogWzAsIDEwMF19LFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgYXM6ICdiaW5uZWRfYWNjZWxlcmF0aW9uJ1xuICAgIH07XG5cbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIGRhdGE6IHt1cmw6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgIG1hcms6IFwiY2lyY2xlXCIsXG4gICAgICB0cmFuc2Zvcm06IFt0XSxcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHg6IHtcbiAgICAgICAgICBmaWVsZDogXCJSb3R0ZW5fVG9tYXRvZXNfUmF0aW5nXCIsXG4gICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICB9LFxuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGZpZWxkOiBcIlJvdHRlbl9Ub21hdG9lc19SYXRpbmdcIixcbiAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm0+KGFzc2VtYmxlRnJvbVRyYW5zZm9ybShtb2RlbCwgdClbMF0sIHtcbiAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgZmllbGQ6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgXCJtYXhiaW5zXCI6IDEwLFxuICAgICAgYXM6IFsnYmlubmVkX2FjY2VsZXJhdGlvbicsICdiaW5uZWRfYWNjZWxlcmF0aW9uX2VuZCddLFxuICAgICAgZXh0ZW50OiBbMCwgMTAwXSxcbiAgICAgIHNpZ25hbDogXCJiaW5fZXh0ZW50XzBfMTAwX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX2JpbnNcIixcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgYmluIHRyYW5zZm9ybSBmcm9tIHRyYW5zZm9ybSBhcnJheSBhbmQgY29ycmVjdGx5IGFwcGx5IGJpbiB3aXRoIGN1c3RvbSBleHRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0OiBCaW5UcmFuc2Zvcm0gPSB7XG4gICAgICBiaW46IHtleHRlbnQ6IFswLCAxMDBdLCBtYXhiaW5zOiAyMH0sXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBhczogJ2Jpbm5lZF9hY2NlbGVyYXRpb24nXG4gICAgfTtcblxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgZGF0YToge3VybDogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgbWFyazogXCJjaXJjbGVcIixcbiAgICAgIHRyYW5zZm9ybTogW3RdLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIGZpZWxkOiBcIlJvdHRlbl9Ub21hdG9lc19SYXRpbmdcIixcbiAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgZmllbGQ6IFwiUm90dGVuX1RvbWF0b2VzX1JhdGluZ1wiLFxuICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybT4oYXNzZW1ibGVGcm9tVHJhbnNmb3JtKG1vZGVsLCB0KVswXSwge1xuICAgICAgdHlwZTogJ2JpbicsXG4gICAgICBmaWVsZDogJ0FjY2VsZXJhdGlvbicsXG4gICAgICBcIm1heGJpbnNcIjogMjAsXG4gICAgICBhczogWydiaW5uZWRfYWNjZWxlcmF0aW9uJywgJ2Jpbm5lZF9hY2NlbGVyYXRpb25fZW5kJ10sXG4gICAgICBleHRlbnQ6IFswLCAxMDBdLFxuICAgICAgc2lnbmFsOiBcImJpbl9leHRlbnRfMF8xMDBfbWF4Ymluc18yMF9BY2NlbGVyYXRpb25fYmluc1wiLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19