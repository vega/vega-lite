/* tslint:disable:quotemark */
import { assert } from 'chai';
import { WindowTransformNode } from '../../../src/compile/data/window';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS93aW5kb3cudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUdyRSxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLElBQU0sU0FBUyxHQUFjO1lBQzNCLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxFQUFFLEVBQUUsWUFBWTtvQkFDaEIsRUFBRSxFQUFFLG9CQUFvQjtpQkFDekI7YUFDRjtZQUNELFdBQVcsRUFBRSxLQUFLO1lBQ2xCLElBQUksRUFDRjtnQkFDRTtvQkFDRSxLQUFLLEVBQUUsR0FBRztvQkFDVixLQUFLLEVBQUUsV0FBVztpQkFDbkI7YUFDRjtZQUNILE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNkLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDakIsQ0FBQztRQUNGLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQW1CLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2xDLElBQUksRUFBRSxRQUFRO1lBQ2QsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ25CLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztZQUNkLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztZQUNkLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ1osS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDO2FBQ3JCO1lBQ0QsV0FBVyxFQUFFLEtBQUs7WUFDbEIs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SyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNqQixDQUFDO1FBQ0YsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvd2luZG93JztcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdHJhbnNmb3JtJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS93aW5kb3cnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgcHJvcGVyIHZnIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgIHdpbmRvdzogW1xuICAgICAgICB7XG4gICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgc29ydDpcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpZWxkOiAnZicsXG4gICAgICAgICAgICBvcmRlcjogJ2FzY2VuZGluZydcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICBncm91cGJ5OiBbJ2YnXSxcbiAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICB9O1xuICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbCh3aW5kb3cuYXNzZW1ibGUoKSwge1xuICAgICAgdHlwZTogJ3dpbmRvdycsXG4gICAgICBvcHM6IFsncm93X251bWJlciddLFxuICAgICAgZmllbGRzOiBbbnVsbF0sXG4gICAgICBwYXJhbXM6IFtudWxsXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFtcImZcIl0sXG4gICAgICAgIG9yZGVyOiBbXCJhc2NlbmRpbmdcIl0sXG4gICAgICB9LFxuICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgYXM6IFsnb3JkZXJlZF9yb3dfbnVtYmVyJ10sXG4gICAgICBmcmFtZTogW251bGwsIDBdLFxuICAgICAgZ3JvdXBieTogWydmJ11cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhdWdtZW50IGFzIHdpdGggZGVmYXVsdCBhcycsICgpID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgIHdpbmRvdzogW1xuICAgICAgICB7XG4gICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICBhczogdW5kZWZpbmVkIC8vIGludGVudGlvbmFsbHkgb21pdCBmb3IgdGVzdGluZ1xuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgIHNvcnQ6XG4gICAgICAgIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWVsZDogJ2YnLFxuICAgICAgICAgICAgb3JkZXI6ICdhc2NlbmRpbmcnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgZ3JvdXBieTogWydmJ10sXG4gICAgICBmcmFtZTogW251bGwsIDBdXG4gICAgfTtcbiAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShudWxsLCB0cmFuc2Zvcm0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwod2luZG93LmFzc2VtYmxlKCksIHtcbiAgICAgIHR5cGU6ICd3aW5kb3cnLFxuICAgICAgb3BzOiBbJ3Jvd19udW1iZXInXSxcbiAgICAgIGZpZWxkczogW251bGxdLFxuICAgICAgcGFyYW1zOiBbbnVsbF0sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbXCJmXCJdLFxuICAgICAgICBvcmRlcjogW1wiYXNjZW5kaW5nXCJdLFxuICAgICAgfSxcbiAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgIGFzOiBbJ3Jvd19udW1iZXInXSxcbiAgICAgIGZyYW1lOiBbbnVsbCwgMF0sXG4gICAgICBncm91cGJ5OiBbJ2YnXVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHByb3BlciBwcm9kdWNlZCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICB3aW5kb3c6IFtcbiAgICAgICAge1xuICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3A6ICdjb3VudCcsXG4gICAgICAgICAgYXM6ICdjb3VudF9maWVsZCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9wOiAnc3VtJyxcbiAgICAgICAgICBhczogJ3N1bV9maWVsZCdcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgIHNvcnQ6XG4gICAgICAgIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIGdyb3VwYnk6IFsnZiddLFxuICAgICAgZnJhbWU6IFtudWxsLCAwXVxuICAgIH07XG4gICAgY29uc3Qgd2luZG93ID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUobnVsbCwgdHJhbnNmb3JtKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHtcImNvdW50X2ZpZWxkXCI6IHRydWUsIFwib3JkZXJlZF9yb3dfbnVtYmVyXCI6IHRydWUsIFwic3VtX2ZpZWxkXCI6IHRydWV9LCB3aW5kb3cucHJvZHVjZWRGaWVsZHMoKSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY2xvbmUgdG8gYW4gZXF1aXZhbGVudCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgd2luZG93OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICBzb3J0OlxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmllbGQ6J2YnLFxuICAgICAgICAgICAgb3JkZXI6J2FzY2VuZGluZydcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICBncm91cGJ5OiBbJ2YnXSxcbiAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICB9O1xuICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbCh3aW5kb3csIHdpbmRvdy5jbG9uZSgpKTtcbiAgfSk7XG59KTtcbiJdfQ==