"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var validate_1 = require("../src/validate");
var mark_1 = require("../src/mark");
describe('vl.validate', function () {
    describe('getEncodingMappingError()', function () {
        it('should return no error for valid specs', function () {
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    x: { field: 'a' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b' },
                    y: { field: 'a' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    x: { field: 'a' },
                    y: { field: 'b' }
                }
            }));
        });
        it('should return error for invalid specs', function () {
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b' } // missing y
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    y: { field: 'b' } // missing x
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.TEXT,
                encoding: {
                    y: { field: 'b' } // missing text
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    shape: { field: 'b' } // using shape with line
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    shape: { field: 'b' } // using shape with area
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    shape: { field: 'b' } // using shape with bar
                }
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdmFsaWRhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1Qiw0Q0FBd0Q7QUFDeEQsb0NBQWtEO0FBRWxELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxhQUFNLENBQUMsTUFBTSxDQUFDLGtDQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsVUFBRztnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztpQkFDaEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLGFBQU0sQ0FBQyxNQUFNLENBQUMsa0NBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxXQUFJO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO29CQUNmLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7aUJBQ2hCO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixhQUFNLENBQUMsTUFBTSxDQUFDLGtDQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsV0FBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztvQkFDZixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO2lCQUNoQjthQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxZQUFZO2lCQUM3QjthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxZQUFZO2lCQUM3QjthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxlQUFlO2lCQUNoQzthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyx3QkFBd0I7aUJBQzdDO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixhQUFNLENBQUMsU0FBUyxDQUFDLGtDQUF1QixDQUFDO2dCQUN2QyxJQUFJLEVBQUUsV0FBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLHdCQUF3QjtpQkFDN0M7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLGFBQU0sQ0FBQyxTQUFTLENBQUMsa0NBQXVCLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxVQUFHO2dCQUNULFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsdUJBQXVCO2lCQUM1QzthQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=