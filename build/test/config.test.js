"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var config_1 = require("../src/config");
var mark_1 = require("../src/mark");
var util_1 = require("../src/util");
describe('config', function () {
    describe('stripAndRedirectConfig', function () {
        var config = tslib_1.__assign({}, config_1.defaultConfig, { mark: tslib_1.__assign({}, config_1.defaultConfig.mark, { opacity: 0.3 }), bar: tslib_1.__assign({ opacity: 0.5 }, config_1.defaultConfig.bar), view: {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2NvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZCQUE0QjtBQUM1Qix3Q0FBNEU7QUFDNUUsb0NBQTRDO0FBQzVDLG9DQUFzQztBQUV0QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtRQUNqQyxJQUFNLE1BQU0sd0JBQ1Asc0JBQWEsSUFDaEIsSUFBSSx1QkFDQyxzQkFBYSxDQUFDLElBQUksSUFDckIsT0FBTyxFQUFFLEdBQUcsS0FFZCxHQUFHLHFCQUNELE9BQU8sRUFBRSxHQUFHLElBQ1Qsc0JBQWEsQ0FBQyxHQUFHLEdBRXRCLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsTUFBTTthQUNiLEVBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxLQUFLO2dCQUNaLFVBQVUsRUFBRSxNQUFNO2FBQ25CLEdBQ0YsQ0FBQztRQUNGLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBTSxNQUFNLEdBQUcsK0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUMsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QyxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhFQUE4RSxFQUFFO1lBQ2pGLEtBQW1CLFVBQWUsRUFBZixvQkFBQSxzQkFBZSxFQUFmLDZCQUFlLEVBQWYsSUFBZTtnQkFBN0IsSUFBTSxJQUFJLHdCQUFBO2dCQUNiLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFLLElBQUksaUNBQThCLENBQUMsQ0FBQzthQUN6RTtZQUNELGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztZQUMzRixhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7WUFDeEYsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3pGLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLHFEQUFxRCxDQUFDLENBQUM7WUFFdkcsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLHFEQUFxRCxDQUFDLENBQUM7UUFDekcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUZBQW1GLEVBQUU7WUFDdEYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtZQUN0QyxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q29uZmlnLCBkZWZhdWx0Q29uZmlnLCBzdHJpcEFuZFJlZGlyZWN0Q29uZmlnfSBmcm9tICcuLi9zcmMvY29uZmlnJztcbmltcG9ydCB7UFJJTUlUSVZFX01BUktTfSBmcm9tICcuLi9zcmMvbWFyayc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vc3JjL3V0aWwnO1xuXG5kZXNjcmliZSgnY29uZmlnJywgKCkgPT4ge1xuICBkZXNjcmliZSgnc3RyaXBBbmRSZWRpcmVjdENvbmZpZycsICgpID0+IHtcbiAgICBjb25zdCBjb25maWc6IENvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICBtYXJrOiB7XG4gICAgICAgIC4uLmRlZmF1bHRDb25maWcubWFyayxcbiAgICAgICAgb3BhY2l0eTogMC4zLFxuICAgICAgfSxcbiAgICAgIGJhcjoge1xuICAgICAgICBvcGFjaXR5OiAwLjUsXG4gICAgICAgIC4uLmRlZmF1bHRDb25maWcuYmFyXG4gICAgICB9LFxuICAgICAgdmlldzoge1xuICAgICAgICBmaWxsOiAnI2VlZSdcbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJ1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgY29weSA9IGR1cGxpY2F0ZShjb25maWcpO1xuICAgIGNvbnN0IG91dHB1dCA9IHN0cmlwQW5kUmVkaXJlY3RDb25maWcoY29uZmlnKTtcblxuICAgIGl0KCdzaG91bGQgbm90IGNhdXNlIHNpZGUtZWZmZWN0IHRvIHRoZSBpbnB1dCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29uZmlnLCBjb3B5KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIFZMIG9ubHkgbWFyayBjb25maWcgYnV0IGtlZXAgVmVnYSBtYXJrIGNvbmZpZycsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXQubWFyay5jb2xvcik7XG4gICAgICBhc3NlcnQuZXF1YWwob3V0cHV0Lm1hcmsub3BhY2l0eSwgMC4zKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVkaXJlY3QgbWFyayBjb25maWcgdG8gc3R5bGUgYW5kIHJlbW92ZSBWTCBvbmx5IG1hcmstc3BlY2lmaWMgY29uZmlnJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBtYXJrIG9mIFBSSU1JVElWRV9NQVJLUykge1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQob3V0cHV0W21hcmtdLCBgJHttYXJrfSBjb25maWcgc2hvdWxkIGJlIHJlZGlyZWN0ZWRgKTtcbiAgICAgIH1cbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXQuc3R5bGUuYmFyWydiaW5TcGFjaW5nJ10sIGBWTCBvbmx5IEJhciBjb25maWcgc2hvdWxkIGJlIHJlbW92ZWRgKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXQuc3R5bGUuY2VsbFsnd2lkdGgnXSwgYFZMIG9ubHkgY2VsbCBjb25maWcgc2hvdWxkIGJlIHJlbW92ZWRgKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChvdXRwdXQuc3R5bGUuY2VsbFsnaGVpZ2h0J10sIGBWTCBvbmx5IGNlbGwgY29uZmlnIHNob3VsZCBiZSByZW1vdmVkYCk7XG4gICAgICBhc3NlcnQuZXF1YWwob3V0cHV0LnN0eWxlLmNlbGxbJ2ZpbGwnXSwgJyNlZWUnLCBgY29uZmlnLnZpZXcgc2hvdWxkIGJlIHJlZGlyZWN0IHRvIGNvbmZpZy5zdHlsZS5jZWxsYCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LnN0eWxlLmJhci5vcGFjaXR5LCAwLjUsICdCYXIgY29uZmlnIHNob3VsZCBiZSByZWRpcmVjdGVkIHRvIGNvbmZpZy5zdHlsZS5iYXInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVkaXJlY3QgY29uZmlnLnRpdGxlIHRvIGNvbmZpZy5zdHlsZS5ncm91cC10aXRsZSBhbmQgcmVuYW1lIGNvbG9yIHRvIGZpbGwnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dC50aXRsZSwgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LnN0eWxlWydncm91cC10aXRsZSddLmZvbnRXZWlnaHQsICdib2xkJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dC5zdHlsZVsnZ3JvdXAtdGl0bGUnXS5maWxsLCAncmVkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBlbXB0eSBjb25maWcgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG91dHB1dC5heGlzVG9wKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==