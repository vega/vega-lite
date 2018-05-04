"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var window_1 = require("../../../src/compile/data/window");
describe('compile/data/window', function () {
    describe('TestWindowTransform()', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                window: [
                    {
                        op: 'row_number',
                        as: 'ordered_row_number',
                    },
                ],
                ignorePeers: false,
                sort: [
                    {
                        field: 'f',
                        order: 'ascending'
                    }
                ],
                groupby: ['f'],
                frame: [null, 0]
            };
            var window = new window_1.WindowTransformNode(null, transform);
            chai_1.assert.deepEqual(window.assemble(), {
                type: 'window',
                ops: ['row_number'],
                fields: [null],
                params: [null],
                sort: {
                    field: ["f"],
                    order: ["ascending"],
                },
                ignorePeers: false,
                as: ['ordered_row_number'],
                frame: [null, 0],
                groupby: ['f']
            });
        });
        it('should return a producer proper fields', function () {
            var transform = {
                window: [
                    {
                        op: 'row_number',
                        as: 'ordered_row_number',
                    },
                    {
                        op: 'count',
                        as: 'count_field'
                    },
                    {
                        op: 'sum',
                        as: 'sum_field'
                    }
                ],
                ignorePeers: false,
                sort: [
                    {
                        field: 'f',
                        order: 'ascending'
                    }
                ],
                groupby: ['f'],
                frame: [null, 0]
            };
            var window = new window_1.WindowTransformNode(null, transform);
            chai_1.assert.deepEqual({ "count_field": true, "ordered_row_number": true, "sum_field": true }, window.producedFields());
        });
        it('should clone to an equivalent version', function () {
            var transform = {
                window: [
                    {
                        op: 'row_number',
                        as: 'ordered_row_number',
                    },
                ],
                ignorePeers: false,
                sort: [
                    {
                        field: 'f',
                        order: 'ascending'
                    }
                ],
                groupby: ['f'],
                frame: [null, 0]
            };
            var window = new window_1.WindowTransformNode(null, transform);
            chai_1.assert.deepEqual(window, window.clone());
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS93aW5kb3cudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQXFFO0FBR3JFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMsRUFBRSxDQUFFLHFDQUFxQyxFQUFFO1lBQ3pDLElBQU0sU0FBUyxHQUFjO2dCQUMzQixNQUFNLEVBQUU7b0JBQ047d0JBQ0UsRUFBRSxFQUFFLFlBQVk7d0JBQ2hCLEVBQUUsRUFBRSxvQkFBb0I7cUJBQ3pCO2lCQUNGO2dCQUNELFdBQVcsRUFBRSxLQUFLO2dCQUNsQixJQUFJLEVBQ0Y7b0JBQ0U7d0JBQ0UsS0FBSyxFQUFDLEdBQUc7d0JBQ1QsS0FBSyxFQUFDLFdBQVc7cUJBQ2xCO2lCQUNGO2dCQUNILE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDZCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ2pCLENBQUM7WUFDRixJQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFtQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDbEMsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNkLElBQUksRUFBRztvQkFDTCxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDO2lCQUNyQjtnQkFDRCxXQUFXLEVBQUUsS0FBSztnQkFDbEIsRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQzthQUNmLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFFLHdDQUF3QyxFQUFFO1lBQzVDLElBQU0sU0FBUyxHQUFjO2dCQUMzQixNQUFNLEVBQUU7b0JBQ047d0JBQ0UsRUFBRSxFQUFFLFlBQVk7d0JBQ2hCLEVBQUUsRUFBRSxvQkFBb0I7cUJBQ3pCO29CQUNEO3dCQUNFLEVBQUUsRUFBRSxPQUFPO3dCQUNYLEVBQUUsRUFBRSxhQUFhO3FCQUNsQjtvQkFDRDt3QkFDRSxFQUFFLEVBQUUsS0FBSzt3QkFDVCxFQUFFLEVBQUUsV0FBVztxQkFDaEI7aUJBQ0Y7Z0JBQ0QsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLElBQUksRUFDRjtvQkFDRTt3QkFDRSxLQUFLLEVBQUMsR0FBRzt3QkFDVCxLQUFLLEVBQUMsV0FBVztxQkFDbEI7aUJBQ0Y7Z0JBQ0gsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNkLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDakIsQ0FBQztZQUNGLElBQU0sTUFBTSxHQUFHLElBQUksNEJBQW1CLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELGFBQU0sQ0FBQyxTQUFTLENBQUMsRUFBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDbEgsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUUsdUNBQXVDLEVBQUU7WUFDM0MsSUFBTSxTQUFTLEdBQWM7Z0JBQzNCLE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxFQUFFLEVBQUUsWUFBWTt3QkFDaEIsRUFBRSxFQUFFLG9CQUFvQjtxQkFDekI7aUJBQ0Y7Z0JBQ0QsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLElBQUksRUFDRjtvQkFDRTt3QkFDRSxLQUFLLEVBQUMsR0FBRzt3QkFDVCxLQUFLLEVBQUMsV0FBVztxQkFDbEI7aUJBQ0Y7Z0JBQ0gsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNkLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDakIsQ0FBQztZQUNGLElBQU0sTUFBTSxHQUFHLElBQUksNEJBQW1CLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvd2luZG93JztcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdHJhbnNmb3JtJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS93aW5kb3cnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdUZXN0V2luZG93VHJhbnNmb3JtKCknLCAoKSA9PiB7XG4gICAgaXQgKCdzaG91bGQgcmV0dXJuIGEgcHJvcGVyIHZnIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgc29ydDpcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOidmJyxcbiAgICAgICAgICAgICAgb3JkZXI6J2FzY2VuZGluZydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICBncm91cGJ5OiBbJ2YnXSxcbiAgICAgICAgZnJhbWU6IFtudWxsLCAwXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHdpbmRvdy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICd3aW5kb3cnLFxuICAgICAgICBvcHM6IFsncm93X251bWJlciddLFxuICAgICAgICBmaWVsZHM6IFtudWxsXSxcbiAgICAgICAgcGFyYW1zOiBbbnVsbF0sXG4gICAgICAgIHNvcnQgOiB7XG4gICAgICAgICAgZmllbGQ6IFtcImZcIl0sXG4gICAgICAgICAgb3JkZXI6IFtcImFzY2VuZGluZ1wiXSxcbiAgICAgICAgfSxcbiAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICBhczogWydvcmRlcmVkX3Jvd19udW1iZXInXSxcbiAgICAgICAgZnJhbWU6IFtudWxsLCAwXSxcbiAgICAgICAgZ3JvdXBieTogWydmJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIHByb2R1Y2VyIHByb3BlciBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgd2luZG93OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAnY291bnQnLFxuICAgICAgICAgICAgYXM6ICdjb3VudF9maWVsZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAnc3VtJyxcbiAgICAgICAgICAgIGFzOiAnc3VtX2ZpZWxkJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICBzb3J0OlxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6J2YnLFxuICAgICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIGdyb3VwYnk6IFsnZiddLFxuICAgICAgICBmcmFtZTogW251bGwsIDBdXG4gICAgICB9O1xuICAgICAgY29uc3Qgd2luZG93ID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUobnVsbCwgdHJhbnNmb3JtKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoe1wiY291bnRfZmllbGRcIjogdHJ1ZSwgXCJvcmRlcmVkX3Jvd19udW1iZXJcIjogdHJ1ZSwgXCJzdW1fZmllbGRcIjogdHJ1ZX0sIHdpbmRvdy5wcm9kdWNlZEZpZWxkcygpKTtcbiAgICB9KTtcbiAgICBpdCAoJ3Nob3VsZCBjbG9uZSB0byBhbiBlcXVpdmFsZW50IHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgd2luZG93OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICAgIHNvcnQ6XG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgZ3JvdXBieTogWydmJ10sXG4gICAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICAgIH07XG4gICAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh3aW5kb3csIHdpbmRvdy5jbG9uZSgpKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==