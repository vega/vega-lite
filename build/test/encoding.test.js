"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var encoding_1 = require("../src/encoding");
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
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZW5jb2RpbmcudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1Qiw0Q0FBa0Q7QUFFbEQsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNmLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxRQUFRLEdBQUcsNEJBQWlCLENBQUM7Z0JBQ2pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQztnQkFDbEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNqQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7Z0JBQ3BDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzthQUNwQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRVgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLFNBQVMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDN0MsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUM1QyxVQUFVLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQy9DLFNBQVMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzthQUMvQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge25vcm1hbGl6ZUVuY29kaW5nfSBmcm9tICcuLi9zcmMvZW5jb2RpbmcnO1xuXG5kZXNjcmliZSgnYXhpcycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ25vcm1hbGl6ZUVuY29kaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29udmVydCBsYXQgYW5kIGxvbmcgdHlwZSB0byBjaGFubmVscycsICgpID0+IHtcbiAgICAgIGNvbnN0IGVuY29kaW5nID0gbm9ybWFsaXplRW5jb2Rpbmcoe1xuICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ2xvbmdpdHVkZSd9LFxuICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ2xhdGl0dWRlJ30sXG4gICAgICAgIHgyOiB7ZmllbGQ6ICdhMicsIHR5cGU6ICdsb25naXR1ZGUnfSxcbiAgICAgICAgeTI6IHtmaWVsZDogJ2IyJywgdHlwZTogJ2xhdGl0dWRlJ31cbiAgICAgIH0sICdydWxlJyk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZW5jb2RpbmcsIHtcbiAgICAgICAgbG9uZ2l0dWRlOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICBsYXRpdHVkZToge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgbG9uZ2l0dWRlMjoge2ZpZWxkOiAnYTInLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgIGxhdGl0dWRlMjoge2ZpZWxkOiAnYjInLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19