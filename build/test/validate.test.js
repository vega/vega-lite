"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mark_1 = require("../src/mark");
var validate_1 = require("../src/validate");
describe('vl.validate', function () {
    describe('getEncodingMappingError()', function () {
        it('should return no error for valid specs', function () {
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'a', type: 'quantitative' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
                }
            }));
        });
        it('should return error for invalid specs', function () {
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b', type: 'quantitative' } // missing y
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    y: { field: 'b', type: 'quantitative' } // missing x
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.TEXT,
                encoding: {
                    y: { field: 'b', type: 'quantitative' } // missing text
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with line
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with area
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with bar
                }
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdmFsaWRhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixvQ0FBa0Q7QUFDbEQsNENBQXdEO0FBRXhELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxhQUFNLENBQUMsTUFBTSxDQUFDLGtDQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsVUFBRztnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN0QzthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosYUFBTSxDQUFDLE1BQU0sQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN0QzthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosYUFBTSxDQUFDLE1BQU0sQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN0QzthQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLFlBQVk7aUJBQ25EO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixhQUFNLENBQUMsU0FBUyxDQUFDLGtDQUF1QixDQUFDO2dCQUN2QyxJQUFJLEVBQUUsV0FBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUMsWUFBWTtpQkFDbkQ7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLGFBQU0sQ0FBQyxTQUFTLENBQUMsa0NBQXVCLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxXQUFJO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxlQUFlO2lCQUN0RDthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLFdBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLHdCQUF3QjtpQkFDbkU7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLGFBQU0sQ0FBQyxTQUFTLENBQUMsa0NBQXVCLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxXQUFJO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyx3QkFBd0I7aUJBQ25FO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixhQUFNLENBQUMsU0FBUyxDQUFDLGtDQUF1QixDQUFDO2dCQUN2QyxJQUFJLEVBQUUsVUFBRztnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUMsdUJBQXVCO2lCQUNsRTthQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=