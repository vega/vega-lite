import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { defaultConfig, stripAndRedirectConfig } from '../src/config';
import { PRIMITIVE_MARKS } from '../src/mark';
import { duplicate } from '../src/util';
describe('config', function () {
    describe('stripAndRedirectConfig', function () {
        var config = tslib_1.__assign({}, defaultConfig, { mark: tslib_1.__assign({}, defaultConfig.mark, { opacity: 0.3 }), bar: tslib_1.__assign({ opacity: 0.5 }, defaultConfig.bar), view: {
                fill: '#eee'
            }, title: {
                color: 'red',
                fontWeight: 'bold'
            } });
        var copy = duplicate(config);
        var output = stripAndRedirectConfig(config);
        it('should not cause side-effect to the input', function () {
            assert.deepEqual(config, copy);
        });
        it('should remove VL only mark config but keep Vega mark config', function () {
            assert.isUndefined(output.mark.color);
            assert.equal(output.mark.opacity, 0.3);
        });
        it('should redirect mark config to style and remove VL only mark-specific config', function () {
            for (var _i = 0, PRIMITIVE_MARKS_1 = PRIMITIVE_MARKS; _i < PRIMITIVE_MARKS_1.length; _i++) {
                var mark = PRIMITIVE_MARKS_1[_i];
                assert.isUndefined(output[mark], mark + " config should be redirected");
            }
            assert.isUndefined(output.style.bar['binSpacing'], "VL only Bar config should be removed");
            assert.isUndefined(output.style.cell['width'], "VL only cell config should be removed");
            assert.isUndefined(output.style.cell['height'], "VL only cell config should be removed");
            assert.equal(output.style.cell['fill'], '#eee', "config.view should be redirect to config.style.cell");
            assert.deepEqual(output.style.bar.opacity, 0.5, 'Bar config should be redirected to config.style.bar');
        });
        it('should redirect config.title to config.style.group-title and rename color to fill', function () {
            assert.deepEqual(output.title, undefined);
            assert.deepEqual(output.style['group-title'].fontWeight, 'bold');
            assert.deepEqual(output.style['group-title'].fill, 'red');
        });
        it('should remove empty config object', function () {
            assert.isUndefined(output.axisTop);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2NvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBUyxhQUFhLEVBQUUsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRXRDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLElBQU0sTUFBTSx3QkFDUCxhQUFhLElBQ2hCLElBQUksdUJBQ0MsYUFBYSxDQUFDLElBQUksSUFDckIsT0FBTyxFQUFFLEdBQUcsS0FFZCxHQUFHLHFCQUNELE9BQU8sRUFBRSxHQUFHLElBQ1QsYUFBYSxDQUFDLEdBQUcsR0FFdEIsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxNQUFNO2FBQ2IsRUFDRCxLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osVUFBVSxFQUFFLE1BQU07YUFDbkIsR0FDRixDQUFDO1FBQ0YsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtZQUNoRSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4RUFBOEUsRUFBRTtZQUNqRixLQUFtQixVQUFlLEVBQWYsbUNBQWUsRUFBZiw2QkFBZSxFQUFmLElBQWU7Z0JBQTdCLElBQU0sSUFBSSx3QkFBQTtnQkFDYixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBSyxJQUFJLGlDQUE4QixDQUFDLENBQUM7YUFDekU7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7WUFDM0YsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3hGLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztZQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxxREFBcUQsQ0FBQyxDQUFDO1lBRXZHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxxREFBcUQsQ0FBQyxDQUFDO1FBQ3pHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1GQUFtRixFQUFFO1lBQ3RGLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NvbmZpZywgZGVmYXVsdENvbmZpZywgc3RyaXBBbmRSZWRpcmVjdENvbmZpZ30gZnJvbSAnLi4vc3JjL2NvbmZpZyc7XG5pbXBvcnQge1BSSU1JVElWRV9NQVJLU30gZnJvbSAnLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uL3NyYy91dGlsJztcblxuZGVzY3JpYmUoJ2NvbmZpZycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3N0cmlwQW5kUmVkaXJlY3RDb25maWcnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uZmlnOiBDb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgbWFyazoge1xuICAgICAgICAuLi5kZWZhdWx0Q29uZmlnLm1hcmssXG4gICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgIH0sXG4gICAgICBiYXI6IHtcbiAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICAuLi5kZWZhdWx0Q29uZmlnLmJhclxuICAgICAgfSxcbiAgICAgIHZpZXc6IHtcbiAgICAgICAgZmlsbDogJyNlZWUnXG4gICAgICB9LFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCdcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGNvcHkgPSBkdXBsaWNhdGUoY29uZmlnKTtcbiAgICBjb25zdCBvdXRwdXQgPSBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnKGNvbmZpZyk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYXVzZSBzaWRlLWVmZmVjdCB0byB0aGUgaW5wdXQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbmZpZywgY29weSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBWTCBvbmx5IG1hcmsgY29uZmlnIGJ1dCBrZWVwIFZlZ2EgbWFyayBjb25maWcnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0Lm1hcmsuY29sb3IpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG91dHB1dC5tYXJrLm9wYWNpdHksIDAuMyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IG1hcmsgY29uZmlnIHRvIHN0eWxlIGFuZCByZW1vdmUgVkwgb25seSBtYXJrLXNwZWNpZmljIGNvbmZpZycsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgbWFyayBvZiBQUklNSVRJVkVfTUFSS1MpIHtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dFttYXJrXSwgYCR7bWFya30gY29uZmlnIHNob3VsZCBiZSByZWRpcmVjdGVkYCk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0LnN0eWxlLmJhclsnYmluU3BhY2luZyddLCBgVkwgb25seSBCYXIgY29uZmlnIHNob3VsZCBiZSByZW1vdmVkYCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0LnN0eWxlLmNlbGxbJ3dpZHRoJ10sIGBWTCBvbmx5IGNlbGwgY29uZmlnIHNob3VsZCBiZSByZW1vdmVkYCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0LnN0eWxlLmNlbGxbJ2hlaWdodCddLCBgVkwgb25seSBjZWxsIGNvbmZpZyBzaG91bGQgYmUgcmVtb3ZlZGApO1xuICAgICAgYXNzZXJ0LmVxdWFsKG91dHB1dC5zdHlsZS5jZWxsWydmaWxsJ10sICcjZWVlJywgYGNvbmZpZy52aWV3IHNob3VsZCBiZSByZWRpcmVjdCB0byBjb25maWcuc3R5bGUuY2VsbGApO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dC5zdHlsZS5iYXIub3BhY2l0eSwgMC41LCAnQmFyIGNvbmZpZyBzaG91bGQgYmUgcmVkaXJlY3RlZCB0byBjb25maWcuc3R5bGUuYmFyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IGNvbmZpZy50aXRsZSB0byBjb25maWcuc3R5bGUuZ3JvdXAtdGl0bGUgYW5kIHJlbmFtZSBjb2xvciB0byBmaWxsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQudGl0bGUsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dC5zdHlsZVsnZ3JvdXAtdGl0bGUnXS5mb250V2VpZ2h0LCAnYm9sZCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQuc3R5bGVbJ2dyb3VwLXRpdGxlJ10uZmlsbCwgJ3JlZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgZW1wdHkgY29uZmlnIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXQuYXhpc1RvcCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=