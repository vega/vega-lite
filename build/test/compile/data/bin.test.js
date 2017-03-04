/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../../../src/compile/data/bin");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/data/bin', function () {
    describe('parseUnit', function () {
        describe('binned field with custom extent', function () {
            it('should add bin transform and correctly apply bin', function () {
                var model = util_2.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            bin: { extent: [0, 100] },
                            'field': 'Acceleration',
                            'type': "quantitative"
                        }
                    }
                });
                var transform = util_1.vals(bin_1.bin.parseUnit(model))[0];
                chai_1.assert.deepEqual(transform[0], {
                    type: 'bin',
                    field: 'Acceleration',
                    as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
                    maxbins: 10,
                    extent: [0, 100]
                });
            });
        });
        describe('binned field without custom extent', function () {
            var model = util_2.parseUnitModel({
                mark: "point",
                encoding: {
                    y: {
                        bin: true,
                        'field': 'Acceleration',
                        'type': "quantitative"
                    }
                }
            });
            var transform = util_1.vals(bin_1.bin.parseUnit(model))[0];
            it('should add bin transform and correctly apply bin', function () {
                chai_1.assert.deepEqual(transform[0], {
                    type: 'extent',
                    field: 'Acceleration',
                    signal: 'Acceleration_extent'
                });
                chai_1.assert.deepEqual(transform[1], {
                    type: 'bin',
                    field: 'Acceleration',
                    as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
                    maxbins: 10,
                    extent: { signal: 'Acceleration_extent' }
                });
            });
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9iaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIscURBQWtEO0FBQ2xELDBDQUF1QztBQUV2QyxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsUUFBUSxDQUFDLGlDQUFpQyxFQUFFO1lBQzFDLEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtnQkFDckQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztvQkFDM0IsSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFO3dCQUNSLENBQUMsRUFBRTs0QkFDRCxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUM7NEJBQ3ZCLE9BQU8sRUFBRSxjQUFjOzRCQUN2QixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sU0FBUyxHQUFHLFdBQUksQ0FBQyxTQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixJQUFJLEVBQUUsS0FBSztvQkFDWCxLQUFLLEVBQUUsY0FBYztvQkFDckIsRUFBRSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsc0JBQXNCLENBQUM7b0JBQ3RELE9BQU8sRUFBRSxFQUFFO29CQUNYLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7aUJBQ2pCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsb0NBQW9DLEVBQUU7WUFDN0MsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxHQUFHLEVBQUUsSUFBSTt3QkFDVCxPQUFPLEVBQUUsY0FBYzt3QkFDdkIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxTQUFTLEdBQUcsV0FBSSxDQUFDLFNBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRCxFQUFFLENBQUMsa0RBQWtELEVBQUU7Z0JBQ3JELGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsY0FBYztvQkFDckIsTUFBTSxFQUFFLHFCQUFxQjtpQkFDOUIsQ0FBQyxDQUFDO2dCQUNILGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixJQUFJLEVBQUUsS0FBSztvQkFDWCxLQUFLLEVBQUUsY0FBYztvQkFDckIsRUFBRSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsc0JBQXNCLENBQUM7b0JBQ3RELE9BQU8sRUFBRSxFQUFFO29CQUNYLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxxQkFBcUIsRUFBQztpQkFDeEMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixtQkFBbUI7SUFDckIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLG1CQUFtQjtJQUNyQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsbUJBQW1CO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==