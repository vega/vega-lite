"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var window_1 = require("../../../src/compile/data/window");
describe('compile/data/window', function () {
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
    it('should augment as with default as', function () {
        var transform = {
            window: [
                {
                    op: 'row_number',
                    as: undefined // intentionally omit for testing
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
            as: ['row_number'],
            frame: [null, 0],
            groupby: ['f']
        });
    });
    it('should return a proper produced fields', function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS93aW5kb3cudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQXFFO0FBR3JFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsSUFBTSxTQUFTLEdBQWM7WUFDM0IsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxZQUFZO29CQUNoQixFQUFFLEVBQUUsb0JBQW9CO2lCQUN6QjthQUNGO1lBQ0QsV0FBVyxFQUFFLEtBQUs7WUFDbEIsSUFBSSxFQUNGO2dCQUNFO29CQUNFLEtBQUssRUFBRSxHQUFHO29CQUNWLEtBQUssRUFBRSxXQUFXO2lCQUNuQjthQUNGO1lBQ0gsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2QsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNqQixDQUFDO1FBQ0YsSUFBTSxNQUFNLEdBQUcsSUFBSSw0QkFBbUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDbEMsSUFBSSxFQUFFLFFBQVE7WUFDZCxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDbkIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ2QsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ2QsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDWixLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDckI7WUFDRCxXQUFXLEVBQUUsS0FBSztZQUNsQixFQUFFLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztZQUMxQixLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1FBQ3RDLElBQU0sU0FBUyxHQUFjO1lBQzNCLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxFQUFFLEVBQUUsWUFBWTtvQkFDaEIsRUFBRSxFQUFFLFNBQVMsQ0FBQyxpQ0FBaUM7aUJBQ2hEO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsS0FBSztZQUNsQixJQUFJLEVBQ0Y7Z0JBQ0U7b0JBQ0UsS0FBSyxFQUFFLEdBQUc7b0JBQ1YsS0FBSyxFQUFFLFdBQVc7aUJBQ25CO2FBQ0Y7WUFDSCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDZCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCLENBQUM7UUFDRixJQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFtQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNsQyxJQUFJLEVBQUUsUUFBUTtZQUNkLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUNuQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDZCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDZCxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNaLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQzthQUNyQjtZQUNELFdBQVcsRUFBRSxLQUFLO1lBQ2xCLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUNsQixLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1FBQzNDLElBQU0sU0FBUyxHQUFjO1lBQzNCLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxFQUFFLEVBQUUsWUFBWTtvQkFDaEIsRUFBRSxFQUFFLG9CQUFvQjtpQkFDekI7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLE9BQU87b0JBQ1gsRUFBRSxFQUFFLGFBQWE7aUJBQ2xCO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxLQUFLO29CQUNULEVBQUUsRUFBRSxXQUFXO2lCQUNoQjthQUNGO1lBQ0QsV0FBVyxFQUFFLEtBQUs7WUFDbEIsSUFBSSxFQUNGO2dCQUNFO29CQUNFLEtBQUssRUFBQyxHQUFHO29CQUNULEtBQUssRUFBQyxXQUFXO2lCQUNsQjthQUNGO1lBQ0gsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2QsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNqQixDQUFDO1FBQ0YsSUFBTSxNQUFNLEdBQUcsSUFBSSw0QkFBbUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUNsSCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtRQUMxQyxJQUFNLFNBQVMsR0FBYztZQUMzQixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFlBQVk7b0JBQ2hCLEVBQUUsRUFBRSxvQkFBb0I7aUJBQ3pCO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsS0FBSztZQUNsQixJQUFJLEVBQ0Y7Z0JBQ0U7b0JBQ0UsS0FBSyxFQUFDLEdBQUc7b0JBQ1QsS0FBSyxFQUFDLFdBQVc7aUJBQ2xCO2FBQ0Y7WUFDSCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDZCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCLENBQUM7UUFDRixJQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFtQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cnO1xuaW1wb3J0IHtUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy90cmFuc2Zvcm0nO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3dpbmRvdycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBwcm9wZXIgdmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgd2luZG93OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICBzb3J0OlxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmllbGQ6ICdmJyxcbiAgICAgICAgICAgIG9yZGVyOiAnYXNjZW5kaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIGdyb3VwYnk6IFsnZiddLFxuICAgICAgZnJhbWU6IFtudWxsLCAwXVxuICAgIH07XG4gICAgY29uc3Qgd2luZG93ID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUobnVsbCwgdHJhbnNmb3JtKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHdpbmRvdy5hc3NlbWJsZSgpLCB7XG4gICAgICB0eXBlOiAnd2luZG93JyxcbiAgICAgIG9wczogWydyb3dfbnVtYmVyJ10sXG4gICAgICBmaWVsZHM6IFtudWxsXSxcbiAgICAgIHBhcmFtczogW251bGxdLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogW1wiZlwiXSxcbiAgICAgICAgb3JkZXI6IFtcImFzY2VuZGluZ1wiXSxcbiAgICAgIH0sXG4gICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICBhczogWydvcmRlcmVkX3Jvd19udW1iZXInXSxcbiAgICAgIGZyYW1lOiBbbnVsbCwgMF0sXG4gICAgICBncm91cGJ5OiBbJ2YnXVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGF1Z21lbnQgYXMgd2l0aCBkZWZhdWx0IGFzJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgd2luZG93OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgIGFzOiB1bmRlZmluZWQgLy8gaW50ZW50aW9uYWxseSBvbWl0IGZvciB0ZXN0aW5nXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgc29ydDpcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpZWxkOiAnZicsXG4gICAgICAgICAgICBvcmRlcjogJ2FzY2VuZGluZydcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICBncm91cGJ5OiBbJ2YnXSxcbiAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICB9O1xuICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbCh3aW5kb3cuYXNzZW1ibGUoKSwge1xuICAgICAgdHlwZTogJ3dpbmRvdycsXG4gICAgICBvcHM6IFsncm93X251bWJlciddLFxuICAgICAgZmllbGRzOiBbbnVsbF0sXG4gICAgICBwYXJhbXM6IFtudWxsXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFtcImZcIl0sXG4gICAgICAgIG9yZGVyOiBbXCJhc2NlbmRpbmdcIl0sXG4gICAgICB9LFxuICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgYXM6IFsncm93X251bWJlciddLFxuICAgICAgZnJhbWU6IFtudWxsLCAwXSxcbiAgICAgIGdyb3VwYnk6IFsnZiddXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgcHJvcGVyIHByb2R1Y2VkIGZpZWxkcycsICgpID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgIHdpbmRvdzogW1xuICAgICAgICB7XG4gICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcDogJ2NvdW50JyxcbiAgICAgICAgICBhczogJ2NvdW50X2ZpZWxkJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3A6ICdzdW0nLFxuICAgICAgICAgIGFzOiAnc3VtX2ZpZWxkJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgc29ydDpcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpZWxkOidmJyxcbiAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgZ3JvdXBieTogWydmJ10sXG4gICAgICBmcmFtZTogW251bGwsIDBdXG4gICAgfTtcbiAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShudWxsLCB0cmFuc2Zvcm0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoe1wiY291bnRfZmllbGRcIjogdHJ1ZSwgXCJvcmRlcmVkX3Jvd19udW1iZXJcIjogdHJ1ZSwgXCJzdW1fZmllbGRcIjogdHJ1ZX0sIHdpbmRvdy5wcm9kdWNlZEZpZWxkcygpKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjbG9uZSB0byBhbiBlcXVpdmFsZW50IHZlcnNpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICB3aW5kb3c6IFtcbiAgICAgICAge1xuICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgIHNvcnQ6XG4gICAgICAgIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIGdyb3VwYnk6IFsnZiddLFxuICAgICAgZnJhbWU6IFtudWxsLCAwXVxuICAgIH07XG4gICAgY29uc3Qgd2luZG93ID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUobnVsbCwgdHJhbnNmb3JtKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHdpbmRvdywgd2luZG93LmNsb25lKCkpO1xuICB9KTtcbn0pO1xuIl19