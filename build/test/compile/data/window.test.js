/* tslint:disable:quotemark */
import { assert } from 'chai';
import { WindowTransformNode } from '../../../src/compile/data/window';
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
            var window = new WindowTransformNode(null, transform);
            assert.deepEqual(window.assemble(), {
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
            var window = new WindowTransformNode(null, transform);
            assert.deepEqual({ "count_field": true, "ordered_row_number": true, "sum_field": true }, window.producedFields());
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
            var window = new WindowTransformNode(null, transform);
            assert.deepEqual(window, window.clone());
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS93aW5kb3cudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUdyRSxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBRSxxQ0FBcUMsRUFBRTtZQUN6QyxJQUFNLFNBQVMsR0FBYztnQkFDM0IsTUFBTSxFQUFFO29CQUNOO3dCQUNFLEVBQUUsRUFBRSxZQUFZO3dCQUNoQixFQUFFLEVBQUUsb0JBQW9CO3FCQUN6QjtpQkFDRjtnQkFDRCxXQUFXLEVBQUUsS0FBSztnQkFDbEIsSUFBSSxFQUNGO29CQUNFO3dCQUNFLEtBQUssRUFBQyxHQUFHO3dCQUNULEtBQUssRUFBQyxXQUFXO3FCQUNsQjtpQkFDRjtnQkFDSCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2QsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNqQixDQUFDO1lBQ0YsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2xDLElBQUksRUFBRSxRQUFRO2dCQUNkLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDbkIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNkLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDZCxJQUFJLEVBQUc7b0JBQ0wsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNaLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDckI7Z0JBQ0QsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2dCQUMxQixLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBRSx3Q0FBd0MsRUFBRTtZQUM1QyxJQUFNLFNBQVMsR0FBYztnQkFDM0IsTUFBTSxFQUFFO29CQUNOO3dCQUNFLEVBQUUsRUFBRSxZQUFZO3dCQUNoQixFQUFFLEVBQUUsb0JBQW9CO3FCQUN6QjtvQkFDRDt3QkFDRSxFQUFFLEVBQUUsT0FBTzt3QkFDWCxFQUFFLEVBQUUsYUFBYTtxQkFDbEI7b0JBQ0Q7d0JBQ0UsRUFBRSxFQUFFLEtBQUs7d0JBQ1QsRUFBRSxFQUFFLFdBQVc7cUJBQ2hCO2lCQUNGO2dCQUNELFdBQVcsRUFBRSxLQUFLO2dCQUNsQixJQUFJLEVBQ0Y7b0JBQ0U7d0JBQ0UsS0FBSyxFQUFDLEdBQUc7d0JBQ1QsS0FBSyxFQUFDLFdBQVc7cUJBQ2xCO2lCQUNGO2dCQUNILE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDZCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ2pCLENBQUM7WUFDRixJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFtQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2xILENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFFLHVDQUF1QyxFQUFFO1lBQzNDLElBQU0sU0FBUyxHQUFjO2dCQUMzQixNQUFNLEVBQUU7b0JBQ047d0JBQ0UsRUFBRSxFQUFFLFlBQVk7d0JBQ2hCLEVBQUUsRUFBRSxvQkFBb0I7cUJBQ3pCO2lCQUNGO2dCQUNELFdBQVcsRUFBRSxLQUFLO2dCQUNsQixJQUFJLEVBQ0Y7b0JBQ0U7d0JBQ0UsS0FBSyxFQUFDLEdBQUc7d0JBQ1QsS0FBSyxFQUFDLFdBQVc7cUJBQ2xCO2lCQUNGO2dCQUNILE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDZCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ2pCLENBQUM7WUFDRixJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFtQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtXaW5kb3dUcmFuc2Zvcm1Ob2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3dpbmRvdyc7XG5pbXBvcnQge1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvd2luZG93JywgKCkgPT4ge1xuICBkZXNjcmliZSgnVGVzdFdpbmRvd1RyYW5zZm9ybSgpJywgKCkgPT4ge1xuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIHByb3BlciB2ZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgd2luZG93OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICAgIHNvcnQ6XG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgZ3JvdXBieTogWydmJ10sXG4gICAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICAgIH07XG4gICAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh3aW5kb3cuYXNzZW1ibGUoKSwge1xuICAgICAgICB0eXBlOiAnd2luZG93JyxcbiAgICAgICAgb3BzOiBbJ3Jvd19udW1iZXInXSxcbiAgICAgICAgZmllbGRzOiBbbnVsbF0sXG4gICAgICAgIHBhcmFtczogW251bGxdLFxuICAgICAgICBzb3J0IDoge1xuICAgICAgICAgIGZpZWxkOiBbXCJmXCJdLFxuICAgICAgICAgIG9yZGVyOiBbXCJhc2NlbmRpbmdcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgYXM6IFsnb3JkZXJlZF9yb3dfbnVtYmVyJ10sXG4gICAgICAgIGZyYW1lOiBbbnVsbCwgMF0sXG4gICAgICAgIGdyb3VwYnk6IFsnZiddXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpdCAoJ3Nob3VsZCByZXR1cm4gYSBwcm9kdWNlciBwcm9wZXIgZmllbGRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ2NvdW50JyxcbiAgICAgICAgICAgIGFzOiAnY291bnRfZmllbGQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ3N1bScsXG4gICAgICAgICAgICBhczogJ3N1bV9maWVsZCdcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgc29ydDpcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOidmJyxcbiAgICAgICAgICAgICAgb3JkZXI6J2FzY2VuZGluZydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICBncm91cGJ5OiBbJ2YnXSxcbiAgICAgICAgZnJhbWU6IFtudWxsLCAwXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHtcImNvdW50X2ZpZWxkXCI6IHRydWUsIFwib3JkZXJlZF9yb3dfbnVtYmVyXCI6IHRydWUsIFwic3VtX2ZpZWxkXCI6IHRydWV9LCB3aW5kb3cucHJvZHVjZWRGaWVsZHMoKSk7XG4gICAgfSk7XG4gICAgaXQgKCdzaG91bGQgY2xvbmUgdG8gYW4gZXF1aXZhbGVudCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICBzb3J0OlxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6J2YnLFxuICAgICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIGdyb3VwYnk6IFsnZiddLFxuICAgICAgICBmcmFtZTogW251bGwsIDBdXG4gICAgICB9O1xuICAgICAgY29uc3Qgd2luZG93ID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUobnVsbCwgdHJhbnNmb3JtKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwod2luZG93LCB3aW5kb3cuY2xvbmUoKSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=