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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2NvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw2QkFBNEI7QUFDNUIsd0NBQTRFO0FBQzVFLG9DQUE0QztBQUM1QyxvQ0FBc0M7QUFFdEMsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakMsSUFBTSxNQUFNLGdCQUNQLHNCQUFhLElBQ2hCLElBQUksZUFDQyxzQkFBYSxDQUFDLElBQUksSUFDckIsT0FBTyxFQUFFLEdBQUcsS0FFZCxHQUFHLGFBQ0QsT0FBTyxFQUFFLEdBQUcsSUFDVCxzQkFBYSxDQUFDLEdBQUcsR0FFdEIsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxNQUFNO2FBQ2IsRUFDRCxLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osVUFBVSxFQUFFLE1BQU07YUFDbkIsR0FDRixDQUFDO1FBQ0YsSUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixJQUFNLE1BQU0sR0FBRywrQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDaEUsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEVBQThFLEVBQUU7WUFDakYsR0FBRyxDQUFDLENBQWUsVUFBZSxFQUFmLG9CQUFBLHNCQUFlLEVBQWYsNkJBQWUsRUFBZixJQUFlO2dCQUE3QixJQUFNLElBQUksd0JBQUE7Z0JBQ2IsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUssSUFBSSxpQ0FBOEIsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0QsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO1lBQzNGLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztZQUN4RixhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7WUFDekYsYUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUscURBQXFELENBQUMsQ0FBQztZQUV2RyxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUscURBQXFELENBQUMsQ0FBQztRQUN6RyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRkFBbUYsRUFBRTtZQUN0RixhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRSxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDb25maWcsIGRlZmF1bHRDb25maWcsIHN0cmlwQW5kUmVkaXJlY3RDb25maWd9IGZyb20gJy4uL3NyYy9jb25maWcnO1xuaW1wb3J0IHtQUklNSVRJVkVfTUFSS1N9IGZyb20gJy4uL3NyYy9tYXJrJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuLi9zcmMvdXRpbCc7XG5cbmRlc2NyaWJlKCdjb25maWcnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdzdHJpcEFuZFJlZGlyZWN0Q29uZmlnJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbmZpZzogQ29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIG1hcms6IHtcbiAgICAgICAgLi4uZGVmYXVsdENvbmZpZy5tYXJrLFxuICAgICAgICBvcGFjaXR5OiAwLjMsXG4gICAgICB9LFxuICAgICAgYmFyOiB7XG4gICAgICAgIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgLi4uZGVmYXVsdENvbmZpZy5iYXJcbiAgICAgIH0sXG4gICAgICB2aWV3OiB7XG4gICAgICAgIGZpbGw6ICcjZWVlJ1xuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBjb3B5ID0gZHVwbGljYXRlKGNvbmZpZyk7XG4gICAgY29uc3Qgb3V0cHV0ID0gc3RyaXBBbmRSZWRpcmVjdENvbmZpZyhjb25maWcpO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2F1c2Ugc2lkZS1lZmZlY3QgdG8gdGhlIGlucHV0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb25maWcsIGNvcHkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgVkwgb25seSBtYXJrIGNvbmZpZyBidXQga2VlcCBWZWdhIG1hcmsgY29uZmlnJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5tYXJrLmNvbG9yKTtcbiAgICAgIGFzc2VydC5lcXVhbChvdXRwdXQubWFyay5vcGFjaXR5LCAwLjMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBtYXJrIGNvbmZpZyB0byBzdHlsZSBhbmQgcmVtb3ZlIFZMIG9ubHkgbWFyay1zcGVjaWZpYyBjb25maWcnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hcmsgb2YgUFJJTUlUSVZFX01BUktTKSB7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXRbbWFya10sIGAke21hcmt9IGNvbmZpZyBzaG91bGQgYmUgcmVkaXJlY3RlZGApO1xuICAgICAgfVxuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZS5iYXJbJ2JpblNwYWNpbmcnXSwgYFZMIG9ubHkgQmFyIGNvbmZpZyBzaG91bGQgYmUgcmVtb3ZlZGApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZS5jZWxsWyd3aWR0aCddLCBgVkwgb25seSBjZWxsIGNvbmZpZyBzaG91bGQgYmUgcmVtb3ZlZGApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5zdHlsZS5jZWxsWydoZWlnaHQnXSwgYFZMIG9ubHkgY2VsbCBjb25maWcgc2hvdWxkIGJlIHJlbW92ZWRgKTtcbiAgICAgIGFzc2VydC5lcXVhbChvdXRwdXQuc3R5bGUuY2VsbFsnZmlsbCddLCAnI2VlZScsIGBjb25maWcudmlldyBzaG91bGQgYmUgcmVkaXJlY3QgdG8gY29uZmlnLnN0eWxlLmNlbGxgKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQuc3R5bGUuYmFyLm9wYWNpdHksIDAuNSwgJ0JhciBjb25maWcgc2hvdWxkIGJlIHJlZGlyZWN0ZWQgdG8gY29uZmlnLnN0eWxlLmJhcicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBjb25maWcudGl0bGUgdG8gY29uZmlnLnN0eWxlLmdyb3VwLXRpdGxlIGFuZCByZW5hbWUgY29sb3IgdG8gZmlsbCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LnRpdGxlLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQuc3R5bGVbJ2dyb3VwLXRpdGxlJ10uZm9udFdlaWdodCwgJ2JvbGQnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LnN0eWxlWydncm91cC10aXRsZSddLmZpbGwsICdyZWQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIGVtcHR5IGNvbmZpZyBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0LmF4aXNUb3ApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19