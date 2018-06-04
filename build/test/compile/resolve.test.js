"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var resolve_1 = require("../../src/compile/resolve");
var log = tslib_1.__importStar(require("../../src/log"));
var util_1 = require("../util");
describe('compile/resolve', function () {
    describe('defaultScaleResolve', function () {
        it('shares scales for layer model by default.', function () {
            var model = util_1.parseLayerModel({
                layer: []
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'shared');
        });
        it('shares scales for facet model by default.', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'nominal' }
                },
                spec: { mark: 'point', encoding: {} }
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'shared');
        });
        it('separates xy scales for concat model by default.', function () {
            var model = util_1.parseConcatModel({
                hconcat: []
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'independent');
        });
        it('shares non-xy scales for concat model by default.', function () {
            var model = util_1.parseConcatModel({
                hconcat: []
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('color', model), 'shared');
        });
        it('separates xy scales for repeat model by default.', function () {
            var model = util_1.parseRepeatModel({
                repeat: {
                    row: ['a', 'b']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        color: { field: 'color', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'independent');
        });
        it('shares non-xy scales for repeat model by default.', function () {
            var model = util_1.parseRepeatModel({
                repeat: {
                    row: ['a', 'b']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        color: { field: 'color', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('color', model), 'shared');
        });
    });
    describe('parseGuideResolve', function () {
        it('shares axis for a shared scale by default', function () {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'shared' },
                axis: {}
            }, 'x');
            chai_1.assert.equal(axisResolve, 'shared');
        });
        it('separates axis for a shared scale if specified', function () {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'shared' },
                axis: { x: 'independent' }
            }, 'x');
            chai_1.assert.equal(axisResolve, 'independent');
        });
        it('separates legend for a shared scale if specified', function () {
            var legendResolve = resolve_1.parseGuideResolve({
                scale: { color: 'shared' },
                legend: { color: 'independent' }
            }, 'color');
            chai_1.assert.equal(legendResolve, 'independent');
        });
        it('separates axis for an independent scale by default', function () {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'independent' },
                axis: {}
            }, 'x');
            chai_1.assert.equal(axisResolve, 'independent');
        });
        it('separates axis for an independent scale even "shared" is specified and throw warning', log.wrap(function (localLogger) {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'independent' },
                axis: { x: 'shared' }
            }, 'x');
            chai_1.assert.equal(axisResolve, 'independent');
            chai_1.assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('x'));
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL3Jlc29sdmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFDNUIscURBQWlGO0FBQ2pGLHlEQUFxQztBQUNyQyxnQ0FBNkY7QUFFN0YsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsS0FBSyxFQUFFLEVBQUU7YUFDVixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLDZCQUFtQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNuQztnQkFDRCxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBbUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDckQsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxFQUFFO2FBQ1osQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBbUIsQ0FBQyxHQUFHLEVBQUUsS0FB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LE9BQU8sQ0FBQyxDQUFDO1lBQ1osYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsSUFBTSxXQUFXLEdBQUcsMkJBQWlCLENBQUM7Z0JBQ3BDLEtBQUssRUFBRSxFQUFDLENBQUMsRUFBRSxhQUFhLEVBQUM7Z0JBQ3pCLElBQUksRUFBRSxFQUFFO2FBQ1QsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNGQUFzRixFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQzlHLElBQU0sV0FBVyxHQUFHLDJCQUFpQixDQUFDO2dCQUNwQyxLQUFLLEVBQUUsRUFBQyxDQUFDLEVBQUUsYUFBYSxFQUFDO2dCQUN6QixJQUFJLEVBQUUsRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDO2FBQ3BCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDUixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUN6QyxhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdGLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtkZWZhdWx0U2NhbGVSZXNvbHZlLCBwYXJzZUd1aWRlUmVzb2x2ZX0gZnJvbSAnLi4vLi4vc3JjL2NvbXBpbGUvcmVzb2x2ZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge3BhcnNlQ29uY2F0TW9kZWwsIHBhcnNlRmFjZXRNb2RlbCwgcGFyc2VMYXllck1vZGVsLCBwYXJzZVJlcGVhdE1vZGVsfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvcmVzb2x2ZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2RlZmF1bHRTY2FsZVJlc29sdmUnLCAoKSA9PiB7XG4gICAgaXQoJ3NoYXJlcyBzY2FsZXMgZm9yIGxheWVyIG1vZGVsIGJ5IGRlZmF1bHQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBsYXllcjogW11cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRTY2FsZVJlc29sdmUoJ3gnLCBtb2RlbCksICdzaGFyZWQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaGFyZXMgc2NhbGVzIGZvciBmYWNldCBtb2RlbCBieSBkZWZhdWx0LicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHttYXJrOiAncG9pbnQnLCBlbmNvZGluZzoge319XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWZhdWx0U2NhbGVSZXNvbHZlKCd4JywgbW9kZWwpLCAnc2hhcmVkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2VwYXJhdGVzIHh5IHNjYWxlcyBmb3IgY29uY2F0IG1vZGVsIGJ5IGRlZmF1bHQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgICAgaGNvbmNhdDogW11cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRTY2FsZVJlc29sdmUoJ3gnLCBtb2RlbCksICdpbmRlcGVuZGVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NoYXJlcyBub24teHkgc2NhbGVzIGZvciBjb25jYXQgbW9kZWwgYnkgZGVmYXVsdC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlQ29uY2F0TW9kZWwoe1xuICAgICAgICBoY29uY2F0OiBbXVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmYXVsdFNjYWxlUmVzb2x2ZSgnY29sb3InLCBtb2RlbCksICdzaGFyZWQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzZXBhcmF0ZXMgeHkgc2NhbGVzIGZvciByZXBlYXQgbW9kZWwgYnkgZGVmYXVsdC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlUmVwZWF0TW9kZWwoe1xuICAgICAgICByZXBlYXQ6IHtcbiAgICAgICAgICByb3c6IFsnYScsICdiJ11cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnY29sb3InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRTY2FsZVJlc29sdmUoJ3gnLCBtb2RlbCksICdpbmRlcGVuZGVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NoYXJlcyBub24teHkgc2NhbGVzIGZvciByZXBlYXQgbW9kZWwgYnkgZGVmYXVsdC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlUmVwZWF0TW9kZWwoe1xuICAgICAgICByZXBlYXQ6IHtcbiAgICAgICAgICByb3c6IFsnYScsICdiJ11cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnY29sb3InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZmF1bHRTY2FsZVJlc29sdmUoJ2NvbG9yJywgbW9kZWwpLCAnc2hhcmVkJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUd1aWRlUmVzb2x2ZScsICgpID0+IHtcbiAgICBpdCgnc2hhcmVzIGF4aXMgZm9yIGEgc2hhcmVkIHNjYWxlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzUmVzb2x2ZSA9IHBhcnNlR3VpZGVSZXNvbHZlKHtcbiAgICAgICAgc2NhbGU6IHt4OiAnc2hhcmVkJ30sXG4gICAgICAgIGF4aXM6IHt9XG4gICAgICB9LCAneCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNSZXNvbHZlLCAnc2hhcmVkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2VwYXJhdGVzIGF4aXMgZm9yIGEgc2hhcmVkIHNjYWxlIGlmIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNSZXNvbHZlID0gcGFyc2VHdWlkZVJlc29sdmUoe1xuICAgICAgICBzY2FsZToge3g6ICdzaGFyZWQnfSxcbiAgICAgICAgYXhpczoge3g6ICdpbmRlcGVuZGVudCd9XG4gICAgICB9LCAneCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNSZXNvbHZlLCAnaW5kZXBlbmRlbnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzZXBhcmF0ZXMgbGVnZW5kIGZvciBhIHNoYXJlZCBzY2FsZSBpZiBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsZWdlbmRSZXNvbHZlID0gcGFyc2VHdWlkZVJlc29sdmUoe1xuICAgICAgICBzY2FsZToge2NvbG9yOiAnc2hhcmVkJ30sXG4gICAgICAgIGxlZ2VuZDoge2NvbG9yOiAnaW5kZXBlbmRlbnQnfVxuICAgICAgfSwgJ2NvbG9yJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobGVnZW5kUmVzb2x2ZSwgJ2luZGVwZW5kZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2VwYXJhdGVzIGF4aXMgZm9yIGFuIGluZGVwZW5kZW50IHNjYWxlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzUmVzb2x2ZSA9IHBhcnNlR3VpZGVSZXNvbHZlKHtcbiAgICAgICAgc2NhbGU6IHt4OiAnaW5kZXBlbmRlbnQnfSxcbiAgICAgICAgYXhpczoge31cbiAgICAgIH0sICd4Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc1Jlc29sdmUsICdpbmRlcGVuZGVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NlcGFyYXRlcyBheGlzIGZvciBhbiBpbmRlcGVuZGVudCBzY2FsZSBldmVuIFwic2hhcmVkXCIgaXMgc3BlY2lmaWVkIGFuZCB0aHJvdyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBheGlzUmVzb2x2ZSA9IHBhcnNlR3VpZGVSZXNvbHZlKHtcbiAgICAgICAgc2NhbGU6IHt4OiAnaW5kZXBlbmRlbnQnfSxcbiAgICAgICAgYXhpczoge3g6ICdzaGFyZWQnfVxuICAgICAgfSwgJ3gnKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzUmVzb2x2ZSwgJ2luZGVwZW5kZW50Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmluZGVwZW5kZW50U2NhbGVNZWFuc0luZGVwZW5kZW50R3VpZGUoJ3gnKSk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIl19