"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var encoding_1 = require("../src/encoding");
var log = tslib_1.__importStar(require("../src/log"));
describe('axis', function () {
    describe('normalizeEncoding', function () {
        it('should convert lat and long type to channels', function () {
            var encoding = encoding_1.normalizeEncoding({
                x: { field: 'a', type: 'longitude' },
                y: { field: 'b', type: 'latitude' },
                x2: { field: 'a2', type: 'longitude' },
                y2: { field: 'b2', type: 'latitude' }
            }, 'rule');
            chai_1.assert.deepEqual(encoding, {
                longitude: { field: 'a', type: 'quantitative' },
                latitude: { field: 'b', type: 'quantitative' },
                longitude2: { field: 'a2', type: 'quantitative' },
                latitude2: { field: 'b2', type: 'quantitative' }
            });
        });
        it('should drop color channel if fill is specified', log.wrap(function (logger) {
            var encoding = encoding_1.normalizeEncoding({
                color: { field: 'a', type: 'quantitative' },
                fill: { field: 'b', type: 'quantitative' }
            }, 'rule');
            chai_1.assert.deepEqual(encoding, {
                fill: { field: 'b', type: 'quantitative' }
            });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('should drop color channel if stroke is specified', log.wrap(function (logger) {
            var encoding = encoding_1.normalizeEncoding({
                color: { field: 'a', type: 'quantitative' },
                stroke: { field: 'b', type: 'quantitative' }
            }, 'rule');
            chai_1.assert.deepEqual(encoding, {
                stroke: { field: 'b', type: 'quantitative' }
            });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('encoding', { stroke: true }));
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZW5jb2RpbmcudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFDNUIsNENBQWtEO0FBQ2xELHNEQUFrQztBQUVsQyxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLFFBQVEsR0FBRyw0QkFBaUIsQ0FBQztnQkFDakMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFDO2dCQUNsQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7Z0JBQ2pDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQztnQkFDcEMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2FBQ3BDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFWCxhQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtnQkFDekIsU0FBUyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUM3QyxRQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQzVDLFVBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDL0MsU0FBUyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2FBQy9DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO1lBQ25FLElBQU0sUUFBUSxHQUFHLDRCQUFpQixDQUFDO2dCQUNqQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3pDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzthQUN6QyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRVgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzthQUN6QyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO1lBQ3JFLElBQU0sUUFBUSxHQUFHLDRCQUFpQixDQUFDO2dCQUNqQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3pDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzthQUMzQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRVgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzthQUMzQyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7bm9ybWFsaXplRW5jb2Rpbmd9IGZyb20gJy4uL3NyYy9lbmNvZGluZyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vc3JjL2xvZyc7XG5cbmRlc2NyaWJlKCdheGlzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbm9ybWFsaXplRW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGxhdCBhbmQgbG9uZyB0eXBlIHRvIGNoYW5uZWxzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZW5jb2RpbmcgPSBub3JtYWxpemVFbmNvZGluZyh7XG4gICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbG9uZ2l0dWRlJ30sXG4gICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiAnbGF0aXR1ZGUnfSxcbiAgICAgICAgeDI6IHtmaWVsZDogJ2EyJywgdHlwZTogJ2xvbmdpdHVkZSd9LFxuICAgICAgICB5Mjoge2ZpZWxkOiAnYjInLCB0eXBlOiAnbGF0aXR1ZGUnfVxuICAgICAgfSwgJ3J1bGUnKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChlbmNvZGluZywge1xuICAgICAgICBsb25naXR1ZGU6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgIGxhdGl0dWRlOiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICBsb25naXR1ZGUyOiB7ZmllbGQ6ICdhMicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgbGF0aXR1ZGUyOiB7ZmllbGQ6ICdiMicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgY29sb3IgY2hhbm5lbCBpZiBmaWxsIGlzIHNwZWNpZmllZCcsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGVuY29kaW5nID0gbm9ybWFsaXplRW5jb2Rpbmcoe1xuICAgICAgICBjb2xvcjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgZmlsbDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSwgJ3J1bGUnKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChlbmNvZGluZywge1xuICAgICAgICBmaWxsOiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRyb3BwaW5nQ29sb3IoJ2VuY29kaW5nJywge2ZpbGw6IHRydWV9KSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGNvbG9yIGNoYW5uZWwgaWYgc3Ryb2tlIGlzIHNwZWNpZmllZCcsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGVuY29kaW5nID0gbm9ybWFsaXplRW5jb2Rpbmcoe1xuICAgICAgICBjb2xvcjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgc3Ryb2tlOiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICB9LCAncnVsZScpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGVuY29kaW5nLCB7XG4gICAgICAgIHN0cm9rZToge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kcm9wcGluZ0NvbG9yKCdlbmNvZGluZycsIHtzdHJva2U6IHRydWV9KSk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIl19