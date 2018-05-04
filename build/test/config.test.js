"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var config_1 = require("../src/config");
var mark_1 = require("../src/mark");
var util_1 = require("../src/util");
describe('config', function () {
    describe('stripAndRedirectConfig', function () {
        var config = __assign({}, config_1.defaultConfig, { mark: __assign({}, config_1.defaultConfig.mark, { opacity: 0.3 }), bar: __assign({ opacity: 0.5 }, config_1.defaultConfig.bar), view: {
                fill: '#eee'
            }, title: {
                color: 'red',
                fontWeight: 'bold'
            }, boxplot: {
                whisker: {
                    fill: 'red'
                },
                median: {
                    color: 'white'
                }
            } });
        var copy = util_1.duplicate(config);
        var output = config_1.stripAndRedirectConfig(config);
        it('should not cause side-effect to the input', function () {
            chai_1.assert.deepEqual(config, copy);
        });
        it('should remove VL only mark config but keep Vega mark config', function () {
            chai_1.assert.isUndefined(output.mark.color);
            chai_1.assert.equal(output.mark.opacity, 0.3);
        });
        it('should redirect mark config to style and remove VL only mark-specific config', function () {
            for (var _i = 0, PRIMITIVE_MARKS_1 = mark_1.PRIMITIVE_MARKS; _i < PRIMITIVE_MARKS_1.length; _i++) {
                var mark = PRIMITIVE_MARKS_1[_i];
                chai_1.assert.isUndefined(output[mark], mark + " config should be redirected");
            }
            chai_1.assert.isUndefined(output.style.bar['binSpacing'], "VL only Bar config should be removed");
            chai_1.assert.isUndefined(output.style.cell['width'], "VL only cell config should be removed");
            chai_1.assert.isUndefined(output.style.cell['height'], "VL only cell config should be removed");
            chai_1.assert.equal(output.style.cell['fill'], '#eee', "config.view should be redirect to config.style.cell");
            chai_1.assert.deepEqual(output.style.bar.opacity, 0.5, 'Bar config should be redirected to config.style.bar');
        });
        it('should redirect composite mark parts to style and exclude vl-specific config like color', function () {
            chai_1.assert.deepEqual(output.style['boxplot-whisker'], { fill: 'red' }, "config.boxplot.whisker should be redirect to config.style['boxplot-whisker]");
            chai_1.assert.isUndefined(output.boxplot, "Boxplot config should be redirected");
            chai_1.assert.isUndefined(output.style['boxplot-median'], "Boxplot median tick's color config should be stripped");
        });
        it('should redirect config.title to config.style.group-title and rename color to fill', function () {
            chai_1.assert.deepEqual(output.title, undefined);
            chai_1.assert.deepEqual(output.style['group-title'].fontWeight, 'bold');
            chai_1.assert.deepEqual(output.style['group-title'].fill, 'red');
        });
        it('should remove empty config object', function () {
            chai_1.assert.isUndefined(output.axisTop);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2NvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2QkFBNEI7QUFDNUIsd0NBQTRFO0FBQzVFLG9DQUE0QztBQUM1QyxvQ0FBc0M7QUFFdEMsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakMsSUFBTSxNQUFNLGdCQUNQLHNCQUFhLElBQ2hCLElBQUksZUFDQyxzQkFBYSxDQUFDLElBQUksSUFDckIsT0FBTyxFQUFFLEdBQUcsS0FFZCxHQUFHLGFBQ0QsT0FBTyxFQUFFLEdBQUcsSUFDVCxzQkFBYSxDQUFDLEdBQUcsR0FFdEIsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxNQUFNO2FBQ2IsRUFDRCxLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osVUFBVSxFQUFFLE1BQU07YUFDbkIsRUFDRCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxLQUFLO2lCQUNaO2dCQUNELE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsT0FBTztpQkFDZjthQUNGLEdBQ0YsQ0FBQztRQUNGLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBTSxNQUFNLEdBQUcsK0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUMsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QyxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhFQUE4RSxFQUFFO1lBQ2pGLEtBQW1CLFVBQWUsRUFBZixvQkFBQSxzQkFBZSxFQUFmLDZCQUFlLEVBQWYsSUFBZTtnQkFBN0IsSUFBTSxJQUFJLHdCQUFBO2dCQUNiLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFLLElBQUksaUNBQThCLENBQUMsQ0FBQzthQUN6RTtZQUNELGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztZQUMzRixhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7WUFDeEYsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3pGLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLHFEQUFxRCxDQUFDLENBQUM7WUFFdkcsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLHFEQUFxRCxDQUFDLENBQUM7UUFDekcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUZBQXlGLEVBQUU7WUFDNUYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLEVBQUUsNkVBQTZFLENBQUMsQ0FBQztZQUVoSixhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUscUNBQXFDLENBQUMsQ0FBQztZQUMxRSxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsRUFBRSx1REFBdUQsQ0FBQyxDQUFDO1FBQzlHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1GQUFtRixFQUFFO1lBQ3RGLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pFLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NvbmZpZywgZGVmYXVsdENvbmZpZywgc3RyaXBBbmRSZWRpcmVjdENvbmZpZ30gZnJvbSAnLi4vc3JjL2NvbmZpZyc7XG5pbXBvcnQge1BSSU1JVElWRV9NQVJLU30gZnJvbSAnLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uL3NyYy91dGlsJztcblxuZGVzY3JpYmUoJ2NvbmZpZycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3N0cmlwQW5kUmVkaXJlY3RDb25maWcnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uZmlnOiBDb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgbWFyazoge1xuICAgICAgICAuLi5kZWZhdWx0Q29uZmlnLm1hcmssXG4gICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgIH0sXG4gICAgICBiYXI6IHtcbiAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICAuLi5kZWZhdWx0Q29uZmlnLmJhclxuICAgICAgfSxcbiAgICAgIHZpZXc6IHtcbiAgICAgICAgZmlsbDogJyNlZWUnXG4gICAgICB9LFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCdcbiAgICAgIH0sXG4gICAgICBib3hwbG90OiB7XG4gICAgICAgIHdoaXNrZXI6IHtcbiAgICAgICAgICBmaWxsOiAncmVkJ1xuICAgICAgICB9LFxuICAgICAgICBtZWRpYW46IHtcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBjb3B5ID0gZHVwbGljYXRlKGNvbmZpZyk7XG4gICAgY29uc3Qgb3V0cHV0ID0gc3RyaXBBbmRSZWRpcmVjdENvbmZpZyhjb25maWcpO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2F1c2Ugc2lkZS1lZmZlY3QgdG8gdGhlIGlucHV0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb25maWcsIGNvcHkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgVkwgb25seSBtYXJrIGNvbmZpZyBidXQga2VlcCBWZWdhIG1hcmsgY29uZmlnJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5tYXJrLmNvbG9yKTtcbiAgICAgIGFzc2VydC5lcXVhbChvdXRwdXQubWFyay5vcGFjaXR5LCAwLjMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBtYXJrIGNvbmZpZyB0byBzdHlsZSBhbmQgcmVtb3ZlIFZMIG9ubHkgbWFyay1zcGVjaWZpYyBjb25maWcnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hcmsgb2YgUFJJTUlUSVZFX01BUktTKSB7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXRbbWFya10sIGAke21hcmt9IGNvbmZpZyBzaG91bGQgYmUgcmVkaXJlY3RlZGApO1xuICAgICAgfVxuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZS5iYXJbJ2JpblNwYWNpbmcnXSwgYFZMIG9ubHkgQmFyIGNvbmZpZyBzaG91bGQgYmUgcmVtb3ZlZGApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZS5jZWxsWyd3aWR0aCddLCBgVkwgb25seSBjZWxsIGNvbmZpZyBzaG91bGQgYmUgcmVtb3ZlZGApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZS5jZWxsWydoZWlnaHQnXSwgYFZMIG9ubHkgY2VsbCBjb25maWcgc2hvdWxkIGJlIHJlbW92ZWRgKTtcbiAgICAgIGFzc2VydC5lcXVhbChvdXRwdXQuc3R5bGUuY2VsbFsnZmlsbCddLCAnI2VlZScsIGBjb25maWcudmlldyBzaG91bGQgYmUgcmVkaXJlY3QgdG8gY29uZmlnLnN0eWxlLmNlbGxgKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQuc3R5bGUuYmFyLm9wYWNpdHksIDAuNSwgJ0JhciBjb25maWcgc2hvdWxkIGJlIHJlZGlyZWN0ZWQgdG8gY29uZmlnLnN0eWxlLmJhcicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBjb21wb3NpdGUgbWFyayBwYXJ0cyB0byBzdHlsZSBhbmQgZXhjbHVkZSB2bC1zcGVjaWZpYyBjb25maWcgbGlrZSBjb2xvcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LnN0eWxlWydib3hwbG90LXdoaXNrZXInXSwge2ZpbGw6ICdyZWQnfSwgYGNvbmZpZy5ib3hwbG90LndoaXNrZXIgc2hvdWxkIGJlIHJlZGlyZWN0IHRvIGNvbmZpZy5zdHlsZVsnYm94cGxvdC13aGlza2VyXWApO1xuXG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0LmJveHBsb3QsIGBCb3hwbG90IGNvbmZpZyBzaG91bGQgYmUgcmVkaXJlY3RlZGApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZVsnYm94cGxvdC1tZWRpYW4nXSwgYEJveHBsb3QgbWVkaWFuIHRpY2sncyBjb2xvciBjb25maWcgc2hvdWxkIGJlIHN0cmlwcGVkYCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IGNvbmZpZy50aXRsZSB0byBjb25maWcuc3R5bGUuZ3JvdXAtdGl0bGUgYW5kIHJlbmFtZSBjb2xvciB0byBmaWxsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQudGl0bGUsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dC5zdHlsZVsnZ3JvdXAtdGl0bGUnXS5mb250V2VpZ2h0LCAnYm9sZCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQuc3R5bGVbJ2dyb3VwLXRpdGxlJ10uZmlsbCwgJ3JlZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgZW1wdHkgY29uZmlnIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXQuYXhpc1RvcCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=