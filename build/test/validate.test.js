import { assert } from 'chai';
import { AREA, BAR, LINE, TEXT } from '../src/mark';
import { getEncodingMappingError } from '../src/validate';
describe('vl.validate', function () {
    describe('getEncodingMappingError()', function () {
        it('should return no error for valid specs', function () {
            assert.isNull(getEncodingMappingError({
                mark: BAR,
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }));
            assert.isNull(getEncodingMappingError({
                mark: LINE,
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'a', type: 'quantitative' }
                }
            }));
            assert.isNull(getEncodingMappingError({
                mark: AREA,
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
                }
            }));
        });
        it('should return error for invalid specs', function () {
            assert.isNotNull(getEncodingMappingError({
                mark: LINE,
                encoding: {
                    x: { field: 'b', type: 'quantitative' } // missing y
                }
            }));
            assert.isNotNull(getEncodingMappingError({
                mark: AREA,
                encoding: {
                    y: { field: 'b', type: 'quantitative' } // missing x
                }
            }));
            assert.isNotNull(getEncodingMappingError({
                mark: TEXT,
                encoding: {
                    y: { field: 'b', type: 'quantitative' } // missing text
                }
            }));
            assert.isNotNull(getEncodingMappingError({
                mark: LINE,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with line
                }
            }));
            assert.isNotNull(getEncodingMappingError({
                mark: AREA,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with area
                }
            }));
            assert.isNotNull(getEncodingMappingError({
                mark: BAR,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with bar
                }
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdmFsaWRhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDbEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFeEQsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1lBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxHQUFHO2dCQUNULFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3RDO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNyQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3RDO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNyQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3RDO2FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDO2dCQUN2QyxJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUMsWUFBWTtpQkFDbkQ7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxJQUFJO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxZQUFZO2lCQUNuRDthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLGVBQWU7aUJBQ3REO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDO2dCQUN2QyxJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUMsd0JBQXdCO2lCQUNuRTthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLHdCQUF3QjtpQkFDbkU7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxHQUFHO2dCQUNULFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyx1QkFBdUI7aUJBQ2xFO2FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0FSRUEsIEJBUiwgTElORSwgVEVYVH0gZnJvbSAnLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtnZXRFbmNvZGluZ01hcHBpbmdFcnJvcn0gZnJvbSAnLi4vc3JjL3ZhbGlkYXRlJztcblxuZGVzY3JpYmUoJ3ZsLnZhbGlkYXRlJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdnZXRFbmNvZGluZ01hcHBpbmdFcnJvcigpJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vIGVycm9yIGZvciB2YWxpZCBzcGVjcycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmlzTnVsbChnZXRFbmNvZGluZ01hcHBpbmdFcnJvcih7XG4gICAgICAgIG1hcms6IEJBUixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgYXNzZXJ0LmlzTnVsbChnZXRFbmNvZGluZ01hcHBpbmdFcnJvcih7XG4gICAgICAgIG1hcms6IExJTkUsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgYXNzZXJ0LmlzTnVsbChnZXRFbmNvZGluZ01hcHBpbmdFcnJvcih7XG4gICAgICAgIG1hcms6IEFSRUEsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVycm9yIGZvciBpbnZhbGlkIHNwZWNzJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGdldEVuY29kaW5nTWFwcGluZ0Vycm9yKHtcbiAgICAgICAgbWFyazogTElORSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9IC8vIG1pc3NpbmcgeVxuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIGFzc2VydC5pc05vdE51bGwoZ2V0RW5jb2RpbmdNYXBwaW5nRXJyb3Ioe1xuICAgICAgICBtYXJrOiBBUkVBLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30gLy8gbWlzc2luZyB4XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgYXNzZXJ0LmlzTm90TnVsbChnZXRFbmNvZGluZ01hcHBpbmdFcnJvcih7XG4gICAgICAgIG1hcms6IFRFWFQsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSAvLyBtaXNzaW5nIHRleHRcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGdldEVuY29kaW5nTWFwcGluZ0Vycm9yKHtcbiAgICAgICAgbWFyazogTElORSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBzaGFwZToge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSAvLyB1c2luZyBzaGFwZSB3aXRoIGxpbmVcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGdldEVuY29kaW5nTWFwcGluZ0Vycm9yKHtcbiAgICAgICAgbWFyazogQVJFQSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBzaGFwZToge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSAvLyB1c2luZyBzaGFwZSB3aXRoIGFyZWFcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGdldEVuY29kaW5nTWFwcGluZ0Vycm9yKHtcbiAgICAgICAgbWFyazogQkFSLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHNoYXBlOiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9IC8vIHVzaW5nIHNoYXBlIHdpdGggYmFyXG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==